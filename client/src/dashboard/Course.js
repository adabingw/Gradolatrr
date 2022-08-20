import './Dashboard.css'
import React from "react"
import { useState, useEffect } from 'react';
import Modal from "react-modal"
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

function CourseTile(props) {
    return (
        <div className="CourseFlexRow">
            <h4>COURSE NAME</h4>
            <div className="CourseFlexRow2">
                <h4 className="courseMark">MARK%</h4>
                <h4 className="edit" onClick={() => props.editClick()}>EDIT</h4>
            </div>
        </div>
    )
}

function ArchivedCourseTile(props) {
    return (
        <div className="CourseFlexRow-Archive">
            <h4>COURSE NAME</h4>
            <div className="CourseFlexRow2">
                <h4 className="courseMark">MARK%</h4>
                <h4 className="edit" onClick={() => props.editClick()}>EDIT</h4>
            </div>
        </div>
    )
}

function Course(props) {
    const [newCourse, setNewCourse] = useState(false)

    return(
        <div>
            <h4 className="newThing" onClick={() => setNewCourse(true)}> + N E W   C O U R S E</h4>
            <div className="courses">
                <CourseTile editClick={props.editClick}/>
            </div>
            <div className="archived">
                <ArchivedCourseTile editClick={props.editClick}/>
            </div>
            <Modal isOpen={newCourse} className="styleModal">
                <div className="modalStyle">
                    <div className="FlexCol">
                        <h3 className="modalTitle">NEW COURSE</h3>
                        <input className="textfield" placeholder="course name"/>
                        <input className="textfield" placeholder="course credits"/>
                        <div className="tagLine"><h4 className="tagName">TAG</h4> <h4 className="weight">WEIGHT</h4></div>
                        <div>
                            <h4>+ N E W T A G</h4>
                        </div>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons">SAVE</h4>
                        <h4 className="modalButtons" onClick={() => setNewCourse(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Course;