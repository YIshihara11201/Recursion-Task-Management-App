import React, { useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import {SECTION_TYPE} from "../data/types";

const Board = ({ status, index, moveSection, deleteSection, addItem, titleChange, children }) => {
    const ref = useRef(null);
    const titleInput = useRef(null);

    useEffect(()=>{
       titleInput.current.focus();
    },[])

    const [{ isDragging }, drag] = useDrag({
        type: SECTION_TYPE,
        item: { index },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    const [, drop] = useDrop({
        accept: SECTION_TYPE,
        hover: (item, monitor) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverRect = ref.current.getBoundingClientRect();
            const hoverMiddleX = (hoverRect.right - hoverRect.left) / 2;
            const mousePosition = monitor.getClientOffset();
            const hoverClientX = mousePosition.x - hoverRect.left;

            if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
            if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

            moveSection(dragIndex, hoverIndex);
            item.index = hoverIndex;
        }
    });

    drag(drop(ref));

    return (
        <div ref={ref} className={"col-wrapper"}>
            <input
                id={"task-title"}
                type={"text"}
                className={"col-header"}
                value={status}
                onChange={(event)=>{titleChange(status, event)}}
                ref={titleInput}
            ></input>
            {children}
            <div className={"row mt-3"}>
                <button className={"col-5 btn btn-secondary"} onClick={()=>{addItem(status)}}>Add item</button>
                <button className={"offset-1 col-5 btn btn-sm btn-danger"} onClick={()=>{deleteSection(status)}}>Delete section</button>    
            </div>
        </div>
    )
}

export default Board;