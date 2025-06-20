import Link from "next/link";
import { redirect } from "next/navigation";

// Google Books APIから返される書籍データの型定義
type Book = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
  };
};

// 書籍のステータスを変更するサーバーアクション
async function changeBookStatus(formData: FormData) {
  "use server";
  const bookId = formData.get("bookId");
  const status = formData.get("status");

  // TODO: データベースで書籍のステータスを更新する
  console.log("ステータス変更:", { bookId, status });

  // ダッシュボードにリダイレクトして変更を反映
  redirect("/dashboard");
}

// --- 以下、仮のデータとコンポーネント ---
const comrades = [
  { id: "user1", name: "Alice" },
  { id: "user2", name: "Bob" },
  { id: "user3", name: "Charlie" },
];

const impressions = [
  {
    id: 1,
    user: { name: "David" },
    content: "1章を読み終えた。コンポーネントベースアーキテクチャの分類が分かりやすい。",
    hasSpoiler: false,
  },
  {
    id: 2,
    user: { name: "Eve" },
    content: "最後の展開には驚いた！まさかあの人が...",
    hasSpoiler: true,
  },
];

function ComradeCard({ comrade }: { comrade: { id: string; name: string } }) {
  return (
    <Link
      href={`/users/${comrade.id}`}
      className="block rounded-lg border border-solid border-black/[.08] p-3 text-center transition-colors hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
    >
      <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-foreground/10"></div>
      <p className="text-sm font-medium">{comrade.name}</p>
    </Link>
  );
}

function ImpressionCard({
  impression,
}: {
  impression: {
    id: number;
    user: { name: string };
    content: string;
    hasSpoiler: boolean;
  };
}) {
  return (
    <div className="rounded-lg border border-solid border-black/[.08] p-4 dark:border-white/[.145]">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-foreground/10"></div>
        <p className="font-bold">{impression.user.name}</p>
      </div>
      {impression.hasSpoiler ? (
        <div className="rounded-md bg-foreground/5 p-4 text-center">
          <p className="text-sm text-foreground/60">ネタバレを含む感想です</p>
          <button className="mt-2 text-sm font-bold">表示する</button>
        </div>
      ) : (
        <p className="text-foreground/90">{impression.content}</p>
      )}
    </div>
  );
}
// --- 仮のデータとコンポーネントここまで ---

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let book: Book | null = null;
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${params.id}`,
    );
    if (!response.ok) {
      throw new Error("書籍データの取得に失敗しました");
    }
    book = await response.json();
  } catch (error) {
    console.error(error);
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8 text-center sm:px-8">
        <h1 className="text-2xl font-bold">書籍が見つかりませんでした</h1>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm text-foreground/80 hover:text-foreground"
        >
          &larr; ダッシュボードに戻る
        </Link>
      </div>
    );
  }

  const { title, authors, imageLinks } = book.volumeInfo;
  const coverImage =
    imageLinks?.thumbnail ||
    imageLinks?.smallThumbnail ||
    "/placeholder-cover.svg";
  const authorText = authors?.join(", ") || "著者不明";

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-foreground/80 hover:text-foreground"
        >
          &larr; ダッシュボードに戻る
        </Link>
      </div>

      {/* 書籍情報 */}
      <header className="mb-12 flex flex-col gap-8 md:flex-row">
        <div className="mx-auto w-48 flex-shrink-0 md:mx-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={`${title}の表紙`}
            className="h-auto w-full rounded-lg border border-solid border-black/[.08] dark:border-white/[.145]"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-lg text-foreground/80">{authorText}</p>
          <form action={changeBookStatus} className="mt-6 flex flex-wrap gap-2">
            <input type="hidden" name="bookId" value={book.id} />
            <button
              name="status"
              value="tsundoku"
              type="submit"
              className="flex h-9 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              積読にする
            </button>
            <button
              name="status"
              value="reading"
              type="submit"
              className="flex h-9 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              読書中にする
            </button>
            <button
              name="status"
              value="finished"
              type="submit"
              className="flex h-9 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              読了にする
            </button>
          </form>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* 感想タイムライン (メインカラム) */}
        <div className="space-y-8 lg:col-span-2">
          <h2 className="text-2xl font-bold">感想タイムライン</h2>
          <div className="space-y-4">
            {impressions.map((imp) => (
              <ImpressionCard key={imp.id} impression={imp} />
            ))}
          </div>
        </div>

        {/* 同志一覧 (サイドバー) */}
        <aside className="space-y-8">
          <h2 className="text-2xl font-bold">同志一覧</h2>
          <div className="grid grid-cols-3 gap-4">
            {comrades.map((c) => (
              <ComradeCard key={c.id} comrade={c} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
