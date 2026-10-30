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
  <p className="egorFilmIntro">{lang==="de"?<>Egor Kobzev <strong>komponiert und produziert Musik</strong> für Künstler, Film, Werbung und Medien – darunter Produktionen für <strong>Hertha BSC</strong> sowie einen <strong>Werbeclip mit Hollywood-Schauspielerin Jessica Alba für Gabriel &amp; Co.</strong> Seine Arbeiten bewegen sich zwischen elektronischer Musik, ausdrucksstarken Gitarren, cineastischen Klanglandschaften und modernen Alternative-Pop-Produktionen. Dabei verbindet er innovatives Sounddesign mit emotionalen Melodien und einem unverwechselbaren Gespür für die musikalische Wirkung von Bildern.</>:<>Egor Kobzev <strong>composes and produces music</strong> for artists, film, advertising and media – including projects for <strong>Hertha BSC</strong> and a <strong>commercial featuring Hollywood actress Jessica Alba for Gabriel &amp; Co.</strong> His work spans electronic music, expressive guitars, cinematic soundscapes and contemporary alternative pop. He blends innovative sound design with emotional melodies and a distinctive feel for music's impact on visuals.</>}</p>
  <details className="scoreBrandMore egorFilmMore"><summary>{lang==="de"?"Mehr anzeigen":"Read more"} <span aria-hidden="true">⌄</span></summary><div className="scoreBrandMoreText">{lang==="de"?<><p>Mit abgeschlossenem Musikstudium und langjähriger Erfahrung als Musiker, Komponist, Songwriter und Musikproduzent bewegt sich Egor souverän zwischen unterschiedlichen musikalischen Welten. Geprägt durch eigene Bandprojekte verbindet er die Energie live eingespielter Instrumente mit den kreativen Möglichkeiten elektronischer Musik.</p><p>Heute konzentriert sich Egor auf <strong>Komposition, Songwriting und Musikproduktion in den Bereichen Electronic, Cinematic und Alternative Pop</strong>. Neben seinen eigenen Projekten schreibt und produziert er für Künstler, Film, Werbung und Marken.</p><p>Als erfahrener <strong>Recording- und Mixing Engineer</strong> nimmt er auch komplette Bands auf und begleitet Produktionen von der ersten musikalischen Idee bis zum fertigen Mix.</p></>:<><p>With a completed music degree and extensive experience as a musician, composer, songwriter and producer, Egor moves confidently between musical worlds. His own band projects have shaped an approach that combines the energy of live instruments with the creative possibilities of electronic music.</p><p>Today, Egor focuses on <strong>composition, songwriting and production across electronic, cinematic and alternative pop</strong>. Alongside his own projects, he writes and produces for artists, film, advertising and brands.</p><p>As an experienced <strong>recording and mixing engineer</strong>, he also records full bands and guides productions from the first musical idea to the final mix.</p></>}</div></details>
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
     <p><a href={"external" in selected?selected.external:"https://raphael.ad/films/ristretto"} target="_blank" rel="noopener noreferrer">{lang==="de"?"Ristretto-Film auf raphael.ad ansehen":"Watch Ristretto on raphael.ad"}</a></p>}
   </section>
  </div>}
 </section>;
}
