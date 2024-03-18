<script>
// @ts-nocheck
    
    import { query, mutation } from 'svelte-apollo';
    import { v4 as uuidv4 } from 'uuid';
    import { navigate } from 'svelte-navigator';
    import { onDestroy } from 'svelte';

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
            alert("name is required");
            return;
        }

        if (id == -1) {
            return;
        }

        new_assign["data"]["name"]["content"] = name;

        info = JSON.parse(JSON.stringify(new_assign));
        info["data"] = JSON.stringify(new_assign["data"]);

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
        if (!data_changed) return;
        saveChanges();
    })

    $: {
        if ($query_result.data != undefined && ( JSON.stringify(last_assign) === JSON.stringify(new_assign))) {
            new_assign["content_info"] = $query_result["data"]["getCourse"]["content_info"]
            let content_info = JSON.parse(new_assign["content_info"])
            console.log(content_info)
            for (let i of Object.keys(content_info)) {
                let value = content_info[i];
                if (value["type"] == "text" || value["type"] == "textarea") {
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
        console.log("thing ", thing)
        if (event.detail.key != undefined) {
            let content_info = JSON.parse(new_assign["content_info"])
            content_info[event.detail.key]["tag_info"] = event.detail.data[event.detail.key]["tag_info"];
            console.log(content_info)
            saveCourseChanges(content_info);
        }
        info["data"] = JSON.parse(JSON.stringify(thing));
        new_assign["data"] = JSON.parse(JSON.stringify(thing));
        console.log(new_assign["data"])
    }

</script>

<div class="assign">
    <HeaderField bind:inputText={name} text="Untitled item" on:message={(event) => {data_changed = true; name = event.detail.data;}}/>
    
    <!-- <span class="header"><p class="title">Create new item</p>   <p class="section">{term_name}/{course_name}</p></span> -->
    <!-- <TextField type="text" text="item name" bind:inputText={name} min="" max="" focus={true} /> -->
    {#if info != undefined}
        <InfoTable cmd="assign" bind:info={info} on:message={dataChange}/>
    {/if}
    <!-- <CancelOrSave url={`/course/${term_id}/${term_name}/${course_id}/${course_name}`} on:message={saveChanges} /> -->
</div>

<style>
.assign {
    padding-left: 50px;
}

.header {
    display: flex; 
    flex-direction: row; 
    align-items: center;
}

.section {
    font-size: 14px;
    margin-left: 15px;
}

.title {
    font-weight: bold;
}

</style>
