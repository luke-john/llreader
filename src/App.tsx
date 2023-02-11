import { createHashRouter, RouterProvider } from "react-router-dom";
import { BookChapter } from "./BookChapter";
import { BookPage } from "./BookPage";
import { LandingPage } from "./LandingPage";

const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/books/:bookTitle",
    element: <BookPage />,
  },

  {
    path: "/books/:bookTitle/:chapterString",
    element: <BookChapter />,
  },
];

const router = createHashRouter(routes);

export function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
