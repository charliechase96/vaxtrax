import React from "react";
import Vaccine from "./Vaccine";
import { fetchWithToken } from "../../Utilities/auth";

function VaccineList({ pet, vaccines, setVaccines, onCreateAlert }) {

    const userId = localStorage.getItem('user_id');

    function handleDeleteVaccine(vaccineId) {
        fetchWithToken(`/${userId}/delete_vaccine/${vaccineId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
            })
            .then(response => {
                if (response.ok) {
                    setVaccines(prevVaccines => prevVaccines.filter(vaccine => vaccine.id !== vaccineId))
                }
                else {
                    throw new Error('Failed to delete the vaccine.');
                }
            })
            .catch(error => console.error("Error:", error));
        };

    return (
        <>
            <h3>{pet.name}'s Vaccines</h3>
            {vaccines.map((vaccine) => ( 
                <Vaccine 
                    pet={pet} 
                    key={vaccine.id} 
                    vaccine={vaccine} 
                    onDelete={handleDeleteVaccine}
                    onCreateAlert={onCreateAlert}
                    />
            ))}
        </>
        
    )
}

export default VaccineList;