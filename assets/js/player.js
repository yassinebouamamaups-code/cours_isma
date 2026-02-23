/* ===== AUDIO ===== */

const audio = new Audio(
  location.hostname.includes("github.io")
    ? "/cours_isma/assets/audio/fatha.mp3"
    : "../../assets/audio/fatha.mp3"
);

let timer=null;
let isPlaying=false;
let currentButton=null;


/* ===== RENDU ===== */

function renderAll(){

  for(let i=1;i<=12;i++){

    const box=document.getElementById("band"+i);
    if(!box) continue;

    renderLine("band"+i, DATA["band"+i]);
  }
}

function renderLine(id,data){

  const box=document.getElementById(id);
  box.innerHTML="";

  data.slice().reverse().forEach(l=>{

    const wrap=document.createElement("div");
    wrap.className="letter";

    const base=document.createElement("span");
    base.textContent=l;

    const haraka=document.createElement("span");
    haraka.className="haraka";
    haraka.textContent="َ";

    wrap.append(base,haraka);
    box.appendChild(wrap);

  });
}


/* ===== PLAYER ===== */

function stop(){

  audio.pause();
  audio.currentTime=0;

  clearTimeout(timer);

  document
    .querySelectorAll(".letter")
    .forEach(l=>l.classList.remove("active"));

  if(currentButton){
    currentButton.textContent="▶";
  }

  isPlaying=false;
  currentButton=null;
}


function togglePlay(id,btn){

  if(isPlaying && currentButton===btn){
    stop();
    return;
  }

  stop();

  currentButton=btn;
  btn.textContent="⏸";
  isPlaying=true;

  const letters=
    document.getElementById(id)
    .querySelectorAll(".letter");

  let i=0;

  function playNext(){

    if(!isPlaying || i>=letters.length){
      stop();
      return;
    }

    const cur=letters[i];
const base = cur.querySelector("span").textContent;;

    cur.classList.add("active");

    const d=SOUNDS[base];

    audio.currentTime=d.start;
    audio.play();

    timer=setTimeout(()=>{

      audio.pause();
      cur.classList.remove("active");

      i++;
      setTimeout(playNext,300);

    },(d.d+0.15)*1000);
  }

  playNext();
}

document.addEventListener("DOMContentLoaded",renderAll);