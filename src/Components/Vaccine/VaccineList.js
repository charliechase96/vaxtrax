import React, { useContext } from "react";
import Vaccine from "./Vaccine";
import { UserContext } from "../../App";

function VaccineList({ pet, vaccines, setVaccines, onCreateAlert }) {
    const { userId, fetchWithToken } = useContext(UserContext);

    function handleDeleteVaccine(vaccineId) {
        fetchWithToken(`https://api.vaxtrax.pet/${userId}/delete_vaccine/${vaccineId}`, {
            method: 'DELETE'
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