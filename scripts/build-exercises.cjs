const { ZipArchive } = require("archiver");
const { createWriteStream, mkdirSync, readdirSync, existsSync } = require("fs");
const { join, dirname } = require("path");

const DOCS_DIR = join(__dirname, "../docs/exercises");
const STATIC_DIR = join(__dirname, "../static/exercises");

function zipDir(sourceDir, outFile) {
  return new Promise((resolve, reject) => {
    mkdirSync(dirname(outFile), { recursive: true });
    const output = createWriteStream(outFile);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function main() {
  console.log("Building exercise zips...");
  console.log(`  source: ${DOCS_DIR}`);
  console.log(`  output: ${STATIC_DIR}`);

  const categories = readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const category of categories) {
    const categoryDir = join(DOCS_DIR, category);
    const exercises = readdirSync(categoryDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    for (const exercise of exercises) {
      const exerciseDir = join(categoryDir, exercise);
      const outDir = join(STATIC_DIR, category, exercise);

      if (existsSync(join(exerciseDir, "solution"))) {
        await zipDir(join(exerciseDir, "solution"), join(outDir, "solution.zip"));
        console.log(`  [solution] ${category}/${exercise}/solution.zip`);
      }

      if (existsSync(join(exerciseDir, "starter"))) {
        await zipDir(join(exerciseDir, "starter"), join(outDir, "starter.zip"));
        console.log(`  [starter]  ${category}/${exercise}/starter.zip`);
      }
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
