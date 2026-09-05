const loader=document.getElementById('loader');
const percent=document.getElementById('load-percent');
const bar=document.getElementById('progress-bar');
let p=0;
const timer=setInterval(()=>{
  p+=Math.floor(Math.random()*7)+2;
  if(p>=100){p=100;clearInterval(timer);setTimeout(()=>loader.classList.add('hide'),500)}
  percent.textContent=p+'%'; bar.style.width=p+'%';
},85);

// Star field
function starsCanvas(id,count){
  const c=document.getElementById(id),ctx=c.getContext('2d');
  let w,h,items=[];
  function resize(){w=c.width=innerWidth*devicePixelRatio;h=c.height=innerHeight*devicePixelRatio;ctx.setTransform(1,0,0,1,0,0);ctx.scale(devicePixelRatio,devicePixelRatio);items=Array.from({length:count},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.25,a:Math.random()*.8+.15,s:Math.random()*.45+.1}))}
  function draw(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(const s of items){s.y+=s.s;if(s.y>innerHeight)s.y=-2;ctx.globalAlpha=s.a;ctx.fillStyle=Math.random()>.9?'#4e82ff':'#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}
    requestAnimationFrame(draw)
  }
  resize();addEventListener('resize',resize);draw();
}
starsCanvas('stars',170); starsCanvas('stars-loader',300);

// Click the portrait: normal -> Spider-Man -> normal
const person=document.getElementById('person');
person.addEventListener('click',()=>person.classList.toggle('spider'));

// Active navigation based on section
const links=[...document.querySelectorAll('.nav-link')];
const sections=[...document.querySelectorAll('section[id]')];
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id))}})
},{threshold:.45});
sections.forEach(s=>observer.observe(s));
