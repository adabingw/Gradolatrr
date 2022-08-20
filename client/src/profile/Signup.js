import './Profile.css'
import React from "react"
import GRADOLATOR from "../utils/GRADOLATOR.png"
import { useState, useEffect, useHistory } from 'react';

function Signup(props) {



    return(
        <div className="FlexCol">
            <img src={GRADOLATOR} alt="" className="logoLogin" onClick={() => props.homeClick()}/>
            <input className="textfield" placeholder="name"/>
            <input className="textfield" placeholder="username"/>
            <input className="textfield" placeholder="password"/>
            <h3 className="h3Submit">S I G N    U P</h3>
            <h6 className="path">Already have an account? <span className="re" onClick={() => props.loginClick()}>Login.</span></h6>
        </div>
    )
}

export default Signup;