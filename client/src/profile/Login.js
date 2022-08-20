import './Profile.css'
import React from "react"
import GRADOLATOR from "../utils/GRADOLATOR.png"
import { useState, useEffect, useHistory } from 'react';

function Login(props) {
    return(
        <div className="FlexCol">
            <img src={GRADOLATOR} alt="" className="logoLogin" onClick={() => props.homeClick()}/>
            <input className="textfield" placeholder="username"/>
            <input className="textfield" placeholder="password"/>
            <h3 className="h3Submit">L O G I N</h3>
            <h6 className="path">Don't have an account yet? <span className="re" onClick={() => props.signupClick()}>Signup.</span></h6>
        </div>
    )
}

export default Login;