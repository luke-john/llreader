import { Link, useLoaderData } from "react-router-dom";

import {
  cleanTextContent,
  getTextContent,
  loadFB2File,
} from "../utils/fb2utils";

import { Book, bookStore, useBookStoreState } from "../library";
import { Main } from "../components/Layout/Main";

export async function loader() {
  await bookStore.loadData();

  return bookStore;
}

export function LandingPage() {
  useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const bookStoreState = useBookStoreState();

  return (
    <Main>
      <h1>Language Learner Reader</h1>
      <h2>Library</h2>
      <ul>
        {bookStoreState.books.map((book) => (
          <LiBook key={book.title} book={book} />
        ))}
        <li>
          <AddBook />
        </li>
      </ul>
    </Main>
  );
}

function LiBook({ book }: { book: Book }) {
  return (
    <li key={book.title}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <Link to={`/books/${book.title}`}>
            <h3>{book.title}</h3>
          </Link>
        </div>
        {/* <Share book={book} /> */}
      </div>
    </li>
  );
}

type HTMLSubmitEvent = React.BaseSyntheticEvent<
  SubmitEvent,
  Event,
  HTMLFormElement
>;
function AddBook() {
  async function handleSumbit(event: React.FormEvent) {
    event.preventDefault();

    let formData = new FormData(
      ((event as unknown as HTMLSubmitEvent).nativeEvent.submitter! as
        | HTMLButtonElement
        | HTMLInputElement).form!,
    );
    const file = formData.get("file");
    if (!file) {
      return;
    }
    if (!(file instanceof File)) {
      throw new Error("File is not a file");
    }
    if (!file.name.endsWith(".fb2")) {
      throw new Error("Only FB2 files are supported");
    }
    const fb2XML = await loadFB2File(file);

    const bookTitle = getTextContent(fb2XML, "book-title");
    const author = cleanTextContent(getTextContent(fb2XML, "author"));

    bookStore.addBook({
      title: bookTitle || file.name,
      type: "fb2",
      author: author,
      file,
      currentPosition: {
        chapter: 0,
      },
    });
  }
  return (
    <form onSubmit={handleSumbit}>
      <input type="file" name="file" />
      <button type="submit">Add new book</button>
    </form>
  );
}

export async function loadBook(file: File) {
  const fb2XML = await loadFB2File(file);

  const bookTitle = getTextContent(fb2XML, "book-title")!;
  const author = cleanTextContent(getTextContent(fb2XML, "author"));

  const alreadyHaveBook = bookStore.getState().books.some((book) =>
    bookTitle === book.title && author === book.author
  );

  if (alreadyHaveBook) {
    throw new Error("You already have this book.");
  }

  bookStore.addBook({
    title: bookTitle,
    type: "fb2",
    author: author,
    file,
    currentPosition: {
      chapter: 0,
    },
  });
}
