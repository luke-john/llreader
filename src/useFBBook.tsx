import { useEffect, useState } from "react";
import { FictionBookNode, SectionNode } from "./utils/fb2-nodeObject";
import {
  getNestedTextContent,
  getNestedValue,
  loadFB2File,
} from "./utils/fb2utils";
import { bookStore } from "./library";
import { elementToNodeObject } from "./utils/xmlToJS";

export async function getBook({ title }: { title: string }) {
  await bookStore.loadData();
  const bookStoreState = bookStore.getState();

  const book = bookStoreState.books.find((book) => {
    return book.title === title;
  })!;

  if (book.type !== "fb2") {
    throw new Error("Only FB2 books are supported at this time");
  }

  return book;
}

export async function getFB2Book({ file }: { file: File }) {
  const fb2BookDocument = await loadFB2File(file);

  const fb2BookObject = elementToNodeObject(
    fb2BookDocument.children[0],
  ) as any as FictionBookNode;

  return fb2BookObject;
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
