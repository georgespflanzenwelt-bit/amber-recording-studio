import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
const normalize=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
export async function GET(){
 try{
  const files=(await readdir(path.join(process.cwd(),"public","songs"))).filter(f=>/\.(mp3|m4a|ogg|wav|flac)$/i.test(f));
  const matches:{shanice?:string;aaliyah?:string}={};
  const rules=[{key:"shanice" as const,artist:"shanice",title:"close my eyes"},{key:"aaliyah" as const,artist:"aaliyah",title:"if your girl only knew"}];
  for(const rule of rules){
   const found=files.filter(file=>{const n=normalize(file);return n.includes(rule.artist)&&n.includes(rule.title)});
   if(found.length===1)matches[rule.key]="/songs/"+encodeURIComponent(found[0]);
  }
  return NextResponse.json(matches);
 }catch{return NextResponse.json({})}
}
