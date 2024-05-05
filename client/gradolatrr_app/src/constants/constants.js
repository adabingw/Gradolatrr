let TYPES = [
    ["text", 'fa-solid fa-align-justify'], 
    ["number", 'fa-solid fa-hashtag'], 
    ["multiselect", 'fa-solid fa-list-ul'], 
    ["singleselect", 'fa-regular fa-caret-square-down'], 
    ["date", 'fa-regular fa-calendar'],
    ["checked", 'fa-regular fa-square-check']
];
let DROPDOWN = [
    ["text", '\u{f031}'], 
    ["number", '\u{23}'], 
    ["multiselect", '\u{f03a}'], 
    ["singleselect", '\u{f150}'], 
    ["date", '\u{f133}'],
    ["checked", '\u{f058}']
]
let TERM_TYPES = [
    ["text", 'fa-solid fa-align-justify'], 
    ["number", 'fa-solid fa-hashtag'], 
    ["date", 'fa-regular fa-calendar']
];
let DEFAULT_GRADING = "mark / #";
let WEIGHTED_GRADING = "mark * weight";
let TOKENS = ['+', '-', '/', '*', '[', ']', '(', ')', '#']

let CONDITION = [
    ['CONTAINS', 
    'DOES NOT CONTAIN', 
    'IS', 
    'IS NOT'], 
    // 'STARTS WITH', 
    // 'ENDS WITH', 
    // 'IS EMPTY', 
    // 'IS NOT EMPTY'
    ['IS', 'LESS THAN', 'LESS THAN / EQUAL TO', 'GREATER THAN', 'GREATER THAN / EQUAL TO', 'BETWEEN'],
    ['HAS PROPERTY'],
    ['BEFORE', 'AFTER', 'BETWEEN', 'ON'],
    ['CHECKED', 'UNCHECKED']

]
let LOGIC = ['AND', 'OR']

export { TYPES, TERM_TYPES, DEFAULT_GRADING, WEIGHTED_GRADING, TOKENS, CONDITION, LOGIC, DROPDOWN }
