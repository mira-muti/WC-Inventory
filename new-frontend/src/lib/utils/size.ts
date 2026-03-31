// utils/sizes.ts
export const getSizeWeight = (size: string | null | undefined): number => {
  if (!size) return 9999; // "No Size" at the end
  const sizeStr = size.toUpperCase();

  // Handle numerical sizes (e.g. "12", "4T")
  if (!isNaN(Number(sizeStr))) {
    return Number(sizeStr) + 1000; // after letter sizes
  }

  const baseWeights: { [key: string]: number } = {
    XXS: 100,
    XS: 200,
    S: 300,
    M: 400,
    L: 500,
    XL: 600,
    XXL: 700,
  };

  if (baseWeights[sizeStr]) {
    return baseWeights[sizeStr];
  }

  // Handle extended "X" sizes
  if (sizeStr.endsWith("S")) {
    const xCount = (sizeStr.match(/X/g) || []).length;
    if (xCount > 2) {
      // XXXS, XXXXS...
      return 100 - (xCount - 2) * 50;
    }
  } else if (sizeStr.endsWith("L")) {
    const xCount = (sizeStr.match(/X/g) || []).length;
    if (xCount > 2) {
      // XXXL, XXXXL...
      return 700 + (xCount - 2) * 50;
    }
  }

  return 1500; // unknowns at the end
};

