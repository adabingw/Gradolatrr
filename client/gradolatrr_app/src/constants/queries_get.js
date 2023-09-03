// for get queries

import { gql } from "@apollo/client";

const ALL_COURSES = gql`
    query {
        allTerm {
            items {
                id
                name
                order
                courses {
                    id
                    name
                    type
                    order
                    assignments {
                        id
                    }
                }
            }
        }
    }  
`;

const TERM_ORDERS = gql`
    query {
        allTerm {
            items {
                id
                name
                order
            }
        }
    }  
`;

const TERM_INFO = gql`
    query Terms($id: ID!) {
        getTerm(id: $id) {
            id, 
            name,
            archived,
            current, 
            data,
            courses { 
                id,
                name
                assignments {
                    id
                }
            }
        }
    }
`;

const COURSE_ORDERS = gql`
    query CourseOrder($id: ID!) {
        getTerm(id: $id) {
            id, 
            courses { 
                id,
                name
                order
            }
        }
    }
`;

const COURSE_INFO = gql`
    query Courses($id: ID!) {
        getCourse(id: $id) {
            id, 
            name, 
            data, 
            content_info,
            term_id, 
            assignments {
                id,
                data 
            }
        }
    }
`;

const GET_CONTENT_INFO = gql`
    query ContentInfo($id: ID!) {
        getCourse(id: $id) {
            id,
            data,
            content_info
        }
    }
`;

const COURSE_CONTENT = gql`
    query CourseContent($id: ID!){
        getCourse(id: $id) {
            id, 
            name,
            content_info,
            grade, 
            grading_scheme,
            assignments {
                id, 
                name,
                data
            }
        }
    }
`;

const ASSIGN_INFO = gql`
    query Assignment($id: ID!) {
        getAssignment(id: $id) {
            id, 
            name, 
            data, 
            course {
                content_info
            }
        }
    }
`;

const ASSIGN_FROM_TERM = gql`
    query Assignment($id: ID!) {
        getAssignmentfromTerm(term_id: $id) {
            id
        }
    }
`;

export {
    ALL_COURSES, 
    TERM_INFO, 
    COURSE_INFO, 
    COURSE_CONTENT, 
    GET_CONTENT_INFO,
    ASSIGN_INFO, 
    COURSE_ORDERS, 
    TERM_ORDERS, 
    ASSIGN_FROM_TERM
}
