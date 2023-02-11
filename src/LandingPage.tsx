import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./App.css";
import { cleanTextContent, getTextContent, loadFB2File } from "./fb2utils";

import { bookStore, BookStoreState, useBookStoreState } from "./library";

export function LandingPage() {
  const bookStoreState = useBookStoreState();

  return (
    <div className="App">
      <h1>Language Learner Reader</h1>
      <h2>Library</h2>
      <ul>
        {bookStoreState.books.map((book) => (
          <li key={book.title}>
            <Link to={`/books/${book.title}`}>
              <h3>{book.title}</h3>
            </Link>
          </li>
        ))}
        <li>
          <AddBook />
        </li>
      </ul>
    </div>
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
