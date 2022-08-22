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

// update user_info
app.put("/user_name", async (req, res) => {
  try {
    const id = req.body.id;
    const type = req.body.type;
    const name = req.body.name2;
    const user = req.body.username2; 
    const pswrd = req.body.newPassword;
    console.log(req.body)
    if (type == "name") {
        console.log("NAME")
        const updateName = await pool.query(
          "UPDATE user_info SET name = $1 WHERE id = $2",
          [name, id]
        );
    } else if (type == "username") {
        console.log("USERNAME")
        const updateName = await pool.query(
          "UPDATE user_info SET username = $1 WHERE id = $2",
          [user, id]
        );
    } else if (type == "password") {
        console.log("PASSWORD")
        const updateName = await pool.query(
          "UPDATE user_info SET password = $1 WHERE id = $2",
          [pswrd, id]
        );
    }

    res.json("Name was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//=================================================================================================================================================

// get courses
app.get("/grade_course/:id/:type", async (req, res) => {
  try {
    console.log("PARAMS: ", req.params)
    const user_id = req.params.id;
    console.log("user_id: ", user_id)
    const type = req.params.type;
    console.log("type: ", type) 
    if (type == "all") {
        const allTodos = await pool.query("SELECT course_id, course_name, course_mark, course_credits, tag, tag_weights FROM course WHERE user_id = $1", [user_id]);
        res.json(allTodos.rows);
    } else if (type == "one") {
        const course_id = req.body.course_id;
        const allTodos = await pool.query("SELECT course_name, course_mark, course_credits, tag, tag_weights FROM course WHERE (user_id = $1 AND course_id = $2)", 
          [user_id, course_id]);
        res.json(allTodos.rows);
    }
  } catch (err) {
    console.error(err.message);
  }
});

// insert a course 
app.post("/grade_course", async (req, res) => {
  try {
    console.log(req.body)
    const course_name = req.body.courseName; 
    const course_creds = req.body.courseCreds; 
    const tag = req.body.tag;
    const tag_weights = req.body.tag_weights;
    const id = req.body.id;
    const newTodo = await pool.query(
      "INSERT INTO course (course_name, course_credits, user_id, tag, tag_weights) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [course_name, course_creds, id, tag, tag_weights]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update course
app.put("/grade_course", async (req, res) => {
  try {
    
  } catch (err) {
    console.error(err.message);
  }
});

// delete a course

//=================================================================================================================================================

// get units
app.get("/grade_unit", async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const type = req.body.type; 
    if (type == "all") {
        const allTodos = await pool.query("SELECT unit_id, course_id, unit_weight, unit_final, unit_mark FROM course WHERE user_id = $1", [user_id]);
        res.json(allTodos.rows);
    } else if (type == "one") {
        const course_id = req.body.course_id;
        const allTodos = await pool.query("SELECT unit_id, course_id, unit_weight, unit_final, unit_mark FROM course WHERE (user_id = $1 AND course_id = $2)", 
          [user_id, course_id]);
        res.json(allTodos.rows);
    } else if (type == "course") {
        const unit_id = req.body.unit_id;
        const allTodos = await pool.query("SELECT unit_id, course_id, unit_weight, unit_final, unit_mark FROM course WHERE (user_id = $1 AND course_id = $2 AND unit_id = $3)", 
          [user_id, course_id, unit_id]);
        res.json(allTodos.rows);
    }
  } catch (err) {
    console.error(err.message);
  }
});

// insert a unit 
app.post("/grade_unit", async (req, res) => {
  try {
    console.log(req.body)
    const unit_name = req.body.unitName; 
    const unit_weight = req.body.unitWeight; 
    const id = req.body.id;
    const course_id = req.body.course_id;
    const newTodo = await pool.query(
      "INSERT INTO unit (unit_name, unit_weight, course_id, user_id) VALUES($1, $2, $3, $4) RETURNING *",
      [unit_name, unit_weight, course_id, id]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update a unit
// delete a unit

//=================================================================================================================================================

// insert a assignment 
app.post("/grade_assign", async (req, res) => {
  try {
    console.log(req.body)
    const assign_name = req.body.assignName; 
    const id = req.body.id;
    const course_id = req.body.course_id;
    const unit_id = req.body.unit_id;
    const newTodo = await pool.query(
      "INSERT INTO assignment (assign_name, course_id, unit_id, user_id) VALUES($1, $2, $3, $4) RETURNING *",
      [assign_name, course_id, unit_id, id]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get assignments
// update an assignment
// delete an assignment

//=================================================================================================================================================

// insert a tag
// update a tag
// delete a tag

app.listen(5000, () => {
    console.log("server started on port 5000!")
})