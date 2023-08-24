<script>
    import { createEventDispatcher } from 'svelte';

    import Close from "../assets/delete_icon.png";
    import Button from './Button.svelte';
    import TextField from './TextField.svelte';
    import Dropdown from './Dropdown.svelte';

    export let courseinfo;

    let add = false;
    let info_name;
    let info_type;
    let types = [["text", 0], ["number", 0], ["tags", 0], ["textarea", 0]];

    const dispatch = createEventDispatcher();

    /**
   * @param {string | number} name
   */
    function checkInfo(name) {
        dispatch('info', {
            info: 'checked'
        })
    }

    function addInfo() {
        console.log("add tag")
        add = true;
    }

    function saveInfo() {
        let new_info = {
            "checked": true, 
            "type": info_type, 
            "required": false,
            "order": 0
        }
        courseinfo[info_name] = new_info;
        dispatch('info', {
            info: 'saved'
        });
        add = false;
        info_name = "";
    }

    function cancelInfo() {
        add = false;
    }

    function deleteTag(name) {
        // delete courseinfo[name]
        dispatch('info', {
            info: 'delete',
            data: name
        })

        info_name = "";
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
                        on:change={() => {checkInfo(item)}}/>
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
    {#if add}
        <TextField bind:inputText={info_name} type="text" text=""/>
        <Dropdown info={types} bind:selected={info_type}/>
        <Button text="save" on:message={saveInfo} />
        <Button text="cancel" on:message={cancelInfo} />
    {:else}
        <Button text="+ add course info" on:click={() => addInfo()} on:message={addInfo} />
    {/if}
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
