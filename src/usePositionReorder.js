import { useState, useRef } from "react";
import { clamp } from "./helper/clamp";
import { distance } from "./helper/distance";
import { arrayMoveImmutable } from "./helper/arrayMove";

export function usePositionReorder(initialState) {
  const [order, setOrder] = useState(initialState);
  // console.log(order);

  // We need to collect an array of height and position data for all of this component's
  // `Item` children, so we can later us that in calculations to decide when a dragging
  // `Item` should swap places with its siblings.
  const positions = useRef([]).current;
  // console.log("positions: ", positions);
  const updatePosition = (i, offset) => {
    // console.log("i: ", i);
    console.log("offset: ", offset);
    // offset.top = offset.top;
    positions[i] = offset;
  };

  // Find the ideal index for a dragging item based on its position in the array, and its
  // current drag offset. If it's different to its current index, we swap this item with that
  // sibling.
  const updateOrder = (i, dragXOffset, dragYOffset) => {
    const targetIndex = findIndex(i, dragXOffset, dragYOffset, positions);
    if (targetIndex !== i) setOrder(arrayMoveImmutable(order, i, targetIndex));
  };

  return [order, updatePosition, updateOrder];
}

const buffer = 0;

export const findIndex = (i, xOffset, yOffset, positions) => {
  console.log("find index xOffset: ", xOffset);
  console.log("find index yOffset: ", yOffset);
  let target = i;
  const { top, width, height, left } = positions[i];
  // console.log("left", left);
  const bottom = top + height;
  const right = left + width;
  // going right is x positive
  // going down is y positive

  // If going up
  if (yOffset < 0 && Math.abs(yOffset) > Math.abs(xOffset)) {
    const prevItem = positions[i - 3];
    if (prevItem === undefined) return i;
    const prevBottom = prevItem.top + prevItem.height;
    const ySwapOffset =
      distance(top, prevBottom - prevItem.height / 2) + buffer;
    if (yOffset < -ySwapOffset) target = i - 3;
  } else if (yOffset > 0 && Math.abs(yOffset) > Math.abs(xOffset)) {
    // going down
    const nextItem = positions[i + 3];
    if (nextItem === undefined) return i;
    const ySwapOffset =
      distance(bottom, nextItem.top + nextItem.height / 2) + buffer;
    if (yOffset > ySwapOffset) target = i + 3;
    // If moving left
  } else if (xOffset < 0 && Math.abs(xOffset) > Math.abs(yOffset)) {
    const prevItem = positions[i - 1];
    if (prevItem === undefined) return i;
    const prevRight = prevItem.left + prevItem.width;
    const xSwapOffset = distance(left, prevRight - prevItem.width / 2) + buffer;
    if (xOffset < -xSwapOffset) target = i - 1;
    // If moving right
  } else if (xOffset > 0 && Math.abs(xOffset) > Math.abs(yOffset)) {
    const nextItem = positions[i + 1];
    if (nextItem === undefined) return i;
    const xSwapOffset =
      distance(right, nextItem.left + nextItem.width / 2) + buffer;
    if (xOffset > xSwapOffset) target = i + 1;
  }

  return clamp(0, positions.length, target);
};
