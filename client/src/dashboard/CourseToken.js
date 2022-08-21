import './Dashboard.css'
import React from "react"
import { useState, useEffect } from 'react';
import Modal from "react-modal"
import Dropdown from "react-bootstrap/Dropdown"

function CourseElement(props) {
    const [unitModal, setUnitModal] = useState(false)
    const [assignModal, setAssignModal] = useState(false)

    // set default value

    return(
        <div className="courseElementDiv">
            <div>
                <h3 className="elementName">NAME</h3>
                <h4 className="unitName" onClick={() => setUnitModal(true)}>Unit1</h4>
            </div>
            <h4 className="tagName">TAG</h4>
            <h4 className="elementMark">MARK%</h4>
            <h4 className="edit" onClick={() => setAssignModal(true)}>EDIT</h4>
            <Modal isOpen={unitModal} className="styleModal">
                <div>
                    <div className="FlexCol">
                        <h3 className="modalTitle">UNIT NAME</h3>
                        <input className="textfield" placeholder="unit name"/>
                        <input className="textfield" placeholder="unit weight"/>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons">SAVE</h4>
                        <h4 className="modalButtons" onClick={() => setUnitModal(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={assignModal} className="styleModal">
                <div>
                    <div className="FlexCol">
                        <h3 className="modalTitle">EDIT ASSIGNMENT</h3>
                        <input className="textfield" placeholder="assignment name"/>
                        <input className="textfield" placeholder="assignment mark"/>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                <span id="dropdown">Select Tag</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="dropdownmenu">
                                <Dropdown.Item className="item">
                                    Tag
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="tagLine"><h4 className="tagName">TAG</h4></div>
                    
                    <div className="modalRow">
                        <h4 className="modalButtons">SAVE</h4>
                        <h4 className="modalButtons">DELETE</h4>
                        <h4 className="modalButtons" onClick={() => setAssignModal(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

function CourseToken(props) {

    const [courseModal, setCourseModal] = useState(false)
    const [newUnit, setNewUnit] = useState(false)
    const [newAssign, setNewAssign] = useState(false)

    function setModal(status) {
        setModal(status)
    }

    return(
        <div>
            <div className="tokenHeader">
                <h4 className="courseName">COURSE NAME</h4>
                <h4 className="details" onClick={()=>setCourseModal(true)} setModal={setModal}>DETAILS</h4>
            </div>
            <h4 className="newUnit" onClick={() => setNewUnit(true)}> + N E W   U N I T</h4>
            <h4 className="newUnit" onClick={() => setNewAssign(true)}> + N E W   A S S I G N M E N T</h4>
            <CourseElement />
            <Modal isOpen={courseModal} className="styleModal">
                <div className="modalStyle">
                    <h3 className="modalTitle">COURSE DETAILS</h3>
                    <h4 className="modalLines">COURSE NAME: <span> </span></h4>
                    <h4 className="modalLines">COURSE WEIGHT: <span>40%</span></h4>
                    <h4 className="modalLines">MIDTERM WEIGHT: <span>40%</span></h4>
                    <h4 className="modalLines">FINAL WEIGHT: <span>40%</span></h4>
                    <h4 className="modalLines">UNITS: </h4>
                    <div className="modalLines">
                        <h4 className="unitSummary">UNIT 1: <span>40%</span></h4>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons">EDIT</h4>
                        <h4 className="modalButtons">ARCHIVE</h4>
                        <h4 className="modalButtons">DELETE</h4>
                        <h4 className="modalButtons" onClick={() => setCourseModal(false)}>CLOSE</h4>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={newUnit} className="styleModal">
                <div>
                    <div className="FlexCol">
                        <h3 className="modalTitle">NEW UNIT</h3>
                        <input className="textfield" placeholder="unit name"/>
                        <input className="textfield" placeholder="unit weight"/>
                        <div className="tagLine"><h4 className="tagName">TAG</h4> <h4 className="weight">WEIGHT</h4></div>
                        <div>
                            <h4>+ N E W T A G</h4>
                        </div>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons">SAVE</h4>
                        <h4 className="modalButtons" onClick={() => setNewUnit(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={newAssign} className="styleModal">
                <div>
                    <div className="FlexCol">
                        <h3 className="modalTitle">NEW ASSIGNMENT</h3>
                        <input className="textfield" placeholder="assignment name"/>
                        <input className="textfield" placeholder="assignment mark"/>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                <span id="dropdown">Select Tag</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="dropdownmenu">
                                <Dropdown.Item className="item">
                                    Tag
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="tagLine"><h4 className="tagName">TAG</h4></div>
                    
                    <div className="modalRow">
                        <h4 className="modalButtons">SAVE</h4>
                        <h4 className="modalButtons">DELETE</h4>
                        <h4 className="modalButtons" onClick={() => setNewAssign(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CourseToken;