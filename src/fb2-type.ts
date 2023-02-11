type Content_strong = {
  strong: Content__text;
};
type Content__text = {
  _text: string;
};
type Content_image = {
  image: {
    _attributes: {
      "l:href": string;
    };
  };
};

export type ContentItem = Content_strong | Content__text | Content_image;

export type Section = {
  title: {
    p: ContentItem[] | ContentItem;
    "empty-line": {} | {}[];
  };
  p: ContentItem[];
};

export type FB2 = {
  FictionBook: {
    description: {
      "title-info": {
        genre: string;
        author: {
          "first-name": Content__text;
          "last-name": Content__text;
        };
        "book-title": Content__text;
        annotation: ContentItem;
        coverpage: Content_image;
        lang: Content__text;
        "src-lang": Content__text;
        sequence: {
          _attributes: {
            name: string;
            number: string;
          };
        };
      };
      "publish-info": {
        bookname: Content__text;
        publisher: Content__text;
        city: Content__text;
        year: Content__text;
        isbn: Content__text;
      };
    };
    body: {
      title: {
        p: ContentItem[] | ContentItem;
        "empty-line": {} | {}[];
      };
      section: Section[];
      "empty-line": {} | {}[];
    };
  };
};

export type Meta = {
  title: string;
  author: {
    firstName: string;
    lastName: string;
  };
  lang: string;
};
