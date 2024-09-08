/* eslint-disable no-console */
import * as sass from "sass";
import path from "path";
import { writeFile, readdir, watch, mkdir } from "fs/promises";

const ensureDirectoryExists = async (directory) => {
  try {
    await mkdir(directory, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
};

/**
 * Compile the given sass file and write the result in a sibling .css file
 * @param {string} sassFile
 */
export const compileFileInPlace = async (sassFile) => {
  const compiledCss = sass.compile(sassFile).css;
  const sassDir = path.dirname(sassFile);
  let fileName = path.basename(sassFile).replace(path.extname(sassFile), ".css");

  if (sassDir.includes(path.join('styles', 'sass'))) {

    // Remove leading underscore from the filename
    if (fileName.startsWith('_')) {
      fileName = fileName.substring(1);
    }

    const outputDir = path.join(sassDir, '..');
    await ensureDirectoryExists(outputDir);
    const dest = path.join(outputDir, fileName);
    await writeFile(dest, compiledCss);
    console.log(`Compiled and moved: ${sassFile} => ${dest}`);
  } else {
    const dest = path.join(path.dirname(sassFile), fileName);
    await writeFile(dest, compiledCss);
    console.log(`Compiled: ${sassFile} => ${dest}`);
  }
};

/**
 * Compiles every sass file in the provided directory and saves the result in a sibling .css file (for each)
 * @param {string} directory the directory path
 * @param {string[]} ignoredFiles Array of strings of files to ignore
 * @returns {Promise[]} Array of promises - for recursion
 */
export const compileDirectoryInPlace = async (directory, ignoredFiles = [], promises = []) => {
  const files = await readdir(directory, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isDirectory()) {
      compileDirectoryInPlace(path.join(directory, file.name), ignoredFiles, promises); // recurse
    }
    if (path.extname(file.name) === ".scss") {
      if (!ignoredFiles.includes(file.name)) {
        const promise = compileFileInPlace(path.join(directory, file.name));
        promises.push(promise);
      } else {
        console.log(`${file.name} has been explicitly ignored for compilation`);
      }
    }
  });
  return promises;
};

/**
 * Compiles all provided directories scss into css in-place
 * @param {string[]} directories
 * @param {string[]} ignoredFiles
 * @returns
 */
export const compileDirectoriesInPlace = async (directories, ignoredFiles = []) => {
  let promises = [];
  directories.forEach(async (directory) => {
    try {
      const batchPromises = await compileDirectoryInPlace(directory, ignoredFiles);
      promises = [...promises, ...batchPromises];
    } catch (error) {
      console.error(error);
    }
  });
  return Promise.all(promises);
};

/**
 * Watch directory, compile any .scss file that changes and save the result in sibling .css file
 * @param {string} directory the directory path
 * @param {string[]} ignoredFiles Array of strings of files to ignore
 */
export const watchAndCompile = async (directory, ignoredFiles) => {
  console.log(`watching for changes in folder ${directory}...`);
  const watcher = watch(directory, { recursive: true });
  // eslint-disable-next-line no-restricted-syntax
  for await (const event of watcher) {
    const { filename, eventType } = event;
    if (path.extname(filename) === ".scss" && eventType === "change") {
      console.log(`Change: ${filename}`);
      if (!ignoredFiles.includes(filename)) {
        compileFileInPlace(path.join(directory, filename));
      } else {
        console.log(`${filename} has been explicitly ignored for compilation`);
      }
    }
  }
};