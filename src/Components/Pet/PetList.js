import React, { useEffect } from "react";
import PetCard from "./PetCard";

function PetList({ userId, pets, setPets}) {

    useEffect(() => {
        if (userId) {
            const accessToken = localStorage.getItem('access_token');
            
            if (!accessToken) {
                console.error("Access token not found");
                return;
            }

            fetch(`https://api.vaxtrax.pet/${userId}/pets`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if(!response.ok) {
                    return response
                }
                return response.json();
            })
            .then(data => setPets(data))
            .catch(error => console.error("Fetch error", error));
        } else {
            console.error('userId is undefined');
        }
    }, [userId, setPets]);
        

    const handleDeletePet = (petId) => {
        setPets(pets.filter(pet => pet.id !== petId));
        console.log(petId)
    };

    return (
        <div className="pet-list">
            <h2>Your Pets</h2>
            {pets.map(pet => ( <PetCard key={pet.id} pet={pet} onDelete={handleDeletePet} />))}
        </div>
    )
}

export default PetList;