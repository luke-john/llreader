import { FictionBookNodeObject } from "./fb2-nodeObject";

export async function loadFB2File(file: File): Promise<Document> {
  const text = await file.text();
  const firstLine = text.slice(0, text.indexOf("\n"));

  const regex = /encoding="(?<encoding>.*)"/gm;
  const match = regex.exec(firstLine);
  if (!match?.groups?.encoding) {
    throw new Error("Encoding not found");
  }
  const encoding = match.groups.encoding;

  const decoder = new TextDecoder(encoding);
  const arrayBuffer = await file.arrayBuffer();
  const decodedText = decoder.decode(arrayBuffer);

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(decodedText, "text/xml");

  return xmlDoc;
}

/**
 * helper function to get the text content of a node in an xml document
 */
export function getTextContent(
  document: Document | HTMLElement,
  tagName: string,
): string | undefined {
  const node = document.getElementsByTagName(tagName)[0];
  if (node) {
    return node.textContent || undefined;
  }
  return undefined;
}

export function cleanTextContent(
  textContent: string | undefined,
): string | undefined {
  if (!textContent) {
    return undefined;
  }
  return textContent
    .replace(/(\r\n|\n|\r)/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type FictionBookNodeKind = Extract<
  FictionBookNodeObject,
  { type: "node" }
>["kind"];
/**
 * takes a fiction book, and returns a nested value by a key path
 */
export function getNestedValue<
  FinalPath extends FictionBookNodeKind,
  FinalPosition extends number | "*",
>(
  fictionBookObject: FictionBookNodeObject,
  keyPath: [
    ...{ kind: FictionBookNodeKind; position: number }[],
    { kind: FinalPath; position: FinalPosition },
  ],
): FinalPosition extends "*"
  ? Extract<FictionBookNodeObject, { kind: FinalPath }>[] | undefined
  : Extract<FictionBookNodeObject, { kind: FinalPath }> | undefined {
  if (!("value" in fictionBookObject)) {
    throw new Error("not a node object");
  }

  const [firstPath, ...remainingPath] = keyPath;

  let { kind, position } = firstPath;

  // @ts-ignore
  const matches = fictionBookObject.value.filter((entry) =>
    entry.type === "node" && entry.kind === kind
  );

  if (position === "*") {
    // @ts-ignore
    return matches;
  }

  // @ts-ignore
  const matched = matches[position];

  if (!matched) {
    return undefined;
  }

  if (remainingPath.length === 0) {
    return matched;
  }

  // @ts-ignore
  return getNestedValue(matched, keyPath.slice(1));
}

export function getNestedTextContentForMultipleNodes(
  nodes: FictionBookNodeObject[],
) {
  return nodes.map(getNestedTextContent).filter((entry) => !!entry).join(" ");
}

export function getNestedTextContent(
  nodeObject: FictionBookNodeObject,
): string | string[] | undefined {
  if (nodeObject.type === "text") {
    return nodeObject.characters;
  }
  if ("value" in nodeObject) {
    const nestedTextContents = nodeObject.value.map((item) => {
      return getNestedTextContent(item);
    }).filter((entry) => !!entry).flat() as string[];

    return nestedTextContents;
  }

  return undefined;
}
