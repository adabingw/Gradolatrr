<script>
    export let text;
    export let inputText;
    export let type;
</script>

<div class="input-row">
    {#if type == "text"}
      <input type="text" class="input-text" placeholder={text} bind:value={inputText}/>
    {:else if type == "number"}
      <input type="number" class="input-text" placeholder={text} bind:value={inputText}/>
    {/if}
</div>

<style>

.input-text {
  padding: 5px;
  margin-bottom: 20px;
  border-left: none;
  border-top: none;
  border-right: none;
  margin-left: 5px;
  margin-right: 5px;
}

.input-text:focus {
  border-left: none;
  border-top: none;
  border-right: none;
  outline: none;
}

.input-row {
  display: flex;
  flex-direction: row;
}

</style>
