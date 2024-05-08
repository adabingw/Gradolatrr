<script>
// @ts-nocheck
    
    import { query, mutation } from 'svelte-apollo';
    import { v4 as uuidv4 } from 'uuid';
    import { navigate } from 'svelte-navigator';
    import { onDestroy } from 'svelte';

    import Folder from '../utils/Folder.svelte';
    import HeaderField from '../utils/HeaderField.svelte';
    import new_assign from "../constants/new_assign.json";
    import InfoTable from '../utils/InfoTable.svelte';
    import { GET_CONTENT_INFO } from '../constants/queries_get';
    import { ADD_ASSIGNMENT } from '../constants/queries_post';
    import { UPDATE_COURSE } from '../constants/queries_put';
    import TooltipIcon from '../utils/TooltipIcon.svelte';
    import { mapData } from './assignUtil.js';

    export let course_id;
    export let course_name;
    export let term_id;
    export let term_name;

    let id = uuidv4();
    let name;
    let data_changed = false;
    let add_assign = mutation(ADD_ASSIGNMENT);
    let update_course = mutation(UPDATE_COURSE);
    let query_result = query(GET_CONTENT_INFO, {
        variables: { id: course_id }
    });
    let last_assign = JSON.parse(JSON.stringify(new_assign));
    let info;

    async function saveChanges() {        
        if (name == "" || name == undefined) {
            alert("Name is required");
            return;
        }
        if (id == -1) return;

        let data = typeof new_assign["data"] == 'object' ? new_assign["data"] : JSON.parse(new_assign["data"])

        let content_info = JSON.parse(new_assign["content_info"])
        for (let i of Object.keys(content_info)) {
            if (content_info[i]['required'] && !data[i]['content'] && data[i]['content'] != 0) {
                alert("Please fill in all required fields")
                return;
            }
        }

        data["name"]["content"] = name;
        info = JSON.parse(JSON.stringify(new_assign));
        info["data"] = JSON.stringify(data);

        try {
            await add_assign({ 
                    variables: { 
                        input: {
                            id: id, 
                            term_id: term_id, 
                            course_id: course_id, 
                            name: name, 
                            type: "item", 
                            data: info["data"],
                        }
                    } 
                }).then((response) => {
                    console.log(response)
                });
        } catch (error) {
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
        if (!data_changed && !name) return;
        saveChanges();
    })

    $: {
        if ($query_result.data != undefined && ( JSON.stringify(last_assign) === JSON.stringify(new_assign))) {
            new_assign["content_info"] = $query_result["data"]["getCourse"]["content_info"]
            if (typeof new_assign["data"] != Object) new_assign["data"] = {}
            let content_info = JSON.parse(new_assign["content_info"])
            for (let i of Object.keys(content_info)) {
                new_assign['data'][i] = mapData(content_info[i])
            }
            info = JSON.parse(JSON.stringify(new_assign));
            info["data"] = JSON.stringify(new_assign["data"]);
            last_assign = JSON.parse(JSON.stringify(new_assign));
        }
    }

    function dataChange(event) {
        data_changed = true;
        last_assign = undefined;
        let thing = event.detail.data;
        if (event.detail.key != undefined) {
            let content_info = JSON.parse(new_assign["content_info"])
            content_info[event.detail.key]["tag_info"] = event.detail.data[event.detail.key]["tag_info"];
            saveCourseChanges(content_info);
        }
        info["data"] = JSON.parse(JSON.stringify(thing));
        new_assign["data"] = JSON.parse(JSON.stringify(thing));
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="page">
    <Folder term_id={term_id} term_name={term_name} course_id={course_id} course_name={course_name} assign_name={name} />
    <HeaderField bind:inputText={name} text="Untitled item" on:message={(event) => {data_changed = true; name = event.detail.data;}}/>    
    {#if info != undefined}
        <InfoTable cmd="assign" bind:info={info} on:message={dataChange} />
    {/if}
    <div class="term-op">
        <TooltipIcon icon='fa-solid fa-ban' position='left' text='cancel'
            click={() => {
                data_changed = false;
                navigate(`/course/${term_id}/${term_name}/${course_id}/${course_name}`)
            }} 
        />
        <TooltipIcon icon='fa-solid fa-floppy-disk' click={saveChanges} position='left' text='save'/>
    </div>
</div>

<style>

</style>
