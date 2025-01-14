import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";

// 获取当前脚本所在路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义目录路径
const libDir = path.resolve(__dirname, "../lib");
const pagesDir = path.resolve(__dirname, "../src/pages");
const templatePath = path.resolve(__dirname, "componentTestTemplate.ejs");

// 排除的文件夹
const otherFolders = ["base", "types"];

/**
 * 获取指定目录中的文件夹
 */
async function getFolders(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

/**
 * 渲染 EJS 模板
 */
async function renderTemplate(data) {
  try {
    const template = await fs.readFile(templatePath, "utf-8");
    return ejs.render(template, data);
  } catch (error) {
    console.error("Error rendering EJS template:", error);
    throw error;
  }
}

/**
 * 创建页面文件夹及 React 组件
 */
async function createPageFolder(folder) {
  if (otherFolders.includes(folder)) return;

  const pageFolderPath = path.join(pagesDir, folder);
  const componentClassName = folder.charAt(0).toUpperCase() + folder.slice(1);
  const filePath = path.join(pageFolderPath, "index.tsx");

  try {
    // 如果页面文件夹和 index.tsx 文件都存在，则跳过
    if (await fs.stat(filePath).catch(() => false)) {
      console.log(`Page already exists, skipping: ${folder}`);
      return;
    }

    // 创建页面文件夹（如果不存在）
    await fs.mkdir(pageFolderPath, { recursive: true });

    // 渲染模板
    const reactContent = await renderTemplate({ folder, componentClassName });

    // 写入 React 组件文件
    await fs.writeFile(filePath, reactContent);
    console.log(`Generated page for: ${folder}`);
  } catch (error) {
    console.error(`Error creating page for ${folder}:`, error);
  }
}

/**
 * 创建所有页面
 */
async function createPages() {
  const libFolders = await getFolders(libDir);
  await Promise.all(libFolders.map(createPageFolder));
}

/**
 * 主入口，处理命令行参数
 */
(async () => {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    await createPages();
  } else {
    await Promise.all(args.map(createPageFolder));
  }
})();
