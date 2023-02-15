import {
  Link,
  LoaderFunction,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { bookStore } from "../../library";

import { getBook, getFB2Book, getTableOfContents } from "../../useFBBook";

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
    <div>
      <h1>{book.title}</h1>
      <h2>{book.author}</h2>

      <ul>
        {tableOfContents
          ? tableOfContents.map((section, index) => {
            return (
              <li key={index}>
                <Link
                  to={`/books/${params.title!}/${index}-${
                    section.titleTexts
                      ? section.titleTexts.join("-")
                      : "untitled"
                  }`}
                >
                  <RenderTitle key={index} value={section.titleTexts} />
                </Link>
              </li>
            );
          })
          : null}
      </ul>
    </div>
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
