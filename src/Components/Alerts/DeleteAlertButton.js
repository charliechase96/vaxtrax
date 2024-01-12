import React from "react";

function DeleteAlertButton({ onDelete, alert }) {
    return (
        <button onClick={() => onDelete(alert.id)}>❌</button>
    )
}

export default DeleteAlertButton;