import React from "react";
import DeleteAlertButton from "./DeleteAlertButton";

function Alert({ alert, onDelete }) {
    console.log(alert)
    return (
        <div className="alert">
            <p>Vaccine: {alert.vaccine_name}</p>
            <p>Due Date: {alert.due_date}</p>
            <p>Alert Date: {alert.alert_date}</p>
            <DeleteAlertButton onDelete={onDelete} alert={alert}/>
        </div>
    )
}

export default Alert;