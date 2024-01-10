import React, { useState } from "react";

function AlertForm() {
    const [alertDay, setAlertDay] = useState("Set alert for...");

    return (
        <div className="alert-form">
            <form>
                <select>
                    <option 
                        disabled 
                        value="Set alert for..."
                    >
                        Set alert for...
                    </option>
                    <option value="60 days before">60 days before</option>
                    <option value="30 days before">30 days before</option>
                    <option value="7 days before">7 days before</option>
                    <option value="On due date">On due date</option>
                </select>
                <button>Set Alert</button>
            </form>
        </div>
    )
}

export default AlertForm;