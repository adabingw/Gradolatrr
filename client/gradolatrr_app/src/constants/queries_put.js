// for insert queries

import { gql } from "@apollo/client";

const UPDATE_TERM = gql`
    mutation UpdateTerm($input: UpdateTermInput!) {
        updateTerm(input: $input) { id }
    }
`;

const UPDATE_COURSE = gql`
    mutation UpdateCourse($input: UpdateCourseInput!) {
        updateCourse(input: $input) { id, order }
    }
`;

const UPDATE_ASSIGNMENT = gql`
    mutation UpdateAssign($input: UpdateAssignmentInput!) {
        updateAssignment(input: $input) { id }
    }
`;

export {
    UPDATE_ASSIGNMENT,
    UPDATE_COURSE,
    UPDATE_TERM
}
