import { chapterHeading } from "./Header.css";

export function ChapterHeader({ children }: { children: React.ReactNode }) {
  return (
    <header>
      <h1 className={chapterHeading}>{children}</h1>
    </header>
  );
}
