import { IconSymbolName } from "@/components/ui/icon-symbol";

const iconMap: Record<string, IconSymbolName> = {
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
  default: "tag.fill",
};

export function resolveIcon(genericName: string): IconSymbolName {
  return iconMap[genericName] ?? iconMap["default"];
}
