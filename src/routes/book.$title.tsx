import {
  Link,
  LoaderFunction,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { Main } from "../components/Layout/Main";

import { bookStore } from "../bookstore/library";
import { getBookContent } from "../bookstore/getBookContent";
import { ChapterNavbar } from "../components/Book/Navbar";

export const loader = async function loader(args) {
  const params = args.params as { title: string };
  await bookStore.loadData();
  const { book, content } = await getBookContent({
    title: params.title,
  });

  return { book, content };
} satisfies LoaderFunction;

export type TableOfContentsEntry = {
  titleTexts: string[] | undefined;
  index: number;
  words: number;
  link: string;
};

export function BookPage() {
  const { book, content } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  return (
    <>
      <ChapterNavbar bookTitle={book.title} />
      <Main>
        <h1>{book.title}</h1>
        <h2>{book.author}</h2>

        <ul>
          {content.tableOfContents
            ? content.tableOfContents.map((section, chapterIndex) => {
              return (
                <li key={chapterIndex}>
                  <Link to={section.link}>
                    <RenderTitle
                      key={chapterIndex}
                      value={section.titleTexts}
                    />
                  </Link>
                </li>
              );
            })
            : null}
        </ul>
      </Main>
    </>
  );
}

function RenderTitle({ value }: { value?: string[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      {value
        ? value.map((title, index) => {
          return <div key={index}>{title}</div>;
        })
        : "Unknown"}
    </div>
  );
}
