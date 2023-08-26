<script>
// @ts-nocheck
    
    import TextField from "../utils/TextField.svelte";
    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import InfoTable from '../utils/InfoTable.svelte';
    import new_course from "../constants/new_course.json";

    export let term_id;
    export let term_name;

    let id = "naoya";
    let name;

    new_course["term_id"] = term_id; 
    new_course["term_name"] = term_name;

    let info = new_course;

    function saveChanges() {
        console.log("save changes")
        console.log(info)
    }
    
</script>

<div>
    <p>Create new course</p>
    <TextField type="text" text="course name" bind:inputText={name}/>
    <InfoTable cmd="course" bind:info={info} />
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
