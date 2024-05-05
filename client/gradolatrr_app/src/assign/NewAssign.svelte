<script>
// @ts-nocheck
    
    import { query, mutation } from 'svelte-apollo';
    import { v4 as uuidv4 } from 'uuid';
    import { navigate } from 'svelte-navigator';
    import { onDestroy } from 'svelte';
    import { tooltip } from '@svelte-plugins/tooltips';

    import Folder from '../utils/Folder.svelte';
    import HeaderField from '../utils/HeaderField.svelte';
    import new_assign from "../constants/new_assign.json";
    import InfoTable from '../utils/InfoTable.svelte';
    import { GET_CONTENT_INFO } from '../constants/queries_get';
    import { ADD_ASSIGNMENT } from '../constants/queries_post';
    import { UPDATE_COURSE } from '../constants/queries_put';

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
                let value = content_info[i];
                if (value["type"] == "text") {
                    new_assign["data"][i] = {
                        "content": "", 
                        "type": value["type"]
                    };
                } else if (value["type"] == "number") {
                    new_assign["data"][i] = {
                        "content": 0, 
                        "type": value["type"]
                    };
                } else if (value["type"] == "multiselect" || value["type"] == "singleselect") {
                    new_assign["data"][i] = {
                        "content": [], 
                        "type": value["type"], 
                        "tag_info": content_info[i]["tag_info"]
                    };
                } else if (value["type"] == "date") {
                    new_assign["data"][i] = {
                        "content": (new Date()).toISOString().split('T')[0],
                        "type": value["type"]
                    };
                } else if (value["type"] == "checked") {
                    new_assign["data"][i] = {
                        "content": false,
                        "type": value["type"]
                    };
                }
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
        <InfoTable cmd="assign" bind:info={info} on:message={dataChange}/>
    {/if}
    <div class="term-op">
        <i class="fa-solid fa-ban" on:click={() => navigate(`/course/${term_id}/${term_name}/${course_id}/${course_name}`)}
            use:tooltip={{
                content: 'cancel',
                style: { backgroundColor: '#515151', color: '#ffffff', padding: '5px 5px 5px 5px' },
                position: 'left',
                animation: 'slide',
                arrow: false
            }}></i>
        <i class="fa-solid fa-floppy-disk" on:click={() => saveChanges()}
            use:tooltip={{
                content: 'save',
                style: { backgroundColor: '#515151', color: '#ffffff', padding: '5px 5px 5px 5px' },
                position: 'left',
                animation: 'slide',
                arrow: false
            }}></i>
    </div>
</div>

<style>

</style>
