"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Order = {
  id: string; customer: string; mobile: string; date: string; items: number;
  total: string; payment: string; status: string; address: string;
};

const initialOrders: Order[] = [
  { id: "NS-1405-00248", customer: "علی رضایی", mobile: "0912***4821", date: "۱۴۰۵/۰۸/۲۹ - ۱۸:۴۲", items: 3, total: "۱۲,۸۵۰,۰۰۰", payment: "پرداخت شده", status: "در حال پردازش", address: "تهران، سعادت‌آباد، خیابان سرو غربی" },
  { id: "NS-1405-00247", customer: "سارا محمدی", mobile: "0935***1732", date: "۱۴۰۵/۰۸/۲۹ - ۱۷:۱۵", items: 1, total: "۴,۲۵۰,۰۰۰", payment: "پرداخت شده", status: "تکمیل شده", address: "مشهد، بلوار وکیل‌آباد" },
  { id: "NS-1405-00246", customer: "محمد کریمی", mobile: "0915***9024", date: "۱۴۰۵/۰۸/۲۹ - ۱۵:۰۸", items: 2, total: "۸,۶۰۰,۰۰۰", payment: "در انتظار پرداخت", status: "در انتظار پرداخت", address: "اصفهان، خیابان چهارباغ بالا" },
  { id: "NS-1405-00245", customer: "نگار احمدی", mobile: "0990***6214", date: "۱۴۰۵/۰۸/۲۸ - ۲۱:۳۶", items: 4, total: "۲۱,۳۰۰,۰۰۰", payment: "پرداخت شده", status: "ارسال شده", address: "شیراز، معالی‌آباد" },
  { id: "NS-1405-00244", customer: "امیرحسین موسوی", mobile: "0917***3188", date: "۱۴۰۵/۰۸/۲۸ - ۱۹:۲۰", items: 1, total: "۱,۹۸۰,۰۰۰", payment: "ناموفق", status: "لغو شده", address: "تبریز، ولیعصر" },
  { id: "NS-1405-00243", customer: "مریم حسینی", mobile: "0912***5540", date: "۱۴۰۵/۰۸/۲۸ - ۱۲:۰۵", items: 2, total: "۶,۷۵۰,۰۰۰", payment: "پرداخت شده", status: "در حال پردازش", address: "کرج، جهانشهر" },
];

const statusStyle: Record<string, string> = {
  "تکمیل شده": "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  "در حال پردازش": "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  "ارسال شده": "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  "در انتظار پرداخت": "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  "لغو شده": "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

export default function OrdersPage() {
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("همه وضعیت‌ها");
  const [payment, setPayment] = useState("همه پرداخت‌ها");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => orders.filter((order) => {
    const matchesSearch = [order.id, order.customer, order.mobile].some((value) => value.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch && (status === "همه وضعیت‌ها" || order.status === status) && (payment === "همه پرداخت‌ها" || order.payment === payment);
  }), [orders, search, status, payment]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] text-[#9299a3] dark:text-white/40"><Link href="/admin" className="hover:text-[#ff5a1f]">داشبورد</Link><span>/</span><span className="text-[#ff5a1f]">سفارش‌ها</span></div>
          <h1 className="text-2xl font-extrabold text-[#17191d] dark:text-white">مدیریت سفارش‌ها</h1>
          <p className="mt-2 text-xs text-[#8d949e] dark:text-white/45">پیگیری سفارش‌ها، وضعیت پرداخت و روند ارسال کالاها.</p>
        </div>
        <div className="flex items-center gap-2 self-start"><button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e8eaee] bg-white/70 px-4 text-[11px] font-semibold text-[#657080] transition hover:border-[#ffb69c] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/65">↓ دریافت گزارش</button></div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "کل سفارش‌ها", value: "۲۴۸", note: "از ابتدای فعالیت", icon: "▤", tone: "bg-[#fff0e9] text-[#ff5a1f]" },
          { label: "در انتظار بررسی", value: "۱۸", note: "نیازمند پیگیری", icon: "◷", tone: "bg-amber-50 text-amber-600" },
          { label: "در حال ارسال", value: "۳۲", note: "سفارش‌های فعال", icon: "⇢", tone: "bg-blue-50 text-blue-600" },
          { label: "فروش این ماه", value: "۱۸۶,۴۰۰,۰۰۰", note: "تومان · اطلاعات نمونه", icon: "↗", tone: "bg-emerald-50 text-emerald-600" },
        ].map((card) => <div key={card.label} className="rounded-2xl border border-white/85 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-5"><div className="flex items-center justify-between"><p className="text-[10px] text-[#9299a3] dark:text-white/45">{card.label}</p><span className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${card.tone}`}>{card.icon}</span></div><strong className="mt-3 block text-xl font-extrabold tracking-tight text-[#252a31] dark:text-white sm:text-2xl">{card.value}</strong><p className="mt-1 text-[9px] text-[#a0a6af] dark:text-white/35">{card.note}</p></div>)}
      </div>

      <section className="rounded-2xl border border-white/85 bg-white/70 p-4 shadow-[0_8px_30px_rgba(18,20,23,.045)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#20242c]/70 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div><h2 className="text-sm font-bold text-[#252a31] dark:text-white">فهرست سفارش‌ها</h2><p className="mt-1 text-[10px] text-[#9299a3] dark:text-white/40">برای مشاهده اطلاعات کامل، روی هر سفارش کلیک کنید.</p></div>
          <div className="grid gap-2 sm:grid-cols-2 xl:flex">
            <div className="relative"><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa1ad]">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="شماره سفارش، نام یا موبایل..." className="h-10 w-full rounded-xl border border-[#e8eaee] bg-white/75 pr-9 pl-3 text-[10px] outline-none transition focus:border-[#ff9b78] dark:border-white/10 dark:bg-white/[0.04] dark:text-white sm:w-64" /></div>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-xl border border-[#e8eaee] bg-white/75 px-3 text-[10px] text-[#69717d] outline-none dark:border-white/10 dark:bg-[#20242c] dark:text-white"><option>همه وضعیت‌ها</option>{Object.keys(statusStyle).map((value) => <option key={value}>{value}</option>)}</select>
            <select value={payment} onChange={(event) => setPayment(event.target.value)} className="h-10 rounded-xl border border-[#e8eaee] bg-white/75 px-3 text-[10px] text-[#69717d] outline-none dark:border-white/10 dark:bg-[#20242c] dark:text-white"><option>همه پرداخت‌ها</option><option>پرداخت شده</option><option>در انتظار پرداخت</option><option>ناموفق</option></select>
            <button type="button" onClick={() => { setSearch(""); setStatus("همه وضعیت‌ها"); setPayment("همه پرداخت‌ها"); }} className="h-10 rounded-xl bg-[#252a31] px-4 text-[10px] font-semibold text-white transition hover:bg-[#11151c] dark:bg-white/10 dark:hover:bg-white/15">پاک‌سازی</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0 text-right">
            <thead><tr className="bg-[#f7f8fa] text-[10px] text-[#9299a3] dark:bg-white/[0.035] dark:text-white/40">{["شماره سفارش","مشتری","تاریخ ثبت","اقلام","مبلغ کل","پرداخت","وضعیت سفارش","جزئیات"].map((label) => <th key={label} className="border-y border-[#edf0f3] px-4 py-3 font-semibold first:rounded-r-lg last:rounded-l-lg dark:border-white/[0.06]">{label}</th>)}</tr></thead>
            <tbody>{filtered.map((order) => <tr key={order.id} onClick={() => setSelected(order)} className="cursor-pointer text-[11px] transition hover:bg-[#fffaf7] dark:hover:bg-white/[0.025]">
              <td className="border-b border-[#f0f1f3] px-4 py-4 font-mono text-[10px] font-semibold text-[#59616c] dark:border-white/[0.06] dark:text-white/70">{order.id}</td>
              <td className="border-b border-[#f0f1f3] px-4 py-4 dark:border-white/[0.06]"><p className="font-bold text-[#343a43] dark:text-white/85">{order.customer}</p><p className="mt-1 text-[9px] text-[#a0a6af]">{order.mobile}</p></td>
              <td className="border-b border-[#f0f1f3] px-4 py-4 text-[10px] text-[#818995] dark:border-white/[0.06] dark:text-white/50">{order.date}</td>
              <td className="border-b border-[#f0f1f3] px-4 py-4 text-[#59616c] dark:border-white/[0.06] dark:text-white/65">{order.items} کالا</td>
              <td className="border-b border-[#f0f1f3] px-4 py-4 font-bold text-[#343a43] dark:border-white/[0.06] dark:text-white/80">{order.total}<span className="mr-1 text-[9px] font-normal text-[#a0a6af]">تومان</span></td>
              <td className="border-b border-[#f0f1f3] px-4 py-4 dark:border-white/[0.06]"><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${order.payment === "پرداخت شده" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : order.payment === "ناموفق" ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"}`}>{order.payment}</span></td>
              <td className="border-b border-[#f0f1f3] px-4 py-4 dark:border-white/[0.06]"><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${statusStyle[order.status]}`}>{order.status}</span></td>
              <td className="border-b border-[#f0f1f3] px-4 py-4 dark:border-white/[0.06]"><button type="button" onClick={(event) => { event.stopPropagation(); setSelected(order); }} className="rounded-lg border border-[#e8eaee] px-3 py-2 text-[9px] font-semibold text-[#68717d] transition hover:border-[#ffb69c] hover:text-[#ff5a1f] dark:border-white/10 dark:text-white/60">مشاهده</button></td>
            </tr>)}</tbody>
          </table>
          {filtered.length === 0 && <div className="py-14 text-center"><span className="text-3xl text-[#c4c9d1]">⌕</span><p className="mt-3 text-xs font-semibold text-[#68717d] dark:text-white/60">سفارشی با این مشخصات پیدا نشد.</p><p className="mt-1 text-[10px] text-[#a0a6af]">عبارت جست‌وجو یا فیلترها را تغییر دهید.</p></div>}
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-[#edf0f3] pt-4 text-[10px] text-[#9299a3] dark:border-white/[0.06] sm:flex-row sm:items-center sm:justify-between"><span>نمایش {filtered.length} سفارش از ۲۴۸ سفارش</span><div className="flex items-center gap-1"><button type="button" className="h-8 rounded-lg border border-[#e8eaee] px-3 dark:border-white/10">قبلی</button><button type="button" className="h-8 w-8 rounded-lg bg-[#ff5a1f] font-bold text-white">۱</button><button type="button" className="h-8 w-8 rounded-lg border border-[#e8eaee] dark:border-white/10">۲</button><button type="button" className="h-8 w-8 rounded-lg border border-[#e8eaee] dark:border-white/10">۳</button><button type="button" className="h-8 rounded-lg border border-[#e8eaee] px-3 dark:border-white/10">بعدی</button></div></div>
      </section>
      <p className="text-center text-[9px] text-[#a0a6af] dark:text-white/30">اطلاعات این صفحه نمونه و صرفاً جهت بررسی طراحی هستند و از سرور دریافت نمی‌شوند.</p>

      {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="order-modal-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/70 bg-[#f8f9fb] p-5 text-[#17191d] shadow-2xl dark:border-white/10 dark:bg-[#1c2028] dark:text-white sm:p-7">
          <div className="flex items-start justify-between gap-3 border-b border-[#e9ebef] pb-5 dark:border-white/10"><div><p className="text-[10px] text-[#9299a3]">جزئیات سفارش</p><h2 id="order-modal-title" className="mt-2 text-lg font-extrabold">{selected.id}</h2><p className="mt-1 text-[10px] text-[#9299a3]">{selected.date}</p></div><button type="button" onClick={() => setSelected(null)} aria-label="بستن" className="rounded-xl border border-[#e5e8ed] px-3 py-2 text-lg text-[#7d8591] hover:text-[#ff5a1f] dark:border-white/10">×</button></div>
          <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white p-4 dark:bg-white/[0.045]"><p className="text-[9px] text-[#9299a3]">مشتری</p><p className="mt-2 text-xs font-bold">{selected.customer}</p><p className="mt-1 text-[10px] text-[#9299a3]">{selected.mobile}</p></div><div className="rounded-2xl bg-white p-4 dark:bg-white/[0.045]"><p className="text-[9px] text-[#9299a3]">مبلغ سفارش</p><p className="mt-2 text-sm font-extrabold">{selected.total} تومان</p><p className="mt-1 text-[10px] text-[#9299a3]">{selected.items} قلم کالا</p></div></div>
          <div className="mt-4 rounded-2xl bg-white p-4 dark:bg-white/[0.045]"><p className="text-[10px] font-bold">وضعیت سفارش و پرداخت</p><div className="mt-3 flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${statusStyle[selected.status]}`}>{selected.status}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-white/65">{selected.payment}</span></div></div>
          <div className="mt-4 rounded-2xl bg-white p-4 dark:bg-white/[0.045]"><p className="text-[10px] font-bold">نشانی تحویل</p><p className="mt-2 text-[11px] leading-7 text-[#69717d] dark:text-white/60">{selected.address}</p></div>
          <div className="mt-5 flex justify-end"><button type="button" onClick={() => setSelected(null)} className="h-10 rounded-xl bg-[#252a31] px-5 text-[11px] font-semibold text-white dark:bg-white/10">بستن جزئیات</button></div>
        </div>
      </div>}
    </div>
  );
}
