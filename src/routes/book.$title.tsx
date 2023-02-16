import {
  Link,
  LoaderFunction,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { Main } from "../components/Layout/Main";
import { bookStore } from "../library";

import {
  getBook,
  getChapterLink,
  getFB2Book,
  getTableOfContents,
} from "../useFBBook";

export const loader = async function loader(args) {
  const params = args.params as { title: string };
  await bookStore.loadData();
  const book = await getBook({ title: params.title });
  const fb2Book = await getFB2Book({ file: book.file });
  const tableOfContents = getTableOfContents(fb2Book);

  return { book, tableOfContents };
} satisfies LoaderFunction;

export function BookPage() {
  const params = useParams() as { title: string };
  const { book, tableOfContents } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  return (
    <Main>
      <h1>{book.title}</h1>
      <h2>{book.author}</h2>

      <ul>
        {tableOfContents
          ? tableOfContents.map((section, chapterIndex) => {
            return (
              <li key={chapterIndex}>
                <Link
                  to={`/books/${params.title!}/${
                    getChapterLink({
                      chapterIndex: chapterIndex + 1,
                      chapterTitleText: section.titleTexts?.join("-"),
                    })
                  }`}
                >
                  <RenderTitle key={chapterIndex} value={section.titleTexts} />
                </Link>
              </li>
            );
          })
          : null}
      </ul>
    </Main>
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
