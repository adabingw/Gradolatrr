<script>
// @ts-nocheck

    import { query, mutation } from 'svelte-apollo';

    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import Button from '../utils/Button.svelte';
    import InfoTable from '../utils/InfoTable.svelte';
    import { COURSE_INFO } from "../constants/queries_get";
    import { DELETE_COURSE } from '../constants/queries_delete';
    
    export let id;
    export let name;

    let query_result = query(COURSE_INFO, {
        variables: { id }
    });
    let info;
    let last_info;
    let delete_course = mutation(DELETE_COURSE);

    function saveChanges() {
        console.log("save changes")
        console.log(info)
    }

    async function deleteCourse(course_id) {
        try {
            await delete_course({ 
                variables: { 
                    input: {
                        id: course_id, 
                        type: "course"
                    }
                } 
            });
        } catch (error) {
            console.error(error);
        }
        query_result.refetch({ id }); 
    }

    $: {
        console.log($query_result)
        if ($query_result.data != undefined && (last_info == info)) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));
        }
    }

    $: {
        console.log(id)
        query_result.refetch({ id });
        last_info = info;
    }

    $: {
        console.log(info);
        last_info = undefined;
    }

</script>

<div>
    <p>{name}</p>
    {#if info != undefined}
        <InfoTable cmd="course" bind:info={info.getCourse} />
    {/if}
    <div class="term-op">
        <Button text="delete this course" on:click={deleteCourse}/>
    </div>
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
