import { elementToNodeObject, NodeObjectValue } from "../xmlToJS";

export function elementToNodeObjectType(element: Element) {
  const nodeObject = elementToNodeObject(element);
  console.log(nodeObject);

  const results: { [nodeName: string]: any[] } = {};
  traverseNodeObject(
    nodeObject,
    (nodeObject) => {
      if (nodeObject.type === "text") {
        return;
      }

      if (!results[getNodeObjectTypeName(nodeObject)]) {
        results[getNodeObjectTypeName(nodeObject)] = [];
      }
      results[getNodeObjectTypeName(nodeObject)].push(
        toTypescriptType(nodeObject),
      );
    },
  );

  // console.log(results);

  const easyConversion = [];
  const resultKeys = Object.keys(results);
  for (const key of resultKeys) {
    const result = results[key];
    if (key === "Strong") {
      easyConversion.push(
        ...result.filter((result) =>
          result !== `type P = {
  ['p']: {
      children: TextNode[]
  }
}` &&
          result !== `type P = {
  ['p']: {
      children: Strong[]
  }
}` &&
          result !== `type Strong = {
  ['strong']: {
      children: TextNode[]
  }
}`
        ),
      );
    }
  }
  console.log(easyConversion.join("\n\n\n"));
}

function traverseNodeObject(
  nodeObjectValue: NodeObjectValue,
  callback: (nodeObjectValue: NodeObjectValue) => void,
) {
  callback(nodeObjectValue);
  const nodeName = Object.keys(nodeObjectValue)[0];

  if (nodeObjectValue.type === "text") {
    return;
  }

  // @ts-ignore
  const children = nodeObjectValue[nodeName].value;
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        traverseNodeObject(child, callback);
      });
    }
  }
}

/** takes a dash seperated string and returns a valid typescript type name with the first letter capitalised and any dashes replaced with an underscore */
function getNodeObjectTypeName(nodeObjectValue: NodeObjectValue) {
  if (nodeObjectValue.type === "text") {
    return "TextNode";
  }

  const nodeName = Object.keys(nodeObjectValue)[0];
  return (nodeName.charAt(0).toUpperCase() + nodeName.slice(1))
    .split("-")
    .join("_");
}

function toTypescriptType(nodeObject: NodeObject) {
  const nodeName = Object.keys(nodeObject)[0];

  const attributes = nodeObject[nodeName].attributes;
  let attributesType = "";

  if (attributes) {
    attributesType = Object.keys(attributes)
      .map((attributeName) => {
        return `      ['${attributeName}']: ${typeof attributes[
          attributeName
        ]};`;
      })
      .join("\n");
    attributesType = `    attributes: {
${attributesType}
    }`;
  }

  const children = nodeObject[nodeName].value;
  let childrenType = "";
  if (children) {
    if (children.length === 1) {
      childrenType = `      children: ${getNodeObjectTypeName(children[0])}[]`;
    } else {
      childrenType = `    children: [
${
        children.map((child) => {
          return `      ${getNodeObjectTypeName(child)}`;
        }).join(",\n")
      }
    ]`;
    }
  }

  return `
type ${getNodeObjectTypeName(nodeObject)} = {
  ['${nodeName}']: {
${attributesType !== "" ? attributesType : ""}${
    (attributesType && childrenType) ? "\n" : ""
  }${childrenType !== "" ? childrenType : ""}
  }
}
`.trim();
}
