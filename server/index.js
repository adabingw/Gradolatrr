const express = require("express")
const cors = require("cors")
const pool = require("./db")

const app = express()

app.use(cors())
app.use(express.json())

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
app.get("/grade_course/:id/:course_id/:type", async (req, res) => {
  try {
    const user_id = req.params.id;
    const type = req.params.type;
    if (type == "all") {
        const allTodos = await pool.query("SELECT course_id, course_name, course_mark, course_credits, tag, tag_weights FROM course WHERE user_id = $1", [user_id]);
        res.json(allTodos.rows);
    } else if (type == "one") {
        const course_id = req.params.course_id;
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
    const course_creds = req.body.courseCred; 
    const tag = req.body.newTagList;
    const tag_weights = req.body.newTagWList;
    const id = req.body.id;
    const newCourse = await pool.query(
      "INSERT INTO course (course_name, course_credits, user_id, tag, tag_weights) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [course_name, course_creds, id, tag, tag_weights]
    );
    res.json(newCourse.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update course
app.put("/grade_course", async (req, res) => {
  try {
    const id = req.body.id;
    const type = req.body.type; 
    const course_id = req.body.course_id
    console.log(req.body)
    if (type == "mark") {
      const mark = req.body.mark 
      const updateTag = await pool.query(
        "UPDATE course SET course_mark = $1 WHERE (user_id = $2 AND course_id = $3)",
        [mark, id, course_id]
      );
    } else {
      const name = req.body.courseName 
      const credits = req.body.courseCred 
      const tags = req.body.newTagList 
      const weights = req.body.newTagWList
      const updateTag = await pool.query(
        "UPDATE course SET tag = $1 WHERE (user_id = $2 AND course_id = $3)",
        [tags, id, course_id]
      );
      const updateWeight = await pool.query(
        "UPDATE course SET tag_weights = $1 WHERE (user_id = $2 AND course_id = $3)",
        [weights, id, course_id]
      );
      const updateName = await pool.query(
        "UPDATE course SET course_name = $1 WHERE (user_id = $2 AND course_id = $3)",
        [name, id, course_id]
      );
      const updateCreds = await pool.query(
        "UPDATE course SET course_credits = $1 WHERE (user_id = $2 AND course_id = $3)",
        [credits, id, course_id]
      );
    }
    res.json("Course was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a course
app.delete("/grade_course/:id/:course_id", async (req, res) => {
  try {
    const id = req.params.id; 
    const course_id = req.params.course_id;
    const deleteCourse = await pool.query("DELETE FROM course WHERE (user_id = $1 AND course_id = $2)", [
      id, course_id
    ]);
    res.json("Course was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

//=================================================================================================================================================

// get units
app.get("/grade_unit/:id/:type/:unit_id/:course_id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const type = req.params.type; 
    if (type == "all") {
        const allTodos = await pool.query("SELECT unit_name, mark_weighted, unit_id, course_id, unit_weight, unit_final, unit_mark FROM unit WHERE user_id = $1", [user_id]);
        res.json(allTodos.rows);
    } else if (type == "course") {
        const course_id = req.params.course_id;
        const allTodos = await pool.query("SELECT unit_name, mark_weighted, unit_id, course_id, unit_weight, unit_final, unit_mark FROM unit WHERE (user_id = $1 AND course_id = $2)", 
          [user_id, course_id]);
        res.json(allTodos.rows);
    } else if (type == "one") {
        const unit_id = req.params.unit_id;
        const allTodos = await pool.query("SELECT unit_name, mark_weighted, unit_id, course_id, unit_weight, unit_final, unit_mark FROM unit WHERE (user_id = $1 AND course_id = $2 AND unit_id = $3)", 
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
    const unit_name = req.body.uName; 
    const unit_weight = req.body.uW; 
    const id = req.body.id;
    const course_id = req.body.course_id;
    const course_name = req.body.course_name;
    const newTodo = await pool.query(
      "INSERT INTO unit (unit_name, unit_weight, course_id, user_id, course_name) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [unit_name, unit_weight, course_id, id, course_name]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update a unit
app.put("/grade_unit", async (req, res) => {
  try {
    const id = req.body.id;
    const type = req.body.type;
    console.log(req.body)
    const course_id = req.body.course_id
    if (type == "all") {
      const unit_id = req.body.uId
      const name = req.body.uName
      const weight = req.body.uW
      const updateName = await pool.query(
        "UPDATE unit SET unit_name = $1 WHERE (user_id = $2 AND unit_id = $3 AND course_id = $4)",
        [name, id, unit_id, course_id]
      );
      const updateWeight = await pool.query(
        "UPDATE unit SET unit_weight = $1 WHERE (user_id = $2 AND unit_id = $3 AND course_id = $4)",
        [weight, id, unit_id, course_id]
      );
    } else if (type == "course_name") {
      const course_name = req.body.courseName
      const updateWeight = await pool.query(
        "UPDATE unit SET course_name = $1 WHERE (user_id = $2 AND course_id = $3)",
        [course_name, id, course_id]
      );
    } else if (type == "mark") {
      const mark = req.body.avg 
      const mark_w = req.body.weightedAvg 
      const unit_id = req.body.unit_id
      console.log(mark, mark_w, unit_id)
      const updateMark = await pool.query(
        "UPDATE unit SET unit_mark = $1 WHERE (user_id = $2 AND course_id = $3 AND unit_id = $4)", 
          [mark, id, course_id, unit_id]
      )
      const updateMarkWeighted = await pool.query(
        "UPDATE unit SET mark_weighted = $1 WHERE (user_id = $2 AND course_id = $3 AND unit_id = $4)", 
          [mark_w, id, course_id, unit_id]
      )
    }
    res.json("Unit was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a unit
app.delete("/grade_unit/:id/:course_id/:unit_id", async (req, res) => {
  try {
    const id = req.params.id; 
    const course_id = req.params.course_id;
    const unit_id = req.params.unit_id;
    const deleteUnit = await pool.query("DELETE FROM unit WHERE (user_id = $1 AND course_id = $2 AND unit_id = $3)", 
      [id, course_id, unit_id]
    );
    res.json("Unit was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

//=================================================================================================================================================

// insert a assignment 
app.post("/grade_assign", async (req, res) => {
  try {
    console.log(req.body)
    const assign_name = req.body.assignName; 
    const assign_mark = req.body.assignMark;
    const tag = req.body.tag;
    const id = req.body.id;
    const course_id = req.body.course_id;
    const course_name = req.body.course_name;
    const unit_id = req.body.unit_id;
    const unit_name = req.body.unit_name;

    const newTodo = await pool.query(
      "INSERT INTO assignment (assign_name, course_id, unit_id, user_id, unit_name, course_name, assign_mark, tag) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [assign_name, course_id, unit_id, id, unit_name, course_name, assign_mark, tag]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get assignments
app.get("/grade_assign/:id/:type/:unit_id/:course_id/:assign_id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const type = req.params.type; 
    if (type == "all") {
        console.log("all!")
        const allAssigns = await pool.query(
          "SELECT course_id, unit_id, user_id, assign_id, course_name, assign_name, tag, unit_name, assign_mark FROM assignment WHERE user_id = $1", 
          [user_id]);
        res.json(allAssigns.rows);
        console.log(allAssigns.rows)
    } else if (type == "one") {
        const course_id = req.params.course_id;
        const unit_id = req.params.unit_id;
        const oneAssign = await pool.query(
          "SELECT  course_id, unit_id, user_id, assign_id, course_name, assign_name, tag, unit_name, assign_mark FROM assignment WHERE (user_id = $1 AND course_id = $2 AND unit_id = $3 and assign_id = $4)", 
          [user_id, course_id, unit_id, course_id]);
        res.json(oneAssign.rows);
    } else if (type == "course") {
      const course_id = req.params.course_id;
        const allTodos = await pool.query(
          "SELECT  course_id, unit_id, user_id, assign_id, course_name, assign_name, tag, unit_name, assign_mark FROM assignment WHERE (user_id = $1 AND course_id = $2)", 
          [user_id, course_id]);
        res.json(allTodos.rows);
    } else if (type == "unit") {
      const course_id = req.params.course_id;
      const unit_id = req.params.unit_id;
      const allTodos = await pool.query(
        "SELECT  course_id, unit_id, user_id, assign_id, course_name, assign_name, tag, unit_name, assign_mark FROM assignment WHERE (user_id = $1 AND course_id = $2 AND unit_id = $3)", 
        [user_id, course_id, unit_id]);
      res.json(allTodos.rows);
    }
  } catch (err) {
    console.error(err.message);
  }
});

// update an assignment
app.put("/grade_assign", async (req, res) => {
  try {
    const id = req.body.id;
    const course_id = req.body.course_id
    const type = req.body.type 
    console.log(req.body)
    if (type == "course_name") {
      const course_name = req.body.courseName
      const updateAssignment = await pool.query(
        "UPDATE assignment SET course_name = $1 WHERE (user_id = $2 AND course_id = $3)",
        [course_name, id, course_id]
      );
    } else if (type == "unit_name") {
      const unit_name = req.body.uName
      const unit_id = req.body.uId 
      console.log(id, course_id, type, unit_name, unit_id)
      const updateAssignment = await pool.query(
        "UPDATE assignment SET unit_name = $1 WHERE (user_id = $2 AND course_id = $3 AND unit_id = $4)",
        [unit_name, id, course_id, unit_id]
      );
    } else if (type == "all") {
      const unit_id = req.body.unit_id 
      const assign_id = req.body.assign_id 
      const name = req.body.name 
      const mark = req.body.mark 
      const tag = req.body.tag;
      const updateName = await pool.query(
        "UPDATE assignment SET assign_name = $1 WHERE (user_id = $2 AND course_id = $3 AND unit_id = $4 AND assign_id = $5)",
        [name, id, course_id, unit_id, assign_id]
      );
      const updateMark = await pool.query(
        "UPDATE assignment SET assign_mark = $1 WHERE (user_id = $2 AND course_id = $3 AND unit_id = $4 AND assign_id = $5)",
        [mark, id, course_id, unit_id, assign_id]
      );
      const updateTag = await pool.query(
        "UPDATE assignment SET tag = $1 WHERE (user_id = $2 AND course_id = $3 AND unit_id = $4 AND assign_id = $5)",
        [tag, id, course_id, unit_id, assign_id]
      );
    }
    res.json("Assignment was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

// delete an assignment
app.delete("/grade_assign/:id/:course_id/:unit_id/:assign_id", async (req, res) => {
  try {
    const id = req.params.id; 
    const course_id = req.params.course_id;
    const unit_id = req.params.unit_id 
    const assign_id = req.params.assign_id 
    const deleteAssignment = await pool.query("DELETE FROM assignment WHERE (user_id = $1 AND course_id = $2 AND unit_id = $3 AND assign_id = $4)", 
    [id, course_id, unit_id, assign_id]);
    res.json("Assignment was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

//=================================================================================================================================================

// get tags 
app.get("/course_tag/:id/:type/:course_id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const type = req.params.type; 
    if (type == "all") {
        const allTags = await pool.query("SELECT tags and tagweights FROM course WHERE user_id = $1", [user_id]);
        res.json(allTodos.rows);
    } else if (type == "one") {
        const course_id = req.params.course_id;
        const oneTag = await pool.query("SELECT tags and tagweights FROM course WHERE (user_id = $1 AND course_id = $2)", 
          [user_id, course_id]);
        res.json(allTodos.rows);
    }
  } catch (err) {
    console.error(err.message);
  }
});

// update a tag
app.put("/course_tag", async (req, res) => {
  try {
    const id = req.body.id;
    const course_id = req.body.course_id
    const tag = req.body.tag;
    const weight = req.body.weight
    console.log(req.body)
    const updateTag = await pool.query(
      "UPDATE course SET tag = $1 WHERE (user_id = $2 AND course_id = $3)",
      [tag, id, course_id]
    );
    const updateWeight = await pool.query(
      "UPDATE course SET tag_weights = $1 WHERE (user_id = $2 AND course_id = $3)",
      [weight, id, course_id]
    );
    res.json("Tag was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a tag

app.listen(5000, () => {
    console.log("server started on port 5000!")
})