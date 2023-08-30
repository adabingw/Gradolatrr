<script>
// @ts-nocheck
    import { v4 as uuidv4 } from 'uuid';
    import { mutation } from 'svelte-apollo';
    import { createEventDispatcher } from 'svelte';
    import { navigate } from 'svelte-navigator';
    
    import TextField from "../utils/TextField.svelte";
    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import InfoTable from '../utils/InfoTable.svelte';
    import new_course from "../constants/new_course.json";
    import { ADD_COURSE } from '../constants/queries_post';

    export let term_id;
    export let term_name;

    const dispatch = createEventDispatcher();

    let id = uuidv4();
    let name;
    let add_course = mutation(ADD_COURSE);

    let info = JSON.parse(JSON.stringify(new_course));

    info["data"] = JSON.stringify(info["data"]);
    info["content_info"] = JSON.stringify(info["content_info"]);

    async function saveChanges() {
        if (name == "" || name == undefined) {
            alert("name is required");
            return;
        }

        if (id == -1) {
            alert("something went wrong. please try again.")
            console.log("id is -1");
            return;
        }

        try {
            await add_course({ 
                variables: { 
                    input: {
                        id: id, 
                        term_id: term_id, 
                        name: name, 
                        type: "course", 
                        data: info["data"],
                        content_info: info["content_info"]
                    }
                } 
            });
            dispatch('message', {
                text: "reload"
            });
            navigate(`/course/edit/${term_id}/${term_name}/${id}/${name}`);
        } catch (error) {
            console.error(error);
        }
    }
    
</script>

<div>
    <p>Create new course</p>
    <TextField type="text" text="course name" bind:inputText={name}/>
    <InfoTable cmd="course" bind:info={info} />
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
