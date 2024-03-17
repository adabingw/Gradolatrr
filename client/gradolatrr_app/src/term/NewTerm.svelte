<script>
    import { query, mutation } from "svelte-apollo";
    import { v4 as uuidv4 } from 'uuid';
    import { navigate } from 'svelte-navigator';
    import { createEventDispatcher, onDestroy } from "svelte";

    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import TextField from "../utils/TextField.svelte";
    import InfoTable from "../utils/InfoTable.svelte";
    import new_term from "../constants/new_term.json";
    import { ADD_TERM } from "../constants/queries_post";
    import { TERM_ORDERS } from "../constants/queries_get";
    import HeaderField from "../utils/HeaderField.svelte";

    const dispatch = createEventDispatcher();

    let id = uuidv4();
    let checked;
    let name;
    let archived = false;
    let add_term = mutation(ADD_TERM);
    let query_result = query(TERM_ORDERS);
    let max_order = 0;

    let info = JSON.parse(JSON.stringify(new_term));
    info["data"] = JSON.stringify(info["data"]);

    onDestroy(() => {
        console.log("on destroy on new term")
        saveChanges();
    })

    async function saveChanges() {
        if (name == "" || name == undefined) {
            alert("name is required");
            return;
        }

        if (id == -1) {
            alert("something went wrong. please try again.")
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
                        data: info["data"], 
                        order: max_order
                    }
                } 
            });
            navigate(`/term/${id}/${name}`);
        } catch (error) {
            console.error(error);
        }

        dispatch('message', {
            text: "reload"
        });
    }

    function updateChange(event) {
        info["getTerm"]["data"] = event.detail.data;
    }

    $: {
        if ($query_result.data != undefined) {
            for (let item of $query_result["data"]["allTerm"]["items"]) {
                if (!isNaN(item["order"]) && item["order"] != null && item["order"] != undefined) {
                    max_order = Math.max(max_order, item["order"]) + 1;
                }
            }
        }
    }

</script>

<div class="term">
    <HeaderField bind:inputText={name} text="Untitled Term"/>    
    {#if info["data"] != undefined}
        <InfoTable cmd="term" bind:info={info} on:message={updateChange} />
    {/if} 
</div>

<style>
.term {
    padding-left: 50px;
}

</style>
