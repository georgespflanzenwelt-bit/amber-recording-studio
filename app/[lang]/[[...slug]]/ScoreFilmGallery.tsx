"use client";
import {useEffect,useRef,useState} from "react";
import EgorFilmGallery from "./EgorFilmGallery";
type Asset={name:string;url:string};
const films=[
 {id:"silvester",title:"Silvester Countdown",director:"Oskar Roehler",description:{de:"George Brasch war gemeinsam mit Dieter Webel an der Filmmusik beteiligt. Der Film wurde 1997 beim Filmfest München mit dem Förderpreis Deutscher Film für die Regie von Oskar Roehler ausgezeichnet.",en:"George Brasch contributed to the film score alongside Dieter Webel. Oskar Roehler received the Förderpreis Deutscher Film for directing at the 1997 Munich Film Festival."},folder:"selected credits/Score Audio/Silvester Countdown"},
 {id:"shadow",title:"Schattenwelt / Hinh Bóng",director:"Robin von Hardenberg",description:{de:"Originalmusik von George Brasch für den international gezeigten Kurzfilm. 2002 Finalist beim Student Academy Award; Berlinale 2003 (Perspektive Deutsches Kino); Spezialpreis der Jury beim Filmfestival Karlovy Vary 2003 sowie Silver Scales Award für Minh-Khai Phan-Thi beim SNIFF Festival. Weitere Stationen: Osnabrück, Bamberg, Hamburg und Landshut.",en:"Original music by George Brasch for the internationally screened short film. Student Academy Award finalist in 2002; Berlinale 2003 (Perspektive Deutsches Kino); Special Jury Prize at Karlovy Vary 2003 and a Silver Scales acting award for Minh-Khai Phan-Thi at SNIFF. Also screened in Osnabrück, Bamberg, Hamburg and Landshut."},folder:"selected credits/Score Audio/Schattenwelt"},
 {id:"vietnam",title:"Mein Vietnam – Land und kein Krieg",director:"Minh-Khai Phan-Thi & Richard Ladkani",description:{de:"Filmmusik von George Brasch für die Dokumentation über Heimat, Identität und Vietnam jenseits der Kriegsgeschichte. Gezeigt beim Film Festival Cologne 2004 und 2005 im ZDF ausgestrahlt.",en:"Music by George Brasch for this documentary about home, identity and Vietnam beyond the history of war. Presented at Film Festival Cologne in 2004 and broadcast by ZDF in 2005."},folder:"selected credits/Score Audio/Vietnam"}
] as const;

function ScoreTrackPlayer({tracks,title,lang,filmId,cover}:{tracks:Asset[];title:string;lang:"de"|"en";filmId:string;cover?:Asset}){
 const player=useRef<HTMLAudioElement>(null);
 const [index,setIndex]=useState(0),[playing,setPlaying]=useState(false),[time,setTime]=useState(0),[duration,setDuration]=useState(0);
 const fmt=(t:number)=>Number.isFinite(t)?String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.floor(t%60)).padStart(2,"0"):"00:00";
 useEffect(()=>{setIndex(0);setPlaying(false);setTime(0);setDuration(0)},[title]);
 const select=(i:number)=>{if(i<0||i>=tracks.length)return;setIndex(i);setTime(0);setDuration(0);setPlaying(true)};
 useEffect(()=>{if(playing&&player.current){player.current.play().catch(()=>setPlaying(false))}},[index]);
 const toggle=()=>{const a=player.current;if(!a)return;if(a.paused){a.play().catch(()=>setPlaying(false))}else a.pause()};
 if(!tracks.length)return <p>{lang==="de"?"Noch keine Audiodateien vorhanden.":"No score tracks available."}</p>;
 const selected=tracks[index]||tracks[0];
 return <div className="scoreCustomPlayer">
 <div className="scorePlayerIdentity">{cover?<div className="scorePlayerCover">{/\.pdf$/i.test(cover.name)?<div className="scorePdfCrop"><object data={cover.url+"#page=1&toolbar=0&navpanes=0&scrollbar=0&view=Fit"} type="application/pdf" tabIndex={-1} aria-label={title}/></div>:<img src={cover.url} alt={title}/>}</div>:<span className="scorePlayerMark">AMBER.</span>}<div><small>AMBER / FILM SCORE</small><strong>{title}</strong><span>{lang==="de"?"Regie":"Directed by"}: {films.find(f=>f.id===filmId)?.director}</span><span>{lang==="de"?"Filmmusik":"Film music"}: George Brasch{filmId==="silvester"?" & Dieter Webel":""}</span><span className="scorePlayerAward">{filmId==="shadow"?(lang==="de"?"OSCAR-NOMINIERUNG 2002 · STUDENT ACADEMY AWARDS":"OSCAR NOMINATION 2002 · STUDENT ACADEMY AWARDS"):filmId==="silvester"?(lang==="de"?"FILMFEST MÜNCHEN 1997 · FÖRDERPREIS DEUTSCHER FILM (REGIE)":"MUNICH FILM FESTIVAL 1997 · DIRECTING AWARD"):(lang==="de"?"ZDF-DOKUMENTARPRODUKTION":"ZDF DOCUMENTARY PRODUCTION")}</span></div></div>
 <audio key={selected.url} ref={player} src={selected.url} preload="metadata" onLoadedMetadata={e=>setDuration(e.currentTarget.duration)} onTimeUpdate={e=>setTime(e.currentTarget.currentTime)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>{setPlaying(false);if(index+1<tracks.length)select(index+1)}}/>
 <div className="scorePlayerButtons"><button type="button" aria-label="Previous track" disabled={index===0} onClick={()=>select(index-1)}>◀|</button><button type="button" aria-label="Next track" disabled={index===tracks.length-1} onClick={()=>select(index+1)}>|▶</button><button type="button" className="scoreMainPlay" aria-label={playing?"Pause":"Play"} onClick={toggle}>{playing?"Ⅱ":"▶"}</button></div>
 <div className="scorePlayerProgress"><span>{fmt(time)}</span><input type="range" aria-label="Seek" min={0} max={duration||1} step="0.1" value={Math.min(time,duration||1)} onChange={e=>{if(player.current&&duration){player.current.currentTime=Number(e.target.value);setTime(Number(e.target.value))}}}/><span>{fmt(duration)}</span></div>
 <div className="scorePlayerTracks">{tracks.map((t,i)=><button type="button" className={i===index?"active":""} key={t.url} onClick={()=>select(i)}><span>{(i+1).toString().padStart(2,"0")}</span><strong>{t.name.replace(/\.[^.]+$/,"").replace(/^\s*\d+\s*/,"")}</strong><span>{i===index&&duration?fmt(duration):"—"}</span></button>)}</div>
 </div>;
}

export default function ScoreFilmGallery({lang}:{lang:"de"|"en"}){
 const [groups,setGroups]=useState<Record<string,Asset[]>>({});
 const [panel,setPanel]=useState<{id:string;mode:"description"|"tracks"|"image"}|null>(null);
 useEffect(()=>{let active=true;fetch("/api/score-films",{cache:"no-store"}).then(r=>r.json()).then(data=>{if(active)setGroups(data.groups||{})}).catch(()=>{});return()=>{active=false}},[]);
 useEffect(()=>{if(!panel)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setPanel(null)};document.addEventListener("keydown",onKey);return()=>document.removeEventListener("keydown",onKey)},[panel]);
 const artwork=groups["selected credits/Score"]||[];
 const findArt=(id:string)=>artwork.find(file=>id==="shadow"?/shadow|schattenwelt/i.test(file.name):id==="silvester"?/silvester/i.test(file.name):id==="vietnam"?/mein vietnam|vietnam/i.test(file.name):false);
 const selected=panel?films.find(f=>f.id===panel.id):undefined;
 return <div className="scoreFilms">
  <div className="scoreFilmsGrid">{films.map(f=>{
   const cover=findArt(f.id);
   return <article className="scoreFilmCard" key={f.id}>
    <button className="scoreFilmArtwork" type="button" onClick={()=>cover&&setPanel({id:f.id,mode:"image"})} aria-label={lang==="de"?"Bild vergrößern":"Enlarge artwork"}>
     {cover?(/\.pdf$/i.test(cover.name)?<div className="scorePdfCrop"><object data={cover.url+"#page=1&toolbar=0&navpanes=0&scrollbar=0&view=Fit"} type="application/pdf" tabIndex={-1} aria-label={f.title}><span>{f.title}</span></object></div>:<img src={cover.url} alt={f.title}/>):<span className="scoreFilmPlaceholder">{f.title}</span>}
    </button>
    <div className="scoreFilmHighlight">{f.id==="shadow"?(lang==="de"?"OSCAR-NOMINIERUNG 2002 · STUDENT ACADEMY AWARDS":"OSCAR NOMINATION 2002 · STUDENT ACADEMY AWARDS"):f.id==="silvester"?(lang==="de"?"FILMFEST MÜNCHEN · FÖRDERPREIS 1997":"MUNICH FILM FESTIVAL · DIRECTING AWARD 1997"):(lang==="de"?"ZDF-DOKUMENTARPRODUKTION":"ZDF DOCUMENTARY PRODUCTION")}</div>
    <h4>{f.title}</h4><p>{f.director}</p>
    <div className="scoreFilmActions">
     <button type="button" onClick={()=>setPanel({id:f.id,mode:"description"})}>{lang==="de"?"Beschreibung":"Description"}</button>
     <button type="button" onClick={()=>setPanel({id:f.id,mode:"tracks"})}>Tracks – Score</button>
    </div>
   </article>})}</div>
   <EgorFilmGallery lang={lang}/>
   {panel&&selected&&<div className="scoreFilmBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setPanel(null)}}><section className="scoreFilmModal" role="dialog" aria-modal="true" aria-label={selected.title}>
    <button type="button" className="scoreFilmClose" onClick={()=>setPanel(null)} aria-label="Close">×</button>
    <h3>{selected.title}</h3>
    {panel.mode==="description"?<><p>{selected.description[lang]}</p><small>{lang==="de"?"Regie":"Director"}: {selected.director} · {lang==="de"?"Filmmusik":"Film music"}: George Brasch</small></>:
    panel.mode==="image"?(()=>{const item=findArt(selected.id);return item?(/\.pdf$/i.test(item.name)?<div className="scorePdfLargeCrop"><iframe title={selected.title} src={item.url+"#page=1&toolbar=0&navpanes=0&scrollbar=0&view=Fit"} className="scoreFilmPDF"/></div>:<img className="scoreFilmLargeImage" src={item.url} alt={selected.title}/>):null})():
    <ScoreTrackPlayer title={selected.title} lang={lang} filmId={selected.id} cover={findArt(selected.id)} tracks={(groups[selected.folder]||[]).filter(x=>/\.(mp3|m4a|wav|ogg|flac)$/i.test(x.name)).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}))}/>}
   </section></div>}
 </div>;
}
