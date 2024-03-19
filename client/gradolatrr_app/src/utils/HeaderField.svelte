<script>
    import { createEventDispatcher } from "svelte";
    export let text;
    export let inputText;
    const dispatch = createEventDispatcher();

    function dataChange(e) {
        dispatch('message', {
            text: "data changed",
            data: inputText
        });
    }

    function handleKeydown(e) {
        if (e.key != 'Enter') return;
        dispatch('enter', {
            text: "enter pressed"
        });
    }
</script>

<div class="input-row ">
    <input type="text" class="input-text" placeholder={text} on:keydown={handleKeydown}
        bind:value={inputText} on:input={dataChange} />
</div>

<style>

input { 
  padding: 5px;
  margin-bottom: 20px;
  font-size: 38px;
  border-left: none;
  border-top: none;
  border-bottom: none;
  border-right: none;
  margin-right: 15px;
  margin-top: 100px;
  min-width: 120px;
  color: #717171;
  font-weight: 600;
  width: 50vw;
}

.input-row {
  display: flex;
  flex-direction: row;
}

</style>
