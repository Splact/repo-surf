import { LoadingManager as THREELoadingManager } from "three";

import clamp from "utils/clamp";

import FontResource from "./FontResource";
import FetchResource from "./FetchResource";

export const RESOURCE_TYPE_FONT = 0;
export const RESOURCE_TYPE_FETCH = 1;

export default class LoadingManager {
  constructor(options) {
    const { onStart, onProgress, onLoad, onError } = options || {};

    this.manager = new THREELoadingManager();
    this.resources = [];

    this.handleStart = onStart || (f => f);
    this.handleProgress = onProgress || (f => f);
    this.handleLoad = onLoad || (f => f);
    this.handleError = onError || (f => f);

    this.manager.onStart = this.handleStart;
    this.manager.onLoad = this.handleLoad;
    this.manager.onError = this.handleError;
  }

  init(options) {
    const { onStart, onProgress, onLoad, onError } = options || {};

    this.handleStart = onStart || (f => f);
    this.handleProgress = onProgress || (f => f);
    this.handleLoad = onLoad || (f => f);
    this.handleError = onError || (f => f);

    this.manager.onStart = this.handleStart;
    this.manager.onLoad = this.handleLoad;
    this.manager.onError = this.handleError;
  }

  registerResource = (data, type) => {
    let res;

    switch (type) {
      case RESOURCE_TYPE_FONT:
        res = new FontResource(data, { manager: this.manager });
        break;
      case RESOURCE_TYPE_FETCH:
        res = new FetchResource(data, { manager: this.manager });
        break;
      default:
        return;
    }

    this.resources.push(res);

    return res;
  };

  progress = () => {
    const progress = clamp(
      this.resources.length
        ? this.resources.reduce((sum, resource) => sum + resource.progress, 0) /
            this.resources.length
        : 1,
      {
        min: 0,
        max: 1
      }
    );

    this.handleProgress(progress);
  };

  load() {
    console.log(
      `loading ${this.resources.length} resources...`,
      this.resources
    );

    this.resources.forEach(resource => {
      resource.load(this.progress);
    });
  }
}
