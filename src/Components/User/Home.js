import React from "react";
import Header from "../Header/Header";
import Dashboard from "./Dashboard";
import Footer from "../Footer/Footer";

function Home({userId}) {
    return (
        <div>
            <Header />
            <Dashboard userId={userId} />
            <Footer />
        </div>
    )
}

export default Home;