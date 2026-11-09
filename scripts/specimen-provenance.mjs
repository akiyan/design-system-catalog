import fs from'node:fs/promises';
const registry=JSON.parse(await fs.readFile('src/data/specimens.json','utf8'));
const entries=[];
for(const[id,s]of Object.entries(registry)){
 let license=null,installedVersion=null;
 if(s.package){try{const p=JSON.parse(await fs.readFile(`node_modules/${s.package}/package.json`,'utf8'));license=p.license;installedVersion=p.version}catch{}}
 entries.push({id,status:s.status,source:s.sourceUrl,implementation:s.package,version:s.version,installedVersion,license});
}
await fs.writeFile('docs/specimen-provenance.json',JSON.stringify(entries,null,2)+'\n');
