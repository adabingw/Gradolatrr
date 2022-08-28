import './Dashboard.css'
import React from "react"
import { useState, useEffect } from 'react';
import Modal from "react-modal"
import Dropdown from "react-bootstrap/Dropdown"

function CourseElement(props) {

    let assign = props.assign;
    let tags = props.tag;
    let id = props.id

    // modal
    const [assignModal, setAssignModal] = useState(false)
    // edit assign
    const [assignName, setAssignName] = useState(assign.assign_name)
    const [assignMark, setAssignMark] = useState(assign.assign_mark)
    const [tag, setTag] = useState(assign.tag)

    // update assignment
    const updateAssignment = async() => {
        try {
            let type = "all"
            let unit_id = assign.unit_id 
            let assign_id = assign.assign_id 
            let name = assignName 
            let mark = assignMark 
            let course_id = assign.course_id
            const body = { id, type, unit_id, assign_id, name, mark, tag, course_id };
            const response = await fetch(`http://localhost:5000/grade_assign`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            props.refresh()
        } catch (err) {
            console.log(err.message)
        }
    }

    // delete assignment
    const deleteAssignment = async () => {
        try {
            const deleteCourse = await fetch(`http://localhost:5000/grade_assign/${id}/${assign.course_id}/${assign.unit_id}/${assign.assign_id}`, {
                method: "DELETE"
            });
            props.refresh()
        } catch (err) {
          console.error(err.message);
        }
    }

    return(
        <div className="courseElementDiv">
            <div>
                <h3 className="elementName"> {assign.assign_name} </h3>
                <h4 className="unitName"> {assign.unit_name} </h4>
            </div>
            <h4 className="tagName"> {assign.tag} </h4>
            <h4 className="elementMark"> {assign.assign_mark}% </h4>
            <h4 className="edit" onClick={() => setAssignModal(true)}>EDIT</h4>
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
                                { tags.map((t, index) => { return  <Dropdown.Item className="item" onClick={() => setTag(t)}> {t} </Dropdown.Item>})}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons" onClick={() => {setAssignModal(false); updateAssignment();}}>SAVE</h4>
                        <h4 className="modalButtons" onClick={() => {deleteAssignment(); setAssignModal(false)}}>DELETE</h4>
                        <h4 className="modalButtons" onClick={() => setAssignModal(false)}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

function CourseToken(props) {

    let id = props.id
    let tags = props.course.tag 
    let tags_w = props.course.tag_weights
    let course_id = props.course.course_id
    let course_name = props.course.course_name

    const [course, setCourse] = useState(props.course)
    // modal
    const [courseModal, setCourseModal] = useState(false)
    const [newUnit, setNewUnit] = useState(false)
    const [newAssign, setNewAssign] = useState(false)
    const [updateC, setUpdateC] = useState(false)
    const [newTag, setNewTag] = useState(false)
    const [editUnit, setEditUnit] = useState(false)
    const [unitModal, setUnitModal] = useState(false)
    // 
    const [assignList, setAssignList] = useState([])
    const [unitList, setUnitList] = useState([])
    // selected
    const [filter, setFilter] = useState([{ assign_name: "null", tag: "null", assign_mark: "null" }])
    // edit assign / new assign
    const [tag, setTag] = useState("Select Tag")
    const [assignName, setAssignName] = useState(0)
    const [assignMark, setAssignMark] = useState(0)
    const [assignUnit, setAssignUnit] = useState({unit_name: "Select Unit"})
    // edit unit / new unit
    const [uW, setuW] = useState(0)
    const [uName, setuName] = useState(0)
    const [uId, setuId] = useState(0)
    // new / del tag 
    const [newTagList, setTagList] = useState(tags)
    const [newTagWList, setTagWList] = useState(tags_w)
    const [newTagItem, setNewTagItem] = useState()
    const [newTagW, setTagW] = useState()
    // edit course
    const [courseName, setCourseName] = useState(props.course.course_name) 
    const [courseCred, setCourseCred] = useState(props.course.course_credits)

    function setModal(status) {
        setModal(status)
    }

    function refresh() {
        getCourseAssignments()
        updateUnitMark()
    }

    // get unit info 
    const getAllUnits = async() => {
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

    const getCourseUnit = async() => {
        let type = "course"
        let unit_id = 0
        try {
            const res = await fetch(`http://localhost:5000/grade_unit/${id}/${type}/${unit_id}/${course_id}`)
            const jsonRes = await res.json()         
            setUnitList(jsonRes)
            console.log(jsonRes)
        } catch(err) {
            console.error(err.message)
        }
    }

    // get assignments
    const getAllAssignments = async() => {
        let type = "all"
        let unit_id = 0
        let assign_id = 0
        try {
            const res = await fetch(`http://localhost:5000/grade_assign/${id}/${type}/${unit_id}/${course_id}/${assign_id}`)
            const jsonRes = await res.json()
            console.log(jsonRes)
            setAssignList(jsonRes)
        } catch(err) {
            console.error(err.message)
        }
    }

    const getCourseAssignments = async() => {
        let type = "course"
        let unit_id = 0 
        let assign_id = 0 
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
    const insertUnit = async() => {
        try {
            const body = { id, course_id, uName, uW, course_name }
            const response = await fetch(`http://localhost:5000/grade_unit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            getCourseUnit()
        } catch(err) {
            console.error(err.message)
        }
    }

    // insert assignment
    const insertAssignment = async() => {
        let unit_id = assignUnit.unit_id
        let unit_name = assignUnit.unit_name
        try {
            const body = { id, course_id, course_name, assignName, assignMark, tag, unit_id, unit_name }
            const response = await fetch(`http://localhost:5000/grade_assign`,{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            setTag("Select Tag")
            setAssignUnit({unit_name: "Select Unit"})
            getCourseAssignments()
            await updateUnitMark()
        } catch(err) {
            console.error(err.message)
        }
    }

    // delete course
    const deleteCourse = async () => {
        try {
            const deleteCourse = await fetch(`http://localhost:5000/grade_course/${id}/${course_id}`, {
                method: "DELETE"
            });
            props.exit()
        } catch (err) {
          console.error(err.message);
        }
    }

    // get one course
    const getCourse = async() => {
        let type = "one"
        try {
            const res = await fetch(`http://localhost:5000/grade_course/${id}/${course_id}/${type}`)
            const jsonRes = await res.json()
            setCourse(jsonRes[0])
        } catch(err) {
            console.error(err.message)
        }
    }

    // update unit when course name changes
    const updateUnitCourse = async() => {
        let type = "course_name"
        try {
            const body = { id, course_id, courseName, type };
            const response = await fetch(`http://localhost:5000/grade_unit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    // update assignment when course name changes
    const updateAssignment = async() => {
        try {
            let type = "course_name"
            const body = { id, course_id, courseName, type };
            const response = await fetch(`http://localhost:5000/grade_assign`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    // update assignment when unit name changes
    const updateAssignmentUnit = async() => {
        try {
            let type = "unit_name"
            const body = { id, course_id, uName, type, uId };
            const response = await fetch(`http://localhost:5000/grade_assign`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    // update course
    const updateCourse = async() => {
        try {
            let type = "all"
            const body = { id, course_id, type, courseName, courseCred, newTagList, newTagWList };
            const response = await fetch(`http://localhost:5000/grade_course`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            getCourse()
            updateUnitCourse()
            updateAssignment()
        } catch (err) {
            console.log(err.message)
        }
    }

    const courseMark = async() => {
        if (unitList.length != 0) {
            let mark = 0;
            console.log(unitList)
            for (var i = 0; i < Object.keys(unitList).length; i++) {
                console.log(unitList[i])
                console.log(unitList[i].mark_weighted)
                mark += unitList[i].mark_weighted
            }
            console.log(mark)
            let type = "mark"
            const body = { id, course_id, type, courseName, mark, courseCred, newTagList, newTagWList };
            const response = await fetch(`http://localhost:5000/grade_course`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            getCourse()
        }
    }

    // update Unit
    const updateUnit = async() => {
        let type = "all"
        try {
            const body = { id, type, course_id, uId, uName, uW };
            const response = await fetch(`http://localhost:5000/grade_unit`,{
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            updateAssignmentUnit()
            getCourseAssignments()
            getCourseUnit()
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getCourseUnit()
        updateUnitMark()
    }, [assignList])

    // update Unit

    const updateUnitMark = async() => {
        let type = "mark"
        let avg = 0
        let weightedAvg = 0
        console.log(assignList)
        if (assignList.length != 0 && unitList.length != 0) {
            for (var j = 0; j < Object.keys(unitList).length; j++) {
                let sum = 0
                let length = 0
                for (var i = 0; i < Object.keys(assignList).length; i++) {
                    if (assignList[i].unit_id == unitList[j].unit_id) {
                        console.log(assignList[i].assign_name + " in " + assignList[i].unit_name + " of this mark: " + assignList[i].assign_mark)
                        sum += assignList[i].assign_mark 
                        length++
                    }
                }
                avg = sum / length || 0
                weightedAvg = avg * (unitList[j].unit_weight / 100) 
                console.log(unitList[j].unit_name, avg, weightedAvg)
                let unit_name = unitList[j].unit_name 
                let unit_id = unitList[j].unit_id
                try {
                    const body = { id, type, course_id, unit_id, unit_name, uW, avg, weightedAvg };
                    const response = await fetch(`http://localhost:5000/grade_unit`,{
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body)
                    });
                    console.log("RES: ", response)
                    getCourseUnit()
                    courseMark()
                } catch (err) {
                    console.log(err.message)
                }
            }
        }
    }

    // delete Unit
    const deleteUnit = async () => {
        try {
            const deleteCourse = await fetch(`http://localhost:5000/grade_unit/${id}/${course_id}/${uId}`, {
                method: "DELETE"
            });
        } catch (err) {
          console.error(err.message);
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
        getCourseUnit()
        getCourseAssignments()
    }, [])

    return(
        <div>
            <div className="tokenHeader">
                <h4 className="courseName"> {course.course_name} </h4>
                <h4 className="details" onClick={()=>setCourseModal(true)} setModal={setModal}>DETAILS</h4>
            </div>
            <h4 className="newUnit" onClick={() => setNewUnit(true)}> + N E W   U N I T</h4>
            <div className="units">
                { unitList.map((unit, index) => {
                    return <h4> <span className="filterUnit"> 
                                    <div className="CourseFlexRow">
                                        <h4>{props.name}</h4>
                                        <div className="CourseFlexRow2">
                                            <h4 className="filterUnit" onClick={() => {
                                                let list = []
                                                console.log(unit.unit_id)
                                                for (var i = 0; i < Object.keys(assignList).length; i++) {
                                                    if (assignList[i].unit_id == unit.unit_id) {
                                                        console.log(unit.unit_id)
                                                        console.log(assignList[i])
                                                        list.push(assignList[i])
                                                    }
                                                }
                                                setFilter(list)
                                                setUnitModal(true)            
                                            }}>{unit.unit_name} </h4>
                                            <h4 className="unitThing">{unit.unit_weight}%</h4>
                                            <h4 className="courseMark">MARK: <strong>{unit.unit_mark}%</strong></h4>
                                            <h4 className="edit" onClick={() => {
                                                setuId(unit.unit_id) 
                                                setUnitModal(false)
                                                setEditUnit(true)
                                            }}>EDIT</h4>
                                        </div>
                                    </div>
                                </span>
                            </h4>
                })}
            </div>
            <h4 className="newUnit" onClick={() => setNewAssign(true)}> + N E W   A S S I G N M E N T</h4>
            <div className="courseElement">
                { assignList.map((assign, index) => {
                    return <CourseElement assign={assign} unit={unitList} tag={tags} id={id} refresh={refresh}/>
                })}
            </div>
            <Modal isOpen={courseModal} className="styleModal">
                <div className="modalStyle">
                    <h3 className="modalTitle">COURSE DETAILS</h3>
                    <h4 className="modalLines">COURSE NAME: <span> {course.course_name} </span></h4>
                    <h4 className="modalLines">COURSE CREDITS: <span> {course.course_credits} </span></h4>
                    <h4 className="modalLines">COURSE MARK: <span> {course.course_mark} </span></h4>
                    <div className="tagDiv">
                            { tags.map((tag, index) => {
                                return (
                                    <div className="tagLine">
                                        <h4 className="tagName">{tag}</h4> 
                                        <h4 className="tagVal"> {tags_w[index]}% </h4>
                                    </div>
                                )
                            })}
                    </div>
                    <h4 className="modalLines">UNITS: </h4>
                    <div className="modalLines">
                        { unitList.map((u, index) => {
                            return <h4 className="unitSummary"> {u.unit_name} | weight: <span> {u.unit_weight}%</span></h4>
                        })}
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons" onClick={() => setUpdateC(true)}>EDIT</h4>
                        <h4 className="modalButtons">ARCHIVE</h4>
                        <h4 className="modalButtons" onClick={(e) => deleteCourse(e)}>DELETE</h4>
                        <h4 className="modalButtons" onClick={() => setCourseModal(false)}>CLOSE</h4>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={updateC} className="styleModal">
                <div className="modalStyle">
                    <div className="FlexCol">
                        <h3 className="modalTitle">UPDATE COURSE</h3>
                        <input className="textfield" placeholder="course name" onChange={(e) => setCourseName(e.target.value)}/>
                        <input className="textfield" placeholder="course credits" onChange={(e) => setCourseCred(e.target.value)}/>
                        <div className="tagDiv">
                            { newTagList.map((tag, index) => {
                                return (
                                    <div className="tagLine">
                                        <h4 className="tagName">{tag}</h4> 
                                        <input type="number" className="textfield_w" placeholder="weight" 
                                            onChange={(e) => {
                                                let newArr = [...newTagWList];
                                                newArr[index] = e.target.value;
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
                        <div className="modalRow">
                        <h4 className="modalButtons" onClick={(e) => {
                            updateCourse();
                            setCourseModal(false)
                            setUpdateC(false); 
                        }}>SAVE</h4>
                        <h4 className="modalButtons" onClick={() => setUpdateC(false)}>CANCEL</h4>
                    </div>
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
                        <h4 className="modalButtons" onClick={() => {setUpdateC(true); setNewTag(false)}}>CANCEL</h4>
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
            <Modal isOpen={editUnit} className="styleModal">
                <div>
                    <div className="FlexCol">
                        <h3 className="modalTitle">EDIT UNIT</h3>
                        <input className="textfield" placeholder="unit name"  onChange={(e) => setuName(e.target.value)}/>
                        <input className="textfield" placeholder="unit weight"  onChange={(e) => setuW(e.target.value)}/>
                    </div>
                    <div className="modalRow">
                        <h4 className="modalButtons" onClick={() => {updateUnit(); setEditUnit(false)}}>SAVE</h4>
                        <h4 className="modalButtons" onClick={() => {deleteUnit(); setEditUnit(false)}}>DELETE</h4>
                        <h4 className="modalButtons" onClick={() =>  {setEditUnit(false)}}>CANCEL</h4>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={unitModal} className="styleModal">
                <div>
                    <div className="FlexCol">
                        <h3 className="modalTitle"> {courseName} </h3>
                        { filter.map((item, index) => {
                            return (
                                <div className="courseElementDiv2">
                                    <h4 className="unitThing"> { item.assign_name } </h4>
                                    <h4 className="tagName"> { item.tag } </h4>
                                    <h4 className="unitThing"> { item.assign_mark}% </h4>
                                </div>
                            );
                        })}
                        <div className="buttonRow">
                            <h4 className="modalButtons" onClick={() => {
                                    setUnitModal(false); 
                                    setFilter([{assign_name: "", tag: "", assign_mark: ""}])
                                }}>CLOSE</h4>
                        </div>
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
                                        return  <Dropdown.Item className="item" onClick={() => {setAssignUnit(u);}} > {u.unit_name} </Dropdown.Item>
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