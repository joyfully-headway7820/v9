// Понимает «0,12%», «1.15» и «0.008999999999999999»; лишние знаки отсекаются округлением
export function parseNumber(text: string, decimals: number): number {
  const value = Number(text.replace('%', '').replace(',', '.').trim());

  if (Number.isNaN(value))
    throw new Error(`Не удалось прочитать число: «${text}»`);

  return Number(value.toFixed(decimals));
}
