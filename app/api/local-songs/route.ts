import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 const folders=["songs","Donna Renee__Keep on believing"];
 const files=(await Promise.all(folders.map(async folder=>{
  try{
   const names=(await readdir(path.join(process.cwd(),"public",folder))).filter(name=>/\.(mp3|m4a|ogg|wav|flac)$/i.test(name));
   return names.map(name=>({name:name.replace(/\.[^.]+$/,""),url:"/"+encodeURIComponent(folder)+"/"+encodeURIComponent(name),order:Number(name.match(/^\s*(\d+)/)?.[1]||999999),albumFolder:folder==="songs"?"":folder}));
  }catch{return []}
 }))).flat();
 files.sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,undefined,{numeric:true}));
 return NextResponse.json({files});
}
