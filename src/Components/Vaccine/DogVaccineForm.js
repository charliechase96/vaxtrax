import React from "react";

function DogVaccineForm() {
    return (
        <>
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
                <p>Due in: </p>
                <input type="number" placeholder="Number..."/>
                <select>
                    <option>Duration</option>
                    <option>Day(s)</option>
                    <option>Week(s)</option>
                    <option>Month(s)</option>
                    <option>Year(s)</option>
                </select>
            </div>
            <button className="add-vaccine">Add Vaccine</button>
        </>
    )
}

export default DogVaccineForm;