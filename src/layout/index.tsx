import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import "./index.css";

const Layout: React.FC = () => {
  const [menus, setMenus] = useState<Set<string>>(new Set());

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
  }, []);

  return (
    <div className="container vertical">
      <header>header</header>
      <section className="container">
        <aside className="vertical">
          {[...menus].map((item, index) => (
            <Link key={index} to={`/${item}`}>
              {item}
            </Link>
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
