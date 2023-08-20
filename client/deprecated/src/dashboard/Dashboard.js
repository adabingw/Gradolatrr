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
    const [courseInfo, setCourseInfo] = useState()

    function editClick(course) {
        setDive(true)
        setCourseInfo(course)
    }

    function exitCourse() {
        setDive(false)
    }

    function getTile() {
        if (!dive && !profile) {
            return <Course editClick={editClick} id={props.id}/>
        } else if (dive && !profile) {
            return <CourseToken id={props.id} course={courseInfo} exit={exitCourse}/>
        } else if (profile) {
            return <Profile name={props.name} username={props.username} id={props.id} password={props.password} logout={props.logout}/>
        }
    }

    return(
        <div>
            <div className="FlexRow">
                <h4 className="homeButton" onClick={() => {setDive(false); setProfile(false)}}>H O M E</h4>
                <img src={GRADOLATOR_BANNER} alt="" className="logoDashboard" onClick={() => props.homeClick()}/>
                <h4 className="profileButton" onClick={() => {setDive(false); setProfile(true)}}>P R O F I L E</h4>
            </div>
            <div>
                {getTile()}
            </div>
        </div>
    )
}

export default Dashboard;