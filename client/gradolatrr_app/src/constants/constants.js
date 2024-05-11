let TYPES = {
    "text": 'fa-solid fa-align-justify', 
    "number": 'fa-solid fa-hashtag', 
    "multiselect": 'fa-solid fa-list-ul', 
    "singleselect": 'fa-regular fa-caret-square-down', 
    "date": 'fa-regular fa-calendar',
    "checked": 'fa-regular fa-square-check'
};
let DROPDOWN = [
    ["text", '\u{f031}'], 
    ["number", '\u{23}'], 
    ["multiselect", '\u{f03a}'], 
    ["singleselect", '\u{f150}'], 
    ["date", '\u{f133}'],
    ["checked", '\u{f058}']
]
let TERM_TYPES = {
    "text": 'fa-solid fa-align-justify', 
    "number": 'fa-solid fa-hashtag', 
    "date": 'fa-regular fa-calendar',
};
let DEFAULT_GRADING = "mark / #";
let WEIGHTED_GRADING = "mark * weight";
let TOKENS = ['+', '-', '/', '*', '[', ']', '(', ')', '#']

let CONDITION = [
    ['CONTAINS', 'DOES NOT CONTAIN', 'IS', 'IS NOT'],
    ['IS', 'LESS THAN', 'LESS THAN / EQUAL TO', 'GREATER THAN', 'GREATER THAN / EQUAL TO', 'BETWEEN'],
    ['HAS', 'DOES NOT HAVE'],
    ['BEFORE', 'AFTER', 'BETWEEN', 'ON'],
    ['CHECKED', 'UNCHECKED']

]
let LOGIC = ['AND', 'OR']
let MENUITEMS1 = [
    {
        'name': 'trash',
        'displayText': "Trash",
        'class': 'fa-solid fa-trash-can fa-ms'
    }, 
    {
        'name': 'change_type', 
        'onClick': undefined,
        'displayText': 'Change type', 
        'class': 'fa-solid fa-sliders fa-ms', 
        'subClasses': [{
            'name': 'text', 
            'displayText': 'Text', 
            'class': '', 
        }, {
            'name': 'number', 
            'displayText': 'Number', 
            'class': ''
        }, {
            'name': 'date', 
            'displayText': 'Date', 
            'class': ''
        }
        ]
    }
]
let MENUITEMS2 = [
    {
        'name': 'trash',
        'displayText': "Trash",
        'class': 'fa-solid fa-trash-can fa-ms',
        'disable': false
    }, {
        'name': 'edit',
        'displayText': "Edit",
        'class': 'fa-solid fa-pen fa-ms',
        'disable': false
    }, {
        'name': 'duplicate',
        'displayText': "Copy",
        'class': 'fa-solid fa-copy fa-ms',
        'disable': false
    }
]
let MENUITEMS3 = [
    {
        'name': 'trash',
        'displayText': "Trash",
        'class': 'fa-solid fa-trash-can fa-ms'
    }, {
        'name': 'duplicate',
        'displayText': "Copy",
        'class': 'fa-solid fa-copy fa-ms'
    }
]
let MENUITEMS4 = [
    {
        'name': 'trash',
        'displayText': "Trash",
        'class': 'fa-solid fa-trash-can fa-ms'
    }, {
        'name': 'edit',
        'displayText': "Edit",
        'class': 'fa-solid fa-pen fa-ms'
    }
]
let MENUITEMS5 = [
    {
        'name': 'custom',
        'displayText': "Custom",
        'class': '',
        'disable': false
    }, {
        'name': 'alpha_asc',
        'displayText': "Alphabetical ascending",
        'class': '',
        'disable': false
    }, {
        'name': 'alpha_desc',
        'displayText': "Alphabetical descending",
        'class': '',
        'disable': false
    }, {
        'name': 'grade_asc',
        'displayText': "Grades ascending",
        'class': '',
        'disable': false
    }, {
        'name': 'grade_desc',
        'displayText': "Grades descending",
        'class': '',
        'disable': false
    }
]
let MENUITEMS6 = [
    {
        'name': 'asc',
        'displayText': "Ascending",
        'class': '',
        'disable': false
    }, {
        'name': 'desc',
        'displayText': "Descending",
        'class': '',
        'disable': false
    }
]

export { TYPES, TERM_TYPES, DEFAULT_GRADING, WEIGHTED_GRADING, TOKENS, CONDITION, LOGIC, DROPDOWN,
    MENUITEMS1, MENUITEMS2, MENUITEMS3, MENUITEMS4, MENUITEMS5, MENUITEMS6
}
