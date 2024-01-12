import React, { useState } from "react";

function AlertForm({ vaccine, onCreateAlert }) {
    const [alertDay, setAlertDay] = useState("##");

    function handleSubmit(e) {
        e.preventDefault();

        if (alertDay !== "##") {
            onCreateAlert(vaccine.id, alertDay);
        }
        setAlertDay("##");
    }

    return (
        <div className="alert-form">
            <form onSubmit={handleSubmit}>
                <p className="alert-me">Alert me:</p>
                <select 
                    value={alertDay}
                    onChange={(e) => setAlertDay(e.target.value)}
                >
                    <option 
                        disabled 
                        value="##"
                    >
                        ##
                    </option>
                    <option value="60">60</option>
                    <option value="30">30</option>
                    <option value="7">7</option>
                    <option value="0">0</option>
                </select>
                <p>days before due</p>
                <button>Set Alert</button>
            </form>
        </div>
    )
}

export default AlertForm;