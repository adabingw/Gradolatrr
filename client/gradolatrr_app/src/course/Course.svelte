<script>
    // @ts-nocheck
    import { Link } from 'svelte-navigator';
    import { query, mutation } from 'svelte-apollo';
    import { create, all } from 'mathjs';
    import { navigate } from 'svelte-navigator';
    import ContextMenu from '../utils/ContextMenu.svelte';
    import { COURSE_CONTENT } from "../constants/queries_get";
    import { DELETE_ASSIGN } from '../constants/queries_delete';
    import { UPDATE_COURSE, UPDATE_ASSIGNMENT } from '../constants/queries_put';
    import { DEFAULT_GRADING } from '../constants/constants';
    import { dragover, dragstart, sortOrder } from '../utils/utils.svelte';
    import HeaderField from '../utils/HeaderField.svelte';
    import { tokenize } from "../utils/utils.svelte";
    import Modal from '../utils/Modal.svelte';
    import Grading from '../utils/Grading.svelte';
    import Multiselect2 from '../utils/Multiselect2.svelte';
    import { onDestroy } from 'svelte';
    import TextField from '../utils/TextField.svelte';
    
    export let term_id;
    export let term_name;
    export let id;
    export let name;
    export let reload;

    let query_result = query(COURSE_CONTENT, {
        variables: { id }
    });
    let grade;
    let showModal = false;
    let info;                   // query_results.data (query_results is read only)
    let last_info;              // prevent rerendering and refetching
    let content;                // the assignments of a course
    let content_info;           // the headers
    let content_array = [];
    let sortKey = 'name';       // default sort key
    let sortDirection = 1;      // default sort direction (ascending)
    let grading_scheme = DEFAULT_GRADING;
    let delete_assign = mutation(DELETE_ASSIGN);
    let update_course = mutation(UPDATE_COURSE);
    let update_assign = mutation(UPDATE_ASSIGNMENT);
    const config = { };
    const math = create(all, config);

    let showMenu = false;
    let context_bundle = [ 0, 0, 0 ];
    

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
            loadData();
        } catch (error) {
            console.error(error);
        }
        regrade(true); 
    }

    async function saveAssignChanges(event) {
        let i = event.detail.i;
        let assign_id = event.detail.data.id;
        let assign_name = event.detail.data.name;
        try {
            await update_assign({
                variables: {
                    input: {
                        id: assign_id, 
                        type: "item",
                        course_id: id,
                        term_id: term_id, 
                        name: assign_name, 
                        data: content[i]["data"],
                    }
                }
            });
        } catch(error) {
            console.error(error);
        }
    }

    async function saveCourseChanges() {
        try {
            await update_course({
                variables: {
                    input: {
                        id: id, 
                        term_id: term_id, 
                        name: name, 
                        type: "course",
                        content_info: JSON.stringify(content_info)
                    }
                }
            });
        } catch(error) {
            console.error(error);
        }
    }

    async function changeGradeScheme(e) {
        let equation = e.detail.equation;

        if (equation != undefined) {
            try {
                await update_course({ 
                    variables: { 
                        input: {
                            id: id,
                            name: name, 
                            term_id: term_id, 
                            type: "course", 
                            grading_scheme: equation
                        }
                    } 
                });
                regrade(true);
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
            let a_arr = JSON.parse(a["data"]);
            let b_arr = JSON.parse(b["data"]);
            const aVal = a_arr[key]["content"];
            const bVal = b_arr[key]["content"];

            if (aVal < bVal) return -sortDirection;
            else if (aVal > bVal) return sortDirection;
            return 0;
        });
        content = sorted;
    };

    async function regrade(refetch) {
        if (refetch) query_result.refetch({ id });

        last_info = info;

        let result = 0;
        let equation = grading_scheme;
        let variables = tokenize(grading_scheme, content_info);
        const parser = math.parser();

        if (!variables.status) {
            return;
        }

        for (let assign of content) {
            for (let v of variables.message) {
                if (JSON.parse(assign["data"])[v] == undefined) {
                    continue;
                }
                
                if (JSON.parse(assign["data"])[v]["content"] == undefined) {
                    parser.clear();
                    continue;
                }
                parser.set(`${v}`, `${JSON.parse(assign["data"])[v]["content"]}`);
            }

            if (equation.includes('#')) {
                let l = content.length;
                equation = equation.replaceAll('#', l);
            }

            let result_0 = parser.evaluate(equation);
            result += result_0;
            parser.clear();
        }

        if (result != grade && (result != undefined && result != null)) {
            grade = result;
            try {
                await update_course({ 
                    variables: { 
                        input: {
                            id: id,
                            type: "course", 
                            grade: result.toFixed(2)
                        }
                    } 
                });
                query_result.refetch({ id });
            } catch (error) {
                console.error(error);
            }
        }
    }

    onDestroy(() => {
        console.log(content);
    })

    function openMenu(e, item, index) {
        showMenu = false;
        e.preventDefault();
        context_bundle = [e.clientX, e.clientY, index, item];
        showMenu = true;
    }

    function contextController(e) {
        if (e.detail.context == 'trash') {
            deleteAssignment(e.detail.index);
        } else if (e.detail.context == 'edit') {
            navigate(`/assign/edit/${term_id}/${term_name}/${id}/${name}/${e.detail.index}/${e.detail.item}`)
        }
    }

    function loadData() {
        info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
        last_info = JSON.parse(JSON.stringify(info));
        content = JSON.parse(JSON.stringify($query_result["data"]["getCourse"]["assignments"]))
        content_info = JSON.parse($query_result["data"]["getCourse"]["content_info"]);
        if (content_array.length != 0) content_array = [];
        for (let key of Object.keys(content_info)) {
            if (key == "name" || key == "mark") continue; 
            content_array.push([key, content_info[key]]);
            content_array = sortOrder(content_array);
        }

        grade = info["getCourse"]["grade"]
        if (info["getCourse"]["grading_scheme"] != undefined) {
            grading_scheme = info["getCourse"]["grading_scheme"]
        }
        regrade(false);
    }

    $: {
        if ($query_result.data != undefined && (JSON.stringify(last_info) == JSON.stringify(info))) {
            loadData();
        }
    }

    $: {
        query_result.refetch({ id });
        last_info = info;
    }

    $: {
        query_result.refetch({ id });
        last_info = info;
    }

</script>

<ContextMenu bind:showMenu={showMenu} 
        bind:x={context_bundle[0]} 
        bind:y={context_bundle[1]} 
        bind:index={context_bundle[2]}
        bind:item={context_bundle[3]}
        menuNum={4}
        on:context={contextController}/>
<div class="course">
    <Modal bind:showModal>
        <h2 slot="header">
            how is this calculated?
        </h2>
        <Grading grading={grading_scheme} variables={content_info} showModal={showModal}
            on:message={changeGradeScheme}/>
    </Modal>
    <p class="header">{name} <Link to={`/course/edit/${term_id}/${term_name}/${id}/${name}`}>
        <i class="fa-solid fa-pen-to-square"></i>
    </Link></p>

    {#if content != undefined || content != null}
    <table>
        {#if content_array != undefined || content_array != null}
        <thead>
        <tr style="position:relative;display:table-row">
            <th on:click={() => sortTable("name")}>
                <p class="term-header tablecol">name</p>
            </th>
            <th on:click={() => sortTable("mark")}>
                <p class="term-header tablecol">mark</p>
            </th>
            
            {#each content_array as item, index}
                {#if item[1]["checked"] && item[0] != "name" && item[0] != "mark"}
                    <th on:click={() => sortTable(item[0])} draggable={true}
                        on:dragstart={event => dragstart(event, item[0] , index)}
                        on:drop={event => drop(event, item[0], index)} on:dragover={dragover}>
                            <p class="term-header tablecol">{item[0]}</p>
                    </th>
                {/if}
            {/each}
            <th> </th>
        </tr>
        </thead>
        {/if}
        <tbody style="display:table-row-group;overflow:auto">
            {#each Object.keys(content) as i}
            <tr id={i} >
                <td class="name_assignment">
                    <i class="fa-solid fa-ellipsis-vertical context_menu" 
                    on:click={(e) => openMenu(e, content[i]["name"], content[i]["id"])}></i>
                    {JSON.parse(content[i]["data"])["name"]["content"]} 
                </td>
                <td>{JSON.parse(content[i]["data"])["mark"]["content"]}</td>

                {#each content_array as j}
                    {#if j[1]["checked"] && j[0] != "name" && j[0] != "mark"}
                        
                        {#if JSON.parse(content[i]["data"])[j[0]] == undefined && j[1]["type"] != "multiselect" && j[1]["type"] != "singleselect"}
                            <td></td>
                        {:else}
                        <td>
                            {#if j[1]["type"] == "multiselect"}
                                <Multiselect2 bind:selections={j[1]["tag_info"]} bind:properties={content[i]["data"]} 
                                bind:j={j} bind:content={content[i]} bind:i={i}
                                on:assign={saveAssignChanges} on:course={saveCourseChanges} max=0/>
                            {:else if j[1]["type"] == "singleselect"}
                                <Multiselect2 bind:selections={j[1]["tag_info"]} bind:properties={content[i]["data"]} 
                                bind:j={j} bind:content={content[i]} bind:i={i}
                                on:assign={saveAssignChanges} on:course={saveCourseChanges} max=1/>
                            {:else if j[1]["type"] == "text"}
                                {JSON.parse(content[i]["data"])[j[0]]["content"]}
                            {/if}
                        </td>
                        {/if}
                    {/if}
                {/each}
                <!-- <td class="edit" 
                        on:click={() => deleteAssignment(content[i]["id"])}>delete</td> -->
            </tr>
            {/each}
        </tbody>
    </table>
    {/if}
    <Link to={`/new_assign/${term_id}/${term_name}/${id}/${name}`}><i class="fa-solid fa-plus fa-xs"></i> <span class="add">item </span> </Link>
    <Link to={`/new_assignbundle/${term_id}/${term_name}/${id}/${name}`}><i class="fa-regular fa-file-zipper fa-xs"></i> <span class="add">bundle </span> </Link>
    <div class="grade-block">
        <p class="grade">Grade: </p> { grade == undefined ? "no grade" : grade}
        <i class="fa-regular fa-circle-question" on:click={() => { showModal = true; }}></i>
        <i class="fa-solid fa-rotate-right" on:click={() => regrade(true)}></i>
    </div>
</div>
    
<style>
table {
    width: 65vw;
    margin-bottom: 15px;
}

.context_menu {
    margin-left: -27px;
    opacity: 0;
}

.context_menu:hover {
    opacity: 1;
}

.fa-file-zipper {
    margin-left: 35px;
}

i {
    padding: 1px;
}

.course {
    padding-left: 80px;
    padding-bottom: 100px;
}

.fa-circle-question {
    margin-left: 55px;
}

.add {
    margin-left: -10px;
    font-weight: 500;
    color: #717171;
    font-size: 15px;
}

.header { 
  padding: 5px;
  margin-bottom: 20px;
  font-size: 34px;
  border-left: none;
  border-top: none;
  border-bottom: none;
  border-right: none;
  margin-right: 15px;
  margin-top: 100px;
  min-width: 120px;
  color: #717171;
  font-weight: 700;
  width: 50vw;
}

i {
    margin-left: 8px;
}

i:hover {
    cursor: pointer;
}

table {
    vertical-align: center;
}

table {
    overflow-y: scroll;
}

.grade {
    font-weight: 500;
    width: fit-content;
    padding: 8px;
    margin-right: 8px;
}

.grade-block {
    display: flex; 
    flex-direction: row;
    align-items: center;
}

tr {
    height: 50px;
}

td {
    padding-left: 0px;
    width: fit-content;
    min-height: 50px;
    max-width: 250px;
    min-width: 100px;
    border-bottom: 1px solid grey;
    vertical-align: middle;
    word-wrap: break-word;
    word-break: break-all;
    padding-right: 8px;
}

th:hover {
    cursor: pointer;
}
</style>
