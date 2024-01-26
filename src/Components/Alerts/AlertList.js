import React, { useEffect } from "react";
import Alert from "./Alert";

function AlertList({alerts, setAlerts, pet }) {
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        fetch(`http://localhost:5000/api/${userId}/alerts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => response.json())
            .then(data => setAlerts(data))
            .catch(error => console.error('Error:', error))
    }, [setAlerts, userId]);

    function handleDeleteAlert(alertId) {
        fetch(`http://localhost:5000/api/${userId}/delete_alert/${alertId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => {
            if (response.ok) {
                setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
            }
            else {
                throw new Error('Failed to delete the alert.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    return (
        <>
            <h3>{pet.name}'s Vaccine Alerts</h3>
            {alerts.map(alert => (
                <Alert 
                    key={alert.id} 
                    alert={alert} 
                    onDelete={handleDeleteAlert}
                />
            ))}
        </>
    )
}

export default AlertList;