import { useState } from "react";
import { motion } from "framer-motion";
import { usePositionReorder } from "./usePositionReorder";
import { useMeasurePosition } from "./useMeasurePosition";

/**
 * This is an example of drag-to-reorder in Framer Motion 2.
 *
 * By applying both drag and layout props to a component, if it changes place
 * in the DOM it'll either animate to its new position (if not dragging) or
 * stay stuck to the user's cursor (if dragging).
 */

export default function App() {
  const [order, updatePosition, updateOrder] = usePositionReorder(items);

  // console.log("app", order);
  return (
    <div className="container">
      {order.map((item, i) => (
        <Item
          key={item.id}
          // height={item.height}
          i={i}
          updatePosition={updatePosition}
          updateOrder={updateOrder}
          item={item}
        />
      ))}
    </div>
  );
}

function Item({ i, updatePosition, updateOrder, item }) {
  const [isDragging, setDragging] = useState(false);

  const ref = useMeasurePosition((pos) => updatePosition(i, pos));

  return (
    <motion.div
      className=""
      ref={ref}
      layout
      initial={false}
      style={{
        background: "white",
        height: item.height,
        width: item.width,
        borderRadius: 5,
        zIndex: isDragging ? 3 : 1,
        margin: 2
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 3px 3px rgba(0,0,0,0.15)"
      }}
      whileTap={{
        scale: 1.12,
        boxShadow: "0px 5px 5px rgba(0,0,0,0.1)"
      }}
      drag
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onViewportBoxUpdate={(_viewportBox, delta) => {
        console.log("viewportbox: ", _viewportBox.x, _viewportBox.y);
        // going right is x positive
        // going down is y positive
        // console.log("delta: ", delta.x.translate, delta.y.translate);
        isDragging && updateOrder(i, delta.x.translate, delta.y.translate);
      }}
    >
      {item.id}
    </motion.div>
  );
}

const items = [
  { height: 100, width: 100, id: 1 },
  { height: 100, width: 100, id: 2 },
  { height: 100, width: 100, id: 3 },
  { height: 100, width: 100, id: 4 },
  { height: 100, width: 100, id: 5 },
  { height: 100, width: 100, id: 6 },
  { height: 100, width: 100, id: 7 },
  { height: 100, width: 100, id: 8 },
  { height: 100, width: 100, id: 9 },
  { height: 100, width: 100, id: 10 }
];
