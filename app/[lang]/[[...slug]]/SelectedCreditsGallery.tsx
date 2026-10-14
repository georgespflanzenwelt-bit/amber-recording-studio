"use client";
import {useEffect,useState} from "react";
import {Play,X,ArrowUpRight} from "lucide-react";
export type SelectedEntry={name:string;artist:string;title:string;label?:string;work:string;creditName:string;trackNumbers?:string;image:string;key:string|null;genre?:string;spotifyUrl?:string;tracks?:{title:string;spotifyUrl?:string}[]};
function embed(url?:string){if(!url)return "";try{const u=new URL(url);if(u.hostname!=="open.spotify.com")return "";const m=u.pathname.match(/^\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([a-zA-Z0-9]{22})/);return m?"https://open.spotify.com/embed/"+m[1]+"/"+m[2]:""}catch{return ""}}
function formatActivity(work:string,trackNumbers:string|undefined,lang:"de"|"en"){
 const jobs=work.replace(/\s+by\s*$/i,"").split("+").map(x=>x.trim()).filter(Boolean);
 const activity=jobs.length>1?jobs.slice(0,-1).join(", ")+(lang==="de"?" und ":" and ")+jobs[jobs.length-1]:(jobs[0]||"");
 return trackNumbers==="All"?"All "+activity:[trackNumbers?(trackNumbers.includes(",")||trackNumbers.includes("–")?"Tracks ":"Track ")+(trackNumbers.split(",").length===2?trackNumbers.split(",").map(n=>n.trim()).join(" & "):trackNumbers):"",activity].filter(Boolean).join(" – ");
}
function CreditLines({entry,lang}:{entry:SelectedEntry;lang:"de"|"en"}){
 return <><span className="amberCreditActivity">{formatActivity(entry.work,entry.trackNumbers,lang)}</span><span className="amberCreditName">{entry.creditName}</span></>;
}

function normalizeSong(value:string){return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ")}
function songTitle(value:string){
 return normalizeSong(value.replace(/\s*\([^)]*\)/g,"").split(/\s+(?:ft\.?|feat\.?|featuring)\s+/i)[0].replace(/\b(?:single|album|ep|maxi)\b/gi,""));
}
function matchLocalSongs(entry:SelectedEntry|null,files:{name:string;url:string;order?:number}[]){
 if(!entry)return [];
 const artist=normalizeSong(entry.artist);
 const title=songTitle(entry.title);
 if(!artist||!title)return [];
 // All files in public/songs are eligible. Compare artist and song, ignoring
 // featuring credits and subsequent version/label details.
 const matches=files.filter(file=>{
  const sections=file.name.replace(/^\s*\d+\s*/,"").split(/__+/).map(x=>x.trim()).filter(Boolean);
  if(sections.length>=2){
   return normalizeSong(sections[0])===artist&&songTitle(sections[1])===title;
  }
  const full=normalizeSong(file.name.replace(/^\s*\d+\s*/,""));
  const prefix=artist+" "+title;
  return full===prefix||full.startsWith(prefix+" ");
 });
 return matches.sort((a,b)=>(a.order||999999)-(b.order||999999));
}
export default function SelectedCreditsGallery({entries,lang}:{entries:SelectedEntry[];lang:"de"|"en"}){
 const [active,setActive]=useState<SelectedEntry|null>(null);const [chosen,setChosen]=useState("");const [localChoice,setLocalChoice]=useState("");
 const [localSongs,setLocalSongs]=useState<{name:string;url:string;order?:number}[]>([]);
 useEffect(()=>{fetch("/api/local-songs",{cache:"no-store"}).then(r=>r.json()).then(data=>setLocalSongs(data.files||[])).catch(()=>{})},[]);
 useEffect(()=>{if(!active)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setActive(null)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[active]);
 const open=(entry:SelectedEntry)=>{setActive(entry);setChosen(entry.spotifyUrl||"");setLocalChoice("")};
 const current=embed(chosen);
 const localMatches=matchLocalSongs(active,localSongs);const localAudio=localMatches.find(x=>x.url===localChoice)?.url||localMatches[0]?.url;
 const isAlbum=!!active&&(!!active.tracks?.length||/\balbum\b/i.test(active.title)||/\/album\//.test(active.spotifyUrl||""));
 return <>{!entries.length&&<p className="amberCreditsEmpty">{lang==="de"?"Für diesen Filter sind noch keine zugeordneten Veröffentlichungen vorhanden.":"No releases have been assigned to this filter yet."}</p>}<div className="amberCoverGrid">{entries.map((e,i)=><button className="amberCoverTile" type="button" key={e.name} onClick={()=>open(e)} aria-label={e.artist+" – "+e.title}>
  <img src={e.image} alt={e.artist+" – "+e.title} loading={i<10?"eager":"lazy"} fetchPriority={i<5?"high":"auto"}/>
  <span className="amberCoverOverlay"><span className="amberMetaLabel">ARTIST / BAND</span><strong>{e.artist}</strong><span className="amberMetaLabel">{lang==="de"?"TITEL":"TITLE"}</span><span className="amberCoverTitle">{e.title||"—"}</span>{e.label&&<><span className="amberMetaLabel">LABEL</span><span className="amberCoverTitle">{e.label}</span></>}<span className="amberMetaLabel">CREDIT:</span><span className="amberCoverRole"><CreditLines entry={e} lang={lang}/></span><span className="amberPlay"><Play size={22} fill="currentColor"/></span></span>
 </button>)}</div>
 {active&&<div className="amberPreviewBackdrop" onMouseDown={ev=>{if(ev.target===ev.currentTarget)setActive(null)}}>
 <section className={"amberPreviewPanel"+(isAlbum?" amberPreviewAlbum":"")} role="dialog" aria-modal="true" aria-label={active.artist+" "+active.title}>
 <button className="amberPreviewClose" onClick={()=>setActive(null)} aria-label={lang==="de"?"Schließen":"Close"}><X/></button>
 <div className="amberPreviewHead"><img src={active.image} alt=""/><div className="amberPreviewIdentity"><small>{isAlbum?(lang==="de"?"ALBUM / DISKOGRAFIE":"ALBUM / DISCOGRAPHY"):(lang==="de"?"SINGLE / REFERENZ":"SINGLE / CREDIT")}</small><h2>{active.artist}</h2><p>{active.title}</p>{active.label&&<p className="amberPreviewLabel"><b>LABEL:</b> {active.label}</p>}<span className="amberPreviewCredit"><CreditLines entry={active} lang={lang}/></span></div><div className="amberPreviewBrand">AMBER<span>.</span></div></div>
 {isAlbum&&<div className="amberAlbumControls"><span>{lang==="de"?"HÖRPROBE / SPOTIFY":"PREVIEW / SPOTIFY"}</span><span>{active.tracks?.length?active.tracks.length+" TRACKS":lang==="de"?"ALBUM":"ALBUM"}</span></div>}
 {localAudio?<div className="amberLocalPlayer"><small>AMBER / AUDIO</small><audio key={localAudio} src={localAudio} controls preload="metadata" controlsList="nodownload" style={{width:"100%"}}>{lang==="de"?"Dein Browser unterstützt die Audiowiedergabe nicht.":"Your browser does not support audio playback."}</audio></div>:current?<iframe key={current} title={"Spotify: "+active.artist+" "+active.title} src={current+"?utm_source=generator&theme=0"} width="100%" height={isAlbum?280:352} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />:<div className="amberPreviewPending"><Play size={22}/><p>{lang==="de"?"Spotify-Verknüpfung wird vorbereitet. Noch keine Hörprobe hinterlegt.":"Spotify link is being prepared. No preview linked yet."}</p></div>}
 {isAlbum&&<div className="amberTrackList"><small>{lang==="de"?"TITELLISTE":"TRACKLIST"}</small>{active.tracks?.length?active.tracks.map((t,i)=><button type="button" key={i} disabled={!embed(t.spotifyUrl)} className={t.spotifyUrl===chosen?"chosen":""} onClick={()=>setChosen(t.spotifyUrl||"")}><span>{String(i+1).padStart(2,"0")}</span><strong>{t.title}</strong>{embed(t.spotifyUrl)?<Play size={13}/>:<span className="amberTrackPending">—</span>}</button>):<p className="amberTrackNote">{lang==="de"?"Die Titelliste wird ergänzt, sobald die offiziellen Titel zugeordnet sind.":"Track selection will appear once official releases have been linked."}</p>}</div>}
 {active.spotifyUrl&&<a className="amberSpotifyLink" href={active.spotifyUrl} target="_blank" rel="noopener noreferrer">{lang==="de"?"AUF SPOTIFY ÖFFNEN":"OPEN ON SPOTIFY"} <ArrowUpRight size={16}/></a>}
 </section></div>}</>
}
