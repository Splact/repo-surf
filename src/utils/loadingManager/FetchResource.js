import clamp from "utils/clamp";
import Resource from "./Resource";

export default class FetchResource extends Resource {
  load(onProgress) {
    const url = this.request;

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", e => {
      const json = JSON.parse(xhr.response);

      this.setResponse(json);
      onProgress();
    });
    xhr.addEventListener("progress", ({ loaded, total }) => {
      this.progress = !total ? 1 : clamp(loaded / total, { min: 0, max: 1 });
      console.log("progress fetch", this.progress);
      onProgress();
    });
    xhr.addEventListener("error", e => {
      console.log("Error fetching url.", { url }, e);
      throw new Error(e);
    });
    xhr.addEventListener("abort", e => {
      console.log("Fetching url has been aborted.", { url }, e);
      throw new Error(e);
    });
    xhr.open("GET", url);
    xhr.send();
  }
}
