import { LoaderFunction, useLoaderData, useParams } from "react-router-dom";
import { convertSectionNodeToLL } from "../../../utils/convertFB2SectionToLL";
import { FictionBookNode, SectionNode } from "../../../utils/fb2-nodeObject";
import { getNestedValue } from "../../../utils/fb2utils";
import { RenderLLContentDocument } from "../../../components/LLRenderer/LLDocument";
import { getBook, getFB2Book, getTitleTexts } from "../../../useFBBook";
import { bookStore } from "../../../library";

export const loader = async function loader(args) {
  const params = args.params as { title: string; chapterString: string };
  await bookStore.loadData();
  const book = await getBook({ title: params.title });
  const fb2Book = await getFB2Book({ file: book.file });

  const [chapterIndexString, ...chapterNameParts] = params.chapterString!.split(
    "-",
  );
  const chapterIndex = Number(chapterIndexString);

  const chapterNode = getNestedValue(fb2Book, [
    { kind: "body", position: 0 },
    { kind: "section", position: chapterIndex },
  ]);

  if (!chapterNode) {
    throw new Error("Chapter not found");
  }

  const chapter = getFB2BookChapter({ fb2Book, chapterIndex });

  return { book, fb2Book, chapter };
} satisfies LoaderFunction;

export function BookChapter() {
  const { chapter } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  if (!chapter) {
    return <div>Chapter not found</div>;
  }
  // chapter.llDocument.value = chapter.llDocument.value.slice(17, 20);

  return (
    <>
      {chapter.titleTexts?.join(" ")}
      <RenderLLContentDocument content={chapter.llDocument} />
    </>
  );
}

function getFB2BookChapter(
  { fb2Book, chapterIndex }: { fb2Book: FictionBookNode; chapterIndex: number },
) {
  const sectionNode = getNestedValue(fb2Book, [
    { kind: "body", position: 0 },
    { kind: "section", position: chapterIndex },
  ]);

  if (!sectionNode) {
    return undefined;
  }

  const binaryNodes = getNestedValue(fb2Book, [
    { kind: "binary", position: "*" },
  ]) || [];

  const titleTexts = getTitleTexts(sectionNode, chapterIndex);
  const llDocument = convertSectionNodeToLL({ sectionNode, binaryNodes });

  return {
    titleTexts,
    llDocument,
  };
}
