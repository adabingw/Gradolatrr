
<script context='module'>
import { mutation } from "svelte-apollo";
import { DELETE_ASSIGN, DELETE_COURSE } from "./queries_delete";

let delete_assign = mutation(DELETE_ASSIGN);
let delete_course = mutation(DELETE_COURSE);

export const deleteAssignment = async (assign_id) => {
    await delete_assign({ 
        variables: { 
            input: {
                id: assign_id, 
                type: "item"
            }
        } 
    });
}

export const deleteCourse = async(course_id) => {
    await delete_course({ 
        variables: { 
            input: {
                id: course_id, 
                type: "course"
            }
        } 
    });
}
</script>
