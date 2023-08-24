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

export function drop (ev, key2, index2, content_array, info) {
    ev.preventDefault();
    var key = ev.dataTransfer.getData("key");
    if (key2 == key) return;

    var index = ev.dataTransfer.getData("index");
    var order = content_array[index][1]["order"];
    var order2 = content_array[index2][1]["order"];
    order = order2 + 1;
    
    let orders = [order];
    for (const [i, value] of Object.entries(info)) {
        if (i == "metadata" || i == "content_info") continue;
        if (i == key) continue;
        const o = info[i]["order"]
        if (orders.includes(o)) {
            orders.push(o + 1);
            info[i]["order"]++;
        } else {
            orders.push(o);
        }
    }

    return [order, info, content_array]
}

export function maxOrder(content_array) {
    let max = content_array[0][1]["order"];
    for (const row of content_array) {
        if (row[1]["order"] == undefined) continue;
        max = Math.max(max, row[1]["order"]);
    }
    return max;
}

</script>
