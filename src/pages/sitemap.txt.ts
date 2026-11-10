import type { APIRoute } from 'astro';
import {systems,systemPath} from '../catalog';

export const GET: APIRoute = ({site}) => new Response(
 ['/',...systems.map(systemPath)].map(path=>new URL(path,site).href).join('\n')+'\n',
 {headers:{'Content-Type':'text/plain; charset=utf-8'}},
);
