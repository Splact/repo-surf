import { Frustum, Matrix4 } from "three";

const frustum = new Frustum();
const cameraViewProjectionMatrix = new Matrix4();

export default (object, camera) => {
  // make sure the camera matrix is updated
  camera.updateMatrixWorld();
  camera.matrixWorldInverse.getInverse(camera.matrixWorld);

  // evaluate camera/view projection matrix
  cameraViewProjectionMatrix.multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );

  // evaluate frustum
  frustum.setFromMatrix(cameraViewProjectionMatrix);

  return object.type === "Group"
    ? frustum.containsPoint(object.position)
    : frustum.intersectsObject(object);
};
