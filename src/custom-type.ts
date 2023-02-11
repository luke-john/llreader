// Block nodes
// These can;
// - be a block leaf node
//  - leaf block nodes can contain inline nodes or have their content driven by other properties
// - be a block branch node
//  - branch block nodes can contain either leaf block nodes or nestable block branch nodes

// Block branch nodes
// These can contain either leaf block nodes or nestable block branch nodes

export type LLContentDocument = {
  group: "block-branch";
  type: "document";
  value: LLBlockCommon[];
};

// Nestable block-branch nodes

export type LLBlockBranchNestable =
  | LLBlockBranchContentExpand
  | LLBlockLeafCite;

export type LLBlockBranchContentExpand = {
  group: "block-branch";
  type: "expand";
  value: [LLBlockLeafLLBlockBranchContentExpandTitle, ...LLBlockCommon[]];
};

export type LLBlockLeafCite = {
  group: "block-branch";
  type: "quote";
  value: LLBlockCommon[];
};

// Common block nodes
export type LLBlockCommon = LLBlockBranchNestable | LLBlockLeafCommon;

// Block leaf nodes
// These can only go inside a block branch node
// They can either contain
// - inline nodes
// - or have their content driven by other properties

export type LLBlockLeafLLBlockBranchContentExpandTitle = {
  group: "block-leaf";
  type: "expand-title";
  value: LLInline[];
};

// Common block leaf nodes
// These are commonly used in content nodes

export type LLBlockLeafCommon =
  | LLBlockLeafImage
  | LLBlockLeafEmptyLine
  | LLBlockLeafHeading
  | LLBlockLeafParagraph;

export type LLBlockLeafImage = {
  group: "block-leaf";
  type: "image";
  src: string;
};

export type LLBlockLeafEmptyLine = {
  group: "block-leaf";
  type: "empty-line";
};

export type LLBlockLeafHeading = {
  group: "block-leaf";
  type: "heading";
  attributes: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
  value: LLInline[];
};

export type LLBlockLeafParagraph = {
  group: "block-leaf";
  type: "paragraph";
  value: LLInline[];
};

// Inline nodes
// These can go inside block-leafs that take inline nodes
// They can;
// - be a leaf node (inline-branch)
//  - be text
//  - or have their inner content driven by other properties
// - or have inner content (inline-branch)
//  - inline-branch nodes can only contain inline nodes

export type LLInline = LLText | LLInlineLeaf | LLInlineBranch;

// Inline content nodes
// these have inner text
export type LLInlineBranch = LLInlineContentLink;

export type LLInlineContentLink = {
  group: "inline-branch";
  type: "link";
  destination: string;
  value: LLInline[];
};

// Inline block nodes (leafs)
// the content of these is driven by other properties
export type LLInlineLeaf = LLInlineLineBreak | LLInlineImage;

export type LLInlineLineBreak = {
  group: "inline-leaf";
  type: "line-break";
};

export type LLInlineImage = {
  group: "inline-leaf";
  type: "image";
  src: string;
};

// Text
// This can only go inside inline nodes

export type LLText = {
  group: "inline-leaf";
  type: "text";
  marks?: LLInlineTextMark[];
  value: string;
};

// Text marks
// These are attached to LLInlineText nodes

export type LLInlineTextMarkStrong = {
  type: "strong";
};

export type LLInlineTextMarkItalic = {
  type: "emphasis";
};

export type LLInlineTextMark = LLInlineTextMarkStrong | LLInlineTextMarkItalic;
