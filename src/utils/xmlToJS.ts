export type NodeObject = {
  type: "node";
  kind: string;

  attributes?: { [key: string]: string };
  value: NodeObjectValue[];
};

export type NodeObjectValue =
  | NodeObject
  | NodeText;

export type NodeText = {
  type: "text";
  characters: string;
};

export function elementToNodeObject(node: Element): NodeObject {
  const nodeObject: NodeObject = {
    type: "node",
    kind: node.nodeName,
    value: parseNodeChildren(node),
  };

  const attributes = [...node.attributes];
  if (attributes.length) {
    nodeObject.attributes = {};
    [...node.attributes].forEach((attribute) => {
      nodeObject.attributes![attribute.name] = attribute.value;
    });
  }

  return nodeObject;
}

function parseNodeChildren(node: Element): NodeObjectValue[] {
  const values = [...node.childNodes].map((nodeChild: ChildNode) => {
    if (nodeChild.nodeType === Node.TEXT_NODE) {
      const content = nodeChild.textContent!.trim();
      if (content === "") return null;
      return {
        type: "text" as const,
        characters: nodeChild.textContent!,
      };
    } else {
      return elementToNodeObject(nodeChild as Element);
    }
  }).filter((value) => value !== null) as NodeObjectValue[];

  return values;
}
