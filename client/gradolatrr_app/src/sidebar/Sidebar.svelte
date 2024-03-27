<script lang="js">
// @ts-nocheck

    import { Link } from "svelte-navigator";
    import { query, mutation } from "svelte-apollo";
    import { navigate } from "svelte-navigator";
    import { v4 as uuidv4 } from 'uuid';

    import ContextMenu from "../utils/ContextMenu.svelte";
    import { ALL_COURSES } from "../constants/queries_get";
    import { DUPLICATE_TERM } from "../constants/queries_post";
    import { UPDATE_TERM, UPDATE_COURSE, UPDATE_ASSIGNMENT } from "../constants/queries_put";
    import { DELETE_TERM, DELETE_COURSE, DELETE_ASSIGN } from "../constants/queries_delete";

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let reload;
    export let triggerreload;
    export let w;

    const query_result = query(ALL_COURSES);
    const update_term = mutation(UPDATE_TERM);
    const update_course = mutation(UPDATE_COURSE);
    const update_assign = mutation(UPDATE_ASSIGNMENT);
    const delete_term = mutation(DELETE_TERM);
    const delete_course = mutation(DELETE_COURSE);
    const delete_assign = mutation(DELETE_ASSIGN);
    const duplicate_term = mutation(DUPLICATE_TERM);
    let info;
    let last_info;
    let showTerm = false;
    let showCourse = false;
    let expand = {};
    let context_bundle = [ 0, 0, 0 ];
    let dragged = undefined;
    let lock = false;

    function termClick(k) {
        expand[k] = !expand[k];
        localStorage.setItem("expand", JSON.stringify(expand));
    }

    function maxOrder(content) {
        let max = 0;
        for (let item of content) {
            if (item["order"] != null && item["order"] != undefined && !isNaN(item["order"])) {
                max = Math.max(max, item["order"]);
            }
        }
        return max;
    }

    function sortOrder(content) {
        const sorted = content.sort((a, b) => {
            let aVal = a["order"];
            let bVal = b["order"];
            if (aVal == null || aVal == undefined || isNaN(aVal)) {
                aVal = maxOrder(content) + 1;
                a["order"] = aVal;
            }

            if (bVal == null || bVal == undefined || isNaN(bVal)) {
                bVal = Math.max(maxOrder(content) + 1, aVal + 1);
                b["order"] = bVal;
            }

            return aVal - bVal;
        });
        return sorted;
    }

    function dragstart (ev, index) {
        ev.dataTransfer.setData("termIndex", index);
    }

    function dragover (ev, source, i, j) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
        if (source == 'course' && dragged == 'course') {
            let target = document.getElementById(`course-${info.allTerm['items'][i]['courses'][j]['id']}`);
            if (target) {
                target.style.borderTop = '1px solid blue';
            }
        } else if (source == 'term') {
            let target = document.getElementById(`term-${info.allTerm['items'][i]['id']}`);
            if (target) {
                target.style.borderTop = '1px solid blue';
            }
        }
    }

    function dragleave (ev, source, i, j) {
        ev.preventDefault();
        if (source == 'course') {
            let target = document.getElementById(`course-${info.allTerm['items'][i]['courses'][j]['id']}`);
            if (target) {
                target.style.borderTop = '0px solid red';
            }
        } else if (source == 'term') {
            let target = document.getElementById(`term-${info.allTerm['items'][i]['id']}`);
            if (target) {
                target.style.borderTop = '0px solid red';
            }
        }
        ev.dataTransfer.dropEffect = 'move';
    }

    async function switchCourse(course, old_term, new_term) {
        let max_order = maxOrder(new_term["courses"]) + 1;
        try {
            await update_course({
                variables: {
                    input: {
                        id: course["id"],
                        type: "course", 
                        term_id: new_term["id"],
                        order: max_order
                    }
                }
            });

            for (let i = 0; i < course["assignments"].length; i++) {
                await update_assign({
                    variables: {
                        input: {
                            id: course["assignments"][i]["id"], 
                            type: "item", 
                            term_id: new_term["id"]
                        }
                    }
                })
            }
        } catch(error) {
            console.error(error);
        }
    }

    async function drop (ev, index2) {
        ev.preventDefault();
        dragged = undefined;
        var index = ev.dataTransfer.getData("termIndex");
        var type = ev.dataTransfer.getData("type");

        let target = document.getElementById(`term-${info.allTerm['items'][index]['id']}`);
        if (target) {
            target.style.borderTop = '0px solid red';
        }

        let target2 = document.getElementById(`term-${info.allTerm['items'][index2]['id']}`);
        if (target2) {
            target2.style.borderTop = '0px solid red';
        }

        // if (type == "course") {
        //     console.log("meep")
        //     let course_index = ev.dataTransfer.getData("courseIndex");
        //     let original_term = info["allTerm"]["items"][index];
        //     let new_term = info["allTerm"]["items"][index2];
        //     let course = info["allTerm"]["items"][index]["courses"][course_index];
        //     switchCourse(course, original_term, new_term);
        //     reload = true;
        //     return;
        // }

        if (index == index2) return;
        let order2 = info["allTerm"]["items"][index2]["order"];
        info["allTerm"]["items"][index]["order"] = order2;
        
        let orders = [order2];
        for (let i = 0; i < info["allTerm"]["items"].length; i++) {
            if (i == index) continue;
            const o = info["allTerm"]["items"][i]["order"]
            if (orders.includes(o)) {
                orders.push(o + 1);
                info["allTerm"]["items"][i]["order"] = o + 1;
            } else {
                orders.push(o);
            }
        }

        lock = true;
        for (let i = 0; i < info['allTerm']['items'].length; i++) {
            try {
                await update_term({ 
                    variables: { 
                        input: {
                            id: info["allTerm"]["items"][i]["id"],
                            name: info["allTerm"]["items"][i]["name"], 
                            type: "term", 
                            order: info['allTerm']['items'][i]['order']
                        }
                    } 
                });
            } catch (error) {
                console.error(error);
            }
        }
        lock = false;

        info["allTerm"]["items"] = sortOrder(info["allTerm"]["items"]);        
        return;
    }

    function dragstartCourse (ev, index, termIndex) {
        ev.dataTransfer.setData("type", "course");
        ev.dataTransfer.setData("courseIndex", index);
        ev.dataTransfer.setData("termIndex", termIndex);
        dragged = 'course';
    }

    async function dropCourse (ev, index2, termIndex2) {
        ev.preventDefault();
        var index = ev.dataTransfer.getData("courseIndex");
        var termIndex = ev.dataTransfer.getData("termIndex");

        dragged = undefined;

        let target = document.getElementById(`course-${info.allTerm['items'][termIndex]['courses'][index]['id']}`);
        if (target) {
            target.style.borderTop = '0px solid red';
        }

        let target2 = document.getElementById(`course-${info.allTerm['items'][termIndex2]['courses'][index2]['id']}`);
        if (target2) {
            target2.style.borderTop = '0px solid red';
        }

        if (index == index2) return;

        if (termIndex != termIndex2) {
            let original_term = info["allTerm"]["items"][termIndex];
            let new_term = info["allTerm"]["items"][termIndex2];
            let course = info["allTerm"]["items"][termIndex]["courses"][index];
            switchCourse(course, original_term, new_term);
            reload = true;
            return;
        }

        let order2 = info["allTerm"]["items"][termIndex]["courses"][index2]["order"];

        last_info = JSON.parse(JSON.stringify(info));

        info["allTerm"]["items"][termIndex]["courses"][index]["order"] = order2;
        
        let orders = [order2];
        for (let i = 0; i < info["allTerm"]["items"][termIndex]["courses"].length; i++) {
            if (i == index) continue;
            const o = info["allTerm"]["items"][termIndex]["courses"][i]["order"];
            if (orders.includes(o)) {
                orders.push(o + 1);
                info["allTerm"]["items"][termIndex]["courses"][i]["order"] = o + 1;
            } else {
                orders.push(o);
            }
        }

        lock = true;
        for (let i = 0; i < info["allTerm"]["items"][termIndex]["courses"].length; i++) {
            try {
                await update_course({ 
                    variables: { 
                        input: {
                            id: info["allTerm"]["items"][termIndex]["courses"][i]["id"],
                            name: info["allTerm"]["items"][termIndex]["courses"][i]["name"], 
                            term_id: info["allTerm"]["items"][termIndex]["id"],
                            type: "course", 
                            order: info["allTerm"]["items"][termIndex]["courses"][i]["order"]
                        }
                    }
                }).then((response) => {
                    console.log(response);
                });
            } catch (error) {
                console.error(error);
            }
        }
        lock = false;

        info["allTerm"]["items"][termIndex]["courses"] = sortOrder(info["allTerm"]["items"][termIndex]["courses"]);                
        return;
    }

    async function deleteTerm(index, item) {
        let confirmDelete = confirm("Delete this term?");
        if (!confirmDelete) return;
        try {
            await delete_term({ 
                variables: { 
                    input: {
                        id: item["id"], 
                        type: "term"
                    }
                } 
            });

            let courses = item["courses"];
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
            query_result.refetch();
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteCourse(index, item) {
        let confirmDelete = confirm("Delete this course?");
        if (!confirmDelete) return;

        try {
            await delete_course({ 
                variables: { 
                    input: {
                        id: item["id"], 
                        type: "course"
                    }
                } 
            });

            for (let i = 0; i < item["assignments"].length; i++) {
                await delete_assign({
                    variables: {
                        input: {
                            id: info["assignments"][i]["id"], 
                            type: "item"
                        }
                    }
                });
            }
            query_result.refetch();
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    async function duplicateTerm(index, item) {
        let term_id = uuidv4();
        let term = {
            id: term_id, 
            name: "Copy of " + item["name"], 
            type: "term",
            data: item["data"], 
            grade: item["grade"],
            order: 0
        }

        let courses = [];
        let assigns = [];
        for (let course of item["courses"]) {
            let course_id = uuidv4();
            courses.push({
                id: course_id, 
                term_id: term_id, 
                name: "Copy of " + course["name"], 
                type: "course", 
                data: course["data"],
                content_info: course["content_info"],
                order: course["order"],
                grading_scheme: course["grading_scheme"],
                grade: course["grade"]
            });
            let assignments = course["assignments"];
            for (let assign of assignments) {
                let assign_id = uuidv4();
                assigns.push({
                    id: assign_id, 
                    term_id: term_id, 
                    course_id: course_id, 
                    name: "Copy of " + assign["name"], 
                    type: "item", 
                    data: assign["data"],
                })
            }
        }

        let input = [{
            term: term,
            courses: courses, 
            assignments: assigns
        }]

        try {
            await duplicate_term({ 
                variables: {
                    input: input
                } 
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function duplicateCourse(index, item) {

    }

    function loadData() {
        info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
        console.log(info);
        last_info = JSON.parse(JSON.stringify(info));
        info["allTerm"]["items"] = sortOrder(info["allTerm"]["items"]);
        expand = JSON.parse(localStorage.getItem("expand"));
        if (expand == null || expand == undefined) expand = {};

        for (let i = 0; i < info["allTerm"]["items"].length; i++) {
            let term = info["allTerm"]["items"][i]
            info["allTerm"]["items"][i]["courses"] = sortOrder(info["allTerm"]["items"][i]["courses"]);

            if(expand[term["id"]] == undefined) {
                expand[term["id"]] = true;
            }

            localStorage.setItem("expand", JSON.stringify(expand));
        }
        reload = false;
    }

    function openTerm(e, index, item) {
        e.preventDefault();
        context_bundle = [e.clientX, e.clientY, index, item];
        showTerm = true;
        showCourse = false;
    }

    function openCourse(e, index, item, term_id, term_name) {
        e.preventDefault();
        item["term_id"] = term_id;
        item["term_name"] = term_name;
        context_bundle = [e.clientX, e.clientY, index, item];
        showCourse = true;
        showTerm = false;
    }

    function contextControllerTerm(e) {
        const context = e.detail.context; 
        const index = e.detail.index;
        const item = e.detail.item;
        if (context == 'trash') {
            deleteTerm(index, item);
        } else if (context == 'duplicate') {
            duplicateTerm(index, item);
        }
    }

    function contextControllerCourse(e) {
        const context = e.detail.context; 
        const index = e.detail.index;
        const item = e.detail.item;
        if (context == 'trash') {
            deleteCourse(index, item);
        } else if (context == 'edit') {
            navigate(`/course/edit/${item["term_id"]}/${item["term_name"]}/${item["id"]}/${item["name"]}`);
        } else if (context == 'copy') {

        }
    }

    $: {
        if (reload) {
            query_result.refetch();
            if (info != undefined) {
                last_info = JSON.parse(JSON.stringify(info));
            } else {
                last_info = undefined; 
                info = undefined;
            }
        }        
    }

    $: {
        $query_result;
        console.log("goiquwoeiqwueoq")
        if ($query_result.data != undefined && !lock) {
            loadData();
        }
    }

</script>

<ContextMenu bind:showMenu={showTerm} 
        bind:x={context_bundle[0]} 
        bind:y={context_bundle[1]} 
        bind:index={context_bundle[2]}
        bind:item={context_bundle[3]}
        menuNum={3}
        on:context={contextControllerTerm}/>
<ContextMenu bind:showMenu={showCourse} 
        bind:x={context_bundle[0]} 
        bind:y={context_bundle[1]} 
        bind:index={context_bundle[2]}
        bind:item={context_bundle[3]}
        menuNum={2}
        on:context={contextControllerCourse}/>
<div id="sidebar" style={`width:${w}`}>
    <i class="fa-solid fa-angles-left"
    on:click={() => {
        dispatch('collapse', {
            text: "clicked"
        });
    }}
    ></i>
    <Link to="/">
        <div class="logo">
            <img src="https://i.redd.it/hi-heres-my-anya-forger-cosplay-waku-waku-swipe-to-see-v0-nfv8yzrxowy81.jpg?width=750&format=pjpg&auto=webp&s=414cb680c43b0b4459f5da01f8e87488ba5df98a"/>
            GRAKU GRAKU
        </div>
    </Link>
    <br />
    <span class="new_term">
        <Link to={'/new_term'}>
            <i class="fa-solid fa-circle-plus fa-xs"></i>    
            New term
        </Link>
    </span>
    <div class="content">
    {#if info != undefined}
    {#each Object.keys(info.allTerm["items"]) as i}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div draggable={true} on:dragstart={event => dragstart(event, i)} 
        on:drop={event => drop(event, i)}
    >
        {#if info.allTerm["items"][i] != undefined} 
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <Link to={`/term/${info.allTerm["items"][i]["id"]}/${info.allTerm["items"][i]["name"]}`}>
            <div id={`term-${info.allTerm['items'][i]['id']}`} on:dragover={event => dragover(event, 'term', i)}
                on:dragleave={event => dragleave(event, 'term', i)}>
                <div class="term-row" on:contextmenu={(e) => { e.stopPropagation(); openTerm(e, i, info.allTerm["items"][i])}}  >
                    <span class="term-row-left">
                        <p>
                            {#if info.allTerm["items"][i]["courses"] != undefined && expand[info.allTerm["items"][i]["id"]]}
                            <i class="fa-solid fa-chevron-down fa-xs" on:click={() => termClick(info.allTerm["items"][i]["id"])}></i>
                            {:else}
                            <i class="fa-solid fa-chevron-right fa-xs" on:click={() => termClick(info.allTerm["items"][i]["id"])}></i>
                            {/if}
                                <span class="term">
                                    {info.allTerm["items"][i]["name"]}
                                </span>
                        </p>
                    </span>
                    <div>
                        <Link to={`/new_course/${info.allTerm["items"][i]["id"]}/${info.allTerm["items"][i]["name"]}`}>
                            <i class="fa-solid fa-plus"></i>
                        </Link>
                    </div>
                </div>
            </div>
            </Link>
        {/if}
        <div class="courses">
            {#if info.allTerm["items"][i]["courses"] != undefined && 
                expand[info.allTerm["items"][i]["id"]]}
            {#each Object.keys(info.allTerm["items"][i]["courses"]) as j}
            <div>
                <Link to={`/course/${info.allTerm["items"][i]["id"]}/${info.allTerm["items"][i]["name"]}/${info.allTerm["items"][i]["courses"][j]["id"]}/${info.allTerm["items"][i]["courses"][j]["name"]}`}>
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <span class="course_wrapper" id={`course-${info.allTerm['items'][i]['courses'][j]['id']}`}>
                        <p 
                            class="course" draggable={true} on:dragstart={event => dragstartCourse(event, j, i)} 
                            on:drop={event => dropCourse(event, j, i)} on:dragover={event => dragover(event, 'course', i, j)}
                            on:click={() => { triggerreload = !triggerreload; }} on:dragleave={event => dragleave(event, 'course', i, j)}
                            on:contextmenu={
                                (e) => {e.stopPropagation(); openCourse(
                                    e, j, info.allTerm["items"][i]["courses"][j],
                                    info.allTerm["items"][i]["id"], info.allTerm["items"][i]["name"])} } >
                            {info.allTerm["items"][i]["courses"][j]["name"]}
                        </p>
                    </span>
                </Link>
            </div>
            {/each}
        {/if} 
        </div>
    </div>
    {/each}
    {/if}
    </div>
</div>

<style>

.course_wrapper {
    margin: 0px !important;
    padding: 0px;
    display: block;
}

.fa-angles-left {
    position: absolute;
    top: 15px;
    right: 8px;
}

#sidebar .logo {
    margin-bottom: 30px;
    display: flex; 
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 35px;
    margin-right: 35px;
}

#sidebar .new_term {
    padding-top: 38px;
    padding-bottom: 8px;
    padding-right: 10px;
    border-radius: 0px 8px 8px 0px;
    transition: 0.5s;
    width: 100%;
    height: 15px;
}

#sidebar {
    position: relative;
    color: #616161;
    padding-top: 25px;
    width: 15vw;
    padding-left: 20px;
    padding-right: 5px;
    transition: 0.5s;
    height: 100vh;
    background-color: #F7F6F3;
}

#sidebar .term-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    align-self: center;
    height: 15px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 0px 8px 8px 0px;
    margin-left: -18px;
}

#sidebar .term-row:hover {
    background-color: #e8e5df;
    cursor: pointer;
}

#sidebar .courses {
    color: #616161;
    margin-top: 5px;
    margin-bottom: 20px;
}

#sidebar .term-row-left {
    display: flex; 
    flex-direction: row;
}

#sidebar .term {
    font-weight: 600;
}

#sidebar .term:hover {
    cursor: pointer;
}

#sidebar .content {
    margin-top: 20px;
}

#sidebar .course {
    padding-left: 23px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-bottom: 0px;
    margin-left: -15px;
    margin-top: 0px;
    border-radius: 0px 8px 8px 0px;
    color: #616161;
}

#sidebar .course:hover {
    cursor: pointer;
    background-color: #e8e5df;
}

</style>
