<script>
    import { Link } from "svelte-navigator";
    export let type;
    export let name;
    let url = `/${type}`
</script>

<Link to={url}><p class="new">{name}</p></Link>

<style>
.new {
  margin-top: 20px;
  margin-bottom: -18px;
  border-radius: 12px;
  padding: 8px;
}

.new:hover {
    background-color: #D7DBCF;
}    
</style>
