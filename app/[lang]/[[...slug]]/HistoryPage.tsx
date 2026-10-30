"use client";
import {useEffect,useState} from "react";
type Lang="de"|"en";

export default function HistoryPage({lang}:{lang:Lang}){
 const de=lang==="de";
 const [coolStruttinCover,setCoolStruttinCover]=useState("");
 useEffect(()=>{let active=true;fetch("/api/selected-covers").then(r=>r.json()).then(data=>{const item=(data.entries||[]).find((e:{name?:string;artist?:string;title?:string;image?:string})=>/cool\s*strutt?in/i.test([e.name,e.artist,e.title].join(" "))&&/(vol(?:ume)?\s*1|vol(?:ume)?\s*i\b)/i.test([e.name,e.title].join(" ")))||(data.entries||[]).find((e:{name?:string;artist?:string;title?:string;image?:string})=>/cool\s*strutt?in/i.test([e.name,e.artist,e.title].join(" ")));if(active&&item?.image)setCoolStruttinCover(item.image)}).catch(()=>{});return()=>{active=false}},[]);
 return <div className="amberHistory">
  <header className="historyHero">
   <div className="wrap historyHeroInner">
    <small>AMBER / {de?"HISTORIE":"HISTORY"} · BERLIN · 1991—TODAY</small>
    <h1>{de?<>AMBER.<br/><em>EINE BERLINER</em><br/>STUDIOGESCHICHTE.</>:<>AMBER.<br/><em>A BERLIN</em><br/>STUDIO STORY.</>}</h1>
    <p>{de?"Vom ersten Amber Studio über eigene Labels und internationale Produktionen bis zur Studioplanung – die Geschichte eines unabhängigen Berliner Sounds.":"From the first Amber studio through independent labels and international productions to studio design – the story of an independent Berlin sound."}</p>
    <span className="historyHeroLine" aria-hidden="true"/>
   </div>
  </header>

  <section className="wrap historyTimeline" aria-label={de?"Die Anfänge":"The early years"}>
   <div className="historyYearEntry">
    <div className="historyYearWithCover"><span className="historyYear">1991</span><img src="/images/Amber%20old/Amber-Yorkstrasse.jpg" alt="Amber Studio in der Yorckstraße, 1991" className="history1991Photo"/></div>
    <div className="historyYearCopy">
     <h2>{de?"Alles begann in der Yorckstraße.":"It all began on Yorckstraße."}</h2>
     <p>{de?<>Gemeinsam mit Doris Dischner gründete George Brasch dort das erste <strong>Amber Studio</strong> – zu einer Zeit, als analoge Bandmaschinen, große Mischpulte und live eingespielte Instrumente den Studioalltag prägten. Stundenlang wurde an Sounds, Arrangements und Aufnahmen gefeilt, bis wirklich alles saß. Schon früh entstanden dort Produktionen mit eigenen Künstlern ebenso wie mit bekannten Namen aus der Berliner und internationalen Musikszene.</>:<>Together with Doris Dischner, George Brasch founded the first <strong>Amber Studio</strong> there – in an era shaped by analogue tape machines, large mixing consoles and live musicians. Hours were spent refining sounds, arrangements and recordings until every detail was right. From the beginning, the studio worked with its own artists as well as established names from Berlin and the international music scene.</>}</p>
    </div>
   </div>
   <div className="historyYearEntry">
    <div className="historyYearWithCover"><span className="historyYear">1993</span>
     {coolStruttinCover&&<img src={coolStruttinCover} alt="Cool Struttin’ Volume 1 – Amber Records" className="historyCoolStruttinCover"/>}
    </div>
    <div className="historyYearCopy">
     <h2>{de?"Der nächste Schritt: Amber Records.":"The next step: Amber Records."}</h2>
     <p>{de?<>Mit der ersten <strong>Amber EP</strong> und einer Compilation mit unveröffentlichter Musik zwischen <strong>Soul, Jazz und Acid Jazz</strong> begann die eigene Labelgeschichte. Amber Records arbeitete bewusst unabhängig und baute sich eigene Strukturen für Produktion, Vertrieb und Promotion auf.</>:<>The first <strong>Amber EP</strong> and a compilation of previously unreleased music spanning <strong>Soul, Jazz and Acid Jazz</strong> marked the beginning of the label. Amber Records deliberately remained independent, building its own production, distribution and promotion structures.</>}</p>
     <p>{de?<>Der Erfolg ließ nicht lange auf sich warten: Die erste Compilation <strong>Cool Struttin’ Volume 1</strong> mit bis dahin unveröffentlichten Tracks aus aller Welt – zwischen Soul und Acid Jazz – verkaufte sich <strong>über 20.000 Mal</strong> und erschien sogar in <strong>Kanada und Japan</strong>, alles in Eigenregie. Für ein unabhängiges Berliner Label war das zu einer Zeit, in der Techno und Eurodance die Musikszene dominierten, ein bemerkenswerter Erfolg und legte den Grundstein für die weitere Entwicklung von Amber.</>:<>Success followed quickly: the first compilation, <strong>Cool Struttin’ Volume 1</strong>, brought together previously unreleased tracks from around the world, spanning soul and acid jazz. It sold <strong>more than 20,000 copies</strong> and was released in <strong>Canada and Japan</strong> – all independently. For an independent Berlin label, this was a remarkable achievement at a time when techno and Eurodance dominated the music scene, and it laid the foundation for Amber’s continued growth.</>}</p>
    </div>
   </div>
   <div className="historyYearEntry">
    <div className="historyYearWithCover">
     <span className="historyYear">1997</span>
     <div className="history1997PhotoGrid">
      <figure className="history1997Figure"><img src="/images/Amber%20old/Doris-building%20Upper%20Studio.jpg" alt="Doris Dischner beim Bau des Upper Studio"/><figcaption>Doris – Upper Studio</figcaption></figure>
      <figure className="history1997Figure"><img src="/images/Amber%20old/George%20building%20upper%20Studio.jpg" alt="George Brasch beim Bau des Upper Studio"/><figcaption>George – Upper Studio</figcaption></figure>
     </div>
    </div>
    <div className="historyYearCopy">
     <h2>{de?"Polydor. Reichenberger Straße. Zwei neue Studios.":"Polydor. Reichenberger Straße. Two new studios."}</h2>
     <p>{de?<>Die Zusammenarbeit mit <strong>Polydor</strong> begann. Gleichzeitig entstanden zwei neue Amber Studios in der <strong>Reichenberger Straße</strong>. George Brasch plante und baute die Räume und richtete sie akustisch konsequent auf professionelle Musikproduktion aus. Damit wurde Amber zu einer festen Adresse in Berlin – auch für die internationale Musikindustrie.</>:<>Amber began collaborating with <strong>Polydor</strong>. At the same time, two new Amber studios took shape on <strong>Reichenberger Straße</strong>. George Brasch planned and built the spaces, designing their acoustics for professional music production. Amber soon became an established destination in Berlin, including for the international music industry. </>}</p>
    </div>
   </div>
   <div className="historyYearEntry">
    <span className="historyYear historyYearRange">1997–2003</span>
    <div className="historyYearCopy">
     <h2>{de?"Ein Ort. Viele musikalische Welten.":"One place. Many musical worlds."}</h2>
     <p>{de?<>Hier gaben sich <strong>internationale Künstler, Produzenten und Musiker buchstäblich die Klinke in die Hand.</strong> Namen wie <strong>RZA vom Wu-Tang Clan, Xavier Naidoo, Barrington Levy, Gentleman, Till Brönner, Kool Savas, Azad, M.O.R., Curse, Afrob, Sékou, Beenie Man, Anthony B, Ja Rule, Christina Milian, R. Kelly, Seeed, Katja Riemann und Saint Etienne</strong> stehen nur beispielhaft für die enorme Bandbreite der Künstler, die im Laufe der Jahre mit Amber in Berührung kamen.</>:<>International artists, producers and musicians were <strong>constantly coming through Amber's doors.</strong> Names including <strong>RZA of the Wu-Tang Clan, Xavier Naidoo, Barrington Levy, Gentleman, Till Brönner, Kool Savas, Azad, M.O.R., Curse, Afrob, Sékou, Beenie Man, Anthony B, Ja Rule, Christina Milian, R. Kelly, Seeed, Katja Riemann and Saint Etienne</strong> are only a few examples of the extraordinary range of artists who crossed paths with Amber over the years.</>}</p>
     <p>{de?<>Von <strong>Soul, Jazz und R&amp;B über Hip-Hop und Reggae bis hin zu Dancehall und Pop</strong> trafen hier unterschiedlichste musikalische Welten aufeinander. Genau diese Mischung prägte den Charakter der Amber Studios: ein Ort, an dem internationale Sounds, Berliner Szene und unterschiedlichste musikalische Kulturen zusammenkamen.</>:<>From <strong>Soul, Jazz and R&amp;B to Hip-Hop, Reggae, Dancehall and Pop</strong>, different musical worlds met under one roof. This mix defined Amber Studios: a place where international sounds, the Berlin scene and a wide range of musical cultures came together.</>}</p>
     <p>{de?"Es wurde aufgenommen, produziert, gemischt, arrangiert und experimentiert – lange bevor Musikproduktion überwiegend aus Laptop und Presets bestand.":"Recording, production, mixing, arranging and experimentation happened here – long before music production became largely a matter of laptops and presets."}</p>
    </div>
   </div>
  </section>

  <section className="wrap historyEditorial historyLightSection">
   <div className="historySectionIntro"><h2>{de?<>RAUMAKUSTIK,<br/><em>SOUND UND MIXING.</em></>:<>ROOM ACOUSTICS,<br/><em>SOUND AND MIXING.</em></>}</h2></div>
   <div className="historyProse">
    <p>{de?<>George Brasch war dabei nicht nur als <strong>Producer, Recording- und Mixing Engineer</strong> tätig, sondern entwickelte zunehmend auch eine zweite große Stärke: die <strong>akustische Planung von Studios</strong>.</>:<>George Brasch was not only active as a <strong>producer, recording and mixing engineer</strong>. He also developed a second major strength: <strong>the acoustic design of studios.</strong></>}</p>
    <p>{de?"Denn wer über Jahrzehnte täglich hört, wie sich Schall in einem Raum verhält, entwickelt ein anderes Verständnis für Akustik als jemand, der nur mit Formeln arbeitet.":"Anyone who listens to the way sound behaves in a room every day for decades develops a different understanding of acoustics from someone working with formulas alone."}</p>
    <blockquote>{de?"Erfahrung hört Dinge, bevor sie sich messen lassen.":"Experience hears things before they can be measured."}</blockquote>
    <p>{de?"Genau dieses Verständnis floss in die Planung und den Bau der Amber Studios ein und später auch in weitere Studios in Berlin.":"That understanding informed the planning and construction of the Amber Studios and, later, other studios in Berlin."}</p>
    <p>{de?<>Dabei ging es nie nur darum, Absorber an Wände zu hängen. Entscheidend war immer die Frage: <strong>Wie muss ein Raum gebaut sein, damit Musik darin zu leben beginnt?</strong></>:<>It was never simply about hanging absorbers on walls. The essential question was always: <strong>How should a room be built so music can come alive within it?</strong></>}</p>
    <p>{de?"Kontrolle im Bassbereich, präzise Mitten, ein verlässliches Stereobild und gleichzeitig ein Raum, in dem Musiker sich wohlfühlen – für George Brasch gehörten technische Präzision und musikalisches Gefühl immer zusammen.":"Controlled bass, precise midrange, a reliable stereo image – and a space in which musicians feel at ease. For George Brasch, technical precision and musical instinct have always gone hand in hand."}</p>
   </div>
  </section>

  <section className="wrap historyTimeline history2003Timeline"><div className="historyYearEntry">
   <div className="historyYearWithCover"><span className="historyYear">2003</span><img src="/images/studio/03_Studio2_4K.webp" alt="AMBER Recording Studio" className="history2003Hero"/></div>
   <div className="historyYearCopy"><h2>{de?"Neue Strukturen. Neue Produktionen.":"New structures. New productions."}</h2>
     <p>{de?<>Um <strong>2003</strong> veränderte sich die internationale Musikbranche radikal. Tonträgerverkäufe brachen ein, Budgets wurden kleiner und viele Studios mussten ihre Strukturen neu denken. Auch Amber wurde kompakter – die Arbeit ging jedoch weiter.</>:<>Around <strong>2003</strong>, the international music industry changed radically. Physical sales fell, budgets shrank and many studios had to rethink their structures. Amber became more compact, but the work continued.</>}</p>
     <p>{de?<>In dieser Zeit entstanden zahlreiche Produktionen und Mixe von George Brasch, unter anderem im Umfeld von <strong>Seeed</strong>. Dazu gehörten Titel wie <strong>„She Got Me Twisted“, „Pressure“, „Shake Baby Shake“ und „What You Deserve Is What You Get“</strong>.</>:<>During this period George Brasch created numerous productions and mixes, including work associated with <strong>Seeed</strong>, such as <strong>“She Got Me Twisted”, “Pressure”, “Shake Baby Shake” and “What You Deserve Is What You Get”.</strong></>}</p>
     <p>{de?<>Parallel entstand eine enge Verbindung zur deutschen Reggae- und Dancehall-Szene, insbesondere zum Umfeld von <strong>Rootdown Records</strong>. Künstler wie <strong>Nosliw, Jaqee, Maxim und Koalas Desperados</strong> gehörten zu jener Generation, die den deutschen Reggae-Sound der 2000er prägte.</>:<>At the same time, close ties developed with the German Reggae and Dancehall scenes, particularly around <strong>Rootdown Records</strong>. Artists such as <strong>Nosliw, Jaqee, Maxim and Koalas Desperados</strong> belonged to the generation that shaped German Reggae in the 2000s.</>}</p>
     <p>{de?"Auch in dieser Phase blieb Amber ein Ort, an dem nicht nur technisch gearbeitet wurde, sondern an dem Musik ihren eigenen Charakter bekommen sollte.":"Through this period, Amber remained a place where the goal was not simply technical work, but helping music find its own character."}</p>
   </div>
  </div></section>

  <section className="wrap historyTimeline history2004Timeline"><div className="historyYearEntry">
   <div className="historyYearWithCover"><span className="historyYear">2004</span><figure className="history2004Figure"><img src="/images/Amber%20old/Amber-Freudenhaus%20Studio.png" alt="Freudenhaus Studio – vorher Amber Studio"/><figcaption>Freudenhaus Studio – vorher Amber Studio</figcaption></figure></div>
   <div className="historyYearCopy"><h2>{de?"Vom Amber Studio zu neuen Räumen.":"From Amber Studio to new spaces."}</h2>
    <p>{de?<>Das große Amber Studio in der Reichenberger Straße ging später in die Hände des Produzenten <strong>Patrik Majer</strong> über, bekannt durch seine Arbeit mit <strong>Wir sind Helden</strong>.</>:<>The large Amber studio on Reichenberger Straße later passed into the hands of producer <strong>Patrik Majer</strong>, known for his work with <strong>Wir sind Helden</strong>.</>}</p>
    <p>{de?<>Damit lebte ein Teil der ursprünglichen Studiophilosophie weiter: Räume, in denen nicht einfach nur aufgenommen, sondern <strong>Musik entwickelt</strong> werden konnte.</>:<>Part of the original studio philosophy lived on: rooms in which music could be <strong>developed</strong>, rather than simply recorded.</>}</p>
    <p>{de?<>Auch nach Amber plante George Brasch weitere Produktionsräume und Studios. Dazu gehörten unter anderem Projekte für den Musiker <strong>Dejan Jovanović</strong> sowie die akustische Konzeption und Studioplanung für die Berliner DJs und Produzenten <strong>Chopstick &amp; Johnjon</strong>, Gründer des renommierten House-Labels <strong>SUOL</strong>.</>:<>After Amber, George Brasch continued to plan production rooms and studios. His projects included spaces for musician <strong>Dejan Jovanović</strong> and acoustic concepts and studio planning for Berlin DJs and producers <strong>Chopstick &amp; Johnjon</strong>, founders of the acclaimed House label <strong>SUOL</strong>.</>}</p>
    <blockquote>{de?"Architektur, Akustik und Musik müssen eine Einheit bilden.":"Architecture, acoustics and music must form a single whole."}</blockquote>
    <p>{de?"Denn ein guter Studioraum entsteht nicht allein auf dem Papier. Wer selbst produziert, aufnimmt und mischt, weiß, wie entscheidend jede Reflexion, jede Raummode und selbst kleine Veränderungen der Abhörposition für eine Produktion sein können.":"A great studio room is not created on paper alone. Anyone who produces, records and mixes understands how much every reflection, every room mode and even small changes in the listening position can affect a production."}</p>
    <p>{de?"Wer ein Gespür für Musik hat und aus jahrelanger Erfahrung als Engineer weiß, wie sich Schallwellen im Raum verhalten, hat gegenüber reiner Theorie und Mathematik einen entscheidenden Vorteil: Man hört nicht nur den Raum – man versteht, was Musik in ihm braucht.":"Someone with a feel for music and years of engineering experience in how sound waves behave in a room brings something beyond theory and mathematics: they do not merely hear the room – they understand what music needs from it."}</p>
    <p>{de?<>Nach mehr als drei Jahrzehnten im Studio ist genau diese Verbindung aus <strong>musikalischem Gehör, technischer Erfahrung und Raumverständnis</strong> zu einem der wichtigsten Bestandteile von George Braschs Arbeit geworden.</>:<>After more than three decades in the studio, the combination of <strong>musical hearing, technical experience and an understanding of space</strong> has become one of the defining elements of George Brasch's work.</>}</p>
   </div>
  </div></section>

  <footer className="historyClosing"><div className="wrap"><small>AMBER / FROM THE FIRST NOTE TO THE FINAL MASTER</small><h2>{de?<>AMBER WAR NIE NUR<br/><em>EIN STUDIO ODER EIN LABEL.</em></>:<>AMBER WAS NEVER JUST<br/><em>A STUDIO OR A LABEL.</em></>}</h2><p>{de?"Es war ein Ort, an dem Musik entstanden ist – vom ersten Ton bis zum fertigen Master.":"It was a place where music came to life – from the very first note to the finished master."}</p></div></footer>
 </div>;
}
