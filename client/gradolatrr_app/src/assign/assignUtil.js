export function mapData(content_info) {
    if (content_info["type"] == "text") {
        return {
            "content": "", 
            "type": content_info["type"]
        };
    } else if (content_info["type"] == "number") {
        return {
            "content": 0, 
            "type": content_info["type"]
        };
    } else if (content_info["type"] == "multiselect" || content_info["type"] == "singleselect") {
        return {
            "content": [], 
            "type": content_info["type"], 
            "tag_info": content_info["tag_info"]
        };
    } else if (content_info["type"] == "date") {
        return {
            "content": (new Date()).toISOString().split('T')[0],
            "type": content_info["type"]
        };
    } else if (content_info["type"] == "checked") {
        return {
            "content": false,
            "type": content_info["type"]
        };
    }
}
