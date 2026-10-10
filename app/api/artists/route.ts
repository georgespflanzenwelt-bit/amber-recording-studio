import {NextResponse} from "next/server";
import {readdir,readFile} from "node:fs/promises";
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
  const metadata=JSON.parse(await readFile(path.join(process.cwd(),"data","artists.json"),"utf8").catch(()=>"{}")) as {artists?:Record<string,{name?:string;title?:string;contribution?:string;year?:string;description?:string}>};
  const artists=files.map((f,i)=>({id:String(i)+"-"+f.name,name:metadata.artists?.[f.name]?.name||titleFromFilename(f.name),image:"/images/artist/"+encodeURIComponent(f.name),title:metadata.artists?.[f.name]?.title||"",contribution:metadata.artists?.[f.name]?.contribution||"",year:metadata.artists?.[f.name]?.year||"",description:metadata.artists?.[f.name]?.description||""}));
  return NextResponse.json({artists});
 }catch{return NextResponse.json({artists:[]})}
}
