<script>
    // @ts-nocheck
    import Edit from '../assets/edit_icon.png';
    import Button from '../utils/Button.svelte';
    import { COURSE_CONTENT } from "../constants/queries_get";
    import { DELETE_ASSIGN } from '../constants/queries_delete';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { Link } from 'svelte-navigator';
    import { query, mutation } from 'svelte-apollo';
    import Open from '../assets/open_icon.png';
    
    export let term_id;
    export let term_name;
    export let id;
    export let name;

    let query_result = query(COURSE_CONTENT, {
        variables: { id }
    });
    let info;                   // query_results.data (query_results is read only)
    let last_info;              // prevent rerendering and refetching
    let content;                // the assignments of a course
    let content_info;           // the headers
    let sortKey = 'name';       // default sort key
    let sortDirection = 1;      // default sort direction (ascending)
    let delete_assign = mutation(DELETE_ASSIGN);

    async function deleteAssignment(assign_id) {
        let confirmDelete = confirm("delete this assignment?");
        if (!confirmDelete) return;
        try {
            await delete_assign({ 
                variables: { 
                    input: {
                        id: assign_id, 
                        type: "item"
                    }
                } 
            });
        } catch (error) {
            console.error(error);
        }
        query_result.refetch({ id }); 
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
    <p>{name} <Link to={`/course/edit/${term_id}/${term_name}/${id}/${name}`}>
        <img  src={Edit} alt="edit"/> 
    </Link></p>    
    {#if content != undefined || content != null}
    <table>
        {#if content_info != undefined || content_info != null}
        <tr>
            {#each Object.keys(content_info) as i}
            {#if content_info[i]["checked"]}
                <th on:click={() => sortTable(i)}>
                    <p class="term-header tablecol">{i}</p>
                </th>
            {/if}
            {/each}
            <th> </th>
        </tr>
        {/if}
            {#each Object.keys(content) as i}
            <tr >
                <!-- {#each Object.keys(JSON.parse(content[i]["data"])) as j} -->
                {#each Object.keys(content_info) as j}
                    {#if content_info[j]["checked"]}
                        {#if JSON.parse(content[i]["data"])[j] == undefined} 
                            <td> </td>
                        {:else}
                            {#if content_info[j]["type"] == "tags"}
                                <td>{JSON.parse(content[i]["data"])[j]["content"]}</td>
                            {:else}
                                <td>{JSON.parse(content[i]["data"])[j]["content"]}</td>
                            {/if}
                        {/if}
                    {/if}
                {/each}
                <Link to={`/assign/edit/${term_id}/${term_name}/${id}/${name}/${content[i]["id"]}/${content[i]["name"]}`}>
                    <td>
                        <img src={Open} class="edit" />
                    </td>
                </Link>
                <td class="edit" 
                        on:click={() => deleteAssignment(content[i]["id"])}>delete</td>
            </tr>
            {/each}
    </table>
    {/if}
    <Link to={`/new_assign/${term_id}/${term_name}/${id}/${name}`}><Button text="+ add item" /></Link>
    <Link to={`/new_assignbundle/${term_id}/${term_name}/${id}/${name}`}><Button text="+ add bundle" /></Link>
</div>
    
<style>
.edit {
   margin-right: 25px;
   padding-right: 10px;
}

.edit:hover {
  cursor: pointer;
}

.tablecol {
  width: 15vw;
}

.TableBodyRow {
    border: transparent;
    border-radius: 12px;
}

.TableBodyRow:hover {
  border-style: none solid solid none;
  padding: 10px;
  border-radius: 12px;
  background-color: #B4A390;
  padding-top: 5px;
  padding-bottom: 5px;
}

</style>
