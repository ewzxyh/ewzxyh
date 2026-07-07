"use client";

import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import localFont from "next/font/local";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useLoading } from "./loading-context";

gsap.registerPlugin(MorphSVGPlugin);

const atAmiga = localFont({
	src: "../../app/fonts/AtAmiga-Regular.woff2",
	weight: "400",
	style: "normal",
	display: "swap",
});

const iconPaths = [
	"M0.565231 48.3871C0.565231 95.2585 38.8514 133.391 85.913 133.391C132.975 133.391 171.261 95.2585 171.261 48.3871V18.0373C171.261 8.08998 163.137 3.86996e-06 153.149 3.86996e-06C143.163 3.86996e-06 135.04 8.08998 135.04 18.0373V48.3871C135.04 75.3653 113.001 97.3153 85.913 97.3153C58.8248 97.3153 36.7865 75.3653 36.7865 48.3871V18.0373C36.7865 8.08998 28.6612 3.86996e-06 18.6765 3.86996e-06C8.68913 3.86996e-06 0.565231 8.08998 0.565231 18.0373V48.3871Z",
	"M86.195 74.0435C101.646 74.0435 114.174 61.5179 114.174 46.0659C114.174 30.6125 101.646 18.087 86.195 18.087C70.7429 18.087 58.2174 30.6125 58.2174 46.0659C58.2174 61.5179 70.7429 74.0435 86.195 74.0435Z",
	"M24.0217 180.87C37.2886 180.87 48.0435 170.116 48.0435 156.847C48.0435 143.581 37.2886 132.826 24.0217 132.826C10.7548 132.826 -3.74563e-06 143.581 -3.74563e-06 156.847C-3.74563e-06 170.116 10.7548 180.87 24.0217 180.87Z",
	"M146.674 182C159.941 182 170.696 171.244 170.696 157.979C170.696 144.711 159.941 133.956 146.674 133.956C133.407 133.956 122.652 144.711 122.652 157.979C122.652 171.244 133.407 182 146.674 182Z",
];

const letterEPaths = [
	"M85.2494 0C38.2427 0 0 38.2426 0 85.2506C0 132.259 38.2427 170.501 85.2494 170.501H115.687C125.663 170.501 133.776 162.387 133.776 152.411C133.776 142.436 125.663 134.321 115.687 134.321H85.2494C58.1934 134.321 36.18 112.308 36.18 85.2506C36.18 58.1933 58.1934 36.18 85.2494 36.18H115.687C125.663 36.18 133.776 28.064 133.776 18.0907C133.776 8.11465 125.663 0 115.687 0H85.2494Z",
	"M59.2827 85.2513C59.2827 100.759 71.8547 113.334 87.3641 113.334C102.875 113.334 115.447 100.759 115.447 85.2513C115.447 69.742 102.875 57.17 87.3641 57.17C71.8547 57.17 59.2827 69.742 59.2827 85.2513Z",
];

const letterHPaths = [
	"M0 135.558V161.594C0 172.848 9.12534 181.975 20.38 181.975C31.636 181.975 40.7627 172.848 40.7627 161.594V135.558C40.7627 115.119 57.392 98.491 77.8307 98.491C98.2693 98.491 114.899 115.119 114.899 135.558V161.594C114.899 172.848 124.024 181.975 135.279 181.975C146.535 181.975 155.661 172.848 155.661 161.594V135.558C155.661 92.6416 120.747 57.7284 77.8307 57.7284C34.9134 57.7284 0 92.6416 0 135.558Z",
	"M0 24.0213C0 37.2879 10.7533 48.0426 24.0213 48.0426C37.2867 48.0426 48.0414 37.2879 48.0414 24.0213C48.0414 10.7546 37.2867 -3.78265e-05 24.0213 -3.78265e-05C10.7533 -3.78265e-05 0 10.7546 0 24.0213Z",
];

const letterYPaths = [
	"M114.9 20.3826V46.4186C114.9 66.8572 98.2693 83.4839 77.8306 83.4839C57.3933 83.4839 40.764 66.8572 40.764 46.4186V20.3826C40.764 9.12662 31.6373 -3.32845e-05 20.3813 -3.32845e-05C9.12668 -3.32845e-05 0 9.12662 0 20.3826V46.4186C0 89.3332 34.9133 124.245 77.8306 124.245C120.748 124.245 155.663 89.3332 155.663 46.4186V20.3826C155.663 9.12662 146.536 -3.32845e-05 135.28 -3.32845e-05C124.025 -3.32845e-05 114.9 9.12662 114.9 20.3826Z",
	"M107.619 157.953C107.619 171.22 118.375 181.974 131.64 181.974C144.908 181.974 155.663 171.22 155.663 157.953C155.663 144.687 144.908 133.932 131.64 133.932C118.375 133.932 107.619 144.687 107.619 157.953Z",
];

const collapsedPath = "M86 91C86 91 86 91 86 91C86 91 86 91 86 91Z";
const morphStates = {
	icon: { x: 6.5, y: 0, paths: iconPaths, opacities: [1, 1, 1, 1] },
	e: {
		x: 25.5,
		y: 5.5,
		paths: [...letterEPaths, collapsedPath, collapsedPath],
		opacities: [1, 1, 0, 0],
	},
	h: {
		x: 14.5,
		y: 0,
		paths: [...letterHPaths, collapsedPath, collapsedPath],
		opacities: [1, 1, 0, 0],
	},
	y: {
		x: 14.5,
		y: 0,
		paths: [...letterYPaths, collapsedPath, collapsedPath],
		opacities: [1, 1, 0, 0],
	},
};

const finalLetterShapes = {
	e: { paths: letterEPaths, x: morphStates.e.x, y: morphStates.e.y },
	h: { paths: letterHPaths, x: morphStates.h.x, y: morphStates.h.y },
	y: { paths: letterYPaths, x: morphStates.y.x, y: morphStates.y.y },
};

const LETTER_SLOT_VIEWBOX = "0 0 185 182";
const LETTER_SLOT_WIDTH = 185;
const LETTER_SLOT_HEIGHT = 182;
const LETTER_SLOT_CLASS =
	"absolute left-1/2 top-16 h-auto w-[clamp(5.5rem,12vw,13rem)] max-w-[72%] overflow-visible opacity-0 sm:top-[22%]";

const ICON_REVEAL_SECONDS = 0.16;
const ICON_HOLD_SECONDS = 0.5;
const MORPH_START_SECONDS = ICON_REVEAL_SECONDS + ICON_HOLD_SECONDS;
const LETTER_DRAW_SECONDS = 0.82;
const LETTER_FILL_SECONDS = 0.74;
const LETTER_STEP_SECONDS = 0.88;
const MORPH_EXIT_SECONDS = MORPH_START_SECONDS + 1.66;
const FIRST_LETTER_DRAW_SECONDS = MORPH_EXIT_SECONDS + 0.18;
const LETTER_FILL_START_SECONDS =
	FIRST_LETTER_DRAW_SECONDS +
	LETTER_STEP_SECONDS * 2 +
	LETTER_DRAW_SECONDS +
	0.06;
const LOADER_TIMELINE_SECONDS =
	LETTER_FILL_START_SECONDS + LETTER_FILL_SECONDS + 0.03;
const LOADER_TIMELINE_WALL_SECONDS = LOADER_TIMELINE_SECONDS - 2;
const LOADER_TIMELINE_TIMESCALE =
	LOADER_TIMELINE_SECONDS / LOADER_TIMELINE_WALL_SECONDS;
const MIN_LOGO_SCREEN_MS = LOADER_TIMELINE_WALL_SECONDS * 1000;
type FinalLetter = keyof typeof finalLetterShapes;
type CounterColumn = {
	key: string;
	digitIndex: number | null;
	letter?: FinalLetter;
};

const counterColumns: CounterColumn[] = [
	{ key: "left-edge", digitIndex: null },
	{ key: "digit-0", digitIndex: 0, letter: "e" },
	{ key: "digit-1", digitIndex: 1, letter: "h" },
	{ key: "digit-2", digitIndex: 2, letter: "y" },
	{ key: "empty-main", digitIndex: null },
	{ key: "right-edge", digitIndex: null },
];

export function PageLoader() {
	const { resolvedTheme } = useTheme();
	const mounted = useMounted();
	const reducedMotion = useReducedMotion();
	const [logoComplete, setLogoComplete] = useState(false);
	const [showLogoScreen, setShowLogoScreen] = useState(true);
	const [asciiArt, setAsciiArt] = useState("");
	const [asciiSize, setAsciiSize] = useState({ columns: 1, lines: 1 });
	const [asciiMetrics, setAsciiMetrics] = useState({
		fontSize: 1,
		marginX: 0,
		marginY: 0,
	});
	const { setLoadingComplete, setAlmostComplete } = useLoading();

	const containerRef = useRef<HTMLDivElement>(null);
	const asciiFrameRef = useRef<HTMLDivElement>(null);
	const morphSvgRef = useRef<SVGSVGElement>(null);
	const morphGroupRef = useRef<SVGGElement>(null);
	const morphPathsRef = useRef<SVGPathElement[]>([]);
	const columnRefs = useRef<HTMLDivElement[]>([]);
	const finalLetterRefs = useRef<SVGSVGElement[]>([]);
	const finalLetterPathRefs = useRef<SVGPathElement[][]>([]);
	const counterDigitsRef = useRef<HTMLSpanElement[]>([]);
	const counterValueRef = useRef({ value: 0 });
	const completedRef = useRef(false);
	const loadingStateSentRef = useRef(false);
	const startedAtRef = useRef(0);
	const completionTimerRef = useRef<number | null>(null);

	const isDark = mounted && resolvedTheme === "dark";

	const setCounter = useCallback((value: number) => {
		const formatted = String(Math.round(value)).padStart(3, "0");
		counterDigitsRef.current.forEach((digit, index) => {
			digit.textContent = formatted[index] ?? "0";
		});
	}, []);

	const updateAsciiMetrics = useCallback(() => {
		const frame = asciiFrameRef.current;
		if (!frame || asciiSize.columns <= 1 || asciiSize.lines <= 1) return;

		const charAspectRatio = 0.6;
		const width = frame.clientWidth;
		const height = frame.clientHeight;
		const fontSize = Math.min(
			width / (asciiSize.columns * charAspectRatio),
			height / asciiSize.lines,
		);
		const actualWidth = asciiSize.columns * fontSize * charAspectRatio;
		const actualHeight = asciiSize.lines * fontSize;
		const nextMetrics = {
			fontSize,
			marginX: Math.max(0, (width - actualWidth) / 2),
			marginY: Math.max(0, height - actualHeight),
		};

		setAsciiMetrics((current) => {
			if (
				Math.abs(current.fontSize - nextMetrics.fontSize) < 0.01 &&
				Math.abs(current.marginX - nextMetrics.marginX) < 0.01 &&
				Math.abs(current.marginY - nextMetrics.marginY) < 0.01
			) {
				return current;
			}

			return nextMetrics;
		});
	}, [asciiSize.columns, asciiSize.lines]);

	const markPortfolioReady = useCallback(() => {
		if (loadingStateSentRef.current) return;
		loadingStateSentRef.current = true;
		setAlmostComplete();
	}, [setAlmostComplete]);

	const hideLogoScreen = useCallback(() => {
		if (completedRef.current) return;
		completedRef.current = true;

		const complete = () => {
			setLogoComplete(true);
			setShowLogoScreen(false);
			setLoadingComplete();
		};

		const columns = columnRefs.current.filter(Boolean);

		if (reducedMotion || !containerRef.current || columns.length === 0) {
			complete();
			return;
		}

		gsap.set(containerRef.current, { backgroundColor: "transparent" });
		gsap.set(columns, { willChange: "transform" });

		const tl = gsap.timeline({
			onComplete: complete,
		});

		tl.to(
			columns,
			{
				yPercent: -105,
				duration: 0.75,
				ease: "power3.inOut",
				stagger: 0.06,
			},
			0.05,
		);
	}, [reducedMotion, setLoadingComplete]);

	const completeLoading = useCallback(() => {
		if (completedRef.current || completionTimerRef.current) return;
		markPortfolioReady();

		const elapsed = performance.now() - startedAtRef.current;
		const remaining = Math.max(0, MIN_LOGO_SCREEN_MS - elapsed);
		if (remaining > 0) {
			completionTimerRef.current = window.setTimeout(() => {
				completionTimerRef.current = null;
				hideLogoScreen();
			}, remaining);
			return;
		}

		hideLogoScreen();
	}, [hideLogoScreen, markPortfolioReady]);

	useEffect(() => {
		let active = true;

		fetch("/loader-ascii-column-4.txt")
			.then((response) => response.text())
			.then((text) => {
				if (!active) return;

				const lines = text.replace(/\r?\n$/, "").split(/\r?\n/);
				const columns = Math.max(1, ...lines.map((line) => line.length));
				const normalizedLines = lines.map((line) => line.padEnd(columns, " "));
				setAsciiArt(normalizedLines.join("\n"));
				setAsciiSize({
					columns,
					lines: Math.max(1, normalizedLines.length),
				});
			})
			.catch(() => undefined);

		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		const frame = asciiFrameRef.current;
		if (!asciiArt || !frame) return;

		updateAsciiMetrics();
		const observer = new ResizeObserver(updateAsciiMetrics);
		observer.observe(frame);

		return () => observer.disconnect();
	}, [asciiArt, updateAsciiMetrics]);

	useEffect(() => {
		if (!mounted || logoComplete) return;

		startedAtRef.current = performance.now();
		markPortfolioReady();
		const fallbackTimer = window.setTimeout(
			completeLoading,
			MIN_LOGO_SCREEN_MS,
		);
		const cleanupTimers = () => {
			window.clearTimeout(fallbackTimer);
			if (completionTimerRef.current) {
				window.clearTimeout(completionTimerRef.current);
				completionTimerRef.current = null;
			}
			if (containerRef.current) {
				gsap.killTweensOf(containerRef.current);
			}
			const columns = columnRefs.current.filter(Boolean);
			if (columns.length > 0) {
				gsap.killTweensOf(columns);
			}
			const finalLetters = finalLetterRefs.current.filter(Boolean);
			if (finalLetters.length > 0) {
				gsap.killTweensOf(finalLetters);
			}
			const finalLetterPaths = finalLetterPathRefs.current
				.flat()
				.filter(Boolean);
			if (finalLetterPaths.length > 0) {
				gsap.killTweensOf(finalLetterPaths);
			}
			if (morphSvgRef.current) {
				gsap.killTweensOf(morphSvgRef.current);
			}
			if (morphGroupRef.current) {
				gsap.killTweensOf(morphGroupRef.current);
			}
			const morphPaths = morphPathsRef.current.filter(Boolean);
			if (morphPaths.length > 0) {
				gsap.killTweensOf(morphPaths);
			}
		};

		if (reducedMotion) {
			setCounter(100);
			gsap.set(finalLetterRefs.current.filter(Boolean), {
				autoAlpha: 1,
				xPercent: -50,
				yPercent: -50,
				y: 0,
				scale: 1,
			});
			gsap.set(finalLetterPathRefs.current.flat().filter(Boolean), {
				fillOpacity: 1,
				strokeOpacity: 0,
				strokeDashoffset: 0,
			});
			completeLoading();
			return cleanupTimers;
		}

		const morphPaths = morphPathsRef.current.filter(Boolean);
		if (morphPaths.length === 0) {
			gsap.set(finalLetterRefs.current.filter(Boolean), {
				autoAlpha: 1,
				xPercent: -50,
				yPercent: -50,
				y: 0,
				scale: 1,
			});
			gsap.set(finalLetterPathRefs.current.flat().filter(Boolean), {
				fillOpacity: 1,
				strokeOpacity: 0,
				strokeDashoffset: 0,
			});
			completeLoading();
			return cleanupTimers;
		}

		let ctx: ReturnType<typeof gsap.context> | undefined;

		try {
			ctx = gsap.context(() => {
				const morphSvg = morphSvgRef.current;
				const morphGroup = morphGroupRef.current;
				const finalLetters = finalLetterRefs.current.filter(Boolean);
				const finalLetterPaths = finalLetterPathRefs.current
					.flat()
					.filter(Boolean);

				gsap.set(finalLetters, {
					autoAlpha: 0,
					xPercent: -50,
					yPercent: -50,
					y: 18,
					scale: 0.94,
					transformOrigin: "center center",
				});

				finalLetterPaths.forEach((path) => {
					const length = path.getTotalLength();
					gsap.set(path, {
						strokeDasharray: length,
						strokeDashoffset: length,
						fillOpacity: 0,
						strokeOpacity: 1,
					});
				});

				if (morphSvg) {
					gsap.set(morphSvg, {
						opacity: 0,
						xPercent: -50,
						yPercent: -50,
						scale: 1,
						transformOrigin: "center center",
					});
				}

				if (morphGroup) {
					gsap.set(morphGroup, {
						x: morphStates.icon.x,
						y: morphStates.icon.y,
						rotate: -12,
						scale: 1,
						transformOrigin: "center center",
						svgOrigin: "92.5 91",
					});
				}

				morphPaths.forEach((path, index) => {
					gsap.set(path, {
						attr: { d: morphStates.icon.paths[index] },
						opacity: morphStates.icon.opacities[index],
					});
				});

				const tl = gsap.timeline({
					onComplete: completeLoading,
				});

				tl.to(
					counterValueRef.current,
					{
						value: 100,
						duration: LOADER_TIMELINE_SECONDS,
						ease: "none",
						onUpdate: () => setCounter(counterValueRef.current.value),
					},
					0,
				);

				if (morphSvg) {
					tl.to(
						morphSvg,
						{
							opacity: 1,
							scale: 1,
							duration: ICON_REVEAL_SECONDS,
							ease: "power2.out",
						},
						0,
					);
				}

				if (morphGroup) {
					tl.to(
						morphGroup,
						{
							rotate: 0,
							scale: 1,
							duration: 0.4,
							ease: "expo.inOut",
						},
						MORPH_START_SECONDS,
					);

					tl.to(
						morphGroup,
						{
							rotate: 8,
							duration: 0.6,
							ease: "none",
						},
						MORPH_START_SECONDS + 0.18,
					);

					const morphTo = (
						state: (typeof morphStates)[keyof typeof morphStates],
						position: number,
					) => {
						tl.to(
							morphGroup,
							{
								x: state.x,
								y: state.y,
								rotate: 0,
								scale: 1,
								duration: 0.36,
								ease: "power3.inOut",
							},
							position,
						);

						morphPaths.forEach((path, index) => {
							tl.to(
								path,
								{
									morphSVG: {
										shape: state.paths[index],
										shapeIndex: "auto",
									},
									duration: 0.36,
									ease: "power3.inOut",
								},
								position,
							);
							tl.to(
								path,
								{
									opacity: state.opacities[index],
									duration: 0.18,
									ease: "power2.out",
								},
								position + 0.08,
							);
						});
					};

					morphTo(morphStates.e, MORPH_START_SECONDS + 0.52);
					morphTo(morphStates.h, MORPH_START_SECONDS + 0.9);
					morphTo(morphStates.y, MORPH_START_SECONDS + 1.28);
				}

				if (morphSvg) {
					tl.to(
						morphSvg,
						{
							opacity: 0,
							scale: 1,
							duration: 0.18,
							ease: "power3.inOut",
						},
						MORPH_EXIT_SECONDS,
					);
				}

				const drawLetter = (index: number, position: number) => {
					const letter = finalLetterRefs.current[index];
					const paths =
						finalLetterPathRefs.current[index]?.filter(Boolean) ?? [];
					if (!letter || paths.length === 0) return;

					tl.to(
						letter,
						{
							autoAlpha: 1,
							y: 0,
							scale: 1,
							duration: 0.12,
							ease: "power2.out",
						},
						position,
					);
					tl.to(
						paths,
						{
							strokeDashoffset: 0,
							duration: LETTER_DRAW_SECONDS,
							ease: "power2.out",
							stagger: 0.03,
						},
						position,
					);
				};

				drawLetter(0, FIRST_LETTER_DRAW_SECONDS);
				drawLetter(1, FIRST_LETTER_DRAW_SECONDS + LETTER_STEP_SECONDS);
				drawLetter(2, FIRST_LETTER_DRAW_SECONDS + LETTER_STEP_SECONDS * 2);

				tl.to(
					finalLetterPaths,
					{
						fillOpacity: 1,
						strokeOpacity: 0,
						duration: LETTER_FILL_SECONDS,
						ease: "power2.out",
					},
					LETTER_FILL_START_SECONDS,
				);

				tl.to({}, { duration: 0.01 }, LOADER_TIMELINE_SECONDS - 0.01);
				tl.timeScale(LOADER_TIMELINE_TIMESCALE);
			}, containerRef);
		} catch {
			completeLoading();
		}

		return () => {
			cleanupTimers();
			ctx?.revert();
		};
	}, [
		mounted,
		logoComplete,
		reducedMotion,
		completeLoading,
		markPortfolioReady,
		setCounter,
	]);

	return (
		<>
			{showLogoScreen && (
				<div
					ref={containerRef}
					className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${
						isDark ? "bg-stone-800" : "bg-stone-200"
					}`}
				>
					<div
						className={`${atAmiga.className} absolute inset-0 grid grid-cols-[minmax(0,0.18fr)_repeat(3,minmax(0,0.78fr))_minmax(0,1.55fr)_minmax(0,0.18fr)] sm:grid-cols-[minmax(0,0.06fr)_repeat(3,minmax(0,0.78fr))_minmax(0,1.55fr)_minmax(0,0.06fr)] pointer-events-none select-none overflow-hidden text-foreground/10 dark:text-foreground/10`}
						aria-hidden="true"
					>
						{counterColumns.map(({ key, digitIndex, letter }, columnIndex) => (
							<div
								key={key}
								ref={(el) => {
									if (el) columnRefs.current[columnIndex] = el;
								}}
								className={`flex items-end justify-center overflow-hidden border-l border-foreground/10 pb-8 first:border-l-0 sm:pb-12 ${
									isDark ? "bg-stone-800" : "bg-stone-200"
								} ${letter || key === "empty-main" ? "relative" : ""}`}
							>
								{letter && (
									<svg
										ref={(el) => {
											if (el && digitIndex !== null)
												finalLetterRefs.current[digitIndex] = el;
										}}
										viewBox={LETTER_SLOT_VIEWBOX}
										width={LETTER_SLOT_WIDTH}
										height={LETTER_SLOT_HEIGHT}
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className={LETTER_SLOT_CLASS}
										aria-hidden="true"
									>
										<g
											transform={`translate(${finalLetterShapes[letter].x} ${finalLetterShapes[letter].y})`}
										>
											{finalLetterShapes[letter].paths.map((d, pathIndex) => (
												<path
													key={d}
													ref={(el) => {
														if (!el || digitIndex === null) return;
														finalLetterPathRefs.current[digitIndex] ??= [];
														finalLetterPathRefs.current[digitIndex][pathIndex] =
															el;
													}}
													d={d}
													fill="currentColor"
													stroke="currentColor"
													strokeWidth="2"
													vectorEffect="non-scaling-stroke"
													style={{ fillOpacity: 0, strokeOpacity: 1 }}
												/>
											))}
										</g>
									</svg>
								)}
								{digitIndex === 0 && (
									<svg
										ref={morphSvgRef}
										width={LETTER_SLOT_WIDTH}
										height={LETTER_SLOT_HEIGHT}
										viewBox={LETTER_SLOT_VIEWBOX}
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className={`${LETTER_SLOT_CLASS} z-10 overflow-visible`}
										aria-hidden="true"
									>
										<g ref={morphGroupRef}>
											{iconPaths.map((d, i) => (
												<path
													key={d}
													ref={(el) => {
														if (el) morphPathsRef.current[i] = el;
													}}
													d={d}
													fill="currentColor"
													opacity={1}
												/>
											))}
										</g>
									</svg>
								)}
								{digitIndex !== null && (
									<span
										ref={(el) => {
											if (el) counterDigitsRef.current[digitIndex] = el;
										}}
										className="text-[clamp(5rem,16vw,19rem)] leading-none tabular-nums"
									>
										0
									</span>
								)}
								{key === "empty-main" && asciiArt && (
									<div
										ref={asciiFrameRef}
										className="absolute inset-x-2 bottom-8 top-8 overflow-hidden sm:inset-x-4 sm:bottom-12 sm:top-12"
									>
										<pre
											className="block overflow-hidden whitespace-pre text-center font-bold text-foreground/30 dark:text-foreground/30"
											style={{
												margin: `${asciiMetrics.marginY}px ${asciiMetrics.marginX}px`,
												fontFamily: '"Courier New", monospace',
												fontSize: `${asciiMetrics.fontSize}px`,
												lineHeight: `${asciiMetrics.fontSize}px`,
												fontVariantLigatures: "none",
												letterSpacing: 0,
												tabSize: 1,
											}}
										>
											{asciiArt}
										</pre>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
}
