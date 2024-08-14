import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';  // Assuming styles are moved to a CSS file or module.

const App: React.FC = () => {
  const [menus, setMenus] = useState<Set<string>>(new Set());

  useEffect(() => {
    const pages = import.meta.glob('./pages/**/*.tsx');  // Assuming page components are converted to React TSX
    const menuSet = new Set<string>();

    Object.keys(pages).forEach((filePath) => {
      const segments = filePath.split("/");
      menuSet.add(segments[2]);
    });

    setMenus(menuSet);
    console.log(pages);
    console.log(menus);
  }, []);

  return (
    <Router>
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
            <Routes>
              {/* Define your routes here */}
            </Routes>
          </section>
        </section>
      </div>
    </Router>
  );
};

export default App;