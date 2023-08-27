<script>
    // @ts-nocheck
    import Edit from '../assets/edit_icon.png'
    import Button from '../utils/Button.svelte';
    import { COURSE_CONTENT } from "../constants/queries_get";

    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { Link } from 'svelte-navigator';
    import { query } from 'svelte-apollo';
    
    export let term_id;
    export let term_name;
    export let id;
    export let name;

    let query_result = query(COURSE_CONTENT, {
        variables: { id }
    });
    let info;
    let last_info;

    let content;
    let content_info;
    let sortKey = 'name'; // default sort key
    let sortDirection = 1; // default sort direction (ascending)

    function deleteAssignment(item) {
        console.log("deleting type")
        // delete term_info[name]["content_info"][item]
        // info = term_info[name]
    }

    function sortTable(key) {
        if (sortKey === key) sortDirection = -sortDirection;
        else {
            sortKey = key;
            sortDirection = 1;
        }
        const sorted = content.sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            if (aVal < bVal) return -sortDirection;
            else if (aVal > bVal) return sortDirection;
            return 0;
        });
        content = sorted;
    };

    $: {
        console.log($query_result)
        if ($query_result.data != undefined && (last_info == info)) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));

            content = JSON.parse(JSON.stringify($query_result["data"]["getCourse"]["assignments"]))
            content_info = JSON.parse($query_result["data"]["getCourse"]["content_info"])
        }
    }

    $: {
        console.log(id)
        query_result.refetch({ id });
        last_info = info;
    }
    
</script>

<div>
    <p>{name} <Link to={`/course/edit/${id}/${name}`}><img  src={Edit} alt="edit"/> </Link></p>    
    {#if content != undefined || content != null}
    <Table>
        {#if content_info != undefined || content_info != null}
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
        {/if}
        <TableBody class="divide-y">
            {#each Object.keys(content) as i}
            <TableBodyRow class="TableBodyRow">
                {#each Object.keys(JSON.parse(content[i]["data"])) as j}
                    {#if content_info[j]["checked"]}
                        {#if content_info[j]["type"] == "tags"}
                            <TableBodyCell>{JSON.parse(content[i]["data"])[j]["content"][0]}</TableBodyCell>
                        {:else}
                            <TableBodyCell>{JSON.parse(content[i]["data"])[j]["content"]}</TableBodyCell>
                        {/if}
                    {/if}
                {/each}
                <Link to={`/assign/edit/${content[i]["id"]}/${content[i]["name"]}`}>
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
