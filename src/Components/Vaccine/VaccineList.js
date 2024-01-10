import React, { useState, useEffect } from "react";
import Vaccine from "./Vaccine";

function VaccineList() {
    const [vaccines, setVaccines] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/vaccines')
            .then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not okay.');
            })
            .then(data => setVaccines(data))
            .catch(error => console.error("Fetch error", error));
    }, []);

    return (
        <>
            {vaccines.map((vaccine) => ( <Vaccine key={vaccine.id} vaccine={vaccine} />))}
        </>
        
    )
}

export default VaccineList;