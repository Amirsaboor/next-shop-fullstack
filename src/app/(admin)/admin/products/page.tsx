import AppIcon from '@/components/ui/AppIcon';
'use client';

import Link from 'next/link';

const products = [
  {
    code: 'KB-1042',
    name: 'کیبورد مکانیکال گیمینگ',
    category: 'لوازم جانبی کامپیوتر',
    price: '۳,۸۵۰,۰۰۰',
    stock: 18,
    status: 'فعال',
    color: 'emerald',
  },
  {
    code: 'MS-2081',
    name: 'ماوس بی‌سیم ارگونومیک',
    category: 'لوازم جانبی کامپیوتر',
    price: '۱,۲۹۰,۰۰۰',
    stock: 0,
    status: 'غیرفعال',
    color: 'slate',
  },
  {
    code: 'HP-3015',
    name: 'هدفون بلوتوثی نویز کنسلینگ',
    category: 'هدفون و هدست',
    price: '۲,۷۵۰,۰۰۰',
    stock: 7,
    status: 'فعال',
    color: 'emerald',
  },
  {
    code: 'MN-4100',
    name: 'مانیتور ۲۷ اینچ IPS',
    category: 'تجهیزات کامپیوتر',
    price: '۹,۸۰۰,۰۰۰',
    stock: 4,
    status: 'فعال',
    color: 'emerald',
  },
  {
    code: 'CB-5102',
    name: 'کابل USB-C بافته‌شده',
    category: 'کابل و تبدیل',
    price: '۳۹۰,۰۰۰',
    stock: 42,
    status: 'فعال',
    color: 'emerald',
  },
  {
    code: 'SP-6020',
    name: 'اسپیکر قابل حمل',
    category: 'لوازم جانبی موبایل',
    price: '۱,۶۵۰,۰۰۰',
    stock: 2,
    status: 'غیرفعال',
    color: 'slate',
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] text-[#9299a3] dark:text-white/40">
            <Link href="/admin" className="hover:text-[#ff5a1f]">
              داشبورد
            </Link>
            <span>/</span>
            <span className="text-[#ff5a1f]">محصولات</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17191d] dark:text-white">
            مدیریت محصولات
          </h1>
          <p className="mt-2 text-xs text-[#8d949e] dark:text-white/45">
            محصولات فروشگاه را مشاهده و مدیریت کنید.
          </p>
        </div>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#ff5a1f] px-5 text-xs font-bold text-white shadow-lg shadow-[#ff5a1f]/20 transition hover:-translate-y-0.5 hover:bg-[#ed4c14]">
          <AppIcon name="plus" size={16} /> افزودن محصول
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          ['همه محصولات', '۱۲۸', 'grid'],
          ['محصولات فعال', '۱۰۶', 'check-circle'],
          ['غیرفعال', '۱۴', 'minus-circle'],
          ['ناموجود', '۸', 'package'],
        ].map(([label, value, icon], i) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/70 p-4 shadow-[0_8px_28px_rgba(18,20,23,.04)] backdrop-blur-xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-5"
          >
            <div className="absolute -left-7 -top-8 h-24 w-24 rounded-full bg-[#ff5a1f]/[0.08] blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#8d949e] dark:text-white/45">{label}</p>
                <p className="mt-2 text-2xl font-extrabold text-[#252a31] dark:text-white">
                  {value}
                </p>
              </div>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${i === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-[#fff0e9] text-[#ff5a1f]'}`}
              >
                <AppIcon name={icon} size={18} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-white/85 bg-white/70 p-4 shadow-[0_8px_30px_rgba(18,20,23,.045)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#252a31] dark:text-white">فهرست محصولات</h2>
            <p className="mt-1 text-[10px] text-[#9299a3] dark:text-white/40">
              جست‌وجو و فیلتر محصولات بر اساس مشخصات
            </p>
          </div>
          <button className="h-9 rounded-lg border border-[#e8eaee] px-3 text-[10px] font-semibold text-[#69717d] hover:border-[#ffb69c] dark:border-white/10 dark:text-white/65">
            <AppIcon name="download" size={14} /> خروجی گرفتن
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.7fr)_1fr_1fr_1fr_auto]">
          <label className="relative">
            <AppIcon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a6af]" />
            <input
              placeholder="جست‌وجوی نام یا کد محصول..."
              className="h-11 w-full rounded-xl border border-[#e8eaee] bg-white/75 pr-9 pl-3 text-[11px] outline-none placeholder:text-[#a6acb5] focus:border-[#ff9b78] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            />
          </label>
          <select className="h-11 rounded-xl border border-[#e8eaee] bg-white/75 px-3 text-[11px] text-[#69717d] outline-none dark:border-white/10 dark:bg-[#20242c] dark:text-white">
            <option>همه گروه‌ها</option>
            <option>لوازم جانبی کامپیوتر</option>
            <option>تجهیزات کامپیوتر</option>
          </select>
          <select className="h-11 rounded-xl border border-[#e8eaee] bg-white/75 px-3 text-[11px] text-[#69717d] outline-none dark:border-white/10 dark:bg-[#20242c] dark:text-white">
            <option>همه وضعیت‌ها</option>
            <option>فعال</option>
            <option>غیرفعال</option>
          </select>
          <select className="h-11 rounded-xl border border-[#e8eaee] bg-white/75 px-3 text-[11px] text-[#69717d] outline-none dark:border-white/10 dark:bg-[#20242c] dark:text-white">
            <option>همه موجودی‌ها</option>
            <option>موجود</option>
            <option>کم‌موجود</option>
            <option>ناموجود</option>
          </select>
          <button className="h-11 rounded-xl bg-[#252a31] px-4 text-[10px] font-semibold text-white transition hover:bg-[#11151c] dark:bg-white/10 dark:hover:bg-white/15">
            پاک‌سازی
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[780px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="bg-[#f7f8fa] text-[10px] text-[#9299a3] dark:bg-white/[0.035] dark:text-white/40">
                {['محصول', 'کد محصول', 'گروه', 'قیمت', 'موجودی', 'وضعیت', 'عملیات'].map((x) => (
                  <th
                    key={x}
                    className="border-y border-[#edf0f3] px-4 py-3 font-semibold first:rounded-r-lg last:rounded-l-lg dark:border-white/[0.06]"
                  >
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={p.code}
                  className="group text-[11px] transition hover:bg-[#fffaf7] dark:hover:bg-white/[0.025]"
                >
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${['bg-[#fff0e9] text-[#ff5a1f]', 'bg-[#eef2ff] text-[#6574c9]', 'bg-[#eff7f5] text-[#4a9280]'][i % 3]}`}
                      >
                        <AppIcon name={['cpu', 'headphones', 'music', 'monitor', 'link', 'volume'][i]} size={19} />
                      </div>
                      <div>
                        <p className="font-bold text-[#343a43] dark:text-white/85">{p.name}</p>
                        <p className="mt-1 text-[9px] text-[#a0a6af] dark:text-white/35">
                          محصول فیزیکی
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 font-mono text-[10px] text-[#7e8792] dark:border-white/[0.06] dark:text-white/45">
                    {p.code}
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 text-[#737c88] dark:border-white/[0.06] dark:text-white/55">
                    {p.category}
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 font-semibold text-[#343a43] dark:border-white/[0.06] dark:text-white/75">
                    {p.price}
                    <span className="mr-1 text-[9px] font-normal text-[#a0a6af]">تومان</span>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5">
                    <span
                      className={`font-semibold ${p.stock === 0 ? 'text-rose-500' : p.stock < 5 ? 'text-amber-500' : 'text-[#59616c] dark:text-white/65'}`}
                    >
                      {p.stock} عدد
                    </span>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 dark:border-white/[0.06]">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${p.status === 'فعال' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/[0.07] dark:text-white/45'}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-1">
                      <button
                        className="rounded-lg p-2 text-[#818995] hover:bg-[#fff0e9] hover:text-[#ff5a1f]"
                        title="ویرایش"
                      >
                        <AppIcon name="edit" size={16} />
                      </button>
                      <button
                        className="rounded-lg p-2 text-[#818995] hover:bg-rose-50 hover:text-rose-500"
                        title="بیشتر"
                      >
                        <AppIcon name="more" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-[#edf0f3] pt-4 text-[10px] text-[#9299a3] dark:border-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
          <span>نمایش ۱ تا ۶ از ۱۲۸ محصول</span>
          <div className="flex items-center gap-1">
            <button className="h-8 rounded-lg border border-[#e8eaee] px-3 dark:border-white/10">
              قبلی
            </button>
            <button className="h-8 w-8 rounded-lg bg-[#ff5a1f] font-bold text-white">۱</button>
            <button className="h-8 w-8 rounded-lg border border-[#e8eaee] dark:border-white/10">
              ۲
            </button>
            <button className="h-8 w-8 rounded-lg border border-[#e8eaee] dark:border-white/10">
              ۳
            </button>
            <button className="h-8 rounded-lg border border-[#e8eaee] px-3 dark:border-white/10">
              بعدی
            </button>
          </div>
        </div>
      </section>
      <p className="text-center text-[9px] text-[#a0a6af] dark:text-white/30">
        این صفحه در حال حاضر نمایشی است و اطلاعات آن نمونه هستند.
      </p>
    </div>
  );
}
