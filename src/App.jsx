import { Fragment, useEffect, useRef, useState } from 'react';
import { Globe, ArrowSquareOut, PlusCircle, ArrowLeft, CaretLeft, CaretRight, GithubLogo, Keyboard, X, ImageBroken, Cube } from '@phosphor-icons/react';
import { systems, specimenCategories, featuredIds, systemPath, systemFromPath, systemName } from './catalog';
import { messages, detectLanguage } from './i18n';
import SpecimenFrame from './SpecimenFrame';
import CatalogIntroduction from './CatalogIntroduction';

const categories = ['all', 'public', 'oss'];
const imagePath = (system, index = 0, compact = false) => system.specimen.status!=='ready'?`/previews/${system.id}-${system.views[index]?.referenceIndex ?? 0}.webp`:`/specimens/${compact ? 'list-thumbnails' : 'thumbnails'}/${system.id}-${system.views[index]?.key || 'overview'}.webp`;
const viewLabel = (system, index, language) => language === 'en' ? system.views[index].labelEn : system.views[index].label;

function PreviewImage({ system, index = 0, language, compact = false, ...props }) {
  const [failed, setFailed] = useState(false);
  const src = imagePath(system, index, compact);
  const t = messages[language];
  useEffect(() => setFailed(false), [src]);
  return failed ? <span className="image-unavailable"><ImageBroken size={32} weight="light" /><span>{t.unavailable}</span></span> :
    <img {...props} src={src} alt={`${systemName(system, language)} — ${viewLabel(system, index, language)} — ${system.specimen.status==='ready'?t.imageAlt:t.siteCapture}`} onError={() => setFailed(true)} />;
}

function trapDialogFocus(event) {
  if (event.key !== 'Tab') return;
  const elements = [...event.currentTarget.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), iframe, [tabindex]:not([tabindex="-1"])')].filter(element => element.getClientRects().length > 0);
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
  const [selectedId, setSelectedId] = useState(initialId);
  const [viewIndex, setViewIndex] = useState(0);
  const [comparisonView,setComparisonView]=useState('overview');
  const [mobilePreview, setMobilePreview] = useState(Boolean(initialId));
  const [zoomOpen, setZoomOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const zoomDialog = useRef(null);
  const helpDialog = useRef(null);
  const officialLink = useRef(null);
  const rowRefs = useRef({});
  const workspace = useRef(null);
  const previewPanel = useRef(null);
  const listScrollTop = useRef(0);
  const t = messages[language];
  const filtered = systems.filter(s => category === 'all' || s.category === category);
  const featuredCount = filtered.filter(s => featuredIds.includes(s.id)).length;
  const selected = systems.find(s => s.id === selectedId) || systems[0];
  const activeView = selected.views[viewIndex] ? viewIndex : 0;

  useEffect(()=>{previewPanel.current?.scrollTo({top:0,behavior:'instant'});},[selectedId]);

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
    setSelectedId(entry?.id || null);
    setMobilePreview(Boolean(entry));
    setReady(true);
    const onPopState = () => {
      const restored = systemFromPath(location.pathname);
      setCategory('all');
      setSelectedId(restored?.id || null);
      setViewIndex(0);setComparisonView('overview');
      setMobilePreview(Boolean(restored));
      setZoomOpen(false);
      setHelpOpen(false);
      if (window.matchMedia('(max-width: 700px)').matches) {
        requestAnimationFrame(() => workspace.current?.scrollTo({ top: restored ? 0 : listScrollTop.current, behavior: 'instant' }));
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = language;
    document.title = selectedId ? `${systemName(selected, language)} | ${t.siteTitle}` : t.siteTitle;
    const canonical = document.querySelector('link[rel=canonical]');
    if (canonical) canonical.href = new URL(location.pathname, location.origin).href;
  }, [ready, language, selectedId, selected, t.siteTitle, mobilePreview]);

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

  function selectSystem(system, { showDetail = true, focus = false, resetView = false, viewKey } = {}) {
    if (isMobile && showDetail) {
      if (!mobilePreview) listScrollTop.current = workspace.current?.scrollTop || 0;
      requestAnimationFrame(() => workspace.current?.scrollTo({ top: 0, behavior: 'instant' }));
    }
    const key=viewKey||comparisonView;
    if(resetView)setComparisonView('overview');
    else if(viewKey)setComparisonView(viewKey);
    setSelectedId(system.id);
    setViewIndex(resetView ? 0 : Math.max(0,system.views.findIndex(view=>view.key===key)));
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

  function returnToList() {
    setMobilePreview(false);
    requestAnimationFrame(() => {
      rowRefs.current[selected.id]?.focus({ preventScroll: true });
      workspace.current?.scrollTo({ top: listScrollTop.current, behavior: 'instant' });
    });
  }

  function chooseCategory(id) {
    setCategory(id);
    setMobilePreview(false);
    if (selectedId && id !== 'all' && selected.category !== id) {
      selectSystem(systems.find(s => s.category === id), { showDetail: false });
    }
  }

  const selectedIndex = filtered.findIndex(system => system.id === selectedId);
  const previousSystem = filtered[selectedIndex - 1];
  const nextSystem = filtered[selectedIndex + 1];

  function navigateAdjacent(system) {
    if (!system) return;
    selectSystem(system, { resetView: true });
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

  function chooseView(index) {
    setViewIndex(index);
    if(selected.specimen.status==='ready')setComparisonView(selected.views[index].key);
  }
  function chooseComparisonView(key) {
    setComparisonView(key);
    const index=selected.views.findIndex(view=>view.key===key);
    if(index>=0)setViewIndex(index);
  }
  function movePreview(direction) {
    chooseView((activeView + direction + selected.views.length) % selected.views.length);
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
        if (['ArrowLeft', 'ArrowRight', 'h', 'l'].includes(event.key)) {
          event.preventDefault();
          movePreview(['ArrowRight', 'l'].includes(event.key) ? 1 : -1);
        }
        return;
      }
      const index = filtered.findIndex(s => s.id === selectedId);
      let nextIndex;
      if (event.key === 'ArrowDown' || event.key === 'j') nextIndex = Math.min(index + 1, filtered.length - 1);
      if (event.key === 'ArrowUp' || event.key === 'k') nextIndex = index<0?filtered.length-1:Math.max(index-1,0);
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = filtered.length - 1;
      if (nextIndex !== undefined) {
        event.preventDefault();
        const isMobileDetail = mobilePreview && window.matchMedia('(max-width: 700px)').matches;
        selectSystem(filtered[nextIndex], { showDetail: mobilePreview, focus: !isMobileDetail, resetView: true });
      } else if (!selectedId) {
        return;
      } else if (['ArrowLeft', 'ArrowRight', 'h', 'l'].includes(event.key)) {
        event.preventDefault();
        movePreview(['ArrowRight', 'l'].includes(event.key) ? 1 : -1);
      } else if (event.key === 'v') {
        event.preventDefault();
        setZoomOpen(true);
      } else if (event.key === 'o') {
        event.preventDefault();
        officialLink.current?.click();
      } else if (event.key === 'Escape' && mobilePreview) {
        event.preventDefault();
        returnToList();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ready, selectedId, selected, activeView, comparisonView, category, mobilePreview, helpOpen, zoomOpen]);

  const keyboardRows = [
    [['↓', '↑', 'J', 'K'], t.move], [['Home', 'End'], t.firstLast], [['←', '→', 'H', 'L'], t.changeView],
    [['V'], t.openZoom], [['O'], t.openSite], [['?'], t.showHelp], [['Esc'], t.dismiss],
    [['Tab', 'Shift + Tab'], t.tab], [['Enter', 'Space'], t.activate],
  ];

  return <div className={`catalog-app ${mobilePreview ? 'mobile-detail' : ''}`} data-ready={ready}>
    <a className="skip-link" href="#catalog-list">{t.skip}</a>
    <header className="site-header">
      <a className="site-title" href="/"><span className="desktop-site-title">{t.title}</span><span className="mobile-site-title">{t.title}</span></a>
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
    <main ref={workspace} className={`workspace ${mobilePreview ? 'mobile-preview' : ''}`}>
      <section id="catalog-list" className="catalog-list" aria-label={t.list} tabIndex={-1}>
        <nav className="list-preview-categories" aria-label={t.comparisonCategory}>
          {Object.entries(specimenCategories).map(([key,labels])=><button type="button" key={key} disabled={!ready} aria-pressed={comparisonView===key} onClick={()=>chooseComparisonView(key)}>{labels[language==='en'?1:0]}</button>)}
        </nav>
        <div className="list-toolbar"><h2>{featuredCount ? (category==='all'?t.featured:t.featuredGroup) : t.newest}</h2><span>{featuredCount || filtered.length}</span></div>
        <p className="sr-only" role="status">{filtered.length} {t.count}{selectedId?` — ${systemName(selected, language)}`:''}</p>
        {filtered.map((s, index) => <Fragment key={s.id}>
          {featuredCount > 0 && index === featuredCount && <div className="list-toolbar list-section-heading"><h2>{t.newest}</h2><span>{filtered.length - featuredCount}</span></div>}
          <a data-featured={featuredIds.includes(s.id)} href={systemPath(s)} ref={element => { rowRefs.current[s.id] = element; }} tabIndex={isMobile || selectedId === s.id || (!selectedId && index===0) ? 0 : -1} className={`system-row ${!isMobile && selectedId === s.id ? 'selected' : ''}`} aria-current={!isMobile && selectedId === s.id ? 'page' : undefined}
          onClick={event => {
            if (!ready || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            event.preventDefault();
            selectSystem(s);
          }}>
          <span className="row-image"><PreviewImage compact system={s} index={Math.max(0,s.views.findIndex(view=>view.key===comparisonView))} language={language} loading={s.id === selected.id ? 'eager' : 'lazy'} width="1440" height="1000" />{s.specimen.status!=='ready'?<span className="reference-badge">{t.siteCapture}</span>:!s.views.some(view=>view.key===comparisonView)&&<span className="reference-badge">{t.overviewFallback}</span>}</span>
          <span className="row-copy"><span className="system-name">{systemName(s, language)}</span>{s.specimen.unstyled&&<span className="system-kind">{t.unstyled}</span>}
            <span className="system-meta"><span>{language === 'en' ? s.countryEn : s.country}</span><span className="meta-divider" aria-hidden="true" /><span>{t[s.category]}</span></span>
            <span className="release-line"><time dateTime={s.published.date}>{s.published.date}</time>{s.published.estimated && <span className="date-reference">{t.reference}</span>}</span>
          </span>
        </a></Fragment>)}
      </section>
      <section ref={previewPanel} className="preview-panel" aria-label={selectedId?t.preview:t.aboutSite}>
        {selectedId?<>
        <div className="mobile-detail-toolbar">
          <button className="back-to-list text-button" onClick={returnToList}><ArrowLeft size={18} />{t.back}</button>
          <nav className="system-navigation" aria-label={t.browseSystems}>
            {previousSystem ? <a href={systemPath(previousSystem)} aria-label={t.previousSystem} onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || !ready) return; event.preventDefault(); navigateAdjacent(previousSystem); }}><CaretLeft size={18} />{t.previousShort}</a> : <button disabled aria-label={t.previousSystem}><CaretLeft size={18} />{t.previousShort}</button>}
            <span className="system-position" role="status">{selectedIndex + 1} / {filtered.length}</span>
            {nextSystem ? <a href={systemPath(nextSystem)} aria-label={t.nextSystem} onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || !ready) return; event.preventDefault(); navigateAdjacent(nextSystem); }} >{t.nextShort}<CaretRight size={18} /></a> : <button disabled aria-label={t.nextSystem}>{t.nextShort}<CaretRight size={18} /></button>}
          </nav>
        </div>
        <div className="preview-heading"><h1>{systemName(selected, language)}</h1><p className="system-description">{selected.description[language]}</p><a ref={officialLink} className="official-link" href={selected.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.official} (${t.newTab})`} title={t.official}><Globe size={23} aria-hidden="true"/></a></div>
        {selected.specimen.status==='ready' ? <>
          {selected.specimen.unstyled&&<p className="implementation-note unstyled-note">{t.unstyledExplanation}</p>}
          <div className="main-preview specimen-canvas" onTouchStart={startSwipe} onTouchEnd={endSwipe} onTouchCancel={()=>{swipeStart.current=null;}}>
            <SpecimenFrame compact={!isMobile} system={selected} index={activeView} language={language} onSwipe={direction=>{if(isMobile)navigateAdjacent(direction>0?nextSystem:previousSystem)}} onKey={key=>{if(key==='Escape'&&isMobile)returnToList();else window.dispatchEvent(new KeyboardEvent('keydown',{key}))}}/>
          </div>
          <div className="implementation-meta"><a href={selected.specimen.sourceUrl} target="_blank" rel="noopener noreferrer">{selected.specimen.package} <span>{selected.specimen.version}</span><ArrowSquareOut size={12}/></a>{selected.specimen.components?.[selected.views[activeView]?.key]&&<span>{selected.specimen.components[selected.views[activeView].key]}</span>}{selected.specimen.extraPackages?.filter(pkg=>pkg.views.includes(selected.views[activeView]?.key)).map(pkg=><a key={pkg.package} href={pkg.sourceUrl} target="_blank" rel="noopener noreferrer">{pkg.package} <span>{pkg.version}</span><ArrowSquareOut size={12}/></a>)}{selected.specimen.unstyled&&<span>{t.unstyled}</span>}<button type="button" className="specimen-enlarge text-button" onClick={()=>setZoomOpen(true)}>{t.enlarge}<ArrowSquareOut size={15}/></button></div>
          {selected.specimen.notice&&<p className="implementation-note">{selected.specimen.notice[language]}</p>}
          <div className="preview-thumbnails" aria-label={t.views}>
            {selected.views.map((view,index)=><button type="button" disabled={!ready} key={view.key} className={`view-thumbnail ${activeView===index?'active':''}`} aria-pressed={activeView===index} onClick={()=>chooseView(index)}><PreviewImage system={selected} index={index} language={language} width="1000" height="720" loading="lazy"/><span>{viewLabel(selected,index,language)}</span></button>)}
          </div>
        </> : <>
          <div className="implementation-toolbar"><span>{t.siteCapture}</span><button type="button" className="specimen-enlarge text-button" onClick={()=>setZoomOpen(true)}>{t.enlarge}<ArrowSquareOut size={15}/></button></div>
          <button type="button" className="main-preview reference-canvas" aria-label={t.enlarge} onClick={()=>{if(Date.now()>ignorePreviewClickUntil.current)setZoomOpen(true)}} onTouchStart={startSwipe} onTouchEnd={endSwipe} onTouchCancel={()=>{swipeStart.current=null;}}><PreviewImage system={selected} index={activeView} language={language}/></button>
          <div className="implementation-meta"><a href={selected.views[activeView].url} target="_blank" rel="noopener noreferrer">{t.captureSource}<ArrowSquareOut size={12}/></a></div>
          <div className="preview-thumbnails" aria-label={t.views}>{selected.views.map((view,index)=><button type="button" disabled={!ready} key={view.key} className={`view-thumbnail ${activeView===index?'active':''}`} aria-pressed={activeView===index} onClick={()=>chooseView(index)}><PreviewImage system={selected} index={index} language={language} width="1440" height="1000" loading="lazy"/><span>{viewLabel(selected,index,language)}</span></button>)}</div>
          {selected.specimen.status!=='reference-only'&&<div className="implementation-resource reference-notice">
          <Cube size={42} weight="light"/><h2>{selected.specimen.status==='design-only'?t.designResources:t.integrationLimited}</h2>
          <p>{selected.specimen.status==='design-only'?t.designResourcesNote:t.integrationLimitedNote}</p>
          <a className="official-link" href={selected.url} target="_blank" rel="noopener noreferrer">{t.openResources}<ArrowSquareOut size={17}/></a>
        </div>}</>}
        <div className="source-meta"><span>{language === 'en' ? selected.organizationEn : selected.organization}</span><span>{language === 'en' ? selected.countryEn : selected.country}</span><span>{selected.stack.join(' / ')}</span></div>
        <div className="release-info"><span>{t.released}</span><time dateTime={selected.published.date}>{selected.published.date}</time>{selected.published.estimated && <span className="date-reference">{t.reference}</span>}</div>
        <details className="release-details" open={!isMobile}><summary>{t.releaseNote}</summary><p>{selected.published.note[language]}</p><a href={selected.published.sourceUrl} target="_blank" rel="noopener noreferrer">{t.dateSource}<ArrowSquareOut size={14} /></a></details>
        <details className="license-details" open={!isMobile}><summary>{t.conditions}</summary><p>{t.license}: {language === 'en' ? selected.licenseEn : selected.license}</p><p>{selected.specimen.status==='ready'?t.imageNote:t.captureNote}</p><div className="source-links"><a href={selected.specimen.sourceUrl} target="_blank" rel="noopener noreferrer">{selected.specimen.status==='ready'?t.imageSource:t.captureSource}<ArrowSquareOut size={14} /></a>{selected.repository && <a className="source-repository" href={selected.repository} target="_blank" rel="noopener noreferrer"><GithubLogo size={14} />{t.code}</a>}</div></details>
        </>:<CatalogIntroduction systems={filtered} language={language} ready={ready} onSelect={selectSystem} onHelp={()=>setHelpOpen(true)}/>}
      </section>
    </main>
    <footer className="site-footer"><span>Copyright © 2026 <a href="https://github.com/akiyan" target="_blank" rel="noopener noreferrer">@akiyan</a></span><nav className="footer-links" aria-label={t.footerLinks}><a className="addition-request" href="https://github.com/akiyan/design-system-catalog/issues/new?template=add-design-system.yml" target="_blank" rel="noopener noreferrer"><PlusCircle size={17}/>{t.requestAddition}</a><a className="github-link" href={githubUrl} target="_blank" rel="noopener noreferrer"><GithubLogo size={19} weight="fill" aria-hidden="true" />GitHub</a></nav></footer>
    <dialog ref={zoomDialog} className="zoom-dialog" onKeyDown={trapDialogFocus} aria-labelledby="zoom-title" onCancel={() => setZoomOpen(false)} onClick={e => { if (e.target === zoomDialog.current) setZoomOpen(false); }}>
      <div className="zoom-toolbar"><h2 id="zoom-title">{systemName(selected, language)}<span>{viewLabel(selected, activeView, language)}</span></h2><button aria-label={t.closeZoom} onClick={() => setZoomOpen(false)}><X size={24} /></button></div>
      <div className="zoom-content">{zoomOpen&&(selected.specimen.status==='ready'?<SpecimenFrame system={selected} index={activeView} language={language} expanded onKey={key=>{if(key==='Escape')setZoomOpen(false);else window.dispatchEvent(new KeyboardEvent('keydown',{key}))}}/>:<PreviewImage system={selected} index={activeView} language={language}/>)}</div>
      {selected.views.length > 1 && <div className="zoom-navigation"><button aria-label={t.previous} onClick={() => movePreview(-1)}><CaretLeft size={20} /></button><span>{activeView + 1} / {selected.views.length}</span><button aria-label={t.next} onClick={() => movePreview(1)}><CaretRight size={20} /></button></div>}
    </dialog>
    <dialog ref={helpDialog} className="help-dialog" onKeyDown={trapDialogFocus} aria-labelledby="help-title" onCancel={() => setHelpOpen(false)} onClick={e => { if (e.target === helpDialog.current) setHelpOpen(false); }}>
      <div className="zoom-toolbar"><h2 id="help-title"><Keyboard size={22} />{t.helpTitle}</h2><button aria-label={t.closeHelp} onClick={() => setHelpOpen(false)}><X size={24} /></button></div>
      <dl className="keyboard-shortcuts">{keyboardRows.map(([keys, action]) => <div key={action}><dt>{keys.map(key => <kbd key={key}>{key}</kbd>)}</dt><dd>{action}</dd></div>)}</dl>
      <p className="shortcut-note">{t.shortcutNote}</p>
    </dialog>
  </div>;
}
