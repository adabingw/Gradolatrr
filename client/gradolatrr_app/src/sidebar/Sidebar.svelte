<script lang="js">
// @ts-nocheck

    import { Link } from "svelte-navigator";
    import { query } from "svelte-apollo";

    import SidebarButton from "../utils/SidebarButton.svelte";
    import NewButton from "../utils/NewButton.svelte";
    import Edit from "../assets/edit_icon.png";
    import Add from "../assets/add_icon.png";

    import { ALL_COURSES } from "../constants/queries_get";

    export let reload;

    const info = query(ALL_COURSES);
    let expand = {};

    function termClick(k) {
        expand[k] = !expand[k];
    }

    $: {
        console.log(reload);
        info.refetch();
    }

    $: {
        console.log($info.data)
        if ($info.data != undefined) {
            for (const term of $info["data"]["allTerm"]["items"]) {
                expand[term["id"]] = true;
            }
        }
    }

</script>

<div class="sidebar">
    <h3>GRADROLATRR</h3>
    <NewButton type="new_term" name="+ new term" />
    <!-- <NewButton type="new_course" name="+ new course" /> -->
    <div class="content">
        {#if $info.loading}
            <li>Loading...</li>
        {:else if $info.error}
            <li>ERROR: {$info.error.message}</li>
        {:else}
            {#each Object.keys($info.data.allTerm["items"]) as i}
                {#if $info.data.allTerm["items"][i] != undefined} 
                    <div class="term-row">
                        <div on:click={() => termClick($info.data.allTerm["items"][i]["id"])}>
                            <p class="term">{$info.data.allTerm["items"][i]["name"]}</p>
                        </div>
                        <div>
                            <Link to={`/new_course/${$info.data.allTerm["items"][i]["id"]}/${$info.data.allTerm["items"][i]["name"]}`}>
                                <img  src={Add} alt="add" class="sidebarimg"/> 
                            </Link>
                            <Link to={`/term/${$info.data.allTerm["items"][i]["id"]}/${$info.data.allTerm["items"][i]["name"]}`} class="sidebarimg">
                                <img  src={Edit} alt="edit"/> 
                            </Link>
                        </div>
                    </div>
                {/if}
                 {#if $info.data.allTerm["items"][i]["courses"] != undefined && 
                        expand[$info.data.allTerm["items"][i]["id"]]}
                    {#each Object.keys($info.data.allTerm["items"][i]["courses"]) as j}
                        <SidebarButton 
                            id={$info.data.allTerm["items"][i]["courses"][j]["id"]} 
                            type={$info.data.allTerm["items"][i]["courses"][j]["type"]} 
                            name={$info.data.allTerm["items"][i]["courses"][j]["name"]}
                            term_name={$info.data.allTerm["items"][i]["name"]}
                            term_id={$info.data.allTerm["items"][i]["id"]}
                        />
                    {/each}
                {/if} 
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
  height: 5px;
  margin-top: 45px;
}

.term:hover {
    cursor: pointer;
}

.content {
  margin-top: 40px;
}

</style>
