import React from "react";
import { useDrop } from "react-dnd";
import {ITEM_TYPE} from "../data/types";

//status->オブジェクト
const ItemWrapper = ({ onDrop, children, status }) => {

    const [{ isOver }, drop] = useDrop({
        accept: ITEM_TYPE,

        hover: (item, monitor) => {
            if (item.status !== status) {
                let droppedIndex = onDrop(item, monitor, status);
                item.status = status;
                item.index = droppedIndex;
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver()//ホバー<されているか>どうか
        })
    });

    return (
        <div ref={drop} className={"drop-wrapper"}>
            {React.cloneElement(children, { isOver })}
        </div>
    );
};

export default ItemWrapper;