<script>
// @ts-nocheck

    import { query, mutation } from "svelte-apollo";
    import { navigate } from "svelte-navigator";

    import InfoTable from '../utils/InfoTable.svelte';
    import { ASSIGN_INFO } from "../constants/queries_get";
    import { UPDATE_COURSE, UPDATE_ASSIGNMENT } from "../constants/queries_put";
    import HeaderField from "../utils/HeaderField.svelte";
    import { onDestroy } from "svelte";
    import { DELETE_ASSIGN } from "../constants/queries_delete";
    import Folder from "../utils/Folder.svelte";
    import TooltipIcon from "../utils/TooltipIcon.svelte";
    import { mapData } from "./assignUtil";

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
                info_temp[c] = mapData(content_info[c]);
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
        <InfoTable cmd="assign" bind:info={info.getAssignment} on:message={updateChange} />
    {/if}
    <div class="term-op">
        <TooltipIcon icon='fa-solid fa-trash-can' click={deleteAssignment} position='left' text='delete'/>
        <TooltipIcon icon='fa-solid fa-floppy-disk' click={saveChanges} position='left' text='save'/>
    </div>
</div>

<style>

</style>
