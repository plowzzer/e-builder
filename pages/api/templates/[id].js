import connectDB from "../../../lib/mongodb";
import Template from "../../../models/Template";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const template = await Template.findById(id);
    if (!template) return res.status(404).json({ error: "Não encontrado" });
    return res.status(200).json(template);
  }

  if (req.method === "PUT") {
    const template = await Template.findByIdAndUpdate(id, req.body, { new: true });
    if (!template) return res.status(404).json({ error: "Não encontrado" });
    return res.status(200).json(template);
  }

  if (req.method === "DELETE") {
    await Template.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
