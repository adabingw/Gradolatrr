<script>
    export let text;
</script>

<div class="input-row">
    <input type="text" class="input-text" placeholder={text}/>
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
