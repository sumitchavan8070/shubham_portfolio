// "use client";

// import { useState } from "react";
// import {
//   ChevronDown,
//   ChevronRight,
//   File,
//   Folder,
//   FolderOpen,
// } from "lucide-react";
// import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
// import {
//   oneLight,
//   oneDark,
// } from "react-syntax-highlighter/dist/cjs/styles/prism";
// import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
// import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
// import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
// import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
// import java from "react-syntax-highlighter/dist/cjs/languages/prism/java";
// import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
// import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
// import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
// import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
// import html from "react-syntax-highlighter/dist/cjs/languages/prism/markup";
// import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
// import yaml from "react-syntax-highlighter/dist/cjs/languages/prism/yaml";

// // Register languages
// SyntaxHighlighter.registerLanguage("javascript", javascript);
// SyntaxHighlighter.registerLanguage("typescript", typescript);
// SyntaxHighlighter.registerLanguage("jsx", jsx);
// SyntaxHighlighter.registerLanguage("tsx", tsx);
// SyntaxHighlighter.registerLanguage("java", java);
// SyntaxHighlighter.registerLanguage("python", python);
// SyntaxHighlighter.registerLanguage("json", json);
// SyntaxHighlighter.registerLanguage("css", css);
// SyntaxHighlighter.registerLanguage("scss", scss);
// SyntaxHighlighter.registerLanguage("html", html);
// SyntaxHighlighter.registerLanguage("markdown", markdown);
// SyntaxHighlighter.registerLanguage("yaml", yaml);

// export type FileNode = {
//   name: string;
//   type: "file" | "folder";
//   content?: string;
//   language?: string;
//   children?: FileNode[];
// };

// export type ProjectStructure = {
//   projectName: string;
//   description: string;
//   structure: FileNode[];
// };

// export default function ProjectExplorer({
//   projects,
// }: {
//   projects: ProjectStructure[];
// }) {
//   const [selectedProject, setSelectedProject] = useState(0);
//   const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
//   const [expandedFolders, setExpandedFolders] = useState<
//     Record<string, boolean>
//   >({});

//   const currentProject = projects[selectedProject];

//   const toggleFolder = (path: string) => {
//     setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   const detectLanguage = (filename: string): string => {
//     const extension = filename.split(".").pop()?.toLowerCase() || "text";
//     const languageMap: Record<string, string> = {
//       js: "javascript",
//       ts: "typescript",
//       jsx: "jsx",
//       tsx: "tsx",
//       java: "java",
//       py: "python",
//       xml: "xml",
//       json: "json",
//       css: "css",
//       scss: "scss",
//       html: "html",
//       md: "markdown",
//       yml: "yaml",
//       yaml: "yaml",
//     };
//     return languageMap[extension] || "text";
//   };

//   const renderFileNode = (node: FileNode, path = ""): JSX.Element => {
//     const currentPath = `${path}/${node.name}`;

//     if (node.type === "folder") {
//       const isExpanded = expandedFolders[currentPath];
//       return (
//         <div key={currentPath} className="pl-4">
//           <div
//             className="flex items-center py-1 hover:bg-muted dark:hover:bg-muted/30 cursor-pointer rounded-md"
//             onClick={() => toggleFolder(currentPath)}
//           >
//             {isExpanded ? (
//               <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
//             ) : (
//               <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
//             )}
//             {isExpanded ? (
//               <FolderOpen className="h-4 w-4 mr-2 text-amber-500" />
//             ) : (
//               <Folder className="h-4 w-4 mr-2 text-amber-500" />
//             )}
//             <span className="truncate">{node.name}</span>
//           </div>
//           {isExpanded &&
//             node.children?.map((child) => renderFileNode(child, currentPath))}
//         </div>
//       );
//     }

//     return (
//       <div
//         key={currentPath}
//         className={`flex items-center py-1 pl-6 cursor-pointer rounded-md ${
//           selectedFile?.name === node.name
//             ? "bg-primary/10 dark:bg-primary/20"
//             : "hover:bg-muted dark:hover:bg-muted/20"
//         }`}
//         onClick={() =>
//           setSelectedFile({
//             ...node,
//             language: node.language || detectLanguage(node.name),
//           })
//         }
//       >
//         <File className="h-4 w-4 mr-2 text-blue-500" />
//         <span className="truncate">{node.name}</span>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {/* Project Tabs */}
//       <div className="overflow-x-auto mb-4">
//         <div className="flex gap-2 border-b pb-1 min-w-max w-full">
//           {projects.map((project, index) => (
//             <button
//               key={project.projectName}
//               onClick={() => {
//                 setSelectedProject(index);
//                 setSelectedFile(null);
//                 setExpandedFolders({});
//               }}
//               className={`px-4 py-2 rounded-t-md text-sm whitespace-nowrap border ${
//                 selectedProject === index
//                   ? "border-border bg-white dark:bg-slate-900 shadow font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//                   : "border-transparent hover:bg-muted dark:hover:bg-muted/20 text-muted-foreground"
//               }`}
//             >
//               {project.projectName}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Description */}
//       <p className="text-sm text-muted-foreground mb-4">
//         {currentProject.description}
//       </p>

//       {/* Main layout */}
//       <div className="flex flex-col sm:flex-row h-[600px] border rounded-lg overflow-hidden bg-card dark:bg-card text-foreground shadow-sm">
//         {/* File Tree */}
//         <div className="sm:w-64 w-full border-r bg-background dark:bg-card overflow-y-auto">
//           <div className="p-3 text-sm font-mono text-muted-foreground">
//             {currentProject.structure.map((node) => renderFileNode(node))}
//           </div>
//         </div>

//         {/* File Viewer */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {selectedFile ? (
//             <>
//               <div className="p-3 border-b font-mono text-sm bg-muted/40 dark:bg-muted/10 flex items-center">
//                 <File className="h-4 w-4 mr-2 text-blue-500" />
//                 <span>{selectedFile.name}</span>
//               </div>
//               <div className="flex-1 overflow-auto">
//                 <SyntaxHighlighter
//                   language={selectedFile.language || "text"}
//                   style={
//                     typeof window !== "undefined" &&
//                     document.documentElement.classList.contains("dark")
//                       ? oneDark
//                       : oneLight
//                   }
//                   showLineNumbers
//                   wrapLines
//                   customStyle={{
//                     margin: 0,
//                     padding: "1rem",
//                     background:
//                       typeof window !== "undefined" &&
//                       document.documentElement.classList.contains("dark")
//                         ? "#0f172a"
//                         : "#ffffff",
//                     height: "100%",
//                     fontSize: "0.875rem",
//                   }}
//                 >
//                   {selectedFile.content || "// No content available"}
//                 </SyntaxHighlighter>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
//               <File className="h-10 w-10 mb-4 opacity-40" />
//               <p>Select a file to view its content</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import {
//   ChevronDown,
//   ChevronRight,
//   File,
//   Folder,
//   FolderOpen,
//   Target,
// } from "lucide-react";
// import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
// import {
//   oneLight,
//   oneDark,
// } from "react-syntax-highlighter/dist/cjs/styles/prism";
// import { BACKEND_URL } from "@/app/page";
// import { Badge } from "./ui/badge";

// type FileNode = {
//   name: string;
//   type: "file" | "folder";
//   content?: string;
//   language?: string;
//   children?: FileNode[];
// };

// type ProjectStructure = {
//   projectName: string;
//   description: string;
//   structure: FileNode[];
// };

// export default function ProjectExplorer() {
//   const [projects, setProjects] = useState<ProjectStructure[]>([]);
//   const [selectedProject, setSelectedProject] = useState(0);
//   const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
//   const [expandedFolders, setExpandedFolders] = useState<
//     Record<string, boolean>
//   >({});

//   const [loading, setLoading] = useState(true);

//   // 🔁 Load all project names and their structures
//   useEffect(() => {
//     const loadProjects = async () => {
//       setLoading(true);

//       try {
//         const names = await fetch(`${BACKEND_URL}/api/projects`).then((r) =>
//           r.json()
//         );
//         const loaded = await Promise.all(
//           names.map((name: string) =>
//             fetch(`${BACKEND_URL}/api/projects/${name}`).then((r) => r.json())
//           )
//         );
//         setProjects(loaded);
//       } catch (err) {
//         console.error("Failed to load projects:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProjects();
//   }, []);

//   const currentProject = projects[selectedProject];

//   const toggleFolder = (path: string) => {
//     setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   const renderFileNode = (node: FileNode, path = "") => {
//     const currentPath = `${path}/${node.name}`;
//     if (node.type === "folder") {
//       const isExpanded = expandedFolders[currentPath];
//       return (
//         <div key={currentPath} className="pl-4">
//           <div
//             className="flex items-center py-1 hover:bg-muted dark:hover:bg-muted/30 cursor-pointer rounded-md"
//             onClick={() => toggleFolder(currentPath)}
//           >
//             {isExpanded ? (
//               <ChevronDown className="h-4 w-4 mr-1" />
//             ) : (
//               <ChevronRight className="h-4 w-4 mr-1" />
//             )}
//             {isExpanded ? (
//               <FolderOpen className="h-4 w-4 mr-2 text-amber-500" />
//             ) : (
//               <Folder className="h-4 w-4 mr-2 text-amber-500" />
//             )}
//             <span>{node.name}</span>
//           </div>
//           {isExpanded &&
//             node.children?.map((child) => renderFileNode(child, currentPath))}
//         </div>
//       );
//     }

//     return (
//       <div
//         key={currentPath}
//         className={`flex items-center py-1 pl-6 cursor-pointer rounded-md ${
//           selectedFile?.name === node.name
//             ? "bg-primary/10 dark:bg-primary/20"
//             : "hover:bg-muted"
//         }`}
//         onClick={() => setSelectedFile(node)}
//       >
//         <File className="h-4 w-4 mr-2 text-blue-500" />
//         <span>{node.name}</span>
//       </div>
//     );
//   };

//   // if (!projects.length)
//   //   return <p className="text-muted-foreground">Loading projects...</p>;
//   if (loading) {
//     return (
//       <div className="w-full h-[300px] flex items-center justify-center">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <Badge className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-medium mb-4">
//         <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//         Sample Project Framework
//       </Badge>
//       {/* Tabs */}
//       <div className="overflow-x-auto mb-4">
//         <div className="flex gap-2 border-b pb-1">
//           {projects?.map((project, index) => (
//             <button
//               key={project.projectName}
//               onClick={() => {
//                 setSelectedProject(index);
//                 setSelectedFile(null);
//                 setExpandedFolders({});
//               }}
//               className={`px-4 py-2 rounded-t-md text-sm whitespace-nowrap border ${
//                 selectedProject === index
//                   ? "border-border bg-white dark:bg-slate-900 shadow font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//                   : "border-transparent hover:bg-muted dark:hover:bg-muted/20 text-muted-foreground"
//               }`}
//             >
//               {project?.projectName}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Description */}
//       {/* <p className="text-sm text-muted-foreground mb-4">
//         {currentProject.description}
//       </p> */}

//       {/* Main layout */}
//       <div className="flex flex-col sm:flex-row h-[600px] border rounded-lg overflow-hidden bg-card dark:bg-card text-foreground shadow-sm">
//         {/* File Tree */}
//         <div className="sm:w-64 w-full border-r bg-background overflow-y-auto">
//           <div className="p-3 text-sm font-mono text-muted-foreground">
//             {currentProject?.structure.map((node) => renderFileNode(node))}
//           </div>
//         </div>

//         {/* File Viewer */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {selectedFile ? (
//             <>
//               <div className="p-3 border-b font-mono text-sm bg-muted/40 dark:bg-muted/10 flex items-center">
//                 <File className="h-4 w-4 mr-2 text-blue-500" />
//                 <span>{selectedFile?.name}</span>
//               </div>
//               <div className="flex-1 overflow-auto">
//                 <SyntaxHighlighter
//                   language={selectedFile.language || "text"}
//                   style={
//                     typeof window !== "undefined" &&
//                     document.documentElement.classList.contains("dark")
//                       ? oneDark
//                       : oneLight
//                   }
//                   showLineNumbers
//                   wrapLines
//                   customStyle={{
//                     margin: 0,
//                     padding: "1rem",
//                     background:
//                       typeof window !== "undefined" &&
//                       document.documentElement.classList.contains("dark")
//                         ? "#0f172a"
//                         : "#ffffff",
//                     height: "100%",
//                     fontSize: "0.875rem",
//                   }}
//                 >
//                   {selectedFile.content || "// No content"}
//                 </SyntaxHighlighter>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground text-sm italic px-4">
//               <div>
//                 🧭 <strong>Explore some code</strong> — pick a file to get
//                 started.
//               </div>
//               <div className="mt-1">
//                 These are sample automation frameworks. Use the tabs above to
//                 switch between projects and review their structure.
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Target,
} from "lucide-react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { BACKEND_URL } from "@/app/page";
import { Badge } from "./ui/badge";

type FileNode = {
  name: string;
  type: "file" | "folder";
  content?: string;
  language?: string;
  children?: FileNode[];
};

type ProjectStructure = {
  projectName: string;
  description: string;
  structure: FileNode[];
};

export default function ProjectExplorer() {
  const [projects, setProjects] = useState<ProjectStructure[]>([]);
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const names = await fetch(`${BACKEND_URL}/api/projects`).then((r) =>
          r.json()
        );
        const loaded = await Promise.all(
          names.map((name: string) =>
            fetch(`${BACKEND_URL}/api/projects/${name}`).then((r) => r.json())
          )
        );
        setProjects(loaded);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const currentProject = projects[selectedProject];

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderFileNode = (node: FileNode, path = "") => {
    const currentPath = `${path}/${node.name}`;
    if (node.type === "folder") {
      const isExpanded = expandedFolders[currentPath];
      return (
        <div key={currentPath} className="pl-2 sm:pl-4">
          <div
            className="flex items-center py-1 hover:bg-muted dark:hover:bg-muted/30 cursor-pointer rounded-md"
            onClick={() => toggleFolder(currentPath)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-amber-500" />
            ) : (
              <Folder className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-amber-500" />
            )}
            <span className="text-sm sm:text-base">{node.name}</span>
          </div>
          {isExpanded &&
            node.children?.map((child) => renderFileNode(child, currentPath))}
        </div>
      );
    }

    return (
      <div
        key={currentPath}
        className={`flex items-center py-1 pl-4 sm:pl-6 cursor-pointer rounded-md text-sm sm:text-base ${
          selectedFile?.name === node.name
            ? "bg-primary/10 dark:bg-primary/20"
            : "hover:bg-muted"
        }`}
        onClick={() => setSelectedFile(node)}
      >
        <File className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-500" />
        <span>{node.name}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <Badge className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
        <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        Sample Project Framework
      </Badge>

      {/* Tabs - Horizontal scroll on mobile */}
      <div className="overflow-x-auto mb-3 sm:mb-4">
        <div className="flex gap-1 sm:gap-2 border-b pb-1 min-w-max">
          {projects?.map((project, index) => (
            <button
              key={project.projectName}
              onClick={() => {
                setSelectedProject(index);
                setSelectedFile(null);
                setExpandedFolders({});
              }}
              className={`px-3 sm:px-4 py-1 sm:py-2 rounded-t-md text-xs sm:text-sm whitespace-nowrap border ${
                selectedProject === index
                  ? "border-border bg-white dark:bg-slate-900 shadow font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  : "border-transparent hover:bg-muted dark:hover:bg-muted/20 text-muted-foreground"
              }`}
            >
              {project?.projectName}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout - Stack on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row h-[calc(100vh-180px)] sm:h-[600px] border rounded-lg overflow-hidden bg-card dark:bg-card text-foreground shadow-sm">
        {/* File Tree - Full width on mobile, fixed width on desktop */}
        <div className="sm:w-64 w-full border-r bg-background overflow-y-auto">
          <div className="p-2 sm:p-3 text-xs sm:text-sm font-mono text-muted-foreground">
            {currentProject?.structure.map((node) => renderFileNode(node))}
          </div>
        </div>

        {/* File Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedFile ? (
            <>
              <div className="p-2 sm:p-3 border-b font-mono text-xs sm:text-sm bg-muted/40 dark:bg-muted/10 flex items-center">
                <File className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-500" />
                <span className="truncate">{selectedFile?.name}</span>
              </div>
              <div className="flex-1 overflow-auto">
                <SyntaxHighlighter
                  language={selectedFile.language || "text"}
                  style={
                    typeof window !== "undefined" &&
                    document.documentElement.classList.contains("dark")
                      ? oneDark
                      : oneLight
                  }
                  showLineNumbers
                  wrapLines
                  customStyle={{
                    margin: 0,
                    padding: "0.75rem",
                    background:
                      typeof window !== "undefined" &&
                      document.documentElement.classList.contains("dark")
                        ? "#0f172a"
                        : "#ffffff",
                    height: "100%",
                    fontSize: "0.75rem",
                    lineHeight: "1.4",
                  }}
                  lineNumberStyle={{
                    minWidth: "2em",
                  }}
                >
                  {selectedFile.content || "// No content"}
                </SyntaxHighlighter>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground text-xs sm:text-sm italic px-4">
              <div>
                🧭 <strong>Explore some code</strong> — pick a file to get
                started.
              </div>
              <div className="mt-1">
                These are sample automation frameworks. Use the tabs above to
                switch between projects and review their structure.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
