const SIZE_ORDER = [
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "2XL",
  "XXXL",
  "3XL",
  "4XL",
  "5XL",
];

const SIZE_RANK = new Map(SIZE_ORDER.map((size, index) => [size, index]));

function normalizeSize(size = "") {
  return String(size).trim().toUpperCase().replace(/\s+/g, "");
}

function getSizeRank(size) {
  const normalized = normalizeSize(size);

  if (SIZE_RANK.has(normalized)) {
    return SIZE_RANK.get(normalized);
  }

  const numericSize = Number(normalized);
  if (Number.isFinite(numericSize)) {
    return 100 + numericSize;
  }

  return 1000;
}

export function compareSizes(left, right) {
  const leftRank = getSizeRank(left);
  const rightRank = getSizeRank(right);

  if (leftRank !== rightRank) {
    return leftRank - rightRank;
  }

  return normalizeSize(left).localeCompare(normalizeSize(right), "vi", {
    numeric: true,
  });
}

export function sortSizes(sizes = []) {
  return [...sizes].sort(compareSizes);
}

export function sortVariantsBySize(variants = []) {
  return [...variants].sort((left, right) => compareSizes(left.size, right.size));
}
