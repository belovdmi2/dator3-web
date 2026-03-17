#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const cssnano = require("cssnano");
const { minify: terserMinify } = require("terser");
const { minify: minifyHtml } = require("html-minifier-terser");

const DIST_DIR = path.join(__dirname, "dist");
const SOURCE_DIR = __dirname;

const EXCLUDE_FILES = new Set([
  "dist",
  "node_modules",
  ".git",
  "build.js",
  "input-tailwind.css",
  "README.md",
  ".gitignore",
]);

// Funkce pro rekurzivní kopírování
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);

  files.forEach((file) => {
    if (EXCLUDE_FILES.has(file)) {
      return;
    }

    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Funkce pro vymazání složky
function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        removeDir(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(dir);
  }
}

console.log("🔨 Zahajuji build procesu...\n");

// Vyčistit dist složku
if (fs.existsSync(DIST_DIR)) {
  console.log("🧹 Odstraňuji starou dist složku...");
  removeDir(DIST_DIR);
}

// Vytvořit novou dist složku
console.log("📁 Vytvářím dist složku...");
fs.mkdirSync(DIST_DIR, { recursive: true });

// Kopírovat obsah
console.log("📦 Kopíruji soubory...");
copyRecursive(SOURCE_DIR, DIST_DIR);

// Vyčistit zbytečné soubory
console.log("🧹 Odstraňuji zbytečné soubory...");
const filesToRemove = [
  "package.json",
  "package-lock.json",
  "build.js",
  ".DS_Store",
  "input-tailwind.css",
  "README.md",
  ".gitignore",
];
filesToRemove.forEach((file) => {
  const filePath = path.join(DIST_DIR, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});

// Vyčistit .git a node_modules v dist, pokud by se tam dostaly
const dirsToRemove = [".git", "node_modules"];
dirsToRemove.forEach((dir) => {
  const dirPath = path.join(DIST_DIR, dir);
  if (fs.existsSync(dirPath)) {
    removeDir(dirPath);
  }
});

// Minifikace CSS souborů
console.log("🗜️  Minifikuji CSS soubory...");

async function minifyCssFiles(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.lstatSync(fullPath).isDirectory()) {
      await minifyCssFiles(fullPath);
    } else if (entry.endsWith(".css")) {
      const source = fs.readFileSync(fullPath, "utf8");
      const result = await postcss([cssnano({ preset: "default" })]).process(
        source,
        { from: fullPath },
      );
      fs.writeFileSync(fullPath, result.css);
      console.log(`   ✓ ${path.relative(DIST_DIR, fullPath)}`);
    }
  }
}

async function minifyJsFiles(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.lstatSync(fullPath).isDirectory()) {
      await minifyJsFiles(fullPath);
    } else if (entry.endsWith(".js")) {
      const source = fs.readFileSync(fullPath, "utf8");
      const result = await terserMinify(source, {
        compress: true,
        mangle: true,
      });
      fs.writeFileSync(fullPath, result.code);
      console.log(`   ✓ ${path.relative(DIST_DIR, fullPath)}`);
    }
  }
}

async function minifyHtmlFiles(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.lstatSync(fullPath).isDirectory()) {
      await minifyHtmlFiles(fullPath);
    } else if (entry.endsWith(".html")) {
      const source = fs.readFileSync(fullPath, "utf8");
      const result = await minifyHtml(source, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true,
      });
      fs.writeFileSync(fullPath, result);
      console.log(`   ✓ ${path.relative(DIST_DIR, fullPath)}`);
    }
  }
}

// Informace o vytvořených souborech
function countFiles(dir, count = 0) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    if (file !== "node_modules" && file !== ".git") {
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        count = countFiles(filePath, count);
      } else {
        count++;
      }
    }
  });
  return count;
}

minifyCssFiles(DIST_DIR).then(async () => {
  console.log("\n🗜️  Minifikuji JS soubory...");
  await minifyJsFiles(DIST_DIR);
  console.log("\n🗜️  Minifikuji HTML soubory...");
  await minifyHtmlFiles(DIST_DIR);
  const fileCount = countFiles(DIST_DIR);
  console.log("\n✅ Build dokončen!\n");
  console.log(`📊 Statistika:`);
  console.log(`   Počet souborů: ${fileCount}`);
  console.log(`   Výstupní složka: ${DIST_DIR}\n`);
  console.log(`🚀 Složka "dist" je připravena k nasazení!\n`);
});
