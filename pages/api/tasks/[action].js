import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../../config/session";
import db from "../../../db";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const userId = req.session?.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { action, taskId } = req.query;
    console.log("Task ID in API route: ", taskId);

    try {
        switch (action) {
          case "add":
            return await add(req, res, userId);
          case "getAllTasks":
            return await getAllTasks(req, res, userId);
          case "markComplete":
            console.log(taskId)
            return await markComplete(req, res, userId, taskId);
          default:
            return res.status(400).json({ error: "Invalid action" });
        }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  sessionOptions
);

async function add(req, res) {
  const { content, date } = req.body;
  const userId = req.session.user._id

  if (!content || !date) {
    return res.status(400).json({ error: "Content or date not found" });
  }

  try {
    const taskDate = new Date(date)

    if (isNaN(taskDate)) {
        return res.status(400).json({error: 'Invalid date format'})
    }

    const task = await db.task.addTask(userId, content, taskDate);
    return res.status(200).json(task);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function getAllTasks(req, res, userId) {
  try {
    const tasks = await db.task.getAllTasks(userId);
    return res.status(200).json({ tasks });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function markComplete(req, res, userId, taskId) {
  console.log("API taskId: ", taskId)
  if (!taskId) {
    return res.status(400).json({ error: "Task ID not provided" });
  }

  try {
    const taskCompleted = await db.task.markTaskComplete(userId, taskId);
    if (!taskCompleted) return res.status(404).json({ error: "Task not found" });
    return res.status(200).json(taskCompleted);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
