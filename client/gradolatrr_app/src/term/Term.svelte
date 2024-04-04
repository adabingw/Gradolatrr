<script>    
    import { query, mutation } from "svelte-apollo";
    import { Link, navigate } from "svelte-navigator";
    import { createEventDispatcher, onDestroy } from "svelte";

    import InfoTable from '../utils/InfoTable.svelte';
    import { TERM_INFO } from "../constants/queries_get";
    import { DELETE_TERM, DELETE_COURSE, DELETE_ASSIGN } from "../constants/queries_delete";
    import { UPDATE_TERM } from "../constants/queries_put";
    import HeaderField from "../utils/HeaderField.svelte";
  import Folder from "../utils/Folder.svelte";

    const dispatch = createEventDispatcher();

    export let id;
    export let name;

    let query_result = query(TERM_INFO, {
        variables: { id }
    });
    let name_change = name;
    let info;
    let last_info;
    let courses;
    let delete_term = mutation(DELETE_TERM);
    let delete_course = mutation(DELETE_COURSE);
    let delete_assign = mutation(DELETE_ASSIGN);
    let update_term = mutation(UPDATE_TERM);
    let del = false;

    async function deleteTerm() {
        let confirmDelete = confirm("Delete this term?");
        if (!confirmDelete) return;

        del = true;

        try {
            await delete_term({ 
                variables: { 
                    input: {
                        id: id, 
                        type: "term"
                    }
                } 
            });

            let courses = info["getTerm"]["courses"];
            for (let i = 0; i < courses.length; i++) {
                let assignments = courses[i]["assignments"];
                for (let j = 0; j < assignments.length; j++) {
                    await delete_assign({
                        variables: {
                            input: {
                                id: assignments[j]["id"],
                                type: "item"
                            }
                        }
                    });
                }

                await delete_course({
                    variables: {
                        input: {
                            id: courses[i]["id"], 
                            type: "course"
                        }
                    }
                });
            }
        } catch (error) {
            console.error(error);
        }

        dispatch('message', {
            text: "reload"
        });
        navigate("/");
    }

    onDestroy(() => {
        console.log("onDestroy for Term")
        saveChanges();
    })

    async function saveChanges() {
        if (del) return;
        
        if (!name_change) {
            alert("Name cannot be empty!");
            return;
        }

        try {
            await update_term({
                variables: {
                    input: {
                        id: id, 
                        type: "term", 
                        name: name_change, 
                        current: info["getTerm"]["current"], 
                        archive: info["getTerm"]["archive"], 
                        data: info["getTerm"]["data"]
                    }
                }
            });

            query_result.refetch({ id });

            if (name != name_change) {
                dispatch('message', {
                    text: "reload"
                });
            }
        } catch(error) {
            console.error(error);
        }
    }

    function updateChange(event) {
        info["getTerm"]["data"] = event.detail.data;
    }

    $: {
        if ($query_result.data != undefined && (JSON.stringify(last_info) == JSON.stringify(info))) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));
            courses = info["getTerm"]["courses"];
        }
    }

    $: {
        id;
        query_result.refetch({ id });
    }

</script>

<div class="page">
{#if info != undefined}
    <Folder term_id={id} term_name={name} course_id={""} course_name={""} assign_name={""} />
    <HeaderField bind:inputText={name} text="" on:message={(event) => {name_change = event.detail.data;}}/>
    {#if info != undefined} 
        <InfoTable cmd="term" bind:info={info["getTerm"]} on:message={updateChange} />
    {/if}
    <p class="subheader">Courses</p>
        
    <div class="course-block">
    <table>
    <tbody>
        {#each courses as course}
        <tr>
            <td class="course">{course["name"]}
                <Link to={`/course/${id}/${name}/${course["id"]}/${course["name"]}`}><i class="fa-solid fa-arrow-up-right-from-square"></i></Link>
            </td> 
            <td class="grade">{(course["grade"] == null || course["grade"] == undefined) ? "no grade" : course["grade"]}</td>
        </tr>
        {/each}
    </tbody>
    </table>
    </div>
    <div class="term-op">
        <i class="fa-solid fa-trash-can" on:click={() => deleteTerm()}></i>
        <i class="fa-solid fa-floppy-disk" on:click={() => saveChanges()}></i>
    </div>
{/if}
</div>

<style>
i {
    margin-left: 8px;
}

i:hover {
    cursor: pointer;
}

table {
    text-align: left;
}

.course-block {
    width: 100vw;
}

.grade {
    padding-left: 30px;
}

</style>
