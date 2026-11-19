import Link from "next/link";

const sections = [
  {
    title: "محصولات",
    description: "افزودن محصول، ویرایش مشخصات و مدیریت موجودی",
    href: "/admin/products",
    icon: "▦",
    detail: "مدیریت کاتالوگ فروشگاه",
  },
  {
    title: "دسته‌بندی‌ها",
    description: "ساخت گروه‌های اصلی و زیرمجموعه‌های محصولات",
    href: "/admin/categories",
    icon: "◫",
    detail: "مرتب‌سازی محصولات",
  },
  {
    title: "سفارش‌ها",
    description: "مشاهده سفارش‌ها و پیگیری وضعیت آن‌ها",
    href: "/admin/orders",
    icon: "▤",
    detail: "پیگیری خرید مشتریان",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-[#ff5a1f]">خوش آمدید</p>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-[#121417] sm:text-2xl">داشبورد فروشگاه</h1>
          <p className="mt-2 text-xs leading-6 text-[#858b94] sm:text-sm">نمای کلی مدیریت فروشگاه و دسترسی سریع به بخش‌های اصلی</p>
        </div>
        <span className="w-fit rounded-full border border-[#e7e9ed] bg-white px-3 py-2 text-[11px] text-[#777d86]">
          پنل مدیریت فروشگاه
        </span>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-[#e9ebef] bg-white p-5 shadow-[0_2px_12px_rgba(18,20,23,0.025)] transition hover:-translate-y-0.5 hover:border-[#ffd2c2] hover:shadow-[0_8px_24px_rgba(18,20,23,0.06)] sm:p-6">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e9] text-xl text-[#ff5a1f]">{section.icon}</span>
              <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[10px] text-[#858b94]">به‌زودی</span>
            </div>
            <h2 className="mt-5 text-base font-bold text-[#202329]">{section.title}</h2>
            <p className="mt-2 min-h-10 text-xs leading-6 text-[#858b94]">{section.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-[#f0f1f3] pt-4 text-[11px] text-[#a0a5ad]">
              <span>{section.detail}</span>
              <span className="text-[#ff5a1f]"><ArrowIcon /></span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className="rounded-2xl border border-[#e9ebef] bg-white p-5 shadow-[0_2px_12px_rgba(18,20,23,0.025)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#202329]">عملکرد فروشگاه</h2>
              <p className="mt-1 text-[11px] text-[#9298a2]">آمار پس از اتصال بخش سفارش‌ها نمایش داده می‌شود</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f5f7] text-[#69717d]">▥</span>
          </div>
          <div className="mt-6 flex h-36 items-center justify-center rounded-xl border border-dashed border-[#e4e7ec] bg-[#fafbfc] px-5 text-center">
            <div>
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-[#a0a5ad] shadow-sm">⌁</span>
              <p className="mt-3 text-xs font-medium text-[#626a75]">هنوز داده‌ای برای نمایش وجود ندارد</p>
              <p className="mt-1 text-[10px] text-[#a0a5ad]">با راه‌اندازی مدیریت سفارش‌ها، نمودار فروش در این قسمت قرار می‌گیرد.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e9ebef] bg-white p-5 shadow-[0_2px_12px_rgba(18,20,23,0.025)] sm:p-6">
          <h2 className="text-sm font-bold text-[#202329]">وضعیت راه‌اندازی</h2>
          <p className="mt-1 text-[11px] leading-6 text-[#9298a2]">زیرساخت اصلی فروشگاه آماده است و صفحات مدیریتی در حال تکمیل هستند.</p>
          <div className="mt-6 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#343a43]">اتصال پنل به بخش‌های فروشگاه</span>
            <span className="rounded-full bg-[#fff0e9] px-2.5 py-1 text-[10px] font-semibold text-[#e94b12]">در حال توسعه</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f0f1f3]">
            <div className="h-full w-[65%] rounded-full bg-[#ff5a1f]" />
          </div>
          <p className="mt-2 text-[10px] text-[#a0a5ad]">مرحله طراحی پنل مدیریت</p>
          <div className="mt-6 border-t border-[#f0f1f3] pt-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#ff5a1f] transition hover:gap-3">
              مشاهده فروشگاه <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-[#121417] px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-semibold">قدم بعدی: مدیریت محصولات</p>
          <p className="mt-1 text-[11px] leading-6 text-white/50">ابتدا فرم ثبت و ویرایش محصول را می‌سازیم و سپس آن را به API متصل می‌کنیم.</p>
        </div>
        <span className="w-fit rounded-lg bg-white/10 px-3 py-2 text-[10px] text-white/75">در برنامه توسعه</span>
      </section>
    </div>
  );
}
