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

    return (
        <div>
            <h2>Your Pets</h2>
            {pets.map(pet => ( <PetCard pet={pet} />))}
        </div>
    )
}

export default PetList;