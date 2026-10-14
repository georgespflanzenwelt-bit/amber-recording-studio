import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const files=(await readdir(path.join(process.cwd(),"public","songs"))).filter(f=>/\.(mp3|m4a|ogg|wav|flac)$/i.test(f)).sort();
  return NextResponse.json({files:files.map(name=>({name:name.replace(/\.[^.]+$/,""),url:"/songs/"+encodeURIComponent(name)}))});
 }catch{return NextResponse.json({files:[]})}
}
