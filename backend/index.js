const express = require("express");
const jwt = require("jsonwebtoken")
const { User, createTodo } = require("../type");
const UserMiddleware = require("../middleware/UserMiddleware");
const { userModel, todoModel } = require("../database/db");
const { JWT_SECRET } = require("../config");
const { use } = require("../../db-auth-project/routes/UserRoutes");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const userInfo = req.body;
    const parsedUserInfo = User.safeParse(userInfo);
    if (!parsedUserInfo.success) {
      res.status(411).json({
        error: "Invalid input.",
      });
      return;
    }
    const newUser = await userModel.create({
        username : parsedUserInfo.username,
        password : parsedUserInfo.password
    })
    res.json({
        msg: "User created successfully!!"
    })
  } catch (error) {
    console.log("Error in creating user: ", error);
    res.status(500).json({
      error: "Bad network gatewway",
    });
  }
});

app.post("/signin", async (req,res) => {
    try {
        const {username, password} = req.body;
        const user = await userModel.findOne({
            username,
            password
        });
        if (user) {
            const token = jwt.sign({
                username: username
            }, JWT_SECRET);
            res.json({token});
        }
        else {
            res.status(401).json({
                error: "Wrong email and password"
            });
        }
    } catch (error) {
        console.log("Error in sigin: ", error);
        res.status(500).json({
            error: "Bad network gateway"
        });
    }
})

app.post("/todo", UserMiddleware, async(req, res)=>{
    try {
        const createPayload = req.body;
        const parsedPayload = createTodo.safeParse(createPayload);
        if (!parsedPayload.success) {
            res.status(411).json({
                error: "Invalid todo format."
            });
            return;
        }
        const newtodo = await todoModel.create({
            title: parsedPayload.title,
            description: parsedPayload.description,
            completed: false
        });
    
        res.json({
            msg: "Todo created succesfully",
            todo: newtodo
        });     
    } catch (error) {
        console.log("Error in adding todo: ", error);
        res.status(500).json({
            error: "Bad server gateway"
        });
    }
})

app.get("/todo", UserMiddleware, async (req,res) => {
    try {
        const user = await userModel.findOne({
            username : req.username
        }).populate("todo");
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch(error) {
        console.log("Error in fetching todo: ",error);
        res.status(500).json({
            error: "Bad server gateway"
        });
    }
})

app.put("/completed/:id", UserMiddleware, async (req,res)=> {
    try {
        const todoId = req.params.id;
        const updateTodo = await userModel.findOneAndUpdate(
            {username: req.username, "todo._id": todoId},
            {$set: {"todo.$.completed": true}}
        );
        if (!updateTodo) {
            return res.status(404).json({
                error: "User not found or todo not found"
            })
        }
        res.json({
            msg: "Todo mark as completed"
        });
    } catch (error) {
        console.log("Error in marking todo as completed", error);
        res.status(500).json({
            error: "Bad server gateway"
        });
    }
})
