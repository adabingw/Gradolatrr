<script>
    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import TextField from "../utils/TextField.svelte";
    import InfoTable from "../utils/InfoTable.svelte";
    import new_term from "../constants/new_term.json";

    let id = 1129;
    let checked;
    let name;

    let info = new_term;

    function saveChanges() {
        console.log("save changes")
        console.log(info)
    }
</script>

<div>
    <p>Create new term</p>
    <TextField type="text" text="term name" bind:inputText={name}/>
    <label>
        <input type="checkbox" bind:checked={checked} /> select as current term.
        <!-- CHECK IF HAS CURRENT TERM FOR OTHER TERM. IF YES, RAISE ERROR -->
    </label>
    <InfoTable cmd="course" bind:info={info} />
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
