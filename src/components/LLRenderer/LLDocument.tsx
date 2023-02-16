import { Fragment, useEffect, useLayoutEffect, useRef } from "react";

import { RenderInlineGroup } from "./LLInlineGroup";
import {
  LLBlockCommon,
  LLBlockLeafLLBlockBranchContentExpandTitle,
  LLContentDocument,
} from "../../LL-types";
import { heading, paragraph } from "./LLDocument.css";

export function RenderLLContentDocument({
  content,
  baseHeading = 1,
  changeKey,
}: { content: LLContentDocument; baseHeading?: number; changeKey: string }) {
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
        <RenderLLBlockCommon
          key={i}
          content={blockCommon}
          baseHeading={baseHeading}
          changeKey={changeKey}
        />
      ))}
    </div>
  );
}

function RenderLLBlockCommon({
  content,
  baseHeading,
  changeKey,
}: { content: LLBlockCommon; baseHeading: number; changeKey: string }) {
  switch (content.group) {
    case "block-branch":
      switch (content.type) {
        case "expand":
          return (
            <div>
              <RenderLLBlockLeafLLBlockBranchContentExpandTitle
                content={content.value[0]}
                changeKey={changeKey}
              />

              {(content.value.slice(1) as LLBlockCommon[]).map((
                blockNode,
                i,
              ) => (
                <RenderLLBlockCommon
                  key={i}
                  content={blockNode}
                  baseHeading={baseHeading}
                  changeKey={changeKey}
                />
              ))}
            </div>
          );
        case "quote":
          return (
            <blockquote>
              {content.value.map((inlineNode, i) => (
                <RenderLLBlockCommon
                  key={i}
                  content={inlineNode}
                  baseHeading={baseHeading}
                  changeKey={changeKey}
                />
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
          const Tag = `h${content.attributes.level + baseHeading}` as "h1";

          return (
            <div style={{ fontSize: "0.6rem" }}>
              <RenderInlineGroup
                inlines={content.value}
                Tag={Tag}
                tagClassName={heading}
                translationKey={changeKey}
              />
            </div>
          );

        case "paragraph":
          return (
            <RenderInlineGroup
              inlines={content.value}
              Tag={"p"}
              tagClassName={paragraph}
              translationKey={changeKey}
            />
          );

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
  changeKey,
}: { content: LLBlockLeafLLBlockBranchContentExpandTitle; changeKey: string }) {
  return (
    <RenderInlineGroup
      inlines={content.value}
      Tag={"h3"}
      translationKey={changeKey}
    />
  );
}
