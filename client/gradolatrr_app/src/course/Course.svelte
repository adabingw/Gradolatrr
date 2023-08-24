<script>
    // @ts-nocheck
    import Edit from '../assets/edit_icon.png'
    import Button from '../utils/Button.svelte';
    import course_info from "../data/course_info.json";

    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { Link } from 'svelte-navigator';
    
    export let term_id;
    export let term_name;
    export let id;
    export let name;

    // get info from id

    let content = course_info[name]["content"]
    let content_info = course_info[name]["content_info"]
    let sortKey = 'name'; // default sort key
    let sortDirection = 1; // default sort direction (ascending)
    let content_array = []

    for (const key in content) {
        content_array.push([ key, content[key] ])
    }

    function deleteAssignment(item) {
        console.log("deleting type")
        // delete term_info[name]["content_info"][item]
        // info = term_info[name]
    }

    function saveChanges() {
        console.log("save changes")
    }

    function sortTable(key) {
        if (sortKey === key) sortDirection = -sortDirection;
        else {
            sortKey = key;
            sortDirection = 1;
        }
        const sorted = content_array.sort((a, b) => {
            const aVal = a[1]["content"][key];
            const bVal = b[1]["content"][key];
            if (aVal < bVal) return -sortDirection;
            else if (aVal > bVal) return sortDirection;
            return 0;
        });
        content_array = sorted;
    };
    
</script>

<div>
    <p>{name} <Link to={`/course/edit/${id}/${name}`}><img  src={Edit} alt="edit"/> </Link></p>    
    {#if content_array != undefined || content_array != null}
    <Table>
        <TableHead>
            {#each Object.keys(content_info) as i}
            {#if i != "type" && content_info[i]["checked"]}
                <TableHeadCell on:click={() => sortTable(i)}>
                    <p class="term-header">{i}</p>
                </TableHeadCell>
            {/if}
            {/each}
            <TableHeadCell> </TableHeadCell>
        </TableHead>
        <TableBody class="divide-y">
            {#each Object.keys(content_array) as i}
            <TableBodyRow class="TableBodyRow">
                {#each Object.keys(content_array[i][1]["content"]) as j}
                    {#if content_info[j]["checked"]}
                    <TableBodyCell>{content_array[i][1]["content"][j]}</TableBodyCell>
                    {/if}
                {/each}
                <Link to={`/assign/edit/${content_array[i][1]["id"]}/${content_array[i][1]["content"]["name"]}`}>
                    <TableBodyCell class="edit">edit</TableBodyCell>
                </Link>
                <TableBodyCell class="edit">delete</TableBodyCell>
            </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
    {/if}
    <!-- INCLUDE LINK TO STUFF -->
    <Link to={`/new_assign/${term_id}/${term_name}/${id}/${name}`}><Button text="+ add item" /></Link>
    <Link to={`/new_assignbundle/${term_id}/${term_name}/${id}/${name}`}><Button text="+ add bundle" /></Link>
</div>
    
<style>
.edit {
   color: teal;
}

.edit:hover {
  cursor: pointer;
}
</style>
