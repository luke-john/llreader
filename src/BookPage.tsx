import { Link, useParams } from "react-router-dom";

import { getTableOfContents, useFB2Book } from "./useFBBook";

export function BookPage() {
  let params = useParams<{ bookTitle: string }>();
  const fb2Book = useFB2Book(params.bookTitle!);

  if (fb2Book.bookStoreState.loadingState === "loading") {
    return <div>Loading...</div>;
  }

  if (!fb2Book.book) {
    throw new Error("missing book");
  }

  const tableOfContents = fb2Book.fb2Book
    ? getTableOfContents(fb2Book.fb2Book)
    : undefined;

  return (
    <div>
      <h1>{fb2Book.book.title}</h1>
      <h2>{fb2Book.book.author}</h2>

      <ul>
        {tableOfContents
          ? tableOfContents.map((section, index) => {
            return (
              <li key={index}>
                <Link
                  to={`/books/${params.bookTitle!}/${index}-${
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
