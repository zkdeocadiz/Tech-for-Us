import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, useParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Link as Link$1, useNavigate } from "react-router-dom";
import { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), streamTimeout + 1e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/root.jsx
var root_exports = /* @__PURE__ */ __exportAll({ default: () => root_default });
var root_default = UNSAFE_withComponentProps(function Root() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {}),
			/* @__PURE__ */ jsx("script", {
				type: "text/javascript",
				dangerouslySetInnerHTML: { __html: `
            (function(l) {
              if (l.search[1] === 'p') {
                var decoded = l.search.slice(1).split('&').map(function(s) { 
                  return s.replace(/~and~/g, '&') 
                }).filter(function(s) {
                  return s.slice(0, 2) === 'p='
                })[0].slice(2);
                if (decoded !== l.pathname) {
                  window.history.replaceState(null, null,
                    l.pathname.slice(0, -1) + decoded + l.hash
                  );
                }
              }
            }(window.location))
          ` }
			})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			/* @__PURE__ */ jsx(Outlet, {}),
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
});
//#endregion
//#region app/features/quiz/storage.js
var STORAGE_KEY$1 = "socialtech_quiz_result";
var canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
var saveResult = (result) => canUseStorage() && localStorage.setItem(STORAGE_KEY$1, JSON.stringify(result));
var loadResult = () => {
	if (!canUseStorage()) return null;
	const stored = localStorage.getItem(STORAGE_KEY$1);
	return stored ? JSON.parse(stored) : null;
};
var clearResult = () => canUseStorage() && localStorage.removeItem(STORAGE_KEY$1);
var hasResult = () => canUseStorage() && localStorage.getItem(STORAGE_KEY$1) !== null;
//#endregion
//#region app/components/Header.jsx
function Header() {
	const [hasResult, setHasResult] = useState(false);
	useEffect(() => {
		setHasResult(!!loadResult());
	}, []);
	return /* @__PURE__ */ jsx("header", {
		className: "site-header",
		children: /* @__PURE__ */ jsxs("div", {
			className: "site-shell site-header__inner",
			children: [/* @__PURE__ */ jsx(Link$1, {
				className: "site-logo-link",
				to: "/",
				"aria-label": "Tech for Us home",
				children: /* @__PURE__ */ jsx("img", {
					className: "site-logo",
					src: "https://www.figma.com/api/mcp/asset/52706c78-1f88-4ac6-971b-e14e57cdde26",
					alt: "Tech for Us"
				})
			}), /* @__PURE__ */ jsx("nav", {
				className: "site-nav",
				"aria-label": "Primary",
				children: [
					{
						label: "Your Content",
						to: "/your-content"
					},
					{
						label: "Activities",
						to: "/activities"
					},
					{
						label: "Your Technology Type",
						to: hasResult ? "/technology-types" : "/quiz"
					}
				].map((item) => /* @__PURE__ */ jsx(Link$1, {
					className: "site-nav__item",
					to: item.to,
					children: item.label
				}, item.label))
			})]
		})
	});
}
//#endregion
//#region app/components/Footer.jsx
var defaultFooterColumns = [
	{
		title: "Activities",
		items: [
			{
				label: "All Activities",
				href: "/activities"
			},
			{
				label: "Activity Sets",
				href: "/activity-sets"
			},
			{
				label: "Alternative Social Tech",
				href: "/alternative-social-tech"
			}
		]
	},
	{
		title: "Your Content",
		items: [
			{
				label: "View All",
				href: "/your-content"
			},
			{
				label: "Technology Type Quiz",
				href: "/quiz"
			},
			{
				label: "Privacy",
				href: "/content/Privacy"
			}
		]
	},
	{
		title: "Tech for Us",
		items: [
			{
				label: "Manifesto",
				href: "/content/Manifesto"
			},
			{
				label: "Contributors",
				href: "/contributors"
			},
			{
				label: "Github",
				href: "https://github.com/"
			}
		]
	}
];
function Footer({ columns = defaultFooterColumns }) {
	return /* @__PURE__ */ jsx("footer", {
		className: "site-footer",
		id: "content",
		children: /* @__PURE__ */ jsx("div", {
			className: "site-shell site-footer__inner",
			children: columns.map((column) => /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
				className: "site-footer__title",
				children: column.title
			}), /* @__PURE__ */ jsx("ul", {
				className: "site-footer__list",
				children: column.items.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
					className: "site-footer__link",
					href: item.href,
					children: item.label
				}) }, item.label))
			})] }, column.title))
		})
	});
}
//#endregion
//#region app/features/home/HomePage.jsx
var HomePage_exports = /* @__PURE__ */ __exportAll({ default: () => HomePage_default });
var featureIcon = "https://www.figma.com/api/mcp/asset/4fd5c91c-08f2-495e-9015-86c7d517aab3";
var heroLogo = "https://www.figma.com/api/mcp/asset/9512459b-36f1-4949-9572-fe0decf7dbfa";
var features = [
	{
		title: "Activities",
		body: "This isn’t a passive reading exercise. Get hands-on practice through active exercises for all content."
	},
	{
		title: "Annotations",
		body: "You can annotate every post or activity, because everything should adapt to what you need."
	},
	{
		title: "Private",
		body: "Everything is only saved onto your computer - no data in the cloud and nothing sent to us unless you want us to see it."
	},
	{
		title: "Co-created",
		body: "See something you think should be changed? Submit a change because Tech for Us is driven by the community."
	}
];
var activityCards = [
	{
		title: "How to write a better dating app",
		text: "lorem ipsum",
		tone: "white",
		href: "/#activities"
	},
	{
		title: "Value-based design",
		text: "lorem ipsum",
		tone: "pink",
		href: "/#activities"
	},
	{
		title: "Groupchat",
		text: "lorem ipsum",
		tone: "blue",
		href: "/#activities"
	}
];
var HomePage_default = UNSAFE_withComponentProps(function HomePage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "home-page",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", { children: [
				/* @__PURE__ */ jsx("section", {
					className: "home-hero home-page__section",
					id: "manifesto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "home-page__shell",
						children: [
							/* @__PURE__ */ jsx("img", {
								className: "home-hero__logo",
								src: heroLogo,
								alt: "Tech for Us"
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "home-hero__copy",
								children: [
									"A ",
									/* @__PURE__ */ jsx("em", { children: "co-created toolkit" }),
									" for helping you figure out what role technology should have in your life and how to get there"
								]
							}),
							/* @__PURE__ */ jsx("a", {
								className: "home-button",
								href: "#activities",
								children: "The Manifesto"
							})
						]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "home-features home-page__section",
					"aria-labelledby": "features-heading",
					children: /* @__PURE__ */ jsxs("div", {
						className: "home-page__shell",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "sr-only",
							id: "features-heading",
							children: "Tech for Us"
						}), /* @__PURE__ */ jsx("div", {
							className: "feature-grid",
							children: features.map((feature) => /* @__PURE__ */ jsxs("article", {
								className: "feature-card",
								children: [
									/* @__PURE__ */ jsx("img", {
										className: "feature-card__icon",
										src: featureIcon,
										alt: "",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "feature-card__title",
										children: feature.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "feature-card__body",
										children: feature.body
									})
								]
							}, feature.title))
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "activities home-page__section",
					id: "activities",
					"aria-labelledby": "activities-heading",
					children: /* @__PURE__ */ jsxs("div", {
						className: "home-page__shell",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "home-section-title",
							id: "activities-heading",
							children: "Newest Activities"
						}), /* @__PURE__ */ jsxs("div", {
							className: "activities__grid",
							children: [/* @__PURE__ */ jsx("a", {
								className: "activity-link activity-link--feature",
								href: "/quiz",
								"aria-label": "Open What’s your technology type activity",
								children: /* @__PURE__ */ jsxs("article", {
									className: "activity-feature",
									children: [/* @__PURE__ */ jsx("div", { className: "activity-feature__visual" }), /* @__PURE__ */ jsxs("div", {
										className: "activity-feature__content",
										children: [/* @__PURE__ */ jsx("h3", {
											className: "activity-feature__title",
											children: "What’s your technology type?"
										}), /* @__PURE__ */ jsx("p", {
											className: "activity-feature__text",
											children: "lorem ipsum"
										})]
									})]
								})
							}), activityCards.map((card) => /* @__PURE__ */ jsx("a", {
								className: "activity-link",
								href: card.href,
								"aria-label": `Open ${card.title} activity`,
								children: /* @__PURE__ */ jsxs("article", {
									className: "activity-card",
									children: [/* @__PURE__ */ jsx("div", { className: `activity-card__visual activity-card__visual--${card.tone}` }), /* @__PURE__ */ jsxs("div", {
										className: "activity-card__body",
										children: [/* @__PURE__ */ jsx("h3", {
											className: "activity-card__title",
											children: card.title
										}), /* @__PURE__ */ jsx("p", {
											className: "activity-card__text",
											children: card.text
										})]
									})]
								})
							}, card.title))]
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "tracks home-page__section",
					id: "tracks",
					"aria-labelledby": "tracks-heading",
					children: /* @__PURE__ */ jsxs("div", {
						className: "home-page__shell",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "home-section-title",
							id: "tracks-heading",
							children: "Curriculum Tracks"
						}), /* @__PURE__ */ jsx("p", {
							className: "tracks__text",
							children: "Coming Soon"
						})]
					})
				})
			] }),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/features/content/localFileStorage.js
/**
* localFileStorage - A simple IndexedDB wrapper for storing large files locally.
* This keeps user data on their device while bypassing the 5MB localStorage limit.
*/
var DB_NAME = "TechForUs_Files";
var STORE_NAME = "files";
var getDB = () => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = (e) => {
			e.target.result.createObjectStore(STORE_NAME);
		};
		request.onsuccess = (e) => resolve(e.target.result);
		request.onerror = (e) => reject(e.target.error);
	});
};
var localFileStorage = {
	/**
	* Saves a file (Blob or Base64 string) to IndexedDB
	*/
	async save(key, data) {
		const db = await getDB();
		return new Promise((resolve, reject) => {
			const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(data, key);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	},
	/**
	* Retrieves file data from IndexedDB
	*/
	async get(key) {
		const db = await getDB();
		return new Promise((resolve, reject) => {
			const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	},
	/**
	* Deletes file data
	*/
	async delete(key) {
		const db = await getDB();
		return new Promise((resolve, reject) => {
			const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(key);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	},
	/**
	* Clears all data from the object store
	*/
	async clearAll() {
		const db = await getDB();
		return new Promise((resolve, reject) => {
			const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).clear();
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}
};
//#endregion
//#region app/features/content/annotationStorage.js
/**
* Annotation storage utility for localStorage persistence
* Structure: { [pageId]: [annotations], annotatedPages: [...] }
*/
var STORAGE_KEY = "tech-for-us-annotations";
var annotationStorage = {
	/**
	* Get all annotations for a specific page
	* @param {string} pageId - Unique identifier for the page/file
	* @returns {Array} Array of annotation objects
	*/
	getPageAnnotations(pageId) {
		return this.getAllData()[pageId] || [];
	},
	/**
	* Save an annotation for a page
	* @param {string} pageId - Unique identifier for the page
	* @param {object} annotation - Annotation object with id, text, selectedText, timestamp, etc.
	*/
	saveAnnotation(pageId, annotation) {
		const data = this.getAllData();
		if (!data[pageId]) data[pageId] = [];
		data[pageId].push(annotation);
		if (!data.annotatedPages) data.annotatedPages = [];
		if (!data.annotatedPages.includes(pageId)) data.annotatedPages.push(pageId);
		this.saveData(data);
	},
	/**
	* Update an existing annotation
	* @param {string} pageId - Page identifier
	* @param {string} annotationId - ID of annotation to update
	* @param {object} updates - Fields to update
	*/
	updateAnnotation(pageId, annotationId, updates) {
		const data = this.getAllData();
		if (data[pageId]) {
			const index = data[pageId].findIndex((a) => a.id === annotationId);
			if (index !== -1) {
				data[pageId][index] = {
					...data[pageId][index],
					...updates
				};
				this.saveData(data);
			}
		}
	},
	/**
	* Delete an annotation
	* @param {string} pageId - Page identifier
	* @param {string} annotationId - ID of annotation to delete
	*/
	deleteAnnotation(pageId, annotationId) {
		const data = this.getAllData();
		if (data[pageId]) {
			data[pageId] = data[pageId].filter((a) => a.id !== annotationId);
			if (data[pageId].length === 0) {
				delete data[pageId];
				data.annotatedPages = data.annotatedPages.filter((id) => id !== pageId);
			}
			this.saveData(data);
		}
	},
	/**
	* Get list of all pages with annotations
	* @returns {Array} Array of page IDs
	*/
	getAnnotatedPages() {
		return this.getAllData().annotatedPages || [];
	},
	/**
	* Get all data
	* @returns {object} All stored data
	*/
	getAllData() {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : { annotatedPages: [] };
		} catch (e) {
			console.error("Failed to read annotations from localStorage:", e);
			return { annotatedPages: [] };
		}
	},
	/**
	* Save data to localStorage
	* @param {object} data - Data to save
	*/
	saveData(data) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch (e) {
			console.error("Failed to save annotations to localStorage:", e);
		}
	},
	/**
	* Export all annotations as JSON
	* @returns {string} JSON string of all data
	*/
	exportAsJSON() {
		return JSON.stringify(this.getAllData(), null, 2);
	},
	/**
	* Import annotations from JSON
	* @param {string} jsonString - JSON string to import
	* @returns {boolean} Success status
	*/
	importFromJSON(jsonString) {
		try {
			const data = JSON.parse(jsonString);
			if (typeof data === "object" && data !== null) {
				this.saveData(data);
				return true;
			}
			return false;
		} catch (e) {
			console.error("Failed to import annotations:", e);
			return false;
		}
	},
	/**
	* Clear all annotations
	*/
	clearAll() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ annotatedPages: [] }));
	}
};
//#endregion
//#region app/components/YourContentPage.jsx
var YourContentPage_exports = /* @__PURE__ */ __exportAll({ default: () => YourContentPage_default });
var YourContentPage_default = UNSAFE_withComponentProps(function YourContentPage() {
	const [result, setResult] = useState(null);
	const [annotatedPages, setAnnotatedPages] = useState([]);
	useEffect(() => {
		setResult(loadResult());
	}, []);
	useEffect(() => {
		const pages = new Set(annotationStorage.getAnnotatedPages());
		const allLocalStorageKeys = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			allLocalStorageKeys.push(key);
			if (key.startsWith("activity-")) {
				const lastHyphenIndex = key.lastIndexOf("-");
				const pageId = key.substring(9, lastHyphenIndex);
				if (pageId) pages.add(pageId);
			}
		}
		setAnnotatedPages(Array.from(pages).sort());
		setAllLocalStorageKeys(allLocalStorageKeys.sort());
		try {
			const map = {};
			allLocalStorageKeys.forEach((k) => {
				try {
					map[k] = localStorage.getItem(k);
				} catch (e) {
					map[k] = null;
				}
			});
			setLocalStorageMap(map);
		} catch (e) {
			setLocalStorageMap({});
		}
	}, []);
	const formatTitle = (id) => {
		return id.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
	};
	const handleExportAllData = async () => {
		const backup = {
			localStorage: {},
			indexedDB: {}
		};
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key.startsWith("annotations-") || key.startsWith("activity-") || key.startsWith("quiz-")) backup.localStorage[key] = localStorage.getItem(key);
		}
		const activityKeys = Object.keys(backup.localStorage).filter((k) => k.startsWith("activity-"));
		for (const key of activityKeys) {
			const content = await localFileStorage.get(key);
			if (content) backup.indexedDB[key] = content;
		}
		const blob = new Blob([JSON.stringify(backup)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `tech-for-us-full-backup-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
		link.click();
		URL.revokeObjectURL(url);
	};
	const handleImportAllData = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (e) => {
			const file = e.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = async (event) => {
					try {
						const backup = JSON.parse(event.target.result);
						if (backup.localStorage) Object.entries(backup.localStorage).forEach(([k, v]) => localStorage.setItem(k, v));
						if (backup.indexedDB) for (const [k, v] of Object.entries(backup.indexedDB)) await localFileStorage.save(k, v);
						alert("All data imported successfully! The page will now reload.");
						window.location.reload();
					} catch (err) {
						console.error("Import error:", err);
						alert("Failed to import data. Ensure the file is a valid backup.");
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	};
	const handleDeleteAllData = async () => {
		if (!window.confirm("Are you sure you want to delete all your data? This includes all annotations, activity responses, and uploaded files. This cannot be undone.")) return;
		if (!window.confirm("FINAL WARNING: This will permanently wipe all your progress and content from this browser. Are you absolutely sure?")) return;
		try {
			const keysToRemove = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key.startsWith("annotations-") || key.startsWith("activity-") || key.startsWith("quiz-")) keysToRemove.push(key);
			}
			keysToRemove.forEach((key) => localStorage.removeItem(key));
			await localFileStorage.clearAll();
			alert("All data has been successfully deleted. The page will now reload.");
			window.location.reload();
		} catch (err) {
			console.error("Error deleting data:", err);
			alert("An error occurred while deleting your data. Some data may still remain.");
		}
	};
	const [allLocalStorageKeys, setAllLocalStorageKeys] = useState([]);
	const [localStorageMap, setLocalStorageMap] = useState({});
	return /* @__PURE__ */ jsxs("div", {
		className: "standard-page",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				style: {
					padding: "4rem 2rem",
					maxWidth: "800px",
					margin: "0 auto",
					minHeight: "60vh"
				},
				children: [
					/* @__PURE__ */ jsx("h1", {
						style: {
							color: "var(--color-blue)",
							marginBottom: "2rem"
						},
						children: "Your Content"
					}),
					/* @__PURE__ */ jsx("p", { children: "This is where you'll find all the pages you've annotated or activity boxes you've filled in." }),
					/* @__PURE__ */ jsxs("section", {
						style: { marginTop: "3rem" },
						children: [/* @__PURE__ */ jsx("h2", {
							style: {
								fontFamily: "ApfelGrotezk",
								fontSize: "2rem",
								marginBottom: "1.5rem"
							},
							children: "Your Annotated Works & Activities"
						}), annotatedPages.length > 0 ? /* @__PURE__ */ jsx("ul", {
							style: {
								listStyle: "none",
								padding: 0
							},
							children: annotatedPages.map((pageId) => /* @__PURE__ */ jsx("li", {
								style: { marginBottom: "1.5rem" },
								children: /* @__PURE__ */ jsx(Link$1, {
									to: `/content/${pageId}`,
									style: {
										display: "block",
										padding: "1.5rem",
										backgroundColor: "var(--color-white)",
										border: "3px solid var(--color-blue)",
										textDecoration: "none",
										color: "var(--color-blue)",
										transition: "transform 120ms ease, background-color 120ms ease",
										fontFamily: "ApfelGrotezk",
										fontSize: "1.5rem",
										fontWeight: 800
									},
									children: formatTitle(pageId)
								})
							}, pageId))
						}) : /* @__PURE__ */ jsx("p", {
							style: {
								fontStyle: "italic",
								color: "rgba(67, 0, 224, 0.7)"
							},
							children: "You haven't saved any annotations or activity responses yet. Visit any article or activity to start building your collection!"
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						style: { marginTop: "4rem" },
						children: [/* @__PURE__ */ jsx("h2", {
							style: {
								fontFamily: "ApfelGrotezk",
								fontSize: "2rem",
								marginBottom: "1.5rem"
							},
							children: "Quiz Progress"
						}), result ? /* @__PURE__ */ jsxs("div", {
							style: {
								padding: "1rem",
								backgroundColor: "var(--color-pale-pink)",
								borderRadius: "8px",
								marginTop: "1rem"
							},
							children: [/* @__PURE__ */ jsxs("p", { children: ["Your current result: ", /* @__PURE__ */ jsx("strong", { children: result.code })] }), /* @__PURE__ */ jsx(Link$1, {
								to: "/technology-types",
								style: {
									color: "var(--color-blue)",
									textDecoration: "underline"
								},
								children: "View all personalities"
							})]
						}) : /* @__PURE__ */ jsx(Link$1, {
							to: "/quiz",
							className: "home-button",
							style: {
								display: "inline-block",
								marginTop: "1rem"
							},
							children: "Take the Personality Quiz"
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						style: {
							marginTop: "4rem",
							padding: "2.5rem",
							backgroundColor: "var(--color-blue)",
							color: "white"
						},
						children: [
							/* @__PURE__ */ jsx("h2", {
								style: {
									fontFamily: "ApfelGrotezk",
									fontSize: "2rem",
									marginBottom: "1rem",
									color: "white"
								},
								children: "Backup & Sync"
							}),
							/* @__PURE__ */ jsx("p", {
								style: {
									marginBottom: "2rem",
									opacity: .9
								},
								children: "Export all your annotations, activity responses, and uploaded files into a single file to move to another device or browser."
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "1rem",
									flexWrap: "wrap"
								},
								children: [
									/* @__PURE__ */ jsx("button", {
										onClick: handleExportAllData,
										style: {
											padding: "1rem 2rem",
											backgroundColor: "var(--color-green)",
											color: "white",
											border: "none",
											fontFamily: "ApfelGrotezk",
											fontWeight: "bold",
											cursor: "pointer",
											fontSize: "1rem"
										},
										children: "Export Full Backup"
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: handleImportAllData,
										style: {
											padding: "1rem 2rem",
											backgroundColor: "transparent",
											color: "white",
											border: "2px solid white",
											fontFamily: "ApfelGrotezk",
											fontWeight: "bold",
											cursor: "pointer",
											fontSize: "1rem"
										},
										children: "Restore From File"
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: handleDeleteAllData,
										style: {
											padding: "1rem 2rem",
											backgroundColor: "#d00",
											color: "white",
											border: "none",
											fontFamily: "ApfelGrotezk",
											fontWeight: "bold",
											cursor: "pointer",
											fontSize: "1rem"
										},
										children: "Delete All Data"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						style: {
							marginTop: "4rem",
							borderTop: "1px solid #eee",
							paddingTop: "2rem"
						},
						children: [/* @__PURE__ */ jsx("h2", {
							style: {
								fontFamily: "ApfelGrotezk",
								fontSize: "1.5rem",
								marginBottom: "1rem",
								color: "var(--color-blue)"
							},
							children: "Debug: All LocalStorage Keys"
						}), allLocalStorageKeys.length > 0 ? /* @__PURE__ */ jsx("ul", {
							style: {
								listStyle: "disc",
								paddingLeft: "20px",
								fontSize: "0.9rem",
								color: "#555"
							},
							children: allLocalStorageKeys.map((key) => /* @__PURE__ */ jsxs("li", { children: [
								/* @__PURE__ */ jsx("strong", { children: key }),
								": ",
								(localStorageMap[key] || "").substring(0, 100),
								"..."
							] }, key))
						}) : /* @__PURE__ */ jsx("p", {
							style: {
								fontStyle: "italic",
								color: "#888"
							},
							children: "No items found in localStorage."
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/features/quiz/questions.js
var questions = [
	{
		id: "mh1",
		text: "The constant stream of new information online is more stimulating than overwhelming",
		category: "mentalHealth",
		direction: "E"
	},
	{
		id: "mh2",
		text: "Social media algorithms showing you content you enjoy is mostly a good thing",
		category: "mentalHealth",
		direction: "E"
	},
	{
		id: "mh3",
		text: "Staying informed through social media is genuinely good for my wellbeing",
		category: "mentalHealth",
		direction: "E"
	},
	{
		id: "mh4",
		text: "I feel more energized than drained when I think about using social media",
		category: "mentalHealth",
		direction: "E"
	},
	{
		id: "mh5",
		text: "Always being reachable is more of a burden than a benefit",
		category: "mentalHealth",
		direction: "W"
	},
	{
		id: "mh6",
		text: "The content I see online often leaves me feeling anxious or unsettled",
		category: "mentalHealth",
		direction: "W"
	},
	{
		id: "mh7",
		text: "Social media is deliberately designed to be addictive in ways that aren't good for me",
		category: "mentalHealth",
		direction: "W"
	},
	{
		id: "mh8",
		text: "I would generally be happier if I used social media less",
		category: "mentalHealth",
		direction: "W"
	},
	{
		id: "ss1",
		text: "Social media is a genuine tool for getting ahead in life",
		category: "socialStatus",
		direction: "D"
	},
	{
		id: "ss2",
		text: "Not being on social media would put me at a real disadvantage socially or professionally",
		category: "socialStatus",
		direction: "D"
	},
	{
		id: "ss3",
		text: "Social media can be a genuine equalizer, giving anyone the chance to build influence regardless of their background",
		category: "socialStatus",
		direction: "D"
	},
	{
		id: "ss4",
		text: "Social media has created real opportunities for people who wouldn't have had them otherwise",
		category: "socialStatus",
		direction: "D"
	},
	{
		id: "ss5",
		text: "I feel like I have to be on social media whether I want to be or not",
		category: "socialStatus",
		direction: "M"
	},
	{
		id: "ss6",
		text: "I shouldn't have to be on social media to be taken seriously professionally or socially",
		category: "socialStatus",
		direction: "M"
	},
	{
		id: "ss7",
		text: "Social media platforms have too much power over whether I can participate in society",
		category: "socialStatus",
		direction: "M"
	},
	{
		id: "ss8",
		text: "Being without social media feels like being excluded from conversations that matter",
		category: "socialStatus",
		direction: "M"
	},
	{
		id: "id1",
		text: "Social media gives me the freedom to express sides of myself I can't show in person",
		category: "identity",
		direction: "G"
	},
	{
		id: "id2",
		text: "I think there are opportunities to be authentic online",
		category: "identity",
		direction: "G"
	},
	{
		id: "id3",
		text: "I am able to find communities online where I can be truly myself",
		category: "identity",
		direction: "G"
	},
	{
		id: "id4",
		text: "I can use social media to develop my understanding of my own identity better",
		category: "identity",
		direction: "G"
	},
	{
		id: "id5",
		text: "Digital spaces are safer places for me to test out new ways of presenting myself in public",
		category: "identity",
		direction: "G"
	},
	{
		id: "id6",
		text: "I worry about how things posted online today could affect me in the future",
		category: "identity",
		direction: "Ft"
	},
	{
		id: "id7",
		text: "The fear of being judged online makes me less likely to express my true opinions",
		category: "identity",
		direction: "Ft"
	},
	{
		id: "id8",
		text: "I am concerned about people's privacy when they are more open about their identity online",
		category: "identity",
		direction: "Ft"
	},
	{
		id: "id9",
		text: "I present an unrealistic version of myself online",
		category: "identity",
		direction: "Fp"
	},
	{
		id: "id10",
		text: "I compare my life to others on social media",
		category: "identity",
		direction: "Fp"
	},
	{
		id: "cn1",
		text: "Online relationships can be just as meaningful as in-person ones",
		category: "connection",
		direction: "C"
	},
	{
		id: "cn2",
		text: "Social media gives me access to community and support I wouldn't otherwise have",
		category: "connection",
		direction: "C"
	},
	{
		id: "cn3",
		text: "Social media has made it easier to stay close to people who don't live nearby",
		category: "connection",
		direction: "C"
	},
	{
		id: "cn4",
		text: "Social media has been an important outlet for me when I feel misunderstood or marginalized in my offline life",
		category: "connection",
		direction: "C"
	},
	{
		id: "cn5",
		text: "Despite connecting people digitally, social media makes me lonelier overall",
		category: "connection",
		direction: "L"
	},
	{
		id: "cn6",
		text: "Seeing other people's social lives online makes me more aware of what I'm missing",
		category: "connection",
		direction: "L"
	},
	{
		id: "cn7",
		text: "Social media replaces real connection with something that only looks like it",
		category: "connection",
		direction: "L"
	},
	{
		id: "cn8",
		text: "Online interactions often feel shallow compared to in-person ones",
		category: "connection",
		direction: "L"
	}
];
var QUESTION_COUNTS = {
	mentalHealth: {
		E: 4,
		W: 4
	},
	socialStatus: {
		D: 4,
		M: 4
	},
	identity: {
		G: 5,
		Ft: 3,
		Fp: 2
	},
	connection: {
		C: 4,
		L: 4
	}
};
//#endregion
//#region app/features/quiz/scoring.js
var FT_COUNT = questions.filter((q) => q.direction === "Ft").length;
var FP_COUNT = questions.filter((q) => q.direction === "Fp").length;
function calculateResult(responses) {
	const scores = {
		mentalHealth: {
			E: 0,
			W: 0
		},
		socialStatus: {
			D: 0,
			M: 0
		},
		identity: {
			G: 0,
			Ft: 0,
			Fp: 0
		},
		connection: {
			C: 0,
			L: 0
		}
	};
	questions.forEach((q) => {
		const response = responses[q.id];
		if (response == null) return;
		if (q.category === "identity") scores.identity[q.direction] += response;
		else scores[q.category][q.direction] += response;
	});
	const mh = scores.mentalHealth.E >= scores.mentalHealth.W ? "E" : "W";
	const ss = scores.socialStatus.D >= scores.socialStatus.M ? "D" : "M";
	const cn = scores.connection.C >= scores.connection.L ? "C" : "L";
	const identityMain = scores.identity.G >= scores.identity.Ft + scores.identity.Fp ? "G" : "F";
	const fSubtype = scores.identity.Ft / FT_COUNT >= scores.identity.Fp / FP_COUNT ? "Ft" : "Fp";
	return {
		code: `${mh}${ss}${identityMain}${cn}`,
		fSubtype: identityMain === "F" ? fSubtype : null,
		scores
	};
}
//#endregion
//#region app/features/quiz/Question.jsx
var LIKERT_OPTIONS = [
	{
		value: 1,
		label: "Strongly Disagree"
	},
	{
		value: 2,
		label: "Disagree"
	},
	{
		value: 3,
		label: "Neutral"
	},
	{
		value: 4,
		label: "Agree"
	},
	{
		value: 5,
		label: "Strongly Agree"
	}
];
function Question({ question, index, total, value, onChange }) {
	const questionId = `question-label-${question.id}`;
	return /* @__PURE__ */ jsxs("div", {
		className: "question",
		children: [/* @__PURE__ */ jsx("p", {
			id: questionId,
			className: "question-text",
			children: question.text
		}), /* @__PURE__ */ jsxs("div", {
			className: "likert-wrapper",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "likert-endpoint",
					"aria-hidden": "true",
					children: "Disagree"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "likert-scale",
					role: "radiogroup",
					"aria-labelledby": questionId,
					children: LIKERT_OPTIONS.map((option) => /* @__PURE__ */ jsxs("label", {
						className: `likert-option ${value === option.value ? "selected" : ""}`,
						children: [
							/* @__PURE__ */ jsx("input", {
								type: "radio",
								name: `question-${question.id}`,
								value: option.value,
								checked: value === option.value,
								onChange: () => onChange(option.value)
							}),
							/* @__PURE__ */ jsx("span", {
								className: "likert-visual",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "sr-only",
								children: option.label
							})
						]
					}, option.value))
				}),
				/* @__PURE__ */ jsx("span", {
					className: "likert-endpoint",
					"aria-hidden": "true",
					children: "Agree"
				})
			]
		})]
	});
}
//#endregion
//#region app/features/quiz/Quiz.jsx
var Quiz_exports = /* @__PURE__ */ __exportAll({ default: () => Quiz_default });
var quizBannerImage = "https://www.figma.com/api/mcp/asset/825fa458-8cd2-4d77-8a15-0aa4d5ab1944";
function shuffleArray(array) {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}
var Quiz_default = UNSAFE_withComponentProps(function Quiz() {
	const navigate = useNavigate();
	const [responses, setResponses] = useState({});
	const [ready, setReady] = useState(false);
	const shuffledQuestions = useMemo(() => shuffleArray(questions), []);
	useEffect(() => {
		if (hasResult()) navigate("/technology-types");
		else setReady(true);
	}, [navigate]);
	const handleResponse = (id, value) => {
		setResponses((prev) => ({
			...prev,
			[id]: value
		}));
	};
	const answeredCount = Object.keys(responses).length;
	const allAnswered = answeredCount === shuffledQuestions.length;
	const handleSubmit = () => {
		if (!allAnswered) return;
		saveResult(calculateResult(responses));
		navigate("/quiz/results");
	};
	if (!ready) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "quiz-page",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsx("main", {
				className: "quiz-main",
				children: /* @__PURE__ */ jsxs("div", {
					className: "quiz-shell",
					children: [
						/* @__PURE__ */ jsx("img", {
							className: "quiz-banner",
							src: quizBannerImage,
							alt: "",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ jsxs("section", {
							className: "quiz-intro",
							"aria-labelledby": "quiz-heading",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "quiz-kicker",
									children: "What’s your"
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "quiz-heading",
									id: "quiz-heading",
									children: "Technology Type?"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "quiz-intro-lead",
									children: "This quiz is about your beliefs and feelings about social technology. Get a chance to look deeper past the typical ideas around social tech being bad for you or how you just need to stop using it, to find out what your relationship with technology really looks like."
								}),
								/* @__PURE__ */ jsx("p", {
									className: "quiz-intro-body",
									children: "When considering the following statements, think about the way you currently use social tech: the platforms you’re on (if any), what relationships you have with other people on them, and how you think about the way you shown up online. There are no right answers, and your instincts are just as valid, whether you’re on social tech all day or barely using it at all."
								}),
								/* @__PURE__ */ jsx("p", {
									className: "quiz-intro-note",
									children: "Social tech can be defined as your typical social media platforms (TikTok, Instagram), but also more broadly as any digital space you use to interact with others (Signal, WhatsApp, LinkedIn, Twitch, Lex, Grindr, Minecraft, VRChat, etc.)"
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "questions-list",
							children: shuffledQuestions.map((question, index) => /* @__PURE__ */ jsx(Question, {
								question,
								index: index + 1,
								total: shuffledQuestions.length,
								value: responses[question.id],
								onChange: (value) => handleResponse(question.id, value)
							}, question.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "submit-area",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "submit-progress",
								children: [
									answeredCount,
									" of ",
									shuffledQuestions.length,
									" questions answered"
								]
							}), /* @__PURE__ */ jsx("button", {
								className: "submit-button",
								onClick: handleSubmit,
								disabled: !allAnswered,
								children: "Submit"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/features/quiz/ScoreVisualization.jsx
var CATEGORY_CONFIG = [
	{
		id: "mentalHealth",
		name: "Mental Health",
		left: {
			letter: "E",
			label: "Energized"
		},
		right: {
			letter: "W",
			label: "Weary"
		},
		getAverages: (scores) => ({
			left: scores.mentalHealth.E / QUESTION_COUNTS.mentalHealth.E,
			right: scores.mentalHealth.W / QUESTION_COUNTS.mentalHealth.W
		})
	},
	{
		id: "socialStatus",
		name: "Social Status",
		left: {
			letter: "D",
			label: "Desired"
		},
		right: {
			letter: "M",
			label: "Mandatory"
		},
		getAverages: (scores) => ({
			left: scores.socialStatus.D / QUESTION_COUNTS.socialStatus.D,
			right: scores.socialStatus.M / QUESTION_COUNTS.socialStatus.M
		})
	},
	{
		id: "identity",
		name: "Identity",
		left: {
			letter: "G",
			label: "Genuine"
		},
		right: {
			letter: "F",
			label: "Filtered"
		},
		getAverages: (scores) => {
			const fTotal = scores.identity.Ft + scores.identity.Fp;
			const fCount = QUESTION_COUNTS.identity.Ft + QUESTION_COUNTS.identity.Fp;
			return {
				left: scores.identity.G / QUESTION_COUNTS.identity.G,
				right: fTotal / fCount
			};
		}
	},
	{
		id: "connection",
		name: "Connection",
		left: {
			letter: "C",
			label: "Connected"
		},
		right: {
			letter: "L",
			label: "Lonely"
		},
		getAverages: (scores) => ({
			left: scores.connection.C / QUESTION_COUNTS.connection.C,
			right: scores.connection.L / QUESTION_COUNTS.connection.L
		})
	}
];
var F_SUBTYPE_CONFIG = {
	name: "Within Filtered: Tracked vs. Polished",
	left: {
		letter: "Ft",
		label: "Tracked"
	},
	right: {
		letter: "Fp",
		label: "Polished"
	},
	getAverages: (scores) => ({
		left: scores.identity.Ft / QUESTION_COUNTS.identity.Ft,
		right: scores.identity.Fp / QUESTION_COUNTS.identity.Fp
	})
};
function SpectrumBar({ left, right, leftAvg, rightAvg }) {
	const total = leftAvg + rightAvg;
	const rawPosition = total === 0 ? 50 : rightAvg / total * 100;
	const indicatorPosition = Math.max(5, Math.min(95, rawPosition));
	const leansLeft = leftAvg >= rightAvg;
	return /* @__PURE__ */ jsxs("div", {
		className: "viz-spectrum-item",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "viz-labels",
			children: [/* @__PURE__ */ jsxs("span", {
				className: `viz-label viz-label--left${leansLeft ? " viz-label--active" : ""}`,
				children: [/* @__PURE__ */ jsx("span", {
					className: "viz-letter",
					children: left.letter
				}), /* @__PURE__ */ jsx("span", {
					className: "viz-name",
					children: left.label
				})]
			}), /* @__PURE__ */ jsxs("span", {
				className: `viz-label viz-label--right${!leansLeft ? " viz-label--active" : ""}`,
				children: [/* @__PURE__ */ jsx("span", {
					className: "viz-name",
					children: right.label
				}), /* @__PURE__ */ jsx("span", {
					className: "viz-letter",
					children: right.letter
				})]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "viz-bar",
			role: "img",
			"aria-label": `Score leans toward ${leansLeft ? left.label : right.label}`,
			children: /* @__PURE__ */ jsx("div", {
				className: "viz-indicator",
				style: { left: `${indicatorPosition}%` }
			})
		})]
	});
}
function ScoreVisualization({ scores, fSubtype, showTitle = true }) {
	const fSubtypeAverages = F_SUBTYPE_CONFIG.getAverages(scores);
	return /* @__PURE__ */ jsxs("div", {
		className: "score-visualization",
		children: [showTitle && /* @__PURE__ */ jsx("h2", {
			className: "viz-title",
			children: "Score Breakdown"
		}), /* @__PURE__ */ jsx("div", {
			className: "viz-category-list",
			children: CATEGORY_CONFIG.map((cat) => {
				const { left: leftAvg, right: rightAvg } = cat.getAverages(scores);
				return /* @__PURE__ */ jsxs("div", {
					className: "viz-category",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "viz-category-name",
							children: cat.name
						}),
						/* @__PURE__ */ jsx(SpectrumBar, {
							left: cat.left,
							right: cat.right,
							leftAvg,
							rightAvg
						}),
						cat.id === "identity" && fSubtype && /* @__PURE__ */ jsxs("div", {
							className: "viz-subtype",
							children: [/* @__PURE__ */ jsx("p", {
								className: "viz-subtype-label",
								children: F_SUBTYPE_CONFIG.name
							}), /* @__PURE__ */ jsx(SpectrumBar, {
								left: F_SUBTYPE_CONFIG.left,
								right: F_SUBTYPE_CONFIG.right,
								leftAvg: fSubtypeAverages.left,
								rightAvg: fSubtypeAverages.right
							})]
						})
					]
				}, cat.id);
			})
		})]
	});
}
//#endregion
//#region app/features/content/MarkdownPage.jsx
/**
* MarkdownPage - Template for rendering markdown content with annotations
* Features:
* - Three-panel layout: left nav (from H2s), center content, right annotations
* - Text selection and annotation creation
* - Yellow squiggly underline for annotated text
* - Annotation CRUD with localStorage persistence
* - Public edit suggestions
*/
var Activity = ({ type, prompt, context, pageId, activityId }) => {
	const [textValue, setTextValue] = useState("");
	const [fileValue, setFileValue] = useState(null);
	const saveTimeoutRef = useRef(null);
	const storageKey = `activity-${pageId}-${activityId}`;
	useEffect(() => {
		const metadataStr = localStorage.getItem(storageKey);
		if (metadataStr) try {
			const metadata = JSON.parse(metadataStr);
			localFileStorage.get(storageKey).then((content) => {
				if (content) if (type === "text") setTextValue(content);
				else setFileValue({
					...metadata,
					content
				});
				else if (metadata.content) setFileValue(metadata);
			});
		} catch (e) {
			if (type === "text") setTextValue(metadataStr);
		}
	}, [storageKey, type]);
	const handleTextChange = (e) => {
		const val = e.target.value;
		setTextValue(val);
		if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
		saveTimeoutRef.current = setTimeout(() => {
			localStorage.setItem(storageKey, JSON.stringify({ type: "text" }));
			localFileStorage.save(storageKey, val);
		}, 1e3);
	};
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const content = event.target.result;
			const metadata = {
				name: file.name,
				type: file.type
			};
			localFileStorage.save(storageKey, content).then(() => {
				localStorage.setItem(storageKey, JSON.stringify(metadata));
				setFileValue({
					...metadata,
					content
				});
			});
		};
		reader.readAsDataURL(file);
	};
	const removeFile = () => {
		setFileValue(null);
		localStorage.removeItem(storageKey);
		localFileStorage.delete(storageKey);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "markdown-page__activity-card",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "markdown-page__activity-header",
				children: "activity"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "markdown-page__activity-prompt",
				children: prompt
			}),
			context && /* @__PURE__ */ jsx("div", {
				className: "markdown-page__activity-context",
				children: context
			}),
			type === "text" ? /* @__PURE__ */ jsx("textarea", {
				className: "markdown-page__activity-textarea",
				value: textValue,
				onChange: handleTextChange,
				placeholder: "Type your response here..."
			}) : /* @__PURE__ */ jsx("div", {
				className: "markdown-page__activity-file-zone",
				children: !fileValue ? /* @__PURE__ */ jsxs("label", {
					className: "markdown-page__activity-upload-btn",
					children: ["Upload Image or PDF", /* @__PURE__ */ jsx("input", {
						type: "file",
						accept: "image/*,.pdf",
						onChange: handleFileUpload,
						style: { display: "none" }
					})]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "markdown-page__activity-file-preview",
					children: [fileValue.type.startsWith("image/") ? /* @__PURE__ */ jsx("img", {
						src: fileValue.content,
						alt: "Uploaded preview"
					}) : /* @__PURE__ */ jsxs("button", {
						className: "markdown-page__activity-pdf-link",
						onClick: () => {
							window.open().document.write(`<iframe src="${fileValue.content}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
						},
						children: ["📄 View PDF: ", fileValue.name]
					}), /* @__PURE__ */ jsx("button", {
						className: "markdown-page__activity-delete-btn",
						onClick: removeFile,
						children: "Delete File"
					})]
				})
			})
		]
	});
};
var MarkdownPage = ({ content = "", pageId = "default-page", title = "Content", markdownComponents = {}, metadata }) => {
	const [annotations, setAnnotations] = useState([]);
	const [selectedText, setSelectedText] = useState("");
	const [selectedTextRange, setSelectedTextRange] = useState(null);
	const [showAnnotationInput, setShowAnnotationInput] = useState(false);
	const [annotationText, setAnnotationText] = useState("");
	const [headings, setHeadings] = useState([]);
	const [activeHeading, setActiveHeading] = useState("");
	const [editingAnnotationId, setEditingAnnotationId] = useState(null);
	const [focusedAnnotationId, setFocusedAnnotationId] = useState(null);
	const [annotationPositions, setAnnotationPositions] = useState({});
	const [annotationStackHeight, setAnnotationStackHeight] = useState(0);
	const [orphanedIds, setOrphanedIds] = useState(/* @__PURE__ */ new Set());
	const [showSuggestionModal, setShowSuggestionModal] = useState(false);
	const [suggestionData, setSuggestionData] = useState({
		annotationText: "",
		selectedText: "",
		creditName: "",
		creditLink: "",
		pageId,
		pagePath: `results/${pageId}.md`
	});
	const WORKER_URL = "https://hidden-thunder-0974.makingtechforus.workers.dev";
	const contentRef = useRef(null);
	const annotationRefsMap = useRef({});
	const annotationsRef = useRef(null);
	const annotationsListRef = useRef(null);
	const [annotationInputTop, setAnnotationInputTop] = useState(null);
	const [isMobile, setIsMobile] = useState(false);
	const [mobileModalPos, setMobileModalPos] = useState({
		top: 0,
		position: "above"
	});
	const annotationInputRef = useRef(null);
	const selectionRef = useRef({
		text: "",
		range: null,
		top: 0
	});
	const [inputVisible, setInputVisible] = useState(false);
	useEffect(() => {
		if (!metadata) return;
		if (metadata.title) document.title = `${metadata.title} | Tech for Us`;
		const updateMetaTag = (property, content, isProperty = true) => {
			if (!content) return;
			const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
			let el = document.querySelector(selector);
			if (!el) {
				el = document.createElement("meta");
				el.setAttribute(isProperty ? "property" : "name", property);
				document.head.appendChild(el);
			}
			el.setAttribute("content", content);
		};
		updateMetaTag("og:title", metadata.title);
		updateMetaTag("og:description", metadata.description);
		updateMetaTag("description", metadata.description, false);
		const imageUrl = metadata.ogImage?.startsWith("http") ? metadata.ogImage : window.location.origin + (metadata.ogImage || "/og-image-default.jpg");
		updateMetaTag("og:image", imageUrl);
		updateMetaTag("og:url", window.location.href);
		updateMetaTag("og:type", "article");
		let canonical = document.querySelector("link[rel=\"canonical\"]");
		if (!canonical) {
			canonical = document.createElement("link");
			canonical.setAttribute("rel", "canonical");
			document.head.appendChild(canonical);
		}
		canonical.setAttribute("href", window.location.href.split(/[?#]/)[0]);
		const structuredData = {
			"@context": "https://schema.org",
			"@type": metadata.publishedDate ? "Article" : "WebPage",
			"headline": metadata.title,
			"description": metadata.description,
			"image": imageUrl,
			"url": window.location.href,
			...metadata.publishedDate && {
				"datePublished": metadata.publishedDate,
				"dateModified": metadata.lastEditedDate || metadata.publishedDate
			},
			"publisher": {
				"@type": "Organization",
				"name": "Tech for Us",
				"logo": {
					"@type": "ImageObject",
					"url": `${window.location.origin}/logo.png`
				}
			}
		};
		let scriptTag = document.getElementById("json-ld-schema");
		if (!scriptTag) {
			scriptTag = document.createElement("script");
			scriptTag.id = "json-ld-schema";
			scriptTag.type = "application/ld+json";
			document.head.appendChild(scriptTag);
		}
		scriptTag.text = JSON.stringify(structuredData);
		return () => {
			document.title = "Tech for Us";
		};
	}, [metadata]);
	useEffect(() => {
		setAnnotations(annotationStorage.getPageAnnotations(pageId).sort((a, b) => (a.textPosition || 0) - (b.textPosition || 0)));
	}, [pageId]);
	useEffect(() => {
		setIsMobile(window.innerWidth < 850);
		const handleResize = () => setIsMobile(window.innerWidth < 850);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	useEffect(() => {
		const headings = [];
		content.split("\n").forEach((line, index) => {
			if (line.startsWith("## ")) {
				const text = line.replace(/^## /, "").trim();
				const id = `heading-${index}`;
				headings.push({
					id,
					text,
					lineIndex: index
				});
			}
		});
		setHeadings(headings);
	}, [content]);
	useEffect(() => {
		let timeoutId;
		const handleMouseUp = () => {
			const selection = window.getSelection();
			const selected = selection.toString().trim();
			if (selected && contentRef.current) try {
				const range = selection.getRangeAt(0);
				if (contentRef.current.contains(range.commonAncestorContainer)) {
					const rect = range.getBoundingClientRect();
					const contentRect = contentRef.current.getBoundingClientRect();
					const relativeTop = rect.top - contentRect.top;
					selectionRef.current = {
						text: selected,
						range: range.cloneRange(),
						top: relativeTop
					};
					clearTimeout(timeoutId);
					timeoutId = setTimeout(() => {
						setSelectedText(selected);
						if (!inputVisible) {
							setAnnotationText("");
							setInputVisible(true);
							setFocusedAnnotationId(null);
						}
					}, 150);
				}
			} catch (e) {
				console.error("Selection error:", e);
			}
		};
		if (contentRef.current) {
			contentRef.current.addEventListener("mouseup", handleMouseUp);
			return () => {
				contentRef.current?.removeEventListener("mouseup", handleMouseUp);
				clearTimeout(timeoutId);
			};
		}
	}, [inputVisible]);
	useEffect(() => {
		const handleClickOutside = (event) => {
			const selection = window.getSelection();
			if (selection && !selection.isCollapsed && selection.toString().trim()) return;
			const isHighlight = event.target.closest(".markdown-page__annotated-text");
			const isAnnotationCard = event.target.closest(".markdown-page__annotation-card");
			const isInputModal = annotationInputRef.current?.contains(event.target);
			const isMobileModal = event.target.closest(".markdown-page__mobile-context-modal");
			if (!isHighlight && !isAnnotationCard && !isInputModal && !isMobileModal) {
				setFocusedAnnotationId(null);
				setEditingAnnotationId(null);
				if (inputVisible) {
					setInputVisible(false);
					setAnnotationText("");
					setSelectedText("");
					selectionRef.current = {
						text: "",
						range: null,
						top: 0
					};
				}
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [inputVisible]);
	useEffect(() => {
		if (!isMobile) return;
		let targetRect = null;
		if (inputVisible && selectionRef.current.range) targetRect = selectionRef.current.range.getBoundingClientRect();
		else if (focusedAnnotationId) {
			const el = document.querySelector(`.markdown-page__annotated-text[data-annotation-id="${focusedAnnotationId}"]`);
			if (el) targetRect = el.getBoundingClientRect();
		}
		if (targetRect) {
			const modalHeight = 180;
			const margin = 12;
			const viewportHeight = window.innerHeight;
			const spaceAbove = targetRect.top;
			const spaceBelow = viewportHeight - targetRect.bottom;
			let top;
			let pos = "above";
			if (spaceAbove > spaceBelow && spaceAbove > modalHeight + margin) {
				top = Math.max(margin, targetRect.top - modalHeight - margin);
				pos = "above";
			} else {
				top = Math.min(viewportHeight - modalHeight - margin, targetRect.bottom + margin);
				pos = "below";
			}
			setMobileModalPos({
				top,
				position: pos
			});
		}
	}, [
		isMobile,
		inputVisible,
		focusedAnnotationId,
		annotations
	]);
	useEffect(() => {
		const computePositions = () => {
			if (isMobile || !contentRef.current || !annotationsListRef.current) return;
			const contentRect = contentRef.current.getBoundingClientRect();
			const listRect = annotationsListRef.current.getBoundingClientRect();
			const listScrollTop = annotationsListRef.current.scrollTop;
			const spacing = 12;
			const items = annotations.map((a) => {
				const cardEl = annotationRefsMap.current[a.id];
				const highlightEl = contentRef.current?.querySelector(`.markdown-page__annotated-text[data-annotation-id="${a.id}"]`);
				let targetY;
				if (highlightEl) targetY = highlightEl.getBoundingClientRect().top - listRect.top + listScrollTop;
				else {
					let foundAnchor = false;
					if (a.nearHeading && contentRef.current) {
						const hEls = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
						const targetH = Array.from(hEls).find((h) => h.innerText.trim() === a.nearHeading);
						if (targetH) {
							targetY = targetH.getBoundingClientRect().top + (a.headingOffset || 0) - listRect.top + listScrollTop;
							foundAnchor = true;
						}
					}
					if (!foundAnchor) targetY = contentRect.top + (a.textPosition || 0) - listRect.top + listScrollTop;
				}
				return {
					id: a.id,
					type: "annotation",
					targetY,
					height: cardEl ? cardEl.getBoundingClientRect().height : 100,
					isFocused: a.id === focusedAnnotationId,
					isOrphaned: !highlightEl
				};
			});
			if (inputVisible && selectionRef.current.top) {
				const targetY = contentRect.top + selectionRef.current.top - listRect.top + listScrollTop - 8;
				const inputEl = annotationInputRef.current;
				items.push({
					id: "new-input",
					type: "input",
					targetY,
					height: inputEl ? inputEl.getBoundingClientRect().height : 160,
					isFocused: true
				});
			}
			if (items.length === 0) {
				setAnnotationPositions({});
				setAnnotationStackHeight(0);
				setAnnotationInputTop(null);
				return;
			}
			items.sort((a, b) => a.targetY - b.targetY);
			let anchorIndex = items.findIndex((item) => item.type === "input");
			if (anchorIndex === -1) anchorIndex = items.findIndex((item) => item.isFocused);
			const positioned = [...items];
			if (anchorIndex !== -1) {
				positioned[anchorIndex].top = positioned[anchorIndex].targetY;
				for (let i = anchorIndex - 1; i >= 0; i--) {
					const current = positioned[i];
					const maxTop = positioned[i + 1].top - current.height - spacing;
					current.top = Math.min(current.targetY, maxTop);
				}
				for (let i = anchorIndex + 1; i < positioned.length; i++) {
					const current = positioned[i];
					const above = positioned[i - 1];
					const minTop = above.top + above.height + spacing;
					current.top = Math.max(current.targetY, minTop);
				}
			} else {
				positioned[0].top = positioned[0].targetY;
				for (let i = 1; i < positioned.length; i++) {
					const current = positioned[i];
					const above = positioned[i - 1];
					const minTop = above.top + above.height + spacing;
					current.top = Math.max(current.targetY, minTop);
				}
			}
			const finalAnnotationPositions = {};
			const newOrphanedIds = /* @__PURE__ */ new Set();
			let finalInputTop = null;
			let totalStackHeight = 0;
			positioned.forEach((item) => {
				if (item.type === "annotation") {
					finalAnnotationPositions[item.id] = item.top;
					if (item.isOrphaned) newOrphanedIds.add(item.id);
				} else finalInputTop = item.top;
				totalStackHeight = Math.max(totalStackHeight, item.top + item.height + spacing);
			});
			setAnnotationPositions(finalAnnotationPositions);
			setOrphanedIds(newOrphanedIds);
			setAnnotationInputTop(finalInputTop);
			setAnnotationStackHeight(totalStackHeight);
		};
		computePositions();
		const ro = new ResizeObserver(() => computePositions());
		if (contentRef.current) ro.observe(contentRef.current);
		if (annotationsListRef.current) ro.observe(annotationsListRef.current);
		window.addEventListener("resize", computePositions);
		window.addEventListener("scroll", computePositions);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", computePositions);
			window.removeEventListener("scroll", computePositions);
		};
	}, [
		annotations,
		focusedAnnotationId,
		inputVisible,
		editingAnnotationId,
		selectedText,
		isMobile
	]);
	const getNearestHeading = () => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return null;
		const selectionRect = selection.getRangeAt(0).getBoundingClientRect();
		if (!contentRef.current) return null;
		const headingElements = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
		let nearestHeading = null;
		let maxTop = -Infinity;
		headingElements.forEach((el) => {
			const rect = el.getBoundingClientRect();
			if (rect.top < selectionRect.top && rect.top > maxTop) {
				maxTop = rect.top;
				nearestHeading = el;
			}
		});
		if (nearestHeading) return {
			text: nearestHeading.innerText.trim(),
			offset: selectionRect.top - nearestHeading.getBoundingClientRect().top
		};
		return null;
	};
	const handleCreateAnnotation = () => {
		if (!annotationText.trim() || !selectedText) return;
		const headingInfo = getNearestHeading();
		const newAnnotation = {
			id: `annotation-${Date.now()}`,
			text: annotationText,
			selectedText,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			textPosition: selectionRef.current.top || 0,
			nearHeading: headingInfo?.text || null,
			headingOffset: headingInfo?.offset || 0
		};
		setAnnotations([...annotations, newAnnotation].sort((a, b) => a.textPosition - b.textPosition));
		annotationStorage.saveAnnotation(pageId, newAnnotation);
		setAnnotationText("");
		setSelectedText("");
		setInputVisible(false);
		setSelectedTextRange(null);
		selectionRef.current = {
			text: "",
			range: null,
			top: 0
		};
		setFocusedAnnotationId(newAnnotation.id);
	};
	const handleUpdateAnnotation = (annotationId, newText) => {
		setAnnotations(annotations.map((a) => a.id === annotationId ? {
			...a,
			text: newText
		} : a).sort((a, b) => (a.textPosition || 0) - (b.textPosition || 0)));
		annotationStorage.updateAnnotation(pageId, annotationId, { text: newText });
		setEditingAnnotationId(null);
		setFocusedAnnotationId(annotationId);
	};
	const handleDeleteAnnotation = (annotationId) => {
		setAnnotations(annotations.filter((a) => a.id !== annotationId));
		annotationStorage.deleteAnnotation(pageId, annotationId);
		setFocusedAnnotationId(null);
	};
	const handleSuggestEdit = (annotation) => {
		setSuggestionData({
			annotationText: annotation.text || "",
			selectedText: annotation.selectedText || "",
			creditName: "",
			creditLink: "",
			pageId,
			pagePath: `results/${pageId}.md`
		});
		setShowSuggestionModal(true);
	};
	const submitSuggestion = async () => {
		try {
			const res = await fetch(WORKER_URL, {
				method: "POST",
				mode: "cors",
				credentials: "omit",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(suggestionData)
			});
			if (!res.ok) {
				const txt = await res.text();
				throw new Error(txt || "Worker error");
			}
			const json = await res.json();
			setShowSuggestionModal(false);
			alert(json.issueUrl ? `Suggestion submitted: ${json.issueUrl}` : "Suggestion submitted");
		} catch (err) {
			console.error("Suggestion submit error", err);
			alert("Failed to submit suggestion. Check console for details.");
		}
	};
	const renderHighlightedNode = (node, keyPrefix = "node") => {
		if (typeof node === "string") {
			let segments = [node];
			annotations.forEach((annotation) => {
				if (!annotation.selectedText) return;
				const nextSegments = [];
				segments.forEach((segment) => {
					if (typeof segment !== "string") {
						nextSegments.push(segment);
						return;
					}
					const parts = segment.split(annotation.selectedText);
					if (parts.length === 1) {
						nextSegments.push(segment);
						return;
					}
					parts.forEach((part, idx) => {
						if (part) nextSegments.push(part);
						if (idx < parts.length - 1) nextSegments.push(/* @__PURE__ */ jsx("span", {
							className: `markdown-page__annotated-text ${focusedAnnotationId === annotation.id ? "focused" : ""}`,
							"data-annotation-id": annotation.id,
							title: annotation.text,
							onClick: () => {
								const liveSelection = window.getSelection();
								if (liveSelection && !liveSelection.isCollapsed && liveSelection.toString().trim()) return;
								setFocusedAnnotationId(annotation.id);
								setInputVisible(false);
								if (!isMobile) document.querySelector(`[data-annotation-ref="${annotation.id}"]`)?.scrollIntoView({
									behavior: "smooth",
									block: "nearest"
								});
							},
							children: annotation.selectedText
						}, `${keyPrefix}-${annotation.id}-${idx}`));
					});
				});
				segments = nextSegments;
			});
			return segments;
		}
		if (Array.isArray(node)) return node.map((child, idx) => /* @__PURE__ */ jsx("span", { children: renderHighlightedNode(child, `${keyPrefix}-${idx}`) }, `${keyPrefix}-${idx}`));
		if (isValidElement(node)) return cloneElement(node, node.props, renderHighlightedNode(node.props.children, `${keyPrefix}-child`));
		return node;
	};
	const toTitleCaseString = (value) => {
		return value.toLowerCase().replace(/\b([a-z])/g, (match) => match.toUpperCase());
	};
	const toTitleCaseNode = (node) => {
		if (typeof node === "string") return toTitleCaseString(node);
		if (Array.isArray(node)) return node.map((child) => toTitleCaseNode(child));
		if (isValidElement(node)) return cloneElement(node, node.props, toTitleCaseNode(node.props.children));
		return node;
	};
	const handleHeadingClick = (headingId) => {
		setActiveHeading(headingId);
		const section = document.querySelector(`[data-heading-id="${headingId}"]`);
		if (section) section.scrollIntoView({ behavior: "smooth" });
	};
	const formatDate = (isoString) => {
		return new Date(isoString).toLocaleDateString(void 0, {
			month: "short",
			day: "numeric"
		});
	};
	const handleExportPageData = async () => {
		const backup = {
			localStorage: {},
			indexedDB: {}
		};
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key === `annotations-${pageId}` || key.startsWith(`activity-${pageId}-`)) backup.localStorage[key] = localStorage.getItem(key);
		}
		const activityKeys = Object.keys(backup.localStorage).filter((k) => k.startsWith(`activity-${pageId}-`));
		for (const key of activityKeys) {
			const content = await localFileStorage.get(key);
			if (content) backup.indexedDB[key] = content;
		}
		const blob = new Blob([JSON.stringify(backup)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `tech-for-us-${pageId}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
		link.click();
		URL.revokeObjectURL(url);
	};
	const handleImportPageData = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (e) => {
			const file = e.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = async (event) => {
					try {
						const backup = JSON.parse(event.target.result);
						if (backup.localStorage) Object.entries(backup.localStorage).forEach(([k, v]) => localStorage.setItem(k, v));
						if (backup.indexedDB) for (const [k, v] of Object.entries(backup.indexedDB)) await localFileStorage.save(k, v);
						alert("Page data imported successfully! The page will now reload.");
						window.location.reload();
					} catch (err) {
						console.error("Import error:", err);
						alert("Failed to import data. Ensure the file is a valid backup.");
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	};
	const defaultMarkdownComponents = {
		p: ({ children }) => {
			const childrenToText = (node) => {
				return (Array.isArray(node) ? node : [node]).map((child) => {
					if (typeof child === "string") return child;
					if (isValidElement(child)) return childrenToText(child.props.children);
					return "";
				}).join("");
			};
			const text = childrenToText(children).trim();
			if (text.startsWith("[[ ACTIVITY") && text.endsWith("]]")) {
				const parts = text.slice(11, -2).split("|").map((s) => s.trim());
				const props = {};
				parts.forEach((p) => {
					const [k, ...v] = p.split(":");
					if (k && v) props[k.trim()] = v.join(":").trim();
				});
				return /* @__PURE__ */ jsx(Activity, {
					type: props.type || "text",
					prompt: props.prompt,
					context: props.context,
					pageId,
					activityId: props.id || "default"
				});
			}
			return /* @__PURE__ */ jsx("p", { children: renderHighlightedNode(children, "p") });
		},
		li: ({ children }) => /* @__PURE__ */ jsx("li", { children: renderHighlightedNode(children, "li") }),
		h1: ({ children }) => /* @__PURE__ */ jsxs("div", {
			style: { marginBottom: "2rem" },
			children: [/* @__PURE__ */ jsx("h1", {
				style: { marginBottom: "0.5rem" },
				children: renderHighlightedNode(toTitleCaseNode(children), "h1")
			}), metadata && metadata.publishedDate && /* @__PURE__ */ jsxs("div", {
				style: {
					fontSize: "0.9rem",
					color: "var(--color-blue)",
					opacity: .8,
					fontFamily: "Inclusive Sans"
				},
				children: [new Date(metadata.publishedDate).toLocaleDateString(void 0, {
					year: "numeric",
					month: "long",
					day: "numeric"
				}), metadata.lastEditedDate && metadata.lastEditedDate !== metadata.publishedDate && /* @__PURE__ */ jsxs("span", {
					style: {
						marginLeft: "12px",
						paddingLeft: "12px",
						borderLeft: "1px solid currentColor"
					},
					children: ["Updated: ", new Date(metadata.lastEditedDate).toLocaleDateString(void 0, {
						year: "numeric",
						month: "long",
						day: "numeric"
					})]
				})]
			})]
		}),
		h2: ({ children }) => /* @__PURE__ */ jsx("h2", { children: renderHighlightedNode(children, "h2") }),
		h3: ({ children }) => /* @__PURE__ */ jsx("h3", { children: renderHighlightedNode(children, "h3") }),
		h4: ({ children }) => /* @__PURE__ */ jsx("h4", { children: renderHighlightedNode(children, "h4") }),
		h5: ({ children }) => /* @__PURE__ */ jsx("h5", { children: renderHighlightedNode(children, "h5") }),
		h6: ({ children }) => /* @__PURE__ */ jsx("h6", { children: renderHighlightedNode(children, "h6") })
	};
	const enhancedMarkdownComponents = Object.fromEntries(Object.entries(markdownComponents).map(([tag, renderer]) => {
		if (typeof renderer !== "function") return [tag, renderer];
		return [tag, (props) => renderer({
			...props,
			renderHighlightedNode,
			focusedAnnotationId
		})];
	}));
	return /* @__PURE__ */ jsxs("div", {
		className: "markdown-page",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "markdown-page__body",
				children: [
					/* @__PURE__ */ jsx("nav", {
						className: "markdown-page__nav",
						children: headings.map((heading) => /* @__PURE__ */ jsx("button", {
							className: `markdown-page__nav-item ${activeHeading === heading.id ? "active" : ""}`,
							onClick: () => handleHeadingClick(heading.id),
							"data-heading-id": heading.id,
							children: heading.text
						}, heading.id))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "markdown-page__content",
						ref: contentRef,
						children: /* @__PURE__ */ jsx(ReactMarkdown, {
							components: {
								...defaultMarkdownComponents,
								...enhancedMarkdownComponents
							},
							children: content
						})
					}),
					/* @__PURE__ */ jsxs("aside", {
						className: "markdown-page__annotations",
						ref: annotationsRef,
						style: isMobile ? { display: "none" } : {},
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "markdown-page__annotations-header",
								children: /* @__PURE__ */ jsx("h3", {
									className: "markdown-page__annotations-title",
									children: "Your Annotations"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "markdown-page__annotations-list",
								ref: annotationsListRef,
								children: [
									/* @__PURE__ */ jsx("div", { style: {
										height: `${annotationStackHeight}px`,
										pointerEvents: "none"
									} }),
									annotations.map((annotation) => /* @__PURE__ */ jsx("div", {
										ref: (el) => {
											if (el) annotationRefsMap.current[annotation.id] = el;
										},
										"data-annotation-ref": annotation.id,
										className: `markdown-page__annotation-card ${editingAnnotationId === annotation.id ? "editing" : ""} ${focusedAnnotationId === annotation.id ? "focused" : ""} ${orphanedIds.has(annotation.id) ? "orphaned" : ""}`,
										style: {
											top: annotationPositions[annotation.id] !== void 0 ? `${annotationPositions[annotation.id]}px` : void 0,
											transition: "top 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease, background-color 0.3s ease"
										},
										onClick: () => setFocusedAnnotationId(annotation.id),
										children: editingAnnotationId === annotation.id ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("textarea", {
											value: annotation.text,
											onChange: (e) => {
												setAnnotations(annotations.map((a) => a.id === annotation.id ? {
													...a,
													text: e.target.value
												} : a));
											},
											className: "markdown-page__annotation-text"
										}), /* @__PURE__ */ jsxs("div", {
											className: "markdown-page__annotation-actions",
											children: [/* @__PURE__ */ jsx("button", {
												className: "markdown-page__annotation-action",
												onClick: () => handleUpdateAnnotation(annotation.id, annotation.text),
												children: "Save"
											}), /* @__PURE__ */ jsx("button", {
												className: "markdown-page__annotation-action",
												onClick: () => setEditingAnnotationId(null),
												children: "Cancel"
											})]
										})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
											orphanedIds.has(annotation.id) && /* @__PURE__ */ jsxs("div", {
												style: {
													fontSize: "0.7rem",
													color: "#ff4444",
													fontWeight: "bold",
													marginBottom: "8px",
													display: "flex",
													alignItems: "center",
													gap: "4px"
												},
												children: [/* @__PURE__ */ jsx("span", { children: "⚠️" }), " CONTEXT MISSING (PAGE UPDATED)"]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "markdown-page__annotation-text",
												children: annotation.text
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "markdown-page__annotation-preview",
												children: [
													"\"",
													annotation.selectedText,
													"\""
												]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "markdown-page__annotation-date",
												children: formatDate(annotation.timestamp)
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "markdown-page__annotation-actions",
												children: [
													/* @__PURE__ */ jsx("button", {
														className: "markdown-page__annotation-action",
														onClick: (e) => {
															e.stopPropagation();
															handleSuggestEdit(annotation);
														},
														children: "Suggest Edit"
													}),
													/* @__PURE__ */ jsx("button", {
														className: "markdown-page__annotation-action",
														onClick: (e) => {
															e.stopPropagation();
															setEditingAnnotationId(annotation.id);
														},
														children: "Edit"
													}),
													/* @__PURE__ */ jsx("button", {
														className: "markdown-page__annotation-action",
														onClick: (e) => {
															e.stopPropagation();
															handleDeleteAnnotation(annotation.id);
														},
														children: "Delete"
													})
												]
											})
										] })
									}, annotation.id)),
									inputVisible && /* @__PURE__ */ jsxs("div", {
										ref: annotationInputRef,
										className: "markdown-page__annotation-input",
										style: {
											position: "absolute",
											left: "16px",
											right: "16px",
											top: annotationInputTop !== null ? `${annotationInputTop}px` : "0px",
											zIndex: 40,
											backgroundColor: "var(--color-blue)",
											boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
											transition: "top 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)"
										},
										children: [
											selectedText && /* @__PURE__ */ jsxs("div", {
												style: {
													fontSize: "0.85rem",
													color: "#666",
													marginBottom: "6px",
													fontStyle: "italic",
													maxHeight: "40px",
													overflow: "hidden",
													textOverflow: "ellipsis"
												},
												children: [
													"\"",
													selectedText,
													"\""
												]
											}),
											/* @__PURE__ */ jsx("textarea", {
												value: annotationText,
												onChange: (e) => setAnnotationText(e.target.value),
												placeholder: "Add your annotation...",
												onFocus: (e) => e.currentTarget.focus()
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "markdown-page__annotation-input-actions",
												children: [/* @__PURE__ */ jsx("button", {
													onClick: handleCreateAnnotation,
													disabled: !annotationText.trim(),
													children: "Add"
												}), /* @__PURE__ */ jsx("button", {
													onClick: () => {
														setInputVisible(false);
														setAnnotationText("");
														setSelectedText("");
														selectionRef.current = {
															text: "",
															range: null,
															top: 0
														};
													},
													children: "Cancel"
												})]
											})
										]
									})
								]
							}),
							showSuggestionModal && /* @__PURE__ */ jsx("div", {
								style: {
									position: "fixed",
									inset: 0,
									background: "rgba(0,0,0,0.4)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									zIndex: 9999
								},
								onClick: () => setShowSuggestionModal(false),
								children: /* @__PURE__ */ jsxs("div", {
									style: {
										background: "#fff",
										color: "#111",
										padding: 20,
										borderRadius: 8,
										width: "min(680px, 96%)",
										maxHeight: "80vh",
										overflow: "auto"
									},
									onClick: (e) => e.stopPropagation(),
									children: [
										/* @__PURE__ */ jsx("h3", {
											style: { marginTop: 0 },
											children: "Submit Suggestion"
										}),
										/* @__PURE__ */ jsxs("div", {
											style: { marginBottom: 8 },
											children: [/* @__PURE__ */ jsx("label", {
												style: {
													display: "block",
													fontSize: 12,
													color: "#666"
												},
												children: "Selected text"
											}), /* @__PURE__ */ jsx("div", {
												style: {
													background: "#f6f6f6",
													padding: 8,
													borderRadius: 4
												},
												children: suggestionData.selectedText
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: { marginBottom: 8 },
											children: [/* @__PURE__ */ jsx("label", {
												style: {
													display: "block",
													fontSize: 12,
													color: "#666"
												},
												children: "Your suggestion"
											}), /* @__PURE__ */ jsx("textarea", {
												value: suggestionData.annotationText,
												onChange: (e) => setSuggestionData({
													...suggestionData,
													annotationText: e.target.value
												}),
												rows: 6,
												style: {
													width: "100%",
													boxSizing: "border-box"
												}
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												gap: 8,
												marginBottom: 8
											},
											children: [/* @__PURE__ */ jsx("input", {
												placeholder: "Name (optional)",
												value: suggestionData.creditName,
												onChange: (e) => setSuggestionData({
													...suggestionData,
													creditName: e.target.value
												}),
												style: { flex: 1 }
											}), /* @__PURE__ */ jsx("input", {
												placeholder: "Link (optional)",
												value: suggestionData.creditLink,
												onChange: (e) => setSuggestionData({
													...suggestionData,
													creditLink: e.target.value
												}),
												style: { flex: 1 }
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "flex-end",
												gap: 8
											},
											children: [/* @__PURE__ */ jsx("button", {
												onClick: () => setShowSuggestionModal(false),
												children: "Cancel"
											}), /* @__PURE__ */ jsx("button", {
												onClick: submitSuggestion,
												disabled: !suggestionData.annotationText.trim(),
												style: {
													background: "var(--color-green)",
													color: "white",
													border: "none",
													padding: "8px 12px",
													borderRadius: 4
												},
												children: "Submit"
											})]
										})
									]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "8px",
									marginTop: "auto",
									paddingTop: "16px",
									borderTop: "1px solid rgba(255,255,255,0.2)"
								},
								children: [/* @__PURE__ */ jsx("button", {
									className: "markdown-page__annotation-action",
									onClick: handleExportPageData,
									style: { flex: 1 },
									children: "Export Page"
								}), /* @__PURE__ */ jsx("button", {
									className: "markdown-page__annotation-action",
									onClick: handleImportPageData,
									style: { flex: 1 },
									children: "Import Page"
								})]
							})
						]
					})
				]
			}),
			isMobile && (inputVisible || focusedAnnotationId) && /* @__PURE__ */ jsx("div", {
				className: "markdown-page__mobile-context-modal",
				style: {
					position: "fixed",
					top: `${mobileModalPos.top}px`,
					left: "50%",
					transform: "translateX(-50%)",
					width: "calc(100% - 32px)",
					maxWidth: "400px",
					zIndex: 1e3,
					backgroundColor: "var(--color-blue)",
					borderRadius: "12px",
					padding: "16px",
					boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
					border: "1px solid rgba(255,255,255,0.2)",
					color: "white"
				},
				children: inputVisible ? /* @__PURE__ */ jsxs("div", {
					className: "markdown-page__annotation-input mobile",
					children: [
						selectedText && /* @__PURE__ */ jsxs("div", {
							style: {
								fontSize: "0.85rem",
								color: "rgba(255,255,255,0.8)",
								marginBottom: "8px",
								fontStyle: "italic",
								maxHeight: "40px",
								overflow: "hidden"
							},
							children: [
								"\"",
								selectedText,
								"\""
							]
						}),
						/* @__PURE__ */ jsx("textarea", {
							value: annotationText,
							onChange: (e) => setAnnotationText(e.target.value),
							placeholder: "Add your annotation...",
							style: {
								width: "100%",
								minHeight: "80px",
								marginBottom: "8px",
								borderRadius: "4px",
								border: "none",
								padding: "8px",
								color: "#333"
							}
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "markdown-page__annotation-input-actions",
							style: {
								display: "flex",
								gap: "8px"
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: handleCreateAnnotation,
								style: {
									flex: 1,
									backgroundColor: "white",
									color: "var(--color-blue)",
									border: "none",
									borderRadius: "4px",
									padding: "8px",
									fontWeight: "bold"
								},
								children: "Add"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setInputVisible(false),
								style: {
									flex: 1,
									backgroundColor: "rgba(255,255,255,0.2)",
									color: "white",
									border: "none",
									borderRadius: "4px",
									padding: "8px"
								},
								children: "Cancel"
							})]
						})
					]
				}) : annotations.filter((a) => a.id === focusedAnnotationId).map((annotation) => /* @__PURE__ */ jsx("div", { children: editingAnnotationId === annotation.id ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("textarea", {
					value: annotation.text,
					onChange: (e) => {
						setAnnotations(annotations.map((a) => a.id === annotation.id ? {
							...a,
							text: e.target.value
						} : a));
					},
					style: {
						width: "100%",
						minHeight: "80px",
						marginBottom: "8px",
						borderRadius: "4px",
						border: "none",
						padding: "8px",
						color: "#333"
					}
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						gap: "8px"
					},
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => handleUpdateAnnotation(annotation.id, annotation.text),
						style: {
							flex: 1,
							backgroundColor: "white",
							color: "var(--color-blue)",
							border: "none",
							borderRadius: "4px",
							padding: "8px",
							fontWeight: "bold"
						},
						children: "Save"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setEditingAnnotationId(null),
						style: {
							flex: 1,
							backgroundColor: "rgba(255,255,255,0.2)",
							color: "white",
							border: "none",
							borderRadius: "4px",
							padding: "8px"
						},
						children: "Cancel"
					})]
				})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
					orphanedIds.has(annotation.id) && /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "0.7rem",
							color: "#ffaaaa",
							fontWeight: "bold",
							marginBottom: "6px"
						},
						children: "⚠️ Context Missing (Page Updated)"
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							marginBottom: "8px",
							fontWeight: "500",
							lineHeight: "1.4"
						},
						children: annotation.text
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: "0.8rem",
							opacity: .8,
							marginBottom: "12px",
							fontStyle: "italic"
						},
						children: [
							"\"",
							annotation.selectedText,
							"\""
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "6px",
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: () => setEditingAnnotationId(annotation.id),
								style: {
									backgroundColor: "white",
									color: "var(--color-blue)",
									border: "none",
									borderRadius: "4px",
									padding: "4px 12px",
									fontSize: "0.85rem"
								},
								children: "Edit"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => handleDeleteAnnotation(annotation.id),
								style: {
									backgroundColor: "rgba(255,255,255,0.2)",
									color: "white",
									border: "none",
									borderRadius: "4px",
									padding: "4px 12px",
									fontSize: "0.85rem"
								},
								children: "Delete"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => setFocusedAnnotationId(null),
								style: {
									marginLeft: "auto",
									background: "none",
									color: "white",
									border: "none",
									textDecoration: "underline",
									fontSize: "0.85rem"
								},
								children: "Close"
							})
						]
					})
				] }) }, annotation.id))
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
};
//#endregion
//#region app/features/quiz/Results.jsx
var Results_exports = /* @__PURE__ */ __exportAll({ default: () => Results_default });
var F_SUBTYPE_LABELS = {
	Ft: "Tracked",
	Fp: "Polished"
};
var Results_default = UNSAFE_withComponentProps(function Results() {
	const navigate = useNavigate();
	const [result, setResult] = useState(null);
	const [markdown, setMarkdown] = useState("");
	const [resultFileId, setResultFileId] = useState("default-page");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const stored = loadResult();
		if (!stored) {
			navigate("/quiz");
			return;
		}
		setResult(stored);
		const filename = stored.fSubtype ? stored.code.replace("F", stored.fSubtype) : stored.code;
		setResultFileId(filename);
		const resultsPath = `/results/${filename}.md`;
		fetch(resultsPath).then((res) => {
			if (!res.ok) throw new Error(`No result file found for type ${stored.code}`);
			return res.text();
		}).then((text) => {
			setMarkdown(text);
			setLoading(false);
		}).catch((err) => {
			setError(err.message);
			setLoading(false);
		});
	}, [navigate]);
	const handleResetQuiz = () => {
		clearResult();
		navigate("/quiz");
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "results-loading",
		children: "Loading your results..."
	});
	if (error) return /* @__PURE__ */ jsx("div", {
		className: "results-error",
		children: error
	});
	return /* @__PURE__ */ jsx(MarkdownPage, {
		content: `${`Your type: ${result.code}${result.fSubtype ? ` - Identity: ${F_SUBTYPE_LABELS[result.fSubtype]}` : ""}`}\n\n${markdown}${markdown.includes("[[MORE_TECH_TYPES_BUTTONS]]") ? "" : `\n\n## More about technology types\n\n[[MORE_TECH_TYPES_BUTTONS]]\n`}`,
		pageId: `results-${resultFileId}`,
		markdownComponents: {
			ul: ({ children }) => /* @__PURE__ */ jsx("ul", {
				style: {
					padding: "4px",
					backgroundColor: "var(--color-yellow)",
					display: "inline-block"
				},
				children
			}),
			p: ({ children, renderHighlightedNode }) => {
				const childrenToText = (node) => {
					return (Array.isArray(node) ? node : [node]).map((child) => {
						if (typeof child === "string") return child;
						if (isValidElement(child)) return childrenToText(child.props.children);
						return "";
					}).join("");
				};
				const text = childrenToText(children).trim();
				const hasResultBarsToken = /\[\[\s*RESULT_BARS\s*\]\]/i.test(text);
				const hasMoreButtonsToken = /\[\[\s*MORE_TECH_TYPES_BUTTONS\s*\]\]/i.test(text);
				if (hasResultBarsToken) return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ScoreVisualization, {
					scores: result.scores,
					fSubtype: result.fSubtype,
					showTitle: false
				}) });
				if (hasMoreButtonsToken) return /* @__PURE__ */ jsxs("div", {
					className: "markdown-page__resource-actions",
					children: [
						/* @__PURE__ */ jsx(Link$1, {
							to: "/technology-types",
							className: "markdown-page__resource-button",
							children: "View all technology types"
						}),
						/* @__PURE__ */ jsx(Link$1, {
							to: "/content/Categories",
							className: "markdown-page__resource-button",
							children: "Read what the categories mean"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: handleResetQuiz,
							className: "markdown-page__resource-button",
							children: "Reset quiz"
						})
					]
				});
				return /* @__PURE__ */ jsx("p", { children: renderHighlightedNode ? renderHighlightedNode(children, "p-results") : children });
			}
		}
	});
});
//#endregion
//#region app/features/quiz/TechnologyTypesPage.jsx
var TechnologyTypesPage_exports = /* @__PURE__ */ __exportAll({ default: () => TechnologyTypesPage_default });
var AXIS = {
	E: "energized",
	W: "weary",
	D: "desired",
	M: "mandatory",
	G: "genuine",
	Ft: "tracked",
	Fp: "polished",
	C: "connected",
	L: "lonely"
};
var MENTAL = ["E", "W"];
var SOCIAL = ["D", "M"];
var IDENTITY = [
	"G",
	"Ft",
	"Fp"
];
var CONNECTION = ["C", "L"];
var ALL_TYPES = MENTAL.flatMap((m) => SOCIAL.flatMap((s) => IDENTITY.flatMap((i) => CONNECTION.map((c) => ({
	code: `${m}${s}${i}${c}`,
	labels: [
		AXIS[m],
		AXIS[s],
		AXIS[i],
		AXIS[c]
	]
})))));
var TechnologyTypesPage_default = UNSAFE_withComponentProps(function TechnologyTypesPage() {
	const stored = loadResult();
	const highlightedCode = stored ? stored.fSubtype ? stored.code.replace("F", stored.fSubtype) : stored.code : null;
	const orderedTypes = [...ALL_TYPES].sort((a, b) => {
		if (a.code === highlightedCode) return -1;
		if (b.code === highlightedCode) return 1;
		return 0;
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "types-page",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "types-main",
				children: [
					/* @__PURE__ */ jsx("h1", {
						className: "types-title",
						children: "All Technology Types"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "types-subtitle",
						children: "Browse all cards and compare where your current result sits."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "types-grid",
						children: orderedTypes.map((type) => {
							return /* @__PURE__ */ jsxs("article", {
								className: `types-card ${highlightedCode === type.code ? "active" : ""}`,
								children: [
									/* @__PURE__ */ jsx("h2", { children: type.code }),
									/* @__PURE__ */ jsx("p", { children: type.labels.join(", ") }),
									/* @__PURE__ */ jsx(Link$1, {
										className: "types-link",
										to: `/content/${type.code}`,
										children: "View card"
									})
								]
							}, type.code);
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/components/activitiesData.js
/**
* Registry of all activities.
* Add a new entry here whenever you add a .md file to /public/activities/
*/
var activities = [
	{
		id: "mapping-your-network",
		title: "Mapping Your Network",
		publishedDate: "2024-05-15",
		lastEditedDate: "2024-05-15",
		description: "Visualize the different digital spaces you inhabit and who you meet there.",
		tags: ["Reflection", "Visual"],
		ogImage: "/activity-assets/mapping-your-network/og-image.jpg"
	},
	{
		id: "digital-boundaries-workshop",
		title: "Setting Digital Boundaries",
		publishedDate: "2024-04-20",
		lastEditedDate: "2024-05-01",
		description: "A step-by-step guide to reclaiming your time from addictive algorithms.",
		tags: ["Practical", "Advanced"],
		ogImage: "/activity-assets/digital-boundaries-workshop/og-image.jpg"
	},
	{
		id: "sample-guide",
		title: "Sample Activity Guide",
		publishedDate: "2023-10-27",
		lastEditedDate: "2023-10-27",
		description: "Learn how to use the interactive features of this site effectively.",
		tags: ["Introduction"],
		ogImage: "/activity-assets/sample-guide/og-image.jpg"
	}
];
//#endregion
//#region app/components/ActivitiesPage.jsx
var ActivitiesPage_exports = /* @__PURE__ */ __exportAll({ default: () => ActivitiesPage_default });
var ActivitiesPage_default = UNSAFE_withComponentProps(function ActivitiesPage() {
	const [selectedTag, setSelectedTag] = useState("All");
	const allTags = useMemo(() => {
		const tags = new Set(["All"]);
		activities.forEach((a) => a.tags?.forEach((t) => tags.add(t)));
		return Array.from(tags);
	}, []);
	const filteredActivities = useMemo(() => {
		return activities.filter((a) => selectedTag === "All" || a.tags?.includes(selectedTag)).sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
	}, [selectedTag]);
	return /* @__PURE__ */ jsxs("div", {
		className: "standard-page",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				style: {
					padding: "4rem 2rem",
					maxWidth: "1200px",
					margin: "0 auto",
					minHeight: "60vh"
				},
				children: [
					/* @__PURE__ */ jsx("h1", {
						style: { color: "var(--color-blue)" },
						children: "Activities"
					}),
					/* @__PURE__ */ jsx("p", {
						style: { marginBottom: "3rem" },
						children: "Explore our collection of workshops, reflections, and practical tools."
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							gap: "10px",
							flexWrap: "wrap",
							marginBottom: "3rem"
						},
						children: allTags.map((tag) => /* @__PURE__ */ jsx("button", {
							onClick: () => setSelectedTag(tag),
							style: {
								padding: "0.5rem 1.25rem",
								border: "2px solid var(--color-blue)",
								backgroundColor: selectedTag === tag ? "var(--color-blue)" : "transparent",
								color: selectedTag === tag ? "white" : "var(--color-blue)",
								cursor: "pointer",
								fontFamily: "Inclusive Sans",
								fontWeight: "bold",
								borderRadius: "4px",
								transition: "all 120ms ease"
							},
							children: tag
						}, tag))
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
							gap: "2rem"
						},
						children: filteredActivities.map((activity) => /* @__PURE__ */ jsxs(Link$1, {
							to: `/content/${activity.id}`,
							className: "activity-card",
							style: {
								display: "flex",
								flexDirection: "column",
								padding: "2rem",
								backgroundColor: "var(--color-white)",
								border: "4px solid var(--color-blue)",
								textDecoration: "none",
								color: "var(--color-blue)",
								boxShadow: "8px 8px 0px var(--color-blue)",
								transition: "transform 120ms ease, box-shadow 120ms ease"
							},
							children: [
								/* @__PURE__ */ jsxs("span", {
									style: {
										fontSize: "0.8rem",
										opacity: .7,
										marginBottom: "0.5rem"
									},
									children: [
										"Published: ",
										new Date(activity.publishedDate).toLocaleDateString(void 0, {
											year: "numeric",
											month: "long",
											day: "numeric"
										}),
										activity.lastEditedDate && activity.lastEditedDate !== activity.publishedDate && /* @__PURE__ */ jsxs("span", {
											style: { marginLeft: "10px" },
											children: ["Last Edited: ", new Date(activity.lastEditedDate).toLocaleDateString(void 0, {
												year: "numeric",
												month: "long",
												day: "numeric"
											})]
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: {
										fontFamily: "ApfelGrotezk",
										fontSize: "1.75rem",
										margin: "0 0 1rem 0",
										lineHeight: 1.1
									},
									children: activity.title
								}),
								/* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "1rem",
										flex: 1
									},
									children: activity.description
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										gap: "8px",
										marginTop: "1.5rem",
										flexWrap: "wrap"
									},
									children: activity.tags?.map((t) => /* @__PURE__ */ jsx("span", {
										style: {
											fontSize: "0.7rem",
											textTransform: "uppercase",
											letterSpacing: "0.05em",
											backgroundColor: "var(--color-pale-pink)",
											padding: "2px 8px",
											borderRadius: "4px"
										},
										children: t
									}, t))
								})
							]
						}, activity.id))
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/components/ActivitySetsPage.jsx
var ActivitySetsPage_exports = /* @__PURE__ */ __exportAll({ default: () => ActivitySetsPage_default });
var ActivitySetsPage_default = UNSAFE_withComponentProps(function ActivitySetsPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "standard-page",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				style: {
					padding: "4rem 2rem",
					maxWidth: "800px",
					margin: "0 auto",
					minHeight: "60vh"
				},
				children: [/* @__PURE__ */ jsx("h1", {
					style: { color: "var(--color-blue)" },
					children: "Activity Sets"
				}), /* @__PURE__ */ jsx("p", { children: "Curated sets of activities to help you dive deeper into specific themes." })]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/components/AlternativeSocialTechPage.jsx
var AlternativeSocialTechPage_exports = /* @__PURE__ */ __exportAll({ default: () => AlternativeSocialTechPage_default });
var AlternativeSocialTechPage_default = UNSAFE_withComponentProps(function AlternativeSocialTechPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "standard-page",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				style: {
					padding: "4rem 2rem",
					maxWidth: "1200px",
					margin: "0 auto",
					minHeight: "60vh"
				},
				children: [/* @__PURE__ */ jsx("h1", {
					style: { color: "var(--color-blue)" },
					children: "Alternative Social Tech Ideas"
				}), /* @__PURE__ */ jsx("p", { children: "A searchable grid of social technology alternatives from the community." })]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/components/ContributorsPage.jsx
var ContributorsPage_exports = /* @__PURE__ */ __exportAll({ default: () => ContributorsPage_default });
var ContributorsPage_default = UNSAFE_withComponentProps(function ContributorsPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "standard-page",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				style: {
					padding: "4rem 2rem",
					maxWidth: "800px",
					margin: "0 auto",
					minHeight: "60vh"
				},
				children: [/* @__PURE__ */ jsx("h1", {
					style: { color: "var(--color-blue)" },
					children: "Contributors"
				}), /* @__PURE__ */ jsx("p", { children: "Tech for Us is co-created by a diverse community of thinkers, builders, and users." })]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/App.jsx
function NotFoundPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "standard-page",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				style: {
					padding: "8rem 2rem",
					textAlign: "center",
					maxWidth: "800px",
					margin: "0 auto",
					minHeight: "60vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ jsx("h1", {
						style: {
							color: "var(--color-blue)",
							fontSize: "4rem",
							marginBottom: "1rem"
						},
						children: "404"
					}),
					/* @__PURE__ */ jsx("h2", {
						style: {
							fontFamily: "ApfelGrotezk",
							marginBottom: "2rem"
						},
						children: "This page doesn't exist yet."
					}),
					/* @__PURE__ */ jsx("p", {
						style: { marginBottom: "3rem" },
						children: "Maybe it's still being built, or the link has changed."
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "home-button",
						children: "Back to Safety"
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
function MarkdownPageLoader() {
	const { pageId } = useParams();
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(true);
	const [fileMetadata, setFileMetadata] = useState({});
	const [error, setError] = useState(null);
	const [storedResult, setStoredResult] = useState(null);
	useEffect(() => {
		setStoredResult(loadResult());
	}, []);
	const resultPageId = storedResult ? storedResult.fSubtype ? storedResult.code.replace("F", storedResult.fSubtype) : storedResult.code : null;
	useEffect(() => {
		const loadMarkdown = async () => {
			try {
				setLoading(true);
				setError(null);
				const paths = [
					`/results/${pageId}.md`,
					`/activities/${pageId}.md`,
					`/${pageId}.md`
				];
				let success = false;
				let text = "";
				for (const path of paths) try {
					const response = await fetch(path, { headers: { "Accept": "text/plain" } });
					if (response.ok) {
						text = await response.text();
						if (text && !text.trim().startsWith("<!DOCTYPE")) {
							success = true;
							break;
						}
					}
				} catch (e) {
					console.error(`Failed to fetch ${path}:`, e);
					continue;
				}
				if (!success) throw new Error(`Could not find markdown file for "${pageId}". Make sure ${pageId}.md exists in /public/results/ or /public/`);
				console.log("Loaded markdown content:", text.substring(0, 100));
				setContent(text);
				const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
				let cleanText = text;
				let extractedMetadata = {};
				if (match) {
					cleanText = text.replace(match[0], "").trim();
					match[1].split("\n").forEach((line) => {
						const separatorIndex = line.indexOf(":");
						if (separatorIndex !== -1) {
							const key = line.substring(0, separatorIndex).trim();
							const value = line.substring(separatorIndex + 1).trim();
							if (key && value) extractedMetadata[key] = value;
						}
					});
				}
				if (extractedMetadata["og-title"]) extractedMetadata.title = extractedMetadata["og-title"];
				if (extractedMetadata["og-description"]) extractedMetadata.description = extractedMetadata["og-description"];
				if (extractedMetadata["og-image"]) extractedMetadata.ogImage = extractedMetadata["og-image"];
				setFileMetadata(extractedMetadata);
				setContent(cleanText);
			} catch (err) {
				console.error("Markdown load error:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		loadMarkdown();
	}, [pageId]);
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			minHeight: "100vh",
			backgroundColor: "var(--color-pale-pink)",
			color: "var(--color-blue)",
			fontFamily: "Inclusive Sans, sans-serif",
			fontSize: "20px"
		},
		children: "Loading..."
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			minHeight: "100vh",
			backgroundColor: "var(--color-pale-pink)",
			color: "var(--color-blue)",
			fontFamily: "Inclusive Sans, sans-serif",
			fontSize: "20px"
		},
		children: ["Error: ", error]
	});
	const isTechnologyTypePage = /^[EW][DM](G|FT|FP)[CL]$/i.test(pageId);
	const hasMoreSection = /\[\[\s*MORE_TECH_TYPES_BUTTONS\s*\]\]/i.test(content);
	return /* @__PURE__ */ jsx(MarkdownPage, {
		content: isTechnologyTypePage && !hasMoreSection ? `${content}

## More about technology types

[[MORE_TECH_TYPES_BUTTONS]]
` : content,
		pageId,
		markdownComponents: { p: ({ children, renderHighlightedNode }) => {
			const childrenToText = (node) => {
				return (Array.isArray(node) ? node : [node]).map((child) => {
					if (typeof child === "string") return child;
					if (isValidElement(child)) return childrenToText(child.props.children);
					return "";
				}).join("");
			};
			const text = childrenToText(children).trim();
			const hasResultBarsToken = /\[\[\s*RESULT_BARS\s*\]\]/i.test(text);
			const hasMoreButtonsToken = /\[\[\s*MORE_TECH_TYPES_BUTTONS\s*\]\]/i.test(text);
			if (hasResultBarsToken) {
				if (!!storedResult && !!resultPageId && pageId.toUpperCase() === resultPageId.toUpperCase()) return /* @__PURE__ */ jsx(ScoreVisualization, {
					scores: storedResult.scores,
					fSubtype: storedResult.fSubtype,
					showTitle: false
				});
				return null;
			}
			if (hasMoreButtonsToken) return /* @__PURE__ */ jsxs("div", {
				className: "markdown-page__resource-actions",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/technology-types",
						className: "markdown-page__resource-button",
						children: "View all technology types"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/content/Categories",
						className: "markdown-page__resource-button",
						children: "Read what the categories mean"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: storedResult ? "/quiz/results" : "/quiz",
						className: "markdown-page__resource-button",
						children: "View your result"
					})
				]
			});
			return /* @__PURE__ */ jsx("p", { children: renderHighlightedNode ? renderHighlightedNode(children, "p-content") : children });
		} },
		metadata: (() => {
			const registryMatch = activities.find((a) => a.id === pageId);
			const readableTitle = pageId.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
			return {
				id: pageId,
				title: isTechnologyTypePage ? `Technology Type: ${pageId.toUpperCase()}` : readableTitle,
				description: isTechnologyTypePage ? `Discover the characteristics and traits of the ${pageId.toUpperCase()} technology personality.` : "Explore interactive content and reflections on our relationship with technology.",
				ogImage: "/og-image-default.jpg",
				isFallback: true,
				...registryMatch,
				...fileMetadata
			};
		})()
	});
}
//#endregion
//#region app/routes/ContentPage.jsx
var ContentPage_exports = /* @__PURE__ */ __exportAll({ default: () => ContentPage_default });
var ContentPage_default = UNSAFE_withComponentProps(function ContentPageRoute() {
	return /* @__PURE__ */ jsx(MarkdownPageLoader, {});
});
//#endregion
//#region app/routes/NotFoundPage.jsx
var NotFoundPage_exports = /* @__PURE__ */ __exportAll({ default: () => NotFoundPage_default });
var NotFoundPage_default = UNSAFE_withComponentProps(function NotFoundPageRoute() {
	return /* @__PURE__ */ jsx(NotFoundPage, {});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-JCooHCd7.js",
		"imports": ["/assets/jsx-runtime-CMjxtiEt.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-RZQL5Bg0.js",
			"imports": ["/assets/jsx-runtime-CMjxtiEt.js"],
			"css": ["/assets/root-Bdlnny9R.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"features/home/HomePage": {
			"id": "features/home/HomePage",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/HomePage-D-1plM7E.js",
			"imports": [
				"/assets/HomePage-B0RAx0m6.js",
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/Footer-BlaCuUtF.js"
			],
			"css": ["/assets/HomePage-70OR2PUC.css", "/assets/Footer-B9bAK1iH.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"components/YourContentPage": {
			"id": "components/YourContentPage",
			"parentId": "root",
			"path": "your-content",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/YourContentPage-Xjh913xm.js",
			"imports": [
				"/assets/YourContentPage-BUXpWd-T.js",
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/Footer-BlaCuUtF.js",
				"/assets/annotationStorage-DQx2n2k4.js"
			],
			"css": ["/assets/Footer-B9bAK1iH.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"features/quiz/Quiz": {
			"id": "features/quiz/Quiz",
			"parentId": "root",
			"path": "quiz",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/Quiz-mUnhl38z.js",
			"imports": [
				"/assets/Quiz-uA60DiYm.js",
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/Footer-BlaCuUtF.js",
				"/assets/questions-CoY3XuON.js"
			],
			"css": ["/assets/Quiz-BYPZ9hme.css", "/assets/Footer-B9bAK1iH.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"features/quiz/Results": {
			"id": "features/quiz/Results",
			"parentId": "root",
			"path": "quiz/results",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/Results-DXpw9lZW.js",
			"imports": [
				"/assets/Results-DC2rTyWk.js",
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/Footer-BlaCuUtF.js",
				"/assets/annotationStorage-DQx2n2k4.js",
				"/assets/questions-CoY3XuON.js"
			],
			"css": ["/assets/Results-6BxPi0UY.css", "/assets/Footer-B9bAK1iH.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"features/quiz/TechnologyTypesPage": {
			"id": "features/quiz/TechnologyTypesPage",
			"parentId": "root",
			"path": "technology-types",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/TechnologyTypesPage-DOazNg9O.js",
			"imports": [
				"/assets/TechnologyTypesPage-BIvxKok2.js",
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/Footer-BlaCuUtF.js"
			],
			"css": ["/assets/TechnologyTypesPage-jeEItKQy.css", "/assets/Footer-B9bAK1iH.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"components/ActivitiesPage": {
			"id": "components/ActivitiesPage",
			"parentId": "root",
			"path": "activities",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/ActivitiesPage-C9IN4x6V.js",
			"imports": [
				"/assets/ActivitiesPage-CFA7po5c.js",
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/Footer-BlaCuUtF.js"
			],
			"css": ["/assets/Footer-B9bAK1iH.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"components/ActivitySetsPage": {
			"id": "components/ActivitySetsPage",
			"parentId": "root",
			"path": "activity-sets",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/ActivitySetsPage-Ca9CHYcO.js",
			"imports": [
				"/assets/ActivitySetsPage-DS8wipA5.js",
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/Footer-BlaCuUtF.js"
			],
			"css": ["/assets/Footer-B9bAK1iH.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"components/AlternativeSocialTechPage": {
			"id": "components/AlternativeSocialTechPage",
			"parentId": "root",
			"path": "alternative-social-tech",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/AlternativeSocialTechPage-B0bab3ja.js",
			"imports": [
				"/assets/AlternativeSocialTechPage-DOEe-Gwb.js",
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/Footer-BlaCuUtF.js"
			],
			"css": ["/assets/Footer-B9bAK1iH.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"components/ContributorsPage": {
			"id": "components/ContributorsPage",
			"parentId": "root",
			"path": "contributors",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/ContributorsPage-BkncYTPH.js",
			"imports": [
				"/assets/ContributorsPage-DN3f4z9c.js",
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/Footer-BlaCuUtF.js"
			],
			"css": ["/assets/Footer-B9bAK1iH.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/ContentPage": {
			"id": "routes/ContentPage",
			"parentId": "root",
			"path": "content/:pageId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/ContentPage-JAs4l1Ed.js",
			"imports": [
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/App-D5I6i9xw.js",
				"/assets/Quiz-uA60DiYm.js",
				"/assets/ActivitiesPage-CFA7po5c.js",
				"/assets/ActivitySetsPage-DS8wipA5.js",
				"/assets/AlternativeSocialTechPage-DOEe-Gwb.js",
				"/assets/ContributorsPage-DN3f4z9c.js",
				"/assets/Footer-BlaCuUtF.js",
				"/assets/YourContentPage-BUXpWd-T.js",
				"/assets/Results-DC2rTyWk.js",
				"/assets/HomePage-B0RAx0m6.js",
				"/assets/TechnologyTypesPage-BIvxKok2.js",
				"/assets/questions-CoY3XuON.js",
				"/assets/annotationStorage-DQx2n2k4.js"
			],
			"css": [
				"/assets/Quiz-BYPZ9hme.css",
				"/assets/Footer-B9bAK1iH.css",
				"/assets/Results-6BxPi0UY.css",
				"/assets/HomePage-70OR2PUC.css",
				"/assets/TechnologyTypesPage-jeEItKQy.css"
			],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/NotFoundPage": {
			"id": "routes/NotFoundPage",
			"parentId": "root",
			"path": "*",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/NotFoundPage-DnEsthSF.js",
			"imports": [
				"/assets/jsx-runtime-CMjxtiEt.js",
				"/assets/App-D5I6i9xw.js",
				"/assets/Quiz-uA60DiYm.js",
				"/assets/ActivitiesPage-CFA7po5c.js",
				"/assets/ActivitySetsPage-DS8wipA5.js",
				"/assets/AlternativeSocialTechPage-DOEe-Gwb.js",
				"/assets/ContributorsPage-DN3f4z9c.js",
				"/assets/Footer-BlaCuUtF.js",
				"/assets/YourContentPage-BUXpWd-T.js",
				"/assets/Results-DC2rTyWk.js",
				"/assets/HomePage-B0RAx0m6.js",
				"/assets/TechnologyTypesPage-BIvxKok2.js",
				"/assets/questions-CoY3XuON.js",
				"/assets/annotationStorage-DQx2n2k4.js"
			],
			"css": [
				"/assets/Quiz-BYPZ9hme.css",
				"/assets/Footer-B9bAK1iH.css",
				"/assets/Results-6BxPi0UY.css",
				"/assets/HomePage-70OR2PUC.css",
				"/assets/TechnologyTypesPage-jeEItKQy.css"
			],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-b3f923aa.js",
	"version": "b3f923aa",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"unstable_passThroughRequests": false,
	"unstable_subResourceIntegrity": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [
	"/",
	"/your-content",
	"/quiz",
	"/quiz/results",
	"/technology-types",
	"/activities",
	"/activity-sets",
	"/alternative-social-tech",
	"/contributors",
	"/content/Categories",
	"/content/Manifesto",
	"/content/Privacy",
	"/content/contenttowrite",
	"/content/sample-guide",
	"/content/EDFpC",
	"/content/EDFpL",
	"/content/EDFtC",
	"/content/EDFtL",
	"/content/EDGC",
	"/content/EDGL",
	"/content/EMFpC",
	"/content/EMFpL",
	"/content/EMFtC",
	"/content/EMFtL",
	"/content/EMGC",
	"/content/EMGL",
	"/content/WDFpC",
	"/content/WDFpL",
	"/content/WDFtC",
	"/content/WDFtL",
	"/content/WDGC",
	"/content/WDGL",
	"/content/WMFpC",
	"/content/WMFpL",
	"/content/WMFtC",
	"/content/WMFtL",
	"/content/WMGC",
	"/content/WMGL"
];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"features/home/HomePage": {
		id: "features/home/HomePage",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: HomePage_exports
	},
	"components/YourContentPage": {
		id: "components/YourContentPage",
		parentId: "root",
		path: "your-content",
		index: void 0,
		caseSensitive: void 0,
		module: YourContentPage_exports
	},
	"features/quiz/Quiz": {
		id: "features/quiz/Quiz",
		parentId: "root",
		path: "quiz",
		index: void 0,
		caseSensitive: void 0,
		module: Quiz_exports
	},
	"features/quiz/Results": {
		id: "features/quiz/Results",
		parentId: "root",
		path: "quiz/results",
		index: void 0,
		caseSensitive: void 0,
		module: Results_exports
	},
	"features/quiz/TechnologyTypesPage": {
		id: "features/quiz/TechnologyTypesPage",
		parentId: "root",
		path: "technology-types",
		index: void 0,
		caseSensitive: void 0,
		module: TechnologyTypesPage_exports
	},
	"components/ActivitiesPage": {
		id: "components/ActivitiesPage",
		parentId: "root",
		path: "activities",
		index: void 0,
		caseSensitive: void 0,
		module: ActivitiesPage_exports
	},
	"components/ActivitySetsPage": {
		id: "components/ActivitySetsPage",
		parentId: "root",
		path: "activity-sets",
		index: void 0,
		caseSensitive: void 0,
		module: ActivitySetsPage_exports
	},
	"components/AlternativeSocialTechPage": {
		id: "components/AlternativeSocialTechPage",
		parentId: "root",
		path: "alternative-social-tech",
		index: void 0,
		caseSensitive: void 0,
		module: AlternativeSocialTechPage_exports
	},
	"components/ContributorsPage": {
		id: "components/ContributorsPage",
		parentId: "root",
		path: "contributors",
		index: void 0,
		caseSensitive: void 0,
		module: ContributorsPage_exports
	},
	"routes/ContentPage": {
		id: "routes/ContentPage",
		parentId: "root",
		path: "content/:pageId",
		index: void 0,
		caseSensitive: void 0,
		module: ContentPage_exports
	},
	"routes/NotFoundPage": {
		id: "routes/NotFoundPage",
		parentId: "root",
		path: "*",
		index: void 0,
		caseSensitive: void 0,
		module: NotFoundPage_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
