<script>
    export let id;
    export let name;

    import { Link } from "svelte-navigator";
    import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
        

    // get info from id
    let assign_info = {
        "assignment 1": {
            type: "course_mat",
            id: "aaa",
            course_id: "abcde",
            course_name: "ECON101",
            content: {
                "name": "assignment 1",
                "mark": 100,
                "weight": 2,
                "tags": ['assignment'], 
                "description": ""
            } 
        }
    }

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

    <div style=" display:flex; flex-direction:row; ">
        <Link to={`/`}><p class="cancel-and-save">cancel</p></Link>
        <p class="cancel-and-save">save</p>
    </div>
</div>
