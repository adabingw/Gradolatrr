<script lang="js">
// @ts-nocheck

    import { Link } from "svelte-navigator";
    import { query, mutation } from "svelte-apollo";

    import NewButton from "../utils/NewButton.svelte";
    import Edit from "../assets/edit_icon.png";
    import Add from "../assets/add_icon.png";
    import { ALL_COURSES } from "../constants/queries_get";
    import { UPDATE_TERM, UPDATE_COURSE } from "../constants/queries_put";

    export let reload;

    const query_result = query(ALL_COURSES);
    const update_term = mutation(UPDATE_TERM);
    const update_course = mutation(UPDATE_COURSE);
    let info;
    let last_info;
    let expand = {};

    function termClick(k) {
        expand[k] = !expand[k];
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
        ev.dataTransfer.setData("index", index);
    }

    function dragover (ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
    }

    async function drop (ev, index2) {
        ev.preventDefault();
        var index = ev.dataTransfer.getData("index");

        if (index == index2) return;
        let order = info["allTerm"]["items"][index]["order"];
        let order2 = info["allTerm"]["items"][index2]["order"];
        order = order2 + 1;
        info["allTerm"]["items"][index]["order"] = order;

        try {
            await update_term({ 
                variables: { 
                    input: {
                        id: info["allTerm"]["items"][index]["id"],
                        name: info["allTerm"]["items"][index]["name"], 
                        type: "term", 
                        order: order
                    }
                } 
            });
        } catch (error) {
            console.error(error);
        }
        
        let orders = [order];
        for (let i = 0; i < info["allTerm"]["items"].length; i++) {
            if (i == index) continue;
            const o = info["allTerm"]["items"][i]["order"]
            if (orders.includes(o)) {
                orders.push(o + 1);
                info["allTerm"]["items"][i]["order"]++;
                try {
                    await update_term({ 
                        variables: { 
                            input: {
                                id: info["allTerm"]["items"][i]["id"],
                                name: info["allTerm"]["items"][i]["name"], 
                                type: "term", 
                                order: o + 1
                            }
                        } 
                    });
                } catch (error) {
                    console.error(error);
                }
            } else {
                orders.push(o);
            }
        }
        info["allTerm"]["items"] = sortOrder(info["allTerm"]["items"]);        
        return;
    }

    function dragstartCourse (ev, index, termIndex) {
        ev.dataTransfer.setData("index", index);
        ev.dataTransfer.setData("termIndex", termIndex);
    }

    async function dropCourse (ev, index2, termIndex2) {
        ev.preventDefault();
        var index = ev.dataTransfer.getData("index");
        var termIndex = ev.dataTransfer.getData("termIndex");

        if (termIndex != termIndex2) return;
        if (index == index2) return;

        let order = info["allTerm"]["items"][termIndex]["courses"][index]["order"];
        let order2 = info["allTerm"]["items"][termIndex]["courses"][index2]["order"];
        order = order2 + 1;
        info["allTerm"]["items"][termIndex]["courses"][index]["order"] = order;

        try {
            await update_course({ 
                variables: { 
                    input: {
                        id: info["allTerm"]["items"][termIndex]["courses"][index]["id"],
                        name: info["allTerm"]["items"][termIndex]["courses"][index]["name"], 
                        term_id: info["allTerm"]["items"][termIndex]["id"],
                        type: "course", 
                        order: order
                    }
                } 
            });
        } catch (error) {
            console.error(error);
        }
        
        let orders = [order];
        for (let i = 0; i < info["allTerm"]["items"][termIndex]["courses"].length; i++) {
            if (i == index) continue;
            const o = info["allTerm"]["items"][termIndex]["courses"][i]["order"];
            if (orders.includes(o)) {
                orders.push(o + 1);
                info["allTerm"]["items"][termIndex]["courses"][i]["order"]++;
                try {
                    await update_course({ 
                        variables: { 
                            input: {
                                id: info["allTerm"]["items"][termIndex]["courses"][index]["id"],
                                name: info["allTerm"]["items"][termIndex]["courses"][index]["name"], 
                                term_id: info["allTerm"]["items"][termIndex]["id"],
                                type: "course", 
                                order: o + 1
                            }
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            } else {
                orders.push(o);
            }
        }

        info["allTerm"]["items"][termIndex]["courses"] = sortOrder(info["allTerm"]["items"][termIndex]["courses"]);                
        return;
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
        if ($query_result.data != undefined && (JSON.stringify(info) == JSON.stringify(last_info))) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));
            info["allTerm"]["items"] = sortOrder(info["allTerm"]["items"]);
            for (let i = 0; i < info["allTerm"]["items"].length; i++) {
                let term = info["allTerm"]["items"][i]
                info["allTerm"]["items"][i]["courses"] = sortOrder(info["allTerm"]["items"][i]["courses"]);
                if(expand[term["id"]] == undefined) {
                    expand[term["id"]] = true;
                }
            }
            reload = false;
        }
        expand = expand;
    }

</script>

<div class="sidebar">
    <Link to="/"><h3>GRADROLATRR</h3></Link>
    <NewButton type="new_term" name="+ new term" />
    <div class="content">
    {#if info != undefined}
    {#each Object.keys(info.allTerm["items"]) as i}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div draggable={true} on:dragstart={event => dragstart(event, i)} 
        on:drop={event => drop(event, i)} on:dragover={dragover}>
        {#if info.allTerm["items"][i] != undefined} 
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="term-row">
                <p class="term" on:click={() => termClick(info.allTerm["items"][i]["id"])}>{info.allTerm["items"][i]["name"]}</p>
                <div>
                    <Link to={`/new_course/${info.allTerm["items"][i]["id"]}/${info.allTerm["items"][i]["name"]}`}>
                        <img  src={Add} alt="add" class="sidebarimg"/> 
                    </Link>
                    <Link to={`/term/${info.allTerm["items"][i]["id"]}/${info.allTerm["items"][i]["name"]}`} class="sidebarimg">
                        <img  src={Edit} alt="edit"/> 
                    </Link>
                </div>
            </div>
        {/if}
        <div class="courses">
            {#if info.allTerm["items"][i]["courses"] != undefined && 
                expand[info.allTerm["items"][i]["id"]]}
            {#each Object.keys(info.allTerm["items"][i]["courses"]) as j}
                <Link to={`/course/${info.allTerm["items"][i]["id"]}/${info.allTerm["items"][i]["name"]}/${info.allTerm["items"][i]["courses"][j]["id"]}/${info.allTerm["items"][i]["courses"][j]["name"]}`}>
                    <p class="course" draggable={true} on:dragstart={event => dragstartCourse(event, j, i)} 
                        on:drop={event => dropCourse(event, j, i)} on:dragover={dragover}>
                        {info.allTerm["items"][i]["courses"][j]["name"]}
                    </p>
                </Link>
            {/each}
        {/if} 
        </div>
    </div>
    {/each}
    {/if}
    </div>
</div>

<style>
.sidebar {
    padding-top: 25px;
    width: 15vw;
    margin-left: 25px;
    padding-right: 25px;
    border-right: 1px solid black;
    height: 100vh;
}

.term-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    align-self: center;
    height: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 12px;
    margin-left: -18px;
}

.courses {
    margin-top: -20px;
    margin-bottom: 20px;
}

.term-row:hover {
    background-color: #D8CAD6;
    cursor: pointer;
}

.term {
    font-weight: bold;
}

.term:hover {
    cursor: pointer;
}

.content {
    margin-top: 40px;
}

.course {
    margin-left: 8px;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 12px;
    margin-bottom: -20px;
}

.course:hover {
    cursor: pointer;
    background-color: #F9D4C2;
}

</style>
