import { getChapterLink, getFB2Book, getTitleTexts } from "./useFBBook";
import {
  cleanTextContent,
  getNestedValue,
  getTextContent,
  loadFB2File,
} from "./fb2utils";
import { FictionBookNode } from "./fb2-nodeObject";
import { TableOfContentsEntry } from "../routes/book.$title";

export async function getFB2Meta(file: File) {
  const fb2XML = await loadFB2File(file);

  const title = getTextContent(fb2XML, "book-title")!;
  const author = cleanTextContent(getTextContent(fb2XML, "author"));

  return { title, author };
}

export async function getFB2Content(file: File) {
  const fb2Book = await getFB2Book({ file: file });
  const fb2Meta = await getFB2Meta(file);
  const tableOfContents = getTableOfContents({ title: fb2Meta.title, fb2Book });

  return { tableOfContents };
}

function getTableOfContents(
  { title, fb2Book }: { title: string; fb2Book: FictionBookNode },
) {
  const sections = getNestedValue(fb2Book, [
    { kind: "body", position: 0 },
    { kind: "section", position: "*" },
  ]);

  if (!sections) {
    throw new Error("No chapters found in book");
  }

  const tableOfContents: TableOfContentsEntry[] = sections.map(
    (sectionNode, index) => {
      const titleTexts = getTitleTexts(sectionNode, index);

      return {
        titleTexts,
        index,
        words: 0,
        link: `/books/${title!}/${
          getChapterLink({
            chapterIndex: index + 1,
            chapterTitleText: titleTexts?.join("-"),
          })
        }`!,
      };
    },
  );

  return tableOfContents;
}
