import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./index.css";

const Layout: React.FC = () => {
  const [menus, setMenus] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const staticMenus = [
    {
      title: "配置转换",
      folder: "componentKit",
      path: "componentKit/propertyKit",
    },
  ];

  useEffect(() => {
    const pages = import.meta.glob("../pages/**/*.tsx");
    const menuSet = new Set<string>();
    Object.keys(pages).forEach((filePath) => {
      if (!staticMenus.map((d) => d.folder).some((folder) => filePath.includes(folder))) {
        const segments = filePath.split("/");
        menuSet.add(segments[2]);
      }
    });
    setMenus(menuSet);
  }, []);

  return (
    <div className="container vertical">
      <header>单组件测试页面</header>
      <section className="container">
        <aside className="vertical">
          <div className="menu-title">组件列表</div>
          {[...menus].map((item, index) => (
            <div className="menu-item" key={index} onClick={() => navigate(`/${item}`)}>
              {item}
            </div>
          ))}
          <div className="menu-title">其它工具</div>
          {[...staticMenus].map((item, index) => (
            <div className="menu-item" key={index} onClick={() => navigate(`/${item.path}`)}>
              {item.title}
            </div>
          ))}
        </aside>
        <section>
          <Outlet />
        </section>
      </section>
    </div>
  );
};

export default Layout;
