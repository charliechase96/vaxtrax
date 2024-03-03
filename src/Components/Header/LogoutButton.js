import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";

function LogoutButton() {
    const navigate = useNavigate();
    const { setUserId, setIsAuthenticated } = useContext(UserContext);

    function Logout() {
        setUserId(null);
        setIsAuthenticated(false);

        localStorage.removeItem('user_id');
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        
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