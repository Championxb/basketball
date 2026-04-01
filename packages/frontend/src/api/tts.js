import { post } from "./request.js";
// Use Vite dev proxy to avoid CORS in development
const url = "/api/v1/tts";
const token = "a2I6FRjkGxtO-jYB8EvLpKsWisiXmuTs";
const appid = "7363614801";

export function genTTS(options = {}) {
  const headers = {
    Authorization: `Bearer;${token}`,
  };
  const data = {
    app: {
      appid,
      token,
      cluster: "volcano_tts",
    },
    user: {
      uid: "2118166251",
    },
    audio: {
      voice_type: options.voice_type,
      encoding: "mp3",
      speed_ratio: 1.0,
      enable_emotion: true,
      emotion: 'ASMR',
    },
    request: {
      //以时间戳作为reqid
      reqid: Date.now().toString(),
      text: options.text,
      operation: "query",
    },
  };
  return post(url, data, { headers });
}
