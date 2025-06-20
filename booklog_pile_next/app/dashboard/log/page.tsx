// 仮の読書ログデータ
const readingLogs = [
  {
    id: 1,
    date: "2023-10-26",
    activity: "「リファクタリング 第2版」を読み始めました。",
  },
  {
    id: 2,
    date: "2023-10-24",
    activity: "「単体テストの考え方/使い方」を読了しました。",
  },
  {
    id: 3,
    date: "2023-10-20",
    activity: "「Webを支える技術」を読了しました。",
  },
  {
    id: 4,
    date: "2023-10-15",
    activity: "「単体テストの考え方/使い方」を読み始めました。",
  },
];

export default function ReadingLogPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">読書ログ</h1>
        <p className="mt-2 text-foreground/80">
          あなたのこれまでの読書活動の記録です。
        </p>
      </header>

      <div className="flow-root">
        <ul className="-mb-8">
          {readingLogs.map((log, logIdx) => (
            <li key={log.id}>
              <div className="relative pb-8">
                {logIdx !== readingLogs.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-foreground/10"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div>
                    <div className="relative px-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 ring-8 ring-background">
                        <svg
                          className="h-5 w-5 text-foreground/60"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 py-1.5">
                    <div className="text-sm text-foreground/80">
                      {log.date}
                    </div>
                    <p className="mt-1 text-foreground">{log.activity}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
