<script>
// @ts-nocheck

import { tooltip } from '@svelte-plugins/tooltips';

export let icon;
export let text;
export let position;
export let click;

export let className;
export let id;
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<i class={`${icon} ${className ? className : ''}`} id={`${id ? id : ''}`} 
    use:tooltip={{
        content: `${text}`,
        style: { backgroundColor: '#515151', color: '#ffffff', padding: '5px 5px 5px 5px' },
        position: `${position}`,
        animation: 'slide',
        arrow: false
    }}
    on:click={(e) => {
        // e.stopPropagation(); 
        if (click) {
            click(e);
        }
    }}
></i>

<style>
#navbar_show {
    position: fixed;
    left: 15px;
    top: 15px;
    display: none;
}

.tool_item {
    margin-left: 3px;
    width: 100%;
    height: 15px;
}

.action {
    margin-left: 15px;
    padding: 5px;
}

.outline-none {
    border: 0px solid #b1b1b1;
    padding: 5px;
    border-radius: 8px;
}

.outline-show {
    border: 1px solid #b1b1b1;
    border-radius: 8px;
}

.fa-exclamation {
    margin-left: 15px;
}
</style>
