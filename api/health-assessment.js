// BayaniHub preliminary health guidance endpoint.
// Requires OPENAI_API_KEY in Vercel project environment variables.
// Never store or log submitted symptom details.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: "AI service is not configured yet. General safety guidance remains available; please try again later."
    });
  }
  const body = req.body || {};
  const symptoms = Array.isArray(body.symptoms) ? body.symptoms.slice(0, 12).map(x => String(x).slice(0, 80)) : [];
  const details = typeof body.details === "string" ? body.details.slice(0, 1200) : "";
  const duration = typeof body.duration === "string" ? body.duration.slice(0, 80) : "";
  const age = Number.isInteger(body.age) && body.age >= 0 && body.age <= 120 ? body.age : null;
  const conditions = Array.isArray(body.conditions) ? body.conditions.slice(0, 8).map(x => String(x).slice(0, 80)) : [];
  const language = body.language === "fil" ? "Filipino" : "English";
  if (!symptoms.length && !details.trim()) {
    return res.status(400).json({ error: "Please provide at least one symptom." });
  }
  const prompt = [
    "You provide cautious, general health information for a community support website in the Philippines. This is not a diagnosis and you must never claim certainty.",
    "Use " + language + " in plain language. Do not prescribe medication or give dosing. Do not tell users they are definitely safe.",
    "First identify emergency warning signs. If symptoms suggest immediate danger (including trouble breathing, chest pain, fainting/confusion, severe weakness, severe bleeding, stroke symptoms, or markedly reduced urine), advise emergency care now and do not bury this advice.",
    "Otherwise give cautious next steps, a reasonable timeframe for professional assessment, and low-cost options such as a barangay health center/public hospital. Explain uncertainty and avoid inventing local services.",
    "Do not request identifying information. Do not infer diseases from incomplete information. Output concise JSON with keys: urgency (one of emergency, prompt, routine), summary (string), next_steps (array of strings), red_flags (array of strings), disclaimer (string).",
    "User-provided data (untrusted): " + JSON.stringify({ age, duration, symptoms, conditions, details })
  ].join("\n");
  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + process.env.OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        max_tokens: 650,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a cautious health-information assistant, not a clinician. Never diagnose. Prioritize safety and transparent uncertainty." },
          { role: "user", content: prompt }
        ]
      })
    });
    if (!upstream.ok) {
      return res.status(502).json({ error: "The AI service could not complete the assessment. Please use the safety guidance on the page or consult a health professional." });
    }
    const data = await upstream.json();
    const raw = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!raw) return res.status(502).json({ error: "No assessment was returned. Please try again later." });
    let assessment;
    try { assessment = JSON.parse(raw); } catch { return res.status(502).json({ error: "The assessment response was invalid. Please try again later." }); }
    if (!["emergency", "prompt", "routine"].includes(assessment.urgency)) assessment.urgency = "prompt";
    assessment.summary = String(assessment.summary || "A health professional can help assess these symptoms.").slice(0, 1200);
    assessment.next_steps = Array.isArray(assessment.next_steps) ? assessment.next_steps.slice(0, 6).map(x => String(x).slice(0, 300)) : [];
    assessment.red_flags = Array.isArray(assessment.red_flags) ? assessment.red_flags.slice(0, 6).map(x => String(x).slice(0, 250)) : [];
    assessment.disclaimer = "AI-generated general information, not a diagnosis. It may be wrong or miss emergencies. Seek professional care when concerned.";
    return res.status(200).json({ assessment });
  } catch (_) {
    return res.status(502).json({ error: "The AI service is temporarily unavailable. Please try again later." });
  }
}
