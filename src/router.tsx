import {
  createHashRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import {
  BookChapter,
  loader as bookChapterLoader,
} from "./routes/book.$title.$chapter";
import { BookPage, loader as bookPageLoader } from "./routes/book.$title";
import { LandingPage, loader } from "./routes/_index";
import { LoadFile } from "./routes/receive.$code";
import { RootLayout } from "./routes/root";

const routes = [
  {
    element: <RootLayout />,
    children: [
      {
        loader: loader,
        path: "/",
        element: <LandingPage />,
      },
      {
        loader: bookPageLoader,
        path: "/books/:title",
        element: <BookPage />,
      },
      {
        path: "/receive/:code",
        element: <LoadFile />,
      },
      {
        loader: bookChapterLoader,
        /**
         * Chapter string takes format
         * "{chapterIndex}-{chapterName}"
         */
        path: "/books/:title/:chapterString",
        element: <BookChapter />,
      },
    ],
  },
] satisfies RouteObject[];

export const router = createHashRouter(routes, {
  basename: "/",
});
