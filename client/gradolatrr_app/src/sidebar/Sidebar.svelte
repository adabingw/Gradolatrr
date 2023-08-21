<script lang="js">
// @ts-nocheck

    import Button from "../utils/Button.svelte";
    import NewButton from "../utils/NewButton.svelte";
    import Edit from "../assets/edit_icon.png";

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
    <NewButton type="new_course" name="+ new course" />
    <div class="content">
        {#if info != undefined}
            {#each Object.keys(info) as i}
                {#if info[i]["id"] != undefined} 
                    <div class="term-row">
                        <p on:click={() => termClick(i)}>
                            <Button id={info[i]["id"]} type={info[i]["type"]} name={i}/>
                        </p>
                        <Link to={`/term/${info[i]["id"]}/${i}`}><img  src={Edit} alt="edit"/> </Link>
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
