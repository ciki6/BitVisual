import CryptoJS from "crypto-js";
import * as $ from "jquery";

const BAIDU_TRANSLATE_API = "https://fanyi-api.baidu.com/api/trans/vip/translate";
const APP_ID = "20250122002259233"; // 替换为你的百度翻译 App ID
const SECRET_KEY = "wgtvWCyhpsdoycnz_whR"; // 替换为你的百度翻译密钥

// 生成签名
const generateSign = (q: string, salt: string, appid: string, key: string) => {
  const raw = appid + q + salt + key;
  return CryptoJS.MD5(raw).toString();
};

/**
 * 调用百度翻译 API
 * @param text - 需要翻译的文本
 * @param targetLanguage - 目标语言（如 "en"）
 * @param sourceLanguage - 源语言（默认为自动检测 "auto"）
 * @returns 翻译后的文本
 */
export async function translateWithBaidu(text: string): Promise<string> {
  const salt = Math.random().toString(36).substring(2); // 生成随机数
  const sign = generateSign(text, salt, APP_ID, SECRET_KEY);
  const domain = "it"; // 表示翻译的领域为信息技术
  const sourceLanguage = "zh";
  const targetLanguage = "en";

  try {
    return new Promise<string>((resolve, reject) => {
      $.ajax({
        url: BAIDU_TRANSLATE_API,
        type: "GET",
        dataType: "jsonp", // 使用 JSONP 解决跨域问题
        data: {
          q: text,
          from: sourceLanguage,
          to: targetLanguage,
          appid: APP_ID,
          salt: salt,
          domain: domain,
          sign: sign,
        },
        success: function (data) {
          if (data.error_code) {
            console.error(`翻译错误: ${data.error_msg}`);
            reject(text); // 返回原文作为回退
          } else {
            resolve(data.trans_result[0].dst); // 返回翻译结果
          }
        },
      });
    });
  } catch (error) {
    console.error("翻译请求失败:", error);
    return text; // 返回原文作为回退
  }
}
