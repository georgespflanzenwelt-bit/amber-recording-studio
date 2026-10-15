import {NextResponse} from "next/server";
import {readdir,readFile} from "node:fs/promises";
import path from "node:path";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const names=(await readdir(path.join(process.cwd(),"public","selected credits"))).filter(x=>/\.(jpe?g|png|webp|avif)$/i.test(x)).sort();
  const metadata=JSON.parse(await readFile(path.join(process.cwd(),"data","selected-credits.json"),"utf8").catch(()=>"{}")) as {covers?:Record<string,{genre?:string;spotifyUrl?:string;youtubeUrl?:string;tracks?:{title:string;spotifyUrl?:string}[]}>;releases?:Record<string,{genre?:string;spotifyUrl?:string;youtubeUrl?:string;tracks?:{title:string;spotifyUrl?:string}[]}>};
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
   const codes:Record<string,string>={C:"Composed",P:"Produced",R:"Remixed",RMX:"Remixed",M:"Mixed",Ma:"Mastered",CP:"Co-Produced",Rec:"Recorded",ap:"Additional Production",Ap:"Additional Production",AP:"Additional Production"};
   const groups=(value:string)=>value.replace(/\)\s+(?=(?:RMX|Rec|Ma|CP|ap|[CPRM])(?:\s|\(|\+|$))/gi,"), ").split(/,(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
   const roles=(value:string)=>value.split(/\+(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
   const roleBase=(value:string)=>value.replace(/\s+by\s*$/i,"").replace(/\s*\((?:\d+(?:\s*[+,]\s*\d+)*|except\s+(?:T\s*)?[\d\s,+-]+)\)\s*$/i,"").trim();
   const isOneRole=(value:string)=>/^(?:C|P|R|RMX|M|Ma|CP|Rec|ap)$/i.test(roleBase(value))||roleWords.test(roleBase(value));
   const isRole=(value:string)=>groups(value).every(group=>roles(group).every(isOneRole));
   const expandRole=(value:string)=>groups(value).map(group=>{
    const pieces=roles(group);
    const expanded=pieces.map(part=>{
     const trimmed=part.replace(/\s+by\s*$/i,"").trim();
     const match=trimmed.match(/^(.*?)\s*\((\d+(?:\s*[+,]\s*\d+)*)\)$/);
     const except=trimmed.match(/^(.*?)\s*\(\s*except\s+(?:T\s*)?([\d\s,+-]+)\s*\)$/i);
     const role=roleBase(trimmed);
     return (codes[role]||codes[role.toUpperCase()]||role)+(except?" (except tracks "+except[2].trim().replace(/\s*[+,]\s*/g,", ")+")":match?" ("+match[2].replace(/\s*\+\s*/g," & ").replace(/\s*,\s*/g,", ")+")":"");
    });
    return expanded.join("+");
   }).join(" · ");
   const hasLabel=workEnd-workStart>=3&&!isRole(parts[workStart]||"")&&isRole(parts[workStart+1]||"");
   const label=hasLabel?parts[workStart]:"";
   const workParts=parts.slice(workStart+(hasLabel?1:0),workEnd);
   const work=workParts.filter(x=>!/^by\s+/i.test(x)&&!/^George Brasch\s*\.?$/i.test(x)).map(expandRole).join(" · ").trim();
   const creditName=parts.find(x=>/George Brasch/i.test(x))?.match(/George Brasch/i)?.[0]||"George Brasch";
   const image="/selected%20credits/"+encodeURIComponent(name);
   const lower=(artist+" "+title).toLowerCase();
   const key=/^azad\b/.test(lower)?"azad":/till|tll br/.test(lower)&&/blue eye/.test(lower)?"till":/deborah cox/.test(lower)?"deborah":/kool savas/.test(lower)&&/haus|boot|aus.*bot/.test(lower)?"kool":null;
   const releaseKey=(artist+"::"+title).normalize("NFC").toLowerCase().replace(/[’´`]/g,"\x27").replace(/\s+/g," ").trim();
   const brotherAlbum=/^brothers?\s+keepers?$/i.test(artist)&&/^am\s+i\s+my\s+brother.?s\s+keeper/i.test(title);
   const extra=metadata.covers?.[name]||metadata.releases?.[releaseKey]||(brotherAlbum?{spotifyUrl:"https://open.spotify.com/track/2YhD29djlTeNcHGN5MtD8N"}:{});
   return {name,artist,title,label,work,creditName,trackNumbers,image,key,genre:extra.genre||(hasFilenameGenre?parsedGenres.join(", "):""),spotifyUrl:extra.spotifyUrl||"",youtubeUrl:extra.youtubeUrl||"",tracks:Array.isArray(extra.tracks)?extra.tracks:[]};
  });
  entries.sort((a,b)=>a.artist.localeCompare(b.artist,"de",{sensitivity:"base",numeric:true})||a.title.localeCompare(b.title,"de",{sensitivity:"base",numeric:true}));
  // Replit may retain duplicate cover files alongside the tracked originals.
  // Show a credit only once, without deleting any cover or changing distinct releases.
  const canonical=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
  const seen=new Set<string>();
  const uniqueEntries=entries.filter(entry=>{
   const identity=[entry.artist,entry.title,entry.label,entry.work,entry.creditName,entry.trackNumbers].map(canonical).join("|");
   if(seen.has(identity))return false;
   seen.add(identity);
   return true;
  });
  const covers=Object.fromEntries(uniqueEntries.filter(e=>e.key).map(e=>[e.key,e.image]));
  return NextResponse.json({covers,entries:uniqueEntries});
 }catch{return NextResponse.json({covers:{},entries:[]})}
}
