import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const names=(await readdir(path.join(process.cwd(),"public","selected credits"))).filter(x=>/\.(jpe?g|png|webp|avif)$/i.test(x)).sort();
  const entries=names.map(name=>{
   const parts=name.replace(/\.[^.]+$/,"").split(/__+/).map(s=>s.replace(/_/g," ").replace(/\s+/g," ").trim());
   const first=parts[0]||"";
   const single=first.match(/^(.+?)\s+-\s+(.+)$/);
   const artist=single?single[1].trim():first.replace(/\s+(?:Leben|Blue Eyes Soul)\s*\(Album\).*$/i,"").trim();
   const title=single?single[2].trim():(parts[1]&&!/^(mixed|remix|record|produc|engineer)/i.test(parts[1])?parts[1]:first.slice(artist.length).replace(/^\s*[-–]\s*/,"").trim());
   const workParts=parts.slice(parts[1]===title?2:1);
   const work=workParts.filter(x=>!/^by\s+/i.test(x)&&!/^George Brasch\s*\.?$/i.test(x)).join(" · ").trim();
   const creditName=parts.find(x=>/George Brasch/i.test(x))?.match(/George Brasch/i)?.[0]||"George Brasch";
   const image="/selected%20credits/"+encodeURIComponent(name);
   const lower=(artist+" "+title).toLowerCase();
   const key=/^azad\b/.test(lower)?"azad":/till|tll br/.test(lower)&&/blue eye/.test(lower)?"till":/deborah cox/.test(lower)?"deborah":/kool savas/.test(lower)&&/haus|boot|aus.*bot/.test(lower)?"kool":null;
   return {name,artist,title,work,creditName,image,key};
  });
  entries.sort((a,b)=>a.artist.localeCompare(b.artist,"de",{sensitivity:"base",numeric:true})||a.title.localeCompare(b.title,"de",{sensitivity:"base",numeric:true}));
  const covers=Object.fromEntries(entries.filter(e=>e.key).map(e=>[e.key,e.image]));
  return NextResponse.json({covers,entries});
 }catch{return NextResponse.json({covers:{},entries:[]})}
}
