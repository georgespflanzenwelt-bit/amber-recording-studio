import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const dir=path.join(process.cwd(),"public","images","Amber old");
  const names=await readdir(dir);
  const match=names.find(name=>/amber.*upper.*studio/i.test(name)&&/afrob/i.test(name)&&/desu/i.test(name)&&/\.(jpe?g|png|webp)$/i.test(name));
  return NextResponse.json({url:match?"/images/Amber%20old/"+encodeURIComponent(match):null});
 }catch{return NextResponse.json({url:null})}
}
