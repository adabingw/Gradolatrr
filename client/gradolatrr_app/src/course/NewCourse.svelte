<script>
// @ts-nocheck
    import { v4 as uuidv4 } from 'uuid';
    import { query, mutation } from 'svelte-apollo';
    import { createEventDispatcher, onDestroy } from 'svelte';
    import { navigate } from 'svelte-navigator';
    
    import Folder from '../utils/Folder.svelte';
    import HeaderField from "../utils/HeaderField.svelte";
    import InfoTable from '../utils/InfoTable.svelte';
    import new_course from "../constants/new_course.json";
    import { ADD_COURSE } from '../constants/queries_post';
    import { COURSE_ORDERS } from '../constants/queries_get';

    export let term_id;
    export let term_name;

    const dispatch = createEventDispatcher();

    let id = uuidv4();
    let name;
    let add_course = mutation(ADD_COURSE);
    let query_result = query(COURSE_ORDERS, {
        variables: { id: term_id }
    });
    let info = JSON.parse(JSON.stringify(new_course));
    let max_order = 1;
    let data_changed = false;

    info["data"] = JSON.stringify(info["data"]);
    info["content_info"] = JSON.stringify(info["content_info"]);

    onDestroy(() => {
        console.log("onDestroy for Course")
        saveChanges();
    })

    function updateChange(event) {
        data_changed = true;
        info["getCourse"]["data"] = event.detail.data;
    }

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
            await add_course({ 
                variables: { 
                    input: {
                        id: id, 
                        term_id: term_id, 
                        name: name, 
                        type: "course", 
                        data: info["data"],
                        content_info: info["content_info"],
                        order: max_order
                    }
                }
            });
            dispatch('message', {
                text: "reload"
            });
            navigate(`/course/edit/${term_id}/${term_name}/${id}/${name}`);
        } catch (error) {
            console.error(error);
        }
    }

    $: {
        if ($query_result.data != undefined) {
            for (let item of $query_result["data"]["getTerm"]["courses"]) {
                if (!isNaN(item["order"]) && item["order"] != null && item["order"] != undefined) {
                    max_order = Math.max(max_order, item["order"]) + 1;
                }
            }
        }
    }
    
</script>

<div class="page">
    <Folder term_id={term_id} term_name={term_name} course_id={id} course_name={name} assign_name={""} />
    <HeaderField bind:inputText={name} text="Untitled Course"/>    
    <InfoTable cmd="course" bind:info={info} on:message={updateChange} />

    <div class="term-op">
        <i class="fa-solid fa-ban" on:click={() => navigate(`/term/${term_id}/${term_name}`)}></i>
        <i class="fa-solid fa-floppy-disk" on:click={() => saveChanges()}></i>
    </div>
</div>

<style>

</style>
