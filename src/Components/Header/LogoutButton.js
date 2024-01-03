import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    function Logout() {
        navigate("/");
    }

    return (
        <button
            onClick={Logout}
        >
            Logout
        </button>
    )
}

export default LogoutButton;