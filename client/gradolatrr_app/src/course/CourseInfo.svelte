<script>
// @ts-nocheck

    export let id;
    export let name;

    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import Button from '../utils/Button.svelte';
    import InfoTable from '../utils/InfoTable.svelte';

    import course_info from "../constants/course_info.json";
    
    // get info from id

    let info = course_info;

    function saveChanges() {
        console.log("save changes")
        console.log(info)
    }

</script>

<div>
    <p>{name}</p>
    {#if info != undefined}
        <InfoTable cmd="course" bind:info={info} />
    {/if}
    <div class="term-op">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <Button text="delete this course" />
    </div>
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
