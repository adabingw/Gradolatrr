<script>    
    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import Button from "../utils/Button.svelte";
    import term_info from "../data/term_info.json";
    import InfoTable from '../utils/InfoTable.svelte';

    export let id;
    export let name;

    // get info from id
    let info = term_info
    let checked = info["current"];

    function archiveClick() {
        term_info["archived"] = !term_info["archived"];
        info = term_info;
        console.log("archiving course")
    }

    function saveChanges() {
        console.log("save changes")
    }

</script>

<div>
    <p>{name}</p>    
    <label>
        <input type="checkbox" bind:checked={checked} /> select as current term.
    </label>
    {#if info != undefined} 
        <InfoTable cmd="term" bind:info={info} />
    {/if}
    <div class="term-op">
        <!-- <Button text={`${info["metadata"]["archived"] ? "un" : ""}archive this course`} on:click={archiveClick} /> -->
        <Button text="delete this term" />
    </div>
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
