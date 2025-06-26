"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Play,
  Square,
  Download,
  Video,
  Code,
  Loader2,
  Mail,
  Phone,
  Briefcase,
  Copy,
  CheckCircle,
  FileText,
  MapPin,
  Calendar,
  Award,
  Zap,
  Target,
  Users,
  Globe,
  Star,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Snail,
} from "lucide-react";
import Image from "next/image";
import ProjectExplorer from "@/components/project-explorer";
// import sampleProjects from "@/data/sample-projects";

interface TestFile {
  name: string;
  content: string;
  description: string;
}

interface UtilityFile {
  name: string;
  content: string;
  description: string;
}

interface TestStatus {
  isRecording: boolean;
  isTestRunning: boolean;
  runningTests: string[];
  timestamp: string;
}

interface TestSuite {
  name: string;
  displayName: string;
}

export const BACKEND_URL = "http://13.203.224.56:5000";
// export const BACKEND_URL = "http://localhost:5000";

export default function AutomationPortfolio() {
  const [testFiles, setTestFiles] = useState<TestFile[]>([]);
  const [utilityFiles, setUtilityFiles] = useState<UtilityFile[]>([]);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestFile | null>(null);
  const [selectedUtility, setSelectedUtility] = useState<UtilityFile | null>(
    null
  );
  const [selectedSuite, setSelectedSuite] = useState<string>("");
  const [status, setStatus] = useState<TestStatus>({
    isRecording: false,
    isTestRunning: false,
    runningTests: [],
    timestamp: "",
  });
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [suiteLoading, setSuiteLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedUtility, setCopiedUtility] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for smooth scrolling
  const sourceCodeRef = useRef<HTMLDivElement>(null);
  const recordingRef = useRef<HTMLDivElement>(null);
  const utilityCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTestFiles();
    fetchUtilityFiles();
    fetchTestSuites();
    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        !(event.target as Element).closest(".mobile-menu-container")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const fetchTestFiles = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/test-files`);
      if (response.ok) {
        const files = await response.json();
        setTestFiles(files);
        if (files.length > 0) {
          setSelectedTest(files[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch test files:", error);
    }
  };

  const fetchUtilityFiles = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/utility-files`);
      if (response.ok) {
        const files = await response.json();
        setUtilityFiles(files);
        if (files.length > 0) {
          setSelectedUtility(files[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch utility files:", error);
    }
  };

  const fetchTestSuites = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/test-suites`);
      if (response.ok) {
        const suites = await response.json();
        setTestSuites(suites);
        if (suites.length > 0) {
          setSelectedSuite(suites[0].name);
        }
      }
    } catch (error) {
      console.error("Failed to fetch test suites:", error);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/status`);
      if (response.ok) {
        const statusData = await response.json();
        setStatus(statusData);
      }
    } catch (error) {
      console.error("Failed to check status:", error);
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const executeIndividualTest = async (testName: string) => {
    setLoading((prev) => ({ ...prev, [testName]: true }));
    setMessage(`Starting ${testName.replace(".java", "")} execution...`);
    setVideoUrl("");

    // Scroll to recording section on mobile
    setTimeout(() => {
      scrollToSection(recordingRef);
    }, 500);

    try {
      const response = await fetch(`${BACKEND_URL}/execute-individual-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testName }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);

        const pollForCompletion = setInterval(async () => {
          try {
            const statusResponse = await fetch(`${BACKEND_URL}/status`);
            if (statusResponse.ok) {
              const currentStatus = await statusResponse.json();

              if (!currentStatus.runningTests.includes(testName)) {
                clearInterval(pollForCompletion);

                setTimeout(async () => {
                  try {
                    const videoResponse = await fetch(
                      `${BACKEND_URL}/segments/recording.mp4`
                    );
                    if (videoResponse.ok) {
                      setVideoUrl(
                        `${BACKEND_URL}/segments/recording.mp4?t=${Date.now()}`
                      );
                    }
                  } catch (error) {
                    console.error("Video not available:", error);
                  }
                }, 2000);

                setMessage(
                  `${testName.replace(".java", "")} execution completed!`
                );
                setLoading((prev) => ({ ...prev, [testName]: false }));
              }
            }
          } catch (error) {
            console.error("Error polling status:", error);
          }
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(
          `Error: ${errorData.error || "Failed to start test execution"}`
        );
        setLoading((prev) => ({ ...prev, [testName]: false }));
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
      setLoading((prev) => ({ ...prev, [testName]: false }));
    }
  };

  const stopIndividualTest = async (testName: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/stop-individual-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testName }),
      });
      if (response.ok) {
        setMessage(`${testName.replace(".java", "")} execution stopped`);
        setLoading((prev) => ({ ...prev, [testName]: false }));
      }
    } catch (error) {
      setMessage(`Error stopping ${testName}: ${error}`);
    }
  };

  const executeSuite = async () => {
    setSuiteLoading(true);
    setMessage(`Starting test suite execution...`);
    setVideoUrl("");

    // Scroll to recording section on mobile
    setTimeout(() => {
      scrollToSection(recordingRef);
    }, 500);

    try {
      const response = await fetch(`${BACKEND_URL}/execute-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testSuite: selectedSuite }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);

        const pollForCompletion = setInterval(async () => {
          try {
            const statusResponse = await fetch(`${BACKEND_URL}/status`);
            if (statusResponse.ok) {
              const currentStatus = await statusResponse.json();

              if (!currentStatus.isTestRunning) {
                clearInterval(pollForCompletion);

                setTimeout(async () => {
                  try {
                    const videoResponse = await fetch(
                      `${BACKEND_URL}/segments/recording.mp4`
                    );
                    if (videoResponse.ok) {
                      setVideoUrl(
                        `${BACKEND_URL}/segments/recording.mp4?t=${Date.now()}`
                      );
                    }
                  } catch (error) {
                    console.error("Video not available:", error);
                  }
                }, 2000);

                setMessage("Test suite execution completed!");
                setSuiteLoading(false);
              }
            }
          } catch (error) {
            console.error("Error polling status:", error);
          }
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(
          `Error: ${errorData.error || "Failed to start test execution"}`
        );
        setSuiteLoading(false);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
      setSuiteLoading(false);
    }
  };

  const stopSuiteExecution = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/stop-recording`, {
        method: "POST",
      });
      if (response.ok) {
        setMessage("Suite execution stopped");
        setSuiteLoading(false);
      }
    } catch (error) {
      setMessage(`Error stopping suite: ${error}`);
    }
  };

  const copyUtilityCode = async (utilityName: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedUtility(utilityName);
      setTimeout(() => setCopiedUtility(null), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = "/Shubham_Chavan_Resume.pdf";
    link.download = "Shubham_Chavan_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMobileMenuOpen(false); // Close menu after action
  };

  const handleViewSourceCode = (utility: UtilityFile) => {
    setSelectedUtility(utility);
    setTimeout(() => {
      scrollToSection(utilityCodeRef);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:space-y-12">
        {/* Mobile-First Premium Header with Hamburger Menu */}
        <header className="relative">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Snail className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
                    Test Automation Portfolio
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-medium mt-1 sm:mt-2">
                    Selenium • Java • TestNG
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-3 lg:gap-4">
              <Button
                variant="outline"
                onClick={downloadResume}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-sm border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 text-sm lg:text-base px-4 lg:px-6 py-3 lg:py-4 h-auto font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 lg:gap-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Download Resume
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      PDF • Professional CV
                    </div>
                  </div>
                  <Download className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 dark:text-blue-400 group-hover:translate-y-1 group-hover:scale-110 transition-all duration-300" />
                </div>
              </Button>
              <ThemeToggle />
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="sm:hidden mobile-menu-container">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-blue-200 dark:border-blue-800 rounded-xl shadow-2xl shadow-blue-500/20 z-40 overflow-hidden">
                  <div className="p-2 space-y-1">
                    <Button
                      variant="ghost"
                      onClick={downloadResume}
                      className="w-full justify-start gap-3 px-4 py-3 h-auto text-left hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Download Resume</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          PDF Format
                        </div>
                      </div>
                    </Button>

                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Theme</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Dark/Light Mode
                          </div>
                        </div>
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Profile Section */}
        <section className="relative">
          <Card className="overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20"></div>
            <CardContent className="relative p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:gap-12">
                <div className="relative group">
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative">
                    <Image
                      src="/profile.jpeg"
                      alt="Shubham Chavan"
                      width={160}
                      height={160}
                      className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 rounded-full border-4 border-white dark:border-slate-700 shadow-2xl"
                    />
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
                      Shubham Chavan
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-medium">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Test Automation Engineer
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base"
                      >
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        3.7+ Years
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    Driven Test Automation Engineer with a{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      strong foundation in software testing
                    </span>{" "}
                    and quality assurance. I possess a solid technical
                    background complemented by my engineering degree, allowing
                    me to effectively
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {" "}
                      bridge the gap between development and testing
                    </span>{" "}
                    to ensure seamless deployments.
                  </p>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <span className="font-medium text-xs sm:text-sm md:text-base">
                        shubhamchavan6795@gmail.com
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <span className="font-medium text-xs sm:text-sm md:text-base">
                        +91 7387678795
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <span className="font-medium text-xs sm:text-sm md:text-base">
                        Pune, India
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Professional Experience Timeline */}
        <section>
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-xl shadow-slate-500/10">
            <CardHeader className="pb-4 sm:pb-6 md:pb-8">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-bold">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Professional Journey
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Building expertise through diverse automation testing roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {[
                  {
                    title: "Test Automation Engineer",
                    company: "Neosoft, Parel",
                    period: "Oct 2023 - Jan 2024",
                    color: "from-blue-500 to-cyan-500",
                    bgColor: "bg-blue-50 dark:bg-blue-950/20",
                    borderColor: "border-blue-200 dark:border-blue-800",
                  },
                  {
                    title: "Assistant Manager QA",
                    company: "Cognus Technology, Udaipur",
                    period: "Jun 2022 - Oct 2023",
                    color: "from-emerald-500 to-teal-500",
                    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
                    borderColor: "border-emerald-200 dark:border-emerald-800",
                  },
                  {
                    title: "Software Test Engineer",
                    company: "Kbsys Technologies, Pune",
                    period: "Apr 2020 - Apr 2022",
                    color: "from-purple-500 to-pink-500",
                    bgColor: "bg-purple-50 dark:bg-purple-950/20",
                    borderColor: "border-purple-200 dark:border-purple-800",
                  },
                ].map((job, index) => (
                  <div
                    key={index}
                    className={`relative p-4 sm:p-6 rounded-xl border-2 ${job.borderColor} ${job.bgColor} hover:shadow-lg transition-all duration-300 group`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${job.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1">
                          {job.title}
                        </h3>
                        <p
                          className={`text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r ${job.color} bg-clip-text text-transparent mb-2`}
                        >
                          {job.company}
                        </p>
                        <div className="flex items-center gap-1 sm:gap-2 text-slate-600 dark:text-slate-400">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="font-medium text-xs sm:text-sm">
                            {job.period}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Test Scripts Section */}
        {/* <section>
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-xl shadow-slate-500/10">
            <CardHeader className="pb-4 sm:pb-6 md:pb-8">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-bold">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Live Test Execution
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Interactive automation tests with real-time execution and screen
                recording
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {testFiles.map((file, index) => (
                  <Card
                    key={index}
                    className="group relative overflow-hidden bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="relative p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <Button
                              variant={
                                selectedTest?.name === file.name
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => setSelectedTest(file)}
                              className="flex items-center gap-2 text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-3 h-auto justify-start sm:justify-center"
                            >
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Code className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                              </div>
                              {file.name.replace(".java", "")}
                            </Button>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant={
                                  status.runningTests.includes(file.name)
                                    ? "default"
                                    : "secondary"
                                }
                                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${
                                  status.runningTests.includes(file.name)
                                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                                    : ""
                                }`}
                              >
                                {status.runningTests.includes(file.name) ? (
                                  <>
                                    <Loader2 className="h-2 w-2 sm:h-3 sm:w-3 mr-1 animate-spin" />
                                    Running
                                  </>
                                ) : (
                                  <>
                                    <Star className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                    Ready
                                  </>
                                )}
                              </Badge>
                              {status.isRecording &&
                                status.runningTests.includes(file.name) && (
                                  <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 sm:px-3 py-1 animate-pulse text-xs sm:text-sm">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1 sm:mr-2 animate-pulse"></div>
                                    Recording
                                  </Badge>
                                )}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                            {file.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 lg:ml-6">
                          <Button
                            onClick={() => executeIndividualTest(file.name)}
                            disabled={
                              loading[file.name] ||
                              status.runningTests.includes(file.name)
                            }
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 h-auto font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 text-xs sm:text-sm flex-1 sm:flex-none"
                          >
                            {loading[file.name] ? (
                              <>
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                                Running...
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                Execute
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => stopIndividualTest(file.name)}
                            disabled={!status.runningTests.includes(file.name)}
                            className="px-3 sm:px-4 py-2 sm:py-3 h-auto shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                          >
                            <Square className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section> */}

        {/* <ProjectExplorer projects={sampleProjects} /> */}

        <ProjectExplorer />

        <section>
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-xl shadow-slate-500/10">
            <CardHeader className="pb-4 sm:pb-6 md:pb-8">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-bold">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Live Test Execution
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Interactive automation tests with real-time execution and screen
                recording
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Optimized grid container with auto-adjusting columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
                {testFiles.map((file, index) => (
                  <Card
                    key={index}
                    className="group relative h-full flex flex-col overflow-hidden bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="relative p-4 sm:p-6 flex flex-col flex-1">
                      <div className="flex flex-col flex-1 gap-4">
                        {/* Test Name Button */}
                        <Button
                          variant={
                            selectedTest?.name === file.name
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSelectedTest(file)}
                          className="flex items-center gap-2 text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-3 h-auto justify-start w-full"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Code className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                          <span className="truncate">
                            {file.name.replace(".java", "")}
                          </span>
                        </Button>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              status.runningTests.includes(file.name)
                                ? "default"
                                : "secondary"
                            }
                            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${
                              status.runningTests.includes(file.name)
                                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                                : ""
                            }`}
                          >
                            {status.runningTests.includes(file.name) ? (
                              <>
                                <Loader2 className="h-2 w-2 sm:h-3 sm:w-3 mr-1 animate-spin" />
                                Running
                              </>
                            ) : (
                              <>
                                <Star className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                Ready
                              </>
                            )}
                          </Badge>
                          {status.isRecording &&
                            status.runningTests.includes(file.name) && (
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 sm:px-3 py-1 animate-pulse text-xs sm:text-sm">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1 sm:mr-2 animate-pulse"></div>
                                Recording
                              </Badge>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {file.description}
                        </p>

                        {/* Action Buttons - pushed to bottom with mt-auto */}
                        <div className="mt-auto flex items-center gap-2 sm:gap-3">
                          <Button
                            onClick={() => executeIndividualTest(file.name)}
                            disabled={
                              loading[file.name] ||
                              status.runningTests.includes(file.name)
                            }
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 h-auto font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 text-xs sm:text-sm"
                          >
                            {loading[file.name] ? (
                              <>
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                                Running...
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                Execute
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => stopIndividualTest(file.name)}
                            disabled={!status.runningTests.includes(file.name)}
                            className="flex-none px-3 sm:px-4 py-2 sm:py-3 h-auto shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                          >
                            <Square className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Test Suite Control */}
        {/* <section>
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-xl shadow-slate-500/10">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-bold">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Test Suite Execution
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Run comprehensive test suites with multiple automation scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <select
                  value={selectedSuite}
                  onChange={(e) => setSelectedSuite(e.target.value)}
                  className="w-full p-3 sm:p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
                  disabled={suiteLoading || status.isTestRunning}
                >
                  {testSuites.map((suite) => (
                    <option key={suite.name} value={suite.name}>
                      {suite.displayName} Test Suite
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    onClick={executeSuite}
                    disabled={suiteLoading || status.isTestRunning}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 h-auto font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-xs sm:text-sm md:text-base flex-1"
                  >
                    {suiteLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 animate-spin" />
                        Running Suite...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                        Run Suite
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={stopSuiteExecution}
                    disabled={!suiteLoading && !status.isTestRunning}
                    className="px-4 sm:px-6 py-3 sm:py-4 h-auto shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                  >
                    <Square className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
              {message && (
                <Alert className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                  <AlertDescription className="text-blue-800 dark:text-blue-200 font-medium text-xs sm:text-sm">
                    {message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </section> */}

        {/* Code & Recording Display with Refs */}
        {selectedTest && (
          <section className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Test Code with Ref */}
            <div ref={sourceCodeRef}>
              <Card className="bg-slate-900 dark:bg-slate-950 border-slate-700 shadow-2xl order-2 lg:order-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-emerald-400 flex items-center gap-2 text-base sm:text-lg md:text-xl">
                    <Code className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="truncate">{selectedTest.name}</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs sm:text-sm">
                    {selectedTest.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 text-emerald-400 p-3 sm:p-4 md:p-6 rounded-lg overflow-x-auto text-xs sm:text-sm max-h-60 sm:max-h-80 md:max-h-[600px] overflow-y-auto border border-slate-700 font-mono leading-relaxed">
                    <code>{selectedTest.content}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>

            {/* Recording Display with Ref */}
            <div ref={recordingRef}>
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-xl shadow-slate-500/10 order-1 lg:order-2">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Video className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    Live Test Recording
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Real-time screen capture of automation execution
                  </CardDescription>
                  <CardDescription className="text-xs sm:text-sm">
                    ✅ Backend Server is Hosted on Ec2 (AWS)
                  </CardDescription>
                  <CardDescription className="text-xs sm:text-sm">
                    ✅ You are absolutely right! Capturing full Virtual Display
                    (not just browser).
                  </CardDescription>
                  <CardDescription className="text-xs sm:text-sm">
                    ✅ Start playback from 10–12 seconds to skip display capture
                    delays during browser launch.
                  </CardDescription>
                  <CardDescription className="text-xs sm:text-sm">
                    ✅ Note: This is for demonstration purposes only.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {videoUrl ? (
                    <div className="space-y-3 sm:space-y-4">
                      <video
                        controls
                        className="w-full rounded-xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 max-h-60 sm:max-h-80 md:max-h-[500px]"
                        key={videoUrl}
                      >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      {/* <Button
                        variant="outline"
                        className="w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 py-2 sm:py-3 h-auto text-xs sm:text-sm"
                        onClick={() => window.open(videoUrl, "_blank")}
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="font-semibold">
                          Download Recording
                        </span>
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                      </Button> */}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12 md:py-16 text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl min-h-60 sm:min-h-80 md:min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                        <Video className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-slate-400" />
                      </div>
                      <p className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">
                        Ready for Recording
                      </p>
                      <p className="text-xs sm:text-sm md:text-base">
                        Execute a test to see live automation in action
                      </p>
                      {status.isRecording && (
                        <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3 text-red-500">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="font-semibold text-sm sm:text-base md:text-lg">
                            Recording in progress...
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Utility Scripts Showcase */}
        <section>
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-xl shadow-slate-500/10">
            <CardHeader className="pb-4 sm:pb-6 md:pb-8">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-bold">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Code className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Handy Utility Scripts
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Production-ready utility classes for automation testing • Click
                to copy code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {utilityFiles.map((utility, index) => (
                  <Card
                    key={index}
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="relative p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                          <Code className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyUtilityCode(utility.name, utility.content)
                          }
                          className="h-8 w-8 sm:h-9 sm:w-9 p-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors"
                        >
                          {copiedUtility === utility.name ? (
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                        </Button>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-900 dark:text-white mb-2 sm:mb-3">
                        {utility.name.replace(".java", "")}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3 sm:mb-4 leading-relaxed">
                        {utility.description}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewSourceCode(utility)}
                        className="w-full text-xs sm:text-sm group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors font-medium"
                      >
                        <Code className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        View Source Code
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Utility Code Display with Ref */}
              {/* <div ref={utilityCodeRef}>
                {selectedUtility && (
                  <Card className="bg-slate-900 dark:bg-slate-950 border-slate-700 shadow-2xl">
                    <CardHeader className="pb-3 sm:pb-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <CardTitle className="text-emerald-400 flex items-center gap-2 text-base sm:text-lg md:text-xl">
                          <Code className="h-4 w-4 sm:h-5 sm:w-5" />
                          {selectedUtility.name}
                        </CardTitle>
                        <Button
                          onClick={() =>
                            copyUtilityCode(
                              selectedUtility.name,
                              selectedUtility.content
                            )
                          }
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 h-auto"
                        >
                          {copiedUtility === selectedUtility.name ? (
                            <>
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Copy Code
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-slate-950 text-emerald-400 p-3 sm:p-4 md:p-6 rounded-lg overflow-x-auto text-xs sm:text-sm max-h-60 sm:max-h-80 overflow-y-auto border border-slate-700 font-mono">
                        <code>{selectedUtility.content}</code>
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div> */}
              <div ref={utilityCodeRef}>
                {selectedUtility && (
                  <Card className="bg-slate-900 dark:bg-slate-950 border-slate-700 shadow-2xl">
                    <CardHeader className="pb-3 sm:pb-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <CardTitle className="text-emerald-400 flex items-center gap-2 text-base sm:text-lg md:text-xl">
                          <Code className="h-4 w-4 sm:h-5 sm:w-5" />
                          {selectedUtility.name}
                        </CardTitle>
                        <Button
                          onClick={() =>
                            copyUtilityCode(
                              selectedUtility.name,
                              selectedUtility.content
                            )
                          }
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 h-auto"
                        >
                          {copiedUtility === selectedUtility.name ? (
                            <>
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Copy Code
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-slate-950 text-emerald-400 p-3 sm:p-4 md:p-6 rounded-lg overflow-x-auto text-xs sm:text-sm max-h-80 sm:max-h-[32rem] overflow-y-auto border border-slate-700 font-mono">
                        <code>{selectedUtility.content}</code>
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Skills Showcase */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                title: "Selenium WebDriver",
                description:
                  "Advanced browser automation with Chrome WebDriver, complex page interactions, element handling, and cross-browser testing capabilities.",
                icon: Globe,
                gradient: "from-blue-500 to-cyan-500",
                bgGradient:
                  "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
              },
              {
                title: "TestNG Framework",
                description:
                  "Complete test lifecycle management with TestNG, parallel execution, data-driven testing, and comprehensive reporting with custom listeners.",
                icon: Target,
                gradient: "from-emerald-500 to-teal-500",
                bgGradient:
                  "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
              },
              {
                title: "Test Automation",
                description:
                  "End-to-end automation solutions with screen recording, CI/CD integration, and scalable test architecture for enterprise applications.",
                icon: Zap,
                gradient: "from-purple-500 to-pink-500",
                bgGradient:
                  "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
              },
            ].map((skill, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden bg-gradient-to-br ${skill.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50"></div>
                <CardContent className="relative p-4 sm:p-6 md:p-8">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${skill.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <skill.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
                    {skill.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {skill.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Enhanced Resume CTA Section */}
      <section>
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 border-0 shadow-2xl shadow-blue-500/25">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-2xl"></div>

          <CardContent className="relative p-6 sm:p-8 md:p-12 lg:p-16 text-center">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                  <Award className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Ready to Hire a
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Test Automation Expert?
                  </span>
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  3.7+ years of proven expertise in Selenium WebDriver, TestNG,
                  and CI/CD automation.
                  <span className="font-semibold text-white">
                    {" "}
                    Ready to deliver quality at scale.
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Button
                  onClick={downloadResume}
                  className="group relative overflow-hidden bg-white text-blue-600 hover:bg-blue-50 px-8 sm:px-12 py-4 sm:py-6 h-auto text-lg sm:text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 border-0"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Download Full Resume</div>
                      <div className="text-sm text-blue-500 group-hover:text-blue-600 transition-colors">
                        Complete Professional Profile
                      </div>
                    </div>
                    <Download className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-y-1 group-hover:scale-110 transition-all duration-300" />
                  </div>
                </Button>

                <div className="flex items-center gap-4 sm:gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-300" />
                    <span className="font-medium text-sm sm:text-base">
                      Immediate Availability
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-300" />
                    <span className="font-medium text-sm sm:text-base">
                      Remote Ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-white/20">
                {[
                  {
                    label: "Years Experience",
                    value: "3.7+",
                    icon: Calendar,
                  },
                  { label: "Test Cases", value: "500+", icon: Target },
                  { label: "Projects", value: "5+", icon: Briefcase },
                  { label: "Success Rate", value: "99%", icon: Star },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-200">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Floating Resume Button for Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <Button
          onClick={downloadResume}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 border-0 w-16 h-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <div className="relative flex items-center justify-center">
            <FileText className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Download Resume
          </div>
        </Button>
      </div>
    </div>
  );
}
