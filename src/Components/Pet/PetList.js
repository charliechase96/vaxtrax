import React, { useContext, useEffect } from "react";
import PetCard from "./PetCard";
import { UserContext } from "../../App";

function PetList({ pets, setPets}) {
    const { userId } = useContext(UserContext);

    useEffect(() => {
        if (userId) {
            if (pets) {
                fetch(`https://api.vaxtrax.pet/${userId}/pets`, {
                    method: 'GET'
                })
                .then(response => {
                    if(!response.ok) {
                        return response
                    }
                    return response.json();
                })
                .then(data => setPets(data))
                .catch(error => console.error("Fetch error", error));
            }
        }
        else {
            console.error('userId is undefined');
        }
    }, [userId, setPets, pets]);
        

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