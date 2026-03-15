import { IconSymbolName } from "@/components/ui/icon-symbol";

const iconMap: Record<string, IconSymbolName> = {
  // Esistenti
  home: "house.fill",
  food: "fork.knife",
  transport: "car.fill",
  health: "heart.fill",
  entertainment: "gamecontroller.fill",
  shopping: "bag.fill",
  subscription: "arrow.clockwise",
  utilities: "bolt.fill",
  education: "graduationcap.fill",
  travel: "airplane",
  salary: "briefcase.fill",
  freelance: "laptopcomputer",
  investments: "chart.line.uptrend.xyaxis",
  gifts: "gift.fill",
  // Nuove
  fitness: "figure.run",
  music: "music.note",
  coffee: "cup.and.saucer.fill",
  pet: "pawprint.fill",
  phone: "phone.fill",
  camera: "camera.fill",
  book: "book.fill",
  star: "star.fill",
  flag: "flag.fill",
  map: "map.fill",
  bank: "building.columns.fill",
  piggybank: "banknote.fill",
  wallet: "wallet.pass.fill",
  medicine: "pills.fill",
  tree: "leaf.fill",
  sun: "sun.max.fill",
  moon: "moon.fill",
  cloud: "cloud.fill",
  fire: "flame.fill",
  drop: "drop.fill",
  default: "tag.fill",
};

export function resolveIcon(genericName: string): IconSymbolName {
  return iconMap[genericName] ?? iconMap["default"];
}

/**
 * Lista di tutte le icone disponibili per la selezione utente.
 * Ogni entry ha la chiave generica (salvata su DB) e il nome SF Symbol.
 */
export const AVAILABLE_ICONS: { key: string; icon: IconSymbolName }[] =
  Object.entries(iconMap)
    .filter(([key]: [string, IconSymbolName]) => key !== "default")
    .map(([key, icon]: [string, IconSymbolName]) => ({ key, icon }));
