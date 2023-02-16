import {
  BinaryNode,
  CiteNode,
  Empty_lineNode,
  ImageNode,
  PNode,
  PNodeValue,
  SectionNode,
  StrongNode,
  StyleNode,
  TextNode,
  TitleNode,
} from "./fb2-nodeObject";
import {
  LLBlockCommon,
  LLBlockLeafCite,
  LLContentDocument,
  LLInline,
  LLInlineTextMark,
} from "../LL-types";
import { getNestedTextContent } from "./fb2utils";

export function convertSectionNodeToLL({ sectionNode, binaryNodes }: {
  sectionNode: SectionNode;
  binaryNodes: BinaryNode[];
}): LLContentDocument {
  const value = sectionNode.value.map((subNode) =>
    convertNodeValueToLLValue({ node: subNode, binaryNodes })
  );

  return {
    group: "block-branch",
    type: "document",
    value,
  };
}

function convertNodeValueToLLValue(
  { node, binaryNodes }: {
    node: Empty_lineNode | PNode | CiteNode | TitleNode | ImageNode;
    binaryNodes: BinaryNode[];
  },
): LLBlockCommon {
  switch (node.kind) {
    // block-leafs
    case "title":
      const values = node.value.reduce(
        (acc, pNode) =>
          acc.concat(convertPNodeToLL({ node: pNode, binaryNodes })),
        [] as LLInline[],
      );
      const paddedValues = values.map((inline, index) => {
        const previouseInline = values[index - 1];
        if (
          previouseInline && previouseInline.type === "text" &&
          inline.type === "text"
        ) {
          previouseInline.value = `${previouseInline.value} `;
        }
        return inline;
      });
      return {
        group: "block-leaf" as const,
        type: "heading" as const,
        attributes: {
          level: 1 as const,
        },
        value: paddedValues,
      };
    case "p":
      if (
        node.value.length === 1 && node.value[0].type === "node" &&
        node.value[0].kind === "image"
      ) {
        const imageNode = node.value[0];

        return {
          group: "block-leaf" as const,
          type: "image" as const,
          src: getImageSrc({
            imageId: imageNode.attributes["l:href"],
            binaryNodes,
          }) || "failed",
        };
      }
      return {
        group: "block-leaf" as const,
        type: "paragraph" as const,
        value: node.value.reduce(
          (acc, pNodeValue) =>
            acc.concat(
              convertPNodeValueToLL({ node: pNodeValue, binaryNodes }),
            ),
          [] as LLInline[],
        ),
      };
    case "empty-line":
      return {
        group: "block-leaf" as const,
        type: "empty-line" as const,
      };
      // block-branches
    case "cite":
      return {
        group: "block-branch" as const,
        type: "quote" as const,
        value: node.value.map((node) => {
          return convertNodeValueToLLValue({ node, binaryNodes });
        }),
      } satisfies LLBlockLeafCite;
    case "image":
      return {
        group: "block-leaf" as const,
        type: "image" as const,
        src: getImageSrc({
          imageId: node.attributes["l:href"],
          binaryNodes,
        }) || "failed",
      };

    default:
      console.warn(node);
      // @ts-ignore
      throw new Error(`Unsupported node kind: ${node.kind}`);
  }
}

function convertPNodeToLL(
  { node, binaryNodes }: { node: PNode; binaryNodes: BinaryNode[] },
): LLInline[] {
  return node.value.reduce(
    (acc, pNodeValue) =>
      acc.concat(convertPNodeValueToLL({ node: pNodeValue, binaryNodes })),
    [] as LLInline[],
  );
}

function getImageSrc(
  { imageId, binaryNodes }: { imageId: string; binaryNodes: BinaryNode[] },
) {
  const binaryNode = binaryNodes.find((binaryNode) => {
    return `#${binaryNode.attributes.id}` === imageId;
  });

  if (!binaryNode) {
    return "failed";
  }

  const binaryValue = [getNestedTextContent(binaryNode)].flat().join(
    "",
  );

  return `data:${binaryNode.attributes["content-type"]};base64,${binaryValue}`;
}

function convertPNodeValueToLL(
  { node, binaryNodes }: {
    node: PNodeValue;
    binaryNodes: BinaryNode[];
  },
): LLInline[] {
  switch (node.type) {
    case "node":
      switch (node.kind) {
        case "strong":
          return node.value.reduce(
            (acc, textNode) =>
              acc.concat(
                convertTextNodeToLL(textNode, { marks: [{ type: "strong" }] }),
              ),
            [] as LLInline[],
          );
        case "image":
          const imageSrc = getImageSrc({
            imageId: node.attributes["l:href"],
            binaryNodes,
          });

          return [{
            group: "inline-leaf" as const,
            type: "image" as const,
            src: imageSrc,
          }];
        case "emphasis":
          return node.value.reduce(
            (acc, textNode) =>
              acc.concat(
                convertTextNodeToLL(textNode, {
                  marks: [{ type: "emphasis" }],
                }),
              ),
            [] as LLInline[],
          );
        default:
          console.warn(node);
          throw new Error(`Unsupported node kind: ${node.kind}`);
      }
    case "text":
      return convertTextNodeToLL(node, { marks: [] });
    default:
      console.warn(node);
      // @ts-ignore
      throw new Error(`Unsupported node type: ${node.type}`);
  }
}

function convertTextNodeToLL(
  node: TextNode,
  { marks }: { marks: LLInlineTextMark[] },
): LLInline[] {
  const text = node.characters;
  const lines = text.split("\n");

  const result = lines.reduce((acc, line, index) => {
    if (index === 0) {
      return acc.concat({
        group: "inline-leaf",
        type: "text",
        marks,
        value: line,
      });
    }

    return acc.concat({
      group: "inline-leaf",
      type: "line-break",
    }).concat({
      group: "inline-leaf",
      type: "text",
      marks,
      value: line,
    });
  }, [] as LLInline[]);
  return result;
}
