import { ColorTemperature } from '@smort-home/firestore';

export const gradientStops = [
  [0, [221, 250, 255]] as const,
  [33, [255, 255, 255]] as const,
  [66, [255, 252, 166]] as const,
  [100, [255, 213, 146]] as const,
] as const;

export const calculateColor = (
  factor: number,
): readonly [number, number, number] => {
  const exactMatch = gradientStops.find(([stop]) => stop === factor);
  if (exactMatch) return exactMatch[1];
  const colorAIndex: number =
    gradientStops.findIndex(([stop]) => stop >= factor) ?? 0;
  const [colorAStop, colorAValue] = gradientStops[colorAIndex - 1];
  const [colorBStop, colorBValue] = gradientStops[colorAIndex];
  const adjustedFactor = (factor - colorAStop) / (colorBStop - colorAStop);
  return colorAValue.map(
    (aVal, index) => aVal + adjustedFactor * (colorBValue[index] - aVal),
  ) as [number, number, number];
};

export const formatAsRgba = (
  value: readonly [number, number, number],
  alpha?: number,
) => `rgba(${[...value, alpha ?? 1].join(', ')})`;

export const gradientBg =
  'linear-gradient(90deg, ' +
  gradientStops
    .map(([stop, value]) => `${formatAsRgba(value)}  ${stop}%`)
    .join(', ') +
  ')';

export const adjustValue = ({
  schema: { min, max },
  value,
}: ColorTemperature) => ((value - min) / (max - min)) * 100;
export const reverseAdjustValue = (
  adjustedColorValue: number,
  { min, max }: ColorTemperature['schema'],
) => Math.round((adjustedColorValue / 100) * (max - min) + min);
