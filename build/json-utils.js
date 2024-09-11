import path from "path";
import { readdir, mkdir, access, watch } from "fs/promises";
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
  
  await Promise.all(
    inputFiles
      .filter(file => path.extname(file) === '.json')
      .map(file => mergeJsonFiles(modelsInputDir, modelsOutputDir, file))
  );
  
  // Process files in blocks/*/construct
  const blocksDir = path.join(rootDir, 'blocks');
  const blockFolders = await readdir(blocksDir, { withFileTypes: true });

  await Promise.all(
    blockFolders
      .filter(folder => folder.isDirectory())
      .map(async (folder) => {
        const constructDir = path.join(blocksDir, folder.name, 'construct');
        const blockOutputDir = path.join(blocksDir, folder.name);
        
        try {
          const constructDirExists = await access(constructDir).then(() => true).catch(() => false);
          if (constructDirExists) {
            await mergeJsonFiles(constructDir, blockOutputDir, `_${folder.name}.json`);
          } else {
            console.log(`Skipping ${folder.name}: No 'construct' folder found.`);
          }
        } catch (error) {
          console.error(`Error processing ${constructDir}:`, error);
        }
      })
  );
};

/**
 * Watch directory, copy any .json file that changes to the appropriate output directory
 * @param {string} directory the directory path
 */
export const watchAndCompile = async (directory) => {
  console.log(`Watching for changes in folder ${directory}...`);
  const watcher = watch(directory, { recursive: true });

  // Replace the for...of loop with an async function that processes events
  const processEvents = async () => {
    const events = await watcher;
    await Promise.all(events.map(async (event) => {
      const { filename, eventType } = event;
      if (path.extname(filename) === ".json" && eventType === "change") {
        console.log(`Change detected: ${filename}`);
        const filePath = path.join(directory, filename);
        
        if (filePath.includes(path.join('models', 'sub-models'))) {
          const outputDir = path.join(directory, '..');
          await mergeJsonFiles(path.dirname(filePath), outputDir, filename);
        } else if (filePath.includes(path.join('blocks', 'construct'))) {
          const outputDir = path.join(directory, '..', '..');
          await mergeJsonFiles(path.dirname(filePath), outputDir, `_${path.basename(path.dirname(path.dirname(filePath)))}.json`);
        } else {
          console.log(`${filename} is not in a watched directory for compilation`);
        }
      }
    }));

    // Continue watching for more events
    await processEvents();
  };

  // Start processing events
  await processEvents();
};
