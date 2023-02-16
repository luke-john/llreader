import { Link, useLoaderData } from "react-router-dom";

import { Main } from "../components/Layout/Main";

import { Book, bookStore, useBookStoreState } from "../bookstore/library";
import { loadBook } from "../bookstore/addBook";

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

    loadBook({ format: await getFileType(file), file });
  }
  return (
    <form onSubmit={handleSumbit}>
      <input type="file" name="file" />
      <button type="submit">Add new book</button>
    </form>
  );
}

async function getFileType(file: File) {
  if (file.type) {
    return file.type;
  }
  const fallbackType = file.name.split(".").pop();

  if (fallbackType) {
    return fallbackType;
  }

  throw new Error("Could not determine file type");
}
