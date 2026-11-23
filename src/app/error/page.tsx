import Link from 'next/link';
import { Suspense } from 'react';

type ErrorContentProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

async function ErrorContent({ searchParams }: ErrorContentProps) {
  const { status } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-lg text-center">
        <p className="mb-3 text-sm font-medium text-orange-500">خطا در انجام درخواست</p>

        <h1 className="mb-4 text-3xl font-bold">مشکلی پیش آمده است</h1>

        <p className="mb-8 text-sm leading-7 text-gray-500">
          متأسفانه در ارتباط با سرور یا پردازش درخواست مشکلی رخ داده است. لطفاً کمی بعد دوباره تلاش
          کنید.
        </p>

        {status && (
          <p className="mb-8 text-xs text-gray-500" dir="ltr">
            HTTP Status: {status}
          </p>
        )}

        <Link
          href="/"
          className="inline-flex rounded-lg bg-orange-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          بازگشت به صفحه اصلی
        </Link>
      </section>
    </main>
  );
}

export default function ErrorPage({ searchParams }: ErrorContentProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">در حال بارگذاری...</p>
        </main>
      }
    >
      <ErrorContent searchParams={searchParams} />
    </Suspense>
  );
}
