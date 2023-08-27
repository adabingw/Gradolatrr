<script>
    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import TextField from "../utils/TextField.svelte";
    // @ts-ignore
    import InfoTable from "../utils/InfoTable.svelte";
    import new_term from "../constants/new_term.json";

    // @ts-ignore
    let id = 1129;
    let checked;
    let name;

    let info = new_term;
    // @ts-ignore
    info["data"] = JSON.stringify(info["data"]);

    function saveChanges() {
        console.log("save changes")
        console.log(info)
    }

    console.log(info);
</script>

<div>
    <p>Create new term</p>
    <TextField type="text" text="term name" bind:inputText={name}/>
    <label>
        <input type="checkbox" bind:checked={checked} /> select as current term.
        <!-- CHECK IF HAS CURRENT TERM FOR OTHER TERM. IF YES, RAISE ERROR -->
    </label>
    {#if info["data"] != undefined}
        <InfoTable cmd="term" bind:info={info} />
    {/if} 
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
