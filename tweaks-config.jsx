/* ============================================================
   МАРКИЗЕТТА — панель Tweaks (v2 · editorial)
   Управляет акцентом, тёмной/светлой панелью номеров,
   фоновым ghost-словом и формой углов.
   ============================================================ */
const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#c0603a",
  "rooms": "dark",
  "ghost": true,
  "rounded": true
}/*EDITMODE-END*/;

const ACCENT_MAP = {
  "#c0603a": "terracotta",
  "#a8643f": "clay",
  "#2f7d86": "sea",
  "#2c2823": "charcoal",
};

function applyTweaks(t) {
  const root = document.documentElement;
  root.setAttribute("data-accent", ACCENT_MAP[t.accent] || "terracotta");
  root.setAttribute("data-rooms", t.rooms);

  // ghost background wordmark
  const ghost = document.querySelector(".hero__ghost");
  if (ghost) ghost.style.display = t.ghost ? "" : "none";

  // corner radius
  if (t.rounded) {
    root.style.removeProperty("--r");
    root.style.removeProperty("--r-sm");
    root.style.removeProperty("--r-lg");
  } else {
    root.style.setProperty("--r", "6px");
    root.style.setProperty("--r-sm", "4px");
    root.style.setProperty("--r-lg", "10px");
  }
}

// light rooms panel variant
const lightRoomsCSS = `
html[data-rooms="light"] .rooms__panel{ background:var(--surface); color:var(--ink); border:1px solid var(--line); }
html[data-rooms="light"] .rooms__head .display{ color:var(--ink); }
html[data-rooms="light"] .rooms__head .accent-word{ color:var(--accent); }
html[data-rooms="light"] .rooms__intro{ color:var(--ink-soft); }
html[data-rooms="light"] .rooms__viewall{ color:var(--ink); }
html[data-rooms="light"] .rooms__nav .arrow-btn{ border-color:var(--line); color:var(--ink); }
html[data-rooms="light"] .rooms__nav .arrow-btn:hover{ background:var(--accent); color:#fff; border-color:var(--accent); }
html[data-rooms="light"] .room-card{ background:var(--card); color:var(--ink); border:1px solid var(--line); box-shadow:var(--shadow-soft); }
html[data-rooms="light"] .room-card__media{ background:repeating-linear-gradient(45deg, var(--bone) 0 14px, var(--bone-2) 14px 28px); }
html[data-rooms="light"] .room-card__ph{ color:var(--ink-mute); background:rgba(255,255,255,.7); }
html[data-rooms="light"] .room-card__name{ color:var(--ink); }
html[data-rooms="light"] .room-card__meta{ color:var(--ink-soft); }
html[data-rooms="light"] .room-card__desc{ color:var(--ink-soft); }
html[data-rooms="light"] .room-card__foot{ border-top-color:var(--line); }
html[data-rooms="light"] .rooms__panel > p{ color:var(--ink-mute) !important; }
`;
const styleTag = document.createElement("style");
styleTag.textContent = lightRoomsCSS;
document.head.appendChild(styleTag);

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Оформление" />
      <TweakColor
        label="Акцентный цвет"
        value={t.accent}
        options={["#c0603a", "#a8643f", "#2f7d86", "#2c2823"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakToggle label="Скруглённые углы" value={t.rounded} onChange={(v) => setTweak("rounded", v)} />

      <TweakSection label="Блок номеров" />
      <TweakRadio
        label="Панель"
        value={t.rooms}
        options={[
          { value: "dark", label: "Тёмная" },
          { value: "light", label: "Светлая" },
        ]}
        onChange={(v) => setTweak("rooms", v)}
      />

      <TweakSection label="Главный экран" />
      <TweakToggle label="Фоновое слово (ghost)" value={t.ghost} onChange={(v) => setTweak("ghost", v)} />
    </TweaksPanel>
  );
}

applyTweaks(TWEAK_DEFAULTS);
ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<App />);
