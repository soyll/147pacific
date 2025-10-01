// Type declarations for static assets

declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.glb?url' {
  const src: string;
  export default src;
}

declare module '*.gltf' {
  const src: string;
  export default src;
}

declare module '*.gltf?url' {
  const src: string;
  export default src;
}
