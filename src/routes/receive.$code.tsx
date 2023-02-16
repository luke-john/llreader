// react component which fetches a file from the server and then displays some information about it

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadBook } from "../bookstore/addBook";

export function LoadFile() {
  const params = useParams<{ code: string }>();
  const [loadingState, setLoadingState] = useState<
    "loading" | "loaded" | "error"
  >("loading");

  useEffect(() => {
    loadFile(params.code!).then(() => {
      setLoadingState("loaded");
    }).catch((error) => {
      console.error(error);
      setLoadingState("error");
    });
  }, []);

  if (loadingState === "loading") {
    return <div>Loading...</div>;
  }

  if (loadingState === "error") {
    return <div>Error</div>;
  }

  return (
    <div>
      <h1>Loaded file</h1>
      <Link to="/">Return home</Link>
    </div>
  );
}

async function loadFile(code: string) {
  const response = await fetch(
    `${import.meta.env.VITE_SHARE_SERVER}/receive/${code}`,
  );

  if (
    response.headers.get("content-type") !== "application/x-fictionbook+xml"
  ) {
    throw new Error(
      "Invalid file type, only fb2 files are currently supported",
    );
  }

  const responseBlob = await response.blob();

  const file = new File([responseBlob], "unknown-file.fb2", {
    type: "application/x-fictionbook+xml",
  });
  await loadBook({ format: "fb2", file });
}
