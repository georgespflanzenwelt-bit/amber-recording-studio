import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 const root=path.join(process.cwd(),"public");
 const directories=["selected credits/Score","selected credits/Score Audio/Schattenwelt","selected credits/Score Audio/Vietnam","selected credits/Score Audio/Silvester Countdown"];
 const groups:Record<string,{name:string;url:string}[]>={};
 for(const folder of directories){
  try{
   const names=await readdir(path.join(root,folder));
   groups[folder]=names.filter(name=>/\.(mp3|m4a|wav|ogg|flac|png|jpe?g|webp|pdf)$/i.test(name)).map(name=>({name,url:"/"+folder.split("/").map(encodeURIComponent).join("/")+"/"+encodeURIComponent(name)}));
  }catch{groups[folder]=[]}
 }
 return NextResponse.json({groups});
}
