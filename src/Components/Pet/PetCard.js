import React from "react";
import { useNavigate } from "react-router-dom";
import DeletePetButton from "./DeletePetButton";
import PetProfileButton from "./PetProfileButton";
import { useContext } from "react";
import { UserContext } from "../../App";

function PetCard({ pet, onDelete }) {

    const { userId, fetchWithToken } = useContext(UserContext);
    const petId = pet.id;

    const catProfilePic = "https://icons.veryicon.com/png/o/miscellaneous/taoist-music/cat-56.png"

    const dogProfilePic = "https://cdn-icons-png.flaticon.com/512/194/194279.png"

    const imageSrc = pet.img_url || (pet.type === "Cat" ? catProfilePic : pet.type === "Dog" ? dogProfilePic : null);

    const navigate = useNavigate();

    function handleNavigate() {
        navigate(`/${userId}/home/${petId}/pet-profile`, { state: { pet } });
    }

    function handleDelete() {
        fetchWithToken(`https://api.vaxtrax.pet/${userId}/delete_pet/${pet.id}`, {
            method: 'DELETE'
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