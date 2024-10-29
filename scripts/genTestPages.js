import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const libDir = path.resolve(__dirname, "../lib");
const pagesDir = path.resolve(__dirname, "../src/pages");

const otherFolder = ["base", "types", "barChart"];

function createPageFolders() {
  const libFolders = fs.readdirSync(libDir);
  
  libFolders.forEach((folder) => {
    createPage(folder);
  });
}

function createPage(folder) {
  if (otherFolder.includes(folder)) return;
  const libFolderPath = path.join(libDir, folder);
  const componentClassName = folder.charAt(0).toUpperCase() + folder.slice(1);
  if (fs.statSync(libFolderPath).isDirectory()) {
    const pageFolderPath = path.join(pagesDir, folder);

    if (!fs.existsSync(pageFolderPath)) {
      fs.mkdirSync(pageFolderPath, { recursive: true });
    }

    const reactContent = `import React, { useEffect, useRef, useState } from "react";
import PropertyPanel from "@/components/PropertyPanel";
import ${componentClassName} from "../../../lib/${folder}/${folder}";

const ${componentClassName}Test: React.FC = () => {
  const compContainerRef = useRef<HTMLDivElement | null>(null);
  const compRef = useRef<any>(null);
  const [defaultData, setDefaultData] = useState<string>("");
  const [propertyDic, setPropertyDic] = useState([]);
  const [property, setProperty] = useState<any>({});
  const [propertyTextAreaContent, setPropertyTextAreaContent] = useState<string>("");

  const handlePropertyChange = (key: string, value: any) => {
    const keys = key.split(".");
    const updatedProperty = { ...property };
    let temp = updatedProperty;

    for (let i = 0; i < keys.length - 1; i++) {
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = value;
    setProperty(updatedProperty);
    if (compRef.current) {
      compRef.current.setProperty(key, value);
    }
  };

  const handleAction = (action: string, param: any) => {
    if (compRef.current) {
      const evalStr = 'compRef.current.' + action + '(' + param.join(",") + ')';
      eval(evalStr);
      console.log(compRef.current.propertyManager.getPropertyList(), compRef.current.propertyManager.getPropertyDictionary());
      setPropertyDic(compRef.current.propertyManager.getPropertyDictionary());
      setProperty(compRef.current.propertyManager.getPropertyList());
    }
  };

  const handleDataTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDefaultData(e.target.value);
  };

  const handlePropertyTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPropertyTextAreaContent(e.target.value);
  };

  const updateData = () => {
    if (compRef.current) {
      compRef.current.update(JSON.parse(defaultData));
    }
  };

  const applyTextareaToPropertyGroup = () => {
    try {
      const updatedProperty = JSON.parse(propertyTextAreaContent);
      setProperty(updatedProperty);

      if (compRef.current) {
        compRef.current.setProperty(updatedProperty);
      }
    } catch (error) {
      console.error("Invalid JSON input", error);
    }
  };

  useEffect(() => {
    if (compContainerRef.current) {
      compRef.current = new ${componentClassName}(
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
      setPropertyDic(compRef.current.propertyManager.getPropertyDictionary());
      setProperty(compRef.current.propertyManager.getPropertyList());
      setDefaultData(JSON.stringify(compRef.current.defaultData));
    }
  }, []);

  useEffect(() => {
    setPropertyTextAreaContent(JSON.stringify(property, null, 2));
  }, [property]);

  return (
    <div>
    ${componentClassName}组件测试
      <div className="comp_prop">
        <div className="comp_container" ref={compContainerRef}></div>
        <div className="prop_container">
          <PropertyPanel property={property} propertyDic={propertyDic} onChange={handlePropertyChange} onAction={handleAction} />
        </div>
      </div>
      <div className="comp_data">
        <textarea className="data_area" value={defaultData} onChange={handleDataTextareaChange}></textarea>
        <button onClick={updateData}>update data</button>

        <textarea className="data_area" value={propertyTextAreaContent} onChange={handlePropertyTextareaChange}></textarea>
        <button onClick={applyTextareaToPropertyGroup}>Apply to PropertyGroup</button>
      </div>
    </div>
  );
};

export default ${componentClassName}Test;
`;
    fs.writeFileSync(path.join(pageFolderPath, "index.tsx"), reactContent);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  createPageFolders();
} else {
  args.forEach((d) => createPage(d));
}
