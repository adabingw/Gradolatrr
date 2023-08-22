<script>
    export let properties;

    import Button from "./Button.svelte";
</script>

<div>
    <div class="tag-block">
        {#each properties as tag}
            <div class="tag">
                {tag}
            </div>
        {/each}
    </div>
    <Button text="+ add tag" />
</div>

<style>

</style>
