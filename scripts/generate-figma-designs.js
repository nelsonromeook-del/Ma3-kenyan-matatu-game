/**
 * MA3 - FIGMA DESIGN GENERATOR
 * Generates Figma design JSON that you can import
 */

const fs = require('fs');
const path = require('path');

// Figma design structure
const figmaDesign = {
  name: "MA3 - Kenyan Matatu Game",
  version: "1.0.0",
  pages: [
    {
      id: "page-1",
      name: "01 - Screens",
      frames: [
        {
          id: "frame-main-menu",
          name: "Main Menu",
          type: "FRAME",
          width: 1920,
          height: 1080,
          backgroundColor: { r: 0.06, g: 0.13, b: 0.15, a: 1 },
          children: [
            {
              id: "logo-text",
              name: "MA3 Logo",
              type: "TEXT",
              x: 810,
              y: 200,
              width: 300,
              height: 120,
              text: "MA3",
              fontSize: 96,
              fontFamily: "Poppins",
              fontWeight: 700,
              fill: { r: 1, g: 0.84, b: 0, a: 1 }, // #FFD700
              effects: [
                {
                  type: "DROP_SHADOW",
                  color: { r: 1, g: 0.84, b: 0, a: 0.8 },
                  offset: { x: 0, y: 0 },
                  radius: 40,
                  visible: true
                },
                {
                  type: "DROP_SHADOW",
                  color: { r: 1, g: 0.84, b: 0, a: 0.6 },
                  offset: { x: 0, y: 0 },
                  radius: 80,
                  visible: true
                }
              ]
            },
            {
              id: "subtitle",
              name: "Subtitle",
              type: "TEXT",
              x: 710,
              y: 340,
              width: 500,
              height: 40,
              text: "KENYAN MATATU EXPERIENCE",
              fontSize: 24,
              fontFamily: "Poppins",
              fontWeight: 400,
              letterSpacing: 4,
              fill: { r: 1, g: 1, b: 1, a: 0.8 }
            },
            {
              id: "btn-start",
              name: "Start Button",
              type: "RECTANGLE",
              x: 810,
              y: 500,
              width: 300,
              height: 80,
              cornerRadius: 12,
              fill: { r: 1, g: 0.84, b: 0, a: 1 },
              effects: [
                {
                  type: "DROP_SHADOW",
                  color: { r: 0, g: 0, b: 0, a: 0.5 },
                  offset: { x: 0, y: 8 },
                  radius: 20,
                  visible: true
                }
              ],
              children: [
                {
                  id: "btn-start-text",
                  name: "Button Text",
                  type: "TEXT",
                  x: 0,
                  y: 25,
                  width: 300,
                  height: 30,
                  text: "▶ START GAME",
                  fontSize: 20,
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  textAlign: "center",
                  fill: { r: 0, g: 0, b: 0, a: 1 }
                }
              ]
            }
          ]
        },
        {
          id: "frame-game-hud",
          name: "Game HUD",
          type: "FRAME",
          width: 1920,
          height: 1080,
          backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
          children: [
            // Speedometer
            {
              id: "speedometer",
              name: "Speedometer",
              type: "RECTANGLE",
              x: 40,
              y: 800,
              width: 250,
              height: 240,
              cornerRadius: 20,
              fill: { r: 0.12, g: 0.12, b: 0.12, a: 0.9 },
              stroke: { r: 1, g: 0.84, b: 0, a: 0.5 },
              strokeWeight: 2
            },
            // Time display
            {
              id: "time-display",
              name: "Time Display",
              type: "RECTANGLE",
              x: 1630,
              y: 100,
              width: 250,
              height: 80,
              cornerRadius: 15,
              fill: { r: 0.12, g: 0.12, b: 0.12, a: 0.9 }
            }
          ]
        }
      ]
    },
    {
      id: "page-2",
      name: "02 - Components",
      frames: []
    },
    {
      id: "page-3",
      name: "03 - Style Guide",
      frames: [
        {
          id: "frame-colors",
          name: "Color Palette",
          type: "FRAME",
          width: 1200,
          height: 800,
          children: generateColorPalette()
        }
      ]
    }
  ],
  styles: {
    colors: {
      "matatu-gold": { r: 1, g: 0.84, b: 0, a: 1 },
      "nairobi-black": { r: 0.1, g: 0.1, b: 0.1, a: 1 },
      "kenya-green": { r: 0, g: 0.42, b: 0.25, a: 1 },
      "kenya-red": { r: 0.78, g: 0.06, b: 0.18, a: 1 },
      "electric-blue": { r: 0, g: 0.83, b: 1, a: 1 },
      "neon-pink": { r: 1, g: 0.06, b: 0.94, a: 1 }
    },
    textStyles: {
      "h1-hero": {
        fontSize: 96,
        fontFamily: "Poppins",
        fontWeight: 700,
        letterSpacing: 10
      },
      "h2-section": {
        fontSize: 64,
        fontFamily: "Poppins",
        fontWeight: 700
      },
      "h3-card": {
        fontSize: 32,
        fontFamily: "Poppins",
        fontWeight: 600
      },
      "body-large": {
        fontSize: 20,
        fontFamily: "Poppins",
        fontWeight: 400
      },
      "body-regular": {
        fontSize: 16,
        fontFamily: "Poppins",
        fontWeight: 400
      }
    }
  }
};

function generateColorPalette() {
  const colors = [
    { name: "Matatu Gold", hex: "#FFD700", x: 50, y: 50 },
    { name: "Nairobi Black", hex: "#1A1A1A", x: 250, y: 50 },
    { name: "Kenya Green", hex: "#006B3F", x: 450, y: 50 },
    { name: "Kenya Red", hex: "#C8102E", x: 650, y: 50 },
    { name: "Electric Blue", hex: "#00D4FF", x: 50, y: 250 },
    { name: "Neon Pink", hex: "#FF10F0", x: 250, y: 250 },
    { name: "Warning Yellow", hex: "#FFC700", x: 450, y: 250 },
    { name: "Success Green", hex: "#00FF88", x: 650, y: 250 }
  ];
  
  return colors.map((color, index) => ({
    id: `color-${index}`,
    name: color.name,
    type: "RECTANGLE",
    x: color.x,
    y: color.y,
    width: 150,
    height: 150,
    cornerRadius: 12,
    fill: hexToRgb(color.hex),
    children: [
      {
        id: `color-label-${index}`,
        name: "Label",
        type: "TEXT",
        x: 0,
        y: 160,
        width: 150,
        height: 30,
        text: color.name,
        fontSize: 14,
        fontFamily: "Poppins",
        fontWeight: 600,
        textAlign: "center",
        fill: { r: 1, g: 1, b: 1, a: 1 }
      },
      {
        id: `color-hex-${index}`,
        name: "Hex",
        type: "TEXT",
        x: 0,
        y: 190,
        width: 150,
        height: 20,
        text: color.hex,
        fontSize: 12,
        fontFamily: "JetBrains Mono",
        fontWeight: 400,
        textAlign: "center",
        fill: { r: 1, g: 1, b: 1, a: 0.7 }
      }
    ]
  }));
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
    a: 1
  } : { r: 0, g: 0, b: 0, a: 1 };
}

// Generate HTML documentation
function generateHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MA3 - Design System</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Poppins', -apple-system, sans-serif;
      background: linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%);
      color: #FFFFFF;
      padding: 40px;
      min-height: 100vh;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 {
      font-size: 96px;
      color: #FFD700;
      text-align: center;
      margin-bottom: 20px;
      text-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
    }
    h2 {
      font-size: 48px;
      margin: 60px 0 30px;
      color: #FFD700;
    }
    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
      margin: 40px 0;
    }
    .color-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid rgba(255, 215, 0, 0.3);
      transition: transform 0.3s ease;
    }
    .color-card:hover { transform: translateY(-5px); }
    .color-swatch {
      width: 100%;
      height: 150px;
    }
    .color-info {
      padding: 20px;
      text-align: center;
    }
    .color-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .color-hex {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      opacity: 0.7;
    }
    .text-examples {
      background: rgba(0, 0, 0, 0.3);
      padding: 40px;
      border-radius: 20px;
      margin: 40px 0;
    }
    .text-h1 { font-size: 96px; font-weight: 700; color: #FFD700; }
    .text-h2 { font-size: 64px; font-weight: 700; margin: 20px 0; }
    .text-h3 { font-size: 32px; font-weight: 600; margin: 15px 0; }
    .text-body { font-size: 20px; margin: 10px 0; opacity: 0.9; }
    code {
      background: rgba(255, 215, 0, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      color: #FFD700;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>MA3</h1>
    <p style="text-align: center; font-size: 24px; opacity: 0.8; margin-bottom: 60px;">
      KENYAN MATATU GAME - DESIGN SYSTEM
    </p>

    <h2>🎨 Color Palette</h2>
    <div class="color-grid">
      ${generateColorCards()}
    </div>

    <h2>📝 Typography</h2>
    <div class="text-examples">
      <div class="text-h1">MA3</div>
      <div class="text-h2">Kenyan Matatu Experience</div>
      <div class="text-h3">Choose Your Nganya</div>
      <div class="text-body">The most authentic Kenyan driving game ever created.</div>
      <div class="text-body" style="font-size: 16px; opacity: 0.7;">
        Press W to accelerate, SPACE to drift
      </div>
    </div>

    <h2>💻 Usage</h2>
    <div style="background: rgba(0,0,0,0.3); padding: 30px; border-radius: 12px;">
      <h3 style="margin-bottom: 20px;">Import Colors in CSS:</h3>
      <pre style="background: #1A1A1A; padding: 20px; border-radius: 8px; overflow-x: auto;">
:root {
  --matatu-gold: #FFD700;
  --nairobi-black: #1A1A1A;
  --kenya-green: #006B3F;
  --kenya-red: #C8102E;
  --electric-blue: #00D4FF;
  --neon-pink: #FF10F0;
}

.button-primary {
  background: var(--matatu-gold);
  color: var(--nairobi-black);
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  padding: 15px 40px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}
      </pre>
    </div>
  </div>
</body>
</html>
  `;
}

function generateColorCards() {
  const colors = [
    { name: "Matatu Gold", hex: "#FFD700", desc: "Primary brand color" },
    { name: "Nairobi Black", hex: "#1A1A1A", desc: "Background dark" },
    { name: "Kenya Green", hex: "#006B3F", desc: "Success states" },
    { name: "Kenya Red", hex: "#C8102E", desc: "Danger/alerts" },
    { name: "Electric Blue", hex: "#00D4FF", desc: "Interactive elements" },
    { name: "Neon Pink", hex: "#FF10F0", desc: "Highlights" },
    { name: "Warning Yellow", hex: "#FFC700", desc: "Warnings" },
    { name: "Success Green", hex: "#00FF88", desc: "Confirmations" }
  ];
  
  return colors.map(color => `
    <div class="color-card">
      <div class="color-swatch" style="background: ${color.hex};"></div>
      <div class="color-info">
        <div class="color-name">${color.name}</div>
        <div class="color-hex">${color.hex}</div>
        <div style="font-size: 12px; opacity: 0.6; margin-top: 8px;">${color.desc}</div>
      </div>
    </div>
  `).join('');
}

// Save files
const designDir = path.join(__dirname, '..', 'design');
if (!fs.existsSync(designDir)) {
  fs.mkdirSync(designDir, { recursive: true });
}

// Save Figma JSON
fs.writeFileSync(
  path.join(designDir, 'figma-design.json'),
  JSON.stringify(figmaDesign, null, 2)
);

// Save HTML documentation
fs.writeFileSync(
  path.join(designDir, 'design-system.html'),
  generateHTML()
);

console.log('✅ Figma design files generated!');
console.log('📁 Check the "design" folder');
console.log('🌐 Open design-system.html in your browser');