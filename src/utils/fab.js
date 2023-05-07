const isArray = (obj) => {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  
  const cleanKey = (str) => {
    return str
      .replace("Position", "")
      .replace("Rotation", "angle")
      .replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
      })
      .replace(/\s/g, "")
      .replace(/^(.)/, function ($1) {
        return $1.toLowerCase();
      });
  };
  
  const cleanHMKeys = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
    if (isArray(obj)) {
      return obj.map((o) => cleanHMKeys(o));
    }
    return Object.keys(obj).reduce((prev, curr) => {
      prev[cleanKey(curr)] = cleanHMKeys(obj[curr]);
      return prev;
    }, {});
  };
  
  export let cleanHMObj = (inputData) => {
    let hmObj = cleanHMKeys(inputData);
    return hmObj;
  };
  