import {
  cleanTextContent,
  getTextContent,
  loadFB2File,
} from "../utils/fb2utils";
import { getFB2Meta } from "../utils/getFB2BookContent";
import { bookStore } from "./library";

export async function loadBook(
  { format, file }: { format: string; file: File },
) {
  const fileMeta = await getBookMeta({ format, file });

  const alreadyHaveBook = bookStore.getState().books.some((book) =>
    fileMeta.title === book.title && fileMeta.author === book.author
  );

  if (alreadyHaveBook) {
    throw new Error("You already have this book.");
  }

  bookStore.addBook({
    title: fileMeta.title,
    type: "fb2",
    author: fileMeta.author,
    file,
    currentPosition: {
      chapter: 0,
    },
  });
}

async function getBookMeta({ format, file }: { format: string; file: File }) {
  switch (format) {
    case "fb2":
      return getFB2Meta(file);
    default:
      throw new Error("Unsupported book format");
  }
}
