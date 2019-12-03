import * as THREE from "three";

THREE.ShaderChunk["branch_vert"] = [
  "",
  THREE.ShaderChunk.logdepthbuf_pars_vertex,
  THREE.ShaderChunk.fog_pars_vertex,
  "",
  "attribute float side;",
  "attribute float width;",
  "attribute float counters;",
  "",
  "uniform vec2 resolution;",
  "uniform float lineWidth;",
  "uniform vec3 color;",
  "uniform float opacity;",
  "uniform float near;",
  "uniform float far;",
  "uniform float sizeAttenuation;",
  "",
  "varying vec2 vUV;",
  "varying vec4 vColor;",
  "varying float vCounters;",
  "",
  "void main() {",
  "",
  "    float aspect = resolution.x / resolution.y;",
  "    float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);",
  "",
  "    vColor = vec4( color, opacity );",
  "    vUV = uv;",
  "    vCounters = counters;",
  "",
  "    mat4 m = projectionMatrix * modelViewMatrix;",
  "    float w = lineWidth * width;",
  "    vec4 finalPosition = m * vec4( position.x + side * w * 0.5, 0.0, position.z, 1.0 );",
  "",
  "    gl_Position = finalPosition;",
  "",
  THREE.ShaderChunk.logdepthbuf_vertex,
  THREE.ShaderChunk.fog_vertex &&
    "    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
  THREE.ShaderChunk.fog_vertex,
  "}"
].join("\r\n");

THREE.ShaderChunk["branch_frag"] = [
  "",
  THREE.ShaderChunk.fog_pars_fragment,
  THREE.ShaderChunk.logdepthbuf_pars_fragment,
  "",
  "uniform sampler2D map;",
  "uniform sampler2D alphaMap;",
  "uniform float useMap;",
  "uniform float useAlphaMap;",
  "uniform float useDash;",
  "uniform float dashArray;",
  "uniform float dashOffset;",
  "uniform float dashRatio;",
  "uniform float visibility;",
  "uniform float alphaTest;",
  "uniform vec2 repeat;",
  "",
  "varying vec2 vUV;",
  "varying vec4 vColor;",
  "varying float vCounters;",
  "",
  "void main() {",
  "",
  THREE.ShaderChunk.logdepthbuf_fragment,
  "",
  "    vec4 c = vColor;",
  "    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );",
  "    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;",
  "    if( c.a < alphaTest ) discard;",
  "    if( useDash == 1. ){",
  "        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));",
  "    }",
  "    gl_FragColor = c;",
  "    gl_FragColor.a *= step(vCounters, visibility);",
  "",
  THREE.ShaderChunk.fog_fragment,
  "}"
].join("\r\n");

export default class BranchMaterial extends THREE.ShaderMaterial {
  constructor(parameters) {
    super({
      uniforms: {
        ...THREE.UniformsLib.fog,
        lineWidth: { value: 1 },
        map: { value: null },
        useMap: { value: 0 },
        alphaMap: { value: null },
        useAlphaMap: { value: 0 },
        color: { value: new THREE.Color(0xffffff) },
        opacity: { value: 1 },
        resolution: { value: new THREE.Vector2(1, 1) },
        sizeAttenuation: { value: 1 },
        near: { value: 1 },
        far: { value: 1 },
        dashArray: { value: 0 },
        dashOffset: { value: 0 },
        dashRatio: { value: 0.5 },
        useDash: { value: 0 },
        visibility: { value: 1 },
        alphaTest: { value: 0 },
        repeat: { value: new THREE.Vector2(1, 1) }
      },

      vertexShader: THREE.ShaderChunk.branch_vert,
      fragmentShader: THREE.ShaderChunk.branch_frag
    });

    this.type = "BranchMaterial";
    this.isBranchMaterial = true;

    Object.defineProperties(this, {
      lineWidth: {
        enumerable: true,
        get: () => this.uniforms.lineWidth.value,
        set: value => (this.uniforms.lineWidth.value = value)
      },
      map: {
        enumerable: true,
        get: () => this.uniforms.map.value,
        set: value => (this.uniforms.map.value = value)
      },
      useMap: {
        enumerable: true,
        get: () => this.uniforms.useMap.value,
        set: value => (this.uniforms.useMap.value = value)
      },
      alphaMap: {
        enumerable: true,
        get: () => this.uniforms.alphaMap.value,
        set: value => (this.uniforms.alphaMap.value = value)
      },
      useAlphaMap: {
        enumerable: true,
        get: () => this.uniforms.useAlphaMap.value,
        set: value => (this.uniforms.useAlphaMap.value = value)
      },
      color: {
        enumerable: true,
        get: () => this.uniforms.color.value,
        set: value => (this.uniforms.color.value = value)
      },
      opacity: {
        enumerable: true,
        get: () => this.uniforms.opacity.value,
        set: value => (this.uniforms.opacity.value = value)
      },
      resolution: {
        enumerable: true,
        get: () => this.uniforms.resolution.value,
        set: value => this.uniforms.resolution.value.copy(value)
      },
      sizeAttenuation: {
        enumerable: true,
        get: () => this.uniforms.sizeAttenuation.value,
        set: value => (this.uniforms.sizeAttenuation.value = value)
      },
      near: {
        enumerable: true,
        get: () => this.uniforms.near.value,
        set: value => (this.uniforms.near.value = value)
      },
      far: {
        enumerable: true,
        get: () => this.uniforms.far.value,
        set: value => (this.uniforms.far.value = value)
      },
      dashArray: {
        enumerable: true,
        get: () => this.uniforms.dashArray.value,
        set: value => {
          this.uniforms.dashArray.value = value;
          this.useDash = value !== 0 ? 1 : 0;
        }
      },
      dashOffset: {
        enumerable: true,
        get: () => this.uniforms.dashOffset.value,
        set: value => (this.uniforms.dashOffset.value = value)
      },
      dashRatio: {
        enumerable: true,
        get: () => this.uniforms.dashRatio.value,
        set: value => (this.uniforms.dashRatio.value = value)
      },
      useDash: {
        enumerable: true,
        get: () => this.uniforms.useDash.value,
        set: value => (this.uniforms.useDash.value = value)
      },
      visibility: {
        enumerable: true,
        get: () => this.uniforms.visibility.value,
        set: value => (this.uniforms.visibility.value = value)
      },
      alphaTest: {
        enumerable: true,
        get: () => this.uniforms.alphaTest.value,
        set: value => (this.uniforms.alphaTest.value = value)
      },
      repeat: {
        enumerable: true,
        get: () => this.uniforms.repeat.value,
        set: value => this.uniforms.repeat.value.copy(value)
      }
    });

    this.setValues(parameters);
  }

  copy = source => {
    super.copy(source);

    this.lineWidth = source.lineWidth;
    this.map = source.map;
    this.useMap = source.useMap;
    this.alphaMap = source.alphaMap;
    this.useAlphaMap = source.useAlphaMap;
    this.color.copy(source.color);
    this.opacity = source.opacity;
    this.resolution.copy(source.resolution);
    this.sizeAttenuation = source.sizeAttenuation;
    this.near = source.near;
    this.far = source.far;
    this.dashArray.copy(source.dashArray);
    this.dashOffset.copy(source.dashOffset);
    this.dashRatio.copy(source.dashRatio);
    this.useDash = source.useDash;
    this.visibility = source.visibility;
    this.alphaTest = source.alphaTest;
    this.repeat.copy(source.repeat);

    return this;
  };
}
