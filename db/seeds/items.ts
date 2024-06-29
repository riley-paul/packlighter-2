import { generateId } from "@/api/helpers/generate-id";
import type { Item } from "astro:db";

export const itemInserts = (userId: string): (typeof Item.$inferInsert)[] => [
  {
    id: generateId(),
    userId,
    name: "Shell jacket",
    description: "Arc'teryx Beta AR",
  },
  {
    id: generateId(),
    userId,
    name: "Toque",
    description: "Wool hat knitted by Syd's mother",
  },
  { id: generateId(), userId, name: "Tennis Racket", description: "" },
  {
    id: generateId(),
    userId,
    name: "Backcountry Skis",
    description: "G3 ROAMr 100mm",
  },
  {
    id: generateId(),
    userId,
    name: "Ski Boots",
    description: "Hoji Dynafit Free 130",
  },
  {
    id: generateId(),
    userId,
    name: "Climbing Helmet",
    description: "Black Diamond Vapour",
  },
  {
    id: generateId(),
    userId,
    name: "Light insulated jacket",
    description: "Arc'teryx Atom LT",
  },
  {
    id: generateId(),
    userId,
    name: "Lunch",
    description: "Fruit, nuts, energy bars, cheese and crackers",
  },
  {
    id: generateId(),
    userId,
    name: "Multitool",
    description: "Leatherman Free P4",
  },
  {
    id: generateId(),
    userId,
    name: "Hiking pants",
    description: "Arc'teryx Gamma Quick dry",
  },
  {
    id: generateId(),
    userId,
    name: "Flannel shirt",
    description: "Simple mid-weight flannel",
  },
  {
    id: generateId(),
    userId,
    name: "Laptop",
    description: "2021 MacBook Pro 14",
  },
  {
    id: generateId(),
    userId,
    name: "Phone",
    description: "iPhone 15 + charger",
  },
  {
    id: generateId(),
    userId,
    name: "Wide Lens",
    description: "Fujinon XF 18mm f/1.4",
  },
  {
    id: generateId(),
    userId,
    name: "Skins",
    description: "G3 Alpinist+ Universal",
  },
  {
    id: generateId(),
    userId,
    name: "Daypack",
    description: "Arc'teryx Mantis 20 + rain cover",
  },
  {
    id: generateId(),
    userId,
    name: "Toothpaste",
    description: "Travel size",
  },
  {
    id: generateId(),
    userId,
    name: "Overnight Pack",
    description: "Gregory Stout 65",
  },
  { id: generateId(), userId, name: "Tent", description: "MEC TGV 2" },
  {
    id: generateId(),
    userId,
    name: "Sleeping bag",
    description: "MEC -5¬∞C down",
  },
  {
    id: generateId(),
    userId,
    name: "Sleeping pad",
    description: "Double-wide",
  },
  {
    id: generateId(),
    userId,
    name: "Snow Shovel",
    description: "Black Diamond Evac 7",
  },
  {
    id: generateId(),
    userId,
    name: "Snow Probe",
    description: "Black Diamond 240",
  },
  { id: generateId(), userId, name: "Beacon", description: "BCA Tracker S" },
  {
    id: generateId(),
    userId,
    name: "Heavy mittens",
    description: "MEC T3 Expedition Mitts",
  },
  {
    id: generateId(),
    userId,
    name: "Heavy insulated jacket",
    description: "MEC Tremblant Down Jacket",
  },
  { id: generateId(), userId, name: "Ski socks", description: "Merino wool" },
  {
    id: generateId(),
    userId,
    name: "Liner gloves",
    description: "OR thin gloves",
  },
  { id: generateId(), userId, name: "Buff", description: "Merino wool" },
  {
    id: generateId(),
    userId,
    name: "Base layer bottoms",
    description: "Merino wool",
  },
  {
    id: generateId(),
    userId,
    name: "Ski gloves",
    description: "Kombi free fall leather gloves",
  },
  {
    id: generateId(),
    userId,
    name: "Base layer top",
    description: "MEC quarter zip fleece",
  },
  {
    id: generateId(),
    userId,
    name: "Ski pants",
    description: "Arc'teryx Rush FL pants",
  },
  {
    id: generateId(),
    userId,
    name: "Trekking poles",
    description: "MEC Uplink trekking poles",
  },
  {
    id: generateId(),
    userId,
    name: "Ski crampons",
    description: "G3 ski crampons",
  },
  {
    id: generateId(),
    userId,
    name: "Snow glasses",
    description: "Sunglasses with peripheral shields",
  },
  { id: generateId(), userId, name: "Camera", description: "Fujifilm X-T4" },
  {
    id: generateId(),
    userId,
    name: "Telephoto lens",
    description: "Fujinon XF 55-200mm f/3.5-4.8",
  },
  {
    id: generateId(),
    userId,
    name: "Ultrawide lens",
    description: "Rokinon 12mm f/2",
  },
  {
    id: generateId(),
    userId,
    name: "Normal lens",
    description: "Fujinon XF 35mm f/1.4",
  },
  {
    id: generateId(),
    userId,
    name: "Camera pouch",
    description: "Strohl x Moment Mountain Light Holster",
  },
  {
    id: generateId(),
    userId,
    name: "Helmet carrier",
    description: "Arc'teryx Coarc",
  },
  {
    id: generateId(),
    userId,
    name: "Camp pillow",
    description: "MEC inflatable",
  },
  {
    id: generateId(),
    userId,
    name: "Mid-weight gloves",
    description: "Rab gloves",
  },
  {
    id: generateId(),
    userId,
    name: "Hiking socks",
    description: "Darn Tough merino",
  },
  {
    id: generateId(),
    userId,
    name: "Hiking boots",
    description: "Danner leather mid-rise",
  },
  {
    id: generateId(),
    userId,
    name: "Approach shoes",
    description: "Arc'teryx Konseal FL 2",
  },
  {
    id: generateId(),
    userId,
    name: "Trail runners",
    description: "Arc'teryx Novan LD 3",
  },
  {
    id: generateId(),
    userId,
    name: "Adventure sandals",
    description: "Teva Classics",
  },
  {
    id: generateId(),
    userId,
    name: "Harness",
    description: "Arc'teryx AR-395A",
  },
  {
    id: generateId(),
    userId,
    name: "Climbing shoes",
    description: "La Sportiva TC Pro Rock Shoes",
  },
  {
    id: generateId(),
    userId,
    name: "Climbing rope",
    description: "55m x 9.8mm - orange",
  },
  {
    id: generateId(),
    userId,
    name: "Chalk bag",
    description: "Arc'teryx Aperture",
  },
  {
    id: generateId(),
    userId,
    name: "Quick-draw",
    description: "Black Diamond HotForge Hybrid",
  },
  {
    id: generateId(),
    userId,
    name: "Belay device",
    description: "DMM Pivot + locking carabiner",
  },
  {
    id: generateId(),
    userId,
    name: "Anchor system",
    description: "120cm webbing + 2 carabiners + 2 locking carabiners",
  },
  {
    id: generateId(),
    userId,
    name: "Personal anchor system",
    description: "Daisy chain + locking carabiner",
  },
  {
    id: generateId(),
    userId,
    name: "Duffel bag",
    description: "Patagonia Black Hole 55L",
  },
  {
    id: generateId(),
    userId,
    name: "Climbing pants",
    description: "Arc'teryx Konseal LT",
  },
  { id: generateId(), userId, name: "Jogging pants", description: "Adidas" },
  { id: generateId(), userId, name: "Sunglasses", description: "Sunski" },
  {
    id: generateId(),
    userId,
    name: "Bush saw",
    description: "Bahco Laplander",
  },
  {
    id: generateId(),
    userId,
    name: "T-Shirt",
    description: "MEC merino wool",
  },
  {
    id: generateId(),
    userId,
    name: "Running vest",
    description: "Lightweight vest with 1L of water",
  },
  {
    id: generateId(),
    userId,
    name: "Running shorts",
    description: "Lululemon",
  },
  {
    id: generateId(),
    userId,
    name: "Softshell jacket",
    description: "Arc'teryx Gamma SL",
  },
  {
    id: generateId(),
    userId,
    name: "Rope bag",
    description: "Arc'teryx Ion",
  },
  { id: generateId(), userId, name: "Belay glasses", description: "" },
  {
    id: generateId(),
    userId,
    name: "Water bottle",
    description: "1L Nalgene",
  },
  {
    id: generateId(),
    userId,
    name: "Running socks",
    description: "Lightweight merino wool",
  },
  {
    id: generateId(),
    userId,
    name: "Windbreaker jacket",
    description: "Arc'teryx Nodin",
  },
  {
    id: generateId(),
    userId,
    name: "Headphones",
    description: "Airpods Pro",
  },
  {
    id: generateId(),
    userId,
    name: "Energy snacks",
    description: "Cliff bar, stinger gummies",
  },
  {
    id: generateId(),
    userId,
    name: "Down quilt",
    description: "MEC Talon 0¬∞C",
  },
  {
    id: generateId(),
    userId,
    name: "Hut booties",
    description: "MEC Hut Slippers",
  },
  {
    id: generateId(),
    userId,
    name: "Minimal toiletries",
    description: "Toothbrush + paste, soap, floss, deoderant",
  },
  {
    id: generateId(),
    userId,
    name: "Ice axe",
    description: "Black Diamon Raven 70cm",
  },
  {
    id: generateId(),
    userId,
    name: "Crevasse rescue kit",
    description:
      "Micro Traxion, Partner pulley, Locking biner x 2, prussik, 120cm sling",
  },
  { id: generateId(), userId, name: "Wallet", description: "Leather" },
  { id: generateId(), userId, name: "Keys", description: "Car/house keys" },
  {
    id: generateId(),
    userId,
    name: "Emergency kit",
    description:
      "First-aid, sunscreen, lip balm, multi-tool, headlamp, fire-starter",
  },
  {
    id: generateId(),
    userId,
    name: "Fleece jacket",
    description: "Arc'teryx Delta LT",
  },
  { id: generateId(), userId, name: "Bear spray", description: "" },
  { id: generateId(), userId, name: "Guide book", description: "" },
  {
    id: generateId(),
    userId,
    name: "Small duffel",
    description: "MEC Travel Light 22L",
  },
  {
    id: generateId(),
    userId,
    name: "Base hoody",
    description: "Arc'teryx Motus AR",
  },
  {
    id: generateId(),
    userId,
    name: "Ski goggles",
    description: "Old pair of Spy goggle",
  },
  {
    id: generateId(),
    userId,
    name: "Stove",
    description: "MSR Pocket Rocket 2",
  },
  { id: generateId(), userId, name: "Fuel", description: "Butane Canister" },
  { id: generateId(), userId, name: "Cup", description: "Enamel coated" },
  {
    id: generateId(),
    userId,
    name: "Cooking pot",
    description: "MSR Stowaway Pot - 775mL",
  },
  {
    id: generateId(),
    userId,
    name: "Spoon",
    description: "MSR Long Tool Spoon",
  },
  {
    id: generateId(),
    userId,
    name: "Tripod",
    description: "Modified Manfrotto",
  },
  { id: generateId(), userId, name: "Ball cap", description: "Fjallraven" },
  {
    id: generateId(),
    userId,
    name: "Swimming trunks",
    description: "Patagonia Baggies 9in",
  },
  {
    id: generateId(),
    userId,
    name: "Underwear",
    description: "Arc'teryx Motus SL",
  },
  {
    id: generateId(),
    userId,
    name: "Belay gloves",
    description: "Petzl Cordex",
  },
  {
    id: generateId(),
    userId,
    name: "Alpine Pack",
    description: "Arc'teryx Alpha SK 32",
  },
  {
    id: generateId(),
    userId,
    name: "Heavy hiking pants",
    description: "Fjallraven Vida Pro",
  },
];
