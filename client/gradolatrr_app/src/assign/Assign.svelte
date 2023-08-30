<script>
    import { query, mutation } from "svelte-apollo";
    import { navigate } from "svelte-navigator";

    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import InfoTable from '../utils/InfoTable.svelte';
    import { ASSIGN_INFO } from "../constants/queries_get";
    import { UPDATE_ASSIGNMENT } from "../constants/queries_put";
    import TextField from "../utils/TextField.svelte";

    export let id;
    export let name;
    export let course_id; 
    export let course_name;
    export let term_id;
    export let term_name;

    let query_result = query(ASSIGN_INFO, {
        variables: { id }
    });
    let info;
    let last_info;
    let update_assign = mutation(UPDATE_ASSIGNMENT);

    async function saveChanges() {
        console.log("save changes")
        console.log(info);
        console.log(name);
        try {
            await update_assign({
                variables: {
                    input: {
                        id: id, 
                        type: "item",
                        course_id: course_id,
                        term_id: term_id, 
                        name: name, 
                        data: info["getAssignment"]["data"],
                    }
                }
            });
            navigate(`/assign/edit/${term_id}/${term_name}/${course_id}/${course_name}/${id}/${name}`);
        } catch(error) {
            console.error(error);
        }
    }

    function nameChange() {
        let info_temp = JSON.parse(info["getAssignment"]["data"]);
        info_temp["name"]["content"] = name;
        info["getAssignment"]["data"] = JSON.stringify(info_temp);
    }

    $: {
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
    <!-- <p>{name}</p>     -->
    <TextField bind:inputText={name} type="text" text="" on:message={nameChange}/>
    <p>{term_name}/{course_name}</p>
    {#if info != undefined}
        <InfoTable cmd="assign" bind:info={info.getAssignment} />
    {/if}
    <CancelOrSave url={`/course/${term_id}/${term_name}/${course_id}/${course_name}`} on:message={saveChanges} />
</div>

<style>
.assign-style {
    text-align: left;
}
</style>
