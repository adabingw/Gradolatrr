import './Home.css'
import React from "react"
import GRADOLATOR from "../utils/GRADOLATOR.png"
import { useState, useEffect, useHistory } from 'react';

function Home(props) {



    return(
        <div className="flexColHome">
            <img src={GRADOLATOR} alt="" className="logoLogin"/>
            <h3 className="h3Button" onClick={() => props.loginClick()}>L O G I N</h3>
            <h3 className="h3Button" onClick={() => props.signupClick()}>S I G N   U P</h3>
            <h3 className="h3Button" onClick={() => props.dashboardClick()}>A B O U T</h3>
        </div>
    )
}

export default Home;