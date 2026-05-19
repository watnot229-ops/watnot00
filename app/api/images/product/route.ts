import { NextRequest, NextResponse } from "next/server";

// Category-themed color palettes
const THEMES: Record<string, { bg1: string; bg2: string; stroke: string; emoji: string }> = {
  "fruits-veggies": { bg1: "#FFECEF", bg2: "#FFF0E0", stroke: "#FFB3C1", emoji: "🍎" },
  "dairy-eggs": { bg1: "#F0F4FF", bg2: "#E6F0FA", stroke: "#ADC8FF", emoji: "🥛" },
  "meat-seafood": { bg1: "#FFF0F0", bg2: "#FFE6E6", stroke: "#FFA3A3", emoji: "🥩" },
  "snacks": { bg1: "#FFF9E6", bg2: "#FFF2CC", stroke: "#FFE0B2", emoji: "🍿" },
  "beverages": { bg1: "#EBFBFF", bg2: "#E0F7FC", stroke: "#90E0EF", emoji: "🥤" },
  "bakery": { bg1: "#FDF5E6", bg2: "#FAF0DD", stroke: "#DDB892", emoji: "🍞" },
  "staples-grains": { bg1: "#F5F5DC", bg2: "#EFEFDF", stroke: "#D0D0B0", emoji: "🌾" },
  "breakfast": { bg1: "#FFF5F5", bg2: "#FFF0E5", stroke: "#FFC9C9", emoji: "🥞" },
  "frozen-foods": { bg1: "#EDF2F7", bg2: "#E2E8F0", stroke: "#CBD5E0", emoji: "🧊" },
  "cleaning": { bg1: "#EBF8FF", bg2: "#EBF4FF", stroke: "#BEE3F8", emoji: "🧼" },
  "personal-care": { bg1: "#F7FAFC", bg2: "#EDF2F7", stroke: "#E2E8F0", emoji: "🧴" },
  "pet-care": { bg1: "#FFF5F5", bg2: "#FFF5EB", stroke: "#FEB2B2", emoji: "🐾" },
  "baby-care": { bg1: "#FFF5F7", bg2: "#FFF0F3", stroke: "#FFD8E4", emoji: "🍼" },
  "condiments": { bg1: "#FFF8F0", bg2: "#FFFAF0", stroke: "#FEEBC8", emoji: "🍯" },
  "instant-food": { bg1: "#FFF5F5", bg2: "#FFF5EB", stroke: "#FFD8A8", emoji: "🍜" },
  "default": { bg1: "#F7FAFC", bg2: "#EDF2F7", stroke: "#E2E8F0", emoji: "📦" }
};

// Map popular keywords to specific emojis for high fidelity
const EMOJI_MAP: Record<string, string> = {
  "tomato": "🍅",
  "onion": "🧅",
  "spinach": "🥬",
  "banana": "🍌",
  "apple": "🍎",
  "cucumber": "🥒",
  "carrot": "🥕",
  "pepper": "🫑",
  "pea": "🫛",
  "corn": "🌽",
  "ginger": "🫚",
  "garlic": "🧄",
  "lemon": "🍋",
  "watermelon": "🍉",
  "mango": "🥭",
  "grape": "🍇",
  "pomegranate": "🍎",
  "avocado": "🥑",
  "milk": "🥛",
  "egg": "🥚",
  "butter": "🧈",
  "paneer": "🧀",
  "cheese": "🧀",
  "dahi": "🥣",
  "curd": "🥣",
  "chicken": "🍗",
  "fish": "🐟",
  "mutton": "🥩",
  "prawn": "🍤",
  "lays": "🥔",
  "chips": "🍟",
  "coca": "🥤",
  "coke": "🥤",
  "pepsi": "🥤",
  "bread": "🍞",
  "atta": "🌾",
  "rice": "🍚",
  "oil": "🛢️",
  "soap": "🧼",
  "shampoo": "🧴",
  "cleaner": "🧹"
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";
  const category = searchParams.get("category") || "default";

  // Pick theme
  const theme = THEMES[category] || THEMES.default;

  // Resolve best matching emoji
  let emoji = theme.emoji;
  const lowerName = name.toLowerCase();
  for (const [keyword, icon] of Object.entries(EMOJI_MAP)) {
    if (lowerName.includes(keyword)) {
      emoji = icon;
      break;
    }
  }

  // Generate SVG String
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${theme.bg1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${theme.bg2};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#1A202C" flood-opacity="0.08" />
        </filter>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${theme.stroke}" stroke-width="0.5" opacity="0.3" />
        </pattern>
      </defs>
      
      <!-- Base Card Background -->
      <rect width="400" height="400" rx="24" fill="url(#grad)" />
      
      <!-- Dynamic grid overlay for tech/modern feeling -->
      <rect width="400" height="400" rx="24" fill="url(#grid)" />
      
      <!-- Glassmorphic Central Circle -->
      <circle cx="200" cy="200" r="100" fill="#FFFFFF" fill-opacity="0.8" stroke="${theme.stroke}" stroke-width="2" filter="url(#shadow)" />
      
      <!-- Inner accent highlight ring -->
      <circle cx="200" cy="200" r="85" fill="none" stroke="${theme.stroke}" stroke-width="1" stroke-dasharray="4 4" opacity="0.7" />
      
      <!-- Vector Product Illustration (High Fidelity Emoji) -->
      <text x="200" y="222" font-family="system-ui, -apple-system, sans-serif" font-size="82" text-anchor="middle" dominant-baseline="middle" style="user-select: none;">
        ${emoji}
      </text>

      <!-- Aesthetic corner logo mark -->
      <circle cx="40" cy="40" r="8" fill="${theme.stroke}" opacity="0.5" />
      <circle cx="56" cy="40" r="4" fill="${theme.stroke}" opacity="0.3" />
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
