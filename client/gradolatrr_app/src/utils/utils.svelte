<script context="module">
import { TOKENS } from "../constants/constants";

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
    console.log(content_array)
    order = order2 + 1;
    
    let orders = [order];
    let info_arr = JSON.parse(info["data"]);
    info_arr[key]["order"] = order;
    content_array[index][1]["order"] = order;
    for (const [i, value] of Object.entries(info_arr)) {
        const o = info_arr[i]["order"]
        if (i == key) continue;
        if (orders.includes(o)) {
            orders.push(o + 1);
            info_arr[i]["order"]++;
        } else {
            orders.push(o);
        }
    }

    for (let i = 0; i < content_array.length; i++) {
        content_array[i][1]["order"] = info_arr[content_array[i][0]]["order"];
    }

    console.log(info_arr);
    info["data"] = JSON.stringify(info_arr);

    return [info, content_array]
}

export function maxOrder(content_array) {
    let max = content_array[0][1]["order"];
    for (const row of content_array) {
        if (row[1]["order"] == undefined) continue;
        max = Math.max(max, row[1]["order"]);
    }
    return max;
}

export function variableExists(variable, variables) {
    for (let k of Object.keys(variables)) {
        if (variable == k && variables[k]["type"] == "number") {
            return true;
        }
    }
    return false;
}

export function tokenize(eq, variables) {
    eq = eq.replace(/\s/g, "");

    let token = "";
    let token_arr = [];

    for (let i = 0; i < eq.length; i++) {
        let e = eq[i];
        if (TOKENS.includes(e)) {
            if (e != ')' && e != '#' && i == eq.length - 1) {
                return {
                    status: false, 
                    message: `end of character token error`
                }
            }
            if ((token == "sum" && e == "(") || e == '#') {
                console.log("sum");
            } else {
                if (token == "") {
                    continue;
                }
                if (variableExists(token, variables)) {
                    console.log(`${token} exists`);
                    token_arr.push(token);
                    token = "";
                } else if (/^\d+$/.test(token)) {
                    console.log("is a num ", token);
                } else {
                    console.log(`${token} doesn't exist`);
                    return {
                        status: false, 
                        message: `${token} doesn't exist`
                    };
                }
            }
        } else {
            if (e.match(/^[0-9a-z]+$/)) {
                token += e;
            } else {
                console.log(`invalid character ${e}`);
                return {
                    status: false,
                    message: `invalid character ${e}`
                };
            }
        }
    }
    if (token != "" && token != undefined) {
        console.log(token);
        if (!variableExists(token, variables) && !(/^\d+$/.test(token))) {
            console.log(`${token} doesn't exist`);
            return {
                status: false, 
                message: `${token} doesn't exist`
            };
        }
    }
    return {
        status: true, 
        message: token_arr
    };
}

</script>
