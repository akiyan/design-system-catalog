import entries from './data/systems.json';
export const dateSortKey = entry => (entry.published?.date || '').padEnd(10, '-00');
export const systems = [...entries].sort((a,b) => dateSortKey(b).localeCompare(dateSortKey(a)) || a.id.localeCompare(b.id));
export const systemPath = system => `/${system.id}/`;
export const systemFromPath = pathname => systems.find(s => systemPath(s) === `${pathname.replace(/\/+$/, '')}/`);
export const systemName = (system,language) => language === 'en' ? system.shortNameEn : system.shortName;
