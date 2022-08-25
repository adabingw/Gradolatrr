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

    let course = props.course

    return (
        <div className="CourseFlexRow">
            <h4>{props.name}</h4>
            <div className="CourseFlexRow2">
                <h4 className="courseMark">{mark}</h4>
                <h4 className="edit" onClick={() => props.editClick(course)}>EDIT</h4>
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
    const [courseList, setCourseList] = useState([])
    // modal
    const [newCourse, setNewCourse] = useState(false)
    const [newTag, setNewTag] = useState(false)
    // used when creating new course, populated with default courses
    const [newTagList, setTagList] = useState(["FINAL", "MIDTERM", "QUIZ", "LAB", "ASSIGNMENT", "UNIT FINAL"])
    const [newTagWList, setTagWList] = useState([0, 0, 0, 0, 0, 0])
    const [newTagItem, setNewTagItem] = useState()
    const [newTagW, setTagW] = useState()
    const [courseName, setCourseName] = useState() 
    const [courseCred, setCourseCred] = useState()
    const [refresh, setRefresh] = useState(true)

    let id = props.id

    // insert course
    const insertCourse = async(e) => {
        e.preventDefault()
        try {
            const body = { id, courseName, courseCred, newTagList, newTagWList }
            console.log(body)

            const response = await fetch(
                `http://localhost:5000/grade_course`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body)
                }
            );
            console.log(response)
            setTagList(["FINAL", "MIDTERM", "QUIZ", "LAB", "ASSIGNMENT", "UNIT FINAL"])
            setTagWList([0, 0, 0, 0, 0, 0])
            setRefresh(!refresh)
            getCourse()
        } catch(err) {
            console.error(err.message)
        }
    }

    // get all courses
    const getCourse = async() => {
        let type = "all"
        let course_id = 0
        try {
            const res = await fetch(`http://localhost:5000/grade_course/${id}/${course_id}/${type}`)
            const jsonRes = await res.json()

            console.log(jsonRes)
            console.log(jsonRes[0])
            setCourseList(jsonRes)
        } catch(err) {
            console.error(err.message)
        }
    }

    // new tag
    const insertTag = async(e) => {
        e.preventDefault()
        if (newTagItem == null) {
            // original list
            console.log("newTagItem null")
        } else {
            setTagList(newTagList => [...newTagList, newTagItem])
        }

        if (newTagW == null) {
            // original list
            console.log("newTagW null")
        } else {
            setTagWList(newTagWList => [...newTagWList, newTagW])
        }
    }

    // delete tag/:newCourse
    const deleteTag = async(e, tagName) => {
        let weight = newTagWList[newTagList.indexOf(tagName)]
        setTagList(newTagList.filter(item => item !== tagName))
        setTagWList(newTagWList.filter(w => w != weight))
        e.preventDefault()
    }

    useEffect(() => {
        getCourse()
        console.log(courseList)
        courseList.forEach((course, index) => {
            console.log(course, index)
        })
    }, [])

    useEffect(() => {
        courseList.map((course, index) => {
            console.log(course, index)
            console.log("course: ", course.course_name)
        })
    }, [courseList])

    useEffect(() => {
        console.log("newTagList: ", newTagWList)
    }, [newTagWList])

    return(
        <div>
            <h4 className="newThing" onClick={() => setNewCourse(true)}> + N E W   C O U R S E</h4>
            <div className="courses">
                {/* <CourseTile editClick={props.editClick} name="COURSE NAME" mark="94%"/> */}
                { courseList.map((course, index) => {
                    return <CourseTile editClick={props.editClick} name={course.course_name} mark={course.course_mark} course={course}/>
                })}
            </div>
            <div className="archived">
                <ArchivedCourseTile editClick={props.editClick}/>
            </div>
            <Modal isOpen={newCourse} className="styleModal">
                <div className="modalStyle">
                    <div className="FlexCol">
                        <h3 className="modalTitle">NEW COURSE</h3>
                        <input className="textfield" placeholder="course name" onChange={(e) => setCourseName(e.target.value)}/>
                        <input className="textfield" placeholder="course credits" onChange={(e) => setCourseCred(e.target.value)}/>
                        <div className="tagDiv">
                            { newTagList.map((tag, index) => {
                                return (
                                    <div className="tagLine">
                                        <h4 className="tagName">{tag}</h4> 
                                        <input type="number" className="textfield_w" placeholder="weight" 
                                            onChange={(e) => {
                                                let newArr = [...newTagWList]; // copying the old datas array
                                                newArr[index] = e.target.value; // replace e.target.value with whatever you want to change it to
                                                console.log(newArr)
                                                setTagWList(newArr);
                                            }}/>
                                        <h4 className="delete" onClick={(e) => deleteTag(e, tag)}>×</h4>
                                    </div>
                                )
                            })}
                        </div>
                        <div>
                            <h4 className="newTag" onClick={() => setNewTag(true)}>+ N E W T A G</h4>
                        </div>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons" onClick={(e) => {
                            insertCourse(e)
                            setNewCourse(false); 
                            setNewTag(false)    
                        }}>SAVE</h4>
                        <h4 className="modalButtons" onClick={() => setNewCourse(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={newTag} className="styleModal">
                <div className="modalStyle">
                    <div className="FlexCol">
                        <h3 className="modalTitle">NEW TAG</h3>
                        <input className="textfield" placeholder="tag name" onWheel={(e) => e.target.blur()} onChange={(event) => setNewTagItem(event.target.value)}/>
                        <input className="textfield" placeholder="tag weight" onWheel={(e) => e.target.blur()}  onChange={(event) => setTagW(event.target.value)}/>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons" onClick={(e) => {
                            insertTag(e)
                            setNewTag(false)
                        }}>SAVE</h4>
                        <h4 className="modalButtons" onClick={() => {setNewCourse(true); setNewTag(false)}}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Course;