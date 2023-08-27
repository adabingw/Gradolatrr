<script>
// @ts-nocheck

    export let id;
    export let name;

    import CancelOrSave from '../utils/CancelOrSave.svelte';
    import Button from '../utils/Button.svelte';
    import InfoTable from '../utils/InfoTable.svelte';

    import course_info from "../constants/course_info.json";
    import { COURSE_INFO } from "../constants/queries_get";

    import { query } from 'svelte-apollo';
    
    let query_result = query(COURSE_INFO, {
        variables: { id }
    });
    let info;
    let last_info;
    let content;

    function saveChanges() {
        console.log("save changes")
        console.log(info)
    }

    $: {
        console.log($query_result)
        if ($query_result.data != undefined && (last_info == info)) {
            console.log("a fuck")
            info = JSON.parse(JSON.stringify(Object.assign({}, $query_result.data)));
            last_info = JSON.parse(JSON.stringify(info));

            console.log(info);
        }
    }

    $: {
        console.log(id)
        query_result.refetch({ id });
        last_info = info;
    }

    $: {
        console.log(info);
        last_info = undefined;
    }

</script>

<div>
    <p>{name}</p>
    {#if info != undefined}
        <InfoTable cmd="course" bind:info={info.getCourse} />
    {/if}
    <div class="term-op">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <Button text="delete this course" />
    </div>
    <CancelOrSave url={`/`} on:message={saveChanges} />
</div>
