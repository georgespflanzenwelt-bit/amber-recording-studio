import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const names=(await readdir(path.join(process.cwd(),"public","selected credits"))).filter(x=>/\.(jpe?g|png|webp|avif)$/i.test(x));
  const find=(prefix:string)=>{const name=names.find(x=>x.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase()));return name?"/selected%20credits/"+encodeURIComponent(name):null};
  return NextResponse.json({covers:{azad:find("AZAD_Leben"),till:(()=>{const name=names.find(x=>x.toLowerCase().includes("blue eyes soul"));return name?"/selected%20credits/"+encodeURIComponent(name):null})(),deborah:find("Deborah Cox__ September")}});
 }catch{return NextResponse.json({covers:{}})}
}
