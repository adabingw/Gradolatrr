<script>
// @ts-nocheck

  	import { Link } from "svelte-navigator";
    export let id;
    export let type;
    export let name;
    export let term_id;
    export let term_name;
    let url = `/${type}/${term_id}/${term_name}/${id}/${name}`

</script>

{#if type == "course"}
  <Link to={url}><p class={type}>{name}</p></Link>
{:else if type == "term"}
  <p class={type}>{name}</p>
{/if}

<style>
.term {
  height: 2px;
  margin-top: 8px;
  margin-bottom: 25px;
  font-weight: bold;
}

.term:hover {
  cursor: pointer;
}

.course {
  margin-left: 8px;
  margin-top: 20px;
  height: 2px;
}

.course:hover {
  cursor: pointer;
}
</style>
