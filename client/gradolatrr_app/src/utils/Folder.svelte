<script>
    // @ts-nocheck
    import { navigate } from 'svelte-navigator';
    import { onDestroy } from 'svelte';

    export let assign_name;
    export let course_id;
    export let course_name;
    export let term_id;
    export let term_name;

    const clickTerm = () => {
        if (course_name == "") { // we are in a term folder
            window.scrollTo(0, 0);
        } else {
            console.log("hi")
            navigate(`/term/${term_id}/${term_name}`);
        }
    }

    const clickCourse = () => {
        if (assign_name == "") { // we are in a term folder
            window.scrollTo(0, 0);
        } else {
            navigate(`/course/${term_id}/${term_name}/${course_id}/${course_name}`);
        }
    }

    const clickAssign = () => {
        window.scrollTo(0, 0);
    }

</script>

<div class="path">
    {#if term_name}
    <span class="path_element" on:click={clickTerm}>{term_name}</span> / 
    {/if}
    {#if course_name}
    <span class="path_element" on:click={clickCourse}>{course_name}</span> /
    {/if}
    {#if assign_name}
    <span class="path_element" on:click={clickAssign}>{assign_name}</span>
    {/if}
</div>

<style>

.path {
    margin-top: 15px;
    font-size: 15px;
}

.path_element {
    margin-left: 3px;
    margin-right: 3px;
    padding-left: 4px;
    padding-right: 4px;
    border-radius: 3px;
}

.path_element:hover {
    cursor: pointer;
    background-color: #e8e5df;
}
</style>
    