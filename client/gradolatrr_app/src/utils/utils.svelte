<script context="module">
export function sortOrder(content_array) {
    const sorted = content_array.sort((a, b) => {
        const aVal = a[1]["order"];
        const bVal = b[1]["order"];
        return aVal - bVal;
    });
    return sorted;
}

export function dragstart (ev, key, index) {
    ev.dataTransfer.setData("key", key);
    ev.dataTransfer.setData("index", index);
}

export function dragover (ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
}
</script>
