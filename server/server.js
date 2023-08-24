const express = require('express'); 
const express_graphql = require('express-graphql');
const schema = require('./schema.js');

const app = express();

app.use('/graphql', express_graphql({
    graphiql: true
}))



app.listen(5000, () => console.log("server is up"));
// https://github.com/timhall/svelte-apollo
