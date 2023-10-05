import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export default async function feeds(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
  ) {
	if (req.method !== "GET") {
		return new NextResponse("use GET", { status: 405 });
	}

	try {
		const parser = new Parser();
		const newsletter = await parser.parseURL('https://lowk.substack.com/feed');
		res.status(200).json({
			updatedAt: `Last issue: ${fromNow(
				new Date(newsletter.items[0].pubDate)
			)}`,
			feeds: [
				...newsletter.items.map((item: any) => ({
				...item,
				source: `LowK's Newsletter`,
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


function fromNow(
	date: Date,
	nowDate = Date.now(),
	rft = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
	) {
	const SECOND = 1000;
	const MINUTE = 60 * SECOND;
	const HOUR = 60 * MINUTE;
	const DAY = 24 * HOUR;
	const WEEK = 7 * DAY;
	const MONTH = 30 * DAY;
	const YEAR = 365 * DAY;
	const intervals = [
		{ ge: YEAR, divisor: YEAR, unit: 'year' },
		{ ge: MONTH, divisor: MONTH, unit: 'month' },
		{ ge: WEEK, divisor: WEEK, unit: 'week' },
		{ ge: DAY, divisor: DAY, unit: 'day' },
		{ ge: HOUR, divisor: HOUR, unit: 'hour' },
		{ ge: MINUTE, divisor: MINUTE, unit: 'minute' },
		{ ge: 30 * SECOND, divisor: SECOND, unit: 'seconds' },
		{ ge: 0, divisor: 1, text: 'just now' },
	];
	const now =
		typeof nowDate === 'object'
		? nowDate.getTime()
		: new Date(nowDate).getTime();
	const diff =
		now - (typeof date === 'object' ? date : new Date(date)).getTime();
	const diffAbs = Math.abs(diff);
	for (const interval of intervals) {
		if (diffAbs >= interval.ge) {
		const x = Math.round(Math.abs(diff) / interval.divisor);
		const isFuture = diff < 0;
		return interval.unit
			? rft.format(isFuture ? x : -x, interval.unit)
			: interval.text;
		}
	}
	}