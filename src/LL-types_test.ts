import { LLContentDocument } from "./LL-types";

export const document = {
  group: "block-branch",
  type: "document",
  value: [
    {
      group: "block-leaf",
      type: "heading",
      attributes: {
        level: 1,
      },
      value: [
        {
          group: "inline-leaf",
          type: "text",
          value: "Heading",
        },
      ],
    },
    {
      group: "block-leaf",
      type: "paragraph",
      value: [
        {
          group: "inline-leaf",
          type: "text",
          value: "Hello",
        },
      ],
    },
    {
      group: "block-branch",
      type: "expand",
      value: [
        {
          group: "block-leaf",
          type: "expand-title",
          value: [
            {
              group: "inline-leaf",
              type: "text",
              value: "Expand title",
            },
          ],
        },
        {
          group: "block-leaf",
          type: "paragraph",
          value: [
            {
              group: "inline-leaf",
              type: "text",
              value: "Expand content",
            },
          ],
        },
      ],
    },
  ],
} satisfies LLContentDocument;
