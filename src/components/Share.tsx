import { useCallback, useState } from "react";
import QRCode from "react-qr-code";
import { Book } from "../library";

export function Share({ book }: { book: Book }) {
  const [shareCode, setShareCode] = useState<string | undefined>(undefined);
  const shareHandler = useCallback(() => {
    shareFile(book.file, setShareCode);
  }, []);

  const shareUrl = `${import.meta.env.VITE_OWN_DOMAIN}/#/receive/${shareCode}`;

  return (
    <>
      <button onClick={shareHandler}>share</button>
      {shareCode && (
        <>
          <QRCode
            value={`${import.meta.env.VITE_OWN_DOMAIN}/#/receive/${shareCode}`}
          />
          <a href={shareUrl}>{shareUrl}</a>
        </>
      )}
    </>
  );
}

function shareFile(file: File, setShareCode: (code: string) => void) {
  const shareDomain = import.meta.env.VITE_SHARE_SERVER;

  let channelId: string;
  const eventSource = new EventSource(
    `${shareDomain}/share/file`,
  );

  eventSource.addEventListener("channel-ready", (event) => {
    const data = JSON.parse(event.data);
    console.log("Sharing ready:", data.channelId);
    channelId = data.channelId;
    setShareCode(data.channelId);
  });

  eventSource.addEventListener("share-request", async (event) => {
    await fetch(`${shareDomain}/send/${channelId!}`, {
      method: "POST",
      headers: {
        ["Content-Type"]: "application/x-fictionbook+xml",
      },
      body: file,
    });

    console.log("closing event source");

    eventSource.close();
  });
}
