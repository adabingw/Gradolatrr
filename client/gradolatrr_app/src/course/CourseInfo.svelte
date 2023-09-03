<script>
// @ts-nocheck

    import { query, mutation } from 'svelte-apollo';
    import { navigate } from 'svelte-navigator';
    import { createEventDispatcher } from 'svelte';

    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import Button from '../utils/Button.svelte';
    import InfoTable from '../utils/InfoTable.svelte';
    import TextField from '../utils/TextField.svelte';
    import { COURSE_INFO } from "../constants/queries_get";
    import { DELETE_COURSE, DELETE_ASSIGN } from '../constants/queries_delete';
    import { UPDATE_COURSE, UPDATE_ASSIGNMENT } from '../constants/queries_put';
    
    export let id;
    export let name;
    export let term_id; 
    export let term_name;
    export let reload;

    const dispatch = createEventDispatcher();

    let query_result = query(COURSE_INFO, {
        variables: { id }
    });
    let info;
    let last_info;
    let name_change = name;
    let delete_course = mutation(DELETE_COURSE);
    let delete_assign = mutation(DELETE_ASSIGN);
    let update_course = mutation(UPDATE_COURSE);
    let update_assign = mutation(UPDATE_ASSIGNMENT);

    async function saveChanges() {
        try {

            let content_info = JSON.parse(info["getCourse"]["content_info"]);
            for (let key of Object.keys(content_info)) {
                if (content_info[key]["old_type"] != undefined) {
                    let old_type = content_info[key]["old_type"];
                    let new_type = content_info[key]["type"];
                    let assignments = info["getCourse"]["assignments"];

                    for (let i = 0; i < assignments.length; i++) {
                        let assign = assignments[i];
                        let assign_data = JSON.parse(assign["data"]);
                        assign_data[key]["type"] = new_type;
                        if (old_type == "number" || old_type == "text" || old_type == "textarea") {
                            if (new_type == "multiselect" || new_type == "singleselect") {
                                assign_data[key]["content"] = [];
                                assign_data[key]["tag_info"] = content_info[key]["tag_info"];
                            } else if (new_type == "date") {
                                assign_data[key]["content"] = new Date();
                            } 
                        } else if (old_type == "multiselect" || old_type == "singleselect") {
                            if (new_type == "singleselect" || new_type == "multiselect") {
                                assign_data[key]["content"] = [];
                            } else if (new_type == "text" || new_type == "textarea") {
                                assign_data[key]["content"] = "";
                                delete assign_data[key]["tag_info"];
                            } else if (new_type == "date") {
                                assign_data[key]["content"] = new Date();
                                delete assign_data[key]["tag_info"];
                            } else if (new_type == "number") {
                                assign_data[key]["content"] = 0;
                                delete assign_data[key]["tag_info"];
                            }
                        }

                        await update_assign({
                            variables: {
                                input: {
                                    id: assign["id"], 
                                    type: "item", 
                                    data: JSON.stringify(assign_data)
                                }
                            }
                        })
                    }
                    delete content_info[key]["old_type"]
                    info["getCourse"]["content_info"] = JSON.stringify(content_info);
                }
            }

            console.log(info["getCourse"]["content_info"]);
            await update_course({
                variables: {
                    input: {
                        id: id, 
                        type: "course",
                        term_id: term_id, 
                        name: name, 
                        data: info["getCourse"]["data"],
                        content_info: info["getCourse"]["content_info"]
                    }
                }
            });
            navigate(`/course/edit/${term_id}/${term_name}/${id}/${name}`);

            if (name_change != name) {
                dispatch('message', {
                    text: "reload"
                });
                name_change = name;
            }

            reload = !reload;
        } catch(error) {
            console.error(error);
        }
    }

    async function deleteCourse() {
        let confirmDelete = confirm("delete this course?");
        if (!confirmDelete) return;

        try {
            await delete_course({ 
                variables: { 
                    input: {
                        id: id, 
                        type: "course"
                    }
                } 
            });

            for (let i = 0; i < info["getCourse"]["assignments"].length; i++) {
                let assign_id = info["getCourse"]["assignments"][i]["id"];
                await delete_assign({
                    variables: {
                        input: {
                            id: assign_id, 
                            type: "item"
                        }
                    }
                });
            }
        } catch (error) {
            console.error(error);
        }

        dispatch('message', {
            text: "reload"
        });
        navigate("/");
    }

    $: {
        if ($query_result.data != undefined && (last_info == info)) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
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

</script>

<div>
    <TextField bind:inputText={name} type="text" text="" min="" max=""  focus={true} 
        on:message={(event) => { name_change = event.detail.data ; }}/>
    {#if info != undefined}
        <InfoTable cmd="course" bind:info={info.getCourse} />
    {/if}
    <div class="term-op" on:click={() => deleteCourse()}>
        <Button text="delete this course" />
    </div>
    <CancelOrSave url={`/course/${term_id}/${term_name}/${id}/${name}`} on:message={saveChanges} />
</div>
