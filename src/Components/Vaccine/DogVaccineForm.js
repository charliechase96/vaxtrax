import React from "react";

function DogVaccineForm({ onAddVaccine, setVaccineName, setDueDate, vaccineName, dueDate }) {
    return (
        <>
            <form onSubmit={onAddVaccine}>
                <h3>Add a Vaccine</h3>
                <select 
                    value={vaccineName}
                    className="vaccines" 
                    onChange={(e) => setVaccineName(e.target.value)}
                >
                    <option disabled value="Vaccine">Vaccine</option>
                    <option
                        value="Canine distemper virus"
                    >
                        Canine distemper virus
                    </option>
                    <option
                        value="Canine parvovirus"
                    >
                        Canine parvovirus
                    </option>
                    <option
                        value="Canine adenovirus-2"
                    >
                        Canine adenovirus-2
                    </option>
                    <option
                        value="Rabies virus"
                    >
                        Rabies virus
                    </option>
                    <option
                        value="Leptospira species"
                    >
                        Leptospira species
                    </option>
                    <option
                        value="Borrelia burgdorferi (Lyme disease)"
                    >
                        Borrelia burgdorferi (Lyme disease)
                    </option>
                    <option
                        value="Canine parainfluenza virus"
                    >
                        Canine parainfluenza virus
                    </option>
                    <option
                        value="Bordetella bronchiseptica (kennel cough)"
                    >
                        Bordetella bronchiseptica (kennel cough)
                    </option>
                    <option
                        value="Canine influenza"
                    >
                        Canine influenza
                    </option>
                </select>
                <div className="vaccine-duration">
                    <p>Due on: </p>
                    <input 
                        type="date" 
                        placeholder="YYYY/MM/DD"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <button className="add-vaccine">Add Vaccine</button>
            </form>
        </>
    )
}

export default DogVaccineForm;