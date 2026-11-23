import AppIcon from '@/components/ui/AppIcon';
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

type MenuChild = { label: string; href: string; icon: string };
type MenuItem = { label: string; icon: string } & (
  | { href: string; soon?: boolean; children?: never }
  | { children: MenuChild[]; href?: never; soon?: never }
);

const menuItems: MenuItem[] = [
  { label: 'داشبورد', href: '/admin', icon: 'dashboard' },
  {
    label: 'مدیریت محصولات',
    icon: 'box',
    children: [
      { label: 'گروه‌ها', href: '/admin/groups', icon: 'layers' },
      { label: 'زیرگروه‌ها', href: '/admin/subgroups', icon: 'layers' },
      { label: 'محصولات', href: '/admin/products', icon: 'box' },
    ],
  },
  { label: 'سفارش‌ها', href: '/admin/orders', icon: 'receipt' },
  { label: 'کاربران', href: '/admin/users', icon: 'users' },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('admin-theme');
    if (savedTheme === 'dark') setDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    window.localStorage.setItem('admin-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    setMobileOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
    if (
      pathname.startsWith('/admin/products') ||
      pathname.startsWith('/admin/groups') ||
      pathname.startsWith('/admin/subgroups')
    ) {
      setProductsMenuOpen(true);
    }
  }, [pathname]);

  const sidebarWidth = collapsed ? 'lg:mr-[88px]' : 'lg:mr-[264px]';

  return (
    <div className={`admin-theme relative isolate min-h-screen overflow-hidden bg-[#f5f6f8] text-[#17191d] transition-colors dark:bg-[#101216] dark:text-[#f4f5f7] ${dark ? "dark" : ""}`}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-36 top-24 h-[430px] w-[430px] rounded-full bg-[#ff5a1f]/[0.14] blur-[105px] dark:bg-[#ff5a1f]/[0.20]" />
        <div className="absolute left-[18%] top-[42%] h-[360px] w-[360px] rounded-full bg-[#7c8cff]/[0.09] blur-[110px] dark:bg-[#7788ff]/[0.13]" />
        <div className="absolute bottom-[-180px] right-[34%] h-[360px] w-[360px] rounded-full bg-[#ff9b72]/[0.11] blur-[105px] dark:bg-[#ff784d]/[0.12]" />
      </div>
      {mobileOpen && (
        <button
          type="button"
          aria-label="بستن منو"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex flex-col overflow-hidden border-l backdrop-blur-[36px] transition-all duration-300 ${dark ? 'border-white/[0.18] bg-[#11151c]/[0.88] text-white shadow-2xl shadow-black/20' : 'border-[#dfe4ef]/80 bg-[#f7f8ff]/[0.88] text-[#283044] shadow-2xl shadow-[#6474a8]/[0.12]'} ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} ${collapsed ? 'w-[264px] lg:w-[88px]' : 'w-[264px]'}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <div
            className={`absolute -right-20 top-20 h-64 w-64 rounded-full blur-[75px] ${dark ? 'bg-[#ff5a1f]/30' : 'bg-[#ff8b62]/[0.30]'}`}
          />
          <div
            className={`absolute -left-24 top-[42%] h-64 w-64 rounded-full blur-[85px] ${dark ? 'bg-[#657cff]/24' : 'bg-[#8296ff]/[0.28]'}`}
          />
          <div
            className={`absolute bottom-[-90px] right-8 h-56 w-56 rounded-full blur-[75px] ${dark ? 'bg-[#ff9b72]/19' : 'bg-[#c7a4ff]/[0.24]'}`}
          />
          <div
            className={`absolute inset-0 ${dark ? 'bg-gradient-to-b from-white/[0.055] via-transparent to-black/[0.10]' : 'bg-gradient-to-br from-white/[0.72] via-white/[0.18] to-[#e9edff]/[0.42]'}`}
          />
        </div>
        <div
          className={`relative z-10 flex h-[82px] shrink-0 items-center border-b ${dark ? 'border-white/[0.08]' : 'border-[#dce2f0]/80'} ${collapsed && !mobileOpen ? 'justify-center px-3' : 'justify-between px-5'}`}
        >
          <Link href="/admin" className="flex min-w-0 items-center gap-3" title="Saboor Shop">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#ff5a1f] text-xl font-black shadow-lg shadow-[#ff5a1f]/20">
              S
            </span>
            {(!collapsed || mobileOpen) && (
              <span className="min-w-0">
                <span className="block text-[15px] font-bold tracking-tight">Saboor Shop</span>
                <span
                  className={`mt-1 block text-[10px] ${dark ? 'text-white/45' : 'text-[#77819a]'}`}
                >
                  مدیریت فروشگاه
                </span>
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-white/55 hover:bg-white/10 lg:hidden"
            aria-label="بستن منو"
          >
            <AppIcon name="close" />
          </button>
        </div>

        <div className="relative z-10 px-3 pt-7">
          {(!collapsed || mobileOpen) && (
            <p
              className={`mb-3 px-3 text-[10px] font-semibold tracking-widest ${dark ? 'text-white/35' : 'text-[#8b94aa]'}`}
            >
              منوی اصلی
            </p>
          )}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              if (item.children) {
                const sectionActive = item.children.some(
                  (child) => pathname === child.href || pathname.startsWith(child.href + '/'),
                );
                const expanded = productsMenuOpen && (!collapsed || mobileOpen);
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => {
                        if (collapsed && !mobileOpen) {
                          setCollapsed(false);
                          setProductsMenuOpen(true);
                        } else {
                          setProductsMenuOpen((value) => !value);
                        }
                      }}
                      aria-expanded={expanded}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition-all ${collapsed && !mobileOpen ? 'justify-center' : ''} ${sectionActive ? (dark ? 'font-semibold text-white' : 'font-semibold text-[#303a55]') : dark ? 'text-white/65 hover:bg-white/[0.06] hover:text-white' : 'text-[#65708a] hover:bg-white/[0.65] hover:text-[#303a55]'}`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition ${sectionActive ? 'bg-[#ff5a1f] text-white shadow-lg shadow-[#ff5a1f]/25' : dark ? 'text-white/60 group-hover:text-white' : 'text-[#8490aa] group-hover:text-[#ff5a1f]'}`}
                      >
                        <AppIcon name={item.icon} size={20} />
                      </span>
                      {(!collapsed || mobileOpen) && (
                        <>
                          <span className="flex-1 text-right">{item.label}</span>
                          <span
                            className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                          >
                            <AppIcon name="chevron" size={15} />
                          </span>
                        </>
                      )}
                    </button>
                    {expanded && (
                      <div className="relative mr-[29px] mt-1 space-y-1 border-r border-[#dce2f0] pr-3 dark:border-white/10">
                        {item.children.map((child) => {
                          const active =
                            pathname === child.href || pathname.startsWith(child.href + '/');
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              title={collapsed && !mobileOpen ? child.label : undefined}
                              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] transition-all ${active ? (dark ? 'bg-white/[0.10] font-semibold text-white' : 'bg-white/80 font-semibold text-[#303a55] shadow-sm') : dark ? 'text-white/55 hover:bg-white/[0.06] hover:text-white' : 'text-[#78829a] hover:bg-white/65 hover:text-[#303a55]'}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-[#ff5a1f]' : dark ? 'bg-white/25' : 'bg-[#aeb7ca]'}`}
                              />
                              <span>{child.label}</span>
                              {active && (
                                <span className="mr-auto h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const active = pathname === item.href;
              return (
                <div key={item.href} className="relative">
                  {item.soon ? (
                    <div
                      title={
                        collapsed ? item.label + ' - به‌زودی' : 'این بخش در مرحله بعد ساخته می‌شود'
                      }
                      className={`flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-[13px] ${dark ? 'text-white/35' : 'text-[#a1a9bb]'} ${collapsed && !mobileOpen ? 'justify-center' : ''}`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                        <AppIcon name={item.icon} size={20} />
                      </span>
                      {(!collapsed || mobileOpen) && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          <span className="rounded-md bg-white/[0.07] px-2 py-1 text-[9px] text-white/40">
                            به‌زودی
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      title={collapsed && !mobileOpen ? item.label : undefined}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition-all ${collapsed ? 'justify-center' : ''} ${active ? (dark ? 'bg-white/[0.11] font-semibold text-white shadow-inner' : 'bg-white/[0.78] font-semibold text-[#303a55] shadow-md shadow-[#8996bd]/[0.12] ring-1 ring-[#dfe5f4]') : dark ? 'text-white/65 hover:bg-white/[0.06] hover:text-white' : 'text-[#65708a] hover:bg-white/[0.65] hover:text-[#303a55]'}`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition ${active ? 'bg-[#ff5a1f] text-white shadow-lg shadow-[#ff5a1f]/25' : dark ? 'text-white/60 group-hover:text-white' : 'text-[#8490aa] group-hover:text-[#ff5a1f]'}`}
                      >
                        <AppIcon name={item.icon} size={20} />
                      </span>
                      {(!collapsed || mobileOpen) && <span className="flex-1">{item.label}</span>}
                      {active && (!collapsed || mobileOpen) && (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-[#ff7a4c]' : 'bg-[#ff5a1f]'}`}
                        />
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="relative z-10 mt-auto p-3">
          {(!collapsed || mobileOpen) && (
            <div
              className={`rounded-xl border p-4 ${dark ? 'border-white/10 bg-white/[0.035]' : 'border-[#dce3f2]/80 bg-white/[0.48] shadow-sm shadow-[#8794ba]/[0.08]'}`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <p
                  className={`text-[11px] font-semibold ${dark ? 'text-white' : 'text-[#39445f]'}`}
                >
                  پنل مدیریت
                </p>
              </div>
              <p
                className={`mt-2 text-[10px] leading-6 ${dark ? 'text-white/40' : 'text-[#7b849a]'}`}
              >
                مدیریت محصولات، سفارش‌ها و مشتریان فروشگاه
              </p>
            </div>
          )}
          {collapsed && !mobileOpen && (
            <div className="flex justify-center pb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" title="پنل مدیریت" />
            </div>
          )}
        </div>
      </aside>

      <div className={`relative z-10 min-h-screen transition-all duration-300 ${sidebarWidth}`}>
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-[#e9ebef]/70 bg-white/75 px-4 backdrop-blur-2xl transition-colors dark:border-white/[0.07] dark:bg-[#171a20]/75 sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.matchMedia('(min-width: 1024px)').matches) {
                  setCollapsed((value) => !value);
                } else {
                  setMobileOpen(true);
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8eaee]/80 bg-white/60 text-[#555d68] shadow-sm backdrop-blur-lg transition hover:border-[#ffb69c] hover:bg-[#fff5f0]/80 hover:text-[#ff5a1f] dark:border-white/10 dark:bg-white/[0.06] dark:text-white/70 dark:hover:bg-white/10"
              aria-label={collapsed ? 'باز کردن سایدبار' : 'جمع کردن سایدبار'}
              title={collapsed ? 'باز کردن سایدبار' : 'جمع کردن سایدبار'}
            >
              <AppIcon name="menu" />
            </button>
            <div>
              <p className="text-[14px] font-bold">داشبورد</p>
              <p className="mt-1 text-[10px] text-[#9298a2] dark:text-white/40">
                خلاصه وضعیت فروشگاه شما
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setDark((value) => !value)}
              aria-label={dark ? 'فعال کردن تم روشن' : 'فعال کردن تم تاریک'}
              title={dark ? 'تم روشن' : 'تم تاریک'}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8eaee] text-[#68717d] transition hover:border-[#ffb69c] hover:bg-[#fff5f0] hover:text-[#ff5a1f] dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
            >
              <AppIcon name={dark ? 'sun' : 'moon'} size={19} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen((value) => !value);
                  setProfileOpen(false);
                }}
                aria-label="اعلان‌ها"
                aria-expanded={notificationsOpen}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8eaee] text-[#68717d] transition hover:border-[#ffb69c] hover:bg-[#fff5f0] hover:text-[#ff5a1f] dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
              >
                <AppIcon name="bell" size={19} />
                <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-white bg-[#ff5a1f] dark:border-[#171a20]" />
              </button>
              {notificationsOpen && (
                <div className="absolute left-0 top-12 z-50 w-[min(300px,calc(100vw-32px))] rounded-2xl border border-[#e9ebef] bg-white p-4 text-[#17191d] shadow-xl dark:border-white/10 dark:bg-[#20242c] dark:text-white">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">اعلان‌ها</p>
                    <span className="rounded-full bg-[#fff0e9] px-2 py-1 text-[9px] text-[#e94b12]">
                      جدید
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl bg-[#f7f8fa] p-3 dark:bg-white/[0.05]">
                    <p className="text-xs font-medium">هنوز اعلان جدیدی ندارید</p>
                    <p className="mt-1 text-[10px] leading-5 text-[#9298a2] dark:text-white/45">
                      رویدادهای مهم فروشگاه در این قسمت نمایش داده می‌شوند.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((value) => !value);
                  setNotificationsOpen(false);
                }}
                aria-label="منوی کاربری"
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[#f4f5f7] dark:hover:bg-white/[0.06]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171a20] text-xs font-bold text-white ring-2 ring-[#f0f1f3] dark:bg-[#ff5a1f] dark:ring-white/10">
                  م
                </span>
                <span className="hidden text-right sm:block">
                  <span className="block text-[11px] font-bold">مدیر فروشگاه</span>
                  <span className="mt-0.5 block text-[9px] text-[#9298a2] dark:text-white/40">
                    مدیر سیستم
                  </span>
                </span>
              </button>
              {profileOpen && (
                <div className="absolute left-0 top-12 z-50 w-52 rounded-2xl border border-[#e9ebef] bg-white p-2 text-[#17191d] shadow-xl dark:border-white/10 dark:bg-[#20242c] dark:text-white">
                  <div className="border-b border-[#eef0f2] px-3 py-2 dark:border-white/10">
                    <p className="text-xs font-bold">مدیر فروشگاه</p>
                    <p className="mt-1 text-[10px] text-[#9298a2]">حساب مدیریت</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(false)}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-[#555d68] hover:bg-[#f5f6f8] dark:text-white/70 dark:hover:bg-white/[0.06]"
                  >
                    <AppIcon name="user" size={16} /> پروفایل کاربری
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-[#555d68] hover:bg-[#f5f6f8] dark:text-white/70 dark:hover:bg-white/[0.06]"
                  >
                    <AppIcon name="settings" size={16} /> تنظیمات
                  </button>
                  <div className="mt-1 border-t border-[#eef0f2] pt-1 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <AppIcon name="logout" size={16} /> خروج از حساب
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
