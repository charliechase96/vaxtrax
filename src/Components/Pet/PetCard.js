import React from "react";
import { useNavigate } from "react-router-dom";
import DeletePetButton from "./DeletePetButton";
import PetProfileButton from "./PetProfileButton";

function PetCard({ pet, onDelete }) {
    const catProfilePic = "https://icons.veryicon.com/png/o/miscellaneous/taoist-music/cat-56.png"

    const dogProfilePic = "https://cdn-icons-png.flaticon.com/512/194/194279.png"

    const imageSrc = pet.img_url || (pet.type === "Cat" ? catProfilePic : pet.type === "Dog" ? dogProfilePic : null);

    const navigate = useNavigate();

    function handleNavigate() {
        navigate("/home/pet-profile", { state: { pet } });
    }

    function handleDelete() {
        fetch(`http://localhost:5000/api/delete_pet/${pet.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => {
            if (response.ok) {
                onDelete(pet.id);
            } else {
                throw new Error('Failed to delete pet.');
            }
        })
        .catch(error => console.error("Error:", error));
    };
    
    return (
        <div className="pet-card" key={pet.id}>
            <h3>{pet.name}</h3>
            <img src={imageSrc} alt={pet.name} />
            <p>Type: {pet.type}</p>
            <p>Breed: {pet.breed}</p>
            <p>Birthday: {pet.birthday}</p>
            <div className="pet-card-buttons">
                <PetProfileButton onNavigate={handleNavigate}/>
                <DeletePetButton onDeletePet={handleDelete} />
            </div>
        </div>
    )
}

export default PetCard;