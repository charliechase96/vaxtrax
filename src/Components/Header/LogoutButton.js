import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    function Logout() {
        navigate("/");
    }

    return (
        <button
            className="logout"
            onClick={Logout}
        >
            Logout
        </button>
    )
}

export default LogoutButton;