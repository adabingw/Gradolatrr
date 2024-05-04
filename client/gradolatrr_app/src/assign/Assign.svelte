<script>
// @ts-nocheck

    import { query, mutation } from "svelte-apollo";
    import { navigate } from "svelte-navigator";
    import { tooltip } from '@svelte-plugins/tooltips';

    import InfoTable from '../utils/InfoTable.svelte';
    import { ASSIGN_INFO } from "../constants/queries_get";
    import { UPDATE_COURSE, UPDATE_ASSIGNMENT } from "../constants/queries_put";
    import HeaderField from "../utils/HeaderField.svelte";
    import { onDestroy } from "svelte";
    import { DELETE_ASSIGN } from "../constants/queries_delete";
    import Folder from "../utils/Folder.svelte";

    export let id;
    export let name;
    export let course_id; 
    export let course_name;
    export let term_id;
    export let term_name;
    export let reload;

    let query_result = query(ASSIGN_INFO, {
        variables: { id }
    });
    let info;
    let last_info;
    let del = false;
    let update_course = mutation(UPDATE_COURSE);
    let update_assign = mutation(UPDATE_ASSIGNMENT);
    let delete_assign = mutation(DELETE_ASSIGN);

    async function deleteAssignment(assign_id) {
        let confirmDelete = confirm("Delete this assignment?");
        if (!confirmDelete) return;
        del = true;
        try {
            await delete_assign({ 
                variables: { 
                    input: {
                        id: id, 
                        type: "item"
                    }
                } 
            });
            navigate(`/course/${term_id}/${term_name}/${course_id}/${course_name}`)
        } catch (error) {
            console.error(error);
        }
    }

    async function saveChanges() {
        if (del) return;
        if (!name) {
            alert("Name cannot be empty!");
            return;
        }
        try {
            await update_assign({
                variables: {
                    input: {
                        id: id, 
                        type: "item",
                        course_id: course_id,
                        term_id: term_id, 
                        name: name, 
                        data: info["getAssignment"]["data"],
                    }
                }
            });
        } catch(error) {
            console.error(error);
        }
    }

    // only for multiselect
    async function saveCourseChanges(content_info) {        
        try {
            await update_course({
                variables: {
                    input: {
                        id: course_id, 
                        term_id: term_id, 
                        name: course_name, 
                        type: "course",
                        content_info: JSON.stringify(content_info)
                    }
                }
            });
        } catch(error) {
            console.error(error);
        }
    }

    onDestroy(() => {
        saveChanges();
    })

    function updateChange(event) {
        info["getAssignment"]["data"] = JSON.stringify(event.detail.data);
        saveChanges();
            
        if (event.detail.key != undefined) {
            let content_info = JSON.parse(info["getAssignment"]["course"]["content_info"])
            content_info[event.detail.key]["tag_info"] = event.detail.data[event.detail.key]["tag_info"];
            saveCourseChanges(content_info);
        }
    }

    function loadData() {
        if ($query_result.loading == true) return;
        info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
        let content_info = JSON.parse(info["getAssignment"]["course"]["content_info"])
        let info_temp = JSON.parse(info["getAssignment"]["data"]);
        for (let c of Object.keys(content_info)) {
            if (info_temp[c] == undefined) {
                let value = content_info[c]
                if (value["type"] == "text") {
                    info_temp[c] = {
                        "content": "", 
                        "type": value["type"]
                    };
                } else if (value["type"] == "number") {
                    info_temp[c] = {
                        "content": 0, 
                        "type": value["type"]
                    };
                } else if (value["type"] == "multiselect" || value["type"] == "singleselect") {
                    info_temp[c] = {
                        "content": [], 
                        "type": value["type"], 
                        "tag_info": content_info[c]["tag_info"]
                    };
                } else if (value["type"] == "date") {
                    info_temp[c] = {
                        "content": (new Date()).toISOString().split('T')[0],
                        "type": value["type"]
                    }
                }
            } else if (info_temp[c] != undefined) {
                if (content_info[c]["type"] == "multiselect" || content_info[c]["type"] == "singleselect") {
                    info_temp[c]["tag_info"] = content_info[c]["tag_info"];
                }
            }
        }

        info["getAssignment"]["data"] = JSON.stringify(info_temp);
        last_info = JSON.parse(JSON.stringify(info));
    }

    $: {
        $query_result
        if ($query_result.data != undefined && ( JSON.stringify(last_info) === JSON.stringify(info))) {
            loadData();
            last_info = JSON.parse(JSON.stringify(info));
        }
    }

    $: {
        id;
        query_result.refetch({ id });
        last_info = info;
    }

    $: {
        info;
        last_info = undefined;
    }

    $: {
        reload;
        query_result.refetch({ id });
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="page">
    <Folder term_id={term_id} term_name={term_name} course_id={course_id} course_name={course_name} assign_name={name} />
    <HeaderField bind:inputText={name} text="" on:message={(event) => {name = event.detail.data;}}/>    
    {#if info != undefined}
        <InfoTable cmd="assign" bind:info={info.getAssignment} on:message={updateChange}/>
    {/if}
    <div class="term-op">
        <i class="fa-solid fa-trash-can" on:click={() => deleteAssignment()}
            use:tooltip={{
                content: 'delete',
                style: { backgroundColor: '#515151', color: '#ffffff', padding: '5px 5px 5px 5px' },
                position: 'left',
                animation: 'slide',
                arrow: false
            }}
            ></i>
        <i class="fa-solid fa-floppy-disk" on:click={() => saveChanges()}
            use:tooltip={{
                content: 'save',
                style: { backgroundColor: '#515151', color: '#ffffff', padding: '5px 5px 5px 5px' },
                position: 'left',
                animation: 'slide',
                arrow: false
            }}    
        ></i>
    </div>
</div>

<style>

</style>
