import './Dashboard.css'
import React from "react"
import { useState, useEffect } from 'react';
import Modal from "react-modal"
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

function CourseTile(props) {
    let mark;
    if (props.mark == null) {
        mark = "N/A"
    } else {
        mark = props.mark
    }

    return (
        <div className="CourseFlexRow">
            <h4>{props.name}</h4>
            <div className="CourseFlexRow2">
                <h4 className="courseMark">{mark}</h4>
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
    const [newTag, setNewTag] = useState(false)
    const [courseList, setCourseList] = useState([])
    // used when creating new course, populated with default courses
    const [newTagList, setTagList] = useState(["FINAL", "MIDTERM", "QUIZ", "LAB", "ASSIGNMENT", "UNIT FINAL"])
    const [newTagW, setTagW] = useState()
    const [activeCourse, setActiveCourse] = useState()

    let id = props.id

    // insert course
    const insertCourse = async(e) => {
        e.preventDefault()
        try {
            console.log(props.password)
            const body = { id }
            console.log(body)

            const response = await fetch(
                `http://localhost:5000/course`,
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

    // get all courses
    const getCourse = async() => {
        let type = "all"
        try {
            const body = { id, type }
            console.log(body)

            const res = await fetch(`http://localhost:5000/grade_course/${id}/${type}`)
            const jsonRes = await res.json()

            console.log(jsonRes)
            console.log(jsonRes[0])
            setCourseList(jsonRes)
        } catch(err) {
            console.error(err.message)
        }
    }

    // insert tag
    const insertTag = async(e) => {
        e.preventDefault()
        try {
            console.log(props.password)
            const body = { id }
            console.log(body)

            const response = await fetch(
                `http://localhost:5000/course`,
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

    useEffect(() => {
        getCourse()
        console.log(courseList)
        courseList.forEach((course, index) => {
            console.log(course, index)
        })
    }, [])

    useEffect(() => {
        console.log("AAAAAAAAAAAAAAAAA")
        courseList.map((course, index) => {
            console.log(course, index)
            console.log("course: ", course.course_name)
        })
    }, [courseList])

    return(
        <div>
            <h4 className="newThing" onClick={() => setNewCourse(true)}> + N E W   C O U R S E</h4>
            <div className="courses">
                <CourseTile editClick={props.editClick} name="COURSE NAME" mark="94%"/>
                { courseList.map((course, index) => {
                    return <CourseTile editClick={props.editClick} name={course.course_name} mark={course.course_mark}/>
                })}
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
                        <div className="tagDiv">
                            { newTagList.map((tag) => {
                                return (
                                    <div className="tagLine"><h4 className="tagName">{tag}</h4> <input type="number" className="textfield_w" placeholder="weight"/>
                                        <h4 className="delete">×</h4>
                                    </div>
                                )
                            })}
                        </div>
                        <div>
                            <h4 className="newTag" onClick={() => setNewTag(true)}>+ N E W T A G</h4>
                        </div>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons">SAVE</h4>
                        <h4 className="modalButtons" onClick={() => setNewCourse(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={newTag} className="styleModal">
                <div className="modalStyle">
                    <div className="FlexCol">
                        <h3 className="modalTitle">NEW TAG</h3>
                        <input className="textfield" placeholder="tag name"/>
                        <input className="textfield" placeholder="tag weight"/>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons">SAVE</h4>
                        <h4 className="modalButtons" onClick={() => {setNewCourse(true); setNewTag(false)}}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Course;