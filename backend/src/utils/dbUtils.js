// Utility function to perform deep merge

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const deepMerge = (target, source) => {
    for (const key of Object.keys(source)) {
      if (
        source[key] instanceof Object &&
        key in target &&
        target[key] instanceof Object
      ) {
        Object.assign(source[key], deepMerge(target[key], source[key]));
      }
    }
    return { ...target, ...source };
  };

  export { deepMerge, generateUUID };