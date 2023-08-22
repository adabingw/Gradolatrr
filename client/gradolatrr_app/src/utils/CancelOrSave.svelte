<script>
    
    import { Link } from "svelte-navigator";
</script>

<div style=" display:flex; flex-direction:row; ">
    <Link to={`/`}><p class="cancel-and-save">cancel</p></Link>
    <p class="cancel-and-save">save</p>
</div>
