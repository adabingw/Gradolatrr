import { mutation } from "svelte-apollo";
import { UPDATE_ASSIGNMENT, UPDATE_COURSE } from "./queries_put";
import { DELETE_ASSIGN } from "./queries_delete";

let update_assign = mutation(UPDATE_ASSIGNMENT);
let update_course = mutation(UPDATE_COURSE);    

const updateAssignment = async (assign_id, assign_name, course_id, term_id, data) => {
    await update_assign({
        variables: {
            input: {
                id: assign_id, 
                type: "item",
                course_id: course_id,
                term_id: term_id, 
                name: assign_name, 
                data: data,
            }
        }
    });
}

const updateGradingScheme = async (course_id, course_name, term_id, equation) => {
    await update_course({
        variables: { 
            input: {
                id: course_id,
                name: course_name, 
                term_id: term_id, 
                type: "course", 
                grading_scheme: equation
            }
        } 
    });
}

const updateGrade = async (course_id, course_name, term_id, grade) => {
    await update_course({
        variables: { 
            input: {
                id: course_id,
                name: course_name,
                term_id: term_id,
                type: "course", 
                grade: grade
            }
        }
    });
}

const updateCourse = async (course_id, course_name, term_id, data, content_info) => {
    await update_course({
        variables: {
            input: {
                id: course_id, 
                type: "course",
                term_id: term_id, 
                name: course_name, 
                data: data,
                content_info: content_info
            }
        }
    });
}

const updateCourseData = async (course_id, course_name, term_id, data) => {
    await update_course({
        variables: {
            input: {
                id: course_id, 
                type: "course",
                term_id: term_id, 
                name: course_name, 
                data: data,
            }
        }
    });
}

const updateContentInfo = async (course_id, course_name, term_id, content_info) => {
    await update_course({
        variables: {
            input: {
                id: course_id, 
                term_id: term_id, 
                name: course_name, 
                type: "course",
                content_info: content_info
            }
        }
    });
}

export {
    updateAssignment,
    updateContentInfo,
    updateGrade, 
    updateGradingScheme,
    updateCourseData,
    updateCourse,
}
