import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 获取当前模块文件的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const libDir = path.resolve(__dirname, "../lib");
const pagesDir = path.resolve(__dirname, "../src/pages");

function createPageFolders() {
  // 读取 lib 目录
  const libFolders = fs.readdirSync(libDir);

  libFolders.forEach((folder) => {
    if (folder === "base") return;
    const libFolderPath = path.join(libDir, folder);
    const componentClassName = folder.charAt(0).toUpperCase() + folder.slice(1);
    if (fs.statSync(libFolderPath).isDirectory()) {
      const pageFolderPath = path.join(pagesDir, folder);

      // 创建对应的 pages 文件夹
      if (!fs.existsSync(pageFolderPath)) {
        fs.mkdirSync(pageFolderPath, { recursive: true });
      }

      // 创建 Index.vue 文件
      const vueContent = `<template>
  <div>
    ${componentClassName}组件测试
    <div class="comp_container"></div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
import { onMounted } from 'vue';
import ${componentClassName} from '../../../lib/${folder}/${folder}';

onMounted(() => {
  new ${componentClassName}('asd','asd',document.getElementsByClassName('comp_container')[0], 0, {})
})
</script>

<style scoped>
/* 添加样式 */
</style>
`;
      fs.writeFileSync(path.join(pageFolderPath, "index.vue"), vueContent);
    }
  });
}

// 运行函数
createPageFolders();
