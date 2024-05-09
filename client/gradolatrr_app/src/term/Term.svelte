<script>
// @ts-nocheck
    
    import { query, mutation } from "svelte-apollo";
    import { Link, navigate } from "svelte-navigator";
    import { createEventDispatcher, onDestroy } from "svelte";

    import InfoTable from '../utils/InfoTable.svelte';
    import { TERM_INFO } from "../constants/queries_get";
    import { DELETE_TERM, DELETE_COURSE, DELETE_ASSIGN } from "../constants/queries_delete";
    import { UPDATE_TERM } from "../constants/queries_put";
    import HeaderField from "../utils/HeaderField.svelte";
    import Folder from "../utils/Folder.svelte";
    import ContextMenu from "../utils/ContextMenu.svelte";
    import TooltipIcon from "../utils/TooltipIcon.svelte";

    const dispatch = createEventDispatcher();

    export let id;
    export let name;

    let query_result = query(TERM_INFO, {
        variables: { id }
    });
    let name_change = name;
    let info;
    let last_info;
    let courses = [];
    let delete_term = mutation(DELETE_TERM);
    let delete_course = mutation(DELETE_COURSE);
    let delete_assign = mutation(DELETE_ASSIGN);
    let update_term = mutation(UPDATE_TERM);
    let del = false;
    let sort = 0;
    let sorts = {};
    let contextmenu;

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

        localStorage.setItem("sort", JSON.stringify(sorts));

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

    function contextController(e) {     
        let body = document.getElementById('homepage');
        if (body) body.style.overflowY = 'auto';

        if (sort == e.detail.context) return;   
        if (e.detail.context == 'alpha_asc') {
            sort = 1;
        } else if (e.detail.context == 'alpha_desc') {
            sort = 2;
        } else if (e.detail.context == 'grade_asc') {
            sort = 3;
        } else if (e.detail.context == 'grade_desc') {
            sort = 4;
        } else if (e.detail.context == 'custom') {
            sort = 0;
        }
        sorts[name] = sort;
        localStorage.setItem("sort", JSON.stringify(sorts));
        sortCourses((sort == 1 || sort == 2) ? 'name' : 'mark', (sort == 1 || sort == 3) ? 1 : (sort == 0) ? 0 : 2);
    }

    function sortCourses(key, _sort) {
        // 0: default; 1: asc; 2: desc
        if (_sort == 0) courses = info["getTerm"]["courses"];
        else if (_sort == 1) {
            courses.sort(function(a, b){
                return (a[key] < b[key]) ? -1 : 1;
            })
        } else if (_sort == 2) {
            courses.sort(function(a, b){
                return (a[key] < b[key]) ? 1 : -1;
            })
        }
        courses = [...courses];
    }

    $: {
        if (!$query_result.loading && $query_result.data != undefined && (JSON.stringify(last_info) == JSON.stringify(info))) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));
            courses = info["getTerm"]["courses"];
            sortCourses((sort == 1 || sort == 2) ? 'name' : 'mark', (sort == 1 || sort == 3) ? 1 : (sort == 0) ? 0 : 2);;
        }
    }

    $: {
        id;
        query_result.refetch({ id });
        sorts = JSON.parse(localStorage.getItem('sort'));
        if (sorts && sorts[name]) sort = sorts[name];
        else if (!sorts) {
            sorts = {};
            sorts[name] = sort;
        } else if (!sorts[name]) {
            sorts[name] = sort
        };
        localStorage.setItem("sort", JSON.stringify(sorts));
    }

</script>

<ContextMenu bind:this={contextmenu} menuNum={5} on:context={contextController}/>
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="page">
{#if info != undefined}
    <Folder term_id={id} term_name={name} course_id={""} course_name={""} assign_name={""} />
    <HeaderField bind:inputText={name} text="" on:message={(event) => {name_change = event.detail.data;}}/>
    {#if info != undefined} 
        <InfoTable cmd="term" bind:info={info["getTerm"]} on:message={updateChange} />
    {/if}
    <p class="subheader">Courses <i class="fa-solid fa-arrow-down-wide-short fa-xs" on:click={(e) => {
        e.stopPropagation(); 
        contextmenu.openMenu(e, sort, 0)
    }}></i></p>
        
    <div class="course-block">
    <table>
    <tbody>
        {#each courses as course}
        <tr>
            <td class="course">{course["name"]}
                <Link to={`/course/${id}/${name}/${course["id"]}/${course["name"]}`}>
                    <i class="fa-solid fa-arrow-up-right-from-square">
                    </i>
                </Link>
            </td> 
            <td class="grade">{(course["grade"] == null || course["grade"] == undefined) ? "no grade" : course["grade"]}</td>
        </tr>
        {/each}
    </tbody>
    </table>
    </div>
    <div class="term-op">
        <TooltipIcon icon='fa-solid fa-trash-can' position='left' text='delete' click={deleteTerm} />
        <TooltipIcon icon='fa-solid fa-floppy-disk' click={saveChanges} position='left' text='save'/>
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
