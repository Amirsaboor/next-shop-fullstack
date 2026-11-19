import Link from "next/link";

const sections = [
  {
    title: "محصولات",
    description: "افزودن، ویرایش و مدیریت موجودی محصولات فروشگاه",
    href: "/admin/products",
    icon: "▦",
  },
  {
    title: "دسته‌بندی‌ها",
    description: "ساخت گروه‌های اصلی و زیرمجموعه‌های محصولات",
    href: "/admin/categories",
    icon: "◫",
  },
  {
    title: "سفارش‌ها",
    description: "مشاهده سفارش‌ها و پیگیری وضعیت آن‌ها",
    href: "/admin/orders",
    icon: "▤",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-medium text-[#ff5a1f]">خوش آمدید</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#121417]">داشبورد فروشگاه</h1>
        <p className="mt-2 text-sm text-[#858b94]">از این بخش می‌توانید قسمت‌های مختلف فروشگاه را مدیریت کنید.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_4px_20px_rgba(18,20,23,0.03)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e9] text-xl text-[#ff5a1f]">{section.icon}</div>
            <h2 className="mt-5 text-base font-bold text-[#202329]">{section.title}</h2>
            <p className="mt-2 min-h-10 text-xs leading-6 text-[#858b94]">{section.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#ff5a1f]">
              در مرحله بعد فعال می‌شود <span>←</span>
            </span>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_4px_20px_rgba(18,20,23,0.03)] sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold">وضعیت راه‌اندازی</h2>
            <p className="mt-2 text-xs leading-6 text-[#858b94]">زیرساخت اصلی بک‌اند آماده است. در قدم بعد، صفحات مدیریتی را به APIهای واقعی متصل می‌کنیم.</p>
          </div>
          <span className="w-fit rounded-full bg-[#fff0e9] px-3 py-1.5 text-[11px] font-semibold text-[#e94b12]">در حال توسعه</span>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#f0f1f3]">
          <div className="h-full w-[65%] rounded-full bg-[#ff5a1f]" />
        </div>
        <p className="mt-2 text-left text-[10px] text-[#a0a5ad]">مرحله طراحی پنل مدیریت</p>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#121417] px-5 py-4 text-white">
        <div>
          <p className="text-sm font-semibold">آماده مدیریت فروشگاه هستیم</p>
          <p className="mt-1 text-xs text-white/50">ابتدا مدیریت محصولات و دسته‌بندی‌ها را پیاده‌سازی می‌کنیم.</p>
        </div>
        <Link href="/" className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold transition hover:bg-white/15">مشاهده سایت</Link>
      </div>
    </div>
  );
}
