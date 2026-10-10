import {NextResponse} from "next/server";
import {readdir} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
const extensions=/\.(jpg|jpeg|png|webp|avif)$/i;
function titleFromFilename(name:string){
 return name.replace(/\.[^.]+$/,"").replace(/^(\d+[ _.-]+)|([_-]+\d+)$/g,"").replace(/[_-]+/g," ").replace(/\s+/g," ").trim();
}
export async function GET(){
 try{
  const root=path.join(process.cwd(),"public","images","artist");
  const files=(await readdir(root,{withFileTypes:true})).filter(f=>f.isFile()&&extensions.test(f.name)).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
  const artists=files.map((f,i)=>({id:String(i)+"-"+f.name,name:titleFromFilename(f.name),image:"/images/artist/"+encodeURIComponent(f.name)}));
  return NextResponse.json({artists});
 }catch{return NextResponse.json({artists:[]})}
}
