import connectDB from "../../../lib/mongodb";
import Template from "../../../models/Template";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const templates = await Template.find({}, "name createdAt updatedAt").sort({ updatedAt: -1 });
    return res.status(200).json(templates);
  }

  if (req.method === "POST") {
    const { name, data } = req.body;
    const template = await Template.create({ name, data });
    return res.status(201).json(template);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
