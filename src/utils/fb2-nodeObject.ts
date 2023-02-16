export type FictionBookNode = {
  type: "node";
  kind: "FictionBook";
  attributes: {
    ["xmlns"]: string;
    ["xmlns:l"]: string;
  };

  value: [
    DescriptionNode,
    BodyNode,
    ...DescriptionNode[],
  ];
};

export type DescriptionNode = {
  type: "node";
  kind: "description";
  value: (
    | Title_infoNode
    | Document_infoNode
    | Publish_infoNode
    | Custom_infoNode
  )[];
};

export type Title_infoNode = {
  type: "node";
  kind: "title-info";
  value: (
    | GenreNode
    | AuthorNode
    | Book_titleNode
    | AnnotationNode
    | DateNode
    | CoverpageNode
    | LangNode
    | Src_langNode
    | SequenceNode
  )[];
};

export type GenreNode = {
  type: "node";
  kind: "genre";
  value: TextNode[];
};

export type AuthorNode = {
  type: "node";
  kind: "author";
  value: (
    | First_nameNode
    | Middle_nameNode
    | Last_nameNode
  )[];
};

export type First_nameNode = {
  type: "node";
  kind: "first-name";
  value: TextNode[];
};

export type Last_nameNode = {
  type: "node";
  kind: "last-name";
  value: TextNode[];
};

export type Book_titleNode = {
  type: "node";
  kind: "book-title";
  value: TextNode[];
};

export type AnnotationNode = {
  type: "node";
  kind: "annotation";
  value: PNode[];
};

export type StyleNode = {
  type: "node";
  kind: "style";
  attributes: {
    ["name"]: string;
  };

  value: TextNode[];
};

export type DateNode = {
  type: "node";
  kind: "date";
  attributes: {
    ["value"]: string;
  };

  value: TextNode[];
};

export type CoverpageNode = {
  type: "node";
  kind: "coverpage";
  value: ImageNode[];
};

export type LangNode = {
  type: "node";
  kind: "lang";
  value: TextNode[];
};

export type Src_langNode = {
  type: "node";
  kind: "src-lang";
  value: TextNode[];
};

export type SequenceNode = {
  type: "node";
  kind: "sequence";
  attributes: {
    ["name"]: string;
    ["number"]: string;
  };

  value: [];
};

export type Document_infoNode = {
  type: "node";
  kind: "document-info";
  value: (
    | AuthorNode
    | Program_usedNode
    | DateNode
    | Src_ocrNode
    | IdNode
    | VersionNode
  )[];
};

export type Middle_nameNode = {
  type: "node";
  kind: "middle-name";
  value: TextNode[];
};

export type Program_usedNode = {
  type: "node";
  kind: "program-used";
  value: TextNode[];
};

export type Src_ocrNode = {
  type: "node";
  kind: "src-ocr";
  value: TextNode[];
};

export type IdNode = {
  type: "node";
  kind: "id";
  value: TextNode[];
};

export type VersionNode = {
  type: "node";
  kind: "version";
  value: TextNode[];
};

export type Publish_infoNode = {
  type: "node";
  kind: "publish-info";
  value: (
    | Book_nameNode
    | PublisherNode
    | CityNode
    | YearNode
    | IsbnNode
    | SequenceNode
  )[];
};

export type Book_nameNode = {
  type: "node";
  kind: "book-name";
  value: TextNode[];
};

export type PublisherNode = {
  type: "node";
  kind: "publisher";
  value: TextNode[];
};

export type CityNode = {
  type: "node";
  kind: "city";
  value: TextNode[];
};

export type YearNode = {
  type: "node";
  kind: "year";
  value: TextNode[];
};

export type IsbnNode = {
  type: "node";
  kind: "isbn";
  value: TextNode[];
};

export type Custom_infoNode = {
  type: "node";
  kind: "custom-info";
  attributes: {
    ["info-type"]: string;
  };

  value: TextNode[];
};

export type BodyNode = {
  type: "node";
  kind: "body";
  value: [
    TitleNode,
    ...SectionNode[],
  ];
};

export type ImageNode = {
  type: "node";
  kind: "image";
  attributes: {
    ["l:href"]: string;
  };
};

export type BinaryNode = {
  type: "node";
  kind: "binary";
  attributes: {
    ["id"]: string;
    ["content-type"]: string;
  };

  value: TextNode[];
};

export type TitleNode = {
  type: "node";
  kind: "title";
  value: PNode[];
};

export type SectionNode = {
  type: "node";
  kind: "section";
  value: [
    TitleNode,
    ...(Empty_lineNode | PNode | CiteNode)[],
  ];
};

export type Empty_lineNode = {
  type: "node";
  kind: "empty-line";
  value: [];
};

export type CiteNode = {
  type: "node";
  kind: "cite";
  value: (Empty_lineNode | PNode)[];
};

export type PNodeValue =
  | StrongNode
  | TextNode
  | ImageNode
  | StyleNode
  | EmphasisNode;

export type PNode = {
  type: "node";
  kind: "p";
  value: PNodeValue[];
};

export type StrongNode = {
  type: "node";
  kind: "strong";
  value: TextNode[];
};

export type EmphasisNode = {
  type: "node";
  kind: "emphasis";
  value: TextNode[];
};

export type TextNode = {
  type: "text";
  characters: string;
};

export type FictionBookNodeObject =
  | FictionBookNode
  | DescriptionNode
  | Title_infoNode
  | GenreNode
  | AuthorNode
  | First_nameNode
  | Last_nameNode
  | Book_titleNode
  | AnnotationNode
  | StyleNode
  | DateNode
  | CoverpageNode
  | LangNode
  | Src_langNode
  | SequenceNode
  | Document_infoNode
  | Middle_nameNode
  | Program_usedNode
  | Src_ocrNode
  | IdNode
  | VersionNode
  | Publish_infoNode
  | Book_nameNode
  | PublisherNode
  | CityNode
  | YearNode
  | IsbnNode
  | Custom_infoNode
  | BodyNode
  | ImageNode
  | BinaryNode
  | TitleNode
  | SectionNode
  | Empty_lineNode
  | PNode
  | StrongNode
  | EmphasisNode
  | CiteNode
  | TextNode;
