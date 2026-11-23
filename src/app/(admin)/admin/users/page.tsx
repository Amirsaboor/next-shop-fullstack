'use client';

import AppIcon from '@/components/ui/AppIcon';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type User = {
  name: string;
  username: string;
  mobile: string;
  email: string;
  joined: string;
  orders: number;
  spent: string;
  role: string;
  status: string;
};
const initialUsers: User[] = [
  {
    name: 'علی رضایی',
    username: 'alirezaei',
    mobile: '0912***4821',
    email: 'ali.r@example.com',
    joined: '۱۴۰۵/۰۷/۱۲',
    orders: 8,
    spent: '۳۲,۸۵۰,۰۰۰',
    role: 'مشتری',
    status: 'فعال',
  },
  {
    name: 'سارا محمدی',
    username: 'sara.m',
    mobile: '0935***1732',
    email: 'sara.m@example.com',
    joined: '۱۴۰۵/۰۶/۲۸',
    orders: 5,
    spent: '۱۸,۴۵۰,۰۰۰',
    role: 'مشتری',
    status: 'فعال',
  },
  {
    name: 'محمد کریمی',
    username: 'm.karimi',
    mobile: '0915***9024',
    email: 'm.karimi@example.com',
    joined: '۱۴۰۵/۰۸/۰۲',
    orders: 2,
    spent: '۸,۶۰۰,۰۰۰',
    role: 'مشتری',
    status: 'فعال',
  },
  {
    name: 'نگار احمدی',
    username: 'negar.a',
    mobile: '0990***6214',
    email: 'negar.a@example.com',
    joined: '۱۴۰۵/۰۵/۱۶',
    orders: 12,
    spent: '۶۴,۳۰۰,۰۰۰',
    role: 'مشتری',
    status: 'فعال',
  },
  {
    name: 'امیرحسین موسوی',
    username: 'amir.m',
    mobile: '0917***3188',
    email: 'amir.m@example.com',
    joined: '۱۴۰۵/۰۸/۲۰',
    orders: 0,
    spent: '۰',
    role: 'مشتری',
    status: 'مسدود',
  },
  {
    name: 'مریم حسینی',
    username: 'maryam.h',
    mobile: '0912***5540',
    email: 'maryam.h@example.com',
    joined: '۱۴۰۵/۰۴/۰۹',
    orders: 4,
    spent: '۱۴,۷۵۰,۰۰۰',
    role: 'مشتری',
    status: 'فعال',
  },
  {
    name: 'مدیر فروشگاه',
    username: 'admin',
    mobile: '0915***1100',
    email: 'admin@example.com',
    joined: '۱۴۰۵/۰۱/۰۱',
    orders: 0,
    spent: '۰',
    role: 'مدیر',
    status: 'فعال',
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('همه نقش‌ها');
  const [status, setStatus] = useState('همه وضعیت‌ها');
  const [selected, setSelected] = useState<User | null>(null);

  const filtered = useMemo(
    () =>
      initialUsers.filter((user) => {
        const matchesSearch = [user.name, user.username, user.mobile, user.email].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        );
        return (
          matchesSearch &&
          (role === 'همه نقش‌ها' || user.role === role) &&
          (status === 'همه وضعیت‌ها' || user.status === status)
        );
      }),
    [search, role, status],
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] text-[#9299a3] dark:text-white/40">
            <Link href="/admin" className="hover:text-[#ff5a1f]">
              داشبورد
            </Link>
            <span>/</span>
            <span className="text-[#ff5a1f]">کاربران</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#17191d] dark:text-white">مدیریت کاربران</h1>
          <p className="mt-2 text-xs text-[#8d949e] dark:text-white/45">
            اطلاعات مشتریان، نقش‌ها و وضعیت حساب‌های کاربری را مدیریت کنید.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-[#e8eaee] bg-white/70 px-4 text-[11px] font-semibold text-[#657080] transition hover:border-[#ffb69c] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/65"
        >
          <AppIcon name="download" size={15} /> دریافت گزارش
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: 'کل کاربران',
            value: '۱,۲۸۴',
            note: 'تمام حساب‌های ثبت‌شده',
            icon: 'user',
            tone: 'bg-[#fff0e9] text-[#ff5a1f]',
          },
          {
            label: 'کاربران فعال',
            value: '۱,۱۹۶',
            note: '۹۳٪ از کل کاربران',
            icon: 'check-circle',
            tone: 'bg-emerald-50 text-emerald-600',
          },
          {
            label: 'ثبت‌نام این ماه',
            value: '۸۶',
            note: 'کاربران جدید',
            icon: 'user',
            tone: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'حساب‌های مسدود',
            value: '۱۲',
            note: 'نیازمند بررسی',
            icon: 'slash',
            tone: 'bg-rose-50 text-rose-600',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/85 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[#9299a3] dark:text-white/45">{card.label}</p>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${card.tone}`}
              >
                <AppIcon name={card.icon} size={18} />
              </span>
            </div>
            <strong className="mt-3 block text-2xl font-extrabold tracking-tight text-[#252a31] dark:text-white">
              {card.value}
            </strong>
            <p className="mt-1 text-[9px] text-[#a0a6af] dark:text-white/35">{card.note}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-white/85 bg-white/70 p-4 shadow-[0_8px_30px_rgba(18,20,23,.045)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#252a31] dark:text-white">فهرست کاربران</h2>
            <p className="mt-1 text-[10px] text-[#9299a3] dark:text-white/40">
              جست‌وجو بر اساس نام، نام کاربری، موبایل یا ایمیل
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:flex">
            <div className="relative">
              <AppIcon name="search" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa1ad]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جست‌وجوی کاربر..."
                className="h-10 w-full rounded-xl border border-[#e8eaee] bg-white/75 pr-9 pl-3 text-[10px] outline-none transition focus:border-[#ff9b78] dark:border-white/10 dark:bg-white/[0.04] dark:text-white sm:w-60"
              />
            </div>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="h-10 rounded-xl border border-[#e8eaee] bg-white/75 px-3 text-[10px] text-[#69717d] outline-none dark:border-white/10 dark:bg-[#20242c] dark:text-white"
            >
              <option>همه نقش‌ها</option>
              <option>مشتری</option>
              <option>مدیر</option>
            </select>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 rounded-xl border border-[#e8eaee] bg-white/75 px-3 text-[10px] text-[#69717d] outline-none dark:border-white/10 dark:bg-[#20242c] dark:text-white"
            >
              <option>همه وضعیت‌ها</option>
              <option>فعال</option>
              <option>مسدود</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setRole('همه نقش‌ها');
                setStatus('همه وضعیت‌ها');
              }}
              className="h-10 rounded-xl bg-[#252a31] px-4 text-[10px] font-semibold text-white transition hover:bg-[#11151c] dark:bg-white/10 dark:hover:bg-white/15"
            >
              پاک‌سازی
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="bg-[#f7f8fa] text-[10px] text-[#9299a3] dark:bg-white/[0.035] dark:text-white/40">
                {[
                  'کاربر',
                  'نام کاربری',
                  'تاریخ عضویت',
                  'تعداد سفارش',
                  'مجموع خرید',
                  'نقش',
                  'وضعیت',
                  'جزئیات',
                ].map((label) => (
                  <th
                    key={label}
                    className="border-y border-[#edf0f3] px-4 py-3 font-semibold first:rounded-r-lg last:rounded-l-lg dark:border-white/[0.06]"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, index) => (
                <tr
                  key={user.username}
                  onClick={() => setSelected(user)}
                  className="cursor-pointer text-[11px] transition hover:bg-[#fffaf7] dark:hover:bg-white/[0.025]"
                >
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index % 3 === 0 ? 'bg-[#fff0e9] text-[#ff5a1f]' : index % 3 === 1 ? 'bg-[#eef2ff] text-[#6574c9]' : 'bg-[#eff7f5] text-[#4a9280]'}`}
                      >
                        {user.name.slice(0, 1)}
                      </span>
                      <div>
                        <p className="font-bold text-[#343a43] dark:text-white/85">{user.name}</p>
                        <p className="mt-1 text-[9px] text-[#a0a6af]">{user.mobile}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 font-mono text-[10px] text-[#7e8792] dark:border-white/[0.06] dark:text-white/45">
                    {user.username}
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 text-[10px] text-[#818995] dark:border-white/[0.06] dark:text-white/50">
                    {user.joined}
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 text-[#59616c] dark:border-white/[0.06] dark:text-white/65">
                    {user.orders} سفارش
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 font-semibold text-[#343a43] dark:border-white/[0.06] dark:text-white/75">
                    {user.spent}
                    <span className="mr-1 text-[9px] font-normal text-[#a0a6af]">تومان</span>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 dark:border-white/[0.06]">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-semibold text-slate-600 dark:bg-white/[0.07] dark:text-white/60">
                      {user.role}
                    </span>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 dark:border-white/[0.06]">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${user.status === 'فعال' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 dark:border-white/[0.06]">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelected(user);
                      }}
                      className="rounded-lg border border-[#e8eaee] px-3 py-2 text-[9px] font-semibold text-[#68717d] transition hover:border-[#ffb69c] hover:text-[#ff5a1f] dark:border-white/10 dark:text-white/60"
                    >
                      مشاهده
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-14 text-center">
              <AppIcon name="search" size={30} className="text-[#c4c9d1]" />
              <p className="mt-3 text-xs font-semibold text-[#68717d] dark:text-white/60">
                کاربری با این مشخصات پیدا نشد.
              </p>
              <p className="mt-1 text-[10px] text-[#a0a6af]">
                عبارت جست‌وجو یا فیلترها را تغییر دهید.
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-[#edf0f3] pt-4 text-[10px] text-[#9299a3] dark:border-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
          <span>نمایش {filtered.length} کاربر از ۱,۲۸۴ کاربر</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="h-8 rounded-lg border border-[#e8eaee] px-3 dark:border-white/10"
            >
              قبلی
            </button>
            <button type="button" className="h-8 w-8 rounded-lg bg-[#ff5a1f] font-bold text-white">
              ۱
            </button>
            <button
              type="button"
              className="h-8 w-8 rounded-lg border border-[#e8eaee] dark:border-white/10"
            >
              ۲
            </button>
            <button
              type="button"
              className="h-8 w-8 rounded-lg border border-[#e8eaee] dark:border-white/10"
            >
              ۳
            </button>
            <button
              type="button"
              className="h-8 rounded-lg border border-[#e8eaee] px-3 dark:border-white/10"
            >
              بعدی
            </button>
          </div>
        </div>
      </section>
      <p className="text-center text-[9px] text-[#a0a6af] dark:text-white/30">
        اطلاعات این صفحه نمونه و صرفاً جهت بررسی طراحی هستند و از سرور دریافت نمی‌شوند.
      </p>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/70 bg-[#f8f9fb] p-5 text-[#17191d] shadow-2xl dark:border-white/10 dark:bg-[#1c2028] dark:text-white sm:p-7"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#e9ebef] pb-5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e9] text-lg font-bold text-[#ff5a1f]">
                  {selected.name.slice(0, 1)}
                </span>
                <div>
                  <p className="text-[10px] text-[#9299a3]">پروفایل کاربر</p>
                  <h2 id="user-modal-title" className="mt-1 text-lg font-extrabold">
                    {selected.name}
                  </h2>
                  <p className="mt-1 text-[10px] text-[#9299a3]">@{selected.username}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="بستن"
                className="rounded-xl border border-[#e5e8ed] px-3 py-2 text-lg text-[#7d8591] hover:text-[#ff5a1f] dark:border-white/10"
              >
                ×
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ['شماره موبایل', selected.mobile],
                ['ایمیل', selected.email],
                ['تاریخ عضویت', selected.joined],
                ['نقش کاربری', selected.role],
                ['تعداد سفارش‌ها', String(selected.orders)],
                ['مجموع خرید', selected.spent + ' تومان'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white p-4 dark:bg-white/[0.045]">
                  <p className="text-[9px] text-[#9299a3]">{label}</p>
                  <p className="mt-2 break-words text-xs font-bold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-white p-4 dark:bg-white/[0.045]">
              <p className="text-[10px] font-bold">وضعیت حساب</p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold ${selected.status === 'فعال' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}
              >
                {selected.status}
              </span>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="h-10 rounded-xl bg-[#252a31] px-5 text-[11px] font-semibold text-white dark:bg-white/10"
              >
                بستن جزئیات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
