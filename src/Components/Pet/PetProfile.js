import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CatVaccineForm from "../Vaccine/CatVaccineForm";
import DogVaccineForm from "../Vaccine/DogVaccineForm";
import VaccineList from "../Vaccine/VaccineList";
import AlertList from "../Alerts/AlertList";

function PetProfile() {
    const [vaccineName, setVaccineName] = useState("Vaccine");
    const [dueDate, setDueDate] = useState("");
    const [vaccines, setVaccines] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const location = useLocation();
    const pet = location.state?.pet;

    const catProfilePic = "https://icons.veryicon.com/png/o/miscellaneous/taoist-music/cat-56.png"

    const dogProfilePic = "https://cdn-icons-png.flaticon.com/512/194/194279.png"

    const imageSrc = pet.img_url || (pet.type === "Cat" ? catProfilePic : pet.type === "Dog" ? dogProfilePic : null);

    const authToken = localStorage.getItem('authToken');

    function handleSubmit(e) {
        e.preventDefault()

        const vaccineData = {
            name: vaccineName,
            due_date: dueDate
        };

        fetch('http://localhost:5000/api/add_vaccine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem(authToken)}`,
            },
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

    function fetchVaccines() {
        fetch('http://localhost:5000/api/vaccines')
                .then(response => {
                    if(response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not okay.');
                })
                .then(data => setVaccines(data))
                .catch(error => console.error("Fetch error", error));
            }
    
    useEffect(() => {
        fetchVaccines();
    }, []);      

    function fetchAlerts() {
        fetch('http://localhost:5000/api/alerts')
            .then(response => response.json())
            .then(data => setAlerts(data))
            .catch(error => console.error("Fetch error", error));
    }

    useEffect(() => {
        fetchAlerts();
    }, []);

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
        if (!vaccine) return;

        const alertDate = calculateAlertDate(alertDay, vaccine.due_date);

        const alertData = {
            vaccine_name: vaccine,
            alert_date: alertDate,
            due_date: dueDate,
            vaccine_id: vaccineId
        };

        fetch('http://localhost:5000/api/add_alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(alertData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                fetchAlerts(); // Fetch updated alerts
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
                            /> : 
                            <DogVaccineForm
                                dueDate={dueDate}
                                vaccineName={vaccineName} 
                                onAddVaccine={handleSubmit}
                                setVaccineName={setVaccineName}
                                setDueDate={setDueDate}
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