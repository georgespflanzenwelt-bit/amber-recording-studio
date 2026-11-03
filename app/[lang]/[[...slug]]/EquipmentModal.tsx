"use client";
import {useEffect} from "react";
import {X} from "lucide-react";

type Lang="de"|"en";
const equipment={
 de:{
 title:"STUDIO & EQUIPMENT",
 sections:[
 {title:"STUDIO",paragraphs:[
 "Mit über 30 Jahren Studioerfahrung als Producer, Recording- und Mixing Engineer und mehr als 400 veröffentlichten, von uns gemischten Tracks sprechen unsere Credits und Referenzen für sich allein. Einfach mal durch die Trackliste scrollen.",
 "Heute wird in fast allen professionellen Studios und von Engineers und Produzenten auf der ganzen Welt mit ähnlichem Equipment und vor allem mit den gleichen Plug-ins gearbeitet.",
 "Was macht dann aber einen herausragend guten Mix aus, wenn nicht das Equipment entscheidend ist?",
 "Natürlich jahrelange Studioerfahrung, ein geschultes Ohr und die Fähigkeit, eine klangliche Vorstellung wirklich gut umzusetzen. Dazu kommt noch die Erfahrung, jahrzehntelang an analogen Konsolen wie Neve und mit dem Outboard-Equipment gearbeitet zu haben, das heute alle als Plug-ins benutzen. Auch wenn sich die Technik in den vergangenen Jahrzehnten stark verändert hat, ist eines für mich gleich geblieben: Am Ende zählt, wie sich Musik anfühlt und wie sie klingt. Diese Erfahrung prägt meine Arbeit bis heute – auch wenn wir inzwischen überwiegend mit UAD-Systemen direkt im Rechner mischen und mastern.",
 "Das Arbeiten „in the box“ gibt uns die Freiheit, schnell und flexibel zwischen verschiedenen Projekten zu wechseln, zwischendurch Vocals und Instrumente aufzunehmen oder kurzfristig noch einmal Details in einem Mix zu verändern. Klanglich machen wir dabei keine Kompromisse: Ein druckvoller, musikalischer Mix hängt für mich nicht davon ab, wie viele Geräte im Rack stehen.",
 ]},
 {title:"AMBER STUDIO BERLIN",paragraphs:[
 "Seit 2004 befindet sich das AMBER Studio in Berlin-Neukölln, in der Nähe des S- und U-Bahnhofs Hermannstraße. Hier wurden zahlreiche Alben und Tracks gemischt – darunter für Seeeds Album „Next!“ die Titel „End of Days“, „She Got Me Twisted“ und „Can’t Hold Me“, für „Seeed Live“ der Track „Pressure“ sowie Produktionen von Nosliw, Koalas Desperados, Jaqee und vielen weiteren Künstlern.",
 "Das Studio hat Tageslicht und bietet einen Blick über die Dächer Neuköllns. Auf unserer Terrasse kann man im Sommer bei einer Tasse Tee oder Kaffee eine Pause machen – und vor allem den Ohren etwas Ruhe gönnen.",
 "Besonders wichtig ist mir seit jeher eine präzise und verlässliche Abhörsituation. Die außergewöhnlich gute Raumakustik ermöglicht eine genaue Beurteilung von Aufnahmen, Mixen und Masterings."
 ]},
 {title:"MONITORING",items:["Genelec 1032A","Genelec 1031A","Yamaha NS-10 mit QSC-Endstufe"]},
 {title:"INSTRUMENTE",paragraphs:["Für Live-Recordings steht ein Rippen-Piano bereit, außerdem verschiedene E-Gitarren und Akustikgitarren."]},
 {title:"KEYBOARDS & SYNTHESIZER",items:["KORG Minilogue XD","Clavia Nord Lead 4","2× Behringer Model D / Minimoog","Behringer MS-1 / SH-101","Behringer TD-3-BK / TB-303 Clone","Arturia Masterkeyboard"]},
 {title:"OUTBOARD",items:["Lexicon PCM 90","Roland SRV-2000","Warm Audio WA76","JDK Audio R24 EQ","Focusrite ISA 2 Dual Mono Mic Pre"]},
 {title:"MIKROFONE",items:["Warm Audio WA-87 R2","Shure SM58"],paragraphs:["Weitere Mikrofone wie Neumann U47, U89, AKG C12 oder AKG C414 können wir für Produktionen sowie Vocal- und Instrumenten-Recordings bei Bedarf gesondert zur Verfügung stellen."]},
 {title:"VINYL & TURNTABLES",items:["1× Technics SL-1200 Plattenspieler","Numark DJ-Mischpult"]}
 ]},
 en:{
 title:"STUDIO & EQUIPMENT",
 sections:[
 {title:"STUDIO",paragraphs:[
 "Studio technology has changed enormously over the decades, but one thing has always stayed the same for me: what matters is how music feels and sounds. I spent many years working with analogue consoles and classic studio equipment. That experience still shapes how I work today, even though most of our mixing and mastering now happens directly in the computer using UAD systems.",
 "Working in the box gives us the flexibility to switch between projects, record additional vocals or make last-minute changes to a mix without losing momentum. But we never compromise on sound. For me, a powerful, musical mix isn't determined by how much hardware sits in the rack.",
 "Many producers and engineers use the same or similar plug-ins today. What makes the real difference is experience, a trained ear and the ability to turn a sonic vision into reality. With over 30 years of studio experience and more than 400 released tracks mixed by us, our credits and references speak for themselves.",
 "Take a listen through our credits and hear for yourself."
 ]},
 {title:"AMBER STUDIO BERLIN",paragraphs:[
 "AMBER Studio has been based in Berlin-Neukölln since 2004, close to the Hermannstraße S-Bahn and U-Bahn station. Many albums and tracks have been mixed here, including Seeed’s “Next!” tracks “End of Days”, “She Got Me Twisted” and “Can’t Hold Me”, the “Seeed Live” track “Pressure”, and productions for Nosliw, Koalas Desperados, Jaqee and many other artists.",
 "The studio has natural daylight and views across the rooftops of Neukölln. In summer, our terrace is a wonderful place to take a break over tea or coffee – and, just as importantly, give your ears some rest.",
 "An accurate and dependable monitoring environment has always been essential to me. The room's exceptional acoustics allow us to assess recordings, mixes and masters with real precision."
 ]},
 {title:"MONITORING",items:["Genelec 1032A","Genelec 1031A","Yamaha NS-10 with QSC power amplifier"]},
 {title:"INSTRUMENTS",paragraphs:["A Rippen upright piano is available for live recordings, alongside a selection of electric and acoustic guitars."]},
 {title:"KEYBOARDS & SYNTHESIZERS",items:["KORG Minilogue XD","Clavia Nord Lead 4","2× Behringer Model D / Minimoog","Behringer MS-1 / SH-101","Behringer TD-3-BK / TB-303 Clone","Arturia master keyboard"]},
 {title:"OUTBOARD",items:["Lexicon PCM 90","Roland SRV-2000","Warm Audio WA76","JDK Audio R24 EQ","Focusrite ISA 2 Dual Mono Mic Pre"]},
 {title:"MICROPHONES",items:["Warm Audio WA-87 R2","Shure SM58"],paragraphs:["Additional microphones such as the Neumann U47, U89, AKG C12 or AKG C414 can be arranged separately when needed for productions and vocal or instrument recordings."]},
 {title:"VINYL & TURNTABLES",items:["1× Technics SL-1200 turntable","Numark DJ mixer"]}
 ]}
} as const;

export default function EquipmentModal({lang,onClose}:{lang:Lang;onClose:()=>void}){
 useEffect(()=>{
  const handleKey=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose()};
  document.addEventListener("keydown",handleKey);
  const oldOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  return()=>{document.removeEventListener("keydown",handleKey);document.body.style.overflow=oldOverflow};
 },[onClose]);
 const data=equipment[lang];
 return <div role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}} style={{position:"fixed",inset:0,zIndex:1500,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",padding:"min(3vw,24px)"}}>
  <section role="dialog" aria-modal="true" aria-label={data.title} style={{position:"relative",width:"min(1080px,100%)",maxHeight:"min(90vh,1000px)",overflowY:"auto",background:"rgba(12,20,23,.98)",border:"1px solid #c58c3d",borderRadius:22,color:"#f5f4ef",padding:"clamp(26px,4vw,58px)",boxShadow:"0 24px 80px rgba(0,0,0,.65)"}}>
   <button type="button" onClick={onClose} aria-label={lang==="de"?"Schließen":"Close"} style={{position:"sticky",top:0,float:"right",zIndex:2,width:44,height:44,borderRadius:"50%",border:"1px solid #d99e49",background:"#10181b",color:"#fff",display:"grid",placeItems:"center",cursor:"pointer"}}><X size={22}/></button>
   <h2 style={{fontSize:"clamp(27px,3.2vw,42px)",color:"#e9a747",margin:"0 58px 30px 0",lineHeight:1.15}}>{data.title}</h2>
   {data.sections.map((section,index)=><section key={section.title} style={{marginBottom:32,borderTop:index?"1px solid rgba(223,169,93,.28)":undefined,paddingTop:index?25:0}}>
    <h3 style={{fontSize:"clamp(19px,2vw,25px)",color:"#e9a747",margin:"0 0 16px"}}>{section.title}</h3>
    {"paragraphs" in section&&section.paragraphs?.map((para,i)=><p key={i} style={{fontSize:"clamp(16px,1.25vw,19px)",lineHeight:1.75,margin:"0 0 17px",maxWidth:"95%"}}>{para}</p>)}
    {"items" in section&&section.items&&<ul style={{margin:"0",paddingLeft:24,columns:section.items.length>4?2:1,columnGap:35}}>{section.items.map(item=><li key={item} style={{fontSize:"clamp(15px,1.15vw,18px)",lineHeight:1.9,breakInside:"avoid"}}>{item}</li>)}</ul>}
   </section>)}
  </section>
 </div>;
}
