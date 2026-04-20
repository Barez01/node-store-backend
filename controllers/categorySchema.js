const {returnRecords, createTable, insertRecord, updateRecord, deleteRecord} = require("../utils/sqlFunctions");
const taskSchema = require("../schema/taskSchema");
const verifyUserToken = require("../utils/verifyUserToken");
const checkRole = require("../utils/checkRole");

const getCategories = async (req, res) => {
    try{
        const accessToken = req.headers.authorization;
        const requesterId = await verifyUserToken(accessToken);

        if(!user.success){
            return res.status(401).json({error: user.error});
        }

        await checkRole(requesterId);

        await createTable(taskSchema);

    const tasks = await returnRecords("categories");
    return res.status(200).json({tasks: tasks != null ? tasks : []});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

const addTask = async (req, res) => {
    try{
        const accessToken = req.headers.authorization;
        const user = await verifyUserToken(accessToken);

        if(!user.success){
            return res.status(401).json({error: user.error});
        }

        const userId = user.id;
        const {title, description} = req.body;

        await createTable(taskSchema);

    const tasks = await insertRecord(
        "tasks", 
        {
            userId: userId,
            title: title,
            description: description,
        },
    );
    return res.status(200).json({message: "Task added"});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

const updateTask = async (req, res) => {
    try{
        const accessToken = req.headers.authorization;
        const user = await verifyUserToken(accessToken);

        if(!user.success){
            return res.status(401).json({error: user.error});
        }

        const {id, title, description} = req.body;

        await createTable(taskSchema);

    const tasks = await updateRecord(
        "tasks", 
        {
            title: title,
            description: description,
        },
        `WHERE id = ?`,
        [id]
    );
    return res.status(200).json({message: "Task updated"});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

const deleteTask = async (req, res) => {
    try{
        const accessToken = req.headers.authorization;
        const user = await verifyUserToken(accessToken);

        if(!user.success){
            return res.status(401).json({error: user.error});
        }

        const {id} = req.body;

        await createTable(taskSchema);

    const tasks = await deleteRecord(
        "tasks",
        `WHERE id = ?`,
        [id]
    );
    return res.status(200).json({message: "Task deleted"});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

module.exports = {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
};