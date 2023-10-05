"use client"
import Link from "next/link";
import styles from './styles/Home.module.css';
import React, { useEffect, useState } from "react";

const navigation = [
	{ name: "Projects", href: "/projects" },
	{ name: "About", href: "/about" },
];

export default function Home() {
	const [updatedAt, SetUpdatedAt] = useState('')
	const [feeds, setFeeds] = useState([])

	useEffect(() => {
		fetch("/api/feeds", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}).then((res) => {
			res.json().then((data) => {
				SetUpdatedAt(data.updatedAt)
				setFeeds(data.feeds)
			})
		})	
	}, []);
	
	return (
		<div>
			<nav className="mt-16 animate-fade-in">
				<ul className="flex items-center justify-center gap-4">
					{navigation.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
						>
							{item.name}
						</Link>
					))}
				</ul>
			</nav>
			
			<main className={styles.main}>
				<section className={styles.intro}>
				<img className={styles.avatar} src="/avatar.png" />
				<h1 className={styles.title}>LowK</h1>
				<p>Indie Blockchain Security Auditor</p>
				</section>
				<div style={{ marginBottom: 30 }}>
				{[
					{
						link: 'https://x.com/Lowk3v_',
						title: (
							<span>Find me on Twitter 
							<span style={{ marginLeft: 10 }}>𝕏</span>
							</span>
						),
					},
					{
						link: 'mailto:lowk3v@gmail.com',
						title: (
							<span>Review Your Project
							<span style={{ marginLeft: 10 }}>🔐</span>
							</span>
						),
					},
				].map((item) => (
					<a className={styles.bio_link} key={item.link} href={item.link} target='_blank'>
					{item.title}
					</a>
				))}
				</div>
				{/* <div style={{ margin: '40px 0', textAlign: 'center' }}>
					<SubscribeForm />
				</div> */}
				<div className={styles.sections} style={{marginLeft: '-3%'}}>
					{/* Introduction */}
					<section className={styles.subSection}>
						<h2><a href="https://lowk.substack.com/about" target="_blank" className={styles.heading}>About Me ↗</a></h2>
						<ul className={styles.list}>
						<li>
							<span style={{ marginRight: '10px' }}>🇻🇳</span>
							From Vietnam
						</li>
						<li>
							<span style={{ marginRight: '10px' }}>🇻🇳</span>
							Remote available
						</li>
						<li>
							<span style={{ marginRight: '10px' }}>👨‍💻</span>
							Indie Blockchain Security Auditor
						</li>

						<li>
							<span style={{ marginRight: '10px' }}>🔨</span>
							Full-time Cybersecurity Engineer
						</li>
						</ul>
					</section>

					{/* Social Media */}
					<section className={styles.subSection}>
						<h2 className={styles.heading}>Social Media</h2>
						<ul className={styles.list}>
						<li>
							<div>
							<img src="/linkedin.svg" style={{ width: 20, marginRight: 10, display: 'unset' }} />
							<a href="https://www.linkedin.com/in/lowk3v/" target="_blank">LinkedIn</a>
							</div>
							<div className={styles.subtitle}>
								Professional profile for work
							</div>	
						</li>
						<li>
							<div>
							<img src="/telegram.svg" style={{ width: 20, marginRight: 10, display: 'unset' }} />
							<a href="https://lowk3v.t.me/" target="_blank">Telegram</a>
							</div>
							<div className={styles.subtitle}>DM me for any questions</div>
						</li>
						<li>
							<div>
							<span style={{ marginRight: '10px' }}>📨</span>
							<a href="mail://lowk3v@gmail.com" target="_blank">Email</a>
							</div>
							<div className={styles.subtitle}>Mail to me for work purposes</div>
						</li>
						</ul>
					</section>

				</div>
				<div className={styles.sections}>
					{/* Posts */}
					<section className={styles.subSection}>
						<h2 className={styles.heading}>Latest Post 👇</h2>
						<div className={styles['issue-container']}>
						{feeds && feeds.map((issue, i) => (
							<a key={i} href={issue.link} className={styles['issue-line']}>
							<div className={styles['issue-header']}>
								<div
								style={{ backgroundColor: issue.color }}
								className={styles['issue-source']}
								>
								{issue.source}
								</div>
								<div className={styles['issue-date']}>
								{/* {moment(issue.isoDate).fromNow()} */}
								</div>
							</div>
							<div className={styles['issue-title']}>{issue.title}</div>
							<div className={styles['issue-snippet']}>
								{(issue.contentSnippet || '').substring(0, 100)}
								{(issue.contentSnippet || '').length > 100 ? '...' : ''}
							</div>
							</a>
						))}
						</div>
					</section>
				</div>
			</main>

			<style>{`
				html, body {
					padding: 0;
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
						Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
						sans-serif;
				}

				@media (prefers-color-scheme: dark) {
					html,
					body {
						color-scheme: dark;
						color: white;
					}
				}
			`}</style>

		</div>
	);
}

