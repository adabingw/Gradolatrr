<script>
    export let term_id;
    export let term_name;
    let id = "naoya";
    let checked;
    let name;

    import { Link } from "svelte-navigator";
    import TextField from "../utils/TextField.svelte";
    import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
    import Close from "../assets/delete_icon.png";

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


</script>

<div>
    <p>Create new course</p>
    <TextField text="course name"/>
    <Table>
        <TableBody>
        {#each Object.keys(properties) as i}
            <TableBodyRow>
            {#if i != "metadata"}
            <div class="TableBodyRow">
                <TableBodyCell class="term-header tablecol">{i}</TableBodyCell>
                <TableBodyCell>
                {#each Object.keys(properties[i]) as j}
                    {#if j == "type"}
                        <p></p>
                    {:else if j == "content"}
                        <!-- svelte-ignore empty-block -->
                        {#if properties[i]["type"] == "textbox"}
                            <textarea bind:value={properties[i][j]} 
                                        on:change={() => changed = true }
                                        on:input={() => changed = true }/>
                        {:else if properties[i]["type"] == "tags"}
                            <div class="tag-block">
                                {#each properties[i][j] as tag}
                                    <div class="tag">
                                        {tag}
                                    </div>
                                {/each}
                            </div>
                            <p class="term-changes" on:click={addProperty}>+ add tag</p>
                        {/if}
                    {/if}
                {/each}
                {#if properties[i]["type"] == "desc"}
                    {#each Object.keys(properties[i]) as item}
                        <!-- svelte-ignore empty-block -->
                        {#if item != "type"}
                            <div class="type-block">
                                <div class="type-block2" >
                                    <p class="tag-check">
                                    {#if !properties[i][item]["required"]}
                                        <input type="checkbox"
                                        bind:checked={properties[i][item]["checked"]} 
                                        on:change={() => {changeCheck(item)}}/>
                                    {:else}
                                        &nbsp; &nbsp;
                                    {/if} {item}
                                    </p>
                                    <p>{properties[i][item]["type"]}</p>
                                </div>
                                {#if !properties[i][item]["required"]}
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
    </Table>
    <p class="term-changes" on:click={addProperty}>+ add property</p>
    <div style=" display:flex; flex-direction:row; ">
        <Link to={`/`}><p class="cancel-and-save">cancel</p></Link>
        <p class="cancel-and-save">save</p>
    </div>
</div>
