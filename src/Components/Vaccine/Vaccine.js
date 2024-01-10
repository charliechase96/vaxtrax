import React from "react";
import DeleteVaccineButton from "./DeleteVaccineButton";
import AlertForm from "../Alerts/AlertForm";

function Vaccine({ vaccine, onDelete }) {
    return (
        <div className="vaccine">
            <p>{vaccine.name}</p>
            <p>{vaccine.due_date}</p>
            <p>Days until due:</p>
            <AlertForm />
            <DeleteVaccineButton onDelete={onDelete} vaccineId={vaccine.id}/>
        </div>
    )
}

export default Vaccine;