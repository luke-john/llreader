import { Fragment, useCallback, useEffect, useRef } from "react";
import { LLInline } from "../../LL-types";

import "./LLInlineGroup.styles.css";

export function RenderInlineGroup(
  { inlines, Tag, extraPadding = 0 }: {
    inlines: LLInline[];
    Tag: string;
    /** TODO cleanup positioning system */
    extraPadding?: number;
  },
) {
  // the use of HTMLDivElement is to avoid typescript complaints,
  // in practice it could be any HTMLElement
  const domRef = useRef<HTMLDivElement>(null);
  useTranslationPadding(domRef);
  const BetterTypedTag = Tag as "div";

  return (
    <div
      style={{
        position: "relative",
        width: "504px",
        lineHeight: "2.5",
        padding: 0,
      }}
      ref={domRef}
    >
      <div style={{ position: "relative", zIndex: 1 }} data-translation={false}>
        <BetterTypedTag>
          {inlines.map((inlineNode, i) => (
            <RenderLLInline key={i} content={inlineNode} translation={false} />
          ))}
        </BetterTypedTag>
      </div>
      <div
        className="translation"
        style={{
          position: "absolute",
          top: `${extraPadding}px`,
          color: "rgb(227, 222, 222)",
          zIndex: 0,
          // visibility: "hidden",
        }}
      >
        <BetterTypedTag ref={domRef}>
          {inlines.map((inlineNode, i) => (
            <RenderLLInline key={i} content={inlineNode} translation={true} />
          ))}
        </BetterTypedTag>
      </div>
    </div>
  );
}

function RenderLLInline(
  { content, translation }: { content: LLInline; translation: boolean },
) {
  switch (content.type) {
    case "text":
      return <RenderLLText text={content.value} translation={translation} />;
    case "link":
      return (
        <a href={content.destination}>
          {content.value.map((inlineNode, i) => (
            <RenderLLInline
              key={i}
              content={inlineNode}
              translation={translation}
            />
          ))}
        </a>
      );
    case "image":
      return (
        <>
          <br />
          <img src={content.src} />
          <br />
        </>
      );
    case "line-break":
      return <br />;

    default:
      throw new Error(`Unknown inline type: ${
        // @ts-ignore
        content.type}`);
  }
}

function RenderLLText(
  { text, translation }: { text: string; translation: boolean },
) {
  const sentenceEndMatches = [...text.matchAll(/(\. |— |\? |! |: |, )/gm)];
  let texts: string[] = [];

  if (sentenceEndMatches.length === 0) {
    texts.push(text);
  } else {
    let completedUntil = 0;
    for (const sentenceEndMatch of sentenceEndMatches) {
      texts.push(text.substring(completedUntil, sentenceEndMatch.index! + 2));
      completedUntil = sentenceEndMatch.index! + 2;
    }
    texts.push(text.substring(completedUntil));
  }

  texts = texts.filter((text) => text.trim() !== "");

  return (
    <>
      {texts.map((text, index) => (
        <Fragment key={index}>
          <span
            data-translation={translation}
            className={translation ? "" : "notranslate"}
          >
            {text}
          </span>
          <span className={"sentenceBreaker"}></span>
        </Fragment>
      ))}
    </>
  );
}

export const useTranslationPadding = (
  domRef: React.RefObject<HTMLDivElement>,
) => {
  let translated = false;
  const observerCallback = useCallback((mutations: MutationRecord[]) => {
    for (let mutation of mutations) {
      if (
        mutation.type === "characterData" ||
        (mutation.type === "childList" && mutation.addedNodes.length > 0)
      ) {
        if (!translated) {
          translated = true;
          decorateFollowingTranslation(domRef.current!);
        }
      }
    }
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(observerCallback);
    if (domRef.current) {
      observer.observe(domRef.current, {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return;
};

async function decorateFollowingTranslation(domElement: HTMLDivElement) {
  const untranslated = (domElement.childNodes[0] as HTMLElement)
    .childNodes[0] as HTMLElement;
  const translated = (domElement.childNodes[1] as HTMLElement)
    .childNodes[0] as HTMLElement;

  // remove the visibility: hidden style from the translated element
  // (domElement.childNodes[1] as HTMLElement).style.visibility = "visible";

  const untranslatedTextDescendants = getTextDescendants(untranslated);
  const translatedTextDescendants = getTextDescendants(translated);

  if (untranslatedTextDescendants.length !== translatedTextDescendants.length) {
    throw new Error("untranslated and translated text descendants differ");
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  for (let i = 0; i < untranslatedTextDescendants.length; i++) {
    const untranslatedTextDescendant = untranslatedTextDescendants[i];
    const translatedTextDescendant = translatedTextDescendants[i];

    lineUpElementEnds(untranslatedTextDescendant, translatedTextDescendant);
    // await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

function lineUpElementEnds(untranslated: HTMLElement, translated: HTMLElement) {
  const untranslatedTextWidthAcrossLines = getElementTextWidthAcrossLines(
    untranslated,
  );

  const translatedTextWidthAcrossLines = getElementTextWidthAcrossLines(
    translated,
  );

  const smallest =
    untranslatedTextWidthAcrossLines < translatedTextWidthAcrossLines
      ? "untranslated"
      : "translated";
  const smallestElement = smallest === "untranslated"
    ? untranslated
    : translated;

  const difference = Math.abs(
    untranslatedTextWidthAcrossLines - translatedTextWidthAcrossLines,
  );

  const underscoresToAdd = Math.floor(
    difference / getUnderscoreWidth(smallestElement),
  );

  addUnderscoresNextToElementToLineUpWidths(
    smallestElement,
    underscoresToAdd,
  );
}

function addUnderscoresNextToElementToLineUpWidths(
  element: HTMLElement,
  underscoresToAdd: number,
) {
  const underscoreContainer = document.createElement("span");
  underscoreContainer.textContent = "_".repeat(underscoresToAdd);
  // add word-break break-all and visibility hidden to the container
  underscoreContainer.style.wordBreak = "break-all";
  underscoreContainer.style.visibility = "hidden";

  // insert container adjacent to element
  element.insertAdjacentElement("afterend", underscoreContainer);
}

function getUnderscoreWidth(originalElement: HTMLElement) {
  const clone = originalElement.cloneNode(true) as HTMLElement;
  clone.textContent = "_";

  document.body.appendChild(clone);

  const width = clone.clientWidth;

  document.body.removeChild(clone);

  return width;
}

function getElementTextWidthAcrossLines(element: HTMLElement): number {
  const parentWidth = getParentContentWidth(element);
  const { start, end } = getStartAndEndPositions(element);

  const lines = getSpanLines(element);

  if (lines === 1) {
    return end - start;
  }
  if (lines === 2) {
    const firstLineLength = parentWidth - start;
    const secondLineLength = parentWidth - (parentWidth - end);
    const totalLength = firstLineLength + secondLineLength;

    return totalLength;
  }

  const firstLineLength = parentWidth - start;
  const middleLineLengths = parentWidth * (lines - 2);
  const lastLineLength = parentWidth - (parentWidth - end);

  return firstLineLength + middleLineLengths + lastLineLength;
}

function getStartAndEndPositions(element: HTMLElement) {
  const parentLeft = element.offsetParent!.getBoundingClientRect().left;

  const range = new Range();
  range.setStart(element, 0);
  range.setEnd(element, 1);
  const rangeClientRects = range.getClientRects();
  const textStart = rangeClientRects[0].left;

  const textEnd = rangeClientRects[rangeClientRects.length - 1].right;

  return {
    start: textStart - parentLeft,
    end: textEnd - parentLeft,
  };
}

function getSpanLines(element: HTMLElement) {
  const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
  const elementHeight = element.getBoundingClientRect().height;
  const lines = Math.ceil(elementHeight / lineHeight);

  return lines;
}

function getParentContentWidth(element: HTMLElement) {
  const parent = element.offsetParent! as HTMLParagraphElement;
  const parentWidth = parent.clientWidth;
  const parentComputedStyle = getComputedStyle(parent);
  const parentPadding = parseFloat(parentComputedStyle.paddingLeft) +
    parseFloat(parentComputedStyle.paddingRight);
  const parentContentWidth = parentWidth - parentPadding;

  return parentContentWidth;
}

function getTextDescendants(element: HTMLElement) {
  const textDescendants: HTMLElement[] = [];
  const walk = (node: Node) => {
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.parentNode instanceof HTMLElement &&
      node.parentNode.childNodes.length === 1
    ) {
      textDescendants.push(node.parentNode);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (const child of node.childNodes) {
        walk(child);
      }
    }
  };

  walk(element);

  return textDescendants;
}
