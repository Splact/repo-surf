import { TextureLoader } from "three";
import loadBMFont from "load-bmfont";
import loadingManager from "utils/loadingManager";

const loadFont = ({ font, image }) =>
  new Promise((resolve, reject) => {
    loadBMFont(font, (e, definition) => {
      if (e) {
        reject(e);
      } else {
        const loader = new TextureLoader(loadingManager);
        loader.load(
          image,
          atlas => {
            resolve({ definition, atlas });
          },
          undefined,
          e => {
            reject(e);
          }
        );
      }
    });
  });

export default loadFont;
