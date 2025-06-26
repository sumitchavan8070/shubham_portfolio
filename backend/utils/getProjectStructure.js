const fs = require("fs");
const path = require("path");

const languageMap = {
  js: "javascript",
  ts: "typescript",
  java: "java",
  py: "python",
  json: "json",
  html: "html",
  css: "css",
  md: "markdown",
  xml: "xml",
  yml: "yaml",
  yaml: "yaml",
};

function detectLanguage(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  return languageMap[ext] || "text";
}

function readNode(filePath) {
  const name = path.basename(filePath);
  const stat = fs.lstatSync(filePath);
  if (stat.isDirectory()) {
    return {
      name,
      type: "folder",
      children: fs
        .readdirSync(filePath)
        .map((child) => readNode(path.join(filePath, child))),
    };
  } else {
    const content = fs.readFileSync(filePath, "utf-8");
    return { name, type: "file", content, language: detectLanguage(name) };
  }
}

function getProjectStructure(folderPath) {
  const structure = fs
    .readdirSync(folderPath)
    .map((entry) => readNode(path.join(folderPath, entry)));

  return {
    projectName: path.basename(folderPath),
    description: "Loaded dynamically from local folder",
    structure,
  };
}

module.exports = { getProjectStructure };
