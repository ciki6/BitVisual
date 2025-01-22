import React, { useState } from "react";
import { translateWithBaidu } from "@/api";

type ExcelData = {
  属性分类: string;
  一级分组: string;
  二级分组: string;
  属性: string;
  配置项类型: string;
  数值说明: string;
  默认值: string;
  提示词tips: string;
  单位unit: string;
  备注: string;
};

const PropertyKit: React.FC = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  const handleButtonClick = () => {
    console.log(processJson(parseRowDataToJson(parsePropertyDataToRowData(text1))), "text1");
  };

  const typeMapping: Record<string, any> = {
    组合数据输入框: [],
    图片上传器: "",
    颜色选择器: "",
    数值输入框: 0,
    开关选项: false,
    字体组合输入: {
      family: "",
      size: 0,
      color: "",
      bolder: false,
      italic: false,
      underline: false,
    },
    颜色列表选择器: [],
    普通输入框: "",
    位置选择器: [],
    单选按钮: "",
    进度条数值输入: 0,
    下拉选择框: "",
  };

  const parsePropertyDataToRowData = (input: string): ExcelData[] => {
    const rows = input.split("\n");
    const headers = rows.shift()?.split("\t") || [];

    let lastCategory = ""; // 缓存“属性分类”
    let lastGroup1 = ""; // 缓存“一级分组”
    let lastGroup2 = ""; // 缓存“二级分组”

    return rows
      .filter((row) => row.trim() !== "") // 跳过空行
      .map((row) => {
        const columns = row.split("\t");
        const obj: Partial<ExcelData> = {};

        headers.forEach((header, index) => {
          const value = columns[index]?.trim() || "";
          switch (header.trim()) {
            case "属性分类":
              obj[header.trim() as keyof ExcelData] = value || lastCategory;
              if (value) lastCategory = value; // 更新缓存
              break;
            case "一级分组":
              obj[header.trim() as keyof ExcelData] = value || lastGroup1;
              if (value) lastGroup1 = value; // 更新缓存
              break;
            case "二级分组":
              obj[header.trim() as keyof ExcelData] = value || lastGroup2;
              if (value) lastGroup2 = value; // 更新缓存
              break;
            default:
              obj[header.trim() as keyof ExcelData] = value;
          }
        });

        return obj as ExcelData;
      });
  };

  const parseRowDataToJson = (data: ExcelData[]) => {
    const result: Record<string, any> = {};

    data.forEach((row) => {
      const { 属性分类, 一级分组, 二级分组, 属性, 配置项类型, 默认值 } = row;

      // 初始化分类
      if (!result[属性分类]) {
        result[属性分类] = {};
      }

      let currentGroup = result[属性分类];

      // 处理一级分组
      if (一级分组 && 一级分组 !== "/") {
        if (!currentGroup[一级分组]) {
          currentGroup[一级分组] = {};
        }
        currentGroup = currentGroup[一级分组];
      }

      // 处理二级分组
      if (二级分组 && 二级分组 !== "/") {
        if (!currentGroup[二级分组]) {
          currentGroup[二级分组] = {};
        }
        currentGroup = currentGroup[二级分组];
      }

      // 根据配置项类型设置值
      currentGroup[属性] = 默认值 !== undefined ? 默认值 : typeMapping[配置项类型] ?? null;
    });

    return result;
  };

  const processJson = async (data: any): Promise<any> => {
    const jsonString = JSON.stringify(data);
    console.log(jsonString, "jsonString");
    const res = await translateWithBaidu(jsonString);
    const camelCase = toCamelCase(res);
    console.log(camelCase, "res");
    return toCamelCase(res);
  };

  const toCamelCase = (obj: any): any => {
    debugger;
    if (Array.isArray(obj)) {
      // 如果是数组，递归处理每个元素
      return obj.map(toCamelCase);
    } else if (typeof obj === "object" && obj !== null) {
      // 如果是对象，处理每个键
      const newObj: Record<string, any> = {};
      Object.keys(obj).forEach((key) => {
        // 将键转为驼峰格式
        const camelKey = key.replace(/([-_ ][a-z])/gi, (match) => match.toUpperCase().replace(/[-_ ]/g, "")).replace(/^[A-Z]/, (match) => match.toLowerCase());
        // 递归处理值
        newObj[camelKey] = toCamelCase(obj[key]);
      });
      return newObj;
    }
    // 如果不是对象或数组，直接返回原值
    return obj;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Textarea Example</h1>
      <div style={{ marginBottom: "10px" }}>
        <textarea value={text1} onChange={(e) => setText1(e.target.value)} placeholder="Enter text for textarea 1" style={{ width: "100%", height: "100px", marginBottom: "10px" }} />
        <textarea value={text2} onChange={(e) => setText2(e.target.value)} placeholder="Enter text for textarea 2" style={{ width: "100%", height: "100px" }} />
      </div>
      <button onClick={handleButtonClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Show Values
      </button>
    </div>
  );
};

export default PropertyKit;
