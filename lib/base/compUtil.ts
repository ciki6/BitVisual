export const setGradient = (svg: any, gradient: { direction: number; stops: any[] }) => {
  let defs = null;
  // let id = "linear_" + WisUtil.guid().substring(0, 16);
  let id = "linear_" + getRadomA();
  if (svg.select("defs").empty()) {
    defs = svg.append("defs");
  } else {
    defs = svg.select("defs");
  }
  let gradientDom = defs
    .append("linearGradient")
    .attr("id", `${id}_gradient`)
    .attr("gradientUnits", "objectBoundingBox")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", gradient.direction === 0 ? "0%" : "100%")
    .attr("y2", gradient.direction === 0 ? "100%" : "0%");

  gradient.stops.forEach((stop) => {
    gradientDom.append("stop").attr("offset", stop.offset).style("stop-color", stop.color);
  });
  return `url(#${id}_gradient)`;
};

const getRadomA = () => {
  var returnStr = "",
    range = 13,
    arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  for (var i = 0; i < range; i++) {
    var index = Math.round(Math.random() * (arr.length - 1));
    returnStr += arr[index];
  }
  return returnStr;
};

export const getSymbol = (type: "circle" | "triangle" | "rect" | "pin") => {
  switch (type) {
    case "circle":
      //圆
      return "M 1 0 A 1 1 0 1 0 1 0.0001";
    case "triangle":
      //三角
      return "M 0 -1 L 1 1 L -1 1 Z";
    case "rect":
      //矩形
      return "M -1 -1 L 1 -1 L 1 1 L -1 1 L -1 -1 Z";
    case "pin":
      //大头针
      return "M -0.5421 -0.8857 A 0.6 0.6 0 1 1 0.5421 -0.8857 C 0.3878 -0.5605 0 -0.42 0 0 C 0 -0.42 -0.3878 -0.5605 -0.5421 -0.8857 Z";
  }
};

export const cutDataDemical = (json: any, keys: string[], cutNums: number[]) => {
  let data = JSON.parse(JSON.parse(json.body).data);
  let body = JSON.parse(json.body);
  for (let i = 0; i < keys.length; i++) {
    data.map((d: any) => (d[keys[i]] = Number(d[keys[i]]).toFixed(cutNums[i])));
  }
  body.data = JSON.stringify(data);
  json.body = JSON.stringify(body);
  return json;
};

export const coordinateTransfrom = (method: "bd09togcj02" | "gcj02tobd09" | "wgs84togcj02" | "gcj02towgs84", lng: number, lat: number) => {
  const xPI = (3.14159265358979324 * 3000.0) / 180.0;
  const PI = 3.1415926535897932384626;
  const a = 6378245.0;
  const ee = 0.00669342162296594323;

  const transformlat = function (lng: number, lat: number) {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
    return ret;
  };

  const transformlng = function (lng: number, lat: number) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
    return ret;
  };

  // 判断是否在国内，不在国内则不做偏移
  const outOfChina = function (lng: number, lat: number) {
    return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false;
  };

  switch (method) {
    // BD-09转GCJ-02
    case "bd09togcj02": {
      const xPI = (3.14159265358979324 * 3000.0) / 180.0;
      const x = lng - 0.0065;
      const y = lat - 0.006;
      const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPI);
      const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPI);
      const ggLng = z * Math.cos(theta);
      const ggLat = z * Math.sin(theta);

      return { lng: ggLng, lat: ggLat };
    }
    // GCJ-02转BD-09
    case "gcj02tobd09": {
      const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xPI);
      const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xPI);
      const bdLng = z * Math.cos(theta) + 0.0065;
      const bdLat = z * Math.sin(theta) + 0.006;
      return { lng: bdLng, lat: bdLat };
    }
    // WGS84转GCj02
    case "wgs84togcj02": {
      if (outOfChina(lng, lat)) {
        return { lng: lng, lat: lat };
      }

      let dLat = transformlat(lng - 105.0, lat - 35.0);
      let dLng = transformlng(lng - 105.0, lat - 35.0);
      const radLat = (lat / 180.0) * PI;
      let magic = Math.sin(radLat);
      magic = 1 - ee * magic * magic;
      let sqrtmagic = Math.sqrt(magic);
      dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dLng = (dLng * 180.0) / ((a / sqrtmagic) * Math.cos(radLat) * PI);
      const mgLat = lat + dLat;
      const mglng = lng + dLng;
      return { lng: mglng, lat: mgLat };
    }
    // GCJ02转WGS84
    case "gcj02towgs84": {
      if (outOfChina(lng, lat)) {
        return { lng: lng, lat: lat };
      }

      let dLat = transformlat(lng - 105.0, lat - 35.0);
      let dLng = transformlng(lng - 105.0, lat - 35.0);
      const radLat = (lat / 180.0) * PI;
      let magic = Math.sin(radLat);
      magic = 1 - ee * magic * magic;
      const sqrtmagic = Math.sqrt(magic);
      dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dLng = (dLng * 180.0) / ((a / sqrtmagic) * Math.cos(radLat) * PI);
      const mgLat = lat + dLat;
      const mglng = lng + dLng;
      return { lng: lng * 2 - mglng, lat: lat * 2 - mgLat };
    }
  }
};

export const imgPathToBase64 = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(path)
      .then(async (response) => {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("image/svg+xml")) {
          const svgText = await response.text();
          return {
            type: "svg" as const,
            data: svgText,
          };
        } else {
          const blob = await response.blob();
          return {
            type: "other" as const,
            data: blob,
          };
        }
      })
      .then((result) => {
        if (result.type === "svg") {
          const base64Data = btoa(result.data);
          const base64URL = "data:image/svg+xml;base64," + base64Data;
          resolve(base64URL);
        } else {
          const blob = result.data;
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result as string;
            resolve(base64Data);
          };
          reader.readAsDataURL(blob);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export function wrapText(text: d3.Selection<HTMLElement, any, any, any>, width: number, mode = 0, textIndent = 0) {
  text.each(function () {
    const targetDy: number = Number(text.attr("dy")) || 0;
    const words = splitText(text.text(), mode).reverse();
    let word: string | undefined;
    let line: string[] = [];
    let firstLine: Boolean = true;
    let lineNumber: number = 0;
    const lineHeight: number = 1.2; // ems
    const y: string | null = text.attr("y");
    const x: string | null = text.attr("x");
    const dy: number = targetDy;
    let tspan = text
      .text(null)
      .append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(joinLine(line, mode));
      if (firstLine) {
        tspan.attr("dx", textIndent);
      }
      if ((tspan.node()?.getComputedTextLength() ?? 0) > (firstLine ? width - textIndent : width)) {
        line.pop();
        tspan.text(joinLine(line, mode));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
        firstLine = false;
      }
    }
  });
}

function joinLine(line: any[], mode: number) {
  let result = "";
  let length = line.length;
  line.forEach(function (word, index) {
    result += word;
    if (mode == 1 && index < length) {
      result += isChinese(word) ? "" : " ";
    }
  });
  return result;
}

const splitText = function (str: string, mode: number) {
  let result: string[] = [];
  let splitMode: RegExp | string = "";

  if (mode == 1) {
    splitMode = /\s+/;
  }
  let split = str.split(splitMode);
  split.forEach(function (word) {
    let res = isChinese(word);
    if (res) {
      for (let index = 0; index < word.length; index++) {
        let char = word.charAt(index);
        result.push(char);
      }
    } else {
      result.push(word);
    }
  });

  return result;
};
const isChinese = (str: string): Boolean => {
  let regularExp = /[\u4E00-\u9FA5]/g;
  return regularExp.test(str);
};

export const deepCopy = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};
const S4 = (): string => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
export const guid = (): string => {
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
};

export const formatDate = (date: Date, fmt: string): string => {
  const o: { [key: string]: number } = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  const week: { [key: string]: string } = {
    "0": "\u65e5",
    "1": "\u4e00",
    "2": "\u4e8c",
    "3": "\u4e09",
    "4": "\u56db",
    "5": "\u4e94",
    "6": "\u516d",
  };

  fmt = fmt.replace(/(y+)/, (_, yearMatch) => {
    return (date.getFullYear() + "").slice(4 - yearMatch.length);
  });

  fmt = fmt.replace(/(E+)/, (_, weekMatch) => {
    return (weekMatch.length > 1 ? (weekMatch.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay().toString()];
  });

  for (const k in o) {
    fmt = fmt.replace(new RegExp(`(${k})`), (_, match) => {
      const value = o[k].toString();
      return match.length === 1 ? value : `00${value}`.slice(-match.length);
    });
  }

  return fmt;
};
