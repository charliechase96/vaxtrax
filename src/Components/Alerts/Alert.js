import React from "react";
import DeleteAlertButton from "./DeleteAlertButton";

function Alert({ alert, onDelete }) {

    return (
        <div>
            <p>Vaccine: {alert.vaccine_name}</p>
            <p>Alert Date: {alert.alert_date}</p>
            <DeleteAlertButton onDelete={onDelete} />
        </div>
    )
}

export default Alert;