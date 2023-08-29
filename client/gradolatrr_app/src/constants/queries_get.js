// for get queries

import { gql } from "@apollo/client";

const ALL_COURSES = gql`
    query {
        allTerm {
            items {
                id
                name
                courses {
                    id
                    name
                    type
                }
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
            term_name
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

export {
    ALL_COURSES, 
    TERM_INFO, 
    COURSE_INFO, 
    COURSE_CONTENT, 
    GET_CONTENT_INFO,
    ASSIGN_INFO
}
