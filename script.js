const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
});

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const revealItems = Array.from(document.querySelectorAll(".reveal"));
revealItems.forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 520)}ms`);
});

const header = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const progressBar = document.querySelector(".scroll-progress-bar");
const backToTopBtn = document.querySelector(".back-to-top");
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setActiveLink(entry.target.id);
    }
  });
}, {
  threshold: 0.55,
});

observedSections.forEach((section) => sectionObserver.observe(section));

const toggleHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const updateScrollProgress = () => {
  if (!progressBar) return;
  const doc = document.documentElement;
  const total = doc.scrollHeight - doc.clientHeight;
  const ratio = total > 0 ? (window.scrollY / total) * 100 : 0;
  progressBar.style.width = `${Math.min(Math.max(ratio, 0), 100)}%`;
};

const toggleBackToTop = () => {
  if (!backToTopBtn) return;
  backToTopBtn.classList.toggle("is-visible", window.scrollY > 420);
};

let isTicking = false;
const onScroll = () => {
  if (isTicking) return;
  isTicking = true;
  window.requestAnimationFrame(() => {
    toggleHeaderState();
    updateScrollProgress();
    toggleBackToTop();
    isTicking = false;
  });
};

window.addEventListener("scroll", onScroll, { passive: true });
toggleHeaderState();
updateScrollProgress();
toggleBackToTop();

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (observedSections[0]) {
  setActiveLink(observedSections[0].id);
}
