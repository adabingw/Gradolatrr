<script>
// @ts-nocheck

    import { DateInput } from 'date-picker-svelte'
    import { query } from 'svelte-apollo';
    
    import TextField from '../utils/TextField.svelte';
    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import InfoTable from '../utils/InfoTable.svelte';
    import course_info from "../constants/course_info.json";
    import new_assign from "../constants/new_assign.json";
    import { GET_CONTENT_INFO } from '../constants/queries_get';

    export let course_id;
    export let course_name;
    export let term_id;
    export let term_name;

    let id;

    let num;
    let suffix;
    let date = new Date()
    let dates = []

    let query_result = query(GET_CONTENT_INFO, {
        variables: { id: course_id }
    });

    let info;

    function saveChanges() {
        console.log("save changes")
        console.log(new_assign)
        console.log(suffix)
        console.log(num)
        // DONE
        // ADD COURSE CONTENT
    }

    function newDateSelected() {
        console.log(dates, date)
        if (dates.includes(date)){
            const i = dates.indexOf(date);
            dates.splice(i, 1);
        } else {
            dates.push(date);
        }
    }

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
    <p>Create item bundle   {term_name}/{course_name}</p>
    <TextField type="number" text="num items" bind:inputText={num}/>
    <!-- <Button text="manually input names"/> -->
    
    <p>item suffix (ie: ECON ASSGN)</p>
    <TextField type="text" text="" bind:inputText={suffix}/>

    <!-- <DateInput bind:value={date} on:select={() => {newDateSelected()}} format="yyyy-MM-dd"/> -->
    {#if info != undefined}
        <InfoTable cmd="bundle" bind:info={info} />
    {/if}
    <CancelOrSave url={`/course/${term_id}/${term_name}/${course_id}/${course_name}`} on:message={saveChanges} />
</div>

