<script>
    export let url;
    
    import { Link } from "svelte-navigator";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function dispatchSave() {
        dispatch('message', {
            text: 'save'
        });
    }

</script>

<div style=" display:flex; flex-direction:row; ">
    <Link to={url}><p class="cancel-and-save">cancel</p></Link>
    <p class="cancel-and-save" on:click={dispatchSave}>save</p>
</div>

<style>
.cancel-and-save {
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 50px;
}

.cancel-and-save:hover {
  font-weight: bold;
  cursor: pointer;
}

</style>
