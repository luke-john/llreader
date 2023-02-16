import { getFB2Content } from "../utils/getFB2BookContent";
import { getBook, getFB2Book } from "../utils/useFBBook";

export async function getBookContent(
  { title }: { title: string },
) {
  const book = getBook({ title });
  switch (book.type) {
    case "fb2":
      return {
        book,
        content: await getFB2Content(book.file),
      };
    default:
      throw new Error("Unsupported book format");
  }
}
