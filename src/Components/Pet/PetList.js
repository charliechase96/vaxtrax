import React, { useState, useEffect } from "react";
import PetCard from "./PetCard";

function PetList() {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/pets')
            .then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not okay.');
            })
            .then(data => setPets(data))
            .catch(error => console.error("Fetch error", error));
    }, []);

    const handleDeletePet = (petId) => {
        setPets(pets.filter(pet => pet.id !== petId));
    };

    return (
        <div className="pet-list">
            <h2>Your Pets</h2>
            {pets.map(pet => ( <PetCard key={pet.id} pet={pet} onDelete={handleDeletePet} />))}
        </div>
    )
}

export default PetList;