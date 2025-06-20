import { redirect } from "next/navigation";
import Link from "next/link";

async function signup(formData: FormData) {
  "use server";

  // フォームからデータを取得
  const email = formData.get("email");
  const password = formData.get("password");

  // TODO: ここで実際のデータベースへのユーザー登録処理を行う
  console.log("新規登録試行:", { email, password });

  // 成功したらダッシュボードにリダイレクト
  redirect("/dashboard");
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight">
            <Link href="/">Booklog Pile</Link>
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight">
            新規登録
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={signup}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-md border border-solid border-black/[.08] px-3 py-2 text-foreground placeholder-foreground/60 focus:z-10 focus:border-foreground/50 focus:outline-none focus:ring-foreground/50 dark:border-white/[.145] sm:text-sm"
                placeholder="メールアドレス"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-md border border-solid border-black/[.08] px-3 py-2 text-foreground placeholder-foreground/60 focus:z-10 focus:border-foreground/50 focus:outline-none focus:ring-foreground/50 dark:border-white/[.145] sm:text-sm"
                placeholder="パスワード"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              登録する
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-foreground/80 hover:text-foreground"
          >
            アカウントをお持ちの方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
