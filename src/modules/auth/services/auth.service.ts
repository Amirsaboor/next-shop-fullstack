import 'server-only';
import { promisify } from 'node:util';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';

import { AppError } from '@/lib/errors/app-error';
import User from '@/modules/users/models/user.model';

const scrypt = promisify(scryptCallback);

type RegisterInput = {
  firstName: string;
  lastName: string;
  username: string;
  mobile: string;
  email: string;
  password: string;
};

type LoginInput = {
  identifier: string;
  password: string;
};

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;

  const storedKey = Buffer.from(key, 'hex');
  const derivedKey = (await scrypt(password, salt, storedKey.length)) as Buffer;

  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}

function normalizeMobile(mobile: string) {
  return mobile.replace(/[\s-]/g, '');
}

export async function registerUser(input: RegisterInput) {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const username = input.username.trim().toLowerCase();
  const email = input.email.trim().toLowerCase();
  const mobile = normalizeMobile(input.mobile);

  if (!firstName || !lastName) {
    throw new AppError('نام و نام خانوادگی الزامی هستند', 400);
  }

  if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
    throw new AppError('نام کاربری باید ۳ تا ۳۰ کاراکتر و شامل حروف انگلیسی یا عدد باشد', 400);
  }

  if (!/^09\d{9}$/.test(mobile)) {
    throw new AppError('شماره موبایل معتبر نیست؛ شماره را با 09 وارد کنید', 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError('آدرس ایمیل معتبر نیست', 400);
  }

  if (input.password.length < 8) {
    throw new AppError('رمز عبور باید حداقل ۸ کاراکتر باشد', 400);
  }

  if (input.password.length > 128) {
    throw new AppError('رمز عبور نمی‌تواند بیشتر از ۱۲۸ کاراکتر باشد', 400);
  }

  if (firstName.length > 60 || lastName.length > 60) {
    throw new AppError('نام و نام خانوادگی نمی‌توانند بیشتر از ۶۰ کاراکتر باشند', 400);
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }, { mobile }],
  })
    .select('_id username email mobile')
    .lean();

  if (existingUser) {
    if (existingUser.username === username)
      throw new AppError('این نام کاربری قبلاً ثبت شده است', 409);
    if (existingUser.email === email) throw new AppError('این ایمیل قبلاً ثبت شده است', 409);
    throw new AppError('این شماره موبایل قبلاً ثبت شده است', 409);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await User.create({
    firstName,
    lastName,
    username,
    mobile,
    email,
    passwordHash,
  });

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    mobile: user.mobile,
    email: user.email,
    role: user.role,
  };
}

export async function loginUser(input: LoginInput) {
  if (input.identifier.length > 254 || input.password.length > 128) {
    throw new AppError('اطلاعات ورود معتبر نیست', 400);
  }

  const identifier = input.identifier.trim().toLowerCase();

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }, { mobile: identifier }],
    isActive: true,
  }).select('+passwordHash');

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AppError('نام کاربری یا رمز عبور اشتباه است', 401);
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    mobile: user.mobile,
    email: user.email,
    role: user.role,
  };
}

export async function getPublicUserById(userId: string) {
  const user = await User.findOne({ _id: userId, isActive: true })
    .select('firstName lastName username mobile email role createdAt')
    .lean();

  if (!user) throw new AppError('حساب کاربری پیدا نشد یا غیرفعال است', 404);
  return user;
}
