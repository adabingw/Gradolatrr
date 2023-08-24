const {
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLBoolean, 
    GraphQLID, 
    GraphQLInt, 
    GraphQLString, 
    GraphQLNonNull, 
    GraphQLUnionType, 
    GraphQLList
} = require('graphql');

const RootQuery = new GraphQLObjectType({
    name: 'root',
    fields: () => ({
        term: {
            type: Term,
            description: 'a term',
            args: {
                id: { type: GraphQLID }
            },
            resolve: (parent, args) => {

            }
        },
        terms: {
            type: new GraphQLList(Term),
            description: 'all the terms',
            resolve: () => {

            }
        },
        all_courses: {
            type: new GraphQLList(Course), 
            description: 'all the courses', 
            resolve: () => {

            }
        },
        courses: {
            type: new GraphQLList(Course),
            description: 'all the courses from a term',
            args: {
                term_id: { type: GraphQLID }
            },
            resolve: (parent, args) => {

            }
        },
        course: {
            type: AuthorType,
            description: 'a single course',
            args: {
                course_id: { type: GraphQLID }
            },
            resolve: (parent, args) => {

            }
        },
        all_assignments: {
            type: new GraphQLList(Assignment), 
            description: 'all the courses', 
            resolve: () => {

            }
        },
        assignments: {
            type: new GraphQLList(Assignment),
            description: 'all the assignments from a course',
            args: {
                course_id: { type: GraphQLID }
            },
            resolve: (parent, args) => {

            }
        },
        assignment: {
            type: AuthorType,
            description: 'a single assignment',
            args: {
                assignment_id: { type: GraphQLID }
            },
            resolve: (parent, args) => {

            }
        }
    })
})

const Assignment = GraphQLSchema ({
    name: 'assignment', 
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) }, 
        type: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        course_id: { type: GraphQLNonNull(GraphQLID) },
        course_name: { type: GraphQLNonNull(GraphQLString) },
        term_id: { type: GraphQLNonNull(GraphQLID) },
        term_name: { type: GraphQLNonNull(GraphQLString) },
        data: { type: GraphQLList(Data)}, 
        course: {
            type: Course, 
            resolve: (course_id) => {

            }
        }, 
        term: {
            type: Term, 
            resolve: (term_id) => {

            }
        }
    })
});

const Course = GraphQLSchema ({
    name: 'course', 
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) }, 
        type: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        term_id: { type: GraphQLNonNull(GraphQLID) },
        term_name: { type: GraphQLNonNull(GraphQLString) },
        data: { type: GraphQLList(GraphQLNonNull(Data))}, 
        content_info: { type: GraphQLList(GraphQLNonNull(ContentInfo))}, 
        assignments: {
            type: GraphQLList(Assignment), 
            resolve: (course_id) => {

            }
        }, 
        term: {
            type: Term, 
            resolve: (term_id) => {

            }
        }
    })
});

const Term = GraphQLSchema ({
    name: 'term', 
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) }, 
        type: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        archived: { type: GraphQLNonNull(GraphQLBoolean) },
        current: { type: GraphQLNonNull(GraphQLBoolean) },
        data: { type: GraphQLList(GraphQLNonNull(Data))},
        courses: {
            type: GraphQLList(Course), 
            resolve: (term_id) => {

            }
        }
    })
});

const ContentInfo = GraphQLSchema ({
    name: 'content_info', 
    fields: () => ({
        type: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        checked: { type: GraphQLNonNull(GraphQLBoolean) },
        required: { type: GraphQLNonNull(GraphQLBoolean) },
        order: { type: GraphQLNonNull(Int)}, 
    })
});

const Data = GraphQLSchema ({
    name: 'data', 
    fields: () => ({
        type: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        checked: { type: GraphQLNonNull(GraphQLBoolean) },
        required: { type: GraphQLNonNull(GraphQLBoolean) },
        order: { type: GraphQLNonNull(Int)}, 
    })
});

const DynamicType = new GraphQLUnionType({
    name: "dynamic_type",
    types: [GraphQLInt, GraphQLString, [[GraphQLString, GraphQLString]]],
    resolveType(value) {
      if (value instanceof GraphQLInt) {
        return GraphQLInt
      }
      if (value instanceof GraphQLString) {
        return GraphQLString
      }
      if (value instanceof [[GraphQLString, GraphQLString]]) {
        return [[GraphQLString, GraphQLString]]
      }
    }
});

const RootMutation = new GraphQLObjectType({
    name: 'mutation',
    fields: () => ({
        add_assignment: {
            type: Assignment,
            description: 'add an assignment',
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }, 
                type: { type: GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLNonNull(GraphQLString) },
                course_id: { type: GraphQLNonNull(GraphQLID) },
                course_name: { type: GraphQLNonNull(GraphQLString) },
                term_id: { type: GraphQLNonNull(GraphQLID) },
                term_name: { type: GraphQLNonNull(GraphQLString) },
                data: { type: GraphQLList(Data)}
            },
            resolve: (parent, args) => {
            
            }
        },
        add_assignments: {
            type: GraphQLList(Assignment),
            description: 'add bundle',
            args: {
                id: { type: GraphQLList(GraphQLNonNull(GraphQLID)) }, 
                type: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
                name: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
                course_id: { type: GraphQLList(GraphQLNonNull(GraphQLID)) },
                course_name: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
                term_id: { type: GraphQLList(GraphQLNonNull(GraphQLID)) },
                term_name: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
                data: { type: GraphQLList(GraphQLList(Data))}, 
            },
            resolve: (parent, args) => {
            
            }
        }, 
        add_course: {
            type: Course,
            description: 'add a course',
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }, 
                type: { type: GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLNonNull(GraphQLString) },
                term_id: { type: GraphQLNonNull(GraphQLID) },
                term_name: { type: GraphQLNonNull(GraphQLString) },
                data: { type: GraphQLList(GraphQLNonNull(Data))}, 
                content_info: { type: GraphQLList(GraphQLNonNull(ContentInfo))}
            },
            resolve: (parent, args) => {
              
            }
        },
        add_term: {
            type: Term,
            description: 'add a term',
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }, 
                type: { type: GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLNonNull(GraphQLString) },
                archived: { type: GraphQLNonNull(GraphQLBoolean) },
                current: { type: GraphQLNonNull(GraphQLBoolean) },
                data: { type: GraphQLList(GraphQLNonNull(Data))}
            },
            resolve: (parent, args) => {
              
            }
        },
        update_assignment: {
            type: Assignment, 
            description: 'update a term', 
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }, 
                data: { type: GraphQLList(Data)}
            }, 
            resolve: (parent, args) => {

            }
        }
    })
})
  
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})

module.exports = {
    schema
};  
