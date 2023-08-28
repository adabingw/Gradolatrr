<script>
    import { query } from "svelte-apollo";

    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import InfoTable from '../utils/InfoTable.svelte';
    import { ASSIGN_INFO } from "../constants/queries_get";

    export let id;
    export let name;

    let query_result = query(ASSIGN_INFO, {
        variables: { id }
    });
    let info;
    let last_info;

    function saveChanges() {
        console.log("save changes")
        console.log(info);
        // DONE
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
    <p>{name}</p>    
    {#if info != undefined}
        <InfoTable cmd="assign" bind:info={info.getAssignment} />
    {/if}
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>

<style>
.assign-style {
    text-align: left;
}
</style>
