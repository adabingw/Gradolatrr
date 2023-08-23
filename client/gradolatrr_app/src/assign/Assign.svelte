<script>
    export let id;
    export let name;

    import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
    
    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import assign_info from "../data/assign_info.json";
    
    // get info from id
    let info = assign_info[name]["content"]
    let changed;

    function saveChanges() {
        console.log("save changes")
    }

</script>

<div>
    <p>{name}</p>    
    {#if info != undefined}
        <Table>
            <TableBody>
                {#each Object.keys(info) as i}
                <TableBodyRow class="TableBodyRow">
                    <TableBodyCell>{i}</TableBodyCell>
                    <TableBodyCell>{info[i]} - make into a textfield </TableBodyCell>
                </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}

    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
