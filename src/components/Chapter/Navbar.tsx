import { Link } from "react-router-dom";
import { linkStyles, navbarStyles } from "./Navbar.css";

export function ChapterNavbar({ bookTitle }: { bookTitle: string }) {
  return (
    <nav className={navbarStyles}>
      <Link className={linkStyles} to="/">
        Home
      </Link>
      <Link className={linkStyles} to={`/books/${bookTitle}`}>
        {bookTitle}
      </Link>
    </nav>
  );
}
