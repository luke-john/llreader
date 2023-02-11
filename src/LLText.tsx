import { useCallback, useEffect } from "react";

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
