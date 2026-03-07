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
    const apiKey = process.env.API_KEY || 'AIzaSyDu88qaKlBT3D554n6HIRgcoPQiFHAALvc';
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
        4. **CONTEXT**: Professional corporate environment, clean neutral gray background with soft studio lighting, business formal attire (dark suit/blazer with tie or elegant blouse). Classic LinkedIn-style headshot composition.
      `,
      casual: `
        4. **CONTEXT**: Modern business-casual style with a clean, slightly blurred modern office or co-working space background. The person should wear smart-casual attire (polo shirt, casual blazer, or neat sweater). Warm, natural lighting.
      `,
      creative: `
        4. **CONTEXT**: Creative professional style with a vibrant yet tasteful background (think startup or design studio). Modern trendy professional outfit. Dynamic, editorial-style lighting with slight color grading. Artful composition.
      `,
      outdoor: `
        4. **CONTEXT**: Professional outdoor portrait with beautiful natural bokeh background (park, garden, or urban greenery). Business casual or smart attire. Golden hour or soft natural daylight. Professional depth of field.
      `,
      executive: `
        4. **CONTEXT**: Premium executive portrait in a prestigious environment (mahogany office, conference room with city skyline view, or elegant boardroom). Power suit with confident posture. Dramatic, cinematic studio lighting. Ultra-premium feel.
      `,
      minimalist: `
        4. **CONTEXT**: Ultra-clean, minimalist white or very light gray background. Simple, elegant attire (monochrome tones). Bright, even studio lighting. Apple-style product photography aesthetic applied to a person. Very modern and clean.
      `,
    };

    const selectedStyle = stylePrompts[style] || stylePrompts.classic;

    // Strict Prompt Logic
    const prompt = `
      Generate a hyper-realistic, professional corporate headshot of the EXACT person provided in the input image.

      CRITICAL MANDATORY REQUIREMENTS (NON-NEGOTIABLE):

      1. **EXACT IDENTITY PRESERVATION**: The generated face MUST be a perfect biometric match to the input person.
         - Do not change the facial structure, nose shape, eye shape, or unique features.
         - It must look like the SAME person, just in professional attire and better lighting.
         - Do not genericize the face.

      2. **SINGLE HUMAN SUBJECT**: 
         - The generated image must contain EXACTLY ONE person. 
         - If the input image has multiple people, crop to the main central subject and ignore others.
         - The composition must be a standard head-and-shoulders corporate portrait.

      3. **EXTREME PHOTOREALISM (RAW STYLE)**: 
         - ZERO skin smoothing. 
         - Visible pores, skin texture, and natural imperfections are required. 
         - Must look like a high-resolution RAW photo taken with a DSLR, not a 3D render.

      ${selectedStyle}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: image // Base64 string from frontend
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseModalities: ['Text', 'Image'],
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
    console.error("Error generating photo:", error);
    res.status(500).json({ error: "Failed to generate image" });
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