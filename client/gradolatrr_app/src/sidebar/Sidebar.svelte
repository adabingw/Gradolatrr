<script lang="js">
// @ts-nocheck

    import { Link } from "svelte-navigator";
    import { query } from "svelte-apollo";
    import NewButton from "../utils/NewButton.svelte";
    import Edit from "../assets/edit_icon.png";
    import Add from "../assets/add_icon.png";

    import { ALL_COURSES } from "../constants/queries_get";

    export let reload;

    const query_result = query(ALL_COURSES);
    let info;
    let last_info;
    let expand = {};

    function termClick(k) {
        expand[k] = !expand[k];
    }

    $: {
        console.log(reload);
        query_result.refetch();
        if (info != undefined) last_info = JSON.parse(JSON.stringify(info));
        else {
            last_info = undefined; 
            info = undefined;
        }
    }

    $: {
        if ($query_result.data != undefined && (JSON.stringify(info) == JSON.stringify(last_info))) {
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));
            for (const term of info["allTerm"]["items"]) {
                expand[term["id"]] = true;
            }
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
                    <p class="course">{info.allTerm["items"][i]["courses"][j]["name"]}</p>
                </Link>
            {/each}
        {/if} 
        </div>
    {/each}
    {/if}
    </div>
</div>

<style>
.sidebar {
  padding-top: 25px;
  max-width: 15vw;
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
