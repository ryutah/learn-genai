import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Booklog Pile
        </h1>
        <p className="max-w-xl text-lg text-foreground/80">
          「積読」を解消し、最高の読書体験を。
          <br />
          Booklog Pileは、あなたが積んでいる本を管理し、
          <br />
          同じ本を読む仲間と繋がるためのSNSです。
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc] sm:w-auto"
          >
            新規登録
          </Link>
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-6 text-base font-medium hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-auto"
          >
            ログイン
          </Link>
        </div>
      </main>
      <footer className="absolute bottom-8">
        <p className="text-sm text-foreground/60">
          &copy; {new Date().getFullYear()} Booklog Pile.
        </p>
      </footer>
    </div>
  );
}
