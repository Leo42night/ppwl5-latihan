import { Elysia } from "elysia";
import { db, initDB } from "./db";

/* =========================
   ENV (Langsung di index)
========================= */

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

console.log("Running in:", NODE_ENV);

/* =========================
   TYPES
========================= */
interface User {
  id: number;
  name: string;
  role: string;
}

/* =========================
   MODEL
========================= */
class UserModel implements User {
  id: number;
  name: string;
  role: string;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.role = data.role;
  }

  get displayName() {
    return `${this.name} (${this.role})`;
  }
}

/* =========================
   REPOSITORY (SQLite)
========================= */
const userRepository = {
  findAll(): UserModel[] {
    const rows = db.query("SELECT id, name, role FROM users").all() as User[];

    return rows.map(user => new UserModel(user));
  }
};

/* =========================
   SERVICE
========================= */
const userService = {
  getAllUsers(): UserModel[] {
    return userRepository.findAll();
  }
};

/* =========================
   VIEW (SSR)
========================= */
const userView = (users: UserModel[]) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>User List</title>
  <link href="/css/style.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen p-10">

  <div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold text-blue-600 mb-6">
      User Management (SQLite + SSR)
    </h1>

    <div class="grid gap-4">
      ${users.map(user => `
        <div class="bg-white shadow-md rounded-xl p-4">
          <h2 class="text-lg font-semibold">${user.displayName}</h2>
          <p class="text-sm text-gray-500">ID: ${user.id}</p>
        </div>
      `).join("")}
    </div>
  </div>

</body>
</html>
`;

/* =========================
   UTILS
========================= */
const htmlResponse = (html: string, status = 200) => {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html"
    }
  });
};

/* =========================
   ROUTE + SERVER
========================= */

const app = new Elysia()
  .get("/", () => {
    try {
      const users = userService.getAllUsers();
      return htmlResponse(userView(users));
    } catch (error) {
      return htmlResponse("<h1>Database Error</h1>", 500);
    }
  });

app.listen(PORT);

console.log(`🚀 Server running at http://localhost:${PORT}`);

/* =========================
   INIT DATABASE
========================= */

initDB();