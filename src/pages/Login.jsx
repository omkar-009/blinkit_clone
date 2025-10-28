import React from "react";
import logo from "../assets/logo.webp"

function Login() {
    return (
        <>
            <div>
                {/* logo */}
                <img src={logo} alt="Blinkit logo" className="w-25" />
                <h5>India's last minute app <span>Log in or Sign up</span></h5>
                <div>
                    <input type="text" placeholder="+91 "/>
                </div>
            </div>
        </>
    );
}