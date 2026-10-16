##  You can open the "report.html" page at (https://p2-3ihs.onrender.com/report)  in Express to view a summary of my project!

🛠️ Step 1 & 2: Understanding the Structure & Chosen Technologies
🍃 Why MongoDB Fits a Todo List
Document-based (JSON-like): Our tasks naturally align with a JSON structure (title, completed, dueDate, userId), eliminating the need for complex table joins at the beginner level.

Schema Flexibility: If we want to add features like categories, tags, priority levels, or sub-tasks in the future, we can easily add new fields to the Mongoose schema without running complex migrations.

🟢 Why Node.js + Express + EJS is Perfect
Server-Side Rendering (SSR): Express renders EJS pages on the server side and sends ready-made HTML to the browser, ensuring fast initial page loads and keeping all logic within Node.js.

EJS Simplicity: EJS syntax is pure JavaScript embedded directly within HTML (<%= task.title %>), so there's no need to learn a new syntax like other template engines.
