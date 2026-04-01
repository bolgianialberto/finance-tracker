const pad = (n: number) => String(n).padStart(2, "0");

export function getMonthRange(): { firstDay: string; lastDay: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = `${year}-${pad(month + 1)}-01`;
  const lastDay = `${year}-${pad(month + 1)}-${pad(new Date(year, month + 1, 0).getDate())}`;

  return { firstDay, lastDay };
}
