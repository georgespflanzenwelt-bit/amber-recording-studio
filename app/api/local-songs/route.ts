import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const files=(await readdir(path.join(process.cwd(),"public","songs"))).filter(f=>/\.(mp3|m4a|ogg|wav|flac)$/i.test(f)).sort((a,b)=>{const na=Number(a.match(/^\s*(\d+)/)?.[1]||999999),nb=Number(b.match(/^\s*(\d+)/)?.[1]||999999);return na-nb||a.localeCompare(b,undefined,{numeric:true})});
  return NextResponse.json({files:files.map(name=>({name:name.replace(/\.[^.]+$/,""),url:"/songs/"+encodeURIComponent(name),order:Number(name.match(/^\s*(\d+)/)?.[1]||999999)}))});
 }catch{return NextResponse.json({files:[]})}
}
