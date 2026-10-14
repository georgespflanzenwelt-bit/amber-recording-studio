import {NextResponse} from "next/server";
import {readdir,readFile} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
const extensions=/\.(jpg|jpeg|png|webp|avif)$/i;
const shorthand:Record<string,string>={C:"Composed",P:"Produced",R:"Remixed",RMX:"Remixed",M:"Mixed",Ma:"Mastered",CP:"Co-Produced",Rec:"Recorded",AP:"Additional Production"};
function expandArtistCredits(input:string){
 const groups=input.trim().replace(/\)\s+(?=(?:RMX|Rec|Ma|CP|AP|[CPRM])(?:\s|\(|\+|$))/gi,"), ").split(/,(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
 const parsed=groups.map(group=>{
  const pieces=group.split(/\+(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
  const roles=pieces.map(piece=>piece.match(/^(RMX|Rec|Ma|CP|AP|[CPRM])\s*(?:\(([\d,\s+]+)\))?$/i));
  if(roles.some(x=>!x))return null;
  const names=roles.map(match=>shorthand[match![1]]||shorthand[match![1].toUpperCase()]||match![1]);
  const suffix=roles[roles.length-1]?.[2];
  const namesOnly=names.length>1?names.slice(0,-1).join(", ")+" and "+names[names.length-1]:names[0];
  return namesOnly+(suffix?" ("+suffix.replace(/\s*,\s*/g,", ").replace(/\s*\+\s*/g," & ")+")":"");
 });
 return parsed.every(x=>x!==null)?parsed.join(" · "):input;
}
function parseArtistFilename(filename:string){
 const parts=filename.replace(/\.[^.]+$/,"").split("__").map(part=>part.replace(/[_]+/g," ").replace(/\s+/g," ").trim());
 const role=/\b(mix(?:ed|ing)?|master(?:ed|ing)?|produc(?:ed|tion|er)?|compos(?:ed|er|ition)?|record(?:ed|ing)?|remix(?:ed)?|arrang(?:ed|ement)?|engineer|songwrit(?:er|ing)?)\b/i;
 // Legacy: Artist__Title__Work__Name__Year
 // New:    Artist__Title__Optional Label__Work__Name__[Year]
 const isCredit=(value:string)=>role.test(value)||expandArtistCredits(value)!==value;
 const hasLabel=parts.length>=5&&(!parts[2]||!isCredit(parts[2]))&&isCredit(parts[3]||"");
 const shift=hasLabel?1:0;
 return {name:parts[0]||"",title:parts[1]||"",label:hasLabel?(parts[2]||""):"",contribution:expandArtistCredits(parts[2+shift]||""),by:parts[3+shift]||"George Brasch",year:parts[4+shift]||""};
}
function titleFromFilename(name:string){
 return name.replace(/\.[^.]+$/,"").replace(/^(\d+[ _.-]+)|([_-]+\d+)$/g,"").replace(/[_-]+/g," ").replace(/\s+/g," ").trim();
}
export async function GET(){
 try{
  const root=path.join(process.cwd(),"public","images","artist");
  const files=(await readdir(root,{withFileTypes:true})).filter(f=>f.isFile()&&extensions.test(f.name)).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
  const metadata=JSON.parse(await readFile(path.join(process.cwd(),"data","artists.json"),"utf8").catch(()=>"{}")) as {artists?:Record<string,{name?:string;title?:string;contribution?:string;year?:string;description?:string;by?:string;label?:string}>};
  const artists=files.map((f,i)=>{
   const parsed=parseArtistFilename(f.name);
   const info=metadata.artists?.[f.name];
   return {id:String(i)+"-"+f.name,name:info?.name||parsed.name||titleFromFilename(f.name),image:"/images/artist/"+encodeURIComponent(f.name),title:info?.title||parsed.title,label:info?.label??parsed.label,contribution:info?.contribution?expandArtistCredits(info.contribution):parsed.contribution,by:info?.by||parsed.by,year:info?.year||parsed.year,description:info?.description||""};
  });
  return NextResponse.json({artists});
 }catch{return NextResponse.json({artists:[]})}
}
