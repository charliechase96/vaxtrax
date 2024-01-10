import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CatVaccineForm from "../Vaccine/CatVaccineForm";
import DogVaccineForm from "../Vaccine/DogVaccineForm";

function PetProfile() {
    const [vaccineName, setVaccineName] = useState("Vaccine");
    const [dueDate, setDueDate] = useState("");

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
            setVaccineName("");
            setDueDate("");
        })
        .catch(error => {
            console.error("Error adding vaccine:", error);
        });
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
                        {pet.type === "Cat" ? <CatVaccineForm onAddVaccine={handleSubmit}/> : <DogVaccineForm onAddVaccine={handleSubmit}/>}
                    </div>
                </div>
                <div className="vaccines-and-alerts">
                    <div className="vaccine-list">
                    </div>
                    <div className="alerts-list">
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default PetProfile;