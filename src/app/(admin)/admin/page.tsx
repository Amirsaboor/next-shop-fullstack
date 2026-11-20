import Link from 'next/link';

function Icon({ name, size = 21 }: { name: string; size?: number }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const shapes: Record<string, React.ReactNode> = {
    box: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    receipt: (
      <>
        <path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z" />
        <path d="M8 8h8M8 12h8M8 16h4" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-9" />
        <path d="M15 6h6v6" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5m0 14h17" />
        <path d="M8 16v-4m4 4V7m4 9v-7m4 7V4" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    plus: <path d="M12 5v14m-7-7h14" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {shapes[name] ?? shapes.box}
    </svg>
  );
}

const quickLinks = [
  {
    title: 'مدیریت محصولات',
    description: 'افزودن و ویرایش کالاها و موجودی',
    icon: 'box',
    href: '/admin/products',
  },
  {
    title: 'دسته‌بندی‌ها',
    description: 'ساخت گروه‌ها و زیرگروه‌ها',
    icon: 'layers',
    href: '/admin/categories',
  },
  {
    title: 'سفارش‌ها',
    description: 'بررسی و پیگیری سفارش مشتریان',
    icon: 'receipt',
    href: '/admin/orders',
  },
];

const stats = [
  { title: 'کل محصولات', value: '—', note: 'آمار پس از اتصال داده‌ها', icon: 'box' },
  { title: 'دسته‌بندی‌ها', value: '—', note: 'گروه‌ها و زیرگروه‌ها', icon: 'layers' },
  { title: 'سفارش‌ها', value: '—', note: 'سفارش‌های ثبت‌شده', icon: 'receipt' },
  { title: 'مشتریان', value: '—', note: 'حساب‌های ثبت‌نام‌شده', icon: 'users' },
];

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[210px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e5e8ed] bg-white/45 px-5 text-center backdrop-blur-md dark:border-white/10 dark:bg-white/[0.035]">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#a1a7b0] shadow-sm dark:bg-white/[0.06] dark:text-white/40">
        <Icon name="chart" size={23} />
      </span>
      <p className="mt-4 text-xs font-semibold text-[#515966] dark:text-white/75">{title}</p>
      <p className="mt-2 max-w-sm text-[10px] leading-6 text-[#969da7] dark:text-white/40">
        {description}
      </p>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-[#ff5a1f]">خوش آمدید، مدیر عزیز</p>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight text-[#17191d] dark:text-white sm:text-2xl">
            داشبورد فروشگاه
          </h1>
          <p className="mt-2 text-xs leading-6 text-[#8d949e] dark:text-white/45">
            نمای کلی وضعیت فروشگاه و دسترسی سریع به بخش‌های مدیریتی
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-xl border border-[#e8eaee] bg-white px-3 py-2 text-[10px] text-[#7c8490] dark:border-white/10 dark:bg-[#191d24] dark:text-white/50">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> وضعیت پنل: فعال
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat, index) => (
          <article
            key={stat.title}
            className="group relative isolate overflow-hidden rounded-2xl border border-white/85 bg-white/70 p-5 shadow-[0_8px_30px_rgba(18,20,23,0.05)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(18,20,23,0.075)] dark:border-white/10 dark:bg-[#20242c]/70"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full bg-[#ff5a1f]/[0.10] blur-[38px] transition group-hover:scale-125 dark:bg-[#ff5a1f]/[0.16]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 right-1/3 h-28 w-28 rounded-full bg-[#7588ff]/[0.07] blur-[42px] dark:bg-[#7588ff]/[0.12]"
            />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#7f8792] dark:text-white/50">
                  {stat.title}
                </p>
                <p className="mt-3 text-[27px] font-extrabold tracking-tight text-[#20242a] dark:text-white">
                  {stat.value}
                </p>
              </div>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${index === 0 ? 'bg-[#fff0e9] text-[#ff5a1f]' : 'bg-[#f2f4f7] text-[#67717e] dark:bg-white/[0.07] dark:text-white/65'}`}
              >
                <Icon name={stat.icon} size={21} />
              </span>
            </div>
            <p className="relative z-10 mt-3 border-t border-[#f0f1f3] pt-3 text-[10px] text-[#a0a6af] dark:border-white/[0.07] dark:text-white/35">
              {stat.note}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 2xl:grid-cols-[1.55fr_1fr]">
        <article className="relative isolate overflow-hidden rounded-2xl border border-white/85 bg-white/70 p-5 shadow-[0_8px_30px_rgba(18,20,23,0.05)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#252a31] dark:text-white">نمای کلی فروش</h2>
              <p className="mt-1 text-[10px] text-[#9299a3] dark:text-white/40">
                روند فروش در بازه انتخاب‌شده
              </p>
            </div>
            <span className="rounded-lg bg-[#fff0e9] px-3 py-2 text-[10px] font-semibold text-[#f0521b]">
              گزارش فروش
            </span>
          </div>
          <div className="relative z-10 mt-5">
            <EmptyState
              title="هنوز اطلاعات فروشی ثبت نشده است"
              description="به‌محض ثبت سفارش و اتصال گزارش‌ها، نمودار فروش و مقایسه دوره‌ای در این قسمت نمایش داده می‌شود."
            />
          </div>
        </article>
        <article className="relative isolate overflow-hidden rounded-2xl border border-white/85 bg-white/70 p-5 shadow-[0_8px_30px_rgba(18,20,23,0.05)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#252a31] dark:text-white">دسترسی سریع</h2>
              <p className="mt-1 text-[10px] text-[#9299a3] dark:text-white/40">
                بخش‌های اصلی مدیریت فروشگاه
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f5f7] text-[#6e7783] dark:bg-white/[0.06] dark:text-white/60">
              <Icon name="trend" />
            </span>
          </div>
          <div className="relative z-10 mt-5 space-y-2.5">
            {quickLinks.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-[#eef0f3] p-3 transition hover:border-[#ffd2c2] dark:border-white/[0.07]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e9] text-[#ff5a1f]">
                  <Icon name={item.icon} size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#3b414a] dark:text-white/85">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[9px] text-[#9aa1aa] dark:text-white/35">
                    {item.description}
                  </p>
                </div>
                <span className="rounded-md bg-[#f3f4f6] px-2 py-1 text-[9px] text-[#9299a3] dark:bg-white/[0.06] dark:text-white/40">
                  به‌زودی
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 2xl:grid-cols-[1.45fr_1fr]">
        <article className="relative isolate overflow-hidden rounded-2xl border border-white/85 bg-white/70 p-5 shadow-[0_8px_30px_rgba(18,20,23,0.05)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#252a31] dark:text-white">آخرین سفارش‌ها</h2>
              <p className="mt-1 text-[10px] text-[#9299a3] dark:text-white/40">
                مرور سفارش‌های اخیر مشتریان
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f5f7] text-[#6e7783] dark:bg-white/[0.06] dark:text-white/60">
              <Icon name="receipt" />
            </span>
          </div>
          <div className="relative z-10 mt-5">
            <EmptyState
              title="هنوز سفارشی ثبت نشده است"
              description="پس از ثبت اولین سفارش، شماره سفارش، مبلغ، تاریخ و وضعیت آن در این جدول نمایش داده می‌شود."
            />
          </div>
        </article>
        <article className="relative overflow-hidden rounded-2xl bg-[#15181d] p-6 text-white shadow-[0_8px_28px_rgba(18,20,23,0.12)]">
          <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full border-[24px] border-[#ff5a1f]/10" />
          <div className="absolute -left-4 top-16 h-24 w-24 rounded-full bg-[#ff5a1f]/10 blur-2xl" />
          <div className="relative">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff5a1f] text-white">
              <Icon name="chart" size={22} />
            </span>
            <p className="mt-5 text-base font-bold">فروشگاه در مسیر رشد</p>
            <p className="mt-2 text-[11px] leading-7 text-white/50">
              زیرساخت اصلی فروشگاه آماده است. با تکمیل صفحات مدیریت محصولات و سفارش‌ها، ابزارهای
              مدیریتی را مرحله‌به‌مرحله فعال می‌کنیم.
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-[10px] text-white/45">مرحله بعدی توسعه</span>
              <span className="rounded-lg bg-white/10 px-3 py-2 text-[10px] font-semibold">
                مدیریت محصولات
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-[#ffe0d4] bg-gradient-to-l from-[#fff4ef] to-white p-5 dark:border-[#ff5a1f]/15 dark:from-[#ff5a1f]/[0.08] dark:to-[#191d24] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-bold text-[#343941] dark:text-white">
            می‌خواهید فروشگاه را مدیریت کنید؟
          </p>
          <p className="mt-1 text-[10px] leading-6 text-[#9299a3] dark:text-white/40">
            از پنل مدیریت به سایت اصلی فروشگاه بروید و ظاهر آن را بررسی کنید.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#ff5a1f] px-4 py-2.5 text-[10px] font-bold text-white shadow-lg shadow-[#ff5a1f]/15 transition hover:-translate-y-0.5 hover:bg-[#ed4c14]"
        >
          مشاهده فروشگاه <Icon name="arrow" size={15} />
        </Link>
      </section>
    </div>
  );
}
