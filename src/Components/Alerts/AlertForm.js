import React, { useState } from "react";

function AlertForm() {
    const [alertDay, setAlertDay] = useState("##");

    function handleSubmit() {
        
    }

    return (
        <div className="alert-form">
            <form onSubmit={handleSubmit}>
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
                <button>Set Alert</button>
            </form>
        </div>
    )
}

export default AlertForm;