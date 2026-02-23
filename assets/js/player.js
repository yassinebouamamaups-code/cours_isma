/* ===== AUDIO ===== */

const audio = new Audio(
  location.hostname.includes("github.io")
    ? "/cours_isma/assets/audio/fatha.mp3"
    : "../../assets/audio/fatha.mp3"
);
let activeBand = null;
let playToken = 0;
let timer=null;
let isPlaying=false;
let currentButton=null;


/* ===== RENDU ===== */

function renderAll(){

  for(let i = 1; i <= 12; i++){

    const box = document.getElementById("band" + i);
    if(!box) continue;

    renderLine("band" + i, DATA["band" + i]);
  }
}


function renderLine(containerId, data){

  const box = document.getElementById(containerId);
  box.innerHTML = "";

  const bandNumber = parseInt(containerId.replace("band",""));

  /* ===== À partir de band3 → affichage en tableau ===== */
  if(bandNumber >= 3 && bandNumber !== 12){

    const tableWrap = document.createElement("div");
    tableWrap.className = "table-line";

    const groups = [];

    /* Découpe en groupes de 3 */
    for(let i = 0; i < data.length; i += 3){
      groups.push(data.slice(i, i + 3));
    }

    /* Sens RTL */
    groups.reverse().forEach(groupData => {

      const groupDiv = document.createElement("div");
      groupDiv.className = "group";

      groupData.reverse().forEach(letter => {

        const wrap = document.createElement("div");
        wrap.className = "letter";

        const base = document.createElement("span");
        base.className = "base";
        base.textContent = letter;

        const haraka = document.createElement("span");
        haraka.className = "haraka";
        haraka.textContent = "َ";

        wrap.append(base, haraka);
        groupDiv.appendChild(wrap);

      });

      tableWrap.appendChild(groupDiv);

    });

    box.appendChild(tableWrap);

  }

  /* ===== Bandes 1 & 2 → affichage simple ===== */
  else{

    data.slice().reverse().forEach(letter => {

      const wrap = document.createElement("div");
      wrap.className = "letter";

      const base = document.createElement("span");
      base.className = "base";
      base.textContent = letter;

      const haraka = document.createElement("span");
      haraka.className = "haraka";
      haraka.textContent = "َ";

      wrap.append(base, haraka);
      box.appendChild(wrap);

    });

  }

}


/* ===== PLAYER ===== */

function stop(){

  playToken++; // tue les anciens lecteurs

  audio.pause();
  audio.currentTime = 0;

  if(timer){
    clearTimeout(timer);
    timer = null;
  }

  document
    .querySelectorAll(".letter")
    .forEach(l => l.classList.remove("active"));

  document
    .querySelectorAll(".play")
    .forEach(b => b.textContent = "▶");

  isPlaying = false;
  currentButton = null;
  activeBand = null;
}


function togglePlay(id,btn){


  // Si on reclique sur le même → pause
  if(isPlaying && activeBand === id){
    stop();
    return;
  }

  // Sinon on coupe tout
  stop();

  activeBand = id;
  currentButton = btn;
  btn.textContent = "⏸";
  isPlaying = true;

  const token = ++playToken;

  const letters =
    document.getElementById(id)
    .querySelectorAll(".letter");

  let i = 0;

  function playNext(){

    // Si un autre play est lancé → stop
    if(token !== playToken) return;

    if(!isPlaying || i >= letters.length){
      stop();
      return;
    }

    const cur = letters[i];
const base = cur.querySelector(".base").textContent.trim();

    cur.classList.add("active");

    const d = SOUNDS[base];

    if(!d){
      console.warn("Son manquant :", base);
      i++;
      playNext();
      return;
    }

    audio.currentTime = d.start;
    audio.play();

    timer = setTimeout(()=>{

      audio.pause();
      cur.classList.remove("active");

      i++;
      setTimeout(playNext, 300);

    }, (d.d + 0.15) * 1000);
  }

  playNext();
}

document.addEventListener("DOMContentLoaded",renderAll);