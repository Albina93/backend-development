const router = require("express").Router();
const Project = require("../../models/Project");
const { authMiddleware } = require("../../utils/auth");

router.use(authMiddleware);

// POST
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    // create project
    const newProject = await Project.create({
      name,
      description,
      user: req.user._id,
    });
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error creating project" });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user._id,
    });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching projects" });
  }
});

// GET /:id
router.get("/:id", async (req, res) => {
  try {
    // find the project by id
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).json({ message: "No project was found" });
    }
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching project" });
  }
});

// PUT /:id
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    const updated = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, description },
      { new: true, runValidators: true },
    );
    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error updating project" });
  }
});

// DELETE /:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting project" });
  }
});

module.exports = router;
