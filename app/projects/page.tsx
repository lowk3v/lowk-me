import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Divider } from "../components/divider";
import { Card } from "../components/card";
import { Article } from "./article";
import { Eye } from "lucide-react";


export const revalidate = 60;
export default async function ProjectsPage() {
	interface IView {
		[slug: string]: number;
	}
	const views: IView = {};


	const featured = allProjects.filter(
		(project) => project.featured && project.published)
		.sort((a, b) =>
			new Date(b.date ?? Number.POSITIVE_INFINITY).getTime()
			- new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
		)!;
	const feature1 = featured[0];
	const feature2 = featured[1];
	const feature3 = featured[2];
		
	const solo = allProjects.filter(
		(project) => project.author === "LowK" && project.published)
		.sort((a, b) =>
			new Date(b.date ?? Number.POSITIVE_INFINITY).getTime()
			- new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
		)!;

	const underVrc = allProjects.filter(
		(project) => project.author === "Verichains" && project.published)
		.sort((a, b) =>
			new Date(b.date ?? Number.POSITIVE_INFINITY).getTime()
			- new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
		)!;		
	console.log(underVrc.length)

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
				{/* introduction */}
				<div className="max-w-2xl mx-auto lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Audited Web3 Projects
					</h2>
					<p className="mt-4 text-zinc-400">
						Projects under audited by individuals or companies.
					</p>
				</div>

				{/* features projects */}
				<div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
					{ feature1 ? (
						<Card>
							<Link href={`/projects/${feature1.slug}`}>
								<article className="relative w-full h-full p-4 md:p-8">
									<div className="flex items-center justify-between gap-2">
										<div className="text-xs text-zinc-100">
											{feature1.date ? (
												<time dateTime={new Date(feature1.date).toISOString()}>
													{Intl.DateTimeFormat(undefined, {
														dateStyle: "medium",
													}).format(new Date(feature1.date))}
												</time>
											) : (
												<span>SOON</span>
											)}
										</div>
										<span className="flex items-center gap-1 text-xs text-zinc-500">
											<Eye className="w-4 h-4" />{" "}~
											{Intl.NumberFormat("en-US", { notation: "compact" }).format(
												views[feature1.slug] ?? 0,
											)}
										</span>
									</div>

									<h2
										id="featured-post"
										className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
									>
										{feature1.title}
									</h2>
									<p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
										{feature1.description}
									</p>
									<div className="absolute bottom-4 md:bottom-8">
										<p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
											Read more <span aria-hidden="true">&rarr;</span>
										</p>
									</div>
								</article>
							</Link>
						</Card>
					) : ''}

					{ feature2 ? (
						<div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
							<Card key={feature2.slug}>
								<Article project={feature2} views={views[feature2.slug] ?? 0} />
							</Card>
							{ feature3 ? (
								<Card key={feature3.slug}>
									<Article project={feature2} views={views[feature3.slug] ?? 0} />
								</Card>
							) : ''}
						</div>
					) : ''}
				</div>

				<Divider text="Solo Auditing" />

				<div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
					<div className="grid grid-cols-1 gap-4">
						{solo.filter((_, i) => i % 3 === 0)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slug] ?? 0} />
								</Card>
							))}
					</div>
					<div className="grid grid-cols-1 gap-4">
						{solo.filter((_, i) => i % 3 === 1)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slug] ?? 0} />
								</Card>
							))}
					</div>
					<div className="grid grid-cols-1 gap-4">
						{solo.filter((_, i) => i % 3 === 2)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slug] ?? 0} />
								</Card>
							))}
					</div>
				</div>

				<Divider text="Under Verichains " />

				<div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
					<div className="grid grid-cols-1 gap-4">
						{underVrc.filter((_, i) => i % 3 === 0)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slug] ?? 0} />
								</Card>
							))}
					</div>
					<div className="grid grid-cols-1 gap-4">
						{underVrc.filter((_, i) => i % 3 === 1)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slug] ?? 0} />
								</Card>
							))}
					</div>
					<div className="grid grid-cols-1 gap-4">
						{underVrc.filter((_, i) => i % 3 === 2)
							.map((project) => (
								<Card key={project.slug}>
									<Article project={project} views={views[project.slug] ?? 0} />
								</Card>
							))}
					</div>
				</div>
				
			</div>
		</div>
	);
}
