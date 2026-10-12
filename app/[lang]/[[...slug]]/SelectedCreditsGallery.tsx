"use client";
import {useEffect,useState} from "react";
import {Play,X,ArrowUpRight} from "lucide-react";
export type SelectedEntry={name:string;artist:string;title:string;work:string;creditName:string;image:string;key:string|null;genre?:string;spotifyUrl?:string;tracks?:{title:string;spotifyUrl?:string}[]};
function embed(url?:string){if(!url)return "";try{const u=new URL(url);if(u.hostname!=="open.spotify.com")return "";const m=u.pathname.match(/^\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([a-zA-Z0-9]{22})/);return m?"https://open.spotify.com/embed/"+m[1]+"/"+m[2]:""}catch{return ""}}
export default function SelectedCreditsGallery({entries,lang}:{entries:SelectedEntry[];lang:"de"|"en"}){
 const [active,setActive]=useState<SelectedEntry|null>(null);const [chosen,setChosen]=useState("");
 useEffect(()=>{if(!active)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setActive(null)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[active]);
 const open=(entry:SelectedEntry)=>{setActive(entry);setChosen(entry.spotifyUrl||"")};
 const current=embed(chosen);
 return <><div className="amberCoverGrid">{entries.map(e=><button className="amberCoverTile" type="button" key={e.name} onClick={()=>open(e)} aria-label={e.artist+" – "+e.title}>
  <img src={e.image} alt={e.artist+" – "+e.title} loading="lazy"/>
  <span className="amberCoverOverlay"><span className="amberMetaLabel">ARTIST / BAND</span><strong>{e.artist}</strong><span className="amberMetaLabel">TITLE</span><span className="amberCoverTitle">{e.title||"—"}</span><span className="amberMetaLabel">CREDITS:</span><span className="amberCoverRole">{[e.work,e.creditName].filter(Boolean).join(" · ")}</span><span className="amberPlay"><Play size={22} fill="currentColor"/></span></span>
 </button>)}</div>
 {active&&<div className="amberPreviewBackdrop" onMouseDown={ev=>{if(ev.target===ev.currentTarget)setActive(null)}}>
 <section className="amberPreviewPanel" role="dialog" aria-modal="true" aria-label={active.artist+" "+active.title}>
 <button className="amberPreviewClose" onClick={()=>setActive(null)} aria-label={lang==="de"?"Schließen":"Close"}><X/></button>
 <div className="amberPreviewHead"><img src={active.image} alt=""/><div><small>SELECTED CREDITS</small><h2>{active.artist}</h2><p>{active.title}</p><span>{[active.work,active.creditName].filter(Boolean).join(" · ")}</span></div></div>
 {current?<iframe key={current} title={"Spotify: "+active.artist+" "+active.title} src={current+"?utm_source=generator&theme=0"} width="100%" height={active.tracks?.length?250:352} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />:<div className="amberPreviewPending"><Play size={22}/><p>{lang==="de"?"Spotify-Verknüpfung wird vorbereitet. Noch keine Hörprobe hinterlegt.":"Spotify link is being prepared. No preview linked yet."}</p></div>}
 {!!active.tracks?.length&&<div className="amberTrackList"><small>TRACKLIST</small>{active.tracks.map((t,i)=><button type="button" key={i} disabled={!embed(t.spotifyUrl)} className={t.spotifyUrl===chosen?"chosen":""} onClick={()=>setChosen(t.spotifyUrl||"")}><span>{String(i+1).padStart(2,"0")}</span><strong>{t.title}</strong><Play size={13}/></button>)}</div>}
 {active.spotifyUrl&&<a className="amberSpotifyLink" href={active.spotifyUrl} target="_blank" rel="noopener noreferrer">OPEN ON SPOTIFY <ArrowUpRight size={16}/></a>}
 </section></div>}</>
}
