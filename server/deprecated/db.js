const Pool = require("pg").Pool

const pool = new Pool ({
    user: "postgres", 
    password: "pswrd", 
    host: "localhost",
    port: 5432, 
    database: "grade"
})

module.exports = pool