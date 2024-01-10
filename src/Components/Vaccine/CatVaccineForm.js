import React from "react";

function CatVaccineForm({ onAddVaccine, setVaccineName, setDueDate, vaccineName, dueDate }) {
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
                        value="Feline panleukopenia virus"
                    >
                        Feline panleukopenia virus
                    </option>
                    <option 
                        value="Feline viral rhinotracheitis"
                    >
                        Feline viral rhinotracheitis
                    </option>
                    <option 
                        value="Feline caliciviruses"
                    >
                        Feline caliciviruses
                    </option>
                    <option
                        value="Rabies virus"
                    >
                        Rabies virus
                    </option>
                    <option
                        value="Feline leukemia virus (Kitten-FeLV)"
                    >
                        Feline leukemia virus (Kitten-FeLV)
                    </option>
                    <option
                        value="Chlamydophila felis"
                    >
                        Chlamydophila felis
                    </option>
                    <option
                        value="Bordetella bronchiseptica"
                    >
                        Bordetella bronchiseptica
                    </option>
                    <option
                        value="Feline leukemia virus (Adult-FeLV)"
                    >
                        Feline leukemia virus (Adult-FeLV)
                    </option>
                    <option
                        value="Feline infectious peritonitis (FIP)"
                    >
                        Feline infectious peritonitis (FIP)
                    </option>
                    <option
                        value="Feline respiratory vaccine"
                    >
                        Feline respiratory vaccine
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

export default CatVaccineForm;