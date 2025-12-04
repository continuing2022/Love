import fs from "fs";
import path from "path";

// 用法: node scripts/sync-plans.js <sourceFile>
// 示例: node scripts/sync-plans.js plans.export.json

const srcArg = process.argv[2] || "plans.export.json";
const cwd = process.cwd();
const srcPath = path.resolve(cwd, srcArg);
const destPath = path.resolve(cwd, "src", "data", "plans.json");

if (!fs.existsSync(srcPath)) {
  console.error(`Source file not found: ${srcPath}`);
  process.exit(1);
}

try {
  const content = fs.readFileSync(srcPath, "utf8");
  // 验证 JSON
  JSON.parse(content);
  fs.writeFileSync(destPath, content, "utf8");
  console.log(`Wrote ${srcPath} -> ${destPath}`);
} catch (e) {
  console.error("Failed to sync plans:", e);
  process.exit(1);
}
