<script>
    // @ts-nocheck
    import Edit from '../assets/edit_icon.png';
    import Button from '../utils/Button.svelte';
    import { COURSE_CONTENT } from "../constants/queries_get";
    import { DELETE_ASSIGN } from '../constants/queries_delete';
    import { UPDATE_COURSE } from '../constants/queries_put';
    import Reload from "../assets/reload_icon.png";
    import Modal from '../utils/Modal.svelte';

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
    let grade;
    let showModal = false;
    let info;                   // query_results.data (query_results is read only)
    let last_info;              // prevent rerendering and refetching
    let content;                // the assignments of a course
    let content_info;           // the headers
    let sortKey = 'name';       // default sort key
    let sortDirection = 1;      // default sort direction (ascending)
    let delete_assign = mutation(DELETE_ASSIGN);
    let update_course = mutation(UPDATE_COURSE);

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
        regrade(true); 
    }

    async function regrade(refetch) {
        console.log("regrading running");
        if (refetch) query_result.refetch({ id });
        let sum = 0;
        for (let assign of content) {
            console.log(assign);
            sum += JSON.parse(assign["data"])["mark"]["content"];
        }
        sum /= content.length;
        if (sum != grade) {
            // update course
            grade = sum;
            try {
                await update_course({ 
                    variables: { 
                        input: {
                            id: id,
                            name: name, 
                            term_id: term_id, 
                            type: "course", 
                            grade: grade
                        }
                    } 
                });
                query_result.refetch({ id });
            } catch (error) {
                console.error(error);
            }
        }
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
        if ($query_result.data != undefined && (JSON.stringify(last_info) == JSON.stringify(info))) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));
            content = JSON.parse(JSON.stringify($query_result["data"]["getCourse"]["assignments"]))
            content_info = JSON.parse($query_result["data"]["getCourse"]["content_info"])
            grade = info["getCourse"]["grade"]
            regrade(false);
        }
    }

    $: {
        console.log(id)
        query_result.refetch({ id });
        last_info = info;
    }
    
</script>

<div>
    <Modal bind:showModal>
        <h2 slot="header">
            how is this calculated?
        </h2>
    </Modal>
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
    <div class="grade-block">
        <p class="grade">grade: </p> { grade == undefined ? "no grade" : grade}
        <p class="what" on:click={() => showModal = true}>?</p>
        <img src={Reload} alt="reload" on:click={() => regrade(true)} />
    </div>
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

.grade {
    background-color: #C9D2CD;
    border-radius: 12px;
    width: fit-content;
    padding: 8px;
    margin-right: 8px;
}

.what {
    font-size: 13px;
    border: 1px solid black;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    text-align: center;
    margin-left: 15px;
    margin-right: 5px;
}

.what:hover {
    cursor: pointer;
}

.grade-block {
    display: flex; 
    flex-direction: row;
    align-items: center;
}

</style>
