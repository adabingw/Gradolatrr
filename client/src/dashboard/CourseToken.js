import './Dashboard.css'
import React from "react"
import { useState, useEffect } from 'react';
import Modal from "react-modal"
import Dropdown from "react-bootstrap/Dropdown"

function CourseElement(props) {

    let assign = props.assign;
    let units = props.unit;
    let tags = props.tag;
    let unitKey = Object.keys(units).find(key => units[key]["unit_id"] == assign.unit_id);
    let unit = units[unitKey]

    // modal
    const [unitModal, setUnitModal] = useState(false)
    const [assignModal, setAssignModal] = useState(false)
    const [editUnit, setEditUnit] = useState(false)
    // edit assign
    const [assignName, setAssignName] = useState(assign.assign_name)
    const [assignMark, setAssignMark] = useState(assign.assign_mark)
    const [tag, setTag] = useState("Select Tag")
    const [assignUnit, setAssignUnit] = useState({unit_name: "Select Unit"})

    // update assignment
    // delete assignment
    // update unit
    // delete unit

    return(
        <div className="courseElementDiv">
            <div>
                <h3 className="elementName"> {assign.assign_name} </h3>
                <h4 className="unitName" onClick={() => setUnitModal(true)}> {assign.unit_name} </h4>
            </div>
            <h4 className="tagName"> {assign.tag} </h4>
            <h4 className="elementMark"> {assign.assign_mark}% </h4>
            <h4 className="edit" onClick={() => setAssignModal(true)}>EDIT</h4>
            <Modal isOpen={unitModal} className="styleModal">
                <div>
                    <div className="FlexCol">
                        <h3 className="modalTitle"> {unit.unit_name} </h3>
                        <h4>UNIT WEIGHT: {unit.unit_weight} </h4>
                        <h4>UNIT FINAL: {unit.unit_final} </h4>
                        <h4>UNIT MARK: {unit.unit_mark} </h4>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons" onClick={() => setEditUnit(true)}>EDIT</h4>
                        <h4 className="modalButtons">DELETE</h4>
                        <h4 className="modalButtons" onClick={() => setUnitModal(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={editUnit} className="styleModal">
                <div>
                    <div className="FlexCol">
                        <h3 className="modalTitle">EDIT UNIT</h3>
                        <input className="textfield" placeholder="unit name" />
                        <input className="textfield" placeholder="unit weight"/>
                        <input className="textfield" placeholder="unit final"/>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons">SAVE</h4>
                        <h4 className="modalButtons" onClick={() =>  {setUnitModal(true); setEditUnit(false)}}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={assignModal} className="styleModal">
                <div>
                    <div className="FlexCol">
                        <h3 className="modalTitle">EDIT ASSIGNMENT</h3>
                        <input className="textfield" placeholder="assignment name" onChange={(e) => setAssignName(e.target.value)}/>
                        <input className="textfield" placeholder="assignment mark" onChange={(e) => setAssignMark(e.target.value)} />
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                <span id="dropdown" defaultValue="Select Tag"> {tag} </span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="dropdownmenu">
                                { tags.map((t, index) => {
                                        return  <Dropdown.Item className="item" onClick={() => setTag(t)}> {t} </Dropdown.Item>
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

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

    let course = props.course
    let id = props.id
    let tags = props.course.tag 
    let tags_w = props.course.tag_weights
    let course_id = props.course.course_id
    let course_name = props.course.course_name

    // modal
    const [courseModal, setCourseModal] = useState(false)
    const [newUnit, setNewUnit] = useState(false)
    const [newAssign, setNewAssign] = useState(false)
    // 
    const [assignList, setAssignList] = useState([])
    const [unitList, setUnitList] = useState([])

    // selected
    const [assign, setAssign] = useState(0)
    const [unit, setUnit] = useState(0)
    // edit assign / new assign
    const [tag, setTag] = useState("Select Tag")
    const [assignName, setAssignName] = useState(0)
    const [assignMark, setAssignMark] = useState(0)
    const [assignUnit, setAssignUnit] = useState({unit_name: "Select Unit"})
    // edit unit / new unit
    const [uW, setuW] = useState(0)
    const [uName, setuName] = useState(0)
    // new / del tag 
    const [newTagList, setTagList] = useState(tags)
    const [newTagWList, setTagWList] = useState(tags_w)

    const [newTagItem, setNewTagItem] = useState()
    const [newTagW, setTagW] = useState()

    function setModal(status) {
        setModal(status)
    }

    // get unit info 
    const getUnit = async() => {
        let type = "all"
        let unit_id = 0
        try {
            const res = await fetch(`http://localhost:5000/grade_unit/${id}/${type}/${unit_id}/${course_id}`)
            const jsonRes = await res.json()            
            setUnitList(jsonRes)
        } catch(err) {
            console.error(err.message)
        }
    }

    // get assignments
    const getAllAssignments = async() => {
        let type = "all"
        let unit_id = unit
        let assign_id = assign
        try {
            const res = await fetch(`http://localhost:5000/grade_assign/${id}/${type}/${unit_id}/${course_id}/${assign_id}`)
            const jsonRes = await res.json()
            console.log(jsonRes)
            setAssignList(jsonRes)
        } catch(err) {
            console.error(err.message)
        }
    }

    // insert unit
    const insertUnit = async(e) => {
        e.preventDefault()
        try {
            const body = { id, course_id, uName, uW, course_name }
            console.log(body)

            const response = await fetch(
                `http://localhost:5000/grade_unit`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body)
                }
            );
            console.log(response)
            getUnit()
        } catch(err) {
            console.error(err.message)
        }
    }

    // insert assignment
    const insertAssignment = async(e) => {
        e.preventDefault()
        let unit_id = assignUnit.unit_id
        let unit_name = assignUnit.unit_name
        try {
            const body = { id, course_id, course_name, assignName, assignMark, tag, unit_id, unit_name }
            console.log(body)

            const response = await fetch(
                `http://localhost:5000/grade_assign`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body)
                }
            );
            console.log(response)
            setTag("Select Tag")
            setAssignUnit({unit_name: "Select Unit"})
            getAllAssignments()
        } catch(err) {
            console.error(err.message)
        }
    }

    // delete course
    // update course

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
        getUnit()
        getAllAssignments()
    }, [])

    return(
        <div>
            <div className="tokenHeader">
                <h4 className="courseName"> {course.course_name} </h4>
                <h4 className="details" onClick={()=>setCourseModal(true)} setModal={setModal}>DETAILS</h4>
            </div>
            <h4 className="newUnit" onClick={() => setNewUnit(true)}> + N E W   U N I T</h4>
            <h4 className="newUnit" > display units here :) </h4>
            <h4 className="newUnit" onClick={() => setNewAssign(true)}> + N E W   A S S I G N M E N T</h4>
            { assignList.map((assign, index) => {
                return <CourseElement assign={assign} unit={unitList} tag={tags}/>
            })}
            <Modal isOpen={courseModal} className="styleModal">
                <div className="modalStyle">
                    <h3 className="modalTitle">COURSE DETAILS</h3>
                    <h4 className="modalLines">COURSE NAME: <span> {course.course_name} </span></h4>
                    <h4 className="modalLines">COURSE CREDITS: <span> {course.course_credits} </span></h4>
                    <h4 className="modalLines">COURSE MARK: <span> {course.course_mark} </span></h4>
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
                        <input className="textfield" placeholder="unit name" onChange={(e) => setuName(e.target.value)}/>
                        <input className="textfield" placeholder="unit weight" onChange={(e) => setuW(e.target.value)}/>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons" onClick={(e) => {insertUnit(e); setNewUnit(false)}}>SAVE</h4>
                        <h4 className="modalButtons" onClick={() => setNewUnit(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={newAssign} className="styleModal">
                <div>
                    <div className="FlexCol">
                        <h3 className="modalTitle">NEW ASSIGNMENT</h3>
                        <input className="textfield" placeholder="assignment name" onChange={(event) => setAssignName(event.target.value)}/>
                        <input className="textfield" placeholder="assignment mark" onChange={(event) => setAssignMark(event.target.value)}/>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                <span id="dropdown" defaultValue="Select Tag"> {tag} </span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="dropdownmenu">
                                { tags.map((t, index) => {
                                        return  <Dropdown.Item className="item" onClick={() => setTag(t)}> {t} </Dropdown.Item>
                                })}
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic" defaultValue="Select Unit">
                                <span id="dropdown" > {assignUnit.unit_name} </span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu id="dropdownmenu">
                                { unitList.map((u, index) => {
                                        return  <Dropdown.Item className="item" onClick={() => setAssignUnit(u)} > {u.unit_name} </Dropdown.Item>
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    
                    <div className="modalRow">
                        <h4 className="modalButtons" onClick={(e) => {insertAssignment(e); setNewAssign(false)}}>SAVE</h4>
                        <h4 className="modalButtons" onClick={() => setNewAssign(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CourseToken;