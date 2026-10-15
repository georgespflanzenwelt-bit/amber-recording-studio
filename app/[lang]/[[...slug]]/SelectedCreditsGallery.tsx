"use client";
import {useEffect,useRef,useState} from "react";
import {Play,Pause,SkipBack,SkipForward,X,ArrowUpRight} from "lucide-react";
export type SelectedEntry={name:string;artist:string;title:string;label?:string;work:string;creditName:string;trackNumbers?:string;image:string;key:string|null;genre?:string;spotifyUrl?:string;youtubeUrl?:string;tracks?:{title:string;spotifyUrl?:string}[]};
function embed(url?:string){if(!url)return "";try{const u=new URL(url);if(u.hostname!=="open.spotify.com")return "";const m=u.pathname.match(/^\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([a-zA-Z0-9]{22})/);return m?"https://open.spotify.com/embed/"+m[1]+"/"+m[2]:""}catch{return ""}}
function formatActivity(work:string,trackNumbers:string|undefined,lang:"de"|"en"){
 const activity=work.replace(/\s+by\s*$/i,"").split(/\s*·\s*/).filter(Boolean).map(group=>{
  const jobs=group.split(/\+(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
  const shared=jobs.length>1?jobs[jobs.length-1].match(/\s*(\(\d+(?:\s*[, &+]\s*\d+)*\))$/):null;
  if(shared)jobs[jobs.length-1]=jobs[jobs.length-1].slice(0,-shared[1].length).trim();
  const joined=jobs.length>1?jobs.slice(0,-1).join(", ")+(lang==="de"?" und ":" and ")+jobs[jobs.length-1]:(jobs[0]||"");
  return joined+(shared?" "+shared[1]:"");
 }).join(" · ");
 return trackNumbers==="All"?"All "+activity:[trackNumbers?(trackNumbers.includes(",")||trackNumbers.includes("–")?"Tracks ":"Track ")+(trackNumbers.split(",").length===2?trackNumbers.split(",").map(n=>n.trim()).join(" & "):trackNumbers):"",activity].filter(Boolean).join(" – ");
}
function CreditLines({entry,lang}:{entry:SelectedEntry;lang:"de"|"en"}){
 return <><span className="amberCreditActivity">{formatActivity(entry.work,entry.trackNumbers,lang)}</span><span className="amberCreditName">{entry.creditName}</span></>;
}

function normalizeSong(value:string){return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ")}
function songTitle(value:string){
 return normalizeSong(value.replace(/\s*\([^)]*\)/g,"").split(/\s+(?:ft\.?|feat\.?|featuring)\s+/i)[0].replace(/\b(?:single|album|ep|maxi)\b/gi,""));
}
function matchLocalSongs(entry:SelectedEntry|null,files:{name:string;url:string;order?:number;albumFolder?:string;albumKey?:string}[]){
 if(!entry)return [];
 const artist=normalizeSong(entry.artist);
 const title=songTitle(entry.title);
 if(!artist||!title)return [];
 // All files in public/songs are eligible. Compare artist and song, ignoring
 // featuring credits and subsequent version/label details.
 const daizzSingle=artist==="daizz"&&title.startsWith("didn t i");
 if(daizzSingle)return files.filter(file=>normalizeSong(file.albumFolder||"")==="daizz").sort((a,b)=>(a.order??999999)-(b.order??999999)||a.name.localeCompare(b.name,undefined,{numeric:true}));
 const bloodAndVeins=artist==="best boy electric"&&title==="blood veins";
 if(bloodAndVeins)return files.filter(file=>normalizeSong(file.albumFolder||"")==="journey into dnb vol1"&&file.order===9&&normalizeSong(file.name).includes("blood veins"));
 const journeyVolume=artist==="a journey into dnb"?(title==="vol 1"?"journey into dnb vol1":title==="vol 2"?"journey into dnb vol2":""):"";
 if(journeyVolume){
  return files.filter(file=>normalizeSong(file.albumFolder||"")===normalizeSong(journeyVolume)).sort((a,b)=>(a.order??999999)-(b.order??999999)||a.name.localeCompare(b.name,undefined,{numeric:true}));
 }
 const belloSingle=artist==="mistha bello"&&title==="daddy on the run";
 if(belloSingle){
  return files.filter(file=>normalizeSong(file.albumFolder||"")==="bello daddy on the run").sort((a,b)=>(a.order??999999)-(b.order??999999)||a.name.localeCompare(b.name,undefined,{numeric:true}));
 }
 const donnaAlbum=artist.includes("donna renee")&&normalizeSong(entry.title).includes("keep on believing");
 if(donnaAlbum){
  const selected=files.filter(file=>normalizeSong(decodeURIComponent(file.url||"")).includes("donna renee")&&normalizeSong(decodeURIComponent(file.url||"")).includes("keep on believing"));
  return selected.sort((a,b)=>(a.order??999999)-(b.order??999999)||a.name.localeCompare(b.name,undefined,{numeric:true}));
 }
 const dabruEp=artist.includes("dabrutack")&&normalizeSong(entry.title).includes("wie man s spricht");
 if(dabruEp){
  return files.filter(file=>normalizeSong(file.albumFolder||"")==="dabrutack").sort((a,b)=>(a.order??999999)-(b.order??999999)||a.name.localeCompare(b.name,undefined,{numeric:true}));
 }
 const meliAlbum=artist==="meli"&&title==="skill en masse";
 if(meliAlbum){
  return files.filter(file=>normalizeSong(file.albumFolder||"")==="meli skills en masse").sort((a,b)=>(a.order??999999)-(b.order??999999)||a.name.localeCompare(b.name,undefined,{numeric:true}));
 }
 const albumFiles=files.filter(file=>{
  if(!file.albumFolder)return false;
  const folder=normalizeSong(file.albumFolder);
  if(artist==="donna renee"&&title==="keep on believing")return folder.startsWith("donna renee")&&folder.includes("keep on believing");
  return folder===normalizeSong(entry.artist+" "+entry.title.replace(/\s*\(album\)\s*$/i,""));
 });
 if(albumFiles.length)return albumFiles.sort((a,b)=>(a.order||999999)-(b.order||999999)||a.name.localeCompare(b.name,undefined,{numeric:true}));
 const matches=files.filter(file=>{if(file.albumFolder)return false;
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

function displayLocalTitle(name:string,artist:string){
 const stripped=name.replace(/^\s*\d+\s*/,"").split(/__+/);
 return (stripped.length>1&&(normalizeSong(stripped[0])===normalizeSong(artist)||normalizeSong(artist)==="mistha bello"&&normalizeSong(stripped[0])==="bello")?stripped.slice(1).join(" "):stripped.join(" ")).replace(/_/g," ").trim();
}

function LocalDiscography({songs,selected,onSelect,artist,title,cover,entry,lang}:{songs:{name:string;url:string;order?:number}[];selected:string;onSelect:(url:string)=>void;artist:string;title:string;cover:string;entry:SelectedEntry;lang:"de"|"en"}){
 const audio=useRef<HTMLAudioElement>(null);
 const resumeOnChange=useRef(false);
 const [playing,setPlaying]=useState(false),[time,setTime]=useState(0),[duration,setDuration]=useState(0);
 const [lengths,setLengths]=useState<Record<string,number>>({});
 const [audioError,setAudioError]=useState("");
 const index=Math.max(0,songs.findIndex(s=>s.url===selected));
 const fmt=(n:number)=>Number.isFinite(n)?Math.floor(n/60).toString().padStart(2,"0")+":"+Math.floor(n%60).toString().padStart(2,"0"):"--:--";
 useEffect(()=>{setPlaying(false);setTime(0);setDuration(lengths[selected]||0);setAudioError("")},[selected]);
 useEffect(()=>{let cancelled=false;let probe:HTMLAudioElement|null=null;let cursor=0;const queue=songs.filter(song=>song.url!==selected);const next=()=>{if(cancelled||cursor>=queue.length)return;const song=queue[cursor++];probe=new Audio();const currentProbe=probe;currentProbe.preload="metadata";currentProbe.onloadedmetadata=()=>{if(!cancelled&&Number.isFinite(currentProbe.duration)&&currentProbe.duration>0)setLengths(old=>({...old,[song.url]:currentProbe.duration}));currentProbe.onloadedmetadata=null;currentProbe.onerror=null;currentProbe.removeAttribute("src");currentProbe.load();next()};currentProbe.onerror=()=>{currentProbe.removeAttribute("src");currentProbe.load();next()};currentProbe.src=song.url};next();return()=>{cancelled=true;if(probe){probe.onloadedmetadata=null;probe.onerror=null;probe.removeAttribute("src");probe.load()}}},[songs.map(song=>song.url).join("|")]);
 const toggle=()=>{const el=audio.current;if(!el)return;if(el.paused){void el.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false))}else{el.pause();setPlaying(false)}};
 const choose=(url:string)=>{if(url===selected)return;resumeOnChange.current=!!audio.current&&!audio.current.paused;onSelect(url)};
 const loaded=()=>{const el=audio.current;if(!el)return;const d=el.duration;if(Number.isFinite(d)&&d>0){setDuration(d);setLengths(old=>({...old,[selected]:d}))}if(resumeOnChange.current){resumeOnChange.current=false;void el.play().catch(()=>setPlaying(false))}};
 return <div className="amberDiscography">
  <div className="amberDiscHeader"><img src={cover} alt=""/><div className="amberDiscInfo"><small>AMBER / DISCOGRAPHY</small><strong>{artist}</strong><span>{title}</span><div className="amberDiscCredit"><CreditLines entry={entry} lang={lang}/></div></div><div className="amberDiscTransport"><button type="button" aria-label="Previous" disabled={index===0} onClick={()=>choose(songs[index-1].url)}><SkipBack size={18} fill="currentColor"/></button><button type="button" aria-label="Next" disabled={index===songs.length-1} onClick={()=>choose(songs[index+1].url)}><SkipForward size={18} fill="currentColor"/></button><button type="button" aria-label="Play or pause" className="amberDiscMainPlay" onClick={toggle}>{playing?<Pause size={22} fill="currentColor"/>:<Play size={22} fill="currentColor"/>}</button></div></div>
  <div className="amberDiscSeek"><span>{fmt(time)}</span><input aria-label="Playback position" type="range" min={0} max={duration||1} step=".1" value={Math.min(time,duration||1)} onChange={e=>{if(audio.current){audio.current.currentTime=Number(e.target.value);setTime(Number(e.target.value))}}}/><span>{fmt(duration)}</span></div>
  <audio ref={audio} key={selected} src={selected} preload="metadata" onLoadedMetadata={loaded} onError={e=>{const code=e.currentTarget.error?.code;setAudioError(code===4?"Audiodatei nicht lesbar oder nicht unterstützt":code===3?"Fehler beim Dekodieren der Audiodatei":"Audiodatei konnte nicht geladen werden");setPlaying(false)}} onTimeUpdate={e=>setTime(e.currentTarget.currentTime)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>{setPlaying(false);if(index<songs.length-1){resumeOnChange.current=true;onSelect(songs[index+1].url)}}}/>
  {audioError&&<p role="alert" style={{padding:"8px 18px",color:"#e5b778",fontSize:12}}>{audioError} · Track {songs[index]?.order}. Bitte die Datei in Replit direkt prüfen.</p>}
  <div className="amberDiscTracks">{songs.map((song,i)=><button type="button" key={song.url} className={song.url===selected?"is-active":""} onClick={()=>{if(song.url===selected)toggle();else choose(song.url)}}><span className="amberDiscNumber">{String(song.order&&song.order!==999999?song.order:i+1).padStart(2,"0")}</span><span className="amberDiscTrackName">{displayLocalTitle(song.name,artist)}</span><span className="amberDiscDuration">{lengths[song.url]?fmt(lengths[song.url]):song.url===selected?fmt(duration):"—"}</span></button>)}</div>
 </div>;
}
export default function SelectedCreditsGallery({entries,lang}:{entries:SelectedEntry[];lang:"de"|"en"}){
 const [active,setActive]=useState<SelectedEntry|null>(null);const [chosen,setChosen]=useState("");const [localChoice,setLocalChoice]=useState("");
 const [localSongs,setLocalSongs]=useState<{name:string;url:string;order?:number;albumFolder?:string;albumKey?:string}[]>([]);
 const [audioLoad,setAudioLoad]=useState("idle");
 useEffect(()=>{setActive(previous=>previous?entries.find(entry=>entry.name===previous.name)||previous:null)},[entries]);
 useEffect(()=>{if(!active)return;let alive=true;setAudioLoad("loading");fetch("/api/local-songs",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(data=>{if(alive){setLocalSongs(data.files||[]);setAudioLoad("loaded")}}).catch(()=>{if(alive)setAudioLoad("error")});return()=>{alive=false}},[active?.name]);
 useEffect(()=>{if(!active)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setActive(null)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[active]);
 const open=(entry:SelectedEntry)=>{setActive(entry);setChosen(entry.spotifyUrl||"");setLocalChoice("")};
 const brotherCredit=!!active&&/^(?:brothers?|bothers) keepers?$/.test(normalizeSong(active.artist))&&normalizeSong(active.title).startsWith("am i my brother s keeper");
 const spotifyUrl=brotherCredit?"https://open.spotify.com/album/3KG6ZSyMsjJCN3FQtgx1DT":active?.spotifyUrl||"";
 const current=embed(chosen)||embed(spotifyUrl);
 const youtubeVideo=active?.youtubeUrl?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]||"";
 const localMatches=matchLocalSongs(active,localSongs);const localAudio=localMatches.find(x=>x.url===localChoice)?.url||localMatches[0]?.url;
 const isAlbum=!!active&&(!!active.tracks?.length||/\balbum\b/i.test(active.title)||/\/album\//.test(spotifyUrl||""));
 return <>{!entries.length&&<p className="amberCreditsEmpty">{lang==="de"?"Für diesen Filter sind noch keine zugeordneten Veröffentlichungen vorhanden.":"No releases have been assigned to this filter yet."}</p>}<div className="amberCoverGrid">{entries.map((e,i)=><button className="amberCoverTile" type="button" key={e.name} onClick={()=>open(e)} aria-label={e.artist+" – "+e.title}>
  <img src={e.image} alt={e.artist+" – "+e.title} loading={i<10?"eager":"lazy"} fetchPriority={i<5?"high":"auto"}/>
  <span className="amberCoverOverlay"><span className="amberMetaLabel">ARTIST / BAND</span><strong>{e.artist}</strong><span className="amberMetaLabel">{lang==="de"?"TITEL":"TITLE"}</span><span className="amberCoverTitle">{e.title||"—"}</span>{e.label&&<><span className="amberMetaLabel">LABEL</span><span className="amberCoverTitle">{e.label}</span></>}<span className="amberMetaLabel">CREDIT:</span><span className="amberCoverRole"><CreditLines entry={e} lang={lang}/></span><span className="amberPlay"><Play size={22} fill="currentColor"/></span></span>
 </button>)}</div>
 {active&&<div className="amberPreviewBackdrop" onMouseDown={ev=>{if(ev.target===ev.currentTarget)setActive(null)}}>
 <section className={"amberPreviewPanel"+(localAudio?" amberCompactModal":(current||youtubeVideo)?" amberSpotifyModal":isAlbum?" amberPreviewAlbum":"")} role="dialog" aria-modal="true" aria-label={active.artist+" "+active.title}>
 <button className="amberPreviewClose" onClick={()=>setActive(null)} aria-label={lang==="de"?"Schließen":"Close"}><X/></button>
 {(current||youtubeVideo)&&!localAudio&&<div className="amberSpotifyCreditBar"><div className="amberSpotifyCreditMain"><small>AMBER / {isAlbum?"ALBUM":"SINGLE"} CREDIT</small><strong>{active.artist} <span>— {active.title}</span></strong><div className="amberSpotifyCreditRole"><CreditLines entry={active} lang={lang}/></div>{active.label&&<p>LABEL: {active.label}</p>}</div><div className="amberSpotifyCreditBrand">AMBER<span>.</span></div></div>}
 {!localAudio&&!current&&!youtubeVideo&&<div className="amberPreviewHead"><img src={active.image} alt=""/><div className="amberPreviewIdentity"><small>{isAlbum?(lang==="de"?"ALBUM / DISKOGRAFIE":"ALBUM / DISCOGRAPHY"):(lang==="de"?"SINGLE / REFERENZ":"SINGLE / CREDIT")}</small><h2>{active.artist}</h2><p>{active.title}</p>{active.label&&<p className="amberPreviewLabel"><b>LABEL:</b> {active.label}</p>}<span className="amberPreviewCredit"><CreditLines entry={active} lang={lang}/></span></div><div className="amberPreviewBrand">AMBER<span>.</span></div></div>}
 {!localAudio&&!current&&!youtubeVideo&&<div className="amberAlbumControls amberListenHeading"><span><b>{lang==="de"?"ANHÖREN":"LISTEN"}</b><small>{lang==="de"?"Offizieller Spotify-Player":"Official Spotify player"}</small></span><span className="amberReleaseType">{isAlbum?"ALBUM":/\bEP\b/i.test(active.title)?"EP":"SINGLE"}</span></div>}
 {active.artist.toLowerCase().includes("donna")&&active.title.toLowerCase().includes("keep on believing")&&!localAudio&&<p style={{padding:"0 24px",fontSize:12,color:"#d4ad7a"}}>AMBER Audio: {audioLoad} · Dateien: {localSongs.length} · Albumtreffer: {localMatches.length}</p>}
 {localAudio?<LocalDiscography songs={localMatches} selected={localAudio} onSelect={setLocalChoice} artist={active.artist} title={active.title} cover={active.image} entry={active} lang={lang}/>:<div className="amberListeningCard">{current?<iframe key={current} title={"Spotify: "+active.artist+" "+active.title} src={current+"?utm_source=generator&theme=0"} width="100%" height={isAlbum?590:232} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />:youtubeVideo?<iframe key={youtubeVideo} title={"YouTube: "+active.artist+" "+active.title} src={"https://www.youtube-nocookie.com/embed/"+youtubeVideo} width="100%" height={275} loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen />:<div className="amberPreviewPending"><Play size={22}/><p>{lang==="de"?"Spotify-Verknüpfung wird vorbereitet. Noch keine Hörprobe hinterlegt.":"Spotify link is being prepared. No preview linked yet."}</p></div>}</div>}
 {isAlbum&&!localAudio&&!current&&<div className="amberTrackList"><small>{lang==="de"?"TITELLISTE":"TRACKLIST"}</small>{active.tracks?.length?active.tracks.map((t,i)=><button type="button" key={i} disabled={!embed(t.spotifyUrl)} className={t.spotifyUrl===chosen?"chosen":""} onClick={()=>setChosen(t.spotifyUrl||"")}><span>{String(i+1).padStart(2,"0")}</span><strong>{t.title}</strong>{embed(t.spotifyUrl)?<Play size={13}/>:<span className="amberTrackPending">—</span>}</button>):<p className="amberTrackNote">{lang==="de"?"Die Titelliste wird ergänzt, sobald die offiziellen Titel zugeordnet sind.":"Track selection will appear once official releases have been linked."}</p>}</div>}
 {(spotifyUrl||active.youtubeUrl)&&<a className="amberSpotifyLink" href={spotifyUrl||active.youtubeUrl} target="_blank" rel="noopener noreferrer">{spotifyUrl?(lang==="de"?"AUF SPOTIFY ÖFFNEN":"OPEN ON SPOTIFY"):(lang==="de"?"VIDEO AUF YOUTUBE ÖFFNEN":"OPEN VIDEO ON YOUTUBE")} <ArrowUpRight size={16}/></a>}
 </section></div>}</>
}
