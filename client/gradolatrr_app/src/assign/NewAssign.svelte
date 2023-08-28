<script>
// @ts-nocheck
    
    import { query, mutation } from 'svelte-apollo';
    import { v4 as uuidv4 } from 'uuid';

    import TextField from '../utils/TextField.svelte';
    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import new_assign from "../constants/new_assign.json";
    // @ts-ignore
    // @ts-ignore
    import InfoTable from '../utils/InfoTable.svelte';
    import { GET_CONTENT_INFO } from '../constants/queries_get';
    import { ADD_ASSIGNMENT } from '../constants/queries_post';

    export let course_id;
    export let course_name;
    export let term_id;
    export let term_name;

    // @ts-ignore
    // @ts-ignore
    let id = uuidv4();
    let name;
    let add_assign = mutation(ADD_ASSIGNMENT);

    let query_result = query(GET_CONTENT_INFO, {
        variables: { id: course_id }
    });

    new_assign["course_id"] = course_id;
    new_assign["course_name"] = course_name;
    new_assign["term_id"] = term_id;
    new_assign["term_name"] = term_name;

    let info;

    async function saveChanges() {
        console.log("save changes")
        console.log(new_assign)
        
        if (name == "" || name == undefined) {
            alert("name is required");
            return;
        }

        if (id == -1) {
            console.log("id is -1");
            return;
        }

        try {
            await add_assign({ 
                    variables: { 
                        input: {
                            id: id, 
                            term_id: term_id, 
                            term_name: term_name,
                            course_id: course_id, 
                            course_name: course_name,
                            name: name, 
                            type: "item", 
                            data: info["data"],
                        }
                    } 
                });
        } catch (error) {
            console.log(error);
        }
    }

   // @ts-ignore
   // @ts-ignore
     $: {
        if ($query_result.data != undefined) {
            new_assign["content_info"] = $query_result["data"]["getCourse"]["content_info"]
            let content_info = JSON.parse(new_assign["content_info"])
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
                } 
                // else if (value["type"] == "tags") {
                //     new_assign["data"][i] = {
                //         "content": [["", 0]], 
                //         "type": value["type"], 
                //         "addition": content_info[i]["content"]
                //     };
                // }
            }
            info = JSON.parse(JSON.stringify(new_assign));
            info["data"] = JSON.stringify(new_assign["data"]);
        }
    }

</script>

<div>
    <p>Create new item   {term_name}/{course_name}</p>
    <TextField type="text" text="item name" bind:inputText={name}/>
    {#if info != undefined}
        <InfoTable cmd="assign" bind:info={info} />
    {/if}
    <CancelOrSave url={`/course/${term_id}/${term_name}/${course_id}/${course_name}`} on:message={saveChanges} />
</div>

<style>


</style>
