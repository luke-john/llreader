import { useParams } from "react-router-dom";
import { convertSectionNodeToLL } from "../../../utils/convertFB2SectionToLL";
import { FictionBookNode, SectionNode } from "../../../utils/fb2-nodeObject";
import { getNestedValue } from "../../../utils/fb2utils";
import { RenderLLContentDocument } from "../../../components/LLRenderer/LLDocument";
import { getTitleTexts, useFB2Book } from "../../../useFBBook";

export function BookChapter() {
  let params = useParams<{ title: string; chapterString: string }>();
  const fb2Book = useFB2Book(params.title!);

  if (fb2Book.fb2BookLoadingState === "loading") {
    return <div>Loading...</div>;
  }

  if (!fb2Book.book) {
    throw new Error("missing book");
  }

  const [chapterIndexString, ...chapterNameParts] = params.chapterString!.split(
    "-",
  );
  const chapterIndex = Number(chapterIndexString);

  const chapterNode = getNestedValue(fb2Book.fb2Book, [
    { kind: "body", position: 0 },
    { kind: "section", position: chapterIndex },
  ]);

  if (!chapterNode) {
    return <div>Chapter not found</div>;
  }

  const chapter = getFB2BookChapter({ fb2Book: fb2Book.fb2Book, chapterIndex });

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
