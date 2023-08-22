<script lang="js">
// @ts-nocheck

    import Button from "../utils/Button.svelte";
    import NewButton from "../utils/NewButton.svelte";
    import Edit from "../assets/edit_icon.png";
    import Add from "../assets/add_icon.png";

    import { Link } from "svelte-navigator";

    export let info;
    let expand = {};
    
    Object.entries(info).forEach(([key, value]) => {
        expand[key] = true;
    });

    function termClick(k) {
        console.log("lalala")
        expand[k] = !expand[k];
    }

</script>

<div class="sidebar">
    <h3>GRADOLATRR</h3>
    <NewButton type="new_term" name="+ new term" />
    <!-- <NewButton type="new_course" name="+ new course" /> -->
    <div class="content">
        {#if info != undefined}
            {#each Object.keys(info) as i}
                {#if info[i]["id"] != undefined} 
                    <div class="term-row">
                        <p on:click={() => termClick(i)}>
                            <Button id={info[i]["id"]} type={info[i]["type"]} name={i}/>
                        </p>
                        <div>
                            <Link to={`/new_course/${info[i]["id"]}/${i}`}><img  src={Add} alt="add"/> </Link>
                            <Link to={`/term/${info[i]["id"]}/${i}`}><img  src={Edit} alt="edit"/> </Link>
                        </div>
                    </div>
                {/if}
                {#if info[i]["course"] != undefined && expand[i]}
                    {#each Object.keys(info[i]["course"]) as j}
                        <Button id={info[i]["course"][j]["id"]} type={info[i]["course"][j]["type"]} name={j}/>
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
}

.content {
  margin-top: 40px;
}
</style>
