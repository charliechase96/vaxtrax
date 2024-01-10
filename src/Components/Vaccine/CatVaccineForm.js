import React from "react";

function CatVaccineForm({ onAddVaccine }) {
    return (
        <>
            <form onSubmit={onAddVaccine}>
                <h3>Add a Vaccine</h3>
                <select className="vaccines">
                    <option>Vaccine</option>
                    <option>Feline panleukopenia virus</option>
                    <option>Feline viral rhinotracheitis</option>
                    <option>Feline caliciviruses</option>
                    <option>Rabies virus</option>
                    <option>Feline leukemia virus (Kitten-FeLV)</option>
                    <option>Chlamydophila felis</option>
                    <option>Bordetella bronchiseptica</option>
                    <option>Feline leukemia virus (Adult-FeLV)</option>
                    <option>Feline infectious peritonitis (FIP)</option>
                </select>
                <div className="vaccine-duration">
                    <p>Due on: </p>
                    <input type="date" placeholder="YYYY/MM/DD" />
                </div>
                <button className="add-vaccine">Add Vaccine</button>
            </form>
        </>
    )
}

export default CatVaccineForm;