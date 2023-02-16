import { useEffect, useState } from "react";
import { FictionBookNode, SectionNode } from "./fb2-nodeObject";
import { getNestedTextContent, getNestedValue, loadFB2File } from "./fb2utils";
import { bookStore } from "../bookstore/library";
import { elementToNodeObject } from "./xmlToJS";
import { convertSectionNodeToLL } from "./convertFB2SectionToLL";

export function getBook({ title }: { title: string }) {
  const bookStoreState = bookStore.getState();

  const book = bookStoreState.books.find((book) => {
    return book.title === title;
  })!;

  return book;
}

export async function getFB2Book({ file }: { file: File }) {
  const fb2BookDocument = await loadFB2File(file);

  const fb2BookObject = elementToNodeObject(
    fb2BookDocument.children[0],
  ) as any as FictionBookNode;

  return fb2BookObject;
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

export function getChapterLink(
  { chapterIndex, chapterTitleText }: {
    chapterIndex?: number;
    chapterTitleText?: string;
  },
) {
  if (chapterIndex === undefined) {
    return undefined;
  }

  return `${chapterIndex}-${chapterTitleText || "untitled"}`;
}

export function getChapterLinkFromChapter(
  { chapterIndex, fb2Book }: {
    chapterIndex: number;
    fb2Book: FictionBookNode;
  },
) {
  const chapter = getFB2BookChapter({
    fb2Book,
    chapterIndex,
  });
  if (!chapter) {
    return undefined;
  }
  return getChapterLink({
    chapterIndex,
    chapterTitleText: chapter.titleTexts?.join("-"),
  });
}

export function getFB2BookChapter(
  { fb2Book, chapterIndex }: { fb2Book: FictionBookNode; chapterIndex: number },
) {
  const sectionNode = getNestedValue(fb2Book, [
    { kind: "body", position: 0 },
    { kind: "section", position: chapterIndex - 1 },
  ]);

  if (!sectionNode) {
    return undefined;
  }

  const binaryNodes = getNestedValue(fb2Book, [
    { kind: "binary", position: "*" },
  ]) || [];

  const titleTexts = getTitleTexts(sectionNode, chapterIndex);
  const llDocument = convertSectionNodeToLL({ sectionNode, binaryNodes });

  return {
    titleTexts,
    llDocument,
  };
}
