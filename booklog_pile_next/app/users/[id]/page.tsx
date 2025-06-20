import Link from "next/link";

// 仮のユーザーデータ
const userProfile = {
  id: "user1",
  name: "Alice",
  bio: "ソフトウェアエンジニア。技術書を積みがちです。よろしくお願いします！",
};

// 仮の書籍データ（IDをGoogle Books APIのものに更新）
const mockBooks = {
  tsundoku: [
    { id: "zyTCAlFPjgYC", title: "ソフトウェアアーキテクチャの基礎", author: "Mark Richards" },
    { id: "gKmdvQEACAAJ", title: "大規模サービス技術入門", author: "伊藤直也" },
  ],
  reading: [{ id: "l2z1EAAAQBAJ", title: "SRE サイトリライアビリティエンジニアリング", author: "Betsy Beyer" }],
  finished: [
    { id: "T7KL3ytFXt8C", title: "Webを支える技術", author: "山本 陽平" },
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

export default function UserProfilePage({ params }: { params: { id: string } }) {
  // params.id を使って実際のデータをフェッチする想定
  const user = userProfile;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8">
      <div className="mb-6">
        {/* 遷移図の「戻る」に相当 */}
        <Link
          href="/books/1"
          className="text-sm text-foreground/80 hover:text-foreground"
        >
          &larr; 前のページに戻る
        </Link>
      </div>

      {/* プロフィールヘッダー */}
      <header className="mb-12 flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
        <div className="h-24 w-24 flex-shrink-0 rounded-full bg-foreground/10"></div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="mt-2 max-w-xl text-foreground/80">{user.bio}</p>
        </div>
      </header>

      {/* 本棚 */}
      <div className="space-y-12">
        <BookshelfSection title="積読" books={mockBooks.tsundoku} />
        <BookshelfSection title="読書中" books={mockBooks.reading} />
        <BookshelfSection title="読了" books={mockBooks.finished} />
      </div>
    </div>
  );
}
