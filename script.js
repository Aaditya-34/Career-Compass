/* =============================================
   CAREER COMPASS - Main JavaScript File
   Project: Career Roadmap Generator
   Web Designing Mini Project
   =============================================

   This file handles:
   1. Form validation
   2. Career recommendation logic (weighted scoring)
   3. Skill gap analysis
   4. Roadmap generation
   5. Progress tracking
   6. All DOM manipulation
   ============================================= */

/* ---------- CAREER DATA DEFINITIONS ---------- */

/**
 * careerData object holds all info for each career path.
 * Each career has:
 *  - icon, description
 *  - relatedInterests (affects 40% of score)
 *  - requiredSkills (affects 30% of score)
 *  - keyActivities (affects 20% of score)
 *  - requiredSkillsList (for gap analysis)
 *  - criticalSkills (must-have skills)
 *  - secondarySkills (good to have)
 */
const careerData = {
    "Software Engineer": {
        icon: "💻",
        description: "Build software applications, work with teams, solve complex coding problems and design scalable systems.",
        relatedInterests: ["coding", "problem_solving", "mobile", "cloud"],
        requiredSkills: ["python", "java", "javascript", "c_cpp", "git", "sql"],
        keyActivities: ["coding", "problem_solving"],
        requiredSkillsList: ["Python", "Java/C++", "JavaScript", "Git", "SQL", "Data Structures", "Algorithms", "System Design"],
        criticalSkills: ["Python", "Data Structures", "Algorithms", "Git"],
        secondarySkills: ["Docker", "AWS", "Node.js", "REST APIs"],
        roadmapFocus: "software"
    },
    "Data Scientist": {
        icon: "📊",
        description: "Analyze large datasets, build machine learning models, and extract meaningful insights from data.",
        relatedInterests: ["data", "ai_ml", "research", "problem_solving"],
        requiredSkills: ["python", "statistics", "ml_basics", "sql", "git"],
        keyActivities: ["data", "research"],
        requiredSkillsList: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "NumPy/Pandas", "TensorFlow/PyTorch"],
        criticalSkills: ["Python", "Statistics", "Machine Learning", "NumPy/Pandas"],
        secondarySkills: ["Tableau", "Power BI", "Big Data", "Apache Spark"],
        roadmapFocus: "datascience"
    },
    "Data Analyst": {
        icon: "📈",
        description: "Turn raw data into actionable insights using visualization tools and statistical analysis.",
        relatedInterests: ["data", "research", "problem_solving", "coding"],
        requiredSkills: ["sql", "statistics", "python", "javascript"],
        keyActivities: ["data", "problem_solving"],
        requiredSkillsList: ["SQL", "Excel", "Python/R", "Statistics", "Power BI", "Tableau", "Data Cleaning"],
        criticalSkills: ["SQL", "Excel", "Python", "Statistics"],
        secondarySkills: ["Tableau", "Power BI", "R Programming", "ETL Tools"],
        roadmapFocus: "dataanalyst"
    },
    "AI Engineer": {
        icon: "🤖",
        description: "Design and build AI systems, neural networks, and intelligent applications for real-world problems.",
        relatedInterests: ["ai_ml", "research", "coding", "problem_solving"],
        requiredSkills: ["python", "ml_basics", "statistics", "c_cpp", "linux"],
        keyActivities: ["ai_ml", "research"],
        requiredSkillsList: ["Python", "Deep Learning", "TensorFlow", "PyTorch", "Mathematics", "NLP", "Computer Vision", "MLOps"],
        criticalSkills: ["Python", "Deep Learning", "Mathematics", "TensorFlow"],
        secondarySkills: ["Kubernetes", "Docker", "MLflow", "CUDA"],
        roadmapFocus: "ai"
    },
    "Web Developer": {
        icon: "🌐",
        description: "Create beautiful, interactive websites and web applications using modern frontend and backend technologies.",
        relatedInterests: ["web", "coding", "design", "mobile"],
        requiredSkills: ["html_css", "javascript", "react", "git", "sql"],
        keyActivities: ["web", "coding"],
        requiredSkillsList: ["HTML/CSS", "JavaScript", "React/Vue", "Node.js", "REST APIs", "Git", "SQL/NoSQL", "Responsive Design"],
        criticalSkills: ["HTML/CSS", "JavaScript", "React", "Git"],
        secondarySkills: ["TypeScript", "GraphQL", "Next.js", "MongoDB"],
        roadmapFocus: "webdev"
    },
    "UI/UX Designer": {
        icon: "🎨",
        description: "Design intuitive user interfaces and create delightful user experiences for apps and websites.",
        relatedInterests: ["design", "web", "coding", "research"],
        requiredSkills: ["figma", "html_css", "javascript"],
        keyActivities: ["design", "web"],
        requiredSkillsList: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "HTML/CSS", "Color Theory", "Typography"],
        criticalSkills: ["Figma", "User Research", "Wireframing", "Prototyping"],
        secondarySkills: ["After Effects", "Illustrator", "Accessibility", "Design Systems"],
        roadmapFocus: "uiux"
    }
};

/**
 * Skill emojis for visual skill tree display
 */
const skillEmojis = {
    "python": "🐍",
    "java": "☕",
    "javascript": "🟨",
    "html_css": "🌐",
    "sql": "🗄️",
    "c_cpp": "⚙️",
    "react": "⚛️",
    "ml_basics": "🤖",
    "git": "🗂️",
    "linux": "🐧",
    "figma": "🎨",
    "statistics": "📐"
};

/**
 * Skill display names for readable output
 */
const skillNames = {
    "python": "Python",
    "java": "Java",
    "javascript": "JavaScript",
    "html_css": "HTML/CSS",
    "sql": "SQL",
    "c_cpp": "C/C++",
    "react": "React",
    "ml_basics": "ML Basics",
    "git": "Git",
    "linux": "Linux",
    "figma": "Figma",
    "statistics": "Statistics"
};

/**
 * Interest display names
 */
const interestNames = {
    "coding": "Coding",
    "design": "UI/UX Design",
    "data": "Data Analysis",
    "ai_ml": "AI & ML",
    "web": "Web Dev",
    "mobile": "Mobile Apps",
    "cloud": "Cloud",
    "cybersecurity": "Security",
    "research": "Research",
    "problem_solving": "Problem Solving"
};

/* ---------- ROADMAP DATA ---------- */

/**
 * roadmaps object: semester-wise plan for each career path
 * Based on focus area. Each semester has title and tasks array.
 */
const roadmaps = {
    software: [
        {
            sem: 1,
            title: "Foundations of Programming",
            tasks: ["Learn C / C++ basics", "Study Data Structures (Arrays, Linked Lists)", "Basic Mathematics for CS", "Version control with Git"]
        },
        {
            sem: 2,
            title: "Core Computer Science",
            tasks: ["Object Oriented Programming (Java or Python)", "DBMS and SQL basics", "Operating Systems concepts", "Build 2-3 small projects"]
        },
        {
            sem: 3,
            title: "Intermediate Skills",
            tasks: ["Learn Python properly", "Study Algorithms and Complexity", "Computer Networks basics", "Contribute to GitHub"]
        },
        {
            sem: 4,
            title: "Advanced Concepts",
            tasks: ["System Design basics", "Design Patterns", "Java / Spring Boot intro", "Start competitive programming"]
        },
        {
            sem: 5,
            title: "Specialization & Projects",
            tasks: ["Full stack mini project", "Learn Docker basics", "Study for GATE / FAANG prep", "Internship preparation"]
        },
        {
            sem: 6,
            title: "Internship & Industry Prep",
            tasks: ["Apply for internships", "DSA revision and LeetCode", "Build a portfolio project", "Learn CI/CD basics"]
        },
        {
            sem: 7,
            title: "Pre-Placement Preparation",
            tasks: ["Mock interviews and DSA", "System design practice", "Resume building", "Industry project work"]
        },
        {
            sem: 8,
            title: "Placement & Final Project",
            tasks: ["Campus placements / job hunt", "Final year project submission", "Open source contribution", "Build LinkedIn profile"]
        }
    ],
    datascience: [
        {
            sem: 1,
            title: "Math & Programming Basics",
            tasks: ["Linear Algebra & Calculus basics", "Learn Python from scratch", "Introduction to Statistics", "Basic data manipulation with Python"]
        },
        {
            sem: 2,
            title: "Data Handling",
            tasks: ["NumPy and Pandas", "SQL and Database basics", "Data cleaning techniques", "Exploratory Data Analysis (EDA)"]
        },
        {
            sem: 3,
            title: "Machine Learning Basics",
            tasks: ["Supervised Learning algorithms", "Scikit-learn library", "Data visualization with Matplotlib/Seaborn", "First ML project"]
        },
        {
            sem: 4,
            title: "Intermediate ML",
            tasks: ["Unsupervised learning (Clustering)", "Feature engineering", "Model evaluation and metrics", "Kaggle beginner competitions"]
        },
        {
            sem: 5,
            title: "Deep Learning",
            tasks: ["Neural networks basics", "TensorFlow or PyTorch", "CNNs for image data", "NLP intro (text processing)"]
        },
        {
            sem: 6,
            title: "Specialization Projects",
            tasks: ["End-to-end ML project", "Deploy model using Flask/FastAPI", "Kaggle competitions", "Data Science internship"]
        },
        {
            sem: 7,
            title: "Industry Preparation",
            tasks: ["Big Data basics (Spark)", "MLOps concepts", "Resume and portfolio", "Interview preparation"]
        },
        {
            sem: 8,
            title: "Placement & Research",
            tasks: ["Final year capstone project", "Research paper (optional)", "Job applications", "Build GitHub data portfolio"]
        }
    ],
    dataanalyst: [
        {
            sem: 1,
            title: "Excel & Basic Statistics",
            tasks: ["Microsoft Excel formulas and pivot tables", "Basic Statistics (mean, median, mode)", "Introduction to SQL", "Learn to read data reports"]
        },
        {
            sem: 2,
            title: "SQL & Python Basics",
            tasks: ["Advanced SQL (joins, subqueries)", "Python with Pandas basics", "Data types and cleaning", "Simple analysis projects"]
        },
        {
            sem: 3,
            title: "Data Visualization",
            tasks: ["Power BI or Tableau basics", "Python visualization (Matplotlib)", "Dashboard creation", "Present data story projects"]
        },
        {
            sem: 4,
            title: "Statistical Analysis",
            tasks: ["Hypothesis testing", "Regression analysis", "A/B testing concepts", "Business Intelligence basics"]
        },
        {
            sem: 5,
            title: "Advanced Tools",
            tasks: ["Advanced Power BI / Tableau", "Python for data analysis", "ETL processes basics", "Real dataset projects (Kaggle)"]
        },
        {
            sem: 6,
            title: "Internship & Domain Knowledge",
            tasks: ["Data analyst internship", "Industry domain knowledge", "Portfolio of dashboards", "SQL optimization"]
        },
        {
            sem: 7,
            title: "Professional Skills",
            tasks: ["Business communication skills", "Report writing", "Advanced analytics", "Job preparation"]
        },
        {
            sem: 8,
            title: "Placement & Final Project",
            tasks: ["Final capstone analysis project", "Job applications", "LinkedIn profile and portfolio", "Data analytics certification"]
        }
    ],
    ai: [
        {
            sem: 1,
            title: "Strong Math Foundation",
            tasks: ["Linear Algebra (Vectors, Matrices)", "Calculus (derivatives, gradients)", "Probability & Statistics", "Python programming basics"]
        },
        {
            sem: 2,
            title: "Programming for AI",
            tasks: ["Python data structures", "NumPy and Pandas", "Algorithms and complexity", "Intro to AI concepts"]
        },
        {
            sem: 3,
            title: "Machine Learning",
            tasks: ["Supervised/Unsupervised learning", "Scikit-learn", "Model training and evaluation", "First AI mini project"]
        },
        {
            sem: 4,
            title: "Deep Learning",
            tasks: ["Neural networks from scratch", "TensorFlow and Keras", "CNNs and RNNs", "Transfer learning"]
        },
        {
            sem: 5,
            title: "Specialization",
            tasks: ["NLP (Natural Language Processing)", "Computer Vision", "Reinforcement Learning intro", "AI research papers reading"]
        },
        {
            sem: 6,
            title: "Advanced & Deployment",
            tasks: ["Model deployment (Flask/FastAPI)", "MLOps and containerization", "Real-world AI project", "AI internship"]
        },
        {
            sem: 7,
            title: "Research & Interview Prep",
            tasks: ["Read and implement research papers", "LeetCode for ML interviews", "Build AI portfolio on GitHub", "Prepare for AI company interviews"]
        },
        {
            sem: 8,
            title: "Placement & Capstone",
            tasks: ["Final year AI project", "Job or research applications", "Open source AI contributions", "Build personal AI blog/portfolio"]
        }
    ],
    webdev: [
        {
            sem: 1,
            title: "HTML, CSS & JavaScript Basics",
            tasks: ["HTML5 structure and semantics", "CSS3 styling and layout (Flexbox/Grid)", "Basic JavaScript (variables, loops, functions)", "Build a static personal website"]
        },
        {
            sem: 2,
            title: "Intermediate Web",
            tasks: ["Responsive web design", "DOM manipulation with JavaScript", "Introduction to React", "Git and GitHub for web projects"]
        },
        {
            sem: 3,
            title: "Frontend Frameworks",
            tasks: ["React.js (components, state, props)", "CSS frameworks basics (brief intro)", "API integration (fetch, Axios)", "Build a weather app or to-do app"]
        },
        {
            sem: 4,
            title: "Backend Basics",
            tasks: ["Node.js and Express.js", "SQL / MongoDB basics", "REST API creation", "Full-stack mini project"]
        },
        {
            sem: 5,
            title: "Advanced Web Dev",
            tasks: ["Authentication (JWT, Sessions)", "Next.js / TypeScript basics", "Web security basics", "Deploy projects on Netlify/Vercel"]
        },
        {
            sem: 6,
            title: "Portfolio & Internship",
            tasks: ["Web developer internship", "Build 3 portfolio projects", "Open source contribution", "Learn Web performance optimization"]
        },
        {
            sem: 7,
            title: "Specialization",
            tasks: ["Pick a stack: MERN or MEAN", "GraphQL basics", "Testing (Jest, Cypress)", "Interview prep and DSA"]
        },
        {
            sem: 8,
            title: "Placement & Final Project",
            tasks: ["Final full-stack capstone project", "Job applications", "Freelancing side projects", "Web dev certifications"]
        }
    ],
    uiux: [
        {
            sem: 1,
            title: "Design Fundamentals",
            tasks: ["Color theory and typography basics", "Design principles (alignment, contrast)", "Introduction to Figma", "Study popular apps' UI"]
        },
        {
            sem: 2,
            title: "UI Design Basics",
            tasks: ["Figma components and auto-layout", "Wireframing techniques", "Mobile vs Web design patterns", "Design a simple mobile app UI"]
        },
        {
            sem: 3,
            title: "UX Concepts",
            tasks: ["User research methods", "User personas and journey maps", "Usability testing", "Information architecture"]
        },
        {
            sem: 4,
            title: "Prototyping",
            tasks: ["Interactive prototypes in Figma", "Micro-interactions and animations", "Design systems creation", "Present case study"]
        },
        {
            sem: 5,
            title: "Advanced Design",
            tasks: ["Design for accessibility (WCAG)", "Motion design basics", "Design handoff to developers", "Redesign challenge (existing app)"]
        },
        {
            sem: 6,
            title: "Portfolio & Internship",
            tasks: ["UI/UX internship", "Build portfolio on Behance/Dribbble", "3+ case studies portfolio", "Client project practice"]
        },
        {
            sem: 7,
            title: "Research & Specialization",
            tasks: ["UX research specialization", "Design strategy basics", "Product thinking", "Interview preparation"]
        },
        {
            sem: 8,
            title: "Placement & Capstone",
            tasks: ["Final design project/capstone", "Job applications", "Personal design brand", "Contribute to open source design"]
        }
    ]
};

/**
 * Project suggestions for each career with 3 levels
 */
const projectSuggestions = {
    "Software Engineer": {
        beginner: [
            { icon: "🧮", title: "Calculator App", desc: "Build a simple scientific calculator with all basic operations.", tech: ["HTML", "CSS", "JavaScript"] },
            { icon: "📝", title: "To-Do List App", desc: "Create a task management app with add, delete, complete features.", tech: ["HTML", "CSS", "JavaScript"] },
            { icon: "🎮", title: "Tic-Tac-Toe Game", desc: "Classic 2-player game with win detection logic.", tech: ["Python", "HTML"] }
        ],
        intermediate: [
            { icon: "🌤️", title: "Weather App", desc: "Fetch real-time weather data using API and display nicely.", tech: ["JavaScript", "REST API", "CSS"] },
            { icon: "📚", title: "Library Management", desc: "Full CRUD app to manage books with user login.", tech: ["Python", "SQLite", "Flask"] },
            { icon: "💬", title: "Chat Application", desc: "Real-time chat app using WebSockets or polling.", tech: ["Node.js", "Socket.io", "React"] }
        ],
        advanced: [
            { icon: "🏪", title: "E-Commerce Platform", desc: "Full-stack shopping site with cart, payment and admin panel.", tech: ["React", "Node.js", "MongoDB"] },
            { icon: "🔗", title: "URL Shortener", desc: "Build Bit.ly clone with analytics and custom URLs.", tech: ["Python", "Redis", "FastAPI"] },
            { icon: "🤝", title: "Collaboration Tool", desc: "Real-time document editing similar to Google Docs.", tech: ["React", "Node.js", "WebSocket"] }
        ]
    },
    "Data Scientist": {
        beginner: [
            { icon: "📊", title: "Data Exploration (EDA)", desc: "Analyze Titanic or Iris dataset and create visualizations.", tech: ["Python", "Pandas", "Matplotlib"] },
            { icon: "🏡", title: "House Price Analysis", desc: "Explore housing data and find price patterns.", tech: ["Python", "Seaborn", "NumPy"] },
            { icon: "📉", title: "Stock Data Visualization", desc: "Plot stock price trends and moving averages.", tech: ["Python", "Pandas", "Plotly"] }
        ],
        intermediate: [
            { icon: "🎬", title: "Movie Recommendation", desc: "Build a content-based recommendation system.", tech: ["Python", "Scikit-learn", "Pandas"] },
            { icon: "😊", title: "Sentiment Analyzer", desc: "Analyze Twitter or product reviews for sentiment.", tech: ["Python", "NLTK", "ML"] },
            { icon: "🏃", title: "Customer Churn Prediction", desc: "Predict which customers are likely to leave.", tech: ["Python", "Scikit-learn", "SQL"] }
        ],
        advanced: [
            { icon: "🧠", title: "Image Classifier CNN", desc: "Train a deep learning model to classify images.", tech: ["TensorFlow", "Keras", "Python"] },
            { icon: "💬", title: "Chatbot with NLP", desc: "Build an FAQ chatbot using BERT or LSTM.", tech: ["Python", "HuggingFace", "PyTorch"] },
            { icon: "📡", title: "Real-time Analytics Dashboard", desc: "Stream and visualize data in real-time.", tech: ["Kafka", "Spark", "Kibana"] }
        ]
    },
    "Data Analyst": {
        beginner: [
            { icon: "📋", title: "Sales Dashboard", desc: "Create an Excel or Power BI dashboard showing sales KPIs.", tech: ["Excel", "Power BI"] },
            { icon: "🏥", title: "Healthcare Data Analysis", desc: "Analyze patient data and find trends.", tech: ["Excel", "Python", "SQL"] },
            { icon: "🛒", title: "Superstore Analysis", desc: "Analyze retail data and build Tableau viz.", tech: ["Tableau", "Excel"] }
        ],
        intermediate: [
            { icon: "📦", title: "Inventory Tracking System", desc: "Track and visualize product inventory with alerts.", tech: ["SQL", "Power BI", "Python"] },
            { icon: "🌍", title: "COVID-19 Data Tracker", desc: "Analyze and visualize COVID data by country.", tech: ["Python", "Plotly", "Pandas"] },
            { icon: "💰", title: "Financial Budget Analyzer", desc: "Build personal finance tracker with visual insights.", tech: ["Python", "Dash", "SQL"] }
        ],
        advanced: [
            { icon: "🏦", title: "Bank Transaction Analyzer", desc: "Detect spending patterns and anomalies in transactions.", tech: ["Python", "SQL", "Power BI"] },
            { icon: "📺", title: "Netflix Analytics Dashboard", desc: "Analyze Netflix dataset for content trends.", tech: ["Python", "Tableau", "SQL"] },
            { icon: "🎯", title: "Marketing Campaign Analysis", desc: "Measure ROI and effectiveness of campaigns.", tech: ["Python", "A/B Testing", "Power BI"] }
        ]
    },
    "AI Engineer": {
        beginner: [
            { icon: "🌸", title: "Iris Flower Classifier", desc: "Classic ML beginner project to classify flower types.", tech: ["Python", "Scikit-learn"] },
            { icon: "✉️", title: "Email Spam Detector", desc: "Build a Naive Bayes spam classifier.", tech: ["Python", "NLTK", "ML"] },
            { icon: "🔢", title: "Digit Recognizer", desc: "Recognize handwritten digits using MNIST dataset.", tech: ["Python", "TensorFlow"] }
        ],
        intermediate: [
            { icon: "🎭", title: "Face Detection App", desc: "Detect faces in images using OpenCV + deep learning.", tech: ["Python", "OpenCV", "TensorFlow"] },
            { icon: "🎵", title: "Music Genre Classifier", desc: "Classify music genre from audio features.", tech: ["Python", "Librosa", "ML"] },
            { icon: "📖", title: "Text Summarizer", desc: "Auto-summarize news articles using NLP.", tech: ["Python", "HuggingFace", "NLP"] }
        ],
        advanced: [
            { icon: "🎨", title: "Image Style Transfer", desc: "Apply artistic style of one image to another.", tech: ["PyTorch", "CNN", "Python"] },
            { icon: "🤖", title: "Conversational AI Bot", desc: "Build GPT-based chatbot for Q&A.", tech: ["HuggingFace", "FastAPI", "Python"] },
            { icon: "🚗", title: "Self-Driving Car Sim", desc: "Train a RL agent to drive in a simulated environment.", tech: ["Python", "OpenAI Gym", "PyTorch"] }
        ]
    },
    "Web Developer": {
        beginner: [
            { icon: "👤", title: "Personal Portfolio", desc: "Build a responsive portfolio website to showcase yourself.", tech: ["HTML", "CSS", "JavaScript"] },
            { icon: "🌤️", title: "Weather App", desc: "Fetch and display weather data using public API.", tech: ["HTML", "CSS", "JavaScript"] },
            { icon: "📝", title: "Blog Website", desc: "Static blog with multiple pages and navigation.", tech: ["HTML", "CSS"] }
        ],
        intermediate: [
            { icon: "🛒", title: "Shopping Cart UI", desc: "Interactive product listing with cart functionality.", tech: ["React", "JavaScript", "CSS"] },
            { icon: "🍕", title: "Food Ordering App", desc: "Restaurant menu with ordering and total calculation.", tech: ["React", "Firebase"] },
            { icon: "💬", title: "Real-Time Chat", desc: "Chat app with rooms using WebSockets.", tech: ["Node.js", "Socket.io", "React"] }
        ],
        advanced: [
            { icon: "🏪", title: "Full-Stack E-Commerce", desc: "Complete shop with auth, payment gateway and admin.", tech: ["React", "Node.js", "MongoDB"] },
            { icon: "📊", title: "Analytics Dashboard", desc: "Real-time dashboard with charts and filters.", tech: ["React", "D3.js", "Node.js"] },
            { icon: "📱", title: "Progressive Web App", desc: "Offline-capable PWA with push notifications.", tech: ["JavaScript", "Service Worker", "React"] }
        ]
    },
    "UI/UX Designer": {
        beginner: [
            { icon: "📱", title: "Mobile App Redesign", desc: "Pick an existing app and redesign its UI in Figma.", tech: ["Figma"] },
            { icon: "🌐", title: "Landing Page Design", desc: "Design a modern SaaS product landing page.", tech: ["Figma", "HTML", "CSS"] },
            { icon: "🎨", title: "Icon Set Design", desc: "Create a consistent set of 30+ custom icons.", tech: ["Figma", "Illustrator"] }
        ],
        intermediate: [
            { icon: "🛍️", title: "E-Commerce App Design", desc: "Complete UI design for a shopping app with all screens.", tech: ["Figma", "Prototype"] },
            { icon: "🏥", title: "Healthcare App UI", desc: "Design a doctor appointment booking app.", tech: ["Figma", "User Research"] },
            { icon: "📚", title: "EdTech Platform UI", desc: "Design an online learning platform with courses.", tech: ["Figma", "Design System"] }
        ],
        advanced: [
            { icon: "🎯", title: "UX Case Study", desc: "Full UX research + design project for a real problem.", tech: ["Figma", "Research", "Prototype"] },
            { icon: "🔄", title: "Design System Library", desc: "Build a complete design system like Material UI.", tech: ["Figma", "Components", "Tokens"] },
            { icon: "🌟", title: "Award-worthy Portfolio", desc: "Create a Behance case study-worthy design portfolio.", tech: ["Figma", "Behance", "Dribble"] }
        ]
    }
};

/* ============================================
   MAIN APPLICATION LOGIC
   ============================================ */

/* Global variable to store form data after submission */
let studentData = {};

/* ---- Wait for DOM to be fully loaded before running ---- */
document.addEventListener("DOMContentLoaded", function () {

    // Initialize all event listeners
    initEventListeners();

    // Initialize scroll reveal animation
    initScrollReveal();

    // Initialize navigation hamburger menu
    initNavigation();
});

/* ---------- INITIALIZE EVENT LISTENERS ---------- */
/**
 * Sets up all button clicks and form submit handlers
 */
function initEventListeners() {

    // "Start Assessment" button on hero section scrolls to form
    const startBtn = document.getElementById("startAssessmentBtn");
    if (startBtn) {
        startBtn.addEventListener("click", function () {
            document.getElementById("assessment").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Form submit event - main entry point
    const form = document.getElementById("assessmentForm");
    if (form) {
        form.addEventListener("submit", handleFormSubmit);
    }

    // Reset form button
    const resetBtn = document.getElementById("resetFormBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            clearAllErrors();
        });
    }

    // Print roadmap button
    const printBtn = document.getElementById("printRoadmapBtn");
    if (printBtn) {
        printBtn.addEventListener("click", function () {
            window.print();
        });
    }

    // New Assessment button (scrolls back to form and hides results)
    const newBtn = document.getElementById("newAssessmentBtn");
    if (newBtn) {
        newBtn.addEventListener("click", function () {
            document.getElementById("resultsSection").classList.add("hidden");
            document.getElementById("assessment").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Project tab buttons
    const beginnerTab = document.getElementById("beginnerTab");
    const intermediateTab = document.getElementById("intermediateTab");
    const advancedTab = document.getElementById("advancedTab");

    if (beginnerTab) {
        beginnerTab.addEventListener("click", function () {
            switchProjectTab("beginner");
        });
    }
    if (intermediateTab) {
        intermediateTab.addEventListener("click", function () {
            switchProjectTab("intermediate");
        });
    }
    if (advancedTab) {
        advancedTab.addEventListener("click", function () {
            switchProjectTab("advanced");
        });
    }
}

/* ---------- NAVIGATION HAMBURGER MENU ---------- */
/**
 * Handles mobile nav toggle
 */
function initNavigation() {
    const hamburger = document.getElementById("hamburgerBtn");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function () {
            navLinks.classList.toggle("open");
        });
    }

    // Close nav when a link is clicked
    const links = document.querySelectorAll(".nav-link");
    links.forEach(function (link) {
        link.addEventListener("click", function () {
            if (navLinks) navLinks.classList.remove("open");
        });
    });
}

/* ---------- SCROLL REVEAL ANIMATION ---------- */
/**
 * Adds .visible class to elements when they scroll into view
 */
function initScrollReveal() {
    // Add reveal class to sections
    const sections = document.querySelectorAll(".features-section, .dashboard-section, .roadmap-section");
    sections.forEach(function (section) {
        section.classList.add("reveal");
    });

    // Listen for scroll events
    window.addEventListener("scroll", function () {
        const reveals = document.querySelectorAll(".reveal");
        reveals.forEach(function (el) {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < windowHeight - 100) {
                el.classList.add("visible");
            }
        });
    });
}

/* ============================================
   FORM HANDLING & VALIDATION
   ============================================ */

/**
 * Called when the assessment form is submitted.
 * Validates data, collects inputs, and generates results.
 */
function handleFormSubmit(event) {
    event.preventDefault();        // Prevent page reload

    // Step 1: Validate the form
    if (!validateForm()) {
        showToast("Please fill in all required fields.", "error");
        return;
    }

    // Step 2: Collect form data
    studentData = collectFormData();

    // Step 3: Show loading effect briefly then render results
    showLoadingOnButton();

    setTimeout(function () {
        // Step 4: Generate and render all results
        generateResults(studentData);

        // Step 5: Show results section
        const resultsSection = document.getElementById("resultsSection");
        resultsSection.classList.remove("hidden");

        // Step 6: Smooth scroll to results
        resultsSection.scrollIntoView({ behavior: "smooth" });

        showToast("Your personalized roadmap is ready! 🎉", "success");
        resetButtonState();
    }, 1500);
}

/**
 * Shows loading spinner on the submit button while processing
 */
function showLoadingOnButton() {
    const btn = document.querySelector(".btn-large");
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Generating your roadmap...';
    }
}

/**
 * Resets button back to normal state
 */
function resetButtonState() {
    const btn = document.querySelector(".btn-large");
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = "🔍 Generate My Career Roadmap";
    }
}

/**
 * Validates all form fields.
 * Returns true if valid, false if any field has an error.
 */
function validateForm() {
    let isValid = true;
    clearAllErrors();

    // Check student name
    const name = document.getElementById("studentName").value.trim();
    if (!name || name.length < 2) {
        showError("studentName", "nameError", "Please enter your full name (at least 2 characters).");
        isValid = false;
    }

    // Check degree
    const degree = document.getElementById("degree").value;
    if (!degree) {
        showError("degree", "degreeError", "Please select your degree.");
        isValid = false;
    }

    // Check branch
    const branch = document.getElementById("branch").value;
    if (!branch) {
        showError("branch", "branchError", "Please select your branch.");
        isValid = false;
    }

    // Check current year
    const year = document.getElementById("currentYear").value;
    if (!year) {
        showError("currentYear", "yearError", "Please select your current year.");
        isValid = false;
    }

    // Check interests (at least 1 selected)
    const interests = document.querySelectorAll('input[name="interests"]:checked');
    if (interests.length === 0) {
        document.getElementById("interestsError").textContent = "Please select at least one interest.";
        isValid = false;
    }

    // Check skills (at least 1 selected)
    const skills = document.querySelectorAll('input[name="skills"]:checked');
    if (skills.length === 0) {
        document.getElementById("skillsError").textContent = "Please select at least one skill.";
        isValid = false;
    }

    // Check preferred career
    const career = document.getElementById("preferredCareer").value;
    if (!career) {
        showError("preferredCareer", "careerError", "Please select your preferred career.");
        isValid = false;
    }

    return isValid;
}

/**
 * Shows error message for a specific field
 * @param {string} fieldId - The input element ID
 * @param {string} errorId - The error span ID
 * @param {string} message - Error message to display
 */
function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);

    if (field) field.classList.add("error");
    if (errorEl) errorEl.textContent = message;
}

/**
 * Clears all validation errors from the form
 */
function clearAllErrors() {
    // Remove error class from all inputs
    const inputs = document.querySelectorAll(".form-group input, .form-group select");
    inputs.forEach(function (input) {
        input.classList.remove("error");
    });

    // Clear all error messages
    const errorMsgs = document.querySelectorAll(".error-msg");
    errorMsgs.forEach(function (msg) {
        msg.textContent = "";
    });
}

/**
 * Collects all form data and returns as an object
 * @returns {object} - All student data from the form
 */
function collectFormData() {
    // Get all checked interests
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]:checked');
    const interests = Array.from(interestCheckboxes).map(function (cb) { return cb.value; });

    // Get all checked skills
    const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
    const skills = Array.from(skillCheckboxes).map(function (cb) { return cb.value; });

    return {
        name: document.getElementById("studentName").value.trim(),
        degree: document.getElementById("degree").value,
        branch: document.getElementById("branch").value,
        year: parseInt(document.getElementById("currentYear").value),
        interests: interests,
        skills: skills,
        preferredCareer: document.getElementById("preferredCareer").value
    };
}

/* ============================================
   CAREER RECOMMENDATION SCORING SYSTEM
   ============================================ */

/**
 * Calculates a weighted score for each career based on student data.
 *
 * Scoring breakdown:
 *   - Interests match: 40%
 *   - Skills match:    30%
 *   - Preferred activity match (interests as activity): 20%
 *   - Dream career selection: 10%
 *
 * @param {object} data - Student data object
 * @returns {array} - Sorted array of career objects with scores
 */
function calculateCareerScores(data) {
    const scores = [];

    // Loop through each career and calculate its score
    for (const careerName in careerData) {
        const career = careerData[careerName];
        let totalScore = 0;

        /* --- 1. Interests Score (40% weight) --- */
        const interestMatches = career.relatedInterests.filter(function (interest) {
            return data.interests.includes(interest);
        }).length;

        // Max possible interest matches for this career
        const maxInterests = career.relatedInterests.length;
        const interestScore = maxInterests > 0 ? (interestMatches / maxInterests) * 40 : 0;
        totalScore += interestScore;

        /* --- 2. Skills Score (30% weight) --- */
        const skillMatches = career.requiredSkills.filter(function (skill) {
            return data.skills.includes(skill);
        }).length;

        const maxSkills = career.requiredSkills.length;
        const skillScore = maxSkills > 0 ? (skillMatches / maxSkills) * 30 : 0;
        totalScore += skillScore;

        /* --- 3. Activity/Preferred type Score (20% weight) --- */
        // Using keyActivities to see if student's interests align with activity type
        const activityMatches = career.keyActivities.filter(function (activity) {
            return data.interests.includes(activity);
        }).length;

        const activityScore = activityMatches > 0 ? Math.min(activityMatches * 10, 20) : 0;
        totalScore += activityScore;

        /* --- 4. Dream Career Score (10% weight) --- */
        // Give 10 points if this career matches student's preferred career
        if (data.preferredCareer === careerName) {
            totalScore += 10;
        }

        // Round to 1 decimal place
        totalScore = Math.round(totalScore * 10) / 10;

        scores.push({
            name: careerName,
            score: totalScore,
            percentage: Math.min(Math.round(totalScore), 100),
            interestScore: Math.round(interestScore),
            skillScore: Math.round(skillScore),
            activityScore: Math.round(activityScore),
            dreamScore: data.preferredCareer === careerName ? 10 : 0
        });
    }

    // Sort by score descending (highest first)
    scores.sort(function (a, b) { return b.score - a.score; });

    return scores;
}

/* ============================================
   RESULT GENERATION - Main Function
   ============================================ */

/**
 * Main function that orchestrates all result generation.
 * Called after form submission.
 * @param {object} data - Collected student form data
 */
function generateResults(data) {
    // Calculate scores for all careers
    const careerScores = calculateCareerScores(data);

    // Top recommended career (rank 1)
    const topCareer = careerScores[0];

    // Generate each section
    renderProfileSummary(data);
    renderCareerCards(careerScores);
    renderSkillGapAnalyzer(data, topCareer.name);
    renderReadinessScore(data, topCareer.name);
    renderSkillTree(data, topCareer.name);
    renderRoadmap(data);
    renderProjectSuggestions(topCareer.name);
    renderProgressTracker(data, topCareer.name);
}

/* ============================================
   SECTION RENDERERS
   ============================================ */

/**
 * Renders the student profile summary chips at the top of dashboard
 * @param {object} data - Student data
 */
function renderProfileSummary(data) {
    const container = document.getElementById("profileSummary");
    if (!container) return;

    container.innerHTML = `
        <div class="profile-chip">👤 ${data.name}</div>
        <div class="profile-chip">🎓 ${data.degree}</div>
        <div class="profile-chip">📚 ${data.branch}</div>
        <div class="profile-chip">📅 Year ${data.year}</div>
        <div class="profile-chip">🎯 ${data.preferredCareer}</div>
        <div class="profile-chip">💡 ${data.interests.length} Interests</div>
        <div class="profile-chip">⚙️ ${data.skills.length} Skills</div>
    `;
}

/**
 * Renders the top 3 career recommendation cards with progress bars
 * @param {array} careerScores - Sorted array of career scores
 */
function renderCareerCards(careerScores) {
    const container = document.getElementById("careerCardsGrid");
    if (!container) return;

    // Only show top 3 careers
    const top3 = careerScores.slice(0, 3);
    const rankClasses = ["rank-1", "rank-2", "rank-3"];
    const badgeClasses = ["gold", "silver", "bronze"];
    const rankLabels = ["🥇", "🥈", "🥉"];

    let html = "";

    top3.forEach(function (career, index) {
        const careerInfo = careerData[career.name];

        // Build reason tags based on why this career matches
        const reasons = [];
        if (career.interestScore > 10) reasons.push("Interest Match");
        if (career.skillScore > 10) reasons.push("Skill Match");
        if (career.activityScore > 0) reasons.push("Activity Fit");
        if (career.dreamScore > 0) reasons.push("Dream Career ⭐");

        const reasonTags = reasons.map(function (r) {
            return `<span class="reason-tag">${r}</span>`;
        }).join("");

        html += `
            <div class="career-card ${rankClasses[index]}">
                <div class="rank-badge ${badgeClasses[index]}">${rankLabels[index]}</div>
                <span class="career-card-icon">${careerInfo.icon}</span>
                <h3 class="career-card-title">${career.name}</h3>
                <p class="career-card-desc">${careerInfo.description}</p>
                <div class="match-label">
                    <span>Career Match</span>
                    <span>${career.percentage}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" data-width="${career.percentage}"></div>
                </div>
                <div class="career-reasons">${reasonTags}</div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Animate progress bars after rendering
    // Small timeout so CSS transition works properly
    setTimeout(function () {
        const bars = container.querySelectorAll(".progress-bar-fill");
        bars.forEach(function (bar) {
            const width = bar.getAttribute("data-width");
            bar.style.width = width + "%";
        });
    }, 300);
}

/**
 * Renders the skill gap analyzer section.
 * Shows: current skills, required skills, missing skills, critical & secondary
 * @param {object} data - Student data
 * @param {string} careerName - Top recommended career name
 */
function renderSkillGapAnalyzer(data, careerName) {
    const container = document.getElementById("skillGapContainer");
    if (!container) return;

    const career = careerData[careerName];

    // Get user's current skills as readable names
    const currentSkills = data.skills.map(function (s) { return skillNames[s] || s; });

    // Get required skills for this career
    const requiredSkills = career.requiredSkillsList;

    // Skills the user has that are relevant to this career
    const relevantSkills = data.skills
        .map(function (s) { return skillNames[s]; })
        .filter(function (s) { return requiredSkills.includes(s); });

    // Missing skills = required but not in user's skills
    const missingSkills = requiredSkills.filter(function (skill) {
        return !relevantSkills.includes(skill);
    });

    // Critical missing skills
    const criticalMissing = career.criticalSkills.filter(function (skill) {
        return missingSkills.includes(skill);
    });

    // Secondary skills
    const secondarySkills = career.secondarySkills;

    // Helper to build badge HTML
    function buildBadges(skillsList, badgeClass, prefix) {
        if (skillsList.length === 0) {
            return `<span style="color: var(--text-secondary); font-size: 0.85rem;">None</span>`;
        }
        return skillsList.map(function (skill) {
            return `<span class="skill-badge ${badgeClass}">${prefix} ${skill}</span>`;
        }).join("");
    }

    container.innerHTML = `
        <div class="skill-column">
            <div class="skill-column-header green">✅ Your Current Skills</div>
            <div>${buildBadges(currentSkills, "learned", "✓")}</div>
        </div>
        <div class="skill-column">
            <div class="skill-column-header red">❌ Missing Skills</div>
            <div>${buildBadges(missingSkills, "missing", "✗")}</div>
        </div>
        <div class="skill-column">
            <div class="skill-column-header yellow">⚠️ Critical Skills Needed</div>
            <div>${buildBadges(criticalMissing, "critical", "🔥")}</div>
        </div>
        <div class="skill-column">
            <div class="skill-column-header blue">💡 Secondary Skills</div>
            <div>${buildBadges(secondarySkills, "secondary", "➕")}</div>
        </div>
    `;
}

/**
 * Renders the circular readiness score and breakdown bars
 * @param {object} data - Student data
 * @param {string} careerName - Top recommended career
 */
function renderReadinessScore(data, careerName) {
    const percentEl = document.getElementById("readinessPercent");
    const messageEl = document.getElementById("readinessMessage");
    const ringFill = document.getElementById("progressRingFill");
    const breakdownEl = document.getElementById("readinessBreakdown");

    if (!percentEl || !ringFill) return;

    const career = careerData[careerName];

    // Calculate skill readiness: how many required skills user has
    const userSkillNames = data.skills.map(function (s) { return skillNames[s]; });
    const requiredSkills = career.requiredSkillsList;

    const matchedSkills = requiredSkills.filter(function (skill) {
        return userSkillNames.includes(skill);
    });

    const skillReadiness = requiredSkills.length > 0 ? Math.round((matchedSkills.length / requiredSkills.length) * 100) : 0;

    // Calculate interest alignment
    const interestMatches = career.relatedInterests.filter(function (interest) {
        return data.interests.includes(interest);
    }).length;
    const interestReadiness = career.relatedInterests.length > 0 ? Math.round((interestMatches / career.relatedInterests.length) * 100) : 0;

    // Calculate year progress (how far along in degree)
    const yearProgress = Math.round((data.year / 4) * 100);

    // Overall readiness = weighted average
    const overallReadiness = Math.round(skillReadiness * 0.5 + interestReadiness * 0.3 + yearProgress * 0.2);

    // Update circular progress ring
    const circumference = 2 * Math.PI * 54; // radius = 54
    const offset = circumference - (overallReadiness / 100) * circumference;

    ringFill.style.strokeDasharray = circumference;
    ringFill.style.strokeDashoffset = circumference;

    // Animate the ring
    setTimeout(function () {
        ringFill.style.transition = "stroke-dashoffset 1.5s ease-in-out";
        ringFill.style.strokeDashoffset = offset;
    }, 500);

    // Update percentage text
    animateCounter(percentEl, 0, overallReadiness, 1500);

    // Update message
    let message = "";
    if (overallReadiness >= 80) {
        message = "🌟 Excellent! You're highly prepared for this career path!";
    } else if (overallReadiness >= 60) {
        message = "👍 Good progress! A few more skills and you'll be ready.";
    } else if (overallReadiness >= 40) {
        message = "📈 You're on the right track. Focus on building core skills.";
    } else {
        message = "🚀 Great starting point! Follow the roadmap to build your skills.";
    }
    if (messageEl) messageEl.textContent = message;

    // Render breakdown bars
    if (breakdownEl) {
        breakdownEl.innerHTML = `
        <div class="breakdown-item">
            <div class="breakdown-header">
                <span>⚙️ Skill Match</span>
                <span>${skillReadiness}%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" data-width="${skillReadiness}"></div>
            </div>
        </div>

        <div class="breakdown-item">
            <div class="breakdown-header">
                <span>💡 Interest Alignment</span>
                <span>${interestReadiness}%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" data-width="${interestReadiness}"></div>
            </div>
        </div>

        <div class="breakdown-item">
            <div class="breakdown-header">
                <span>📅 Academic Progress</span>
                <span>${yearProgress}%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" data-width="${yearProgress}"></div>
            </div>
        </div>
        `;

        // Animate breakdown bars
        setTimeout(function () {
            const bars = breakdownEl.querySelectorAll(".progress-bar-fill");
            bars.forEach(function (bar) {
                const width = bar.getAttribute("data-width");
                bar.style.width = width + "%";
            });
        }, 600);
    }
}

/**
 * Animates a number counter from start to end value
 * @param {HTMLElement} element - The element to update
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, start, end, duration) {
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.round(progress * (end - start) + start);
        element.textContent = currentValue + "%";

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

/**
 * Renders the visual skill tree showing user's skills with emojis
 * @param {object} data - Student data
 * @param {string} careerName - Top recommended career
 */
function renderSkillTree(data, careerName) {
    const container = document.getElementById("skillTreeContainer");
    if (!container) return;

    const career = careerData[careerName];
    const userSkills = data.skills;

    // Build skill tree nodes
    let html = '';

    // All possible skills from career's required list
    const allSkillKeys = Object.keys(skillNames);

    allSkillKeys.forEach(function (skillKey) {
        const isLearned = userSkills.includes(skillKey);
        const isRequired = career.requiredSkills.includes(skillKey);
        const emoji = skillEmojis[skillKey] || "📌";
        const name = skillNames[skillKey];

        let nodeClass = "skill-node";
        let statusIcon = "";

        if (isLearned && isRequired) {
            nodeClass += " learned required";
            statusIcon = "✅";
        } else if (isLearned && !isRequired) {
            nodeClass += " learned";
            statusIcon = "✓";
        } else if (!isLearned && isRequired) {
            nodeClass += " needed";
            statusIcon = "🔒";
        } else {
            nodeClass += " optional";
            statusIcon = "○";
        }

        html += `
        <div class="${nodeClass}">
            <span class="skill-emoji">${emoji}</span>
            <span class="skill-name">${name}</span>
            <span class="skill-status">${statusIcon}</span>
        </div>
        `;
    });

    html += '';

    // Add legend
    html += `
        
             Learned & Required
             Learned (Bonus)
             Needed (Learn Next)
             Optional
        
    `;

    container.innerHTML = html;
}

/**
 * Renders the semester-wise roadmap based on career and current year
 * @param {object} data - Student data
 */
function renderRoadmap(data) {
    const container = document.getElementById("roadmapTimeline");
    if (!container) return;

    const career = careerData[data.preferredCareer];
    if (!career) return;

    const roadmapKey = career.roadmapFocus;
    const roadmapData = roadmaps[roadmapKey];

    if (!roadmapData) {
        container.innerHTML = 'Roadmap not available for this career.';
        return;
    }

    // Determine current semester based on year
    const currentSemester = (data.year * 2) - 1; // Approximate: year 1 = sem 1-2, year 2 = sem 3-4, etc.

    let html = "";

    roadmapData.forEach(function (semester, index) {
        const semNumber = semester.sem;
        let statusClass = "";
        let statusIcon = "";

        if (semNumber < currentSemester) {
            statusClass = "completed";
            statusIcon = "✅";
        } else if (semNumber === currentSemester || semNumber === currentSemester + 1) {
            statusClass = "current";
            statusIcon = "📍";
        } else {
            statusClass = "upcoming";
            statusIcon = "🔮";
        }

        const tasksHTML = semester.tasks.map(function (task) {
            const taskStatus = semNumber < currentSemester ? "checked" : "";
            return `
                
                    ${semNumber < currentSemester ? "☑️" : "☐"}
                    ${task}
                
            `;
        }).join("");

        html += `
        <div class="timeline-item ${statusClass}">
            <div class="timeline-marker">${statusIcon}</div>

            <div class="timeline-content">
                <h3>Semester ${semNumber}</h3>
                <h4>${semester.title}</h4>

                <ul>
                    ${semester.tasks.map(task => `<li>${task}</li>`).join("")}
                </ul>
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Renders project suggestions for the recommended career
 * Starts with beginner tab active
 * @param {string} careerName - Top recommended career
 */
function renderProjectSuggestions(careerName) {
    const container = document.getElementById("projectsContainer");
    if (!container) return;

    // Store career name globally for tab switching
    container.setAttribute("data-career", careerName);

    // Render beginner projects by default
    renderProjectCards(careerName, "beginner");

    // Set beginner tab as active
    setActiveTab("beginner");
}

/**
 * Renders project cards for a specific difficulty level
 * @param {string} careerName - Career name
 * @param {string} level - "beginner", "intermediate", or "advanced"
 */
function renderProjectCards(careerName, level) {
    const container = document.getElementById("projectsContainer");
    if (!container) return;

    const projects = projectSuggestions[careerName];
    if (!projects || !projects[level]) {
        container.innerHTML = 'No projects available for this level.';
        return;
    }

    const projectList = projects[level];

    let html = '';

    projectList.forEach(function (project) {
        const techTags = project.tech.map(function (tech) {
            return `<span class="tech-badge">${tech}</span>`;
        }).join("");
        html += `
        <div class="project-card">
            <div class="project-icon">${project.icon}</div>

            <h3>${project.title}</h3>

            <p>${project.desc}</p>

            <div class="tech-stack">
                ${techTags}
            </div>
        </div>
        `;
    });

    html += '';
    container.innerHTML = html;
}

/**
 * Switches project tab and re-renders projects
 * @param {string} level - "beginner", "intermediate", or "advanced"
 */
function switchProjectTab(level) {
    const container = document.getElementById("projectsContainer");
    if (!container) return;

    const careerName = container.getAttribute("data-career");
    if (!careerName) return;

    // Re-render projects for selected level
    renderProjectCards(careerName, level);

    // Update active tab styling
    setActiveTab(level);
}

/**
 * Sets the active state on the correct tab button
 * @param {string} activeLevel - The level to make active
 */
function setActiveTab(activeLevel) {
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(function (tab) {
        tab.classList.remove("active");
    });

    const activeBtn = document.getElementById(activeLevel + "Tab");
    if (activeBtn) {
        activeBtn.classList.add("active");
    }
}

/**
 * Renders the progress tracker showing overall journey stats
 * @param {object} data - Student data
 * @param {string} careerName - Top recommended career
 */
function renderProgressTracker(data, careerName) {
    const container = document.getElementById("progressTracker");
    if (!container) return;

    const career = careerData[careerName];

    // Calculate various metrics
    const totalSkillsNeeded = career.requiredSkillsList.length;
    const userSkillNames = data.skills.map(function (s) { return skillNames[s]; });
    const skillsAcquired = career.requiredSkillsList.filter(function (skill) {
        return userSkillNames.includes(skill);
    }).length;

    const semestersCompleted = Math.max(0, (data.year * 2) - 2);
    const totalSemesters = 8;
    const semesterProgress = Math.round((semestersCompleted / totalSemesters) * 100);

    const skillProgress = totalSkillsNeeded > 0 ? Math.round((skillsAcquired / totalSkillsNeeded) * 100) : 0;

    // Milestones based on year
    const milestones = [];
    if (data.year >= 1) milestones.push({ icon: "📖", text: "Started Degree", done: true });
    if (data.year >= 2) milestones.push({ icon: "💻", text: "Core Subjects Done", done: true });
    if (data.year >= 3) milestones.push({ icon: "🛠️", text: "Projects Built", done: true });
    if (data.year >= 4) milestones.push({ icon: "🎓", text: "Graduation Ready", done: true });

    // Future milestones
    if (data.year < 2) milestones.push({ icon: "💻", text: "Core Subjects", done: false });
    if (data.year < 3) milestones.push({ icon: "🛠️", text: "Build Projects", done: false });
    if (data.year < 4) milestones.push({ icon: "🎓", text: "Graduation", done: false });
    milestones.push({ icon: "💼", text: "Get Placed", done: false });

    const milestonesHTML = milestones.map(function (m) {
        return `
            
                ${m.icon}
                ${m.text}
                ${m.done ? '✅' : '⏳'}
            
        `;
    }).join("");

    container.innerHTML = `
    <div class="tracker-grid">

    <div class="tracker-card">
    <h3>${skillsAcquired}/${totalSkillsNeeded}</h3>
    <p>Skills Acquired</p>
    </div>

    <div class="tracker-card">
    <h3>${semestersCompleted}/${totalSemesters}</h3>
    <p>Semesters Completed</p>
    </div>

    <div class="tracker-card">
    <h3>${data.interests.length}</h3>
    <p>Interest Areas</p>
    </div>

    <div class="tracker-card">
    <h3>${data.skills.length}</h3>
    <p>Total Skills</p>
    </div>

    </div>
    `;
}

/* ============================================
   TOAST NOTIFICATION SYSTEM
   ============================================ */

/**
 * Shows a toast notification at the top of the screen
 * @param {string} message - Message to display
 * @param {string} type - "success", "error", or "info"
 */
function showToast(message, type) {
    // Remove any existing toast
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast-notification toast-${type}`;

    let icon = "";
    if (type === "success") icon = "✅";
    else if (type === "error") icon = "❌";
    else icon = "ℹ️";

    toast.innerHTML = `
        ${icon}
        ${message}
        <button>×</button>
    `;

    // Add to body
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(function () {
        toast.classList.add("show");
    }, 10);

    // Auto-remove after 4 seconds
    setTimeout(function () {
        toast.classList.add("hide");
        setTimeout(function () {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 4000);
}

/* ============================================
   UTILITY / HELPER FUNCTIONS
   ============================================ */

/**
 * Debounce function to limit rapid event firing
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Smooth scroll to an element by ID
 * @param {string} elementId - Target element ID
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - Input string
 * @returns {string} - Capitalized string
 */
function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Gets a random item from an array
 * @param {array} arr - Input array
 * @returns {*} - Random element
 */
function getRandomItem(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Formats a number with commas (e.g., 1000 -> 1,000)
 * @param {number} num - Number to format
 * @returns {string} - Formatted string
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ============================================
   ADDITIONAL INTERACTIVE FEATURES
   ============================================ */

/**
 * Handles checkbox limit for interests (max 5)
 */
document.addEventListener("change", function (event) {
    if (event.target.name === "interests") {
        const checked = document.querySelectorAll('input[name="interests"]:checked');
        if (checked.length > 5) {
            event.target.checked = false;
            showToast("You can select a maximum of 5 interests.", "info");
        }
    }

    if (event.target.name === "skills") {
        const checked = document.querySelectorAll('input[name="skills"]:checked');
        if (checked.length > 8) {
            event.target.checked = false;
            showToast("You can select a maximum of 8 skills.", "info");
        }
    }
});

/**
 * Keyboard accessibility: Enter key on cards
 */
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.classList.contains("career-card")) {
        event.target.click();
    }
});

/**
 * Add active animation class to nav links based on scroll position
 */
window.addEventListener("scroll", debounce(function () {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 200;

    sections.forEach(function (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll(".nav-link").forEach(function (link) {
                link.classList.remove("active");
                if (link.getAttribute("href") === "#" + sectionId) {
                    link.classList.add("active");
                }
            });
        }
    });
}, 100));

/* ============================================
   END OF SCRIPT.JS
   ============================================ */