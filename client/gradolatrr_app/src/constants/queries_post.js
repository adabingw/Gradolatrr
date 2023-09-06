// for insert queries

import { gql } from "@apollo/client";

const ADD_TERM = gql`
    mutation AddTerm($input: CreateTermInput!) {
        createTerm(input: $input) { id }
    }
`;

const ADD_COURSE = gql`
    mutation AddCourse($input: CreateCourseInput!) {
        createCourse(input: $input) { id }
    }
`;

const ADD_ASSIGNMENT = gql`
    mutation AddAssign($input: CreateAssignmentInput!) {
        createAssignment(input: $input) { id }
    }
`;

const ADD_BUNDLE = gql`
    mutation AddBundle($input: [CreateAssignmentInput]) {
        createAssignmentBatch(input: $input) { id }
    }
`;

const DUPLICATE_TERM = gql`
    mutation DuplicateTerm($input: [DuplicateTerm]) {
        duplicateTerm(input: $input) { id }
    }
`;

export {
    ADD_TERM,
    ADD_COURSE,
    ADD_ASSIGNMENT, 
    ADD_BUNDLE, 
    DUPLICATE_TERM
}
