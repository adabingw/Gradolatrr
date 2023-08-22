<script>
    export let courseinfo;
    const dispatch = createEventDispatcher();

    import { createEventDispatcher } from 'svelte';

    import Close from "../assets/delete_icon.png";
    import Button from './Button.svelte';

    /**
   * @param {string | number} name
   */
    function checkTag(name) {
        courseinfo[name]["checked"] = !courseinfo[name]["checked"];
        dispatch('message', {
            text: 'checked'
        });
    }

    function addTag() {
        console.log("add tag")
        dispatch('message', {
            text: 'add'
        });
    }

    /**
   * @param {string | number} name
   */
    function deleteTag(name) {
        console.log("deleting type")
        delete courseinfo[name]["content_info"][name]
        dispatch('message', {
            text: 'delete'
        });
    }
</script>

<div>
    {#each Object.keys(courseinfo) as item}
        <!-- svelte-ignore empty-block -->
        {#if item != "type"}
            <div class="type-block">
                <div class="type-block2" >
                    <p class="tag-check">
                    {#if !courseinfo[item]["required"]}
                        <input type="checkbox"
                        bind:checked={courseinfo[item]["checked"]} 
                        on:change={() => {checkTag(item)}}/>
                    {:else}
                        &nbsp; &nbsp;
                    {/if} {item}
                    </p>
                    <p>{courseinfo[item]["type"]}</p>
                </div>
                {#if !courseinfo[item]["required"]}
                <img src={Close} class="close" on:click={() => deleteTag(item)}/>
                {/if}
            </div>
        {/if}
    {/each}
    <Button text="+ add course info" on:click={() => addTag()} />
</div>

<style>
.type-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  line-height: 35px;  
  height: fit-content;
}

.type-block2 {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  width: 250px;
  line-height: 2px;
  height: 25px;
}

.tag-check {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  width: 250px;
  line-height: 5px;
  height: 5px;
}
</style>
