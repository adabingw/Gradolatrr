<script>    
    import { query } from "svelte-apollo";

    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import Button from "../utils/Button.svelte";
    import term_info from "../constants/term_info.json";
    import InfoTable from '../utils/InfoTable.svelte';
    import { TERM_INFO } from "../constants/queries_get";

    export let id;
    export let name;

    let query_result = query(TERM_INFO, {
        variables: { id }
    });
    let info;
    let last_info;
    let checked = query_result["current"];

    function archiveClick() {
        term_info["archived"] = !term_info["archived"];
        // info = term_info;
        console.log("archiving course")
    }

    function saveChanges() {
        console.log("save changes")
        console.log(info)
    }

    $: {
        if ($query_result.data != undefined && (last_info == info)) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));;
        }
    }

</script>

<div>
    <p>{name}</p>    
    <label>
        <input type="checkbox" bind:checked={checked} /> select as current term.
    </label>
    {#if info != undefined} 
        <InfoTable cmd="term" bind:info={info["getTerm"]} />
    {/if}
    <div class="term-op">
        <!-- <Button text={`${info["metadata"]["archived"] ? "un" : ""}archive this course`} on:click={archiveClick} /> -->
        <Button text="delete this term" />
    </div>
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
