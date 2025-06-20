import { redirect } from "next/navigation";

// Google Books APIから返される書籍データの型定義
type Book = {
	id: string;
	volumeInfo: {
		title: string;
		authors?: string[];
		imageLinks?: {
			thumbnail: string;
		};
	};
};

// 検索フォームが送信されたときに実行されるサーバーアクション
async function searchBooks(formData: FormData) {
	"use server";
	const query = formData.get("q");
	if (typeof query === "string" && query.trim() !== "") {
		// 検索クエリをURLパラメータに付けてリダイレクト
		redirect(`/search?q=${encodeURIComponent(query.trim())}`);
	} else {
		// クエリが空なら検索ページトップに戻す
		redirect("/search");
	}
}

// 「本棚に追加」ボタンが押されたときに実行されるサーバーアクション
async function addBookToShelf(formData: FormData) {
	"use server";
	const bookId = formData.get("bookId");
	const title = formData.get("title");
	const author = formData.get("author");

	// TODO: ここで実際のデータベースに書籍を保存する処理を実装する
	console.log("本棚に追加:", { bookId, title, author });

	// 処理後、ダッシュボードにリダイレクト
	redirect("/dashboard");
}

// 検索結果カードコンポーネント
function SearchResultCard({ book }: { book: Book }) {
	const title = book.volumeInfo.title;
	const author = book.volumeInfo.authors?.join(", ") || "著者不明";

	return (
		<div className="flex items-center justify-between rounded-lg border border-solid border-black/[.08] p-4 dark:border-white/[.145]">
			<div>
				<h3 className="font-bold">{title}</h3>
				<p className="text-sm text-foreground/80">{author}</p>
			</div>
			<form action={addBookToShelf}>
				<input type="hidden" name="bookId" value={book.id} />
				<input type="hidden" name="title" value={title} />
				<input type="hidden" name="author" value={author} />
				<button
					type="submit"
					className="flex h-9 flex-shrink-0 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
				>
					本棚に追加
				</button>
			</form>
		</div>
	);
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams?: { q?: string };
}) {
	const query = searchParams?.q;
	let books: Book[] = [];

	// URLにクエリがある場合のみAPIを叩く
	if (query) {
		try {
			const response = await fetch(
				`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
					query,
				)}&maxResults=20&lang=ja`,
			);
			if (!response.ok) {
				throw new Error("書籍データの取得に失敗しました");
			}
			const data = await response.json();
			books = data.items || [];
		} catch (error) {
			console.error(error);
			// エラーハンドリングをここに追加可能
		}
	}

	return (
		<div className="container mx-auto px-4 py-8 sm:px-8">
			<header className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">書籍検索</h1>
				<p className="mt-2 text-foreground/80">
					本棚に追加したい書籍を検索してください。
				</p>
			</header>

			<form action={searchBooks} className="mb-8 flex gap-2">
				<input
					type="search"
					name="q"
					defaultValue={query || ""}
					placeholder="タイトル、著者名などで検索..."
					className="relative block w-full appearance-none rounded-full border border-solid border-black/[.08] px-4 py-2 text-foreground placeholder-foreground/60 focus:z-10 focus:border-foreground/50 focus:outline-none focus:ring-foreground/50 dark:border-white/[.145] sm:text-sm"
				/>
				<button
					type="submit"
					className="flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
				>
					検索
				</button>
			</form>

			<div className="space-y-4">
				<h2 className="text-2xl font-bold">検索結果</h2>
				{books.length > 0 ? (
					<div className="space-y-4">
						{books.map((book) => (
							<SearchResultCard key={book.id} book={book} />
						))}
					</div>
				) : (
					query && <p>「{query}」に一致する書籍は見つかりませんでした。</p>
				)}
			</div>
		</div>
	);
}
