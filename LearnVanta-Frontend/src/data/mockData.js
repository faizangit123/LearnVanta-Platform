// Mock Data for EduStream Educational Platform

// Classes Data
export const classes = [
  {
    id: "class-8",
    name: "Class 8",
    grade: 8,
    description: "Foundation concepts in Mathematics and more",
    studentCount: 1250,
    image: "/placeholder.svg",
    color: "blue",
  },
  {
    id: "class-9",
    name: "Class 9",
    grade: 9,
    description: "Building strong fundamentals for board exams",
    studentCount: 1580,
    image: "/placeholder.svg",
    color: "purple",
  },
  {
    id: "class-10",
    name: "Class 10",
    grade: 10,
    description: "Board exam preparation with detailed explanations",
    studentCount: 2340,
    image: "/placeholder.svg",
    color: "green",
  },
  {
    id: "class-11",
    name: "Class 11",
    grade: 11,
    description: "Advanced concepts for competitive exams",
    studentCount: 1890,
    image: "/placeholder.svg",
    color: "orange",
  },
  {
    id: "class-12",
    name: "Class 12",
    grade: 12,
    description: "Complete board & entrance exam preparation",
    studentCount: 2100,
    image: "/placeholder.svg",
    color: "red",
  },
  {
    id: "college",
    name: "College / University",
    grade: "UG/PG",
    description: "Higher education Mathematics and related courses",
    studentCount: 3500,
    image: "/placeholder.svg",
    color: "indigo",
  },
];

// Subjects Data - Mathematics is PRIMARY for all classes
export const subjects = [
  // Class 8 Subjects
  {
    id: "math-8",
    name: "Mathematics",
    classId: "class-8",
    description: "Complete Class 8 Mathematics with NCERT solutions",
    chapterCount: 16,
    videoCount: 95,
    icon: "Calculator",
    isPrimary: true,
  },
  {
    id: "science-8",
    name: "Science",
    classId: "class-8",
    description: "Physics, Chemistry, and Biology basics",
    chapterCount: 18,
    videoCount: 72,
    icon: "Atom",
    isPrimary: false,
  },
  
  // Class 9 Subjects
  {
    id: "math-9",
    name: "Mathematics",
    classId: "class-9",
    description: "Complete Class 9 Mathematics with NCERT solutions",
    chapterCount: 15,
    videoCount: 110,
    icon: "Calculator",
    isPrimary: true,
  },
  {
    id: "science-9",
    name: "Science",
    classId: "class-9",
    description: "Physics, Chemistry, and Biology for Class 9",
    chapterCount: 15,
    videoCount: 85,
    icon: "Atom",
    isPrimary: false,
  },
  
  // Class 10 Subjects
  {
    id: "math-10",
    name: "Mathematics",
    classId: "class-10",
    description: "Complete Class 10 Mathematics with NCERT solutions",
    chapterCount: 15,
    videoCount: 120,
    icon: "Calculator",
    isPrimary: true,
  },
  {
    id: "science-10",
    name: "Science",
    classId: "class-10",
    description: "Physics, Chemistry, and Biology for Class 10",
    chapterCount: 16,
    videoCount: 90,
    icon: "Atom",
    isPrimary: false,
  },
  
  // Class 11 Subjects
  {
    id: "math-11",
    name: "Mathematics",
    classId: "class-11",
    description: "Complete Class 11 Mathematics for JEE/Boards",
    chapterCount: 16,
    videoCount: 150,
    icon: "Calculator",
    isPrimary: true,
  },
  {
    id: "physics-11",
    name: "Physics",
    classId: "class-11",
    description: "Physics for Class 11 - JEE/NEET preparation",
    chapterCount: 15,
    videoCount: 100,
    icon: "Atom",
    isPrimary: false,
  },
  
  // Class 12 Subjects
  {
    id: "math-12",
    name: "Mathematics",
    classId: "class-12",
    description: "Complete Class 12 Mathematics for JEE/Boards",
    chapterCount: 13,
    videoCount: 140,
    icon: "Calculator",
    isPrimary: true,
  },
  {
    id: "physics-12",
    name: "Physics",
    classId: "class-12",
    description: "Physics for Class 12 - Board & entrance exams",
    chapterCount: 14,
    videoCount: 110,
    icon: "Atom",
    isPrimary: false,
  },
  
  // College Subjects
  {
    id: "calculus",
    name: "Calculus",
    classId: "college",
    description: "Differential and Integral Calculus for undergraduates",
    chapterCount: 12,
    videoCount: 80,
    icon: "Calculator",
    isPrimary: true,
  },
  {
    id: "linear-algebra",
    name: "Linear Algebra",
    classId: "college",
    description: "Matrices, Vector Spaces, and Linear Transformations",
    chapterCount: 10,
    videoCount: 65,
    icon: "Grid",
    isPrimary: true,
  },
  {
    id: "discrete-math",
    name: "Discrete Mathematics",
    classId: "college",
    description: "Logic, Sets, Relations, and Graph Theory",
    chapterCount: 8,
    videoCount: 55,
    icon: "Binary",
    isPrimary: true,
  },
  {
    id: "statistics",
    name: "Statistics & Probability",
    classId: "college",
    description: "Probability Theory and Statistical Methods",
    chapterCount: 10,
    videoCount: 60,
    icon: "BarChart",
    isPrimary: false,
  },
];

// Chapters Data
export const chapters = [
  // Class 10 Maths Chapters
  {
    id: "ch-real-numbers",
    name: "Real Numbers",
    subjectId: "math-10",
    description: "Euclid's division lemma, Fundamental Theorem of Arithmetic",
    videoCount: 8,
    order: 1,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch1-notes.pdf", size: "2.5 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch1-practice.pdf", size: "1.8 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch1-formulas.pdf", size: "850 KB" },
    },
  },
  {
    id: "ch-polynomials",
    name: "Polynomials",
    subjectId: "math-10",
    description: "Zeros of polynomials, relationship between zeros and coefficients",
    videoCount: 10,
    order: 2,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch2-notes.pdf", size: "2.2 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch2-practice.pdf", size: "1.5 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch2-formulas.pdf", size: "720 KB" },
    },
  },
  {
    id: "ch-linear-equations",
    name: "Pair of Linear Equations",
    subjectId: "math-10",
    description: "Graphical and algebraic methods of solving linear equations",
    videoCount: 12,
    order: 3,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch3-notes.pdf", size: "2.8 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch3-practice.pdf", size: "2.1 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch3-formulas.pdf", size: "680 KB" },
    },
  },
  {
    id: "ch-quadratic",
    name: "Quadratic Equations",
    subjectId: "math-10",
    description: "Solution of quadratic equations by factorization and formula",
    videoCount: 10,
    order: 4,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch4-notes.pdf", size: "2.4 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch4-practice.pdf", size: "1.9 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch4-formulas.pdf", size: "750 KB" },
    },
  },
  {
    id: "ch-ap",
    name: "Arithmetic Progressions",
    subjectId: "math-10",
    description: "nth term, sum of n terms, and applications of AP",
    videoCount: 8,
    order: 5,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch5-notes.pdf", size: "2.0 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch5-practice.pdf", size: "1.6 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch5-formulas.pdf", size: "620 KB" },
    },
  },
  {
    id: "ch-triangles",
    name: "Triangles",
    subjectId: "math-10",
    description: "Similar triangles, criteria for similarity, area of triangles",
    videoCount: 10,
    order: 6,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch6-notes.pdf", size: "3.1 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch6-practice.pdf", size: "2.3 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch6-formulas.pdf", size: "920 KB" },
    },
  },
  {
    id: "ch-coordinate",
    name: "Coordinate Geometry",
    subjectId: "math-10",
    description: "Distance formula, section formula, area of triangle",
    videoCount: 8,
    order: 7,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch7-notes.pdf", size: "2.6 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch7-practice.pdf", size: "1.8 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch7-formulas.pdf", size: "780 KB" },
    },
  },
  {
    id: "ch-trigonometry",
    name: "Introduction to Trigonometry",
    subjectId: "math-10",
    description: "Trigonometric ratios, identities, and applications",
    videoCount: 12,
    order: 8,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch8-notes.pdf", size: "3.2 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch8-practice.pdf", size: "2.5 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch8-formulas.pdf", size: "1.1 MB" },
    },
  },
  {
    id: "ch-circles",
    name: "Circles",
    subjectId: "math-10",
    description: "Tangent to a circle, number of tangents from a point",
    videoCount: 8,
    order: 9,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch9-notes.pdf", size: "2.3 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch9-practice.pdf", size: "1.7 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch9-formulas.pdf", size: "690 KB" },
    },
  },
  {
    id: "ch-statistics",
    name: "Statistics",
    subjectId: "math-10",
    description: "Mean, median, mode of grouped data",
    videoCount: 10,
    order: 10,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch10-notes.pdf", size: "2.7 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch10-practice.pdf", size: "2.0 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch10-formulas.pdf", size: "850 KB" },
    },
  },
  
  // Class 12 Maths Chapters
  {
    id: "ch-relations",
    name: "Relations and Functions",
    subjectId: "math-12",
    description: "Types of relations, types of functions, composition",
    videoCount: 12,
    order: 1,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch12-1-notes.pdf", size: "2.9 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch12-1-practice.pdf", size: "2.2 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch12-1-formulas.pdf", size: "950 KB" },
    },
  },
  {
    id: "ch-inverse-trig",
    name: "Inverse Trigonometric Functions",
    subjectId: "math-12",
    description: "Principal values, properties, and graphs",
    videoCount: 10,
    order: 2,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch12-2-notes.pdf", size: "2.5 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch12-2-practice.pdf", size: "1.9 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch12-2-formulas.pdf", size: "880 KB" },
    },
  },
  {
    id: "ch-matrices",
    name: "Matrices",
    subjectId: "math-12",
    description: "Types, operations, and applications of matrices",
    videoCount: 12,
    order: 3,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch12-3-notes.pdf", size: "3.4 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch12-3-practice.pdf", size: "2.6 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch12-3-formulas.pdf", size: "1.0 MB" },
    },
  },
  {
    id: "ch-determinants",
    name: "Determinants",
    subjectId: "math-12",
    description: "Properties, minors, cofactors, applications",
    videoCount: 10,
    order: 4,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch12-4-notes.pdf", size: "2.8 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch12-4-practice.pdf", size: "2.1 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch12-4-formulas.pdf", size: "920 KB" },
    },
  },
  {
    id: "ch-continuity",
    name: "Continuity and Differentiability",
    subjectId: "math-12",
    description: "Continuity, differentiability, derivatives",
    videoCount: 14,
    order: 5,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/ch12-5-notes.pdf", size: "3.6 MB" },
      practice: { title: "Practice Questions", url: "/resources/ch12-5-practice.pdf", size: "2.8 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/ch12-5-formulas.pdf", size: "1.2 MB" },
    },
  },
  
  // College Calculus Chapters
  {
    id: "ch-limits",
    name: "Limits and Continuity",
    subjectId: "calculus",
    description: "Limit theorems, epsilon-delta definition, continuity",
    videoCount: 8,
    order: 1,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/calc-1-notes.pdf", size: "3.0 MB" },
      practice: { title: "Practice Questions", url: "/resources/calc-1-practice.pdf", size: "2.4 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/calc-1-formulas.pdf", size: "980 KB" },
    },
  },
  {
    id: "ch-derivatives",
    name: "Derivatives",
    subjectId: "calculus",
    description: "Rules of differentiation, chain rule, implicit differentiation",
    videoCount: 10,
    order: 2,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/calc-2-notes.pdf", size: "3.3 MB" },
      practice: { title: "Practice Questions", url: "/resources/calc-2-practice.pdf", size: "2.7 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/calc-2-formulas.pdf", size: "1.1 MB" },
    },
  },
  {
    id: "ch-integration",
    name: "Integration",
    subjectId: "calculus",
    description: "Indefinite integrals, definite integrals, techniques",
    videoCount: 12,
    order: 3,
    resources: {
      notes: { title: "Chapter Notes", url: "/resources/calc-3-notes.pdf", size: "3.8 MB" },
      practice: { title: "Practice Questions", url: "/resources/calc-3-practice.pdf", size: "3.0 MB" },
      formulas: { title: "Formula Sheet", url: "/resources/calc-3-formulas.pdf", size: "1.3 MB" },
    },
  },
];

// Playlists Data - Groups related videos together
export const playlists = [
  {
    id: "pl-trig-complete",
    title: "Trigonometry Complete Series",
    description: "Complete trigonometry course covering all concepts from basics to advanced",
    thumbnail: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80",
    chapterId: "ch-trigonometry",
    videoIds: ["vid-8", "vid-trig-2", "vid-trig-3", "vid-trig-4"], // Ordered list of videos
    createdAt: "2024-02-01",
    isPublic: true,
  },
  {
    id: "pl-calc-basics",
    title: "Calculus Fundamentals",
    description: "Learn calculus from scratch with step-by-step explanations",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    chapterId: "ch-limits",
    videoIds: ["vid-11", "vid-calc-2"],
    createdAt: "2024-03-01",
    isPublic: true,
  },
  {
    id: "pl-matrices-series",
    title: "Matrices Masterclass",
    description: "Master matrices with this comprehensive video series",
    thumbnail: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80",
    chapterId: "ch-matrices",
    videoIds: ["vid-10"],
    createdAt: "2024-03-05",
    isPublic: true,
  },
];

// Video Source Types:
// - "youtube": YouTube video (use youtubeId or youtubeUrl)
// - "vimeo": Vimeo video (use vimeoId)
// - "direct": Direct video file URL (use videoUrl)
// - "embed": Any embeddable video (use embedUrl)

// Videos Data - Now supports multiple video sources
// Videos can have playlistId to belong to a playlist, and order within that playlist
export const videos = [
  // Class 10 Maths Videos - YouTube
  {
    id: "vid-1",
    title: "Real Numbers - Complete Chapter | Class 10 Maths",
    description: "In this video, we'll cover the complete chapter of Real Numbers including Euclid's Division Lemma, Fundamental Theorem of Arithmetic, Irrational Numbers, and Decimal Expansions of Rational Numbers.",
    // Video Source Configuration
    videoType: "youtube", // youtube | vimeo | direct | embed
    youtubeId: "dQw4w9WgXcQ", // For YouTube videos
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Alternative: full YouTube URL
    // videoUrl: "", // For direct video files (.mp4, .webm, etc.)
    // vimeoId: "", // For Vimeo videos
    // embedUrl: "", // For custom embed URLs
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    duration: "45:30",
    views: 125000,
    likes: 8500,
    subjectId: "math-10",
    chapterId: "ch-real-numbers",
    chapterName: "Real Numbers",
    tags: ["Class 10", "Mathematics", "NCERT", "Board Exam"],
    publishedAt: "2024-01-15",
    isTrending: true,
    isRecent: true,
    // Resources/Attachments
    resources: [
      {
        id: "res-1",
        title: "Chapter Notes PDF",
        type: "pdf",
        url: "/resources/real-numbers-notes.pdf",
        size: "2.5 MB",
      },
      {
        id: "res-2",
        title: "Practice Questions",
        type: "pdf",
        url: "/resources/real-numbers-practice.pdf",
        size: "1.2 MB",
      },
      {
        id: "res-3",
        title: "Formula Sheet",
        type: "image",
        url: "/resources/real-numbers-formulas.png",
        size: "450 KB",
      },
    ],
  },
  {
    id: "vid-2",
    title: "Polynomials - All Concepts Explained | Class 10",
    description: "Master polynomials with this comprehensive video covering zeros of polynomials, relationship between zeros and coefficients, and division algorithm.",
    videoType: "youtube",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
    duration: "52:15",
    views: 98000,
    likes: 7200,
    subjectId: "math-10",
    chapterId: "ch-polynomials",
    chapterName: "Polynomials",
    tags: ["Class 10", "Mathematics", "Polynomials"],
    publishedAt: "2024-01-20",
    isTrending: true,
    resources: [
      {
        id: "res-4",
        title: "Polynomials Notes",
        type: "pdf",
        url: "/resources/polynomials-notes.pdf",
        size: "1.8 MB",
      },
    ],
  },
  {
    id: "vid-3",
    title: "Linear Equations in Two Variables | Graphical Method",
    description: "Learn how to solve linear equations using graphical method with step-by-step explanations and practice problems.",
    videoType: "youtube",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80",
    duration: "38:45",
    views: 75000,
    likes: 5600,
    subjectId: "math-10",
    chapterId: "ch-linear-equations",
    chapterName: "Pair of Linear Equations",
    tags: ["Class 10", "Mathematics", "Linear Equations"],
    publishedAt: "2024-02-01",
    isRecent: true,
    resources: [],
  },
  {
    id: "vid-4",
    title: "Quadratic Equations - Factorization Method",
    description: "Complete guide to solving quadratic equations using factorization method with multiple examples.",
    videoType: "youtube",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=800&q=80",
    duration: "42:00",
    views: 88000,
    likes: 6300,
    subjectId: "math-10",
    chapterId: "ch-quadratic",
    chapterName: "Quadratic Equations",
    tags: ["Class 10", "Mathematics", "Quadratic Equations"],
    publishedAt: "2024-02-10",
    isTrending: true,
    resources: [
      {
        id: "res-5",
        title: "Quadratic Equations Workbook",
        type: "pdf",
        url: "/resources/quadratic-workbook.pdf",
        size: "3.1 MB",
      },
      {
        id: "res-6",
        title: "Video Slides",
        type: "link",
        url: "https://docs.google.com/presentation/example",
      },
    ],
  },
  {
    id: "vid-5",
    title: "Arithmetic Progressions - Introduction & Formulas",
    description: "Learn about AP, its nth term formula, sum of n terms, and solve various problems step by step.",
    videoType: "youtube",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80",
    duration: "35:20",
    views: 62000,
    likes: 4800,
    subjectId: "math-10",
    chapterId: "ch-ap",
    chapterName: "Arithmetic Progressions",
    tags: ["Class 10", "Mathematics", "AP", "Sequences"],
    publishedAt: "2024-02-15",
    isRecent: true,
    resources: [],
  },
  {
    id: "vid-6",
    title: "Triangles - Similar Triangles | Complete Chapter",
    description: "Understanding similar triangles, criteria for similarity, and solving problems on areas of similar triangles.",
    videoType: "youtube",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    duration: "48:30",
    views: 56000,
    likes: 4200,
    subjectId: "math-10",
    chapterId: "ch-triangles",
    chapterName: "Triangles",
    tags: ["Class 10", "Mathematics", "Geometry"],
    publishedAt: "2024-02-20",
    isTrending: false,
    resources: [],
  },
  {
    id: "vid-7",
    title: "Coordinate Geometry - Distance & Section Formula",
    description: "Master coordinate geometry with distance formula, section formula, and area calculations.",
    // Example of Direct Video (self-hosted or external MP4)
    videoType: "direct",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample direct video URL
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
    duration: "40:15",
    views: 48000,
    likes: 3800,
    subjectId: "math-10",
    chapterId: "ch-coordinate",
    chapterName: "Coordinate Geometry",
    tags: ["Class 10", "Mathematics", "Coordinate Geometry"],
    publishedAt: "2024-02-25",
    isRecent: true,
    resources: [
      {
        id: "res-7",
        title: "Coordinate Geometry Notes",
        type: "pdf",
        url: "/resources/coordinate-notes.pdf",
        size: "2.0 MB",
      },
    ],
  },
  {
    id: "vid-8",
    title: "Trigonometry - All Ratios & Identities | Class 10",
    description: "Complete trigonometry chapter covering all ratios, identities, and applications.",
    videoType: "youtube",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80",
    duration: "55:00",
    views: 92000,
    likes: 7100,
    subjectId: "math-10",
    chapterId: "ch-trigonometry",
    chapterName: "Introduction to Trigonometry",
    tags: ["Class 10", "Mathematics", "Trigonometry"],
    publishedAt: "2024-03-01",
    isTrending: true,
    resources: [
      {
        id: "res-8",
        title: "Trigonometry Formula Chart",
        type: "image",
        url: "/resources/trig-formulas.png",
        size: "380 KB",
      },
      {
        id: "res-9",
        title: "Practice Problems Set",
        type: "pdf",
        url: "/resources/trig-practice.pdf",
        size: "1.5 MB",
      },
    ],
  },
  
  // Class 12 Maths Videos
  {
    id: "vid-9",
    title: "Relations and Functions - Class 12 | Complete Chapter",
    description: "Types of relations, types of functions, composition of functions, and invertible functions.",
    videoType: "youtube",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=800&q=80",
    duration: "58:00",
    views: 78000,
    likes: 5900,
    subjectId: "math-12",
    chapterId: "ch-relations",
    chapterName: "Relations and Functions",
    tags: ["Class 12", "Mathematics", "JEE", "Board Exam"],
    publishedAt: "2024-03-05",
    isTrending: true,
    resources: [],
  },
  {
    id: "vid-10",
    title: "Matrices - Complete Chapter | Class 12 Maths",
    description: "All about matrices - types, operations, transpose, symmetric matrices, and applications.",
    // Example of Vimeo video
    videoType: "vimeo",
    vimeoId: "76979871", // Sample Vimeo ID
    thumbnail: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80",
    duration: "62:30",
    views: 85000,
    likes: 6400,
    subjectId: "math-12",
    chapterId: "ch-matrices",
    chapterName: "Matrices",
    tags: ["Class 12", "Mathematics", "Matrices", "JEE"],
    publishedAt: "2024-03-10",
    isTrending: true,
    isRecent: true,
    resources: [
      {
        id: "res-10",
        title: "Matrices Complete Notes",
        type: "pdf",
        url: "/resources/matrices-notes.pdf",
        size: "4.2 MB",
      },
    ],
  },
  
  // College Calculus Videos
  {
    id: "vid-11",
    title: "Limits and Continuity | Calculus for Beginners",
    description: "Understanding limits, epsilon-delta definition, and continuity concepts for college students.",
    videoType: "youtube",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    duration: "48:00",
    views: 45000,
    likes: 3500,
    subjectId: "calculus",
    chapterId: "ch-limits",
    chapterName: "Limits and Continuity",
    tags: ["College", "Calculus", "Limits"],
    publishedAt: "2024-03-15",
    isRecent: true,
    resources: [],
  },
  {
    id: "vid-12",
    title: "Derivatives - Rules & Applications | Calculus",
    description: "Complete guide to derivatives including chain rule, product rule, quotient rule, and applications.",
    // Example of custom embed URL (could be your own video hosting)
    videoType: "embed",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
    duration: "55:00",
    views: 52000,
    likes: 4100,
    subjectId: "calculus",
    chapterId: "ch-derivatives",
    chapterName: "Derivatives",
    tags: ["College", "Calculus", "Derivatives"],
    publishedAt: "2024-03-20",
    isTrending: true,
    resources: [
      {
        id: "res-11",
        title: "Derivatives Formula Sheet",
        type: "pdf",
        url: "/resources/derivatives-formulas.pdf",
        size: "890 KB",
      },
      {
        id: "res-12",
        title: "External Reference",
        type: "link",
        url: "https://www.khanacademy.org/math/calculus-1",
      },
    ],
  },
];

// Testimonials Data
export const testimonials = [
  {
    id: "test-1",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    role: "Class 10 Student",
    content: "The explanations are so clear and easy to understand. I improved my Math score from 65 to 92 in just 3 months!",
    rating: 5,
  },
  {
    id: "test-2",
    name: "Rahul Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    role: "Class 12 Student",
    content: "Best channel for board exam preparation. The notes and practice problems are incredibly helpful.",
    rating: 5,
  },
  {
    id: "test-3",
    name: "Anita Patel",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    role: "College Student",
    content: "I love how the concepts are broken down into simple parts. Makes learning complex topics so much easier!",
    rating: 5,
  },
  {
    id: "test-4",
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    role: "Class 11 Student",
    content: "The video quality and teaching style is amazing. Highly recommend for JEE preparation.",
    rating: 5,
  },
];

// Navigation Links
export const navLinks = {
  classes: [
    { id: "class-8", name: "Class 8", href: "/class/class-8" },
    { id: "class-9", name: "Class 9", href: "/class/class-9" },
    { id: "class-10", name: "Class 10", href: "/class/class-10" },
    { id: "class-11", name: "Class 11", href: "/class/class-11" },
    { id: "class-12", name: "Class 12", href: "/class/class-12" },
    { id: "college", name: "College/University", href: "/class/college" },
  ],
  footer: {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "FAQ", href: "/faq" },
    ],
    social: [
      { name: "YouTube", href: "https://youtube.com", icon: "Youtube" },
      { name: "Instagram", href: "https://instagram.com", icon: "Instagram" },
      { name: "Twitter", href: "https://twitter.com", icon: "Twitter" },
      { name: "Facebook", href: "https://facebook.com", icon: "Facebook" },
    ],
  },
};

// Helper functions
export const getTrendingVideos = () => videos.filter((v) => v.isTrending);
export const getRecentVideos = () => videos.filter((v) => v.isRecent);
export const getVideosBySubject = (subjectId) => 
  videos.filter((v) => v.subjectId === subjectId);
export const getVideosByChapter = (chapterId) => 
  videos.filter((v) => v.chapterId === chapterId);
export const getChaptersBySubject = (subjectId) => 
  chapters.filter((c) => c.subjectId === subjectId).sort((a, b) => a.order - b.order);
export const getSubjectsByClass = (classId) => 
  subjects.filter((s) => s.classId === classId);
export const getPrimarySubjects = (classId) =>
  subjects.filter((s) => s.classId === classId && s.isPrimary);
export const getSecondarySubjects = (classId) =>
  subjects.filter((s) => s.classId === classId && !s.isPrimary);
export const getClassById = (classId) => 
  classes.find((c) => c.id === classId);
export const getSubjectById = (subjectId) =>
  subjects.find((s) => s.id === subjectId);
export const getChapterById = (chapterId) =>
  chapters.find((c) => c.id === chapterId);
export const getVideoById = (videoId) => 
  videos.find((v) => v.id === videoId);

// Extract YouTube ID from various URL formats
export const extractYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Get video embed URL based on video type
export const getVideoEmbedUrl = (video) => {
  switch (video.videoType) {
    case "youtube":
      const ytId = video.youtubeId || extractYouTubeId(video.youtubeUrl);
      return ytId ? `https://www.youtube.com/embed/${ytId}?rel=0` : null;
    case "vimeo":
      return video.vimeoId ? `https://player.vimeo.com/video/${video.vimeoId}` : null;
    case "embed":
      return video.embedUrl || null;
    case "direct":
      return null; // Direct videos use HTML5 video element
    default:
      // Fallback to YouTube if youtubeId exists
      return video.youtubeId ? `https://www.youtube.com/embed/${video.youtubeId}?rel=0` : null;
  }
};

// Format view count
export const formatViews = (views) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  }
  return views.toString();
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// Search Functions
export const searchVideos = (query, filters = {}) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm && !filters.classId && !filters.subjectId && !filters.videoType) {
    return videos;
  }

  return videos.filter((video) => {
    // Text search
    const matchesSearch =
      !searchTerm ||
      video.title.toLowerCase().includes(searchTerm) ||
      video.description.toLowerCase().includes(searchTerm) ||
      video.chapterName?.toLowerCase().includes(searchTerm) ||
      video.tags?.some((tag) => tag.toLowerCase().includes(searchTerm));

    // Filter by class
    const matchesClass =
      !filters.classId ||
      subjects.find((s) => s.id === video.subjectId)?.classId === filters.classId;

    // Filter by subject
    const matchesSubject = !filters.subjectId || video.subjectId === filters.subjectId;

    // Filter by video type
    const matchesVideoType = !filters.videoType || video.videoType === filters.videoType;

    return matchesSearch && matchesClass && matchesSubject && matchesVideoType;
  });
};

export const searchSubjects = (query, classId = null) => {
  const searchTerm = query.toLowerCase().trim();

  return subjects.filter((subject) => {
    const matchesSearch =
      !searchTerm ||
      subject.name.toLowerCase().includes(searchTerm) ||
      subject.description.toLowerCase().includes(searchTerm);

    const matchesClass = !classId || subject.classId === classId;

    return matchesSearch && matchesClass;
  });
};

export const searchChapters = (query, subjectId = null) => {
  const searchTerm = query.toLowerCase().trim();

  return chapters.filter((chapter) => {
    const matchesSearch =
      !searchTerm ||
      chapter.name.toLowerCase().includes(searchTerm) ||
      chapter.description.toLowerCase().includes(searchTerm);

    const matchesSubject = !subjectId || chapter.subjectId === subjectId;

    return matchesSearch && matchesSubject;
  });
};

// Get all unique video types
export const getVideoTypes = () => {
  const types = [...new Set(videos.map((v) => v.videoType))];
  return types.map((type) => ({
    id: type,
    name: type.charAt(0).toUpperCase() + type.slice(1),
  }));
};

// ============ PLAYLIST HELPERS ============

// Get playlist by ID
export const getPlaylistById = (playlistId) => {
  return playlists.find(p => p.id === playlistId) || null;
};

// Get playlist containing a specific video
export const getPlaylistForVideo = (videoId) => {
  return playlists.find(p => p.videoIds.includes(videoId)) || null;
};

// Get videos in a playlist (with full video data, in order)
export const getPlaylistVideos = (playlistId) => {
  const playlist = getPlaylistById(playlistId);
  if (!playlist) return [];
  
  return playlist.videoIds
    .map(videoId => videos.find(v => v.id === videoId))
    .filter(Boolean);
};

// Get related videos for a video (based on same subject/tags, excluding playlist videos)
export const getRelatedVideos = (video, limit = 5) => {
  if (!video) return [];
  
  const playlist = getPlaylistForVideo(video.id);
  const playlistVideoIds = playlist ? playlist.videoIds : [];
  
  return videos
    .filter(v => {
      // Exclude current video
      if (v.id === video.id) return false;
      // Exclude videos in the same playlist
      if (playlistVideoIds.includes(v.id)) return false;
      // Match by subject or overlapping tags
      return v.subjectId === video.subjectId || 
        v.tags?.some(tag => video.tags?.includes(tag));
    })
    .slice(0, limit);
};
