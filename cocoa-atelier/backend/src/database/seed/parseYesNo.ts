// Понимает «Да» и «Нет» без учёта регистра
export function parseYesNo(text: string): boolean {
  const value = text.trim().toLowerCase();

  if (value !== 'да' && value !== 'нет')
    throw new Error(
      `Не удалось прочитать признак: «${text}», ожидается «Да» или «Нет»`,
    );

  return value === 'да';
}
