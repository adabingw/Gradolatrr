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
    const [err, setErr] = useState(false)

    const onSignUp = async(e) => {
        e.preventDefault()
        try {
            const body = {name, username, password}
            console.log(body)

            const res = await fetch("http://localhost:5000/user")
            const jsonRes = await res.json()

            console.log(jsonRes)

            for (var i = 0; i < Object.keys(jsonRes).length; i++) {
                if (jsonRes[i].username == username) {
                    setErr(true)
                    return;
                }
            }

            const response = await fetch(
                `http://localhost:5000/user`,
                {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
                }
            );

            const res1 = await fetch("http://localhost:5000/user")
            const jsonRes1 = await res1.json()

            console.log(jsonRes1)

            for (var i = 0; i < Object.keys(jsonRes1).length; i++) {
                if (jsonRes[i].username == username) {
                    setId(jsonRes[i].id)
                }
            }

            console.log(response)
            props.authorized(username, name, id, password)
        } catch(err) {
            console.error(err.message)
        }
    }

    return(
        <div className="FlexCol">
            <img src={GRADOLATOR} alt="" className="logoLogin" onClick={() => props.homeClick()}/>
            <input className="textfield" placeholder="name" onChange={(e) => setName(e.target.value)}/>
            <input className="textfield" placeholder="username" onChange={(e) => setUser(e.target.value)}/>
            <input className="textfield" placeholder="password" onChange={(e) => setPassword(e.target.value)} type="password"/>
            <h3 className="h3Submit" onClick={(e) => onSignUp(e)}>S I G N    U P</h3>
            <h6 className="path">Already have an account? <span className="re" onClick={() => props.loginClick()}>Login.</span></h6>
            <Modal isOpen={err} className="styleModal">
                <div className="modalStyle">
                    <div className="FlexCol">
                        <h4>This username is taken :(</h4>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons" onClick={() => setErr(false)}>CLOSE</h4>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Signup;