(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* nav */
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");

  const progressBar = document.querySelector(".scroll-progress span");
  let scrollFrame = 0;

  const updateNav = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 18);

    if (progressBar) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      progressBar.style.setProperty("--scroll-progress", progress.toFixed(4));
    }
  };

  const requestScrollUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      updateNav();
      scrollFrame = 0;
    });
  };

  updateNav();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /* hero typing */
  const typingTarget = document.querySelector(".typing-target");
  if (typingTarget && !reduceMotion) {
    const phrase = typingTarget.textContent.trim();
    typingTarget.textContent = "";
    let i = 0;
    const type = () => {
      typingTarget.textContent = phrase.slice(0, i);
      i += 1;
      if (i <= phrase.length) window.setTimeout(type, 35);
    };
    window.setTimeout(type, 350);
  }

  /* reveal on scroll */
  document.querySelectorAll(".section").forEach((section) => {
    const items = [...section.querySelectorAll(".reveal")];
    items.forEach((item, index) => {
      const delay = Math.min(index, 7) * 55;
      item.style.setProperty("--reveal-delay", delay + "ms");
    });
  });

  const heroReveals = [...document.querySelectorAll(".hero .reveal")];
  heroReveals.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", index * 90 + "ms");
  });

  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* project filters */
  const filters = document.querySelectorAll(".filter");
  const projects = [...document.querySelectorAll(".project-card")];
  const visibleCount = document.getElementById("visible-count");

  const applyFilter = (value) => {
    const shown = [];

    projects.forEach((card) => {
      const categories = (card.dataset.category || "").split(/\s+/);
      const show = value === "all" || categories.includes(value);
      card.classList.toggle("filtered-out", !show);
      if (show) shown.push(card);
    });

    if (!reduceMotion) {
      shown.forEach((card, index) => {
        const animation = card.animate(
          [
            { opacity: 0, transform: "translateY(12px) scale(.988)" },
            { opacity: 1, transform: "translateY(0) scale(1)" }
          ],
          {
            duration: 380,
            delay: Math.min(index, 8) * 38,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "both"
          }
        );
        animation.addEventListener("finish", () => animation.cancel(), { once: true });
      });
    }

    if (visibleCount) visibleCount.textContent = String(shown.length);
  };

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      applyFilter(button.dataset.filter || "all");
    });
  });

  /* pointer depth + spotlight */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const spotlightSurfaces = [
      ...document.querySelectorAll(".project-card, .stack-card, .proof-card, .about-shell")
    ];

    spotlightSurfaces.forEach((surface) => {
      surface.addEventListener("pointermove", (event) => {
        const rect = surface.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        surface.style.setProperty("--spot-x", x.toFixed(1) + "%");
        surface.style.setProperty("--spot-y", y.toFixed(1) + "%");
      });
    });

    projects.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          "perspective(1000px) rotateX(" + (-py * 1.8).toFixed(2) + "deg) rotateY(" + (px * 1.8).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* active nav section */
  const sectionIds = ["about", "projects", "journey", "stack", "contact"];
  const sectionLinks = new Map(
    [...navLinks]
      .map((link) => [link.getAttribute("href")?.replace("#", ""), link])
      .filter(([id]) => sectionIds.includes(id))
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          sectionLinks.forEach((link, id) => {
            link.classList.toggle("active", id === entry.target.id);
          });
        });
      },
      { threshold: 0.28, rootMargin: "-18% 0px -52% 0px" }
    );
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* three.js network */
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || reduceMotion) return;

  const bootThree = () => {
    if (typeof THREE === "undefined") return;

    const hero = canvas.parentElement;
    if (!hero) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 1, 2000);
    camera.position.z = 430;

    const isSmall = window.innerWidth < 760;
    const count = isSmall ? 32 : 58;
    const pointsArray = new Float32Array(count * 3);
    const nodes = [];

    for (let i = 0; i < count; i += 1) {
      const x = (Math.random() - 0.5) * 980;
      const y = (Math.random() - 0.5) * 560;
      const z = (Math.random() - 0.5) * 460;
      nodes.push({
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.18,
          (Math.random() - 0.5) * 0.18,
          (Math.random() - 0.5) * 0.12
        )
      });
      pointsArray[i * 3] = x;
      pointsArray[i * 3 + 1] = y;
      pointsArray[i * 3 + 2] = z;
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(pointsArray, 3));
    const pointMat = new THREE.PointsMaterial({
      color: 0x59f28d,
      size: isSmall ? 2.6 : 3.1,
      transparent: true,
      opacity: 0.72
    });
    const pointMesh = new THREE.Points(pointGeo, pointMat);
    scene.add(pointMesh);

    const maxLines = count * 7;
    const lineArray = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(lineArray, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4b7bb8,
      transparent: true,
      opacity: 0.16
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const bounds = { x: 500, y: 290, z: 240 };
    const linkDistance = isSmall ? 150 : 175;
    let raf = 0;

    const resize = () => {
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const updateLinks = () => {
      let linkIndex = 0;
      for (let a = 0; a < nodes.length && linkIndex < maxLines; a += 1) {
        for (let b = a + 1; b < nodes.length && linkIndex < maxLines; b += 1) {
          if (nodes[a].pos.distanceTo(nodes[b].pos) > linkDistance) continue;
          const base = linkIndex * 6;
          lineArray[base] = nodes[a].pos.x;
          lineArray[base + 1] = nodes[a].pos.y;
          lineArray[base + 2] = nodes[a].pos.z;
          lineArray[base + 3] = nodes[b].pos.x;
          lineArray[base + 4] = nodes[b].pos.y;
          lineArray[base + 5] = nodes[b].pos.z;
          linkIndex += 1;
        }
      }
      lineGeo.setDrawRange(0, linkIndex * 2);
      lineGeo.attributes.position.needsUpdate = true;
    };

    const tick = () => {
      nodes.forEach((node, i) => {
        node.pos.add(node.vel);
        if (Math.abs(node.pos.x) > bounds.x) node.vel.x *= -1;
        if (Math.abs(node.pos.y) > bounds.y) node.vel.y *= -1;
        if (Math.abs(node.pos.z) > bounds.z) node.vel.z *= -1;
        pointsArray[i * 3] = node.pos.x;
        pointsArray[i * 3 + 1] = node.pos.y;
        pointsArray[i * 3 + 2] = node.pos.z;
      });

      pointGeo.attributes.position.needsUpdate = true;
      updateLinks();
      scene.rotation.y += 0.00045;
      scene.rotation.x = Math.sin(Date.now() * 0.00008) * 0.015;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        tick();
      }
    });
  };

  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  script.async = true;
  script.onload = bootThree;
  document.head.appendChild(script);
})();
