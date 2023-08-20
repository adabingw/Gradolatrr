import './Profile.css'
import React from "react"
import GRADOLATOR from "../utils/GRADOLATOR.png"
import { useState, useEffect, useHistory } from 'react';
import Modal from "react-modal"

function Login(props) {

    const [username, setUser] = useState()
    const [password, setPassword] = useState()

    const onLogin = async() => {
        try {
            const res = await fetch("http://localhost:5000/user")
            const jsonRes = await res.json()
            for (var i = 0; i < Object.keys(jsonRes).length; i++) {
                if (jsonRes[i].username == username) {
                    if (jsonRes[i].password == password) {
                        props.authorized(username, jsonRes[i].name, jsonRes[i].id, jsonRes[i].password)
                    } else {
                        alert("Username/password incorrect")
                        return
                    }
                }
            }
            
        } catch(err) {
            console.error(err.message)
        }
    }

    function keyDown(event) {
        if(event.key === 'Enter'){
            onLogin()
        }
    }

    return(
        <div className="FlexCol">
            <img src={GRADOLATOR} alt="" className="logoLogin" onClick={() => props.homeClick()}/>
            <input className="textfield" placeholder="username" onChange={(e) => setUser(e.target.value)} onKeyPress={(e) => keyDown(e)} />
            <input className="textfield" placeholder="password" onChange={(e) => setPassword(e.target.value)} type="password" onKeyPress={(e) => keyDown(e)} />
            <h3 className="h3Submit" onClick={() => onLogin()}>L O G I N</h3>
            <h6 className="path">Don't have an account yet? <span className="re" onClick={() => props.signupClick()}>Signup.</span></h6>
        </div>
    )
}

export default Login;