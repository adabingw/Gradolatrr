// for delete queries

import { gql } from "@apollo/client";

const DELETE_TERM = gql`
    mutation DeleteTerm($input: DeleteGrAppInput!) {
        deleteTerm(input: $input) { id }
    }
`;

const DELETE_COURSE = gql`
    mutation DeleteCourse($input: DeleteGrAppInput!) {
        deleteCourse(input: $input) { id }
    }
`;

const DELETE_ASSIGN = gql`
    mutation DeleteAssign($input: DeleteGrAppInput!) {
        deleteAssignment(input: $input) { id }
    }
`;

const DELETE_COURSE_FROM_TERM = gql`
    mutation DeleteCoursefromTerm($input: DeleteGrAppInput!) {
        deleteCoursefromTerm(input: $input) { id }
    }
`;

const DELETE_ASSIGN_FROM_TERM = gql`
    mutation DeleteAssignmentfromTerm($input: DeleteGrAppInput!) {
        deleteAssignmentfromTerm(input: $input) { term_id }
    }
`;

const DELETE_ASSIGN_FROM_COURSE = gql`
    mutation DeleteAssignmentfromTerm($input: DeleteGrAppInput!) {
        deleteAssignmentfromCourse(input: $input) { id }
    }
`;

export {
    DELETE_TERM, 
    DELETE_COURSE, 
    DELETE_ASSIGN, 
    DELETE_ASSIGN_FROM_COURSE,
    DELETE_COURSE_FROM_TERM,
    DELETE_ASSIGN_FROM_TERM
};
