import React, { useState, useEffect } from "react";
import PetCard from "./PetCard";
import { fetchWithToken } from "../../Utilities/auth";

function PetList() {
    const [pets, setPets] = useState([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (userId) {
            fetchWithToken(`/api/${userId}/pets`)
                .then(response => {
                    if(!response.ok) {
                        return response.text().then(text => { throw new Error(text) });
                    }
                    return response.json();
                })
                .then(data => setPets(data))
                .catch(error => console.error("Fetch error", error));
        } else {
            console.error('userId is undefined');
        }
    }, [userId]);
        

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