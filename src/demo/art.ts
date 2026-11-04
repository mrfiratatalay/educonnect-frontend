/**
 * Demo images drawn as SVG data URIs: no external image service, no licensing
 * questions and nothing to download. Real uploads in the demo are downscaled
 * and stored the same way.
 */

const FONT = "Inter, 'Segoe UI', Arial, sans-serif";

function svgUri(svg: string) {
  // Also escape ' ( ) so the URI is safe inside an unquoted CSS url(...), as some cards use.
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts.slice(0, 1);
  return letters.map((part) => part[0]?.toLocaleUpperCase("tr-TR") ?? "").join("");
}

export const AVATAR_COLORS = [
  "#0F766E", "#0369A1", "#7C3AED", "#BE185D", "#B45309",
  "#15803D", "#4338CA", "#C2410C", "#0E7490", "#9D174D",
];

export function avatarArt(name: string, color: string) {
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="${color}"/>` +
      `<circle cx="78" cy="14" r="30" fill="#fff" opacity="0.08"/>` +
      `<text x="48" y="60" font-family="${FONT}" font-size="34" font-weight="600" fill="#fff" text-anchor="middle">${initialsOf(name)}</text></svg>`,
  );
}

export function coverArt(from: string, to: string) {
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
      `<rect width="1200" height="400" fill="url(#g)"/><circle cx="1040" cy="60" r="220" fill="#fff" opacity="0.10"/>` +
      `<circle cx="160" cy="420" r="260" fill="#fff" opacity="0.08"/><path d="M0 300 C300 240 520 360 820 290 S1100 250 1200 280 V400 H0Z" fill="#fff" opacity="0.10"/></svg>`,
  );
}

export function logoArt(label: string, color: string) {
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${color}"/>` +
      `<text x="48" y="59" font-family="${FONT}" font-size="30" font-weight="700" fill="#fff" text-anchor="middle">${initialsOf(label)}</text></svg>`,
  );
}

type Palette = { from: string; to: string; ink: string; soft: string };

export const PALETTES: Record<string, Palette> = {
  teal: { from: "#CCFBF1", to: "#99F6E4", ink: "#0F766E", soft: "#5EEAD4" },
  sky: { from: "#E0F2FE", to: "#BAE6FD", ink: "#0369A1", soft: "#7DD3FC" },
  violet: { from: "#EDE9FE", to: "#DDD6FE", ink: "#6D28D9", soft: "#C4B5FD" },
  amber: { from: "#FEF3C7", to: "#FDE68A", ink: "#B45309", soft: "#FCD34D" },
  rose: { from: "#FFE4E6", to: "#FECDD3", ink: "#BE123C", soft: "#FDA4AF" },
  slate: { from: "#F1F5F9", to: "#CBD5E1", ink: "#334155", soft: "#94A3B8" },
  lime: { from: "#ECFCCB", to: "#D9F99D", ink: "#4D7C0F", soft: "#BEF264" },
};

export type ProductShape =
  | "books" | "calculator" | "headphones" | "lamp" | "ticket"
  | "drafting" | "bike" | "backpack" | "circuit";

function productBody(shape: ProductShape, p: Palette) {
  const dark = "#1F2937";
  switch (shape) {
    case "books":
      return (
        `<rect x="160" y="270" width="280" height="46" rx="8" fill="${p.ink}"/><rect x="176" y="279" width="248" height="28" rx="4" fill="#fff" opacity="0.92"/>` +
        `<rect x="182" y="222" width="250" height="44" rx="8" fill="${dark}"/><rect x="196" y="231" width="222" height="26" rx="4" fill="#fff" opacity="0.9"/>` +
        `<rect x="200" y="176" width="220" height="42" rx="8" fill="${p.ink}" opacity="0.75"/><rect x="212" y="185" width="196" height="24" rx="4" fill="#fff" opacity="0.9"/>` +
        `<rect x="236" y="120" width="40" height="52" rx="4" fill="${p.soft}"/>`
      );
    case "calculator": {
      let keys = "";
      for (let row = 0; row < 5; row += 1) {
        for (let col = 0; col < 4; col += 1) {
          const accent = col === 3 && row < 2;
          keys += `<rect x="${237 + col * 33}" y="${192 + row * 31}" width="25" height="21" rx="5" fill="${accent ? p.ink : "#4B5563"}"/>`;
        }
      }
      return (
        `<rect x="215" y="95" width="170" height="262" rx="22" fill="${dark}"/><rect x="233" y="116" width="134" height="56" rx="8" fill="${p.from}"/>` +
        `<text x="356" y="153" font-family="monospace" font-size="26" fill="${dark}" text-anchor="end">3,1416</text>${keys}`
      );
    }
    case "headphones":
      return (
        `<path d="M200 262 C200 128 400 128 400 262" stroke="${dark}" stroke-width="18" fill="none" stroke-linecap="round"/>` +
        `<rect x="174" y="236" width="54" height="92" rx="24" fill="${p.ink}"/><rect x="372" y="236" width="54" height="92" rx="24" fill="${p.ink}"/>` +
        `<rect x="187" y="250" width="28" height="64" rx="13" fill="#fff" opacity="0.25"/><rect x="385" y="250" width="28" height="64" rx="13" fill="#fff" opacity="0.25"/>`
      );
    case "lamp":
      return (
        `<path d="M352 202 L428 190 L478 336 L300 336 Z" fill="#FDE68A" opacity="0.55"/><ellipse cx="250" cy="346" rx="72" ry="14" fill="${dark}"/>` +
        `<path d="M250 340 L298 222 L356 172" stroke="${dark}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<circle cx="298" cy="222" r="10" fill="${p.ink}"/><path d="M326 150 L410 118 L432 190 L350 206 Z" fill="${p.ink}"/>`
      );
    case "ticket":
      return (
        `<rect x="140" y="146" width="320" height="158" rx="16" fill="${p.ink}"/><circle cx="140" cy="225" r="20" fill="${p.to}"/><circle cx="460" cy="225" r="20" fill="${p.to}"/>` +
        `<line x1="372" y1="160" x2="372" y2="290" stroke="#fff" stroke-width="3" stroke-dasharray="7 7" opacity="0.8"/>` +
        `<text x="256" y="216" font-family="${FONT}" font-size="25" font-weight="800" fill="#fff" text-anchor="middle">BAHAR</text>` +
        `<text x="256" y="246" font-family="${FONT}" font-size="25" font-weight="800" fill="#fff" text-anchor="middle">KONSERİ</text>` +
        `<text x="416" y="232" font-family="${FONT}" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">2 KİŞİ</text>`
      );
    case "drafting": {
      let ticks = "";
      for (let x = 166; x <= 434; x += 16) {
        ticks += `<line x1="${x}" y1="282" x2="${x}" y2="${(x - 166) % 48 === 0 ? 302 : 294}" stroke="${dark}" stroke-width="3"/>`;
      }
      return (
        `<path d="M168 262 L168 138 L292 262 Z" fill="none" stroke="${p.ink}" stroke-width="10" stroke-linejoin="round" opacity="0.8"/>` +
        `<rect x="150" y="278" width="300" height="44" rx="6" fill="${p.soft}"/>${ticks}` +
        `<path d="M330 104 L292 262 M330 104 L370 262" stroke="#334155" stroke-width="9" stroke-linecap="round"/><circle cx="330" cy="100" r="12" fill="${p.ink}"/>`
      );
    }
    case "bike":
      return (
        `<circle cx="200" cy="296" r="64" stroke="${dark}" stroke-width="12" fill="none"/><circle cx="404" cy="296" r="64" stroke="${dark}" stroke-width="12" fill="none"/>` +
        `<path d="M200 296 L272 208 L352 208 L404 296 M272 208 L302 296 L200 296 M302 296 L352 208" stroke="${p.ink}" stroke-width="11" fill="none" stroke-linejoin="round" stroke-linecap="round"/>` +
        `<path d="M258 190 L292 190 M352 208 L364 176 L392 176" stroke="${dark}" stroke-width="10" stroke-linecap="round" fill="none"/>`
      );
    case "backpack":
      return (
        `<path d="M266 132 C266 98 334 98 334 132" stroke="${dark}" stroke-width="12" fill="none"/><rect x="222" y="126" width="156" height="220" rx="42" fill="${p.ink}"/>` +
        `<rect x="246" y="246" width="108" height="74" rx="18" fill="#fff" opacity="0.2"/><line x1="258" y1="270" x2="342" y2="270" stroke="#fff" stroke-width="4" opacity="0.6"/>`
      );
    case "circuit":
      return (
        `<rect x="160" y="138" width="280" height="176" rx="14" fill="${p.ink}"/><rect x="146" y="180" width="30" height="44" rx="4" fill="#94A3B8"/>` +
        `<rect x="262" y="194" width="86" height="62" rx="6" fill="${dark}"/><path d="M200 166 H262 M348 222 H410 V170 M220 286 V256 H262 M384 286 V250" stroke="#FDE68A" stroke-width="4" fill="none"/>` +
        `<circle cx="410" cy="170" r="7" fill="#FDE68A"/><circle cx="220" cy="286" r="7" fill="#FDE68A"/><circle cx="384" cy="286" r="7" fill="#FDE68A"/>`
      );
  }
}

export function productArt(shape: ProductShape, paletteName: keyof typeof PALETTES) {
  const p = PALETTES[paletteName];
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${p.from}"/><stop offset="1" stop-color="${p.to}"/></linearGradient></defs>` +
      `<rect width="600" height="450" fill="url(#g)"/><circle cx="300" cy="228" r="170" fill="#fff" opacity="0.35"/>` +
      `<ellipse cx="300" cy="372" rx="190" ry="18" fill="#0F172A" opacity="0.08"/>${productBody(shape, p)}</svg>`,
  );
}

export type PosterKind = "hackathon" | "career" | "kackar" | "sunset" | "books" | "blood";

export function posterArt(kind: PosterKind) {
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750">`;
  const title = (text: string, color: string, y = 330, size = 104) =>
    `<text x="96" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="800" fill="${color}">${text}</text>`;
  const line = (text: string, color: string, y: number, size = 38) =>
    `<text x="100" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="500" fill="${color}">${text}</text>`;

  switch (kind) {
    case "hackathon": {
      let grid = "";
      for (let x = 0; x <= 1200; x += 60) grid += `<line x1="${x}" y1="0" x2="${x}" y2="750" stroke="#5EEAD4" opacity="0.07"/>`;
      for (let y = 0; y <= 750; y += 60) grid += `<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="#5EEAD4" opacity="0.07"/>`;
      return svgUri(
        `${open}<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0F172A"/><stop offset="1" stop-color="#134E4A"/></linearGradient></defs>` +
          `<rect width="1200" height="750" fill="url(#g)"/>${grid}<text x="1110" y="560" font-family="monospace" font-size="420" fill="#5EEAD4" opacity="0.12" text-anchor="end">{ }</text>` +
          `${line("RTEÜ YAZILIM TOPLULUĞU", "#5EEAD4", 210, 34)}${title("HACKATHON", "#FFFFFF", 340, 132)}` +
          `${line("48 saat · 3-4 kişilik takımlar · kampüs için ürün", "#E2E8F0", 420)}${line("Mentörler, atölyeler ve ödüller", "#94A3B8", 480, 32)}</svg>`,
      );
    }
    case "career":
      return svgUri(
        `${open}<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF7ED"/><stop offset="1" stop-color="#FED7AA"/></linearGradient></defs>` +
          `<rect width="1200" height="750" fill="url(#g)"/><circle cx="1010" cy="170" r="190" fill="#FB923C" opacity="0.25"/><circle cx="1080" cy="560" r="120" fill="#EA580C" opacity="0.18"/>` +
          `${line("KARİYER VE STAJ KULÜBÜ", "#9A3412", 220, 34)}${title("Kariyer Günleri", "#7C2D12", 340, 112)}` +
          `${line("12 firma · staj görüşmeleri · CV kliniği", "#9A3412", 420)}${line("CV'ni yanında getir", "#C2410C", 480, 32)}</svg>`,
      );
    case "kackar":
      return svgUri(
        `${open}<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BAE6FD"/><stop offset="1" stop-color="#FEF3C7"/></linearGradient></defs>` +
          `<rect width="1200" height="750" fill="url(#g)"/><circle cx="930" cy="250" r="70" fill="#FDBA74"/>` +
          `<path d="M0 560 L230 300 L380 450 L560 240 L760 470 L930 330 L1200 560 V750 H0Z" fill="#166534"/>` +
          `<path d="M560 240 L612 300 L585 296 L560 320 L536 292 L512 296Z M230 300 L270 345 L246 342 L230 360 L212 340Z" fill="#fff"/>` +
          `<path d="M0 640 L300 470 L520 600 L780 470 L1200 650 V750 H0Z" fill="#14532D"/>` +
          `${title("Kaçkar Yürüyüşü", "#0F172A", 150, 84)}${line("Ayder – Gelinkaya rotası · Doğa Sporları Kulübü", "#1E293B", 210, 34)}</svg>`,
      );
    case "sunset":
      return svgUri(
        `${open}<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7C3AED"/><stop offset="0.55" stop-color="#F97316"/><stop offset="1" stop-color="#FDBA74"/></linearGradient></defs>` +
          `<rect width="1200" height="750" fill="url(#g)"/><circle cx="600" cy="470" r="120" fill="#FEF3C7" opacity="0.95"/>` +
          `<rect y="470" width="1200" height="280" fill="#1E3A8A"/><rect x="520" y="490" width="160" height="10" rx="5" fill="#FDE68A" opacity="0.8"/>` +
          `<rect x="470" y="530" width="260" height="8" rx="4" fill="#FDE68A" opacity="0.55"/><rect x="420" y="575" width="360" height="7" rx="3.5" fill="#FDE68A" opacity="0.35"/>` +
          `<path d="M0 470 L120 430 L260 455 L380 425 L470 470Z" fill="#312E81" opacity="0.8"/></svg>`,
      );
    case "books":
      return svgUri(
        `${open}<rect width="1200" height="750" fill="#F5F3FF"/><rect x="760" y="180" width="70" height="420" rx="8" fill="#6D28D9"/><rect x="840" y="220" width="60" height="380" rx="8" fill="#A78BFA"/>` +
          `<rect x="910" y="160" width="80" height="440" rx="8" fill="#4C1D95"/><rect x="1000" y="240" width="56" height="360" rx="8" fill="#C4B5FD"/><rect x="720" y="600" width="380" height="16" rx="8" fill="#312E81"/>` +
          `${line("KİTAP KULÜBÜ", "#6D28D9", 240, 34)}${title("Bu ayın kitabı", "#2E1065", 350, 92)}` +
          `${line("Kürk Mantolu Madonna", "#4C1D95", 430, 44)}${line("Perşembe 19:00 · Seminer salonu", "#6D28D9", 490, 32)}</svg>`,
      );
    case "blood":
      return svgUri(
        `${open}<rect width="1200" height="750" fill="#FFF1F2"/><path d="M940 150 C1010 260 1070 330 1070 420 A130 130 0 0 1 810 420 C810 330 870 260 940 150Z" fill="#E11D48"/>` +
          `<path d="M900 400 A50 50 0 0 0 950 450" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.7"/>` +
          `${line("TIP BİLİM TOPLULUĞU", "#BE123C", 240, 34)}${title("Kan Bağışı", "#881337", 350, 110)}` +
          `${line("Bir ünite kan, üç hayat", "#9F1239", 430, 44)}${line("Merkez yerleşke · 09.00–16.00", "#BE123C", 490, 32)}</svg>`,
      );
  }
}
