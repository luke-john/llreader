import { useEffect, useState } from "react";
import { FictionBookNode, SectionNode } from "./utils/fb2-nodeObject";
import {
  getNestedTextContent,
  getNestedValue,
  loadFB2File,
} from "./utils/fb2utils";
import { useBookStoreState } from "./library";
import { elementToNodeObject } from "./utils/xmlToJS";

export function useFB2Book(bookTitle: string) {
  const bookStoreState = useBookStoreState();
  const book = bookStoreState.books.find((book) => {
    return book.title === bookTitle;
  });
  const [fb2Book, setFB2Book] = useState<FictionBookNode>();

  useEffect(() => {
    if (!book) {
      return;
    }
    loadFB2File(book.file)
      .then((fb2File) => {
        const nodeObject = elementToNodeObject(
          fb2File.children[0],
        ) as any as FictionBookNode;
        setFB2Book(nodeObject);
      });
  }, [book]);

  if (!fb2Book) {
    return {
      bookStoreState,
      book,
      fb2BookLoadingState: "loading" as const,
      fb2Book: undefined,
    };
  }

  return {
    bookStoreState,
    book,
    fb2BookLoadingState: "loaded" as const,
    fb2Book,
  };
}

type TableOfContentsEntry = {
  titleTexts: string[] | undefined;
  index: number;
  words: number;
};

export function getTableOfContents(fb2Book: FictionBookNode) {
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
      };
    },
  );

  return tableOfContents;
}

export function getTitleTexts(sectionNode: SectionNode, index: number) {
  const titleNodes = getNestedValue(sectionNode, [
    { kind: "title", position: "*" },
  ]);

  if (!titleNodes || titleNodes.length === 0) {
    return index === 0 ? ["--", "Cover"] : undefined;
  }

  const titleTexts =
    (titleNodes.map((titleNode) => getNestedTextContent(titleNode))
      .filter((title) => title !== undefined) as string[]).flat();

  return titleTexts;
}
