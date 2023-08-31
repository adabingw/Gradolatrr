<script>    
    import { query, mutation } from "svelte-apollo";
    import { navigate } from "svelte-navigator";
    import { createEventDispatcher } from "svelte";

    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import Button from "../utils/Button.svelte";
    import term_info from "../constants/term_info.json";
    import InfoTable from '../utils/InfoTable.svelte';
    import TextField from "../utils/TextField.svelte";
    import { TERM_INFO } from "../constants/queries_get";
    import { DELETE_TERM } from "../constants/queries_delete";
    import { UPDATE_TERM } from "../constants/queries_put";

    const dispatch = createEventDispatcher();

    export let id;
    export let name;

    let query_result = query(TERM_INFO, {
        variables: { id }
    });
    let info;
    let last_info;
    let checked = query_result["current"];
    let delete_term = mutation(DELETE_TERM);
    let update_term = mutation(UPDATE_TERM);

    function archiveClick() {
        term_info["archived"] = !term_info["archived"];
        // info = term_info;
        console.log("archiving course")
    }

    async function deleteTerm() {
        let confirmDelete = confirm("delete this term?");
        if (!confirmDelete) return;

        try {
            await delete_term({ 
                variables: { 
                    input: {
                        id: id, 
                        type: "term"
                    }
                } 
            });
            dispatch('message', {
                text: "reload"
            });
        } catch (error) {
            console.error(error);
        }
        navigate("/"); // -1
    }

    async function saveChanges() {
        console.log("save changes")
        console.log(info);
        try {
            await update_term({
                variables: {
                    input: {
                        id: id, 
                        type: "term", 
                        name: name, 
                        current: info["getTerm"]["current"], 
                        archive: info["getTerm"]["archive"], 
                        data: info["getTerm"]["data"]
                    }
                }
            });
            navigate(`/term/${id}/${name}`);
            dispatch('message', {
                text: "reload"
            });
        } catch(error) {
            console.error(error);
        }
    }

    $: {
        if ($query_result.data != undefined && (last_info == info)) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));;
        }
    }

</script>

<div>
    <TextField bind:inputText={name} type="text" text="" min="" max=""  focus={true}/>
    <label>
        <input type="checkbox" bind:checked={checked} /> select as current term.
    </label>
    {#if info != undefined} 
        <InfoTable cmd="term" bind:info={info["getTerm"]} />
    {/if}
    <div class="term-op" on:click={deleteTerm}>
        <Button text="delete this term" />
    </div>
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
