<script>
// @ts-nocheck

    export let id;
    export let name;

    import Close from '../assets/delete_icon.png'
    import { Link } from 'svelte-navigator';
    import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
    
    // get info from id
    let term_info = {
        "ECON101": {
            metadata: {
                type: "course",
                id: "abcde",
                term_id: "abcde",
                term_name: "ECON101",
            },
            description: {
                type: "textbox",
                content: "hello"
            }, 
            resource: {
                type: "textbox",
                content: "resource"
            },
            tags: {
                type: "tags",
                content: ['assignment', 'final', 'midterm']
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
                "weight": {
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
    }

    let info = term_info[name]
    let changed;

    function changeCheck(name) {
        term_info[name]["content_info"][name]["checked"] = !term_info[name]["content_info"][name]["checked"];
        info = term_info[name]
    }

    function addProperty() {
        console.log("add properties")
    }

    function addTag() {
        console.log("add tag")
    }

    function deleteType(item) {
        console.log("deleting type")
        delete term_info[name]["content_info"][item]
        info = term_info[name]
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

</script>

<div>
    <p>
        {name}
    </p>
    <Table class="coursetable">
    {#if info != undefined}
        <TableBody>
        {#each Object.keys(info) as i}
            <TableBodyRow>
            {#if i != "metadata"}
            <div class="TableBodyRow">
                <TableBodyCell class="term-header tablecol">{i}</TableBodyCell>
                <TableBodyCell>
                {#each Object.keys(info[i]) as j}
                    {#if j == "type"}
                        <p></p>
                    {:else if j == "content"}
                        <!-- svelte-ignore empty-block -->
                        {#if info[i]["type"] == "textbox"}
                            <textarea bind:value={info[i][j]} 
                                        on:change={() => changed = true }
                                        on:input={() => changed = true }/>
                        {:else if info[i]["type"] == "tags"}
                            <div class="tag-block">
                                {#each info[i][j] as tag}
                                    <div class="tag">
                                        {tag}
                                    </div>
                                {/each}
                            </div>
                            <p class="term-changes" on:click={addProperty}>+ add tag</p>
                        {/if}
                    {/if}
                {/each}
                {#if info[i]["type"] == "desc"}
                    {#each Object.keys(info[i]) as item}
                        <!-- svelte-ignore empty-block -->
                        {#if item != "type"}
                            <div class="type-block">
                                <div class="type-block2" >
                                    <p class="tag-check">
                                    {#if !info[i][item]["required"]}
                                        <input type="checkbox"
                                        bind:checked={info[i][item]["checked"]} 
                                        on:change={() => {changeCheck(item)}}/>
                                    {:else}
                                        &nbsp; &nbsp;
                                    {/if} {item}
                                    </p>
                                    <p>{info[i][item]["type"]}</p>
                                </div>
                                {#if !info[i][item]["required"]}
                                <img src={Close} class="close" on:click={() => deleteType(item)}/>
                                {/if}
                            </div>
                        {/if}
                    {/each}
                    <p class="save-changes">+ add course info</p>
                {/if}
                </TableBodyCell>
            </div>
            {/if}
            </TableBodyRow>
        {/each}
        </TableBody>
    {/if} 
    </Table>
    <p class="save-changes" on:click={addProperty}>+ add property</p>
    <div class="term-op">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="term-changes">delete this course</p>
    </div>
    <div style=" display:flex; flex-direction:row; ">
        <Link to={`/`}><p class="cancel-and-save">cancel</p></Link>
        <p class="cancel-and-save">save</p>
    </div>
</div>
