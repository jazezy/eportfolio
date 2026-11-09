/* ==========================================================================
   PORTFOLIO CONTENT - edit this file to change text, titles and documents.

   To add a document: put the file in the folder shown in its card's `path`
   (or change `path` to your file name), then run:  python tools/update_documents.py
   (see README.md). The card then switches from "Not yet uploaded" to "Uploaded".
   ========================================================================== */
window.PORTFOLIO = {
  owner: {
    name: "Jade Lormie T. Porras",
    program: "Bachelor of Technical-Vocational Teacher Education",
    major: "Major in Computer Hardware",
    section: "BTVTED-CH-4A",
    university: "Technological University of the Philippines – Taguig",
    partnerSchool: "Kapt. Jose Cardones Integrated School",
    welcome: "Welcome to my Field Study portfolio. It brings together the plans, lessons, and evidence from my time in the classroom as a pre-service teacher preparing to teach Computer Hardware. Each section works like a filing cabinet: open any document to see the work behind it."
  },

  /* Short text blocks. Leave as "" to show a placeholder instead. */
  text: {
    introduction: "",
    aboutBio: "",
    visionMission: "",
    shortHistory: "",
    philosophySummary: ""
  },

  pages: [
    { key: "home", label: "Home", icon: "home" },
    { key: "toc", label: "Table of Contents", icon: "list" },
    { key: "introduction", label: "Introduction", icon: "book" },
    { key: "about", label: "About Me", icon: "user" },
    { key: "environment", label: "Learning Environment", icon: "school" },
    { key: "fs1", label: "FS1 Portfolio", icon: "folder" },
    { key: "fs2", label: "FS2 Portfolio", icon: "folder" },
    { key: "microteaching", label: "Microteaching", icon: "mic" },
    { key: "research", label: "Action Research", icon: "search" },
    { key: "philosophy", label: "Teaching Philosophy", icon: "spark" },
    { key: "appendices", label: "Appendices", icon: "clip" }
  ],

  /* Document groups per page. type: "doc" (default) or "image". */
  groups: {
    about: [
      { title: "Personal documents", items: [
        { id: "cv", title: "Curriculum Vitae", desc: "Education, training, and experience.", path: "documents/personal/curriculum-vitae.pdf" }
      ]}
    ],
    environment: [
      { title: "Vision and Mission", textKey: "visionMission", items: [
        { id: "vision-mission", title: "Vision and Mission", desc: "The school's vision and mission statements.", path: "documents/environment/vision-mission.pdf" }
      ]},
      { title: "Short History", textKey: "shortHistory", items: [
        { id: "school-history", title: "Short History", desc: "A brief history of the partner school.", path: "documents/environment/short-history.pdf" }
      ]},
      { title: "School Grounds and Building", gallery: true, items: [
        { id: "grounds-1", type: "image", title: "School grounds", desc: "Photo 1", path: "documents/environment/school-grounds-1.jpg" },
        { id: "grounds-2", type: "image", title: "School building", desc: "Photo 2", path: "documents/environment/school-grounds-2.jpg" },
        { id: "grounds-3", type: "image", title: "Classroom", desc: "Photo 3", path: "documents/environment/school-grounds-3.jpg" },
        { id: "grounds-4", type: "image", title: "School facilities", desc: "Photo 4", path: "documents/environment/school-grounds-4.jpg" }
      ]}
    ],
    fs1: [
      { title: "Field Study 1 activities", empty: "FS1 documents have not been added yet. Add them to the fs1 list in js/documents.js and place the files in documents/fs1/.", items: [] }
    ],
    fs2: [
      { title: "Curriculum and Planning", items: [
        { id: "ts2", ref: "TS2", title: "Annotated DLL", desc: "Daily Lesson Log with annotations.", path: "documents/fs2/curriculum-planning/FS2_Task_Sheet_2_Kapt__Jose_Cardones_Porras_Jade.pdf" },
        { id: "ts3", ref: "TS3", title: "Competencies Alignment", desc: "Lesson competencies aligned to the curriculum.", path: "documents/fs2/curriculum-planning/FS2_Task_Sheet_3_Competencies_Alignment_Matrix_Porras.pdf" },
        { id: "ts4", ref: "TS4", title: "Classroom Management Plan", desc: "Routines, rules, and learner behavior plan.", path: "documents/fs2/curriculum-planning/FS2_Task_Sheet_4_Classroom_Management_Plan.pdf" },
        { id: "ts5", ref: "TS5", title: "Daily Lesson Log", desc: "Daily record of lesson delivery.", path: "documents/fs2/curriculum-planning/FS2_Task_Sheet_5_Kapt__Jose_Cardones_PorrasJade_Lormie_T.pdf" },
        { id: "ts6-lp", ref: "TS6", title: "Lesson Plans", desc: "Prepared lesson plans.", path: "documents/fs2/curriculum-planning/FS2_Task_Sheet_6_Kapt__Jose_Cardones_Porras__Jade_Lormie_T.pdf" },
        { id: "ts6-im", ref: "TS6", title: "Instructional Materials", desc: "Materials prepared to support instruction.", path: "documents/fs2/curriculum-planning/ts6-instructional-materials.pdf" },
        { id: "ts7", ref: "TS7", title: "Assessment Tools and Evaluation", desc: "Assessment instruments and evaluation results.", path: "documents/fs2/curriculum-planning/FS2_Task_Sheet_7_Kapt__Jose_Cardones_Porras__Jade_Lormie.pdf" }
      ]},
      { title: "Professional Development Certificates", items: [
        { id: "ts9", ref: "TS9", title: "Professional Development Organizations", desc: "Certificates organized by organization.", path: "documents/fs2/professional-development/FS2_Task_Sheet_9_Kapt__Jose_Cardones_Porras__Jade_Lormie.pdf" },
        { id: "ts10", ref: "TS10", title: "LAC Session / School Activity Participation", desc: "Participation in LAC sessions and school activities.", path: "documents/fs2/professional-development/Jade_certificate.pdf" }
      ]}
    ],
    microteaching: [
      { title: "Microteaching", items: [
        { id: "ts12", ref: "TS12", title: "Evaluation Form", desc: "Microteaching evaluation form.", path: "documents/microteaching/FS2_Task_Sheet_12_Kapt__Jose_Cardones_Porras__Jade_Lormie.pdf" },
        { id: "mt-dlp", title: "DLP and Documentation", desc: "Detailed Lesson Plan and documentation.", path: "documents/microteaching/dlp-documentation.pdf" }
      ]}
    ],
    research: [
      { title: "Classroom-Based Action Research Proposal", items: [
        { id: "ts1", ref: "TS1", title: "Action Research Data Bank", desc: "Classroom observation data behind the research problem.", path: "documents/research/ts1-data-bank.pdf" },
        { id: "ts8", ref: "TS8", title: "CBAR Manuscript", desc: "Classroom-Based Action Research proposal.", path: "documents/research/ts8-cbar-manuscript.pdf" },
        { id: "rubric", title: "Rubric with Panel's Comments and Score", desc: "Panel evaluation of the proposal.", path: "documents/research/panel-rubric.pdf" }
      ]}
    ],
    philosophy: [
      { title: "Teaching Philosophy", textKey: "philosophySummary", items: [
        { id: "ts11", ref: "TS11", title: "Teaching Philosophy", desc: "My beliefs about teaching and learning.", path: "documents/philosophy/FS2_Task_Sheet_11_Teaching_Philosophy.pdf" }
      ]}
    ],
    appendices: [
      { title: "Appendices", items: [
        { id: "ts13", ref: "TS13", title: "Evaluation from Cooperating Teacher", desc: "Cooperating teacher's evaluation of my practice.", path: "documents/appendices/ts13-cooperating-teacher-evaluation.pdf" },
        { id: "dtr", title: "Daily Time Record", desc: "Attendance record at the partner school.", path: "documents/appendices/daily-time-record.pdf" }
      ]}
    ]
  }
};
