import 'server-only';

import mongoose from 'mongoose';

import { AppError } from '@/lib/errors/app-error';
import User from '@/modules/users/models/user.model';

export async function getAdminUsers(options: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: 'all' | 'active' | 'inactive';
}) {
  const page = Math.max(1, Math.floor(options.page ?? 1));
  const limit = Math.min(100, Math.max(1, Math.floor(options.limit ?? 12)));
  const filter: Record<string, unknown> = {};

  if (options.role && options.role !== 'all') filter.role = options.role;
  if (options.status === 'active') filter.isActive = true;
  if (options.status === 'inactive') filter.isActive = false;

  if (options.search?.trim()) {
    const escaped = options.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { firstName: { $regex: escaped, $options: 'i' } },
      { lastName: { $regex: escaped, $options: 'i' } },
      { username: { $regex: escaped, $options: 'i' } },
      { mobile: { $regex: escaped, $options: 'i' } },
      { email: { $regex: escaped, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .select('firstName lastName username mobile email role isActive createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page, limit, total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

export async function updateUserStatus(
  userId: string,
  isActive: boolean,
  currentAdminId: string,
  currentAdminRole: 'admin' | 'super_admin',
) {
  if (!mongoose.isObjectIdOrHexString(userId)) throw new AppError('شناسه کاربر معتبر نیست', 400);
  if (userId === currentAdminId && !isActive) {
    throw new AppError('امکان غیرفعال کردن حساب کاربری خودتان وجود ندارد', 400);
  }

  const targetUser = await User.findById(userId).select('role').lean();
  if (!targetUser) throw new AppError('کاربر موردنظر پیدا نشد', 404);
  if (!isActive && targetUser.role !== 'customer' && currentAdminRole !== 'super_admin') {
    throw new AppError('فقط مدیر ارشد می‌تواند حساب مدیران را غیرفعال کند', 403);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { isActive } },
    { new: true, runValidators: true },
  )
    .select('firstName lastName username mobile email role isActive createdAt')
    .lean();

  if (!user) throw new AppError('کاربر موردنظر پیدا نشد', 404);
  return user;
}
