import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 const root=path.join(process.cwd(),"public");
 const folders=["songs","Donna Renee__Keep on believing","journey into DnB vol1","journey into DnB vol2"];
 try{
  const dirs=await readdir(root,{withFileTypes:true});
  folders.push(...dirs.filter(item=>item.isDirectory()&&!folders.includes(item.name)&&item.name.includes("__")).map(item=>item.name));
 }catch{}
 const files=(await Promise.all(folders.map(async folder=>{
  try{
   const names=(await readdir(path.join(root,folder))).filter(name=>/\.(mp3|m4a|ogg|wav|flac)$/i.test(name));
   return names.map(name=>({name:name.replace(/\.[^.]+$/,""),url:"/"+encodeURIComponent(folder)+"/"+encodeURIComponent(name),order:Number(name.match(/^\s*(\d+)/)?.[1]||999999),albumFolder:folder==="songs"?"":folder,albumKey:/^donna\s*renee[\s_]+keep\s*on\s*believing$/i.test(folder.replace(/_/g," ").replace(/\s+/g," ").trim())?"donna-renee-keep-on-believing":""}));
  }catch{return []}
 }))).flat();
 files.sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,undefined,{numeric:true}));
 return NextResponse.json({files});
}
