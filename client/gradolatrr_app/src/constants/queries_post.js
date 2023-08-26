// for insert queries

import { gql } from "@apollo/client";

const ADD_TERM = gql`
    mutation {
        add_term(
            id: $id, 
            name: $name, 
            archived: $archived, 
            current: $current, 
            data: $data) {
                id
            }
    }
`;

const ADD_COURSE = gql`
    mutation {
        add_course(
            id: $id,
            name: $name, 
            termId: $term_id, 
            termName: $term_name, 
            data: $data, 
            contentInfo: $content_info) {
                id
            }
    }
`;

const ADD_ASSIGNMENTS = gql`
    mutation {
        add_assignments(
            id: $id,
            num: $num,
            suffix: $suffix,
            courseId: $course_id, 
            courseName: $course_name, 
            termId: $term_id, 
            termName: $term_name, 
            data: $data) {
                id
            }
    }
`;

const ADD_ASSIGNMENT = gql`
    mutation {
        add_assignment(
            id: $id,
            name: $name,
            courseId: $course_id, 
            courseName: $course_name, 
            termId: $term_id, 
            termName: $term_name, 
            data: $data) {
                id
            }
    }
`;
