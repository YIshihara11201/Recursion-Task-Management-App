import React, { Fragment, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {ITEM_TYPE} from "../data/types";

const Item = ({ item, index, moveItem, deleteItem, contentChange, status }) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: ITEM_TYPE,
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
            const mousePosition = monitor.getClientOffset();
            const hoverClientY = mousePosition.y - hoverRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: ITEM_TYPE,
        item: { ...item, index },
        collect: monitor => ({
            isDragging: monitor.isDragging()         
        })
    });

    drag(drop(ref));

    return ( 
        <Fragment>
            <div
                ref={ref}
                style={{opacity: isDragging ? 0 : 1 }}
                className={"item"}
            >
                <div className={"color-bar"} style={{ backgroundColor: status.color }} />
                <textarea
                    value={item.content}
                    className={"item-title plan-content"}
                    onChange={(event)=>{contentChange(item.id, event)}}
                ></textarea>
                <button 
                    onClick={()=>deleteItem(item.id)}
                    className={"btn btn-outline-danger"}
                    style={{zIndex:1}}
                >
                    Delete
                </button>
            </div>
        </Fragment>
    );
};

export default Item;