import {NextResponse} from "next/server";
import {readdir,readFile} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
const extensions=/\.(jpg|jpeg|png|webp|avif)$/i;
function parseArtistFilename(filename:string){
 const parts=filename.replace(/\.[^.]+$/,"").split("__").map(part=>part.replace(/[_]+/g," ").replace(/\s+/g," ").trim());
 return {name:parts[0]||"",title:parts[1]||"",contribution:parts[2]||"",by:parts[3]||"George Brasch",year:parts[4]||""};
}
function titleFromFilename(name:string){
 return name.replace(/\.[^.]+$/,"").replace(/^(\d+[ _.-]+)|([_-]+\d+)$/g,"").replace(/[_-]+/g," ").replace(/\s+/g," ").trim();
}
export async function GET(){
 try{
  const root=path.join(process.cwd(),"public","images","artist");
  const files=(await readdir(root,{withFileTypes:true})).filter(f=>f.isFile()&&extensions.test(f.name)).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
  const metadata=JSON.parse(await readFile(path.join(process.cwd(),"data","artists.json"),"utf8").catch(()=>"{}")) as {artists?:Record<string,{name?:string;title?:string;contribution?:string;year?:string;description?:string;by?:string}>};
  const artists=files.map((f,i)=>{
   const parsed=parseArtistFilename(f.name);
   const info=metadata.artists?.[f.name];
   return {id:String(i)+"-"+f.name,name:info?.name||parsed.name||titleFromFilename(f.name),image:"/images/artist/"+encodeURIComponent(f.name),title:info?.title||parsed.title,contribution:info?.contribution||parsed.contribution,by:info?.by||parsed.by,year:info?.year||parsed.year,description:info?.description||""};
  });
  return NextResponse.json({artists});
 }catch{return NextResponse.json({artists:[]})}
}
