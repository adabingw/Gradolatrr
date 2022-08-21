const express = require("express")
const cors = require("cors")
const pool = require("./db")

const app = express()

app.use(cors())
app.use(express.json())

// test post
app.post("/grade", async (req, res) => {
    try {
      console.log(req.body)
      const { description } = req.body;
      const newTodo = await pool.query(
        "INSERT INTO test (description) VALUES($1) RETURNING *",
        [description]
      );
  
      res.json(newTodo.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
});

// test get
app.get("/todos", async (req, res) => {
    try {
      const allTodos = await pool.query("SELECT * FROM todo");
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
});

//get a todo

app.get("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
        id
      ]);
  
      res.json(todo.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
});
  
  //update a todo
  
app.put("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;
      const updateTodo = await pool.query(
        "UPDATE todo SET description = $1 WHERE todo_id = $2",
        [description, id]
      );
  
      res.json("Todo was updated!");
    } catch (err) {
      console.error(err.message);
    }
});
  
  //delete a todo
  
app.delete("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
        id
      ]);
      res.json("Todo was deleted!");
    } catch (err) {
      console.log(err.message);
    }
});


// create user
app.post("/user", async (req, res) => {
  try {
    const user = await pool.query(
      "INSERT INTO user_info (username, name, password) VALUES($1, $2, $3) RETURNING *",
      [req.body.username, req.body.name, req.body.password]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get user
app.get("/user", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM user_info");
    console.log(allUsers)
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get all grades
// insert grade (unit/course/assignment)
// change grade (assignment/unit final/final)
// remove grade (course/unit/assignment)

app.listen(5000, () => {
    console.log("server started on port 5000!")
})