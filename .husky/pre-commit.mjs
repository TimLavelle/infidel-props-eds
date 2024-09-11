import { exec } from "node:child_process";

const run = (cmd) => new Promise((resolve, reject) => exec(
  cmd,
  (error, stdout) => {
    if (error) reject(error);
    else resolve(stdout);
  }
));

// Run lint-staged
try {
  await run('npx lint-staged');
} catch (error) {
  console.error('lint-staged failed:', error);
  process.exit(1);
}

// Continue with the existing logic for modifiedPartials
const changeset = await run('git diff --cached --name-only --diff-filter=ACMR');
const modifiedFiles = changeset.split('\n').filter(Boolean);

// check if there are any model files staged
const modifledPartials = modifiedFiles.filter((file) => file.match(/(^|\/)_.*.json/));
if (modifledPartials.length > 0) {
  const output = await run('npm run build:json --silent');
  console.log(output);
  await run('git add .');
}