<script>    
    import TextField from '../utils/TextField.svelte';
    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import course_info from "../data/course_info.json";
    import new_assign from "../data/new_assign.json";
    import InfoTable from '../utils/InfoTable.svelte';

    export let course_id;
    export let course_name;
    export let term_id;
    export let term_name;

    let id;
    let name;

    new_assign["course_id"] = course_id;
    new_assign["course_name"] = course_name;
    new_assign["term_id"] = term_id;
    new_assign["term_name"] = term_name;
    new_assign["content_info"] = course_info["content_info"]

    let info = new_assign;

    for (let i of Object.keys(new_assign["content_info"])) {
        console.log(i)
        let value = new_assign["content_info"][i];
        if (value["type"] == "text" || value["type"] == "textarea") 
            new_assign["data"][i] = {
                "content": "", 
                "type": value["type"]
            };
        else if (value["type"] == "number") 
            new_assign["data"][i] = {
                "content": 0, 
                "type": value["type"]
            };
        else if (value["type"] == "tags") {
            new_assign["data"][i] = {
                "content": [["", 0]], 
                "type": value["type"], 
                "addition": course_info[course_id]["data"][i]["content"]
            }
        }
    }

    function saveChanges() {
        console.log("save changes")
        console.log(new_assign)
        // ADD COURSE CONTENT
        // DONE
    }

</script>

<div>
    <p>Create new item   {term_name}/{course_name}</p>
    <TextField type="text" text="item name" bind:inputText={name}/>
    <InfoTable cmd="assign" bind:info={info} />
    <CancelOrSave url={`/course/${term_id}/${term_name}/${course_id}/${course_name}`} on:message={saveChanges} />
</div>

<style>


</style>
