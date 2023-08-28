<script>
    import { mutation } from "svelte-apollo";
    import { v4 as uuidv4 } from 'uuid';

    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import TextField from "../utils/TextField.svelte";
    import InfoTable from "../utils/InfoTable.svelte";
    import new_term from "../constants/new_term.json";
    import { ADD_TERM } from "../constants/queries_post";

    let id = uuidv4();
    let checked;
    let name;
    let archived = false;
    let add_term = mutation(ADD_TERM);

    let info = JSON.parse(JSON.stringify(new_term));
    info["data"] = JSON.stringify(info["data"]);

    async function saveChanges() {
        if (name == "" || name == undefined) {
            alert("name is required");
            return;
        }

        if (id == -1) {
            alert("something went wrong. please try again.")
            console.log("id is -1");
            return;
        }

        try {
            await add_term({ 
                variables: { 
                    input: {
                        id: id, 
                        name: name, 
                        type: "term",
                        archived: archived, 
                        current: checked, 
                        data: info["data"] 
                    }
                } 
            });
        } catch (error) {
            console.error(error);
        }
    }

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
