import './Dashboard.css'
import React from "react"
import { useState, useEffect } from 'react';
import GRADOLATOR_BANNER from "../utils/GRADOLATOR_BANNER.png"
import CourseToken from "./CourseToken.js"
import Course from "./Course.js"
import Profile from "../profile/Profile.js"

function Dashboard(props) {

    const [dive, setDive] = useState(false)
    const [profile, setProfile] = useState(false)

    function editClick() {
        setDive(true)
    }

    function getTile() {
        if (!dive && !profile) {
            return <Course editClick={editClick} />
        } else if (dive && !profile) {
            return <CourseToken />
        } else if (profile) {
            return <Profile />
        }
    }

    return(
        <div>
            <div className="FlexRow">
                <h4 className="homeButton" onClick={() => {setDive(false); setProfile(false)}}>H O M E</h4>
                <img src={GRADOLATOR_BANNER} alt="" className="logoDashboard" onClick={() => props.homeClick()}/>
                <h4 className="profileButton" onClick={() => setProfile(true)}>P R O F I L E</h4>
            </div>
            <div>
                {getTile()}
            </div>
        </div>
    )
}

export default Dashboard;