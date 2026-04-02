import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

// 1. Nastavení cest pro ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// 2. Middleware
app.use(express.json({ limit: '10mb' })); // Limit pro obrázky

// 3. DEBUG: Kontrola, kde jsme a co vidíme
const distPath = path.join(__dirname, 'dist');
console.log('--- SERVER START ---');
console.log('Current directory (Root):', __dirname);
console.log('Expected Dist path:', distPath);

if (fs.existsSync(distPath)) {
  console.log('✅ Dist folder found.');
  try {
    const contents = fs.readdirSync(distPath);
    console.log('📄 Dist contents:', contents);

    if (!contents.includes('index.html')) {
      console.error('❌ CRITICAL WARNING: index.html missing in dist folder!');
    } else {
      console.log('✅ index.html is present.');
    }
  } catch (e) {
    console.error('❌ Error reading dist folder:', e);
  }
} else {
  console.error('❌ CRITICAL ERROR: Dist folder does NOT exist. Verify "npm run build" ran successfully.');
}

// 4. Servírování statických souborů (React Frontend)
// Toto musí být před API definicemi pro assets, ale po specifických API routách, pokud by kolidovaly.
app.use(express.static(distPath));

// 5. API Endpointy
app.post('/api/generate-image', async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key is missing in environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const { image, mimeType, style } = req.body;

    if (!image || !mimeType) {
      return res.status(400).json({ error: "Missing image data" });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Style-specific prompt additions
    const stylePrompts = {
      classic: `
        STYLE: Clean neutral gray studio background. Soft, even studio lighting from front-left. Business formal attire — dark navy suit, white dress shirt, dark tie. Classic LinkedIn-style head-and-shoulders crop.
      `,
      casual: `
        STYLE: Slightly blurred modern office or co-working space background. Warm natural lighting. Smart-casual attire — polo shirt or casual blazer over a neat sweater. Relaxed but professional expression.
      `,
      creative: `
        STYLE: Vibrant but tasteful background suggesting a creative workspace or design studio. Modern trendy outfit. Dynamic editorial-style lighting with subtle color grading. Artful but professional composition.
      `,
      outdoor: `
        STYLE: Beautiful natural bokeh background — park, garden, or urban greenery. Golden hour or soft natural daylight. Business casual or smart attire. Professional shallow depth of field.
      `,
      executive: `
        STYLE: Prestigious environment — mahogany-panelled office, boardroom, or city skyline view. Premium dark suit with confident posture. Dramatic, cinematic lighting. Ultra-premium C-suite executive feel.
      `,
      minimalist: `
        STYLE: Pure white or very light gray seamless background. Simple, elegant monochrome attire. Bright, perfectly even studio lighting. Ultra-clean Apple-style aesthetic.
      `,
    };

    const selectedStyle = stylePrompts[style] || stylePrompts.classic;

    // EDIT-based prompt — preserves identity far better than "generate new"
    const prompt = `Edit this photo into a professional corporate headshot.

ABSOLUTE RULE — IDENTITY LOCK:
This is a PHOTO EDITING task, NOT a generation task. The person's face must remain EXACTLY as it is in the input photo. Do NOT alter, idealize, or regenerate the face. Preserve every facial feature precisely:
- Exact same eye shape, eye color, eye spacing, and eyebrow shape
- Exact same nose shape, width, and bridge
- Exact same mouth shape, lip thickness, and smile
- Exact same jaw line, chin shape, and face proportions
- Exact same facial hair (beard, stubble) — keep it identical
- Exact same skin tone, skin texture, moles, freckles, scars
- Exact same hair color, hair texture, hairline, and hairstyle
The output face must be indistinguishable from the input face. If shown side-by-side, a person must immediately say "that's the same person."

WHAT TO CHANGE (only these things):
- Crop to head-and-shoulders portrait composition
- Replace the background with the style described below
- Add professional attire (suit/blazer) on the body only — do NOT touch the face
- Apply professional studio-quality lighting — but keep the face structure exactly as-is
- Remove any distracting elements from the background

WHAT TO NEVER CHANGE:
- The face — zero modifications
- Facial hair — keep exactly as in input
- Hair — keep the same style and color
- Skin — no smoothing, no airbrushing, keep all natural texture

${selectedStyle}

OUTPUT: Single person, head-and-shoulders crop, 4:5 aspect ratio, photorealistic DSLR quality.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: [
        {
          text: prompt
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: image
          }
        }
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          personGeneration: 'allow_all',
        },
      },
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content generated");
    }

    let generatedImageBase64 = null;
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!generatedImageBase64) {
      throw new Error("No image generated in response");
    }

    res.json({ image: generatedImageBase64 });

  } catch (error) {
    console.error("Error generating photo:", error?.message || error);
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ error: `Failed to generate image: ${error?.message || 'Unknown error'}` });
  }
});

// 6. Catch-all route (pro React Router - obnovení stránky)
// Důležité: Toto musí být až na konci, za všemi API routami a statickými soubory
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(`❌ 404 Error: Request for ${req.url} failed. Index.html not found at ${indexPath}`);
    res.status(404).send('Error: Application build not found (index.html missing)');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});