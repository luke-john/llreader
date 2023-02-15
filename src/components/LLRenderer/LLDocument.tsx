import { Fragment, useRef } from "react";

import { RenderInlineGroup } from "./LLInlineGroup";
import {
  LLBlockCommon,
  LLBlockLeafLLBlockBranchContentExpandTitle,
  LLContentDocument,
} from "../../LL-types";

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
