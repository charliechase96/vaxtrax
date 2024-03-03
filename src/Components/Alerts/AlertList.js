import React, { useContext, useEffect } from "react";
import Alert from "./Alert";
import { UserContext } from "../../App";

function AlertList({alerts, setAlerts, pet }) {
    const { userId, fetchWithToken } = useContext(UserContext);

    useEffect(() => {
        fetchWithToken(`https://api.vaxtrax.pet/${userId}/alerts`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => setAlerts(data))
            .catch(error => console.error('Error:', error))
    }, [setAlerts, userId, fetchWithToken]);

    function handleDeleteAlert(alertId) {
        fetchWithToken(`https://api.vaxtrax.pet/${userId}/delete_alert/${alertId}`, {
            method: 'DELETE'
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