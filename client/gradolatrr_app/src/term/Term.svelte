<script>
    export let id;
    export let name;

    import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
    
    import TextArea from "../utils/TextArea.svelte";
    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import Button from "../utils/Button.svelte";
    import { sortOrder, dragover, dragstart } from '../utils/utils.svelte';
    import term_info from "../data/term_info.json";

    // get info from id
    let info = term_info[name]
    let checked = info["metadata"]["current"];
    let changed;

    let content_array = []

    for (const key in info) {
        if (key == "metadata" || key == "content_info") continue; 
        content_array.push([ key, info[key] ])
    }

    content_array = sortOrder(content_array);

    function addProperty() {
        console.log("add properties")
    }

    function archiveClick() {
        term_info[name]["metadata"]["archived"] = !term_info[name]["metadata"]["archived"];
        info = term_info[name];
        changed = true;
        console.log("archiving course")
    }

    function saveChanges() {
        console.log("save changes")
    }

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
    <p>{name}</p>    
    <label>
        <input type="checkbox" bind:checked={checked} /> select as current term.
    </label>
    {#if content_array != undefined}
    <Table class="coursetable" noborder={false}>
        <TableBody>
        {#each Object.keys(content_array) as i}
            <TableBodyRow class="TableBodyRow">
            {#if i != "metadata"}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="TableBodyRow" draggable={true} 
            on:dragstart={event => dragstart(event, content_array[i][0] , i)}
            on:drop={event => drop(event, content_array[i][0], i)} on:dragover={dragover}>
                {#if content_array[i][1].constructor != Object}
                    <TableBodyCell class="term-header tablecol">{i}</TableBodyCell>
                    <TableBodyCell>{content_array[i][1]}</TableBodyCell>
                {:else}
                    <TableBodyCell class="term-header tablecol">{content_array[i][0]}</TableBodyCell>
                    <TableBodyCell>
                    {#each Object.keys(content_array[i][1]) as j}
                        {#if j == "type"}
                            <p></p>
                        {:else if j == "content"}
                            {#if content_array[i][1]["type"] == "textbox"}
                                <TextArea bind:inputText={content_array[i][1][j]} 
                                          bind:changed={changed} />
                            {/if}
                        {:else if content_array[i][1][j].constructor == Object}
                            <p class="course">{j}</p>
                        {/if}
                    {/each}
                    </TableBodyCell>
                {/if}
            </div>
            {/if}
            </TableBodyRow>
        {/each}
        </TableBody>
    </Table>
    {/if} 
    <Button text="+ add property" on:click={addProperty} />
    <div class="term-op">
        <Button text={`${info["metadata"]["archived"] ? "un" : ""}archive this course`} on:click={archiveClick} />
        <Button text="delete this course" />
    </div>
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
