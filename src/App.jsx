import { useEffect, useRef, useState } from 'react';
import { ArrowSquareOut, ArrowLeft, CaretLeft, CaretRight, GithubLogo, Keyboard, X, ImageBroken } from '@phosphor-icons/react';
import { systems, systemPath, systemFromPath, systemName } from './catalog';
import { messages, detectLanguage } from './i18n';

const categories = ['all', 'public', 'oss'];
const imagePath = (system, index = 0) => `/previews/${system.id}-${index}.webp`;
const viewLabel = (system, index, language) => language === 'en' ? system.views[index].labelEn : system.views[index].label;

function PreviewImage({ system, index = 0, language, ...props }) {
  const [failed, setFailed] = useState(false);
  const src = imagePath(system, index);
  const t = messages[language];
  useEffect(() => setFailed(false), [src]);
  return failed ? <span className="image-unavailable"><ImageBroken size={32} weight="light" /><span>{t.unavailable}</span></span> :
    <img {...props} src={src} alt={`${systemName(system, language)} — ${viewLabel(system, index, language)} — ${t.imageAlt}`} onError={() => setFailed(true)} />;
}

function trapDialogFocus(event) {
  if (event.key !== 'Tab') return;
  const elements = [...event.currentTarget.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])')].filter(element => element.getClientRects().length > 0);
  const first = elements[0];
  const last = elements.at(-1);
  if (!first) return;
  if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === event.currentTarget)) {
    event.preventDefault();
    first.focus();
  }
}

export function App({ githubUrl = 'https://github.com/akiyan/design-system-catalog', initialId = null }) {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const swipeStart = useRef(null);
  const ignorePreviewClickUntil = useRef(0);
  const [language, setLanguage] = useState('ja');
  const [languagePreference, setLanguagePreference] = useState('auto');
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(initialId || systems[0].id);
  const [viewIndex, setViewIndex] = useState(0);
  const [mobilePreview, setMobilePreview] = useState(Boolean(initialId));
  const [zoomOpen, setZoomOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const zoomDialog = useRef(null);
  const helpDialog = useRef(null);
  const officialLink = useRef(null);
  const rowRefs = useRef({});
  const t = messages[language];
  const filtered = systems.filter(s => category === 'all' || s.category === category);
  const selected = systems.find(s => s.id === selectedId) || systems[0];
  const activeView = selected.views[viewIndex] ? viewIndex : 0;

  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let preference = 'auto';
    try { preference = localStorage.getItem('catalog-language') || 'auto'; } catch { /* Browser storage is optional. */ }
    if (!['ja', 'en'].includes(preference)) preference = 'auto';
    setLanguagePreference(preference);
    setLanguage(preference === 'auto' ? detectLanguage() : preference);
    const entry = systemFromPath(location.pathname);
    setSelectedId(entry?.id || systems[0].id);
    setMobilePreview(Boolean(entry));
    setReady(true);
    const onPopState = () => {
      const restored = systemFromPath(location.pathname);
      setCategory('all');
      setSelectedId(restored?.id || systems[0].id);
      setViewIndex(0);
      setMobilePreview(Boolean(restored));
      setZoomOpen(false);
      setHelpOpen(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = language;
    document.title = `${systemName(selected, language)} | ${t.title}`;
    const canonical = document.querySelector('link[rel=canonical]');
    if (canonical) canonical.href = new URL(location.pathname, location.origin).href;
  }, [ready, language, selected, t.title, mobilePreview]);

  useEffect(() => {
    if (languagePreference !== 'auto') return;
    const onChange = () => setLanguage(detectLanguage());
    window.addEventListener('languagechange', onChange);
    return () => window.removeEventListener('languagechange', onChange);
  }, [languagePreference]);

  useEffect(() => {
    if (zoomOpen) zoomDialog.current?.showModal();
    else zoomDialog.current?.close();
  }, [zoomOpen]);
  useEffect(() => {
    if (helpOpen) helpDialog.current?.showModal();
    else helpDialog.current?.close();
  }, [helpOpen]);

  function chooseLanguage(preference) {
    setLanguagePreference(preference);
    setLanguage(preference === 'auto' ? detectLanguage() : preference);
    try {
      if (preference === 'auto') localStorage.removeItem('catalog-language');
      else localStorage.setItem('catalog-language', preference);
    } catch { /* Language switching also works without persistent storage. */ }
  }

  function selectSystem(system, { showDetail = true, focus = false } = {}) {
    setSelectedId(system.id);
    setViewIndex(0);
    setMobilePreview(showDetail);
    const path = systemPath(system);
    if (location.pathname !== path) history.pushState({ system: system.id }, '', path);
    if (focus) {
      requestAnimationFrame(() => {
        const row = rowRefs.current[system.id];
        row?.focus({ preventScroll: true });
        row?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      });
    }
  }

  function chooseCategory(id) {
    setCategory(id);
    setMobilePreview(false);
    if (id !== 'all' && selected.category !== id) {
      selectSystem(systems.find(s => s.category === id), { showDetail: false });
    }
  }

  const selectedIndex = filtered.findIndex(system => system.id === selected.id);
  const previousSystem = filtered[selectedIndex - 1];
  const nextSystem = filtered[selectedIndex + 1];

  function navigateAdjacent(system) {
    if (!system) return;
    selectSystem(system);
    document.querySelector('.workspace')?.scrollTo({ top: 0, behavior: 'instant' });
  }

  function startSwipe(event) {
    swipeStart.current = isMobile && event.touches.length === 1
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }

  function endSwipe(event) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || event.touches.length || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    ignorePreviewClickUntil.current = Date.now() + 500;
    navigateAdjacent(dx < 0 ? nextSystem : previousSystem);
  }

  function movePreview(direction) {
    setViewIndex(index => (index + direction + selected.views.length) % selected.views.length);
  }

  useEffect(() => {
    if (!ready) return;
    const onKeyDown = event => {
      if (event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return;
      const editable = event.target instanceof HTMLElement && event.target.closest('.language-control, input, textarea, select, [contenteditable]:not([contenteditable="false"])');
      if (editable) return;
      if (event.key === '?') {
        event.preventDefault();
        setZoomOpen(false);
        setHelpOpen(open => !open);
        return;
      }
      if (helpOpen) return;
      if (zoomOpen) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          movePreview(event.key === 'ArrowRight' ? 1 : -1);
        }
        return;
      }
      const index = filtered.findIndex(s => s.id === selected.id);
      let nextIndex;
      if (event.key === 'ArrowDown' || event.key === 'j') nextIndex = Math.min(index + 1, filtered.length - 1);
      if (event.key === 'ArrowUp' || event.key === 'k') nextIndex = Math.max(index - 1, 0);
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = filtered.length - 1;
      if (nextIndex !== undefined) {
        event.preventDefault();
        const isMobileDetail = mobilePreview && window.matchMedia('(max-width: 700px)').matches;
        selectSystem(filtered[nextIndex], { showDetail: mobilePreview, focus: !isMobileDetail });
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        movePreview(event.key === 'ArrowRight' ? 1 : -1);
      } else if (event.key === 'v') {
        event.preventDefault();
        setZoomOpen(true);
      } else if (event.key === 'o') {
        event.preventDefault();
        officialLink.current?.click();
      } else if (event.key === 'Escape' && mobilePreview) {
        event.preventDefault();
        setMobilePreview(false);
        requestAnimationFrame(() => rowRefs.current[selected.id]?.focus());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ready, selected, category, mobilePreview, helpOpen, zoomOpen]);

  const keyboardRows = [
    [['↓', '↑', 'J', 'K'], t.move], [['Home', 'End'], t.firstLast], [['←', '→'], t.changeView],
    [['V'], t.openZoom], [['O'], t.openSite], [['?'], t.showHelp], [['Esc'], t.dismiss],
    [['Tab', 'Shift + Tab'], t.tab], [['Enter', 'Space'], t.activate],
  ];

  return <div className={`catalog-app ${mobilePreview ? 'mobile-detail' : ''}`} data-ready={ready}>
    <a className="skip-link" href="#catalog-list">{t.skip}</a>
    <header className="site-header">
      <a className="site-title" href="/">{t.title}</a>
      <div className="header-controls">
        <nav className="filters" aria-label={t.category}>
          {categories.map(id => <button key={id} type="button" disabled={!ready} aria-pressed={category === id} className={category === id ? 'filter active' : 'filter'} onClick={() => chooseCategory(id)}>{t[id]}<span>{id === 'all' ? systems.length : systems.filter(s => s.category === id).length}</span></button>)}
        </nav>
        <div className="language-control" role="group" aria-label={t.language}>
          <button type="button" lang="ja" aria-pressed={language === 'ja'} disabled={!ready} onClick={() => chooseLanguage('ja')}>日本語</button>
          <button type="button" lang="en" aria-pressed={language === 'en'} disabled={!ready} onClick={() => chooseLanguage('en')}>English</button>
        </div>
        <button className="help-trigger" type="button" disabled={!ready} aria-label={t.help} title={`${t.help} (?)`} onClick={() => setHelpOpen(true)}><Keyboard size={22} /><kbd>?</kbd></button>
      </div>
    </header>
    <main className={`workspace ${mobilePreview ? 'mobile-preview' : ''}`}>
      <section id="catalog-list" className="catalog-list" aria-label={t.list} tabIndex={-1}>
        <div className="list-toolbar"><span>{t.newest}</span><span>{filtered.length}</span></div>
        <p className="sr-only" role="status">{filtered.length} {t.count} — {systemName(selected, language)}</p>
        {filtered.map(s => <a key={s.id} href={systemPath(s)} ref={element => { rowRefs.current[s.id] = element; }} tabIndex={isMobile || selected.id === s.id ? 0 : -1} className={`system-row ${!isMobile && selected.id === s.id ? 'selected' : ''}`} aria-current={!isMobile && selected.id === s.id ? 'page' : undefined}
          onClick={event => {
            if (!ready || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            event.preventDefault();
            selectSystem(s);
          }}>
          <span className="row-image"><PreviewImage system={s} language={language} loading={s.id === selected.id ? 'eager' : 'lazy'} width="1440" height="1000" /></span>
          <span className="row-copy"><span className="system-name">{systemName(s, language)}</span>
            <span className="system-meta"><span>{language === 'en' ? s.countryEn : s.country}</span><span className="meta-divider" aria-hidden="true" /><span>{t[s.category]}</span></span>
            <span className="release-line"><time dateTime={s.published.date}>{s.published.date}</time>{s.published.estimated && <span className="date-reference">{t.reference}</span>}</span>
          </span>
        </a>)}
      </section>
      <section className="preview-panel" aria-label={t.preview}>
        <div className="mobile-detail-toolbar">
          <button className="back-to-list text-button" onClick={() => { setMobilePreview(false); requestAnimationFrame(() => rowRefs.current[selected.id]?.focus()); }}><ArrowLeft size={18} />{t.back}</button>
          <nav className="system-navigation" aria-label={t.browseSystems}>
            {previousSystem ? <a href={systemPath(previousSystem)} aria-label={t.previousSystem} onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || !ready) return; event.preventDefault(); navigateAdjacent(previousSystem); }}><CaretLeft size={18} />{t.previousShort}</a> : <button disabled aria-label={t.previousSystem}><CaretLeft size={18} />{t.previousShort}</button>}
            <span className="system-position" role="status">{selectedIndex + 1} / {filtered.length}</span>
            {nextSystem ? <a href={systemPath(nextSystem)} aria-label={t.nextSystem} onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || !ready) return; event.preventDefault(); navigateAdjacent(nextSystem); }} >{t.nextShort}<CaretRight size={18} /></a> : <button disabled aria-label={t.nextSystem}>{t.nextShort}<CaretRight size={18} /></button>}
          </nav>
        </div>
        <div className="preview-heading"><h1>{systemName(selected, language)}</h1><a ref={officialLink} className="official-link" href={selected.url} target="_blank" rel="noopener noreferrer"><ArrowSquareOut size={21} />{t.official}<span className="sr-only"> ({t.newTab})</span></a></div>
        <button type="button" disabled={!ready} className="main-preview" aria-label={`${systemName(selected, language)} — ${t.enlarge}`} onTouchStart={startSwipe} onTouchMove={event => { if (event.touches.length !== 1) swipeStart.current = null; }} onTouchEnd={endSwipe} onTouchCancel={() => { swipeStart.current = null; }} onClick={() => { if (Date.now() >= ignorePreviewClickUntil.current) setZoomOpen(true); }}><PreviewImage system={selected} index={activeView} language={language} width="1440" height="1000" /><span className="enlarge-label">{t.enlarge}<ArrowSquareOut size={15} /></span></button>
        <div className="preview-thumbnails" aria-label={t.views}>
          {selected.views.map((view, index) => <button type="button" disabled={!ready} key={view.url} className={`view-thumbnail ${activeView === index ? 'active' : ''}`} aria-pressed={activeView === index} onClick={() => setViewIndex(index)}><PreviewImage system={selected} index={index} language={language} width="1440" height="1000" loading="lazy" /><span>{viewLabel(selected, index, language)}</span></button>)}
        </div>
        <div className="source-meta"><span>{language === 'en' ? selected.organizationEn : selected.organization}</span><span>{language === 'en' ? selected.countryEn : selected.country}</span><span>{selected.stack.join(' / ')}</span></div>
        <div className="release-info"><span>{t.released}</span><time dateTime={selected.published.date}>{selected.published.date}</time>{selected.published.estimated && <span className="date-reference">{t.reference}</span>}</div>
        <details className="release-details"><summary>{t.releaseNote}</summary><p>{selected.published.note[language]}</p><a href={selected.published.sourceUrl} target="_blank" rel="noopener noreferrer">{t.dateSource}<ArrowSquareOut size={14} /></a></details>
        <details className="license-details"><summary>{t.conditions}</summary><p>{t.license}: {language === 'en' ? selected.licenseEn : selected.license}</p><p>{t.imageNote}</p><a href={selected.views[activeView].url} target="_blank" rel="noopener noreferrer">{t.imageSource}<ArrowSquareOut size={14} /></a>{selected.repository && <a className="source-repository" href={selected.repository} target="_blank" rel="noopener noreferrer"><GithubLogo size={14} />{t.code}</a>}</details>
      </section>
    </main>
    <footer className="site-footer"><span>Copyright © 2026 <a href="https://github.com/akiyan" target="_blank" rel="noopener noreferrer">@akiyan</a></span><a className="github-link" href={githubUrl} target="_blank" rel="noopener noreferrer"><GithubLogo size={19} weight="fill" aria-hidden="true" />GitHub<ArrowSquareOut size={14} aria-hidden="true" /></a></footer>
    <dialog ref={zoomDialog} className="zoom-dialog" onKeyDown={trapDialogFocus} aria-labelledby="zoom-title" onCancel={() => setZoomOpen(false)} onClick={e => { if (e.target === zoomDialog.current) setZoomOpen(false); }}>
      <div className="zoom-toolbar"><h2 id="zoom-title">{systemName(selected, language)}<span>{viewLabel(selected, activeView, language)}</span></h2><button aria-label={t.closeZoom} onClick={() => setZoomOpen(false)}><X size={24} /></button></div>
      <div className="zoom-content"><PreviewImage system={selected} index={activeView} language={language} width="1440" height="1000" /></div>
      {selected.views.length > 1 && <div className="zoom-navigation"><button aria-label={t.previous} onClick={() => movePreview(-1)}><CaretLeft size={20} /></button><span>{activeView + 1} / {selected.views.length}</span><button aria-label={t.next} onClick={() => movePreview(1)}><CaretRight size={20} /></button></div>}
    </dialog>
    <dialog ref={helpDialog} className="help-dialog" onKeyDown={trapDialogFocus} aria-labelledby="help-title" onCancel={() => setHelpOpen(false)} onClick={e => { if (e.target === helpDialog.current) setHelpOpen(false); }}>
      <div className="zoom-toolbar"><h2 id="help-title"><Keyboard size={22} />{t.helpTitle}</h2><button aria-label={t.closeHelp} onClick={() => setHelpOpen(false)}><X size={24} /></button></div>
      <dl className="keyboard-shortcuts">{keyboardRows.map(([keys, action]) => <div key={action}><dt>{keys.map(key => <kbd key={key}>{key}</kbd>)}</dt><dd>{action}</dd></div>)}</dl>
      <p className="shortcut-note">{t.shortcutNote}</p>
    </dialog>
  </div>;
}
