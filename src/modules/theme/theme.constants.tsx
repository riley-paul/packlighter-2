import { LaptopIcon, MoonIcon, SunIcon, type LucideIcon } from "lucide-react";

export const themeOptions: {
  value: string;
  name: string;
  icon: LucideIcon;
}[] = [
  {
    value: "system",
    name: "Auto",
    icon: LaptopIcon,
  },
  {
    value: "light",
    name: "Light",
    icon: SunIcon,
  },
  {
    value: "dark",
    name: "Dark",
    icon: MoonIcon,
  },
];
