import * as THREE from "three";

THREE.ShaderChunk["branch_vert"] = [
  "",
  "attribute float side;",
  "attribute float width;",
  "attribute float counters;",
  "",
  "uniform vec2 resolution;",
  "uniform float lineWidth;",
  "uniform vec3 diffuse;",
  "uniform float opacity;",
  "uniform float near;",
  "uniform float far;",
  "uniform float sizeAttenuation;",
  "",
  "varying vec2 vUV;",
  "varying float vCounters;",

  "varying vec3 vLightFront;",
  "varying vec3 vIndirectFront;",
  "",
  "#ifdef DOUBLE_SIDED",
  "	varying vec3 vLightBack;",
  "	varying vec3 vIndirectBack;",
  "#endif",
  "",
  "#include <common>",
  "#include <uv_pars_vertex>",
  "#include <uv2_pars_vertex>",
  "#include <envmap_pars_vertex>",
  "#include <bsdfs>",
  "#include <lights_pars_begin>",
  "#include <color_pars_vertex>",
  "#include <fog_pars_vertex>",
  "#include <shadowmap_pars_vertex>",
  "#include <logdepthbuf_pars_vertex>",
  "#include <clipping_planes_pars_vertex>",

  "",
  "void main() {",
  "",
  "    #include <uv_vertex>",
  "    #include <uv2_vertex>",
  "    #include <color_vertex>",
  "",
  "    #include <beginnormal_vertex>",
  "    #include <defaultnormal_vertex>",
  "",
  "    #include <begin_vertex>",
  "",
  "    vUV = uv;",
  "    vCounters = counters;",
  "",
  "    float w = lineWidth * width;",
  "    transformed = vec3(position.x - side * w * 0.5, 0.0, position.z);",
  "",
  "    #include <project_vertex>",
  "    #include <logdepthbuf_vertex>",
  "    #include <clipping_planes_vertex>",
  "",
  "    #include <worldpos_vertex>",
  "    #include <envmap_vertex>",
  "    #include <lights_lambert_vertex>",
  "    #include <shadowmap_vertex>",
  "    #include <fog_vertex>",
  "",
  "}"
].join("\r\n");

THREE.ShaderChunk["branch_frag"] = [
  "",
  "uniform vec3 diffuse;",
  "uniform vec3 emissive;",
  "uniform float opacity;",
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
  "varying float vCounters;",
  "varying vec3 vLightFront;",
  "varying vec3 vIndirectFront;",
  "",
  "#ifdef DOUBLE_SIDED",
  "    varying vec3 vLightBack;",
  "    varying vec3 vIndirectBack;",
  "#endif",
  "",
  "",
  "#include <common>",
  "#include <packing>",
  "#include <dithering_pars_fragment>",
  "#include <color_pars_fragment>",
  "#include <uv_pars_fragment>",
  "#include <uv2_pars_fragment>",
  "#include <map_pars_fragment>",
  "#include <alphamap_pars_fragment>",
  "#include <aomap_pars_fragment>",
  "#include <lightmap_pars_fragment>",
  "#include <emissivemap_pars_fragment>",
  "#include <envmap_common_pars_fragment>",
  "#include <envmap_pars_fragment>",
  "#include <bsdfs>",
  "#include <lights_pars_begin>",
  "#include <fog_pars_fragment>",
  "#include <shadowmap_pars_fragment>",
  "#include <shadowmask_pars_fragment>",
  "#include <specularmap_pars_fragment>",
  "#include <logdepthbuf_pars_fragment>",
  "#include <clipping_planes_pars_fragment>",
  "",
  "void main() {",
  "",
  "    #include <clipping_planes_fragment>",
  "",
  "    vec4 diffuseColor = vec4( diffuse, opacity );",
  // "    vec4 diffuseColor = vColor;",

  "    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
  "    vec3 totalEmissiveRadiance = emissive;",
  "",
  "    #include <logdepthbuf_fragment>",
  "",
  "    if( useMap == 1. ) diffuseColor *= texture2D( map, vUV * repeat );",
  "    if( useAlphaMap == 1. ) diffuseColor.a *= texture2D( alphaMap, vUV * repeat ).a;",
  "    if( diffuseColor.a < alphaTest ) discard;",
  // // "    #include <map_fragment>",
  // // "    #include <color_fragment>",
  // // "    #include <alphamap_fragment>",
  // // "    #include <alphatest_fragment>",
  "    if( useDash == 1. ){",
  "        diffuseColor.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));",
  "    }",
  "",
  "    #include <specularmap_fragment>",
  "    #include <emissivemap_fragment>",
  "",
  "    // accumulation",
  "    reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );",
  "",
  "    #ifdef DOUBLE_SIDED",
  "    reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;",
  "    #else",
  "    reflectedLight.indirectDiffuse += vIndirectFront;",
  "    #endif",
  "",
  "    #include <lightmap_fragment>",
  "",
  "    reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );",
  "",
  "    #ifdef DOUBLE_SIDED",
  "    reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;",
  "    #else",
  "    reflectedLight.directDiffuse = vLightFront;",
  "    #endif",
  "",
  "    reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();",
  "",
  "    // modulation",
  "    #include <aomap_fragment>",
  "",
  "    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;",
  "",
  "    #include <envmap_fragment>",
  "",
  "    gl_FragColor = vec4(outgoingLight, diffuseColor.a);",
  "",
  "    gl_FragColor.a *= step(vCounters, visibility);",
  "",
  "    #include <tonemapping_fragment>",
  "    #include <encodings_fragment>",
  "    #include <fog_fragment>",
  "    #include <premultiplied_alpha_fragment>",
  "    #include <dithering_fragment>",
  "",
  "}"
].join("\r\n");

export default class BranchMaterial extends THREE.ShaderMaterial {
  constructor(parameters) {
    super({
      uniforms: {
        ...THREE.UniformsLib.common,
        ...THREE.UniformsLib.specularmap,
        ...THREE.UniformsLib.envmap,
        ...THREE.UniformsLib.aomap,
        ...THREE.UniformsLib.lightmap,
        ...THREE.UniformsLib.emissivemap,
        ...THREE.UniformsLib.fog,
        ...THREE.UniformsLib.lights,
        lineWidth: { value: 1 },
        map: { value: null },
        useMap: { value: 0 },
        alphaMap: { value: null },
        useAlphaMap: { value: 0 },
        emissive: { value: new THREE.Color(0x000000) },
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
    this.lights = true;

    Object.defineProperties(this, {
      emissive: {
        enumerable: true,
        get: () => this.uniforms.emissive.value,
        set: value => (this.uniforms.emissive.value = value)
      },

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
        get: () => this.uniforms.diffuse.value,
        set: value => (this.uniforms.diffuse.value = value)
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
