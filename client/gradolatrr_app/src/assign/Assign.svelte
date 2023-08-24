<script>
    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import assign_info from "../data/assign_info.json";
    import InfoTable from '../utils/InfoTable.svelte';

    export let id;
    export let name;
    let info = assign_info;

    function saveChanges() {
        console.log("save changes")
        console.log(info);
        // DONE
    }

</script>

<div>
    <p>{name}</p>    
    {#if info != undefined}
        <InfoTable cmd="assign" bind:info={info} />
    {/if}
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>

<style>
.assign-style {
    text-align: left;
}
</style>
