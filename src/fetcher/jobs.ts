import axios from "axios";
import { FetchJobsParams } from "../types";

export const getJobs = async (params: FetchJobsParams) => {
  const res = await axios.get(
    "https://www.upwork.com/ab/find-work/api/feeds/saved-searches",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        authorization: params.token,
        "sec-ch-ua":
          '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-newrelic-id": "VQIBUF5RGwYFU1ZXAAACXw==",
        "x-oauth2-required": "true",
        "x-odesk-csrf-token": "69824a2493503097bad68ba9823a54c0",
        "x-odesk-user-agent": "oDesk LM",
        "x-requested-with": "XMLHttpRequest",
        cookie: params.cookies,
      },
    }
  );
  return res.data;
};
