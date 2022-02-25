import React from "react";

const Col = ({ children, isOver }) => {
    const className = isOver ? "highlight-region" : "";
    return (
        <div className={`col ${className}`}>
            {children}
        </div>
    )
}

export default Col;