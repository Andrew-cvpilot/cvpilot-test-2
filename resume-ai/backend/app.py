import os
import json
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic

app = Flask(__name__)
CORS(app)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# ── Text extraction ──────────────────────────────────────────────────────────

def extract_text_from_pdf(path: str) -> str:
    import pdfplumber
    with pdfplumber.open(path) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)

def extract_text_from_docx(path: str) -> str:
    import docx
    doc = docx.Document(path)
    return "\n".join(p.text for p in doc.paragraphs)

def extract_text(path: str, filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext == "pdf":
        return extract_text_from_pdf(path)
    elif ext in ("docx", "doc"):
        return extract_text_from_docx(path)
    raise ValueError(f"Unsupported file type: {ext}")

# ── AI evaluation ────────────────────────────────────────────────────────────

def evaluate_resume(resume_text: str, target_role: str) -> dict:
    prompt = f"""You are an expert resume coach and hiring manager with 15+ years of experience.

Analyze this resume for someone applying to: {target_role}

Resume:
{resume_text}

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{{
  "overall_score": <integer 1-10>,
  "summary": "<2-3 sentence honest overall assessment>",
  "strengths": [
    "<specific strength referencing actual resume content>",
    "<specific strength>",
    "<specific strength>"
  ],
  "improvements": [
    {{
      "section": "<section name e.g. Work Experience, Skills, Summary, Education, Formatting>",
      "issue": "<what is wrong or missing — be specific, reference actual content>",
      "suggestion": "<concrete actionable fix — show them exactly what to change>",
      "priority": "<high|medium|low>"
    }}
  ]
}}

Rules:
- Be specific. Reference actual content from their resume, never give generic advice.
- Prioritize improvements that would most impact getting an interview for {target_role}.
- high priority = will likely cost them interviews. medium = notable gap. low = polish.
- Return 3-6 improvements total.
- Return only valid JSON."""

    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())

# ── Routes ───────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/evaluate", methods=["POST"])
def evaluate():
    if "resume" not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files["resume"]
    target_role = request.form.get("target_role", "a general professional position").strip()

    if not file.filename:
        return jsonify({"error": "No file selected"}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ("pdf", "docx", "doc"):
        return jsonify({"error": "Please upload a PDF or DOCX file"}), 400

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        resume_text = extract_text(tmp_path, file.filename)
        os.unlink(tmp_path)

        if not resume_text or len(resume_text.strip()) < 100:
            return jsonify({"error": "Could not extract text from resume. Make sure it's not a scanned image."}), 400

        feedback = evaluate_resume(resume_text, target_role)
        return jsonify(feedback)

    except json.JSONDecodeError:
        return jsonify({"error": "AI returned an unexpected response. Please try again."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)
