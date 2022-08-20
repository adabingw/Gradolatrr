import './Profile.css'
import React from "react"
import { useState, useEffect } from 'react';
import ynot from "./ynot.png"

function Profile(props) {
    return(
        <div className="profileDiv">
            <div>
                <img src={ynot} className="pfp" alt="profile"/>
            </div>
            <div>
                <div className="profileRow">
                    <h4 className="name">name</h4>
                    <h4 className="userName">username</h4>
                </div>
                <div className="profileButtons">
                    <h4>change username</h4>
                    <h4>change name</h4>
                    <h4>change password</h4>
                    <h4 className="logout">logout</h4>
                </div>
            </div>
        </div>
    )
}

export default Profile;