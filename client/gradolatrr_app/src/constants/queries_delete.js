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

export {
    DELETE_TERM, 
    DELETE_COURSE, 
    DELETE_ASSIGN
};
