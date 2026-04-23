// TYPEWRITER EFFECT
const textElement = document.getElementById("typewriter-text");
const phrases = ["Logiciel", "Back-End PHP", "Front-End JS", "Fullstack"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentPhrase = phrases[phraseIndex];
  if (isDeleting) {
    textElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    textElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    setTimeout(() => (isDeleting = true), 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  const speed = isDeleting ? 50 : 150;
  setTimeout(type, speed);
}
document.addEventListener("DOMContentLoaded", type);

async function openProjectModal(repo) {
  document.getElementById("modal-title").innerText = repo.name.replace(
    /[-_]/g,
    " ",
  );
  const modalDesc = document.getElementById("modal-desc");
  const codeLink = document.getElementById("modal-link-code");
  const liveLink = document.getElementById("modal-link-live");

  codeLink.href = repo.html_url;
  if (repo.homepage) {
    liveLink.href = repo.homepage;
    liveLink.classList.remove("hidden");
  } else {
    liveLink.classList.add("hidden");
  }

  // Afficher le loader Skeleton dans la modale
  modalDesc.innerHTML = `
        <div class="animate-pulse space-y-3">
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            <div class="h-32 bg-slate-200 dark:bg-slate-700 rounded w-full mt-4"></div>
        </div>
    `;

  document.getElementById("project-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Empêcher le scroll derrière

  // Récupérer le README depuis GitHub (Raw content)
  try {
    // Essayer la branche main, puis master si échec
    let readmeUrl = `https://raw.githubusercontent.com/${githubUsername}/${repo.name}/${repo.default_branch}/README.md`;
    const response = await fetch(readmeUrl);

    if (response.ok) {
      const text = await response.text();
      // Convertir Markdown en HTML via marked.js
      modalDesc.innerHTML = marked.parse(text);
    } else {
      throw new Error("Readme introuvable");
    }
  } catch (e) {
    // Fallback sur la description courte si pas de README
    modalDesc.innerHTML = `<p>${repo.description || "Aucune description détaillée disponible pour ce projet."}</p>`;
  }
}

function closeProjectModal() {
  document.getElementById("project-modal").classList.add("hidden");
  document.body.style.overflow = "auto"; // Rétablir le scroll
}

// SKELETON LOADERS HTML
function getSkeletonHTML() {
  return `
    <div class="animate-pulse bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl p-6 h-full flex flex-col">
        <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-6"></div>
        <div class="mt-auto flex gap-2">
            <div class="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
    </div>`;
}

// --- 0. DARK MODE TOGGLE ---
var themeToggleBtn = document.getElementById("theme-toggle");
var darkIcon = document.getElementById("theme-toggle-dark-icon");
var lightIcon = document.getElementById("theme-toggle-light-icon");

if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  lightIcon.classList.remove("hidden");
} else {
  darkIcon.classList.remove("hidden");
}

themeToggleBtn.addEventListener("click", function () {
  darkIcon.classList.toggle("hidden");
  lightIcon.classList.toggle("hidden");

  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

// --- 1. MENU MOBILE (DRAWER) ---
function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-overlay");

  if (menu.classList.contains("translate-x-full")) {
    menu.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
    setTimeout(() => overlay.classList.remove("opacity-0"), 10);
  } else {
    menu.classList.add("translate-x-full");
    overlay.classList.add("opacity-0");
    setTimeout(() => overlay.classList.add("hidden"), 300);
  }
}

// --- 2. GESTION DES PDFS ---
function openPdf(pdfUrl) {
  const modal = document.getElementById("pdf-modal");
  const frame = document.getElementById("pdf-frame");
  const downloadBtn = document.getElementById("modal-download-btn");

  frame.src = pdfUrl;
  downloadBtn.href = pdfUrl; // Mise à jour du lien de téléchargement

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePdf() {
  const modal = document.getElementById("pdf-modal");
  const frame = document.getElementById("pdf-frame");
  modal.classList.add("hidden");
  frame.src = "";
  document.body.style.overflow = "auto";
}

// --- 3. SCROLL REVEAL & BACK TO TOP & SPY ---
const revealElements = document.querySelectorAll(".reveal");
const backToTopBtn = document.getElementById("back-to-top");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (elementTop < windowHeight - 100) el.classList.add("active");
  });

  if (window.scrollY > 300) {
    backToTopBtn.classList.remove("translate-y-20", "opacity-0");
  } else {
    backToTopBtn.classList.add("translate-y-20", "opacity-0");
  }

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 200) current = section.getAttribute("id");
  });

  navLinks.forEach((link) => {
    link.classList.remove("text-brand-blue", "bg-blue-50", "dark:bg-slate-800");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("text-brand-blue", "bg-blue-50", "dark:bg-slate-800");
    }
  });
});

// --- 4. GITHUB API ---
const githubUsername = "GOLBIN-Dorian"; // <-- REMPLACE ICI
const container = document.getElementById("projects-container");
const profileLink = document.getElementById("github-profile-link");
profileLink.href = `https://github.com/${githubUsername}`;

// Injecter squelettes
container.innerHTML = getSkeletonHTML().repeat(3);

const getLanguageColor = (lang) => {
  const colors = {
    Python:
      "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800",
    PHP: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800",
    JavaScript:
      "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-100 dark:border-yellow-800",
    HTML: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 border-orange-100 dark:border-orange-800",
    CSS: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 border-sky-100 dark:border-sky-800",
    Vue: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800",
  };
  return (
    colors[lang] ||
    "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 border-slate-100 dark:border-slate-600"
  );
};

fetch(
  `https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc`,
)
  .then((response) => response.json())
  .then((data) => {
    container.innerHTML = ""; // Enlever squelettes
    if (data.message === "Not Found") return;

    const myRepos = data
      .filter((repo) => !repo.fork && repo.name !== "GOLBIN-Dorian")
      .slice(0, 7);
    if (myRepos.length === 0) return;

    myRepos.forEach((repo) => {
      const card = document.createElement("div");
      card.className =
        "flex flex-col bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer group";
      card.onclick = () => openProjectModal(repo); // Click ouvre la modale

      const langClass = getLanguageColor(repo.language);
      const langBadge = repo.language
        ? `<span class="${langClass} tech-badge">${repo.language}</span>`
        : "";

      card.innerHTML = `
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="font-bold text-lg text-brand-dark dark:text-white truncate pr-2 group-hover:text-brand-blue">${repo.name.replace(/[-_]/g, " ")}</h3>
                        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </div>
                    <p class="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-1 line-clamp-3">${repo.description || "Projet scolaire disponible sur GitHub."}</p>
                    <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                        ${langBadge}
                        <div class="flex items-center text-xs text-slate-400 dark:text-slate-500">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                            ${repo.stargazers_count}
                        </div>
                    </div>
                </div>`;
      container.appendChild(card);
    });
  });

// --- 5. GESTION DES FLUX RSS ---
const feedContainer = document.getElementById("rss-feed-container");
// Injecter squelettes RSS
feedContainer.innerHTML = `
    <div class="animate-pulse space-y-4">
        <div class="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        <div class="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        <div class="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
    </div>`;

const rssUrls = [
  "https://news.humancoders.com/feed",
  "https://www.cert.ssi.gouv.fr/feed/",
  "https://www.developpez.com/index/rss",
];

const getRecentDate = (d) => {
  const x = new Date();
  x.setDate(x.getDate() - d);
  return x;
};

const backupData = [
  {
    title: "Optimisation SQL : Les bonnes pratiques",
    link: "https://sql.developpez.com/",
    pubDate: getRecentDate(0),
    sourceName: "Developpez.com",
  },
  {
    title: "Alerte de sécurité critique sur les serveurs web",
    link: "https://www.cert.ssi.gouv.fr/",
    pubDate: getRecentDate(0),
    sourceName: "CERT-FR",
  },
  {
    title: "Nouveautés de PHP 8.4 pour les développeurs",
    link: "https://news.humancoders.com/",
    pubDate: getRecentDate(1),
    sourceName: "Human Coders",
  },
  {
    title: "Architecture logicielle : Le pattern MVC expliqué",
    link: "https://www.developpez.com/",
    pubDate: getRecentDate(1),
    sourceName: "Developpez.com",
  },
  {
    title: "Sécuriser une API REST avec JWT",
    link: "https://news.humancoders.com/",
    pubDate: getRecentDate(2),
    sourceName: "Human Coders",
  },
  {
    title: "Rapport sur les menaces rançongiciels en France",
    link: "https://www.cert.ssi.gouv.fr/",
    pubDate: getRecentDate(2),
    sourceName: "CERT-FR",
  },
];

const fetchFeed = (url) =>
  fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`,
  ).then((res) => (res.ok ? res.json() : null));

async function loadRSS() {
  try {
    const responses = await Promise.all(
      rssUrls.map((url) => fetchFeed(url).catch(() => null)),
    );
    let allItems = [];
    let hasRealData = false;

    const itemsBySource = responses.map((data, index) => {
      let name = "Tech";
      if (index === 0) name = "Human Coders";
      if (index === 1) name = "CERT-FR";
      if (index === 2) name = "Developpez.com";
      if (data && data.status === "ok" && data.items) hasRealData = true;
      return { name, items: data && data.items ? data.items : [] };
    });

    if (!hasRealData) throw new Error();

    let count = 0,
      i = 0,
      activeSources = itemsBySource.length;
    const seen = new Set();

    while (count < 9 && activeSources > 0) {
      activeSources = 0;
      for (let s = 0; s < itemsBySource.length; s++) {
        const src = itemsBySource[s];
        if (i < src.items.length) {
          activeSources++;
          const item = src.items[i];
          if (
            !item.title.toLowerCase().includes("python") &&
            !seen.has(item.title)
          ) {
            seen.add(item.title);
            allItems.push({
              ...item,
              pubDate: new Date(item.pubDate),
              sourceName: src.name,
            });
            count++;
            if (count >= 9) break;
          }
        }
      }
      if (count >= 9) break;
      i++;
    }
    renderFeed(allItems);
  } catch (e) {
    renderFeed(backupData);
  }
}

function renderFeed(items) {
  feedContainer.innerHTML = "";
  items.forEach((item) => {
    const dateStr = item.pubDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
    let color =
      "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300";
    if (item.sourceName === "CERT-FR")
      color = "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    if (item.sourceName === "Human Coders")
      color =
        "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    if (item.sourceName === "Developpez.com")
      color =
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";

    feedContainer.innerHTML += `
            <a href="${item.link}" target="_blank" class="block p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition group">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h4 class="text-sm font-semibold text-brand-dark dark:text-white group-hover:text-brand-blue dark:group-hover:text-brand-blue line-clamp-2 leading-snug">${item.title}</h4>
                        <div class="flex items-center mt-2 space-x-2">
                            <span class="text-[10px] ${color} px-1.5 py-0.5 rounded border border-transparent opacity-80">${item.sourceName}</span>
                            <span class="text-xs text-slate-400 dark:text-slate-500">${dateStr}</span>
                        </div>
                    </div>
                    <svg class="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-brand-blue dark:group-hover:text-brand-blue mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </a>`;
  });
}
loadRSS();
