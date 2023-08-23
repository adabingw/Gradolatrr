<script>
    let id = 1129;
    let checked;
    let name;

    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import TextField from "../utils/TextField.svelte";
    import Button from "../utils/Button.svelte";
    import new_term from "../data/new_term.json";

    function addProperty() {
        console.log("add property")
    }

    function saveChanges() {
        console.log("save changes")
    }

</script>

<div>
    <p>Create new term</p>
    <TextField type="text" text="term name" bind:inputText={name}/>
    <label>
        <input type="checkbox" bind:checked={checked} /> select as current term.
        <!-- CHECK IF HAS CURRENT TERM FOR OTHER TERM. IF YES, RAISE ERROR -->
    </label>
    <Button text="+ add property" on:click={addProperty} />
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
