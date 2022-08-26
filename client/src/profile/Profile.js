import './Profile.css'
import React from "react"
import { useState, useEffect } from 'react';
import ynot from "./ynot.png"
import Modal from "react-modal"


function Profile(props) {

    const id = props.id 
    const pswrd = props.password
    const user = props.username

    let type;

    const [name, setName] = useState(props.name)
    const [username, setUsername] = useState(props.username)
    const [password, setPassword] = useState(props.password)
    const [newPassword, setNewPassword] = useState()

    const [name2, setName2] = useState(props.name)
    const [username2, setUsername2] = useState(props.username)

    const [openName, setOpenName] = useState(false)
    const [openUser, setOpenUser] = useState(false)
    const [openPassword, setOpenPassword] = useState(false)

    const [open, setOpen] = useState(false)
    const [openText, setOpenText] = useState()

    const onNameChange = async(e) => {
        e.preventDefault()
        type = "name"
        setName(name2)
        try {
            const body = { id, type, name2, username, password }
            console.log(body)

            const response = await fetch(
                `http://localhost:5000/user_name`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body)
                }
            );
            console.log(response)
        } catch(err) {
            console.error(err.message)
        }
    }

    const onUserChange = async(e) => {
        e.preventDefault()
        type = "username"
        setUsername(username2)
        try {
            const body = { id, type, name, username2, password }
            console.log(body)

            const res = await fetch("http://localhost:5000/user")
            const jsonRes = await res.json()

            console.log(jsonRes)

            for (var i = 0; i < Object.keys(jsonRes).length; i++) {
                if (jsonRes[i].username == username2) {
                    setOpenText("Username is taken")
                    setOpen(true)
                    return;
                }
            }

            const response = await fetch(
                `http://localhost:5000/user_name`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body)
                }
            );
            console.log(response)
        } catch(err) {
            console.error(err.message)
        }
    }

    const onPasswordChange = async(e) => {
        e.preventDefault()
        type = "password"
        if (String(newPassword).length < 5) {
            setOpenText("Password must be longer than 5 characters")
            setOpen(true)
        } else {
            if (password == pswrd) {
                try {
                    const body = { id, type, name, username, newPassword }
                    console.log(body)
        
                    const response = await fetch(
                        `http://localhost:5000/user_name`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(body)
                        }
                    );
                    console.log(response)
                } catch(err) {
                    console.error(err.message)
                }
            } else {
                setOpenText("Old password doesn't match")
                setOpen(true)
            }
        }
    }

    return(
        <div className="profileDiv">
            <div>
                <img src={ynot} className="pfp" alt="profile"/>
            </div>
            <div>
                <div className="profileRow">
                    <h4 className="name">{name}</h4>
                    <h4 className="userName">{username}</h4>
                </div>
                <div className="profileButtons">
                    <h4 onClick={() => setOpenUser(true)}>change username</h4>
                    <h4 onClick={() => setOpenName(true)}>change name</h4>
                    <h4 onClick={() => setOpenPassword(true)}>change password</h4>
                    <h4 className="logout" onClick={() => props.logout()}>logout</h4>
                </div>
                <Modal isOpen={openName} className="styleModal">
                    <div className="modalStyle">
                        <div className="FlexCol">
                            <h3 className="modalTitle">Change name</h3>
                            <input className="textfield" placeholder="new name" onChange={(event) => setName2(event.target.value)}/>
                        </div>
                        <div className="modalRow">
                            <h4 className="modalButtons" onClick={(e) => {onNameChange(e); setOpenName(false)}}>SAVE</h4>
                            <h4 className="modalButtons" onClick={() => setOpenName(false)}>CANCEL</h4>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={openUser} className="styleModal">
                    <div className="modalStyle">
                        <div className="FlexCol">
                            <h3 className="modalTitle">Change username</h3>
                            <input className="textfield" placeholder="new username" onChange={(event) => setUsername2(event.target.value)}/>
                        </div>
                        <div className="modalRow">
                            <h4 className="modalButtons" onClick={(e) => {onUserChange(e); setOpenUser(false)}}>SAVE</h4>
                            <h4 className="modalButtons" onClick={() => setOpenUser(false)}>CANCEL</h4>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={openPassword} className="styleModal">
                    <div className="modalStyle">
                        <div className="FlexCol">
                            <h3 className="modalTitle">Change password</h3>
                            <input className="textfield" type="password" placeholder="old password" onChange={(event) => setPassword(event.target.value)}/>
                            <input className="textfield" type="password" placeholder="new password" onChange={(event) => setNewPassword(event.target.value)}/>
                        </div>
                        <div className="modalRow">
                            <h4 className="modalButtons" onClick={(e) => {onPasswordChange(e); setOpenPassword(false)}}>SAVE</h4>
                            <h4 className="modalButtons" onClick={() => setOpenPassword(false)}>CANCEL</h4>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={open} className="styleModal">
                    <div className="modalStyle">
                        <div className="FlexCol">
                            <h3 className="modalTitle">Error</h3>
                            <h4>{openText}</h4>
                        </div>
                        <div className="modalRow">
                            <h4 className="modalButtons" onClick={() => setOpen(false)}>CLOSE</h4>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Profile;