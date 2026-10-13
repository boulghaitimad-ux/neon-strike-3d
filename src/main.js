import '../styles/style.css';
import { Game } from './game.js';

const byId = id => document.getElementById(id);
const ui = {
  overlay: byId('overlay'), hud: byId('hud'), pause: byId('pause-screen'), result: byId('result-screen'),
  play: byId('play-btn'), levels: byId('levels-btn'), levelSelect: byId('level-select'),
  resume: byId('resume-btn'), restart: byId('restart-btn'), menu: byId('menu-btn'),
  next: byId('next-btn'), retry: byId('retry-btn'), resultMenu: byId('result-menu-btn'),
  resultTitle: byId('result-title'), resultCopy: byId('result-copy'), resultEyebrow: byId('result-eyebrow'),
  finalScore: byId('final-score'), objective: byId('objective'), score: byId('score'),
  healthFill: byId('health-fill'), healthText: byId('health-text'), ammo: byId('ammo'),
  enemyCount: byId('enemy-count'), toast: byId('toast'), hitFlash: byId('hit-flash')
};
let chosenLevel = 0, game;
const save = (()=>{try{return JSON.parse(localStorage.getItem('neon-strike-save'))||{unlocked:0,best:0}}catch{return {unlocked:0,best:0}}})();
document.querySelectorAll('.level-choice').forEach(btn=>{
  const n=Number(btn.dataset.level);
  if(n>save.unlocked){btn.style.opacity='.35';btn.title='Completa el sector anterior para desbloquearlo';}
  btn.addEventListener('click',()=>{if(n>save.unlocked)return;chosenLevel=n;document.querySelectorAll('.level-choice').forEach(b=>b.classList.toggle('active',b===btn));});
});
ui.levels.addEventListener('click',()=>ui.levelSelect.classList.toggle('hidden'));
function showMenu(){game?.stop();ui.hud.classList.add('hidden');ui.pause.classList.add('hidden');ui.result.classList.add('hidden');ui.overlay.classList.remove('hidden');}
function start(level=chosenLevel){ui.overlay.classList.add('hidden');ui.pause.classList.add('hidden');ui.result.classList.add('hidden');ui.hud.classList.remove('hidden');game?.dispose();game=new Game(document.getElementById('game-canvas'),ui,level,save);game.start();}
ui.play.addEventListener('click',()=>start());
ui.resume.addEventListener('click',()=>game?.resume());
ui.restart.addEventListener('click',()=>start(game?.levelIndex??chosenLevel));
ui.menu.addEventListener('click',showMenu);
ui.retry.addEventListener('click',()=>start(game?.levelIndex??chosenLevel));
ui.resultMenu.addEventListener('click',showMenu);
ui.next.addEventListener('click',()=>{chosenLevel=Math.min(2,(game?.levelIndex??0)+1);start(chosenLevel);});
document.addEventListener('keydown',e=>{if(e.code==='Escape'&&game?.running)game.pause();});
window.addEventListener('beforeunload',()=>game?.dispose());
window.addEventListener('neon-result',e=>{
  const {won,score,level}=e.detail;
  ui.hud.classList.add('hidden');ui.result.classList.remove('hidden');
  ui.resultEyebrow.textContent=won?'MISIÓN COMPLETADA':'SEÑAL PERDIDA';
  ui.resultTitle.innerHTML=won?'SECTOR<span> ASEGURADO</span>':'MISIÓN<span> FALLIDA</span>';
  ui.resultCopy.textContent=won?(level<2?'Zona despejada. Sector siguiente desbloqueado.':'El núcleo ha sido neutralizado. La ciudad es tuya.'):'Te han superado. Reagrúpate y vuelve a intentarlo.';
  ui.finalScore.textContent=String(score).padStart(6,'0');
  ui.next.classList.toggle('hidden',!won||level>=2);
  if(won){save.unlocked=Math.max(save.unlocked,Math.min(2,level+1));save.best=Math.max(save.best,score);try{localStorage.setItem('neon-strike-save',JSON.stringify(save))}catch{}}
});
window.addEventListener('neon-hud',e=>{
  const d=e.detail;ui.score.textContent=String(d.score).padStart(6,'0');ui.healthFill.style.width=`${d.health}%`;ui.healthText.textContent=`${Math.ceil(d.health)}%`;ui.ammo.innerHTML=`${d.ammo} <i>/ ${d.reserve}</i>`;ui.enemyCount.textContent=d.enemies;ui.objective.textContent=d.objective;
});
window.addEventListener('neon-toast',e=>{ui.toast.textContent=e.detail;ui.toast.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>ui.toast.classList.remove('show'),1200)});
window.addEventListener('neon-hit',()=>{ui.hitFlash.style.opacity='.75';setTimeout(()=>ui.hitFlash.style.opacity='0',130)});
window.addEventListener('neon-unlocked',e=>{document.querySelectorAll('.level-choice').forEach(btn=>{const n=Number(btn.dataset.level);if(n<=e.detail){btn.style.opacity='1';btn.title='';}})});
