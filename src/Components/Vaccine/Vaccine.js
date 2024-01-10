import React from "react";

function Vaccine({ vaccine }) {
    return (
        <div>
            <p>{vaccine.name}</p>
            <p>{vaccine.due_date}</p>
            <select>
                <option>Set alert for...</option>
                <option>60 days before</option>
                <option>30 days before</option>
                <option>7 days before</option>
                <option>On due date</option>
            </select>
            <button>Set Alert</button>
            <button>❌</button>
        </div>
    )
}

export default Vaccine;