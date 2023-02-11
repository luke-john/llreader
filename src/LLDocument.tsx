import { Fragment, useEffect, useRef } from "react";
import {
  LLBlockCommon,
  LLBlockLeafLLBlockBranchContentExpandTitle,
  LLContentDocument,
  LLInline,
} from "./custom-type";
// import { LLText } from "./LLText";

export function RenderLLContentDocument({
  content,
}: { content: LLContentDocument }) {
  return (
    <div
      style={{
        fontFamily: "Times",
        fontSize: "18px",
        fontWeight: 400,
        color: "#000000",
      }}
    >
      {content.value.map((blockCommon, i) => (
        <RenderLLBlockCommon key={i} content={blockCommon} />
      ))}
    </div>
  );
}

function RenderLLBlockCommon({
  content,
}: { content: LLBlockCommon }) {
  switch (content.group) {
    case "block-branch":
      switch (content.type) {
        case "expand":
          return (
            <div>
              <RenderLLBlockLeafLLBlockBranchContentExpandTitle
                content={content.value[0]}
              />

              {(content.value.slice(1) as LLBlockCommon[]).map((
                blockNode,
                i,
              ) => <RenderLLBlockCommon key={i} content={blockNode} />)}
            </div>
          );
        case "quote":
          return (
            <blockquote>
              {content.value.map((inlineNode, i) => (
                <RenderLLBlockCommon key={i} content={inlineNode} />
              ))}
            </blockquote>
          );
        default:
          throw new Error(`Unknown block-branch type: ${
            // @ts-ignore
            content.type}`);
      }
    case "block-leaf":
      switch (content.type) {
        case "image":
          return (
            <>
              <br />
              <img src={content.src} alt="Image" />;
              <br />
            </>
          );
        case "empty-line":
          return <br />;
        case "heading":
          const Tag = `h${content.attributes.level}` as "h1";

          return (
            <div style={{ fontSize: "0.6rem" }}>
              <RenderInlineGroup
                inlines={content.value}
                Tag={Tag}
                extraPadding={8}
              />
            </div>
          );

        case "paragraph":
          return <RenderInlineGroup inlines={content.value} Tag={"p"} />;

        default:
          throw new Error(`Unknown block-leaf type: ${
            // @ts-ignore
            content.type}`);
      }
    default:
      throw new Error(`Unknown block type: ${
        // @ts-ignore
        content.group}`);
  }
}

function RenderLLBlockLeafLLBlockBranchContentExpandTitle({
  content,
}: { content: LLBlockLeafLLBlockBranchContentExpandTitle }) {
  return <RenderInlineGroup inlines={content.value} Tag={"h3"} />;
}

import "./LLDocumentStyles.css";
import { useTranslationPadding } from "./LLText";

function RenderInlineGroup(
  { inlines, Tag, extraPadding = 0 }: {
    inlines: LLInline[];
    Tag: string;
    /** TODO cleanup positioning system */
    extraPadding?: number;
  },
) {
  // the use of HTMLDivElement is to avoid typescript complaints,
  // in practice it could be any HTMLElement
  const domRef = useRef<HTMLDivElement>(null);
  useTranslationPadding(domRef);
  const BetterTypedTag = Tag as "div";

  return (
    <div
      style={{
        position: "relative",
        width: "504px",
        lineHeight: "2.5",
        padding: 0,
      }}
      ref={domRef}
    >
      <div style={{ position: "relative", zIndex: 1 }} data-translation={false}>
        <BetterTypedTag>
          {inlines.map((inlineNode, i) => (
            <RenderLLInline key={i} content={inlineNode} translation={false} />
          ))}
        </BetterTypedTag>
      </div>
      <div
        className="translation"
        style={{
          position: "absolute",
          top: `${extraPadding}px`,
          color: "rgb(227, 222, 222)",
          zIndex: 0,
          // visibility: "hidden",
        }}
      >
        <BetterTypedTag ref={domRef}>
          {inlines.map((inlineNode, i) => (
            <RenderLLInline key={i} content={inlineNode} translation={true} />
          ))}
        </BetterTypedTag>
      </div>
    </div>
  );
}

function RenderLLText(
  { text, translation }: { text: string; translation: boolean },
) {
  const sentenceEndMatches = [...text.matchAll(/(\. |— |\? |! |: |, )/gm)];
  let texts: string[] = [];

  if (sentenceEndMatches.length === 0) {
    texts.push(text);
  } else {
    let completedUntil = 0;
    for (const sentenceEndMatch of sentenceEndMatches) {
      texts.push(text.substring(completedUntil, sentenceEndMatch.index! + 2));
      completedUntil = sentenceEndMatch.index! + 2;
    }
    texts.push(text.substring(completedUntil));
  }

  texts = texts.filter((text) => text.trim() !== "");

  return (
    <>
      {texts.map((text, index) => (
        <Fragment key={index}>
          <span
            data-translation={translation}
            className={translation ? "" : "notranslate"}
          >
            {text}
          </span>
          <span className={"sentenceBreaker"}></span>
        </Fragment>
      ))}
    </>
  );
}

function RenderLLInline(
  { content, translation }: { content: LLInline; translation: boolean },
) {
  switch (content.type) {
    case "text":
      return <RenderLLText text={content.value} translation={translation} />;
    case "link":
      return (
        <a href={content.destination}>
          {content.value.map((inlineNode, i) => (
            <RenderLLInline
              key={i}
              content={inlineNode}
              translation={translation}
            />
          ))}
        </a>
      );
    case "image":
      return (
        <>
          <br />
          <img src={content.src} />
          <br />
        </>
      );
    case "line-break":
      return <br />;

    default:
      throw new Error(`Unknown inline type: ${
        // @ts-ignore
        content.type}`);
  }
}
