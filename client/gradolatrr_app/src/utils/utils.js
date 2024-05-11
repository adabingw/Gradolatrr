import { TOKENS } from "../constants/constants";

export function sortOrder(content_array) {
    const sorted = content_array.sort((a, b) => {
        let aVal = a[1]["order"];
        let bVal = b[1]["order"];
        if (aVal == null || aVal == undefined || isNaN(aVal)) aVal = 0;
        if (bVal == null || bVal == undefined || isNaN(bVal)) bVal = 0;
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
    var order2 = content_array[index2][1]["order"];
    
    let orders = [order2];
    let info_arr = JSON.parse(info["data"]);
    info_arr[key]["order"] = order2;
    content_array[index][1]["order"] = order2;
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

    info["data"] = JSON.stringify(info_arr);
    return [info, content_array]
}

export function maxOrder(content_array) {
    if (content_array.length == 0) return 0;
    let max = 0;
    for (const row of content_array) {
        if (row[1]["order"] == undefined) continue;
        max = Math.max(max, row[1]["order"]);
    }
    return max;
}

export function maxOrderContent(content) {
    let max = 0;
    for (let item of content) {
        if (item["order"] != null && item["order"] != undefined && !isNaN(item["order"])) {
            max = Math.max(max, item["order"]);
        }
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
            
            if (token == "") {
                continue;
            }
            if (variableExists(token, variables)) {
                token_arr.push(token);
                token = "";
            } else {
                return {
                    status: false, 
                    message: `${token} doesn't exist`
                };
            }
        } else {
            if (e.match(/^[0-9a-z]+$/)) {
                token += e;
            } else {
                return {
                    status: false,
                    message: `invalid character ${e}`
                };
            }
        }
    }
    if (token != "" && token != undefined) {
        if (!variableExists(token, variables) && !(/^\d+$/.test(token))) {
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

/** Dispatch event on click outside of node */
export function clickOutside(node) {
  
    const handleClick = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click_outside', node)
            )
        }
    }

    document.addEventListener('click', handleClick, true);
  
    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}

export function evalFilter(what, content, value, type){
    let [val1, val2] = value;
    if (!val1 && val1 != 0) return true;
    let result = true;
    switch(type) {
        case 'text': // ['CONTAINS', 'DOES NOT CONTAIN', 'IS', 'IS NOT']
            if (what == 0) {
                result = content.includes(val1);
            } else if (what == 1) {
                result = !content.includes(val1);
            } else if (what == 2) {
                result = content == val1;
            } else if (what == 3) {
                result = content != val1;
            } else if (what == 4) {
                result = content == undefined || content == null || (typeof content == 'string' && content.length == 0);
            } else {
                result = !(content == undefined || content == null || (typeof content == 'string' && content.length == 0))
            }
            break;
        case 'number': // ['IS', 'LESS THAN', 'LESS THAN / EQUAL TO', 'GREATER THAN', 'GREATER THAN / EQUAL TO', 'BETWEEN']
            if (what == 0) {
                result = content == val1;
            } else if (what == 1) {
                result = content < val1;
            } else if (what == 2) {
                result = content <= val1;
            } else if (what == 3) {
                result = content > val1;
            } else if (what == 4) {
                result = content >= val1;
            } else {
                if (!val2 && val2 != 0) result = true;
                else result > val1 && result < val2;
            }
            break;
        case 'date': // ['BEFORE', 'AFTER', 'BETWEEN', 'ON'],
            if (what == 0) {
                result = content < val1;
            } else if (what == 1) {
                result = content > val1;
            } else if (what == 2) {
                if (!val2 && val2 != 0) result = true;
                else result = content > val1 && content < val2;
            } else if (what == 3) {
                result = content == val1;
            }
            break;
        case 'checked': // ['CHECKED', 'UNCHECKED']
            if (what == 0) {
                result = content == true;
            } else if (what == 1) {
                result = content == false;
            }
            break;
        default: // ['HAS', 'DOES NOT HAVE']
            if (val1 != undefined && val1.length > 0) {
                val1 = val1.split(';');
            } else {
                return true;
            }
            if (what == 0) {
                result = false;
                for (const v of val1) {
                    if (content.includes(v)) result = true;
                }
            } else if (what == 1) {
                result = true;
                for (const v of val1) {
                    if (content.includes(v)) result = false;
                }
            }
            break;
    }
    return result;
}

export function filterContent(filters, contents) {
    if (!filters || !(filters.length > 0)) return true;
    let content = contents['data'];
    const [ property, what, value, type ] = filters[0];

    if (!content[property] && !content[property]['content']) return false;

    let result = evalFilter(what, content[property]['content'], value, type);   
    filters.forEach((filter, index) => {
        if (index != 0) {
            const [ property, what, value, type, logic ] = filter;
            let res = evalFilter(what, property, value, type);
            result = logic == 'AND' ? result && res : result || res;
        }
    })
    return result;
}
