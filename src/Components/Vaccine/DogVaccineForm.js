import React from "react";

function DogVaccineForm({ onAddVaccine }) {
    return (
        <>
            <form onSubmit={onAddVaccine}>
                <h3>Add a Vaccine</h3>
                <select className="vaccines">
                    <option>Vaccine</option>
                    <option>Canine distemper virus</option>
                    <option>Canine parvovirus</option>
                    <option>Canine adenovirus-2</option>
                    <option>Rabies virus</option>
                    <option>Leptospira species</option>
                    <option>Borrelia burgdorferi (Lyme disease)</option>
                    <option>Canine parainfluenza virus</option>
                    <option>Bordetella bronchiseptica (kennel cough)</option>
                    <option>Canine influenza</option>
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

export default DogVaccineForm;