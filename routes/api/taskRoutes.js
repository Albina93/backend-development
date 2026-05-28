const router = require("express").Router({ mergeParams: true });
const Task = require("../../models/Task");
const Project = require("../../models/Project");
const { authMiddleware } = require("../../utils/auth");

router.use(authMiddleware);

// POST /api/projects/:projectId/tasks
router.post("/", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status } = req.body;
    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).json({ message: "No project was found" });
    }
    // create task
    const newTask = await Task.create({
      title,
      description,
      status,
      project: projectId,
    });
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error creating task" });
  }
});

// GET /api/projects/:projectId/tasks
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).json({ message: "No project was found" });
    }
    const tasks = await Task.find({ project: projectId });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching task" });
  }
});

// PUT /api/tasks/:taskId
router.put("/:taskId", async (req, res) => {
  try {
    // find the task by req.params.taskId
    // if (!task) → 404
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    // find parent project: Project.findOne({ _id: task.project, user: req.user._id })
    // if (!project) → 403  (user doesn't own the parent project)

    const project = await Project.findOne({
      _id: task.project,
      user: req.user._id,
    });
    if (!project) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify the task" });
    }

    // allowlist { title, description, status } from req.body
    const { title, description, status } = req.body;
    // Task.findByIdAndUpdate(req.params.taskId, updates, { new: true, runValidators: true })
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description, status },
      { new: true, runValidators: true },
    );
    // respond 200 with updated task
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error updating task" });
  }
});

// DELETE /api/tasks/:taskId
router.delete("/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const project = await Project.findOne({
      _id: task.project,
      user: req.user._id,
    });
    if (!project) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete the task" });
    }
    const deleted = await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting task" });
  }
});
module.exports = router;
