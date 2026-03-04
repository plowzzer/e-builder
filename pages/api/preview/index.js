import { templateToMjml } from "../../../lib/templateToMjml";
import { renderMjml } from "../../../lib/mjml";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const template = req.body;

  try {
    const mjmlString = templateToMjml(template);
    const { html, errors } = renderMjml(mjmlString);

    if (errors.length > 0) {
      console.warn("MJML warnings:", errors);
    }

    return res.status(200).json({ html });
  } catch (err) {
    console.error("Erro ao renderizar MJML:", err);
    return res.status(500).json({ error: "Falha na transpilação MJML" });
  }
}
