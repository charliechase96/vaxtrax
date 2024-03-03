import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CatVaccineForm from "../Vaccine/CatVaccineForm";
import DogVaccineForm from "../Vaccine/DogVaccineForm";
import VaccineList from "../Vaccine/VaccineList";
import AlertList from "../Alerts/AlertList";

function PetProfile() {
    const { userId, fetchWithToken } = useContext(UserContext);
    const [vaccineName, setVaccineName] = useState("Vaccine");
    const [dueDate, setDueDate] = useState("");
    const [vaccines, setVaccines] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const location = useLocation();
    const pet = location.state?.pet;

    const catProfilePic = "https://icons.veryicon.com/png/o/miscellaneous/taoist-music/cat-56.png"

    const dogProfilePic = "https://cdn-icons-png.flaticon.com/512/194/194279.png"

    const imageSrc = pet.img_url || (pet.type === "Cat" ? catProfilePic : pet.type === "Dog" ? dogProfilePic : null);

    function handleSubmit(e) {
        e.preventDefault()

        const vaccineData = {
            name: vaccineName,
            due_date: dueDate
        };

        fetchWithToken(`https://api.vaxtrax.pet/${userId}/add_vaccine`, {
            method: 'POST',
            body: JSON.stringify(vaccineData),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not okay.');
        })
        .then(data => {
            console.log("Vaccine added:", data);;
            setVaccineName("Vaccine");
            setDueDate("");
        })
        .catch(error => {
            console.error("Error adding vaccine:", error);
        });
    }

    useEffect(() => {
        fetchWithToken(`https://api.vaxtrax.pet/${userId}/vaccines`, {
            method: 'GET'
        })
            .then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                throw new Error('Network response was not okay.');
                }
            })
            .then(data => setVaccines(data))
            .catch(error => console.error("Fetch error", error));
        }, [userId, fetchWithToken]);      

        useEffect(() => {
            fetchWithToken(`https://api.vaxtrax.pet/${userId}/alerts`, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(data => setAlerts(data))
                .catch(error => console.error("Fetch error", error));
        }, [userId, fetchWithToken]);

    function calculateAlertDate(alertDay, vaccineDueDate) {
        // Convert the vaccineDueDate from a string to a Date object
        const dueDate = new Date(vaccineDueDate);
    
        // Subtract the alertDays from the dueDate
        dueDate.setDate(dueDate.getDate() - alertDay);
    
        // Format the date back to a string in the 'YYYY-MM-DD' format
        const year = dueDate.getFullYear();
        const month = String(dueDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(dueDate.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    }

    function createAlert(vaccineId, alertDay) {
        const vaccine = vaccines.find(v => v.id === vaccineId);

        if (!vaccine) {
            console.error("Vaccine not found for ID:", vaccineId);
            return;
        }

        const alertDate = calculateAlertDate(alertDay, vaccine.due_date);

        const alertData = {
            vaccine_name: vaccine.name,
            alert_date: alertDate,
            due_date: vaccine.due_date,
            vaccine_id: vaccineId
        };

        console.log("Alert data to be sent:", alertData);

        fetchWithToken(`https://api.vaxtrax.pet/${userId}/add_alert`, {
            method: 'POST',
            body: JSON.stringify(alertData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                fetchWithToken(`https://api.vaxtrax.pet/${userId}/alerts`, {
                    method: 'GET'
                })
                .then(response => response.json())
                .then(data => setAlerts(data))
                .catch(error => console.error("Fetch error", error)); // Fetch updated alerts
            }
        })
        .catch(error => console.error("Error adding alert:", error));
    }

    return (
        <>
            <Header />
            <div className="pet-profile-container">
                <div className="details-and-vaccine-form">
                    <div className="pet-details">
                        <h3>{pet.name}</h3>
                        <img src={imageSrc} alt={pet.name} />
                        <p>Type: {pet.type}</p>
                        <p>Breed: {pet.breed}</p>
                        <p>Birthday: {pet.birthday}</p>
                    </div>
                    <div className="vaccine-form">
                        {pet.type === "Cat" ? 
                            <CatVaccineForm 
                                dueDate={dueDate}
                                vaccineName={vaccineName}
                                onAddVaccine={handleSubmit}
                                setVaccineName={setVaccineName}
                                setDueDate={setDueDate}
                                vaccines={vaccines}
                            /> : 
                            <DogVaccineForm
                                dueDate={dueDate}
                                vaccineName={vaccineName} 
                                onAddVaccine={handleSubmit}
                                setVaccineName={setVaccineName}
                                setDueDate={setDueDate}
                                vaccines={vaccines}
                            />}
                    </div>
                </div>
                <div className="vaccines-and-alerts">
                    <div className="vaccine-list">
                        <VaccineList 
                            pet={pet} 
                            vaccines={vaccines}
                            setVaccines={setVaccines}
                            onCreateAlert={createAlert}
                        />
                    </div>
                    <div className="alerts-list">
                        <AlertList 
                            pet={pet}
                            alerts={alerts}
                            setAlerts={setAlerts} 
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default PetProfile;