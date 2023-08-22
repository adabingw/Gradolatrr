<script>
// @ts-nocheck

    export let term_id;
    export let term_name;
    let id = "naoya";
    let changed;
    let name;

    import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
    
    import TextField from "../utils/TextField.svelte";
    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import Properties from "../utils/Properties.svelte";
    import TextArea from "../utils/TextArea.svelte";
    import TagBlock from '../utils/TagBlock.svelte';
    import Button from '../utils/Button.svelte';
    import { sortOrder, dragover, dragstart } from "../utils/utils.svelte";

    let info;
    let properties = {
        metadata: {
            name: name,
            type: "course",
            id: "abcde",
            term_id: term_id,
            term_name: term_name
        },
        content_info: {
            type: "desc",
            "name": {
                checked: true, 
                type: "number", 
                required: true,
            },
            "mark": {
                checked: true, 
                type: "number", 
                required: false,
            },
            "weighting": {
                checked: true, 
                type: "number", 
                required: false,
            },
            "tags": {
                checked: true, 
                type: "tags",
                required: false,
            },
            "description": {
                checked: false, 
                type: "textarea",
                required: false,
            }
        }
    }

    function addProperty() {
        console.log("add property")
    }

    function saveChanges() {
        console.log("save changes")
    }

    function messageController(event) {
        const message = event.detail.TextArea; 
        switch(message) {
            case "change":
                break;
            case "delete":
                break;
            default:
                break;
        }
        term_info[name] = info;
    }

    let content_array = []

    for (const key in info) {
        if (key == "metadata" || key == "content_info") continue; 
        content_array.push([ key, info[key] ])
    }

    content_array = sortOrder(content_array);

    function drop (ev, key2, index2) {
        ev.preventDefault();
        var key = ev.dataTransfer.getData("key");
        if (key2 == key) return;

        var index = ev.dataTransfer.getData("index");
        var order = content_array[index][1]["order"];
        var order2 = content_array[index2][1]["order"];
        order = order2 + 1;
        
        let orders = [order];
        for (const [i, value] of Object.entries(info)) {
            if (i == "metadata" || i == "content_info") continue;
            if (i == key) continue;
            console.log(i)
            const o = info[i]["order"]
            if (orders.includes(o)) {
                orders.push(o + 1);
                info[i]["order"]++;
            } else {
                orders.push(o);
            }
        }
        content_array[index][1]["order"] = order;
        info[key]["order"] = order;
        term_info[name] = info;
        content_array = sortOrder(content_array);
    }

</script>

<div>
    <p>Create new course</p>
    <TextField type="text" text="course name" bind:inputText={name}/>
    <Table>
        <TableBody>
        {#each Object.keys(content_array) as i}
            <TableBodyRow>
            {#if content_array[i] != "metadata"}
            <div class="TableBodyRow" draggable={true} 
            on:dragstart={event => dragstart(event, content_array[i][0] , i)}
            on:drop={event => drop(event, content_array[i][0], i)} on:dragover={dragover}>>
                <TableBodyCell class="term-header tablecol">{content_array[i][0]}</TableBodyCell>
                <TableBodyCell>
                {#each Object.keys(content_array[i][1]) as j}
                    {#if j == "type"}
                        <p></p>
                    {:else if j == "content"}
                        <!-- svelte-ignore empty-block -->
                        {#if properties[i]["type"] == "textbox"}
                            <TextArea bind:inputText={content_array[i][1][j]} 
                                      bind:changed={changed} />
                        {:else if properties[i]["type"] == "tags"}
                            <!-- ADD MESSAGE HANDLER TO HANDLE DISPATCH WHEN TAG ADDED -->
                            <TagBlock bind:properties={content_array[i][1][j]} />
                        {/if}
                    {/if}
                {/each}
                {#if content_array[i][1]["type"] == "desc"}
                    <Properties bind:courseinfo={content_array[i][1]} on:message={messageController}/> 
                {/if}
                </TableBodyCell>
            </div>
            {/if}
            </TableBodyRow>
        {/each}
        </TableBody>
    </Table>
    <Button text="+ add property" on:click={addProperty} />
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
