import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import Dashboard from "./Dashboard";
import Footer from "../Footer/Footer";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

function Home() {
    const { userId, handleSuccess } = useContext(UserContext);

    const navigate = useNavigate()

    useEffect(() => {
        fetch('api.vaxtrax.pet/check_session')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('User not logged in.');
                }
            })
            .then(data => {
                if (data.user_id) {
                    handleSuccess(data); // set the userId and isAutheticated state
                } else {
                    navigate('/');
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
                navigate('/');
            });
    }, [navigate, handleSuccess]);

    return (
        <div>
            <Header />
            <Dashboard userId={userId} />
            <Footer />
        </div>
    )
}

export default Home;