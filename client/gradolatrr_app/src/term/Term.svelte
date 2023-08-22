<script>
    export let id;
    export let name;

    import { Link } from "svelte-navigator";
    import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

    // get info from id
    let term_info = {
        "2A": {
            metadata: {
                name: "2A",
                type: "term",
                id: "1234567890",
                archived: false,
                current: true,    
            },
            course: {
                type: "dict",
                "ECON101": {
                    type: "course",
                    id: "abcde"
                },
                "PSYCH101": {
                    type: "course",
                    id: "fgjijk"
                }
            },
            description: {
                type: "textbox",
                content: "hello"
            }, 
        }
    }

    let info = term_info[name]
    let checked = info["metadata"]["current"];
    let changed;

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

</script>

<div>
    <p>
        {name}
    </p>    
    <label>
        <input type="checkbox" bind:checked={checked} /> select as current term.
    </label>
    {#if info != undefined}
    <Table class="coursetable" noborder={false}>
        <TableBody>
        {#each Object.keys(info) as i}
            <TableBodyRow class="TableBodyRow">
            {#if i != "metadata"}
            <div class="TableBodyRow">
                {#if info[i].constructor != Object}
                    <TableBodyCell class="term-header tablecol">{i}</TableBodyCell>
                    <TableBodyCell>{info[i]}</TableBodyCell>
                {:else}
                    <TableBodyCell class="term-header tablecol">{i}</TableBodyCell>
                    <TableBodyCell>
                    {#each Object.keys(info[i]) as j}
                        {#if j == "type"}
                            <p></p>
                        {:else if j == "content"}
                            {#if info[i]["type"] == "textbox"}
                                <textarea bind:value={info[i][j]} 
                                            on:change={() => changed = true }
                                            on:input={() => changed = true }/>
                            {/if}
                        {:else if info[i][j].constructor == Object}
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
    <p class="term-changes" on:click={addProperty}>+ add property</p>
    <div class="term-op">
        <p class="term-changes" on:click={archiveClick}>
            {#if info["metadata"]["archived"]}
                <p>unarchive this course</p>
            {:else}
                <p>archive this course</p>
            {/if}
        </p>
        <p class="term-changes">delete this course</p>
    </div>
    <div style=" display:flex; flex-direction:row; ">
        <Link to={`/`}><p class="cancel-and-save">cancel</p></Link>
        <p class="cancel-and-save">save</p>
    </div>
</div>
