import React from "react";
import { useNavigate } from "react-router-dom";

function PetCard({pet}) {
    const catProfilePic = "https://icons.veryicon.com/png/o/miscellaneous/taoist-music/cat-56.png"

    const dogProfilePic = "https://cdn-icons-png.flaticon.com/512/194/194279.png"

    const imageSrc = pet.img_url || (pet.type === "Cat" ? catProfilePic : pet.type === "Dog" ? dogProfilePic : null);

    const navigate = useNavigate();

    function handleNavigate() {
        navigate("/home/pet-profile");
    }
    
    return (
        <div className="pet-card" key={pet.id}>
            <h3>{pet.name}</h3>
            <img src={imageSrc} alt={pet.name} />
            <p>Type: {pet.type}</p>
            <p>Breed: {pet.breed}</p>
            <p>Birthday: {pet.birthday}</p>
            <div className="pet-card-buttons">
                <button onClick={handleNavigate}>Pet Profile</button>
                <button>Delete Pet</button>
            </div>
        </div>
    )
}

export default PetCard;