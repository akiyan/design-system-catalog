import type { APIRoute } from 'astro';
import {systems,systemPath} from '../catalog';
export const GET: APIRoute = ({site}) => new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...systems.map(systemPath)].map(path=>`<url><loc>${new URL(path,site)}</loc></url>`).join('')}</urlset>\n`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
