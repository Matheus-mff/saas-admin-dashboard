export type ColorUtility = "bg" | "stroke" | "fill" | "text";

export const chartColors = {
  mono: {
    bg: "bg-neutral-950 dark:bg-neutral-100",
    stroke: "stroke-neutral-950 dark:stroke-neutral-100",
    fill: "fill-neutral-950 dark:fill-neutral-100",
    text: "text-neutral-950 dark:text-neutral-100",
  },
  mono2: {
    bg: "bg-neutral-700 dark:bg-neutral-300",
    stroke: "stroke-neutral-700 dark:stroke-neutral-300",
    fill: "fill-neutral-700 dark:fill-neutral-300",
    text: "text-neutral-700 dark:text-neutral-300",
  },
  mono3: {
    bg: "bg-neutral-500 dark:bg-neutral-500",
    stroke: "stroke-neutral-500 dark:stroke-neutral-500",
    fill: "fill-neutral-500 dark:fill-neutral-500",
    text: "text-neutral-500 dark:text-neutral-500",
  },
  mono4: {
    bg: "bg-neutral-300 dark:bg-neutral-700",
    stroke: "stroke-neutral-300 dark:stroke-neutral-700",
    fill: "fill-neutral-300 dark:fill-neutral-700",
    text: "text-neutral-300 dark:text-neutral-700",
  },
  brand: {
    bg: "bg-[#6275d9] dark:bg-[#8795e6]",
    stroke: "stroke-[#6275d9] dark:stroke-[#8795e6]",
    fill: "fill-[#6275d9] dark:fill-[#8795e6]",
    text: "text-[#6275d9] dark:text-[#8795e6]",
  },
  sky: {
    bg: "bg-[#7997c8] dark:bg-[#91acd7]",
    stroke: "stroke-[#7997c8] dark:stroke-[#91acd7]",
    fill: "fill-[#7997c8] dark:fill-[#91acd7]",
    text: "text-[#7997c8] dark:text-[#91acd7]",
  },
  teal: {
    bg: "bg-[#6f978f] dark:bg-[#86ada5]",
    stroke: "stroke-[#6f978f] dark:stroke-[#86ada5]",
    fill: "fill-[#6f978f] dark:fill-[#86ada5]",
    text: "text-[#6f978f] dark:text-[#86ada5]",
  },
  iris: {
    bg: "bg-[#8b86ad] dark:bg-[#a39dc2]",
    stroke: "stroke-[#8b86ad] dark:stroke-[#a39dc2]",
    fill: "fill-[#8b86ad] dark:fill-[#a39dc2]",
    text: "text-[#8b86ad] dark:text-[#a39dc2]",
  },
  steel: {
    bg: "bg-[#7e8aa6] dark:bg-[#9aa5bd]",
    stroke: "stroke-[#7e8aa6] dark:stroke-[#9aa5bd]",
    fill: "fill-[#7e8aa6] dark:fill-[#9aa5bd]",
    text: "text-[#7e8aa6] dark:text-[#9aa5bd]",
  },
  sage: {
    bg: "bg-[#5f8f87] dark:bg-[#78aaa1]",
    stroke: "stroke-[#5f8f87] dark:stroke-[#78aaa1]",
    fill: "fill-[#5f8f87] dark:fill-[#78aaa1]",
    text: "text-[#5f8f87] dark:text-[#78aaa1]",
  },
  lavender: {
    bg: "bg-[#8a80a1] dark:bg-[#a39ab8]",
    stroke: "stroke-[#8a80a1] dark:stroke-[#a39ab8]",
    fill: "fill-[#8a80a1] dark:fill-[#a39ab8]",
    text: "text-[#8a80a1] dark:text-[#a39ab8]",
  },
  blue: {
    bg: "bg-blue-600 dark:bg-blue-400",
    stroke: "stroke-blue-600 dark:stroke-blue-400",
    fill: "fill-blue-600 dark:fill-blue-400",
    text: "text-blue-600 dark:text-blue-400",
  },
  emerald: {
    bg: "bg-emerald-600 dark:bg-emerald-400",
    stroke: "stroke-emerald-600 dark:stroke-emerald-400",
    fill: "fill-emerald-600 dark:fill-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  violet: {
    bg: "bg-violet-600 dark:bg-violet-400",
    stroke: "stroke-violet-600 dark:stroke-violet-400",
    fill: "fill-violet-600 dark:fill-violet-400",
    text: "text-violet-600 dark:text-violet-400",
  },
  amber: {
    bg: "bg-amber-500 dark:bg-amber-400",
    stroke: "stroke-amber-500 dark:stroke-amber-400",
    fill: "fill-amber-500 dark:fill-amber-400",
    text: "text-amber-500 dark:text-amber-400",
  },
  gray: {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  },
  cyan: {
    bg: "bg-cyan-500",
    stroke: "stroke-cyan-500",
    fill: "fill-cyan-500",
    text: "text-cyan-500",
  },
  pink: {
    bg: "bg-pink-500",
    stroke: "stroke-pink-500",
    fill: "fill-pink-500",
    text: "text-pink-500",
  },
  lime: {
    bg: "bg-lime-500",
    stroke: "stroke-lime-500",
    fill: "fill-lime-500",
    text: "text-lime-500",
  },
  fuchsia: {
    bg: "bg-fuchsia-500",
    stroke: "stroke-fuchsia-500",
    fill: "fill-fuchsia-500",
    text: "text-fuchsia-500",
  },
} as const;

export type AvailableChartColorsKeys = keyof typeof chartColors;

export const AvailableChartColors = Object.keys(chartColors) as AvailableChartColorsKeys[];

export function constructCategoryColors(categories: string[], colors: AvailableChartColorsKeys[]) {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();

  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length]);
  });

  return categoryColors;
}

export function getColorClassName(color: AvailableChartColorsKeys, type: ColorUtility) {
  return chartColors[color][type];
}

export function getYAxisDomain(autoMinValue: boolean, minValue?: number, maxValue?: number) {
  const minDomain = autoMinValue ? "auto" : (minValue ?? 0);

  const maxDomain = maxValue ?? "auto";

  return [minDomain, maxDomain];
}

export function hasOnlyOneValueForKey(array: Record<string, unknown>[], keyToCheck: string) {
  const values = array
    .map((obj) => obj[keyToCheck])
    .filter((value) => value !== null && value !== undefined);

  return values.length === 1;
}
