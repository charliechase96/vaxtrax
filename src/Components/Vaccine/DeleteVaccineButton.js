import React from "react";

function DeleteVaccineButton({ onDelete, vaccineId }) {
    return (
        <button className="x" onClick={() => onDelete(vaccineId)}>❌</button>
    )
}

export default DeleteVaccineButton;