import path from "path";
import { fileURLToPath } from "url";
import { processAllJsonFiles, watchAndCompile } from "./json-utils.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

if (args.includes("--watch")) {
  await watchAndCompile(path.join(dirname, '..'));
} else if (args.includes("--compile")) {
  await processAllJsonFiles();
} else {
  console.log("Please specify a flag: --watch or --compile");
}