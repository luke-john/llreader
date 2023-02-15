import { createHashRouter, RouterProvider } from "react-router-dom";
import { BookChapter } from "./routes/book/$title/$chapter";
import { BookPage } from "./routes/book/$title";
import { LandingPage } from "./routes";
import { LoadFile } from "./routes/receive/$code";

const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/books/:title",
    element: <BookPage />,
  },
  {
    path: "/receive/:code",
    element: <LoadFile />,
  },
  {
    /**
     * Chapter string takes format
     * "{chapterIndex}-{chapterName}"
     */
    path: "/books/:title/:chapterString",
    element: <BookChapter />,
  },
];

export const router = createHashRouter(routes);
