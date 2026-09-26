import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, ExternalLink, Link2, Maximize2, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import studioWall from "@/assets/studio-wall.jpg";

const BOT_URL = "https://t.me/apiringbot";
const SITE_URL = "https://www.plunderandriffle.com/";
const MAX_ITEMS = 24;

type Creation = { id: string; url: string; size: "standard" | "wide"; status: "loading" | "loaded" | "failed" };

function decodeNested(value: string) {
  let current = value.trim();
  for (let i = 0; i < 4; i++) {
    try {
      const next = decodeURIComponent(current);
      if (next === current) break;
      current = next;
    } catch { break; }
  }
  return current;
}

function normalizeUrl(value: string) {
  const decoded = decodeNested(value).trim();
  try {
    const url = new URL(decoded);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.href;
  } catch { return null; }
}

function parseUrls(raw: string) {
  // Split before decoding, since encoded URLs may contain encoded commas in their own query strings.
  return raw.split(/[\n,]+/).map(normalizeUrl).filter((url): url is string => Boolean(url)).slice(0, MAX_ITEMS);
}

function readInitialUrls() {
  if (typeof window === "undefined") return [];
  const params = new URLSearchParams(window.location.search);
  const values = params.getAll("u");
  return values.flatMap(parseUrls).slice(0, MAX_ITEMS);
}

function makeCreation(url: string, index: number): Creation {
  return { id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`, url, size: index === 0 ? "wide" : "standard", status: "loading" };
}

function getLabel(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch { return "CREATION"; }
}

function getName(url: string, index: number) {
  try {
    const parsed = new URL(url);
    const last = parsed.pathname.split("/").filter(Boolean).pop();
    return last ? decodeNested(last).replace(/[-_]/g, " ").slice(0, 48) : `Creation ${String(index + 1).padStart(2, "0")}`;
  } catch { return `Creation ${String(index + 1).padStart(2, "0")}`; }
}

export function WallExperience() {
  const [items, setItems] = useState<Creation[]>([]);
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urls = readInitialUrls();
    setItems(urls.map(makeCreation));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("u");
    if (items.length) url.searchParams.set("u", items.map(item => item.url).join(","));
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, [items, ready]);

  const count = items.length;
  const loaded = useMemo(() => items.filter(item => item.status === "loaded").length, [items]);

  function submitUrls() {
    const urls = parseUrls(input);
    if (!urls.length) { setError("Enter at least one valid http or https URL."); return; }
    if (editingId) {
      setItems(current => current.map(item => item.id === editingId ? { ...item, url: urls[0], status: "loading" } : item));
    } else {
      setItems(current => [...current, ...urls.slice(0, MAX_ITEMS - current.length).map((url, i) => makeCreation(url, current.length + i))]);
    }
    setInput(""); setError(""); setEditing(false); setEditingId(null);
  }

  function openEdit(item?: Creation) {
    setInput(item?.url ?? ""); setEditingId(item?.id ?? null); setError(""); setEditing(true);
  }

  function setStatus(id: string, status: Creation["status"]) {
    setItems(current => current.map(item => item.id === id ? { ...item, status } : item));
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true); window.setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  }

  return (
    <div className="wall-site">
      <header className="site-nav">
        <div className="nav-inner">
          <a className="brand" href="#top" aria-label="Plunder and Riffle home"><span className="brand-mark">P<span>/</span>R</span><span className="brand-name">PLUNDER <em>&</em> RIFFLE</span></a>
          <nav className="nav-links" aria-label="Main navigation"><a href="#wall">THE WALL</a><a href="#how-it-works">HOW IT WORKS</a></nav>
          <Button asChild variant="wallNav"><a href={BOT_URL} target="_blank" rel="noopener noreferrer">MAKE YOUR OWN <ArrowUpRight /></a></Button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero-image" src={studioWall} width={1536} height={1024} alt="Experimental creative studio collage with light radiating into media fragments" />
          <div className="hero-shade" />
          <div className="hero-content page-container">
            <div className="hero-topline"><span className="signal-dot" /> PLUNDER & RIFFLE PRESENTS <span className="topline-rule" /> 001 / THE WALL</div>
            <h1 id="hero-title">THE INTERNET<br />IS YOUR <span>CANVAS.</span></h1>
            <p className="hero-lede">One thought. Infinite ways to make it spread.</p>
            <p className="hero-subcopy">Memes. Videos. Stories. Music. Characters. In any language.<br className="desktop-break" /> Made with the Plunder & Riffle Meme Engine.</p>
            <div className="hero-actions">
              <Button asChild variant="wallPrimary" size="wallLarge"><a href={BOT_URL} target="_blank" rel="noopener noreferrer">MAKE YOUR OWN <ArrowUpRight /></a></Button>
              <Button asChild variant="wallOutline" size="wallLarge"><a href="#wall">EXPLORE THE WALL <ArrowDown /></a></Button>
            </div>
          </div>
          <div className="hero-bottom page-container"><span>IDEAS DON'T STAY STILL.</span><span>SCROLL TO EXPLORE <ArrowDown size={14} /></span></div>
        </section>

        <section id="wall" className="gallery-section page-container" aria-labelledby="wall-title">
          <div className="section-kicker"><span className="signal-dot" /> THE SHOWCASE <span className="kicker-line" /> 01 / CREATIONS</div>
          <div className="section-heading-row"><div><h2 id="wall-title">THE WALL<span className="heading-period">.</span></h2><p>Made to be seen. Made to be shared.</p></div><div className="live-count"><span className="signal-dot" /> {count} {count === 1 ? "CREATION" : "CREATIONS"} <span className="loaded-count">/ {loaded} LOADED</span></div></div>
          <div className="wall-tools"><span>THE COLLECTION / {String(count).padStart(2, "0")}</span><div className="tool-actions"><Button variant="wallTool" size="sm" onClick={() => openEdit()} title="Add creations"><Plus /> <span>ADD</span></Button><Button variant="wallTool" size="sm" onClick={copyLink} title="Copy wall link">{copied ? <Check /> : <Copy />} <span>{copied ? "COPIED" : "COPY LINK"}</span></Button></div></div>
          {count ? <div className="creation-grid">{items.map((item, index) => <article className={`creation-card ${item.size === "wide" ? "creation-wide" : ""}`} key={item.id}>
            <div className="card-top"><span className="card-index">{String(index + 1).padStart(2, "0")} <span className="card-slash">/</span> {getLabel(item.url)}</span><span className="card-live"><span className="signal-dot" /> {item.status === "loaded" ? "LIVE" : item.status === "failed" ? "PREVIEW UNAVAILABLE" : "CONNECTING"}</span></div>
            <div className="preview-wrap">
              <iframe key={item.url} src={item.url} title={`Preview of ${getName(item.url, index)}`} loading={index < 2 ? "eager" : "lazy"} referrerPolicy="no-referrer" onLoad={() => setStatus(item.id, "loaded")} onError={() => setStatus(item.id, "failed")} />
              {item.status === "failed" && <div className="preview-fallback"><Link2 size={30} /><p>This creation can't be previewed here.</p><a href={item.url} target="_blank" rel="noopener noreferrer">OPEN CREATION <ArrowUpRight size={15} /></a></div>}
            </div>
            <div className="card-bottom"><div className="card-title"><span>CREATION {String(index + 1).padStart(2, "0")}</span><strong>{getName(item.url, index)}</strong></div><div className="card-controls"><Button variant="wallIcon" size="icon" onClick={() => openEdit(item)} title="Edit URL" aria-label={`Edit creation ${index + 1}`}><Link2 /></Button><Button variant="wallIcon" size="icon" onClick={() => setItems(current => current.map(entry => entry.id === item.id ? { ...entry, size: entry.size === "wide" ? "standard" : "wide" } : entry))} title="Resize preview" aria-label={`Resize creation ${index + 1}`}><Maximize2 /></Button><Button variant="wallIcon" size="icon" onClick={() => setItems(current => current.filter(entry => entry.id !== item.id))} title="Remove creation" aria-label={`Remove creation ${index + 1}`}><X /></Button><Button asChild variant="wallIcon" size="icon" title="Open original creation"><a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Open creation ${index + 1} in a new tab`}><ExternalLink /></a></Button></div></div>
          </article>)}</div> : <div className="empty-wall"><div className="empty-symbol"><Plus size={42} strokeWidth={1} /></div><span className="empty-eyebrow">YOUR WALL STARTS HERE</span><h3>EVERYTHING STARTS<br />WITH ONE IDEA.</h3><p>Add a creation URL to build your wall. Live pages appear right here.</p><Button variant="wallPrimary" size="wallLarge" onClick={() => openEdit()}>ADD A CREATION <ArrowUpRight /></Button></div>}
          <div className="gallery-end"><span>END OF COLLECTION</span><Minus size={18} /></div>
        </section>

        <section id="how-it-works" className="invitation" aria-labelledby="invitation-title"><div className="invitation-inner page-container"><div className="invitation-top"><span><span className="signal-dot" /> YOUR TURN / 02</span><span>THE NEXT IDEA IS YOURS.</span></div><div className="invitation-main"><div><p className="invite-overline">EXCLUSIVELY AVAILABLE AT PLUNDER & RIFFLE</p><h2 id="invitation-title">YOU'VE SEEN<br />WHAT'S POSSIBLE.<br /><span>NOW MAKE SOMETHING<br />THAT'S YOURS.</span></h2></div><div className="invitation-aside"><p>Your ideas. Your characters. Your audience.</p><p>Turn a single thought into memes, videos, music, and content made to travel across the internet.</p><Button asChild variant="wallPrimary" size="wallLarge"><a href={BOT_URL} target="_blank" rel="noopener noreferrer">UNLOCK THE MEME ENGINE <ArrowUpRight /></a></Button><span className="invite-footnote">Create. Remix. Share. Repeat.<br />No complicated signup page. Get straight to the experience.</span></div></div></div></section>
      </main>
      <footer className="site-footer page-container"><div className="footer-main"><div><a href="#top" className="footer-brand">PLUNDER <span>&</span> RIFFLE<span className="heading-period">.</span></a><p>One thought. Infinite possibilities.<br />Made for the internet.</p></div><div className="footer-links"><a href={BOT_URL} target="_blank" rel="noopener noreferrer">OFFICIAL TELEGRAM <ArrowUpRight size={14} /></a><a href={SITE_URL} target="_blank" rel="noopener noreferrer">MAIN WEBSITE <ArrowUpRight size={14} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} PLUNDER & RIFFLE</span><a href={BOT_URL} target="_blank" rel="noopener noreferrer">STOP SCROLLING. START MAKING. <ArrowRight size={14} /></a></div></footer>

      {editing && <div className="editor-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditing(false); }}><div className="editor-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-title"><div className="editor-header"><span>WALL EDITOR / {editingId ? "EDIT" : "ADD"}</span><Button variant="wallIcon" size="icon" onClick={() => setEditing(false)} aria-label="Close editor"><X /></Button></div><h2 id="editor-title">{editingId ? "EDIT CREATION" : "ADD TO THE WALL"}<span className="heading-period">.</span></h2><p>Paste {editingId ? "the new URL" : "up to 24 page URLs, one per line or separated by commas"}.</p><textarea autoFocus value={input} onChange={e => { setInput(e.target.value); setError(""); }} placeholder="https://your-creation.here.now" rows={editingId ? 3 : 6} />{error && <span className="editor-error" role="alert">{error}</span>}<div className="editor-footer"><Button variant="wallOutline" onClick={() => setEditing(false)}>CANCEL</Button><Button variant="wallPrimary" onClick={submitUrls}>{editingId ? "SAVE CHANGE" : "ADD CREATIONS"} <ArrowRight /></Button></div></div></div>}
    </div>
  );
}
