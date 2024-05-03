<script>
// @ts-nocheck
    
    import { query, mutation } from "svelte-apollo";
    import { Link, navigate } from "svelte-navigator";
    import { createEventDispatcher, onDestroy } from "svelte";
    import { tooltip } from '@svelte-plugins/tooltips';

    import InfoTable from '../utils/InfoTable.svelte';
    import { TERM_INFO } from "../constants/queries_get";
    import { DELETE_TERM, DELETE_COURSE, DELETE_ASSIGN } from "../constants/queries_delete";
    import { UPDATE_TERM } from "../constants/queries_put";
    import HeaderField from "../utils/HeaderField.svelte";
    import Folder from "../utils/Folder.svelte";
    import ContextMenu from "../utils/ContextMenu.svelte";

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
    let showMenu = false;
    let context_bundle = [ 0, 0, 0, 0 ];

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

    function openMenu(e) {
        showMenu = false;
        e.preventDefault();
        context_bundle = [e.clientX, e.clientY, sort, 0];
        showMenu = true;
        let body = document.getElementById('homepage');
        if (body) body.style.overflowY = 'hidden';
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
        sortCourses();
    }

    function sortCourses() {
        /**
         * 0: default
         * 1: alphabetical asc
         * 2: alphabetical desc
         * 3: grade asc
         * 4: grade desc
        */
        if (sort == 0) {
            courses = info["getTerm"]["courses"];
        } else if (sort == 1) {
            courses.sort(function(a, b){
                if(a.name < b.name) { return -1; }
                if(a.name > b.name) { return 1; }
                return 0;
            })
        } else if (sort == 2) {
            courses.sort(function(a, b){
                if(a.name < b.name) { return 1; }
                if(a.name > b.name) { return -1; }
                return 0;
            })
        } else if (sort == 3) {
            courses.sort(function(a, b){
                if(a.grade < b.grade) { return -1; }
                if(a.grade > b.grade) { return 1; }
                return 0;
            })
        } else if (sort == 4) {
            courses.sort(function(a, b){
                if(a.grade < b.grade) { return 1; }
                if(a.grade > b.grade) { return -1; }
                return 0;
            })
        }
        courses = [...courses];
    }

    $: {
        if (!$query_result.loading && $query_result.data != undefined && (JSON.stringify(last_info) == JSON.stringify(info))) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));
            courses = info["getTerm"]["courses"];
            sortCourses();
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

    $: {
        showMenu;
        if (!showMenu) {
            let body = document.getElementById('homepage');
            if (body) body.style.overflowY = 'auto';
        }
    }

</script>

<ContextMenu bind:showMenu={showMenu} 
        bind:x={context_bundle[0]} 
        bind:y={context_bundle[1]} 
        bind:index={context_bundle[2]}
        bind:item={context_bundle[3]}
        menuNum={5}
        on:context={contextController}/>
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
        openMenu(e)}}></i></p>
        
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
        <i class="fa-solid fa-trash-can" on:click={() => deleteTerm()}
            use:tooltip={{
                content:
                  'delete',
                style: { backgroundColor: '#515151', color: '#ffffff', padding: '5px 5px 5px 5px' },
                position: 'left',
                animation: 'slide',
                arrow: false
            }}></i>
        <i class="fa-solid fa-floppy-disk" on:click={() => saveChanges()}
            use:tooltip={{
                content:
                  'save',
                style: { backgroundColor: '#515151', color: '#ffffff', padding: '5px 5px 5px 5px' },
                position: 'left',
                animation: 'slide',
                arrow: false
            }}></i>
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
