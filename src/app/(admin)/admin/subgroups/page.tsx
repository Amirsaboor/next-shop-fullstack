import AppIcon from '@/components/ui/AppIcon';
import Link from 'next/link';

const subgroups = [
  {
    name: 'لپ‌تاپ و الترابوک',
    group: 'کامپیوتر و تجهیزات',
    slug: 'laptops',
    products: 12,
    status: 'فعال',
  },
  { name: 'مانیتور', group: 'کامپیوتر و تجهیزات', slug: 'monitors', products: 8, status: 'فعال' },
  {
    name: 'کیبورد و ماوس',
    group: 'لوازم جانبی کامپیوتر',
    slug: 'keyboard-mouse',
    products: 15,
    status: 'فعال',
  },
  {
    name: 'هدفون و هدست',
    group: 'لوازم جانبی کامپیوتر',
    slug: 'headphones',
    products: 11,
    status: 'فعال',
  },
  {
    name: 'شارژر و آداپتور',
    group: 'لوازم جانبی موبایل',
    slug: 'chargers',
    products: 9,
    status: 'غیرفعال',
  },
  {
    name: 'کابل و تبدیل',
    group: 'لوازم جانبی موبایل',
    slug: 'cables-adapters',
    products: 18,
    status: 'فعال',
  },
];

export default function SubgroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] text-[#9299a3] dark:text-white/40">
            <Link href="/admin" className="hover:text-[#ff5a1f]">
              داشبورد
            </Link>
            <span>/</span>
            <Link href="/admin/products" className="hover:text-[#ff5a1f]">
              مدیریت محصولات
            </Link>
            <span>/</span>
            <span className="text-[#ff5a1f]">زیرگروه‌ها</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#17191d] dark:text-white">
            زیرگروه‌های محصولات
          </h1>
          <p className="mt-2 text-xs text-[#8d949e] dark:text-white/45">
            زیرگروه‌ها را ایجاد و به گروه اصلی متصل کنید.
          </p>
        </div>
        <button className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-[#ff5a1f] px-5 text-xs font-bold text-white shadow-lg shadow-[#ff5a1f]/20">
          <AppIcon name="plus" size={16} /> افزودن زیرگروه
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {[
          ['کل زیرگروه‌ها', '۳۸'],
          ['زیرگروه‌های فعال', '۳۴'],
          ['بدون محصول', '۴'],
        ].map(([a, b], i) => (
          <div
            key={a}
            className="rounded-2xl border border-white/85 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#20242c]/70"
          >
            <p className="text-[10px] text-[#9299a3] dark:text-white/45">{a}</p>
            <div className="mt-2 flex items-center justify-between">
              <strong className="text-2xl text-[#252a31] dark:text-white">{b}</strong>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0e9] text-[#ff5a1f]">
                <AppIcon name={['grid', 'check-circle', 'plus'][i]} size={17} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <section className="rounded-2xl border border-white/85 bg-white/70 p-4 shadow-[0_8px_30px_rgba(18,20,23,.045)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#252a31] dark:text-white">فهرست زیرگروه‌ها</h2>
            <p className="mt-1 text-[10px] text-[#9299a3] dark:text-white/40">
              هر زیرگروه به یک گروه اصلی تعلق دارد.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              placeholder="جست‌وجوی زیرگروه..."
              className="h-10 rounded-xl border border-[#e8eaee] bg-white/70 px-3 text-[10px] outline-none focus:border-[#ff9b78] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            />
            <select className="h-10 rounded-xl border border-[#e8eaee] bg-white/70 px-3 text-[10px] text-[#737c88] dark:border-white/10 dark:bg-[#20242c] dark:text-white">
              <option>همه گروه‌ها</option>
              <option>کامپیوتر و تجهیزات</option>
              <option>لوازم جانبی موبایل</option>
            </select>
            <select className="h-10 rounded-xl border border-[#e8eaee] bg-white/70 px-3 text-[10px] text-[#737c88] dark:border-white/10 dark:bg-[#20242c] dark:text-white">
              <option>همه وضعیت‌ها</option>
              <option>فعال</option>
              <option>غیرفعال</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="bg-[#f7f8fa] text-[10px] text-[#9299a3] dark:bg-white/[0.035] dark:text-white/40">
                {['زیرگروه', 'گروه اصلی', 'نامک (Slug)', 'تعداد محصولات', 'وضعیت', 'عملیات'].map(
                  (x) => (
                    <th
                      key={x}
                      className="border-y border-[#edf0f3] px-4 py-3 font-semibold first:rounded-r-lg last:rounded-l-lg dark:border-white/[0.06]"
                    >
                      {x}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {subgroups.map((s, i) => (
                <tr
                  key={s.slug}
                  className="text-[11px] hover:bg-[#fffaf7] dark:hover:bg-white/[0.025]"
                >
                  <td className="border-b border-[#f0f1f3] px-4 py-4 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f3f8] text-[#6e7888] dark:bg-white/[0.06] dark:text-white/55">
                        ↳
                      </span>
                      <span className="font-bold text-[#343a43] dark:text-white/85">{s.name}</span>
                    </div>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-4 dark:border-white/[0.06]">
                    <span className="rounded-lg bg-[#f5f6f8] px-2.5 py-1.5 text-[10px] text-[#737c88] dark:bg-white/[0.06] dark:text-white/55">
                      {s.group}
                    </span>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-4 font-mono text-[10px] text-[#9299a3] dark:border-white/[0.06]">
                    {s.slug}
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-4 text-[#59616c] dark:border-white/[0.06] dark:text-white/65">
                    {s.products} کالا
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-4 dark:border-white/[0.06]">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${s.status === 'فعال' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/[0.07] dark:text-white/45'}`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-4 dark:border-white/[0.06]">
                    <button className="rounded-lg p-2 text-[#818995] hover:bg-[#fff0e9] hover:text-[#ff5a1f]">
                      <AppIcon name="edit" size={16} />
                    </button>
                    <button className="rounded-lg p-2 text-[#818995] hover:bg-rose-50 hover:text-rose-500">
                      <AppIcon name="more" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[#edf0f3] pt-4 text-[10px] text-[#9299a3] dark:border-white/[0.06]">
          <span>نمایش ۱ تا ۶ از ۳۸ زیرگروه</span>
          <div className="flex gap-1">
            <button className="h-8 rounded-lg border border-[#e8eaee] px-3 dark:border-white/10">
              قبلی
            </button>
            <button className="h-8 w-8 rounded-lg bg-[#ff5a1f] text-white">۱</button>
            <button className="h-8 w-8 rounded-lg border border-[#e8eaee] dark:border-white/10">
              ۲
            </button>
            <button className="h-8 rounded-lg border border-[#e8eaee] px-3 dark:border-white/10">
              بعدی
            </button>
          </div>
        </div>
      </section>
      <p className="text-center text-[9px] text-[#a0a6af] dark:text-white/30">
        اطلاعات این صفحه نمونه و صرفاً جهت نمایش طراحی هستند.
      </p>
    </div>
  );
}
