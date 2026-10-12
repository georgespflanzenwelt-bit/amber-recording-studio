import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const names=(await readdir(path.join(process.cwd(),"public","selected credits"))).filter(x=>/\.(jpe?g|png|webp|avif)$/i.test(x)).sort();
  const entries=names.map(name=>{
   const parts=name.replace(/\.[^.]+$/,"").split(/__+/).map(s=>s.replace(/_/g," ").replace(/\s+/g," ").trim());
   const artist=parts[0]?.split(/\s+-\s+/)[0]?.trim()||"";
   const title=parts[1]||"";
   const work=parts.slice(2).join(" · ").replace(/^by\s+/i,"").trim();
   const image="/selected%20credits/"+encodeURIComponent(name);
   const lower=(artist+" "+title).toLowerCase();
   const key=/^azad\b/.test(lower)?"azad":/till|tll br/.test(lower)&&/blue eye/.test(lower)?"till":/deborah cox/.test(lower)?"deborah":/kool savas/.test(lower)&&/haus|boot|aus.*bot/.test(lower)?"kool":null;
   return {name,artist,title,work,image,key};
  });
  const covers=Object.fromEntries(entries.filter(e=>e.key).map(e=>[e.key,e.image]));
  return NextResponse.json({covers,entries});
 }catch{return NextResponse.json({covers:{},entries:[]})}
}
