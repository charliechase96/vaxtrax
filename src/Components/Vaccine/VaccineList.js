import React, { useContext } from "react";
import Vaccine from "./Vaccine";
import { UserContext } from "../../App";

function VaccineList({ pet, vaccines, setVaccines, onCreateAlert }) {
    const { userId } = useContext(UserContext);

    function handleDeleteVaccine(vaccineId) {
        fetch(`https://api.vaxtrax.pet/${userId}/delete_vaccine/${vaccineId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
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