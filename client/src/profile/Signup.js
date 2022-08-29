import './Profile.css'
import React from "react"
import GRADOLATOR from "../utils/GRADOLATOR.png"
import { useState, useEffect, useHistory } from 'react';
import Modal from "react-modal"

function Signup(props) {

    const [id, setId] = useState()
    const [name, setName] = useState()
    const [username, setUser] = useState()
    const [password, setPassword] = useState()

    const onSignUp = async() => {
        const body = {name, username, password}
        const res = await fetch("http://localhost:5000/user")
        const jsonRes = await res.json()
        for (var i = 0; i < Object.keys(jsonRes).length; i++) {
            if (jsonRes[i].username == username) {
                alert("Username taken.")
                return;
            }
        }
        const response = await fetch( `http://localhost:5000/user`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const res1 = await fetch("http://localhost:5000/user")
        const jsonRes1 = await res1.json()
        for (var i = 0; i < Object.keys(jsonRes1).length; i++) {
            if (jsonRes1[i]["username"] == username) { setId(jsonRes1[i].id) }
        }
        props.authorized(username, name, id, password)
    }

    function keyDown(event) {
        if(event.key === 'Enter'){
            onSignUp()
        }
    }

    return(
        <div className="FlexCol">
            <img src={GRADOLATOR} alt="" className="logoLogin" onClick={() => props.homeClick()}/>
            <input className="textfield" placeholder="name" 
                onChange={(e) => setName(e.target.value)} onKeyPress={(e) => keyDown(e)}/>
            <input className="textfield" placeholder="username" 
                onChange={(e) => setUser(e.target.value)} onKeyPress={(e) => keyDown(e)}/>
            <input className="textfield" placeholder="password" onChange={(e) => setPassword(e.target.value)} 
                type="password" onKeyPress={(e) => keyDown(e)}/>
            <h3 className="h3Submit" onClick={() => onSignUp()}>S I G N    U P</h3>
            <h6 className="path">Already have an account? <span className="re" onClick={() => props.loginClick()}>Login.</span></h6>
        </div>
    )
}

export default Signup;