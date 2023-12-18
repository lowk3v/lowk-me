import { NextResponse } from "next/server";
import Parser from 'rss-parser';

export default async function feeds(req, res) {
  if (req.method !== "GET") {
    return new NextResponse("use GET", { status: 405 });
  }

  try {
    const parser = new Parser();
    const newsletter = await parser.parseURL('https://lowk.substack.com/feed');
    res.status(200).json({
      feeds: [
        ...newsletter.items.map((item) => ({
          ...item,
          source: `Newsletter`,
          color: '#5383ec',
        })),
      ].sort(
        (a, b) =>
          new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
      ),
    })
  } catch (e) {
    console.error(e);
  }
}


