<script>
    // @ts-nocheck
    import { Link } from 'svelte-navigator';
    import { query, mutation } from 'svelte-apollo';
    import Open from '../assets/open_icon.png';
    import { create, all } from 'mathjs';
    import { navigate } from 'svelte-navigator';

    import Edit from '../assets/edit_icon.png';
    import Button from '../utils/Button.svelte';
    import { COURSE_CONTENT } from "../constants/queries_get";
    import { DELETE_ASSIGN } from '../constants/queries_delete';
    import { UPDATE_COURSE } from '../constants/queries_put';
    import { DEFAULT_GRADING } from '../constants/constants';
    import { dragover, dragstart, sortOrder } from '../utils/utils.svelte';
    import { tokenize } from "../utils/utils.svelte";
    import Reload from "../assets/reload_icon.png";
    import Modal from '../utils/Modal.svelte';
    import Grading from '../utils/Grading.svelte';
    
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
    const config = { };
    const math = create(all, config);

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

    async function drop (ev, key2, index2) {
        ev.preventDefault();
        var key = ev.dataTransfer.getData("key");
        if (key2 == key) return;

        var index = ev.dataTransfer.getData("index");
        var order = content_array[index][1]["order"];
        var order2 = content_array[index2][1]["order"];

        order = order2 + 1;
        
        let orders = [order];
        content_array[index][1]["order"] = order;
        for (const [i, value] of Object.entries(content_info)) {
            const o = content_info[i]["order"]
            if (i == key) continue;
            if (orders.includes(o)) {
                orders.push(o + 1);
                content_info[i]["order"]++;
            } else {
                orders.push(o);
            }
        }

        for (let i = 0; i < content_array.length; i++) {
            content_array[i][1]["order"] = content_info[content_array[i][0]]["order"];
        }

        content_array = sortOrder(content_array);
        info["getCourse"]["content_info"] = JSON.stringify(content_info);
        last_info = undefined;
        try {
            await update_course({ 
                variables: { 
                    input: {
                        id: id,
                        type: "course", 
                        content_info: info["getCourse"]["content_info"]
                    }
                } 
            });
        } catch (error) {
            console.error(error);
        }

        return;
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

    $: {
        if ($query_result.data != undefined && (JSON.stringify(last_info) == JSON.stringify(info))) {
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

<div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" 
        integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" 
        crossorigin="anonymous" referrerpolicy="no-referrer" />
</div>

<div>
    <Modal bind:showModal>
        <h2 slot="header">
            how is this calculated?
        </h2>
        <Grading grading={grading_scheme} variables={content_info} showModal={showModal}
            on:message={changeGradeScheme}/>
    </Modal>
    <p style="font-weight: bold">{name} <Link to={`/course/edit/${term_id}/${term_name}/${id}/${name}`}>
        <i class="fa-solid fa-pen-to-square"></i>
        <!-- <img  src={Edit} alt="edit"/>  -->
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
            <tr >
                <td>{JSON.parse(content[i]["data"])["name"]["content"]}</td>
                <td>{JSON.parse(content[i]["data"])["mark"]["content"]}</td>

                {#each content_array as j}
                    {#if j[1]["checked"] && j[0] != "name" && j[0] != "mark"}
                        {#if JSON.parse(content[i]["data"])[j[0]] == undefined} 
                            <td> </td>
                        {:else}
                        <td>
                            {#if j[1]["type"] == "multiselect" || j[1]["type"] == "singleselect"}
                                {#if JSON.parse(content[i]["data"])[j[0]]["content"].length != 0}
                                <div class="tags">
                                    {#each JSON.parse(content[i]["data"])[j[0]]["content"] as thing}
                                        <p class="tag">{thing}</p>
                                    {/each}
                                </div>
                                {/if}
                            {:else}
                                {JSON.parse(content[i]["data"])[j[0]]["content"]}
                            {/if}
                        </td>
                        {/if}
                    {/if}
                {/each}
                <td class="edit" 
                        on:click={() => navigate(`/assign/edit/${term_id}/${term_name}/${id}/${name}/${content[i]["id"]}/${content[i]["name"]}`)}><img src={Open}/></td>
                <td class="edit" 
                        on:click={() => deleteAssignment(content[i]["id"])}>delete</td>
            </tr>
            {/each}
        </tbody>
    </table>
    {/if}
    <div class="grade-block">
        <p class="grade">grade: </p> { grade == undefined ? "no grade" : grade}
        <i class="fa-regular fa-circle-question" on:click={() => { showModal = true; }}></i>
        <!-- <p class="what" on:click={() => {
            showModal = true;
        }}>?</p> -->
        <i class="fa-solid fa-rotate-right" on:click={() => regrade(true)}></i>
    </div>
    <Link to={`/new_assign/${term_id}/${term_name}/${id}/${name}`}><Button text="+ add item" /></Link>
    <Link to={`/new_assignbundle/${term_id}/${term_name}/${id}/${name}`}><Button text="+ add bundle" /></Link>
</div>
    
<style>
i {
    margin-left: 8px;
}

i:hover {
    cursor: pointer;
}

table {
    vertical-align: center;
}

.edit {
   margin-right: 25px;
   padding-right: 10px;
   height: 100%;
}

.edit:hover {
  cursor: pointer;
}

table {
    overflow-y: scroll;
}

.tablecol {
  padding-left: 15px;
  padding-right: 15px;
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

.tag {
    background-color: #C9D6DF;
    border-radius: 12px;
    padding: 8px;
    margin-left: 5px;
    margin-right: 5px;
}

.tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
}

td {
    width: fit-content;
    max-width: 250px;
    min-width: 100px;
    padding-left: 12px;
    padding-right: 12px;
    border-bottom: 1px solid grey;
    vertical-align: middle;
}

th:hover {
    cursor: pointer;
}
</style>
