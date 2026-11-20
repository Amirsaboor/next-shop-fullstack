import Link from 'next/link';

const groups = [
  {
    name: 'کامپیوتر و تجهیزات',
    slug: 'computer-equipment',
    subs: 5,
    products: 34,
    status: 'فعال',
    updated: '۱۴۰۵/۰۸/۲۷',
    icon: '▣',
  },
  {
    name: 'لوازم جانبی موبایل',
    slug: 'mobile-accessories',
    subs: 6,
    products: 42,
    status: 'فعال',
    updated: '۱۴۰۵/۰۸/۲۶',
    icon: '▯',
  },
  {
    name: 'لوازم جانبی کامپیوتر',
    slug: 'computer-accessories',
    subs: 4,
    products: 28,
    status: 'فعال',
    updated: '۱۴۰۵/۰۸/۲۴',
    icon: '⌨',
  },
  {
    name: 'صوتی و تصویری',
    slug: 'audio-video',
    subs: 3,
    products: 16,
    status: 'غیرفعال',
    updated: '۱۴۰۵/۰۸/۲۰',
    icon: '♫',
  },
  {
    name: 'گجت‌های هوشمند',
    slug: 'smart-gadgets',
    subs: 2,
    products: 8,
    status: 'فعال',
    updated: '۱۴۰۵/۰۸/۱۸',
    icon: '◈',
  },
];

export default function GroupsPage() {
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
            <span className="text-[#ff5a1f]">گروه‌ها</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#17191d] dark:text-white">
            گروه‌های محصولات
          </h1>
          <p className="mt-2 text-xs text-[#8d949e] dark:text-white/45">
            دسته‌بندی‌های اصلی فروشگاه را مدیریت کنید.
          </p>
        </div>
        <button className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-[#ff5a1f] px-5 text-xs font-bold text-white shadow-lg shadow-[#ff5a1f]/20">
          ＋ افزودن گروه
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {[
          ['کل گروه‌ها', '۱۲'],
          ['گروه‌های فعال', '۱۰'],
          ['گروه‌های بدون محصول', '۲'],
        ].map(([a, b], i) => (
          <div
            key={a}
            className="rounded-2xl border border-white/85 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#20242c]/70"
          >
            <p className="text-[10px] text-[#9299a3] dark:text-white/45">{a}</p>
            <div className="mt-2 flex items-center justify-between">
              <strong className="text-2xl text-[#252a31] dark:text-white">{b}</strong>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0e9] text-[#ff5a1f]">
                {['◫', '✓', '＋'][i]}
              </span>
            </div>
          </div>
        ))}
      </div>
      <section className="rounded-2xl border border-white/85 bg-white/70 p-4 shadow-[0_8px_30px_rgba(18,20,23,.045)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#252a31] dark:text-white">فهرست گروه‌ها</h2>
            <p className="mt-1 text-[10px] text-[#9299a3] dark:text-white/40">
              گروه‌های اصلی و تعداد زیرگروه‌های هرکدام
            </p>
          </div>
          <div className="flex gap-2">
            <input
              placeholder="جست‌وجوی نام گروه..."
              className="h-10 min-w-0 rounded-xl border border-[#e8eaee] bg-white/70 px-3 text-[10px] outline-none focus:border-[#ff9b78] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            />
            <select className="h-10 rounded-xl border border-[#e8eaee] bg-white/70 px-3 text-[10px] text-[#737c88] dark:border-white/10 dark:bg-[#20242c] dark:text-white">
              <option>همه وضعیت‌ها</option>
              <option>فعال</option>
              <option>غیرفعال</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="bg-[#f7f8fa] text-[10px] text-[#9299a3] dark:bg-white/[0.035] dark:text-white/40">
                {[
                  'گروه',
                  'نامک (Slug)',
                  'زیرگروه‌ها',
                  'محصولات',
                  'وضعیت',
                  'آخرین تغییر',
                  'عملیات',
                ].map((x) => (
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
              {groups.map((g, i) => (
                <tr
                  key={g.slug}
                  className="text-[11px] hover:bg-[#fffaf7] dark:hover:bg-white/[0.025]"
                >
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e9] text-lg text-[#ff5a1f]">
                        {g.icon}
                      </span>
                      <span className="font-bold text-[#343a43] dark:text-white/85">{g.name}</span>
                    </div>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 font-mono text-[10px] text-[#9299a3] dark:border-white/[0.06]">
                    {g.slug}
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 text-[#59616c] dark:border-white/[0.06] dark:text-white/65">
                    {g.subs} مورد
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 text-[#59616c] dark:border-white/[0.06] dark:text-white/65">
                    {g.products} کالا
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 dark:border-white/[0.06]">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${g.status === 'فعال' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/[0.07] dark:text-white/45'}`}
                    >
                      {g.status}
                    </span>
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 text-[10px] text-[#9299a3] dark:border-white/[0.06]">
                    {g.updated}
                  </td>
                  <td className="border-b border-[#f0f1f3] px-4 py-3.5 dark:border-white/[0.06]">
                    <button className="rounded-lg p-2 text-[#818995] hover:bg-[#fff0e9] hover:text-[#ff5a1f]">
                      ✎
                    </button>
                    <button className="rounded-lg p-2 text-[#818995] hover:bg-rose-50 hover:text-rose-500">
                      •••
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[#edf0f3] pt-4 text-[10px] text-[#9299a3] dark:border-white/[0.06]">
          <span>نمایش ۱ تا ۵ از ۱۲ گروه</span>
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
