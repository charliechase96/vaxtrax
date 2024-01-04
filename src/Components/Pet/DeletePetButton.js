import React from "react";

function DeletePetButton({ onDeletePet }) {
    return (
        <button onClick={onDeletePet}>Delete Pet</button>
    )
}

export default DeletePetButton;