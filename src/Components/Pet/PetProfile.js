import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CatVaccineForm from "../Vaccine/CatVaccineForm";
import DogVaccineForm from "../Vaccine/DogVaccineForm";

function PetProfile() {
    const location = useLocation();
    const pet = location.state?.pet;

    const catProfilePic = "https://icons.veryicon.com/png/o/miscellaneous/taoist-music/cat-56.png"

    const dogProfilePic = "https://cdn-icons-png.flaticon.com/512/194/194279.png"

    const imageSrc = pet.img_url || (pet.type === "Cat" ? catProfilePic : pet.type === "Dog" ? dogProfilePic : null);

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
                        {pet.type === "Cat" ? <CatVaccineForm /> : <DogVaccineForm />}
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