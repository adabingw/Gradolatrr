<script>    
    import { query, mutation } from "svelte-apollo";
    import { navigate } from "svelte-navigator";
    import { createEventDispatcher } from "svelte";

    import CancelOrSave from "../utils/CancelOrSave.svelte";
    import Button from "../utils/Button.svelte";
    import InfoTable from '../utils/InfoTable.svelte';
    import TextField from "../utils/TextField.svelte";
    import Reload from "../assets/reload_icon.png";
    import { DEFAULT_GRADING } from "../constants/constants";
    import { TERM_INFO } from "../constants/queries_get";
    import { DELETE_TERM, DELETE_COURSE, DELETE_ASSIGN } from "../constants/queries_delete";
    import { UPDATE_TERM } from "../constants/queries_put";

    const dispatch = createEventDispatcher();

    export let id;
    export let name;

    let query_result = query(TERM_INFO, {
        variables: { id }
    });
    let name_change = name;
    let info;
    let last_info;
    let grade;
    let grading_scheme = DEFAULT_GRADING;
    let showModal = false;
    let courses;
    let delete_term = mutation(DELETE_TERM);
    let delete_course = mutation(DELETE_COURSE);
    let delete_assign = mutation(DELETE_ASSIGN);
    let update_term = mutation(UPDATE_TERM);

    async function deleteTerm() {
        let confirmDelete = confirm("delete this term?");
        if (!confirmDelete) return;

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

    async function saveChanges() {
        console.log(info["getTerm"]);
        try {
            await update_term({
                variables: {
                    input: {
                        id: id, 
                        type: "term", 
                        name: name, 
                        current: info["getTerm"]["current"], 
                        archive: info["getTerm"]["archive"], 
                        data: info["getTerm"]["data"]
                    }
                }
            });

            query_result.refetch({ id });
            navigate(`/term/${id}/${name}`);

            if (name != name_change) {
                dispatch('message', {
                    text: "reload"
                });
            }
        } catch(error) {
            console.error(error);
        }
    }

    async function regrade() {
        let result = 0;
        
        for (let course of courses) {
            if (course["grade"] != undefined && course["grade"] != null) {
                result += course["grade"];
            }
        }
        result /= courses.length;
        if (result != grade && (result != undefined && result != null)) {
            grade = result;
            try {
                await update_term({ 
                    variables: { 
                        input: {
                            id: id,
                            type: "term", 
                            grade: result
                        }
                    } 
                });
                query_result.refetch({ id });
                last_info = info;
            } catch (error) {
                console.error(error);
            }
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
            grade = info["getTerm"]["grade"];
        }
    }

    $: {
        id;
        query_result.refetch({ id });
        last_info = info;
    }

</script>

<div>
{#if info != undefined}
    <TextField bind:inputText={name} type="text" text="" min="" max="" focus={true} 
            on:message={(event) => {name_change = event.detail.data;} }/>
    {#if info != undefined} 
        <InfoTable cmd="term" bind:info={info["getTerm"]} on:message={updateChange} />
    {/if}
    <div class="term-op" on:click={deleteTerm}>
        <Button text="delete this term" />
    </div>
    <div class="course-block">
    <table>
    <tbody>
        {#each courses as course}
        <tr>
            <td class="course">{course["name"]}</td> 
            <td>{(course["grade"] == null || course["grade"] == undefined) ? "no grade" : course["grade"]}</td>
        </tr>
        {/each}
    </tbody>
    </table>
    </div>
    <div class="grade-block">
        <p class="grade">grade: </p> { grade == undefined ? "no grade" : grade}
        <img src={Reload} alt="reload" on:click={() => regrade()} class="reload" />
    </div>
    <CancelOrSave url={`/`} on:message={saveChanges} />
{/if}
</div>

<style>
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

td {
    width: 150px;
}

table {
    text-align: left;
}

.course-block {
    border-top: 1px solid black;
    padding-top: 20px;
    width: 70vw;
}

.reload {
    margin-left: 15px;
}
</style>
