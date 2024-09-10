/* eslint-disable */
import path from "path";
import { readdir, mkdir, access } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const ensureDirectoryExists = async (directory) => {
  try {
    await mkdir(directory, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
};

/**
 * Merge JSON files using merge-json-cli
 * @param {string} inputDir
 * @param {string} outputDir
 * @param {string} outputFileName
 */
export const mergeJsonFiles = async (inputDir, outputDir, outputFileName) => {
  await ensureDirectoryExists(outputDir);
  const outputPath = path.join(outputDir, outputFileName);
  const command = `merge-json-cli -i "${inputDir}/${outputFileName}" -o "${outputPath}"`;
  
  try {
    await execAsync(command);
    console.log(`Merged JSON file from ${inputDir}/${outputFileName} to ${outputPath}`);
  } catch (error) {
    console.error(`Error merging JSON file: ${error.message}`);
  }
};

/**
 * Process JSON files in models/sub-models and blocks/* construct/ directories
 */
export const processAllJsonFiles = async () => {
  const rootDir = process.cwd();
  
  // Process files in models/sub-models
  const modelsInputDir = path.join(rootDir, 'models', 'sub-models');
  const modelsOutputDir = path.join(rootDir, 'models');
  const inputFiles = await readdir(modelsInputDir);
  for (const file of inputFiles) {
    if (path.extname(file) === '.json') {
      await mergeJsonFiles(modelsInputDir, modelsOutputDir, file);
    }
  }
  
  // Process files in blocks/*/construct
  const blocksDir = path.join(rootDir, 'blocks');
  const blockFolders = await readdir(blocksDir, { withFileTypes: true });

  for (const folder of blockFolders) {
    if (folder.isDirectory()) {
      const constructDir = path.join(blocksDir, folder.name, 'construct');
      const blockOutputDir = path.join(blocksDir, folder.name);
      
      try {
        const constructDirExists = await access(constructDir).then(() => true).catch(() => false);
        if (constructDirExists) {
          await mergeJsonFiles(constructDir, blockOutputDir, '_' + folder.name + '.json');
        } else {
          console.log(`Skipping ${folder.name}: No 'construct' folder found.`);
        }
      } catch (error) {
        console.error(`Error processing ${constructDir}:`, error);
      }
    }
  }
};

/**
 * Watch directory, copy any .json file that changes to the appropriate output directory
 * @param {string} directory the directory path
 */
export const watchAndCompile = async (directory) => {
  console.log(`Watching for changes in folder ${directory}...`);
  const watcher = watch(directory, { recursive: true });

  for await (const event of watcher) {
    const { filename, eventType } = event;
    if (path.extname(filename) === ".json" && eventType === "change") {
      console.log(`Change detected: ${filename}`);
      const filePath = path.join(directory, filename);
      const outputDir = path.dirname(filePath);
      
      if (filePath.includes(path.join('models', 'sub-models'))) {
        await copyJsonFile(filePath, path.join(outputDir, '..'));
      } else if (filePath.includes(path.join('blocks', 'construct'))) {
        await copyJsonFile(filePath, path.join(outputDir, '..', '..'));
      } else {
        console.log(`${filename} is not in a watched directory for compilation`);
      }
    }
  }
};

// The watchAndCompile function remains unchanged
