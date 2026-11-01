// Generate a Drizzle migration from db/schema.ts.
// Run: node --import tsx scripts/generate-migration.js
const { execSync } = require("child_process");

execSync("npx drizzle-kit generate", { stdio: "inherit" });