"use client";
import {useEffect,useRef,useState,type ReactNode} from "react";
import {ArrowUpRight,Play,SkipBack,SkipForward} from "lucide-react";

export type YouTubePlaylist={
 id:string;
 firstVideoId?:string;
 tracks:{number:number;title:string}[];
};
type Player={
 cuePlaylist:(args:{listType:"playlist";list:string;index:number})=>void;
 playVideoAt:(index:number)=>void;
 playVideo:()=>void;
 getPlaylist:()=>string[]|undefined;
 getPlaylistIndex:()=>number;
 destroy:()=>void;
};
type YTApi={Player:new (mount:HTMLElement,options:{
 width:string;height:string;
 playerVars:{playsinline:number;rel:number;controls:number};
 events:{onReady:(event:{target:Player})=>void;onStateChange:(event:{target:Player;data:number})=>void;onError:(event:{data:number})=>void};
})=>Player};
type YTWindow=Window&{YT?:YTApi;onYouTubeIframeAPIReady?:(()=>void)};
type Props={playlist:YouTubePlaylist;entry:{artist:string;title:string;image:string;label?:string};credit:ReactNode;lang:"de"|"en"};
export default function YouTubePlaylistDiscography({playlist,entry,credit,lang}:Props){
 const mount=useRef<HTMLDivElement>(null);
 const player=useRef<Player|null>(null);
 const [index,setIndex]=useState(0);
 const [verified,setVerified]=useState(false);
 const [count,setCount]=useState<number|null>(null);
 const [error,setError]=useState("");
 const valid=/^[A-Za-z0-9_-]+$/.test(playlist.id)&&(!playlist.firstVideoId||/^[A-Za-z0-9_-]{11}$/.test(playlist.firstVideoId));
 useEffect(()=>{
  if(!valid)return;
  let disposed=false;
  let instance:Player|null=null;
  const win=window as YTWindow;
  const checkList=(target:Player)=>{
   const ids=target.getPlaylist();
   if(Array.isArray(ids)&&ids.length){
    setCount(ids.length);
    const matches=ids.length===playlist.tracks.length&&(!playlist.firstVideoId||ids[0]===playlist.firstVideoId);
    setVerified(matches);
    const current=target.getPlaylistIndex();
    if(matches&&current>=0&&current<playlist.tracks.length)setIndex(current);
   }
  };
  const initialize=()=>{
   if(disposed||!mount.current||!win.YT?.Player)return;
   instance=new win.YT.Player(mount.current,{
    width:"100%",height:"220",
    playerVars:{playsinline:1,rel:0,controls:1},
    events:{
     onReady:event=>{
      if(disposed)return;
      player.current=event.target;
      event.target.cuePlaylist({listType:"playlist",list:playlist.id,index:0});
     },
     onStateChange:event=>{if(!disposed)checkList(event.target)},
     onError:()=>{if(!disposed)setError(lang==="de"?"Ein YouTube-Titel konnte nicht wiedergegeben werden.":"A YouTube track could not be played.")}
    }
   });
  };
  const prior=win.onYouTubeIframeAPIReady;
  const whenReady=()=>{prior?.();initialize()};
  if(win.YT?.Player)initialize();
  else{
   win.onYouTubeIframeAPIReady=whenReady;
   if(!document.getElementById("amberYouTubeIframeApi")){
    const script=document.createElement("script");
    script.id="amberYouTubeIframeApi";
    script.src="https://www.youtube.com/iframe_api";
    script.async=true;
    script.onerror=()=>{if(!disposed)setError(lang==="de"?"YouTube-Player konnte nicht geladen werden.":"YouTube player could not be loaded.")};
    document.head.appendChild(script);
   }
  }
  return ()=>{disposed=true;player.current=null;instance?.destroy();if(win.onYouTubeIframeAPIReady===whenReady)win.onYouTubeIframeAPIReady=prior};
 },[playlist.id,valid,lang]);
 const select=(next:number)=>{
  if(!verified||next<0||next>=playlist.tracks.length||!player.current)return;
  setIndex(next);
  player.current.playVideoAt(next);
 };
 const selected=playlist.tracks[index]||playlist.tracks[0];
 const playlistUrl="https://www.youtube.com/playlist?list="+encodeURIComponent(playlist.id);
 return <div className="amberDiscography">
  <div className="amberDiscHeader">
   <img src={entry.image} alt=""/>
   <div className="amberDiscInfo"><small>AMBER / YOUTUBE DISCOGRAPHY</small><strong>{entry.artist}</strong><span>{entry.title}</span>{selected&&<span className="amberYouTubeNow">{String(selected.number).padStart(2,"0")} · {selected.title}</span>}<div className="amberDiscCredit">{credit}</div></div>
   <div className="amberDiscTransport">
    <button type="button" disabled={!verified||index===0} aria-label={lang==="de"?"Vorheriger Titel":"Previous track"} onClick={()=>select(index-1)}><SkipBack size={18} fill="currentColor"/></button>
    <button type="button" disabled={!verified||index===playlist.tracks.length-1} aria-label={lang==="de"?"Nächster Titel":"Next track"} onClick={()=>select(index+1)}><SkipForward size={18} fill="currentColor"/></button>
    <button type="button" disabled={!verified} className="amberDiscMainPlay" aria-label={lang==="de"?"Wiedergabe starten":"Play"} onClick={()=>player.current?.playVideo()}><Play size={22} fill="currentColor"/></button>
   </div>
  </div>
  <div className="amberYouTubeFrame amberPlaylistEmbed">
   {valid?<div ref={mount} className="amberPlaylistMount"/>:<p>{lang==="de"?"Ungültige Playlist-ID.":"Invalid playlist ID."}</p>}
   <a href={playlistUrl} target="_blank" rel="noopener noreferrer">{lang==="de"?"PLAYLIST AUF YOUTUBE ÖFFNEN":"OPEN PLAYLIST ON YOUTUBE"} <ArrowUpRight size={13}/></a>
   {count!==null&&!verified&&<p className="amberPlaylistNotice">{lang==="de"?"YouTube meldet "+count+" Videos statt der erwarteten "+playlist.tracks.length+". Die Titelliste bleibt deshalb vorsorglich ohne Direktwahl.":"YouTube returns "+count+" videos instead of the expected "+playlist.tracks.length+". Direct track selection is disabled to avoid mismatches."}</p>}
   {error&&<p className="amberPlaylistNotice" role="alert">{error}</p>}
  </div>
  <div className="amberDiscTracks" aria-label={lang==="de"?"NLP Albumtitelliste":"NLP album tracklist"}>
   {playlist.tracks.map((track,i)=><button type="button" key={track.number} disabled={!verified} className={i===index&&verified?"is-active":""} onClick={()=>select(i)}>
    <span className="amberDiscNumber">{String(track.number).padStart(2,"0")}</span><span className="amberDiscTrackName">{track.title}</span><Play size={13}/>
   </button>)}
  </div>
 </div>;
}
