async function updateSettings(formData: FormData) {
  "use server";

  const username = formData.get("username");
  const email = formData.get("email");
  const currentPassword = formData.get("current-password");
  const newPassword = formData.get("new-password");

  // TODO: データベースの情報を更新し、パスワードの検証を行う
  console.log("設定の更新:", {
    username,
    email,
    hasCurrentPassword: !!currentPassword,
    hasNewPassword: !!newPassword,
  });

  // 実際のアプリでは成功メッセージなどを表示する
}

function SettingSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-solid border-black/[.08] pb-12 dark:border-white/[.145] md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-foreground/60">
          {description}
        </p>
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">設定</h1>
        <p className="mt-2 text-foreground/80">
          アカウントに関する設定を管理します。
        </p>
      </header>

      <form action={updateSettings}>
        <div className="space-y-12">
          <SettingSection
            title="プロフィール"
            description="この情報は公開されます。お取り扱いにはご注意ください。"
          >
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6"
                >
                  ユーザー名
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    defaultValue="Taro Yamada"
                    className="block w-full rounded-md border-0 bg-foreground/[.05] py-1.5 shadow-sm ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-foreground/50 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </SettingSection>

          <SettingSection
            title="アカウント情報"
            description="メールアドレスを変更できます。"
          >
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6"
                >
                  メールアドレス
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue="taro.yamada@example.com"
                    className="block w-full rounded-md border-0 bg-foreground/[.05] py-1.5 shadow-sm ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-foreground/50 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </SettingSection>

          <SettingSection
            title="パスワード"
            description="セキュリティのため、定期的なパスワードの変更を推奨します。"
          >
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium leading-6"
                >
                  現在のパスワード
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="current-password"
                    id="current-password"
                    className="block w-full rounded-md border-0 bg-foreground/[.05] py-1.5 shadow-sm ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-foreground/50 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium leading-6"
                >
                  新しいパスワード
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="new-password"
                    id="new-password"
                    className="block w-full rounded-md border-0 bg-foreground/[.05] py-1.5 shadow-sm ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-foreground/50 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </SettingSection>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6 border-t border-solid border-black/[.08] pt-6 dark:border-white/[.145]">
          <button
            type="button"
            className="text-sm font-semibold leading-6"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            保存する
          </button>
        </div>
      </form>
    </div>
  );
}
