/* ============================================================
   МАРКИЗЕТТА — интерактив лендинга
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  const PHONE = "+79902836903";
  const TG_USER = "GUESTHOUSEMARKIZETTA";
  const EMAIL = "markizetta9@gmail.com";

  /* ---------- Sticky header ---------- */
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = $("[data-burger]");
  const mobileMenu = $("[data-mobile-menu]");

  function openMenu() {
    mobileMenu.hidden = false;
    requestAnimationFrame(() => mobileMenu.classList.add("is-open"));
    document.body.classList.add("menu-open", "no-scroll");
    burger.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open", "no-scroll");
    burger.setAttribute("aria-expanded", "false");
    setTimeout(() => { mobileMenu.hidden = true; }, 300);
  }
  burger.addEventListener("click", () => {
    document.body.classList.contains("menu-open") ? closeMenu() : openMenu();
  });
  $$("[data-mm-link]").forEach((a) =>
    a.addEventListener("click", () => closeMenu())
  );

  /* ---------- Booking modal ---------- */
  const modal = $("[data-modal]");
  const form = $("[data-booking-form]");
  const roomSelect = $("#bf-room");

  function openModal(room) {
    if (room && roomSelect) {
      const opt = [...roomSelect.options].find((o) => o.value === room);
      if (opt) roomSelect.value = room;
    }
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    if (document.body.classList.contains("menu-open")) closeMenu();
    setTimeout(() => $("#bf-name")?.focus(), 60);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  $$("[data-open-booking]").forEach((btn) =>
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-room")))
  );
  $$("[data-modal-close]").forEach((el) =>
    el.addEventListener("click", closeModal)
  );

  /* ---------- Booking form -> Telegram / email ---------- */
  function buildMessage(data) {
    const lines = [
      "Заявка на бронирование — гостевой дом МАРКИЗЕТТА",
      "",
      `Имя: ${data.name}`,
      `Телефон: ${data.phone}`,
      `Категория: ${data.room}`,
    ];
    if (data.checkin) lines.push(`Заезд: ${data.checkin}`);
    if (data.checkout) lines.push(`Выезд: ${data.checkout}`);
    if (data.guests) lines.push(`Гостей: ${data.guests}`);
    if (data.comment) lines.push(`Комментарий: ${data.comment}`);
    return lines.join("\n");
  }

  let sendMode = "telegram";
  $$("[data-send]").forEach((b) =>
    b.addEventListener("click", () => { sendMode = b.getAttribute("data-send"); })
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    const nameEl = $("#bf-name");
    const phoneEl = $("#bf-phone");
    const errEl = $("[data-form-error]");
    let ok = true;
    [nameEl, phoneEl].forEach((el) => {
      const bad = !el.value.trim();
      el.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    errEl.hidden = ok;
    if (!ok) return;

    const msg = buildMessage(data);

    if (sendMode === "email") {
      const subject = encodeURIComponent("Заявка на бронирование — МАРКИЗЕТТА");
      const body = encodeURIComponent(msg);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      showToast("Открываем почту…");
    } else {
      // Telegram: copy the prefilled message, then open the chat
      copyText(msg).then((copied) => {
        showToast(copied
          ? "Заявка скопирована — вставьте её в чат Telegram"
          : "Открываем Telegram…");
      });
      window.open(`https://t.me/${TG_USER}`, "_blank", "noopener");
    }
  });

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
    }
    return Promise.resolve(false);
  }

  /* ---------- Toast ---------- */
  const toast = $("[data-toast]");
  let toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("is-show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-show");
      setTimeout(() => { toast.hidden = true; }, 350);
    }, 3200);
  }

  /* ---------- Lightbox gallery (page gallery + per-room galleries) ---------- */
  const lb = $("[data-lightbox-modal]");
  const lbImg = $("[data-lightbox-img]");
  const lbCaption = $("[data-lightbox-caption]");
  const triggers = $$("[data-lightbox]");
  const pageSources = triggers.map((t) => ({
    src: t.getAttribute("data-lightbox"),
    alt: t.querySelector("img")?.alt || "",
  }));
  let lbSet = pageSources;
  let lbTitle = "";
  let lbIndex = 0;

  function renderLightbox() {
    const item = lbSet[lbIndex];
    if (!item) return;
    lbImg.src = item.src;
    lbImg.alt = item.alt || lbTitle;
    if (lbCaption) {
      lbCaption.textContent = lbTitle
        ? `${lbTitle} — ${lbIndex + 1} / ${lbSet.length}`
        : `${lbIndex + 1} / ${lbSet.length}`;
    }
  }
  function openLightbox(i) {
    lbIndex = (i + lbSet.length) % lbSet.length;
    renderLightbox();
    lb.hidden = false;
    document.body.classList.add("no-scroll");
  }
  function openLightboxSet(arr, title, i) {
    lbSet = arr;
    lbTitle = title || "";
    openLightbox(i || 0);
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.classList.remove("no-scroll");
  }
  triggers.forEach((t, i) =>
    t.addEventListener("click", () => { lbSet = pageSources; lbTitle = ""; openLightbox(i); })
  );
  $("[data-lightbox-close]").addEventListener("click", closeLightbox);
  $("[data-lightbox-prev]").addEventListener("click", () => openLightbox(lbIndex - 1));
  $("[data-lightbox-next]").addEventListener("click", () => openLightbox(lbIndex + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });

  /* ---------- Per-room photo galleries ---------- */
  $$("[data-room-gallery]").forEach((el) =>
    el.addEventListener("click", () => {
      const arr = el.getAttribute("data-room-gallery").split(",").map((src) => ({ src: src.trim(), alt: el.getAttribute("data-room-title") || "" }));
      openLightboxSet(arr, el.getAttribute("data-room-title"), 0);
    })
  );

  /* ---------- Esc / keyboard ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!lb.hidden) closeLightbox();
      else if (!modal.hidden) closeModal();
      else if (document.body.classList.contains("menu-open")) closeMenu();
    }
    if (!lb.hidden) {
      if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
      if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
    }
  });

  /* ---------- Scroll-reveal ---------- */
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("revealed"); io.unobserve(en.target); }
      }),
      { threshold: 0.12 }
    );
    $$(".section-head, .why-item, .why__media, .room-card, .fac-card, .gallery__item, .contact-card").forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  // expose for tweaks app if needed
  window.MARKIZETTA = { openModal, showToast };
})();
