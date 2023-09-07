<script>
    import { query, mutation } from "svelte-apollo";
    import { navigate } from "svelte-navigator";

    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import InfoTable from '../utils/InfoTable.svelte';
    import { ASSIGN_INFO } from "../constants/queries_get";
    import { UPDATE_ASSIGNMENT } from "../constants/queries_put";
    import TextField from "../utils/TextField.svelte";

    export let id;
    export let name;
    export let course_id; 
    export let course_name;
    export let term_id;
    export let term_name;
    export let reload;

    let query_result = query(ASSIGN_INFO, {
        variables: { id }
    });
    let info;
    let last_info;
    let update_assign = mutation(UPDATE_ASSIGNMENT);

    async function saveChanges() {
        try {
            await update_assign({
                variables: {
                    input: {
                        id: id, 
                        type: "item",
                        course_id: course_id,
                        term_id: term_id, 
                        name: name, 
                        data: info["getAssignment"]["data"],
                    }
                }
            });
            navigate(`/course/${term_id}/${term_name}/${course_id}/${course_name}`);
        } catch(error) {
            console.error(error);
        }
    }

    function nameChange() {
        let info_temp = JSON.parse(info["getAssignment"]["data"]);
        info_temp["name"]["content"] = name;
        info["getAssignment"]["data"] = JSON.stringify(info_temp);
    }

    function updateChange(event) {
        info["getAssignment"]["data"] = event.detail.data;
    }

    function loadData() {
        info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
        let content_info = JSON.parse(info["getAssignment"]["course"]["content_info"])
        let info_temp = JSON.parse(info["getAssignment"]["data"]);
        for (let c of Object.keys(content_info)) {
            if (info_temp[c] == undefined) {
                let value = content_info[c]
                if (value["type"] == "text" || value["type"] == "textarea") {
                    info_temp[c] = {
                        "content": "", 
                        "type": value["type"]
                    };
                } else if (value["type"] == "number") {
                    info_temp[c] = {
                        "content": 0, 
                        "type": value["type"]
                    };
                } else if (value["type"] == "multiselect" || value["type"] == "singleselect") {
                    info_temp[c] = {
                        "content": [], 
                        "type": value["type"], 
                        "tag_info": content_info[c]["tag_info"]
                    };
                } else if (value["type"] == "date") {
                    info_temp[c] = {
                        "content": (new Date()).toISOString().split('T')[0],
                        "type": value["type"]
                    }
                }
            } else if (info_temp[c] != undefined) {
                if (content_info[c]["type"] == "multiselect" || content_info[c]["type"] == "singleselect") {
                    info_temp[c]["tag_info"] = content_info[c]["tag_info"];
                }
            }
        }

        info["getAssignment"]["data"] = JSON.stringify(info_temp);
        last_info = JSON.parse(JSON.stringify(info));
    }

    $: {
        $query_result
        if ($query_result.data != undefined) {
            loadData();
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

    $: {
        reload;
        query_result.refetch({ id });
    }

</script>

<div>
    <span class="header">
        <TextField bind:inputText={name} type="text" text="" on:message={nameChange}  focus={true} max="" min=""/>
        <p class="section">{term_name}/{course_name}</p></span>
    {#if info != undefined}
        <InfoTable cmd="assign" bind:info={info.getAssignment} on:message={updateChange}/>
    {/if}
    <CancelOrSave url={`/course/${term_id}/${term_name}/${course_id}/${course_name}`} on:message={saveChanges} />
</div>

<style>
.header {
    display: flex; 
    flex-direction: row; 
    align-items: center;
}

.section {
    font-size: 14px;
    margin-left: 15px;
}
</style>
