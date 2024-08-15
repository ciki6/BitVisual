import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import React, { lazy, Suspense, ComponentType } from "react";
import Layout from "@/layout";

const pages: any = import.meta.glob("../pages/**/*.tsx");

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
    children: compRoutes,
  },
];

// 创建路由器
const router = createBrowserRouter(routes);

export default router;
