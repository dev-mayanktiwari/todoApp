const zod = require("zod");

const User = zod.object({
    username: zod.string().email({message: "Invalid email"}),
    password: zod.string().min(6)
});

const createTodo = zod.object({
    title: zod.string(),
    description: zod.string()
});

const updateTodo = zod.object({
    id: zod.string()
});

module.exports = {
    User,
    createTodo,
    updateTodo
}