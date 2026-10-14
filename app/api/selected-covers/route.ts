import {NextResponse} from "next/server";
import {readdir,readFile} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const names=(await readdir(path.join(process.cwd(),"public","selected credits"))).filter(x=>/\.(jpe?g|png|webp|avif)$/i.test(x)).sort();
  const metadata=JSON.parse(await readFile(path.join(process.cwd(),"data","selected-credits.json"),"utf8").catch(()=>"{}")) as {covers?:Record<string,{genre?:string;spotifyUrl?:string;tracks?:{title:string;spotifyUrl?:string}[]}>};
  const entries=names.map(name=>{
   const parts=name.replace(/\.[^.]+$/,"").split(/__+/).map(s=>s.replace(/_/g," ").replace(/\s+/g," ").trim());
   const first=parts[0]||"";
   const single=first.match(/^(.+?)\s+-\s+(.+)$/);
   const artist=single?single[1].trim():first.replace(/\s+(?:Leben|Blue Eyes Soul)\s*\(Album\).*$/i,"").trim();
   const title=single?single[2].trim():(parts[1]&&!/^(mixed|remix|record|produc|engineer)/i.test(parts[1])?parts[1]:first.slice(artist.length).replace(/^\s*[-–]\s*/,"").trim());
   const validGenres=["Hip-Hop","Soul","R&B","Jazz","Reggae","Pop","Rock","Electronic","House","Drum & Bass"];
   const norm=(v:string)=>v.toLowerCase().replace(/[\s-]/g,"").replace(/&/g,"and");
   const last=parts[parts.length-1]||"";
   const trackNumbers=/^(?:all|\d+(?:\s*[-–]\s*\d+)?(?:\s*,\s*\d+(?:\s*[-–]\s*\d+)?)*)$/i.test(last)?(/^all$/i.test(last)?"All":last.split(",").map(x=>x.trim().replace(/\s*[-–]\s*/g,"–")).join(", ")):"";
   const genreField=trackNumbers?parts[parts.length-2]||"":last;
   const candidates=genreField.split("+").map(x=>x.trim()).filter(Boolean);
   const parsedGenres=candidates.map(x=>validGenres.find(g=>norm(g)===norm(x)||g==="Hip-Hop"&&norm(x)==="hiphop"||g==="Electronic"&&norm(x)==="elektronic"||g==="Drum & Bass"&&norm(x)==="dnb"));
   const hasFilenameGenre=candidates.length>0&&parsedGenres.every(Boolean);
   const workEnd=parts.length-(trackNumbers?1:0)-(hasFilenameGenre?1:0);
   const workStart=parts[1]===title?2:1;
   const roleWords=/\b(?:mix(?:ed|ing)?|master(?:ed|ing)?|produc(?:ed|tion|er)?|compos(?:ed|er|ition)?|record(?:ed|ing)?|remix(?:ed)?|arrang(?:ed|ement)?|engineer|songwrit(?:er|ing)?)\b/i;
   const expandRole=(value:string)=>value.split("+").map(part=>{
    const trimmed=part.trim().replace(/\s+by\s*$/i,"").trim();
    const codes:Record<string,string>={C:"Composed",P:"Produced",R:"Remixed",M:"Mixed",Ma:"Mastered",CP:"Co-Produced"};
    return codes[trimmed]||trimmed;
   }).join("+");
   const isRole=(value:string)=>value.split("+").every(part=>{const cleaned=part.trim().replace(/\s+by\s*$/i,"").trim();return /^(?:C|P|R|M|Ma|CP)$/.test(cleaned)||roleWords.test(cleaned)});
   const hasLabel=workEnd-workStart>=3&&!isRole(parts[workStart]||"")&&isRole(parts[workStart+1]||"");
   const label=hasLabel?parts[workStart]:"";
   const workParts=parts.slice(workStart+(hasLabel?1:0),workEnd);
   const work=workParts.filter(x=>!/^by\s+/i.test(x)&&!/^George Brasch\s*\.?$/i.test(x)).map(expandRole).join(" · ").trim();
   const creditName=parts.find(x=>/George Brasch/i.test(x))?.match(/George Brasch/i)?.[0]||"George Brasch";
   const image="/selected%20credits/"+encodeURIComponent(name);
   const lower=(artist+" "+title).toLowerCase();
   const key=/^azad\b/.test(lower)?"azad":/till|tll br/.test(lower)&&/blue eye/.test(lower)?"till":/deborah cox/.test(lower)?"deborah":/kool savas/.test(lower)&&/haus|boot|aus.*bot/.test(lower)?"kool":null;
   const extra=metadata.covers?.[name]||{};
   return {name,artist,title,label,work,creditName,trackNumbers,image,key,genre:extra.genre||(hasFilenameGenre?parsedGenres.join(", "):""),spotifyUrl:extra.spotifyUrl||"",tracks:Array.isArray(extra.tracks)?extra.tracks:[]};
  });
  entries.sort((a,b)=>a.artist.localeCompare(b.artist,"de",{sensitivity:"base",numeric:true})||a.title.localeCompare(b.title,"de",{sensitivity:"base",numeric:true}));
  const covers=Object.fromEntries(entries.filter(e=>e.key).map(e=>[e.key,e.image]));
  return NextResponse.json({covers,entries});
 }catch{return NextResponse.json({covers:{},entries:[]})}
}
