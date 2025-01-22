import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import React, { lazy, Suspense, ComponentType } from "react";
import Layout from "@/layout";

import PropertyKit from "@/pages/componentKit/propertyKit";

const fixedRoutes: RouteObject[] = [
  {
    path: "/componentKit/propertyKit",
    element: <PropertyKit />,
  },
];

const excludeFolders = ["componentKit"];

const allPages = import.meta.glob("../pages/**/*.tsx") as Record<string, () => Promise<{ default: ComponentType<any> }>>;

const pages = Object.keys(allPages)
  .filter((filePath) => {
    return !excludeFolders.some((folder) => filePath.includes(folder));
  })
  .reduce((result, filePath) => {
    result[filePath] = allPages[filePath];
    return result;
  }, {} as Record<string, () => Promise<{ default: ComponentType<any> }>>);

const compRoutes: RouteObject[] = Object.keys(pages).map((filePath) => {
  const path = filePath
    .replace("../pages", "")
    .replace(/\.tsx$/, "")
    .replace(/\/index$/, "/")
    .replace(/\/\[/, "/:")
    .replace(/\]/, "");

  const Component = lazy(pages[filePath]);

  return {
    path: path === "" ? "/" : path,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    ),
  };
});

compRoutes.push({
  path: "/",
  element: <Navigate to="/barChart" />,
});

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [...fixedRoutes, ...compRoutes],
  },
];

console.log(routes, "routes");

// 创建路由器
const router = createBrowserRouter(routes);

export default router;
