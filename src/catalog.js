import entries from './data/systems.json';
import featured from './data/featured.json';
export const featuredIds = featured.ids;
export const dateSortKey = entry => (entry.published?.date || '').padEnd(10, '-00');
const chronological = [...entries].sort((a,b) => dateSortKey(b).localeCompare(dateSortKey(a)) || a.id.localeCompare(b.id));
export const systems = [...featuredIds.map(id => chronological.find(s => s.id === id)), ...chronological.filter(s => !featuredIds.includes(s.id))];
export const systemPath = system => `/${system.id}/`;
export const systemFromPath = pathname => systems.find(s => systemPath(s) === `${pathname.replace(/\/+$/, '')}/`);
export const systemName = (system,language) => language === 'en' ? system.shortNameEn : system.shortName;
