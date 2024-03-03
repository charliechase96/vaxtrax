import React, { useContext } from "react";
import Header from "../Header/Header";
import Dashboard from "./Dashboard";
import Footer from "../Footer/Footer";
import { UserContext } from "../../App";

function Home() {
    const { userId } = useContext(UserContext);
    return (
        <div>
            <Header />
            <Dashboard userId={userId} />
            <Footer />
        </div>
    )
}

export default Home;