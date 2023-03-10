import { LoaderFunction, useLoaderData, useParams } from "react-router-dom";

import { RenderLLContentDocument } from "../components/LLRenderer/LLDocument";
import {
  getBook,
  getChapterLinkFromChapter,
  getFB2Book,
  getFB2BookChapter,
} from "../utils/useFBBook";
import { bookStore } from "../bookstore/library";
import { Main } from "../components/Layout/Main";

import { ChapterPagination } from "../components/Chapter/Pagination";
import { ChapterNavbar } from "../components/Chapter/Navbar";

export const loader = async function loader(args) {
  const params = args.params as { title: string; chapterString: string };
  await bookStore.loadData();
  const book = await getBook({ title: params.title });
  const fb2Book = await getFB2Book({ file: book.file });

  const [chapterIndexString, ...chapterNameParts] = params.chapterString!.split(
    "-",
  );
  const chapter = getFB2BookChapter({
    fb2Book,
    chapterIndex: Number(chapterIndexString),
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }
  const [prevChapter, nextChapter] = [
    getChapterLinkFromChapter({
      fb2Book,
      chapterIndex: Number(chapterIndexString) - 1,
    }),
    getChapterLinkFromChapter({
      fb2Book,
      chapterIndex: Number(chapterIndexString) + 1,
    }),
  ];

  const chapterHeading = chapter?.titleTexts?.join(" ") || "Untitled chapter";

  return {
    book,
    fb2Book,
    chapter,
    chapterHeading,
    prevChapter,
    nextChapter,
    chapterIndexString,
  };
} satisfies LoaderFunction;

export function BookChapter() {
  const params = useParams() as { title: string; chapterString: string };
  const { chapter, chapterIndexString, prevChapter, nextChapter } =
    useLoaderData() as Awaited<
      ReturnType<typeof loader>
    >;

  if (!chapter) {
    return <div>Chapter not found</div>;
  }
  // chapter.llDocument.value = chapter.llDocument.value.slice(17, 20);
  const pagination = (
    <ChapterPagination
      prevChapter={prevChapter && `/books/${params.title}/${prevChapter}`}
      nextChapter={nextChapter && `/books/${params.title}/${nextChapter}`}
    />
  );

  return (
    <>
      <ChapterNavbar bookTitle={params.title} />
      <Main>
        {pagination}
        <RenderLLContentDocument
          content={chapter.llDocument}
          changeKey={chapterIndexString}
        />
        {pagination}
      </Main>
    </>
  );
}
