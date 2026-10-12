"use client";
import {useEffect,useState} from "react";
import {Play,X,ArrowUpRight} from "lucide-react";
export type SelectedEntry={name:string;artist:string;title:string;work:string;creditName:string;image:string;key:string|null;genre?:string;spotifyUrl?:string;tracks?:{title:string;spotifyUrl?:string}[]};
function embed(url?:string){if(!url)return "";try{const u=new URL(url);if(u.hostname!=="open.spotify.com")return "";const m=u.pathname.match(/^\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([a-zA-Z0-9]{22})/);return m?"https://open.spotify.com/embed/"+m[1]+"/"+m[2]:""}catch{return ""}}
function formatCredit(work:string,name:string,lang:"de"|"en"){const jobs=work.replace(/\\s+by\\s*$/i,"").split("+").map(x=>x.trim()).filter(Boolean);const activities=jobs.length>1?jobs.slice(0,-1).join(", ")+(lang==="de"?" und ":" and ")+jobs[jobs.length-1]:(jobs[0]||"");return [activities,name].filter(Boolean).join(" · ")}
export default function SelectedCreditsGallery({entries,lang}:{entries:SelectedEntry[];lang:"de"|"en"}){
 const [active,setActive]=useState<SelectedEntry|null>(null);const [chosen,setChosen]=useState("");
 useEffect(()=>{if(!active)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setActive(null)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[active]);
 const open=(entry:SelectedEntry)=>{setActive(entry);setChosen(entry.spotifyUrl||"")};
 const current=embed(chosen);const isAlbum=!!active&&(!!active.tracks?.length||/\balbum\b/i.test(active.title)||/\/album\//.test(active.spotifyUrl||""));
 return <>{!entries.length&&<p className="amberCreditsEmpty">{lang==="de"?"Für diesen Filter sind noch keine zugeordneten Veröffentlichungen vorhanden.":"No releases have been assigned to this filter yet."}</p>}<div className="amberCoverGrid">{entries.map(e=><button className="amberCoverTile" type="button" key={e.name} onClick={()=>open(e)} aria-label={e.artist+" – "+e.title}>
  <img src={e.image} alt={e.artist+" – "+e.title} loading="lazy"/>
  <span className="amberCoverOverlay"><span className="amberMetaLabel">ARTIST / BAND</span><strong>{e.artist}</strong><span className="amberMetaLabel">{lang==="de"?"TITEL":"TITLE"}</span><span className="amberCoverTitle">{e.title||"—"}</span><span className="amberMetaLabel">CREDIT:</span><span className="amberCoverRole">{formatCredit(e.work,e.creditName,lang)}</span><span className="amberPlay"><Play size={22} fill="currentColor"/></span></span>
 </button>)}</div>
 {active&&<div className="amberPreviewBackdrop" onMouseDown={ev=>{if(ev.target===ev.currentTarget)setActive(null)}}>
 <section className={"amberPreviewPanel"+(isAlbum?" amberPreviewAlbum":"")} role="dialog" aria-modal="true" aria-label={active.artist+" "+active.title}>
 <button className="amberPreviewClose" onClick={()=>setActive(null)} aria-label={lang==="de"?"Schließen":"Close"}><X/></button>
 <div className="amberPreviewHead"><img src={active.image} alt=""/><div className="amberPreviewIdentity"><small>{isAlbum?(lang==="de"?"ALBUM / DISKOGRAFIE":"ALBUM / DISCOGRAPHY"):(lang==="de"?"SINGLE / REFERENZ":"SINGLE / CREDIT")}</small><h2>{active.artist}</h2><p>{active.title}</p><span>{formatCredit(active.work,active.creditName,lang)}</span></div><div className="amberPreviewBrand">AMBER<span>.</span></div></div>
 {isAlbum&&<div className="amberAlbumControls"><span>{lang==="de"?"HÖRPROBE / SPOTIFY":"PREVIEW / SPOTIFY"}</span><span>{active.tracks?.length?active.tracks.length+" TRACKS":lang==="de"?"ALBUM":"ALBUM"}</span></div>}
 {current?<iframe key={current} title={"Spotify: "+active.artist+" "+active.title} src={current+"?utm_source=generator&theme=0"} width="100%" height={isAlbum?280:352} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />:<div className="amberPreviewPending"><Play size={22}/><p>{lang==="de"?"Spotify-Verknüpfung wird vorbereitet. Noch keine Hörprobe hinterlegt.":"Spotify link is being prepared. No preview linked yet."}</p></div>}
 {isAlbum&&<div className="amberTrackList"><small>{lang==="de"?"TITELLISTE":"TRACKLIST"}</small>{active.tracks?.length?active.tracks.map((t,i)=><button type="button" key={i} disabled={!embed(t.spotifyUrl)} className={t.spotifyUrl===chosen?"chosen":""} onClick={()=>setChosen(t.spotifyUrl||"")}><span>{String(i+1).padStart(2,"0")}</span><strong>{t.title}</strong>{embed(t.spotifyUrl)?<Play size={13}/>:<span className="amberTrackPending">—</span>}</button>):<p className="amberTrackNote">{lang==="de"?"Die Titelliste wird ergänzt, sobald die offiziellen Titel zugeordnet sind.":"Track selection will appear once official releases have been linked."}</p>}</div>}
 {active.spotifyUrl&&<a className="amberSpotifyLink" href={active.spotifyUrl} target="_blank" rel="noopener noreferrer">{lang==="de"?"AUF SPOTIFY ÖFFNEN":"OPEN ON SPOTIFY"} <ArrowUpRight size={16}/></a>}
 </section></div>}</>
}
