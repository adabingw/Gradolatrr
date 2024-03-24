<script>
    import { query, mutation } from "svelte-apollo";
    import { v4 as uuidv4 } from 'uuid';
    import { navigate } from 'svelte-navigator';
    import { createEventDispatcher, onDestroy } from "svelte";

    import InfoTable from "../utils/InfoTable.svelte";
    import new_term from "../constants/new_term.json";
    import { ADD_TERM } from "../constants/queries_post";
    import { TERM_ORDERS } from "../constants/queries_get";
    import HeaderField from "../utils/HeaderField.svelte";
  import Folder from "../utils/Folder.svelte";

    const dispatch = createEventDispatcher();

    let id = uuidv4();
    let checked;
    let name;
    let archived = false;
    let add_term = mutation(ADD_TERM);
    let query_result = query(TERM_ORDERS);
    let max_order = 0;
    let data_changed = false;

    let info = JSON.parse(JSON.stringify(new_term));
    info["data"] = JSON.stringify(info["data"]);

    onDestroy(() => {
        console.log("on destroy on new term")
        saveChanges();
    })

    async function saveChanges() {
        if (!data_changed && !name) return;

        if (name == "" || name == undefined) {
            alert("Name is required");
            return;
        }

        if (id == -1) {
            alert("Something went wrong. please try again.")
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
        data_changed = true;
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

<div class="page">
    <Folder term_id={id} term_name={name} course_id={""} course_name={""} assign_name={""} />
    
    <HeaderField bind:inputText={name} text="Untitled Term"/>    
    {#if info["data"] != undefined}
        <InfoTable cmd="term" bind:info={info} on:message={updateChange} />
    {/if} 

    <div class="term-op">
        <i class="fa-solid fa-ban" on:click={() => navigate(`/`)}></i>
        <i class="fa-solid fa-floppy-disk" on:click={() => saveChanges()}></i>
    </div>
</div>

<style>

</style>
