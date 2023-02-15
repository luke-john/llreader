import { useCallback, useState } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";

import "./App.css";
import { cleanTextContent, getTextContent, loadFB2File } from "./fb2utils";

import { Book, bookStore, useBookStoreState } from "./library";

export function LandingPage() {
  const bookStoreState = useBookStoreState();

  return (
    <div className="App">
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
    </div>
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
        <Share book={book} />
      </div>
    </li>
  );
}

function Share({ book }: { book: Book }) {
  const [shareCode, setShareCode] = useState<string | undefined>(undefined);
  const shareHandler = useCallback(() => {
    shareFile(book.file, setShareCode);
  }, []);

  // const shareUrl = `${import.meta.env.VITE_OWN_DOMAIN}/#/receive/${shareCode}`;

  return (
    <>
      <button onClick={shareHandler}>share</button>
      {shareCode && (
        <>
          <QRCode
            value={`${import.meta.env.VITE_OWN_DOMAIN}/#/receive/${shareCode}`}
          />
          {/* <a href={shareUrl}>{shareUrl}</a> */}
        </>
      )}
    </>
  );
}

function shareFile(file: File, setShareCode: (code: string) => void) {
  const shareDomain = import.meta.env.VITE_SHARE_SERVER;

  let channelId: string;
  const eventSource = new EventSource(
    `${shareDomain}/share/file`,
  );

  eventSource.addEventListener("channel-ready", (event) => {
    const data = JSON.parse(event.data);
    console.log("Sharing ready:", data.channelId);
    channelId = data.channelId;
    setShareCode(data.channelId);
  });

  eventSource.addEventListener("share-request", async (event) => {
    await fetch(`${shareDomain}/send/${channelId!}`, {
      method: "POST",
      headers: {
        ["Content-Type"]: "application/x-fictionbook+xml",
      },
      body: file,
    });

    console.log("closing event source");

    eventSource.close();
  });
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
