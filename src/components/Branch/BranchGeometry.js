import * as THREE from "three";

export default class BranchGeometry {
  constructor() {
    this.positions = [];

    this.previous = [];
    this.next = [];
    this.side = [];
    this.width = [];
    this.indices_array = [];
    this.uvs = [];
    this.counters = [];
    this.geometry = new THREE.BufferGeometry();

    this.widthCallback = null;

    // Used to raycast
    this.matrixWorld = new THREE.Matrix4();

    this.raycastInverseMatrix = new THREE.Matrix4();
    this.raycastRay = new THREE.Ray();
    this.raycastSphere = new THREE.Sphere();
  }

  setMatrixWorld = matrixWorld => {
    this.matrixWorld = matrixWorld;
  };

  setGeometry = (g, c) => {
    this.widthCallback = c;

    this.positions = [];
    this.counters = [];
    // g.computeBoundingBox();
    // g.computeBoundingSphere();

    // set the normals
    // g.computeVertexNormals();
    if (g instanceof THREE.Geometry) {
      for (let j = 0; j < g.vertices.length; j++) {
        let v = g.vertices[j];
        let c = j / g.vertices.length;
        this.positions.push(v.x, v.y, v.z);
        this.positions.push(v.x, v.y, v.z);
        this.counters.push(c);
        this.counters.push(c);
      }
    }

    if (g instanceof THREE.BufferGeometry) {
      // read attribute positions ?
    }

    if (g instanceof Float32Array || g instanceof Array) {
      for (let j = 0; j < g.length; j += 3) {
        const c = j / g.length;
        this.positions.push(g[j], g[j + 1], g[j + 2]);
        this.positions.push(g[j], g[j + 1], g[j + 2]);
        this.counters.push(c);
        this.counters.push(c);
      }
    }

    this.process();
  };

  raycast = (raycaster, intersects) => {
    var precision = raycaster.linePrecision;
    var precisionSq = precision * precision;

    var geometry = this.geometry;

    if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

    // Checking boundingSphere distance to ray

    this.raycastSphere.copy(geometry.boundingSphere);
    this.raycastSphere.applyMatrix4(this.matrixWorld);

    if (raycaster.ray.intersectSphere(this.raycastSphere) === false) {
      return;
    }

    this.raycastInverseMatrix.getInverse(this.matrixWorld);
    this.raycastRay.copy(raycaster.ray).applyMatrix4(this.raycastInverseMatrix);

    var vStart = new THREE.Vector3();
    var vEnd = new THREE.Vector3();
    var interSegment = new THREE.Vector3();
    var interRay = new THREE.Vector3();
    var step = this instanceof THREE.LineSegments ? 2 : 1;

    if (geometry instanceof THREE.BufferGeometry) {
      var index = geometry.index;
      var attributes = geometry.attributes;

      if (index !== null) {
        var indices = index.array;
        var positions = attributes.position.array;

        for (var i = 0, l = indices.length - 1; i < l; i += step) {
          var a = indices[i];
          var b = indices[i + 1];

          vStart.fromArray(positions, a * 3);
          vEnd.fromArray(positions, b * 3);

          var distSq = this.raycastRay.distanceSqToSegment(
            vStart,
            vEnd,
            interRay,
            interSegment
          );

          if (distSq > precisionSq) continue;

          interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

          var distance = raycaster.ray.origin.distanceTo(interRay);

          if (distance < raycaster.near || distance > raycaster.far) continue;

          intersects.push({
            distance: distance,
            // What do we want? intersection point on the ray or on the segment??
            // point: raycaster.ray.at( distance ),
            point: interSegment.clone().applyMatrix4(this.matrixWorld),
            index: i,
            face: null,
            faceIndex: null,
            object: this
          });
        }
      } else {
        const positions = attributes.position.array;

        for (let i = 0, l = positions.length / 3 - 1; i < l; i += step) {
          vStart.fromArray(positions, 3 * i);
          vEnd.fromArray(positions, 3 * i + 3);

          const distSq = this.raycastRay.distanceSqToSegment(
            vStart,
            vEnd,
            interRay,
            interSegment
          );

          if (distSq > precisionSq) continue;

          interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

          const distance = raycaster.ray.origin.distanceTo(interRay);

          if (distance < raycaster.near || distance > raycaster.far) continue;

          intersects.push({
            distance: distance,
            // What do we want? intersection point on the ray or on the segment??
            // point: raycaster.ray.at( distance ),
            point: interSegment.clone().applyMatrix4(this.matrixWorld),
            index: i,
            face: null,
            faceIndex: null,
            object: this
          });
        }
      }
    } else if (geometry instanceof THREE.Geometry) {
      var vertices = geometry.vertices;
      var nbVertices = vertices.length;

      for (let i = 0; i < nbVertices - 1; i += step) {
        const distSq = this.raycastRay.distanceSqToSegment(
          vertices[i],
          vertices[i + 1],
          interRay,
          interSegment
        );

        if (distSq > precisionSq) continue;

        interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

        const distance = raycaster.ray.origin.distanceTo(interRay);

        if (distance < raycaster.near || distance > raycaster.far) continue;

        intersects.push({
          distance: distance,
          // What do we want? intersection point on the ray or on the segment??
          // point: raycaster.ray.at( distance ),
          point: interSegment.clone().applyMatrix4(this.matrixWorld),
          index: i,
          face: null,
          faceIndex: null,
          object: this
        });
      }
    }
  };

  compareV3 = (a, b) => {
    const aa = a * 6;
    const ab = b * 6;

    return (
      this.positions[aa] === this.positions[ab] &&
      this.positions[aa + 1] === this.positions[ab + 1] &&
      this.positions[aa + 2] === this.positions[ab + 2]
    );
  };

  copyV3 = a => {
    const aa = a * 6;

    return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
  };

  process = () => {
    const l = this.positions.length / 6;

    this.previous = [];
    this.next = [];
    this.side = [];
    this.width = [];
    this.indices_array = [];
    this.uvs = [];

    for (let j = 0; j < l; j++) {
      this.side.push(1);
      this.side.push(-1);
    }

    let w;
    for (let j = 0; j < l; j++) {
      if (this.widthCallback) w = this.widthCallback(j / (l - 1));
      else w = 1;
      this.width.push(w);
      this.width.push(w);
    }

    for (var j = 0; j < l; j++) {
      this.uvs.push(j / (l - 1), 0);
      this.uvs.push(j / (l - 1), 1);
    }

    var v;

    if (this.compareV3(0, l - 1)) {
      v = this.copyV3(l - 2);
    } else {
      v = this.copyV3(0);
    }
    this.previous.push(v[0], v[1], v[2]);
    this.previous.push(v[0], v[1], v[2]);
    for (let j = 0; j < l - 1; j++) {
      v = this.copyV3(j);
      this.previous.push(v[0], v[1], v[2]);
      this.previous.push(v[0], v[1], v[2]);
    }

    for (let j = 1; j < l; j++) {
      v = this.copyV3(j);
      this.next.push(v[0], v[1], v[2]);
      this.next.push(v[0], v[1], v[2]);
    }

    if (this.compareV3(l - 1, 0)) {
      v = this.copyV3(1);
    } else {
      v = this.copyV3(l - 1);
    }
    this.next.push(v[0], v[1], v[2]);
    this.next.push(v[0], v[1], v[2]);

    for (let j = 0; j < l - 1; j++) {
      var n = j * 2;
      this.indices_array.push(n, n + 1, n + 2);
      this.indices_array.push(n + 2, n + 1, n + 3);
    }

    if (!this.attributes) {
      this.attributes = {
        position: new THREE.BufferAttribute(
          new Float32Array(this.positions),
          3
        ),
        previous: new THREE.BufferAttribute(new Float32Array(this.previous), 3),
        next: new THREE.BufferAttribute(new Float32Array(this.next), 3),
        side: new THREE.BufferAttribute(new Float32Array(this.side), 1),
        width: new THREE.BufferAttribute(new Float32Array(this.width), 1),
        uv: new THREE.BufferAttribute(new Float32Array(this.uvs), 2),
        index: new THREE.BufferAttribute(
          new Uint16Array(this.indices_array),
          1
        ),
        counters: new THREE.BufferAttribute(new Float32Array(this.counters), 1)
      };
    } else {
      this.attributes.position.copyArray(new Float32Array(this.positions));
      this.attributes.position.needsUpdate = true;
      this.attributes.previous.copyArray(new Float32Array(this.previous));
      this.attributes.previous.needsUpdate = true;
      this.attributes.next.copyArray(new Float32Array(this.next));
      this.attributes.next.needsUpdate = true;
      this.attributes.side.copyArray(new Float32Array(this.side));
      this.attributes.side.needsUpdate = true;
      this.attributes.width.copyArray(new Float32Array(this.width));
      this.attributes.width.needsUpdate = true;
      this.attributes.uv.copyArray(new Float32Array(this.uvs));
      this.attributes.uv.needsUpdate = true;
      this.attributes.index.copyArray(new Uint16Array(this.indices_array));
      this.attributes.index.needsUpdate = true;
    }

    this.geometry.setAttribute("position", this.attributes.position);
    this.geometry.setAttribute("previous", this.attributes.previous);
    this.geometry.setAttribute("next", this.attributes.next);
    this.geometry.setAttribute("side", this.attributes.side);
    this.geometry.setAttribute("width", this.attributes.width);
    this.geometry.setAttribute("uv", this.attributes.uv);
    this.geometry.setAttribute("counters", this.attributes.counters);

    this.geometry.setIndex(this.attributes.index);
  };

  memcpy(src, srcOffset, dst, dstOffset, length) {
    var i;

    src = src.subarray || src.slice ? src : src.buffer;
    dst = dst.subarray || dst.slice ? dst : dst.buffer;

    src = srcOffset
      ? src.subarray
        ? src.subarray(srcOffset, length && srcOffset + length)
        : src.slice(srcOffset, length && srcOffset + length)
      : src;

    if (dst.set) {
      dst.set(src, dstOffset);
    } else {
      for (i = 0; i < src.length; i++) {
        dst[i + dstOffset] = src[i];
      }
    }

    return dst;
  }

  advance = position => {
    let positions = this.attributes.position.array;
    const previous = this.attributes.previous.array;
    let next = this.attributes.next.array;
    const l = positions.length;

    // PREVIOUS
    this.memcpy(positions, 0, previous, 0, l);

    // POSITIONS
    this.memcpy(positions, 6, positions, 0, l - 6);

    positions[l - 6] = position.x;
    positions[l - 5] = position.y;
    positions[l - 4] = position.z;
    positions[l - 3] = position.x;
    positions[l - 2] = position.y;
    positions[l - 1] = position.z;

    // NEXT
    this.memcpy(positions, 6, next, 0, l - 6);

    next[l - 6] = position.x;
    next[l - 5] = position.y;
    next[l - 4] = position.z;
    next[l - 3] = position.x;
    next[l - 2] = position.y;
    next[l - 1] = position.z;

    this.attributes.position.needsUpdate = true;
    this.attributes.previous.needsUpdate = true;
    this.attributes.next.needsUpdate = true;
  };
}
