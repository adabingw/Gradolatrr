<script>
    import { DateInput } from 'date-picker-svelte'
    
    import TextField from '../utils/TextField.svelte';
    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import InfoTable from '../utils/InfoTable.svelte';
    import course_info from "../data/course_info.json";
    import new_assign from "../data/new_assign.json";

    export let course_id;
    export let course_name;
    export let term_id;
    export let term_name;

    let id;

    let num;
    let suffix;
    let date = new Date()
    let dates = []

    new_assign["metadata"]["course_id"] = course_id;
    new_assign["metadata"]["course_name"] = course_name;
    new_assign["metadata"]["term_id"] = term_id;
    new_assign["metadata"]["term_name"] = term_name;
    new_assign["content_info"] = course_info[course_name]["content_info"]

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
                "addition": course_info[course_name]["data"][i]["content"]
            }
        }
    }

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
</script>

<div>
    <p>Create item bundle   {term_name}/{course_name}</p>
    <TextField type="number" text="num items" bind:inputText={num}/>
    <!-- <Button text="manually input names"/> -->
    
    <p>item suffix (ie: ECON ASSGN)</p>
    <TextField type="text" text="" bind:inputText={suffix}/>

    <!-- <DateInput bind:value={date} on:select={() => {newDateSelected()}} format="yyyy-MM-dd"/> -->
    <InfoTable cmd="bundle" bind:info={info} />
    <CancelOrSave url={`/course/${term_id}/${term_name}/${course_id}/${course_name}`} on:message={saveChanges} />
</div>

