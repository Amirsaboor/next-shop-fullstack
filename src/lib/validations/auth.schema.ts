import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(60),
  lastName: z.string().trim().min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد").max(60),
  username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_.-]+$/, "نام کاربری معتبر نیست"),
  mobile: z.string().trim().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  email: z.string().trim().email("آدرس ایمیل معتبر نیست").max(254),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد").max(128),
}).strict();

export const loginSchema = z.object({
  identifier: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(128),
}).strict();

export type RegisterSchemaInput = z.infer<typeof registerSchema>;
export type LoginSchemaInput = z.infer<typeof loginSchema>;
