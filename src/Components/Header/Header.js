import React from "react";
import Logo from "./Logo";
import LogoutButton from "./LogoutButton";
import Navbar from "./Navbar";

function Header() {
    return (
        <div>
            <Logo />
            <LogoutButton />
            <Navbar />
        </div>
    )
}

export default Header;