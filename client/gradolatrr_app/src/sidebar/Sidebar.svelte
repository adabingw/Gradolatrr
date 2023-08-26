<script lang="js">
// @ts-nocheck

    import { Link } from "svelte-navigator";
    import { query } from "svelte-apollo";

    import SidebarButton from "../utils/SidebarButton.svelte";
    import NewButton from "../utils/NewButton.svelte";
    import Edit from "../assets/edit_icon.png";
    import Add from "../assets/add_icon.png";

    import { ALL_COURSES } from "../constants/queries_get";

    const info = query(ALL_COURSES);

    // let info = {
    //     "2A": {
    //         type: "term",
    //         id: "1234567890",
    //         course: {
    //             "ECON101": {
    //                 type: "course",
    //                 id: "abcde"
    //             },
    //             "PSYCH101": {
    //                 type: "course",
    //                 id: "fgjijk"
    //             }
    //         }
    //     }
    // }
    let expand = {};
    
    Object.entries(info).forEach(([key, value]) => {
        expand[key] = true;
    });

    function termClick(k) {
        expand[k] = !expand[k];
    }

    $: console.log($info.data)

</script>

<div class="sidebar">
    <h3>GRADROLATRR</h3>
    <!-- <NewButton type="new_term" name="+ new term" /> -->
    <!-- <NewButton type="new_course" name="+ new course" /> -->
    <div class="content">
        {#if $info.loading}
            <li>Loading...</li>
        {:else if $info.error}
            <li>ERROR: {$info.error.message}</li>
        {:else}
            {#each Object.keys($info.data) as i}
                {i}
                {#if $info.data[i] != undefined} 

                    <div class="term-row">
                        <div on:click={() => termClick(i)}>
                            <p class="term">{i}</p>
                        </div>
                        <div>
                            <Link to={`/new_course/${info[i]["id"]}/${i}`}><img  src={Add} alt="add"/> </Link>
                            <Link to={`/term/${info[i]["id"]}/${i}`}><img  src={Edit} alt="edit"/> </Link>
                        </div>
                    </div>
                {/if}
                 <!-- {#if info[i]["course"] != undefined && expand[i]}
                    {#each Object.keys(info[i]["course"]) as j}
                        <SidebarButton 
                            id={info[i]["course"][j]["id"]} 
                            type={info[i]["course"][j]["type"]} 
                            name={j}
                            term_name={i}
                            term_id={info[i]["id"]}
                        />
                    {/each}
                {/if}  -->
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
}

.content {
  margin-top: 40px;
}
</style>
