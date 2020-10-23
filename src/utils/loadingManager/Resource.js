export default class Resource {
  constructor(data, { manager }) {
    this.request = data;
    this.progress = 0;
    this.response = {};
    this.manager = manager;
    this.isLoaded = false;
    this.onLoaded = f => f;
  }

  setResponse(response) {
    this.response = response;
    this.isLoaded = true;
    this.progress = 1;

    this.onLoaded(this.response);
  }

  async get() {
    if (!this.isLoaded) {
      return new Promise(resolve => {
        this.onLoaded = resolve;
      });
    }

    return this.response;
  }

  load() {}
}
