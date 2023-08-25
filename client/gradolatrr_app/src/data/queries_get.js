// for get queries

import { gql } from "@apollo/client";

const ALL_COURSES = gql`
    query {
        terms {
            id, 
            name, 
            courses {
                id,
                name
            }
        }
    }
`;

const TERM_INFO = gql`
    query {
        term(id: $id) {
            id, 
            name,
            archived,
            current, 
            data,
            courses(term_id: $id) { 
                id,
                name
            }
        }
    }
`;

const COURSE_INFO = gql`
    query {
        course(course_id: $id) {
            id, 
            name, 
            data, 
            content_info
        }
    }
`;

const COURSE_CONTENT = gql`
    query {
        course(course_id: $id) {
            id, 
            name,
            assignments(course_id: $id) {
                id, 
                name,
                data
            }
        }
    }
`;

const ASSIGN_INFO = gql`
    query {
        assignment(assignment_id: $id) {
            id, 
            name, 
            data, 
            course(course_id: $course_id) {
                content_info
            }
        }
    }
`;
