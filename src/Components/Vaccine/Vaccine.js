import React from "react";
import DeleteVaccineButton from "./DeleteVaccineButton";
import AlertForm from "../Alerts/AlertForm";

function Vaccine({ vaccine, onDelete, onCreateAlert }) {
    return (
        <div className="vaccine">
            <p className="vaccine-name">{vaccine.name}</p>
            <p className="vaccine-due-date">{vaccine.due_date}</p>
            <AlertForm vaccine={vaccine} onCreateAlert={onCreateAlert}/>
            <DeleteVaccineButton onDelete={onDelete} vaccineId={vaccine.id}/>
        </div>
    )
}

export default Vaccine;