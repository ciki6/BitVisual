# WisComponent 组件库

## 目录结构

root  
├── lib //组件库代码  
│   ├── base //组件基类及各个功能化模块，包括 OptionType 的定义以及 d3.js  
│   ├── types //组件所使用到的数据类型  
│   ├── ...components //组件文件夹  
│   └── index.ts //组件入口文件  
├── public  
│   ├── geojson //地理信息相关组件使用的 geojson 文件  
│   └── images //组件所使用的图片  
│   └── ...components //组件所引用的图片以组件文件夹进行分类  
├── scripts //开发过程中所需要的脚本  
│   ├── componentTestTemplate.ejs //组件测试页面模板  
│   └── genTestPages.js //自动生成组件测试页面脚本  
├── src //组件测试平台代码  
│   ├── components //组件测试平台所需要的组件  
│   │   └── ...components for test pages  
│   ├── layout //组件测试平台布局  
│   ├── pages //组件测试页面  
│   │   └── ...component test pages  
│   ├── router //组件测试平台路由，根据 pages 文件夹结构自动生成  
│   ├── App.tsx  
│   ├── index.css  
│   ├── main.tsx  
│   └── vite-env.d.ts  
├── .gitignore  
├── .npmrc  
├── index.html  
├── package-lock.json  
├── package.json  
├── README.md  
├── tsconfig.app.json  
├── tsconfig.json  
├── tsconfig.node.json  
└── vite.config.ts

## 新增组件

1. 在`lib`文件夹下创建组件文件夹，文件夹命名为组件类名的驼峰形式，文件夹下创建组件所需的 ts 文件以及 css 文件，命名与文件夹名相同。
2. 编写组件代码后使用`npm run genPages`命令创建组件的测试页面，已经创建的页面不会重复创建，如果需要重新创建需要删除已有页面
3. 执行`npm run dev`命令启动 vite 服务打开组件测试平台
4. 在`lib/index.ts`中添加组件引用，以及在`lib/types/index.d.ts`中添加组件类型引用
5. 通过 git 提交代码
