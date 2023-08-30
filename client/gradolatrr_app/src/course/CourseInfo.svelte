<script>
// @ts-nocheck

    import { query, mutation } from 'svelte-apollo';
    import { navigate } from 'svelte-navigator';
    import { createEventDispatcher } from 'svelte';

    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import Button from '../utils/Button.svelte';
    import InfoTable from '../utils/InfoTable.svelte';
    import TextField from '../utils/TextField.svelte';
    import { COURSE_INFO } from "../constants/queries_get";
    import { DELETE_COURSE } from '../constants/queries_delete';
    import { UPDATE_COURSE } from '../constants/queries_put';
    
    export let id;
    export let name;
    export let term_id; 
    export let term_name;

    const dispatch = createEventDispatcher();

    let query_result = query(COURSE_INFO, {
        variables: { id }
    });
    let info;
    let last_info;
    let delete_course = mutation(DELETE_COURSE);
    let update_course = mutation(UPDATE_COURSE);

    async function saveChanges() {
        console.log("save changes");
        console.log(info);
        try {
            await update_course({
                variables: {
                    input: {
                        id: id, 
                        type: "course",
                        term_id: term_id, 
                        name: name, 
                        data: info["getCourse"]["data"],
                        content_info: info["getCourse"]["content_info"]
                    }
                }
            });
            navigate(`/course/edit/${term_id}/${term_name}/${id}/${name}`);
            dispatch('message', {
                text: "reload"
            });
        } catch(error) {
            console.error(error);
        }
    }

    async function deleteCourse() {
        let confirmDelete = confirm("delete this course?");
        if (!confirmDelete) return;

        try {
            await delete_course({ 
                variables: { 
                    input: {
                        id: id, 
                        type: "course"
                    }
                } 
            });
            dispatch('message', {
                text: "reload"
            });
            navigate("/");
        } catch (error) {
            console.error(error);
        }
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
    <TextField bind:inputText={name} type="text" text="" />
    {#if info != undefined}
        <InfoTable cmd="course" bind:info={info.getCourse} />
    {/if}
    <div class="term-op" on:click={() => deleteCourse()}>
        <Button text="delete this course" />
    </div>
    <CancelOrSave url={`/course/${term_id}/${term_name}/${id}/${name}`} on:message={saveChanges} />
</div>
