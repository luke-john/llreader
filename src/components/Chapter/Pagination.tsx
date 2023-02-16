import { Link } from "react-router-dom";
import { linkStyles, paginationBarStyles } from "./Pagination.css";

export function ChapterPagination(
  { prevChapter, nextChapter }: { prevChapter?: string; nextChapter?: string },
) {
  return (
    <nav className={paginationBarStyles}>
      {nextChapter && (
        <Link className={linkStyles} to={nextChapter}>
          Next Chapter
        </Link>
      )}
      {prevChapter && (
        <Link className={linkStyles} to={prevChapter}>
          Previous Chapter
        </Link>
      )}
    </nav>
  );
}
