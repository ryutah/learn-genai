import Link from "next/link";

// 仮の書籍データ（IDをGoogle Books APIのものに更新）
const mockBooks = {
  tsundoku: [
    { id: "zyTCAlFPjgYC", title: "ソフトウェアアーキテクチャの基礎", author: "Mark Richards" },
    { id: "_4_dAgAAQBAJ", title: "Clean Architecture", author: "Robert C. Martin" },
    { id: "lq2iDwAAQBAJ", title: "ドメイン駆動設計入門", author: "成瀬 允宣" },
  ],
  reading: [{ id: "s4h5EAAAQBAJ", title: "リファクタリング 第2版", author: "Martin Fowler" }],
  finished: [
    { id: "mCQAEAAAQBAJ", title: "単体テストの考え方/使い方", author: "Vladimir Khorikov" },
    { id: "T7KL3ytFXt8C", title: "Webを支える技術", author: "山本 陽平" },
    { id: "Qh9VzwEACAAJ", title: "達人プログラマー 第2版", author: "David Thomas" },
    { id: "J30kEAAAQBAJ", title: "Team Topologies", author: "Matthew Skelton" },
  ],
};

type Book = { id: string; title: string; author: string };

// 書籍カードコンポーネント
function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="block rounded-lg border border-solid border-black/[.08] p-4 transition-colors hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
    >
      <h3 className="font-bold">{book.title}</h3>
      <p className="text-sm text-foreground/80">{book.author}</p>
    </Link>
  );
}

// 本棚セクションコンポーネント
function BookshelfSection({
  title,
  books,
}: {
  title: string;
  books: Book[];
}) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-foreground/60">このカテゴリの本はありません。</p>
      )}
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
        <Link
          href="/search"
          className="flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          本を追加する
        </Link>
      </header>

      <div className="space-y-12">
        <BookshelfSection title="積読" books={mockBooks.tsundoku} />
        <BookshelfSection title="読書中" books={mockBooks.reading} />
        <BookshelfSection title="読了" books={mockBooks.finished} />
      </div>
    </div>
  );
}
