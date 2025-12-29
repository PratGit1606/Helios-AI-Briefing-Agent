// lib/ai.ts (Updated for GPT-4.1)
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateBriefInput {
  stakeholderDocuments: string;
  boilerplateLanguage: string;
}

export interface BriefOutput {
  purpose: string;
  primaryAudience: string;
  secondaryAudience: string;
  tone: string;
  sitemap: string[];
  constraints: string[];
  assumptions: Array<{
    text: string;
    confidence: 'low' | 'medium' | 'high';
  }>;
  openQuestions: string[];
}

export interface GenerateArtifactInput {
  briefContent: BriefOutput;
  artifactType: 'content' | 'design' | 'seo' | 'assumptions';
}


export async function generateBrief(input: GenerateBriefInput): Promise<BriefOutput> {
  const prompt = `You are Helios, an AI Web Briefing Agent for Arizona State University. Your job is to analyze stakeholder documents and boilerplate language to create a comprehensive website brief.

STAKEHOLDER DOCUMENTS (Content Intent):
${input.stakeholderDocuments}

BOILERPLATE LANGUAGE (Tone Anchor):
${input.boilerplateLanguage}

Generate a structured website brief with the following sections:

1. PURPOSE: A clear, concise statement (2-3 sentences) of what the website should achieve. Focus on business goals and user needs.

2. PRIMARY AUDIENCE: Detailed description (2-3 sentences) of the main target audience including demographics, behaviors, and motivations.

3. SECONDARY AUDIENCE: Other important audience segments (1-2 sentences each if multiple).

4. TONE & VOICE: Writing style description (2-3 sentences) that explicitly references and builds upon the boilerplate language provided. Make it actionable for content creators.

5. SITEMAP: Array of main pages and sections. Use format like "About Us", "Services (3 sub-pages)", "Contact". Be specific and realistic (typically 5-10 top-level pages).

6. CONSTRAINTS: Technical, accessibility, or business constraints. Include items like:
   - WCAG 2.1 AA compliance (always include for ASU)
   - Performance requirements (load times, mobile-first)
   - Platform/CMS requirements if mentioned
   - Legal/compliance requirements
   Provide 4-8 constraints.

7. ASSUMPTIONS: Things assumed to be true with confidence levels. Format each as:
   - text: Clear statement of what's assumed
   - confidence: "low" | "medium" | "high"
   Examples:
   - "Existing brand guidelines will be provided" (medium)
   - "Content migration from old site is needed" (high)
   - "No e-commerce functionality required" (low - needs verification)
   Provide 3-5 assumptions.

8. OPEN QUESTIONS: Important questions (3-5) that need stakeholder clarification before proceeding. Focus on:
   - Timeline and launch date
   - Budget considerations
   - Integration requirements
   - Content ownership and maintenance

Be specific and actionable. Tailor everything to ASU's context and the stakeholder's needs.

Respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{
  "purpose": "string",
  "primaryAudience": "string",
  "secondaryAudience": "string",
  "tone": "string (must reference boilerplate)",
  "sitemap": ["string"],
  "constraints": ["string"],
  "assumptions": [{"text": "string", "confidence": "low|medium|high"}],
  "openQuestions": ["string"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini', // GPT-4.1
      messages: [
        {
          role: 'system',
          content: 'You are a professional web strategy consultant for Arizona State University. Always respond with valid JSON only, no markdown formatting, code blocks, or explanations. Just pure JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse and validate
    const parsed = JSON.parse(content) as BriefOutput;
    
    // Validate required fields
    if (!parsed.purpose || !parsed.primaryAudience || !parsed.tone || !parsed.sitemap || !parsed.constraints || !parsed.assumptions || !parsed.openQuestions) {
      throw new Error('Invalid response structure from OpenAI');
    }

    return parsed;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate brief: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate artifact content (tabs) based on approved brief
 */
export async function generateArtifact(input: GenerateArtifactInput): Promise<Record<string, unknown>> {
  const { briefContent, artifactType } = input;

  let prompt = '';
  
  switch (artifactType) {
    case 'content':
      prompt = `Based on this website brief, generate a detailed content and page planning artifact.

BRIEF:
${JSON.stringify(briefContent, null, 2)}

Create a JSON response with:
- title: "Content & Page Planning"
- items: Array of objects with {page, component, rationale}

Map each page from the sitemap to appropriate web components (e.g., "Hero Banner", "Feature Grid", "Tabbed Content", "Timeline", "Contact Form", "Image Gallery") with clear rationale for why each component serves the audience and purpose.

Provide 8-12 component mappings covering the main pages.

Respond with ONLY valid JSON (no markdown, no code blocks).`;
      break;

    case 'design':
      prompt = `Based on this website brief, generate design inspiration and image guidance.

BRIEF:
${JSON.stringify(briefContent, null, 2)}

Create a JSON response with:
- title: "Image & Design Inspiration"
- items: Array of objects with {type, style, reference}

Provide guidance for:
- Hero images (photography style, mood)
- Icon sets (style, weight, color approach)
- Photography guidelines (authentic vs stock, diversity representation)
- Color palette approach (beyond ASU gold/maroon if applicable)
- Typography recommendations

Align everything with the tone and audience. Provide 5-7 design guidance items.

Respond with ONLY valid JSON (no markdown, no code blocks).`;
      break;

    case 'seo':
      prompt = `Based on this website brief, generate SEO research and keyword strategy.

BRIEF:
${JSON.stringify(briefContent, null, 2)}

Create a JSON response with:
- title: "SEO Research"
- keywords: Array of objects with {term, volume, difficulty}
- metadata: string describing overall SEO strategy

For keywords:
- Identify 6-10 relevant keyword clusters
- Use realistic search volumes in format "Xk/mo" (e.g., "12k/mo", "8k/mo")
- Set difficulty as "Low", "Medium", or "High" based on competitiveness
- Focus on terms relevant to ASU and the website purpose

For metadata strategy:
- 2-3 sentences on overall SEO approach
- Mention key themes and competitive advantages

Respond with ONLY valid JSON (no markdown, no code blocks).`;
      break;

    case 'assumptions':
      prompt = `Based on this website brief, create an assumptions and risk log.

BRIEF:
${JSON.stringify(briefContent, null, 2)}

Create a JSON response with:
- title: "Assumptions & Risk Log"
- items: Array matching the brief's assumptions format [{text, confidence}]

Simply return the assumptions from the brief in the structured format.

Respond with ONLY valid JSON (no markdown, no code blocks).`;
      break;

    default:
      throw new Error(`Unknown artifact type: ${artifactType}`);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a web strategy expert for Arizona State University. Always respond with valid JSON only, no markdown, code blocks, or explanations. Just pure JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content) as Record<string, unknown>;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate artifact: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}