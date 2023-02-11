import { get, set } from "idb-keyval";
import { useEffect, useState } from "react";

export type Book = {
  title: string;
  author?: string;
  type: "fb2";
  file: File;
  currentPosition: {
    chapter: number;
    position?: number;
  };
};

type Books = Book[];
type LoadingState = "loading" | "loaded" | "error";
export type BookStoreState = {
  loadingState: LoadingState;
  books: Books;
};

interface Subscriber {
  (state: BookStoreState): void;
}

class BookStore {
  private subscribers: Subscriber[];
  private books: Books;
  private loadingState: LoadingState = "loading";

  constructor() {
    this.subscribers = [];
    this.books = [];
    this.loadData();
  }

  async loadData() {
    try {
      this.books = await get("books") || this.books;
      this.loadingState = "loaded";
      this.notifyObservers();
    } catch (error) {
      this.loadingState = "error";
      this.notifyObservers();
    }
  }

  private notifyObservers() {
    this.subscribers.forEach((observer) =>
      observer({
        loadingState: this.loadingState,
        books: this.books,
      })
    );
  }

  subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);

    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== subscriber);
    };
  }

  async addBook(book: Book) {
    this.books = [...this.books, book];

    await set("books", this.books);
    this.notifyObservers();
  }

  getState(): BookStoreState {
    return {
      loadingState: this.loadingState,
      books: this.books,
    };
  }
}

export const bookStore = new BookStore();

export function useBookStoreState() {
  const [bookStoreState, setBookStoreState] = useState(bookStore.getState());

  useEffect(() => {
    const unsubscribe = bookStore.subscribe((state: BookStoreState) => {
      setBookStoreState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return bookStoreState;
}
