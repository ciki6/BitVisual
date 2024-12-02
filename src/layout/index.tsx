import React, { useEffect, useState,useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import WisChart from "@wiscom/wiscomponent";

import "./index.css";

const Layout: React.FC = () => {
  const compContainerRef = useRef<HTMLDivElement | null>(null);
  const [menus, setMenus] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const pages = import.meta.glob("../pages/**/*.tsx");
    const menuSet = new Set<string>();
    Object.keys(pages).forEach((filePath) => {
      const segments = filePath.split("/");
      menuSet.add(segments[2]);
    });

    setMenus(menuSet);
    console.log(pages, "pages");
    console.log(menus, "menus");

    if (compContainerRef.current) {
       new WisChart.BarChart(
        "asd",
        "asd",
        compContainerRef.current as Element,
        0,
        {
          property: {
            basic: {
              frame: [0, 0, 1920, 1080],
            },
          },
        },
        true
      );
    }
  }, []);

  return (
    <div className="container vertical">
      <header>
        单组件测试页面<div ref={compContainerRef}></div>
      </header>
      <section className="container">
        <aside className="vertical">
          <div className="menu-title">组件列表</div>
          {[...menus].map((item, index) => (
            <div className="menu-item" key={index} onClick={() => navigate(`/${item}`)}>
              {item}
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
