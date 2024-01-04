import React from "react";
import Logo from "./Logo";
import LogoutButton from "./LogoutButton";

function Header() {
    return (
        <div className="header">
            <Logo />
            <LogoutButton />
        </div>
    )
}

export default Header;