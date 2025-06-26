const express = require("express");
const fs = require("fs");
const path = require("path");
const { getProjectStructure } = require("../utils/getProjectStructure");

const router = express.Router();

// Only allow folders from this directory
const PROJECTS_ROOT = path.resolve(__dirname, "../projects");

// GET /api/projects - list available project names
router.get("/", (req, res) => {
  try {
    const folders = fs
      .readdirSync(PROJECTS_ROOT)
      .filter((entry) =>
        fs.statSync(path.join(PROJECTS_ROOT, entry)).isDirectory()
      );
    res.json(folders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to list projects" });
  }
});

// GET /api/projects/:name - load project structure
router.get("/:name", (req, res) => {
  const projectName = req.params.name.replace(/[^a-zA-Z0-9_-]/g, ""); // sanitize
  const folderPath = path.join(PROJECTS_ROOT, projectName);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ error: "Project not found" });
  }

  try {
    const structure = getProjectStructure(folderPath);
    res.json(structure);
  } catch (err) {
    console.error("Error reading project:", err);
    res.status(500).json({ error: "Failed to read project" });
  }
});

module.exports = router;
