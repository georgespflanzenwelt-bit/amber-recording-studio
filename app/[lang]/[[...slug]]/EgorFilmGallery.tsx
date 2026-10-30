"use client";
import {useEffect,useState} from "react";
type Entry={name:string;artist:string;title:string;image:string;work:string;youtubeUrl?:string;externalUrl?:string};
const adverts=[
 {id:"roho",artist:"ROHO Filmproduction",title:"Trailer Movie",video:"VKOSl2BSIc0",match:/roho/i},
 {id:"gabriel",artist:"Gabriel & Co.",title:"Jessica Alba Campaign",video:"379cyDbuQz4",match:/gabriel/i},
 {id:"hertha",artist:"Hertha BSC",title:"Trailer",video:"3Crh1vJV_VU",match:/hertha/i},
 {id:"ristretto",artist:"AMBER BEATS",title:"Ristretto",video:"",external:"https://raphael.ad/films/ristretto",match:/ristretto|amber beats|raphael/i}
] as const;
export default function EgorFilmGallery({lang}:{lang:"de"|"en"}){
 const [entries,setEntries]=useState<Entry[]>([]);
 const [active,setActive]=useState<{id:string;mode:"video"|"image"|"description"}|null>(null);
 useEffect(()=>{let ok=true;fetch("/api/selected-covers?scope=egor",{cache:"no-store"}).then(r=>r.json()).then(d=>{if(ok)setEntries(d.entries||[])}).catch(()=>{});return()=>{ok=false}},[]);
 useEffect(()=>{if(!active)return;const fn=(e:KeyboardEvent)=>{if(e.key==="Escape")setActive(null)};document.addEventListener("keydown",fn);return()=>document.removeEventListener("keydown",fn)},[active]);
 const selected=adverts.find(a=>a.id===active?.id);
 const imageFor=(id:string)=>{const a=adverts.find(x=>x.id===id);return a?entries.find(e=>a.match.test([e.name,e.artist,e.title].join(" ")))?.image:""};
 return <section className="egorFilmSection">
  <h3>{lang==="de"?"WERBEFILME & BRAND MUSIC – EGOR KOBZEV":"COMMERCIALS & BRAND MUSIC – EGOR KOBZEV"}</h3>
  <div className="egorFilmGrid">{adverts.map(a=><article className="egorFilmCard" key={a.id}>
   <button type="button" className="egorFilmArtwork" onClick={()=>setActive({id:a.id,mode:imageFor(a.id)?"image":"video"})} aria-label={lang==="de"?"Cover vergrößern":"Enlarge cover"}>{imageFor(a.id)?<img src={imageFor(a.id)} alt={a.artist+" – "+a.title}/>:<span>{a.artist}<small>{a.title}</small></span>}</button>
   <h4>{a.artist}</h4><p>{a.title}</p>
   <span className="egorFilmCredit">{lang==="de"?"Musikproduktion / Film Score":"Music Production / Film Score"} · Egor Kobzev</span>
   <div className="scoreFilmActions">
    <button type="button" onClick={()=>setActive({id:a.id,mode:"description"})}>{lang==="de"?"Beschreibung":"Description"}</button>
    <button type="button" onClick={()=>setActive({id:a.id,mode:"video"})}>{a.video?(lang==="de"?"Film ansehen":"Watch video"):(lang==="de"?"Film öffnen":"Open film")}</button>
   </div>
  </article>)}</div>
  {selected&&active&&<div className="scoreFilmBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setActive(null)}}>
   <section className="scoreFilmModal egorFilmModal" role="dialog" aria-modal="true" aria-label={selected.artist+" "+selected.title}>
    <button type="button" className="scoreFilmClose" aria-label="Close" onClick={()=>setActive(null)}>×</button>
    <h3>{selected.artist} – {selected.title}</h3>
    {active.mode==="description"?<p>{lang==="de"?"Werbefilm / Medienproduktion. Musik und Sound: Egor Kobzev.":"Commercial / media production. Music and sound: Egor Kobzev."}</p>:
     active.mode==="image"&&imageFor(selected.id)?<img className="scoreFilmLargeImage" src={imageFor(selected.id)} alt={selected.title}/>:
     selected.video?<div className="egorFilmVideo"><iframe src={"https://www.youtube-nocookie.com/embed/"+selected.video+"?rel=0"} title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy"/></div>:
     <p><a href={selected.external} target="_blank" rel="noopener noreferrer">{lang==="de"?"Ristretto-Film auf raphael.ad ansehen":"Watch Ristretto on raphael.ad"}</a></p>}
   </section>
  </div>}
 </section>;
}
