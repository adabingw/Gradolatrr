import './Profile.css'
import React from "react"
import GRADOLATOR from "../utils/GRADOLATOR.png"
import { useState, useEffect, useHistory } from 'react';
import Modal from "react-modal"

function Login(props) {

    const [username, setUser] = useState()
    const [password, setPassword] = useState()
    const [err, setErr] = useState(false)

    const onLogin = async(e) => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:5000/user")
            const jsonRes = await res.json()

            console.log(jsonRes)

            for (var i = 0; i < Object.keys(jsonRes).length; i++) {
                if (jsonRes[i].username == username) {
                    if (jsonRes[i].password == password) {
                        props.authorized(username, jsonRes[i].name)
                    } else {
                        setErr(true)
                        return
                    }
                }
            }

            setErr(true)
        } catch(err) {
            console.error(err.message)
        }
    }

    return(
        <div className="FlexCol">
            <img src={GRADOLATOR} alt="" className="logoLogin" onClick={() => props.homeClick()}/>
            <input className="textfield" placeholder="username" onChange={(e) => setUser(e.target.value)}/>
            <input className="textfield" placeholder="password" onChange={(e) => setPassword(e.target.value)} type="passwrd"/>
            <h3 className="h3Submit" onClick={(e) => onLogin(e)}>L O G I N</h3>
            <h6 className="path">Don't have an account yet? <span className="re" onClick={() => props.signupClick()}>Signup.</span></h6>
            <Modal isOpen={err} className="styleModal">
                <div className="modalStyle">
                    <div className="FlexCol">
                        <h4>Username/password incorrect</h4>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons" onClick={() => setErr(false)}>CLOSE</h4>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Login;