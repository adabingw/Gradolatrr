<script>
// @ts-nocheck

    import { query, mutation } from 'svelte-apollo';
    import { v4 as uuidv4 } from 'uuid';
    import { navigate } from 'svelte-navigator';
    
    import TextField from '../utils/TextField.svelte';
    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import InfoTable from '../utils/InfoTable.svelte';
    import Button from '../utils/Button.svelte';
    import course_info from "../constants/course_info.json";
    import new_assign from "../constants/new_assign.json";
    import { GET_CONTENT_INFO } from '../constants/queries_get';
    import { ADD_BUNDLE } from '../constants/queries_post';

    export let course_id;
    export let course_name;
    export let term_id;
    export let term_name;

    let id;

    let num;
    let suffix;
    let names = [];
    let date = new Date();
    let dates = [];
    let manual = false;

    let query_result = query(GET_CONTENT_INFO, {
        variables: { id: course_id }
    });
    let add_bundle = mutation(ADD_BUNDLE);

    let last_assign = JSON.parse(JSON.stringify(new_assign));
    let info;

    async function saveChanges() {
        if ((suffix == "" || suffix == undefined) && !manual) {
            alert("name is required");
            return;
        }
        if (num == undefined) {
            alert("number is required");
            return;
        }
        if (num > 10) {
            alert("bundle can contain at most 10 items");
            return;
        }
        let bundle = [];
        let date_bundles = [];

        for (let i = 0; i < num; i++) date_bundles.push({});

        let content_info = JSON.parse(new_assign["content_info"])
        for (let i of Object.keys(content_info)) {
            let value = content_info[i];
            if (value["type"] == "date") {
                for (let j = 0; j < num; j++) {
                    let date_arr = new_assign["data"][i]["content"]
                    if (new_assign["data"][i]["content"].length <= j) {
                        let last_date = date_arr[date_arr.length - 1];
                        date_bundles[j][i] = last_date;
                    } else {
                        date_bundles[j][i] = date_arr[j];
                    }
                }
            }
        }

        for (let i = 0; i < num; i++) {
            let name;
            if (!manual) name = suffix + " " + (i + 1);
            else name = names[i];

            new_assign["data"]["name"]["content"] = name;

            if (!(Object.keys(date_bundles[i]).length === 0)) {
                for (let key of Object.keys(date_bundles[i])) {
                    new_assign["data"][key]["content"] = date_bundles[i][key];
                }
            }

            info = JSON.parse(JSON.stringify(new_assign));
            info["data"] = JSON.stringify(new_assign["data"]);

            let input = {
                id: uuidv4(), 
                term_id: term_id, 
                course_id: course_id, 
                name: name, 
                type: "item", 
                data: info["data"],
            };
            bundle.push(input);
        }

        try {
            await add_bundle({ 
                variables: { input: bundle } 
            });
            navigate(`/course/${term_id}/${term_name}/${course_id}/${course_name}`);
        } catch (error) {
            console.error(error);
        }
    }

    function dataChange(event) {
        last_assign = undefined;
        let thing = JSON.parse(event.detail.data);
        new_assign["data"] = JSON.parse(JSON.stringify(thing));
    }

    $: {
        num;
        let len = names.length;
        if (num < len) {
            for (let i = 0; i < len - num; i++) {
                names.pop();
            }
        } else if (num > len) {
            for (let i = 0; i < num - len; i++) {
                names.push('');
            }
        }
    }

    $: {
        if ($query_result.data != undefined && ( JSON.stringify(last_assign) === JSON.stringify(new_assign))) {
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
                } else if (value["type"] == "tags") {
                    new_assign["data"][i] = {
                        "content": [], 
                        "type": value["type"], 
                        "tag_info": content_info[i]["tag_info"]
                    };
                } else if (value["type"] == "multiselect" || value["type"] == "singleselect") {
                    new_assign["data"][i] = {
                        "content": [], 
                        "type": value["type"], 
                        "tag_info": content_info[i]["tag_info"]
                    };
                } else if (value["type"] == "date") {
                    new_assign["data"][i] = {
                        "content": [(new Date()).toISOString().split('T')[0]],
                        "type": value["type"], 
                        "num": 1
                    };
                }
            }
            info = JSON.parse(JSON.stringify(new_assign));
            info["data"] = JSON.stringify(new_assign["data"]);
            last_assign = JSON.parse(JSON.stringify(new_assign));
        }
    }
</script>

<div>
    <p>Create item bundle   {term_name}/{course_name}</p>
    <TextField type="number" text="num items" bind:inputText={num} max={10} min={1}  focus={true}/>

    <div class="bundle">
    {#if manual}
        <Button text="enter item suffix" on:message={() => { manual = false; } }/>
        {#if num != undefined && num <= 10}
            {#each Array(num) as _, i}
            <div class="bundle-name">
                <TextField type="text" text={`item ${i + 1}`} 
                    bind:inputText={names[i]} min="" max=""  focus={false} />
            </div>
            {/each}
        {:else} 
            <p class="alert">
                {num > 10 ? "bundle can contain max 10 items" : "please input number of items in the bundle"}
            </p>
        {/if}
    {:else} 
        <Button text="manually input names" on:message={() => { manual = true; } }/>
        <div class="name-div">
            <p>item suffix (ie: ECON ASSGN)</p>
            <TextField type="text" text="" bind:inputText={suffix} min="" max=""  focus={false}/>
        </div>
    {/if}
    </div>

    {#if info != undefined}
        <InfoTable cmd="bundle" bind:info={info} on:message={dataChange} />
    {/if}
    <CancelOrSave url={`/course/${term_id}/${term_name}/${course_id}/${course_name}`} on:message={saveChanges} />
</div>

<style>
.alert {
    color: #C6858D;
}

.name-div {
    display: flex;
    flex-direction: row; 
}

.bundle-name {
    margin-top: -15px;
    margin-bottom: -15px;
}

.bundle {
    border-bottom: 1px solid black;
    margin-bottom: 10px;
    width: 60vw;
}
</style>
