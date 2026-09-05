const loader=document.getElementById('loader');
const percent=document.getElementById('load-percent');
const bar=document.getElementById('progress-bar');
const loaderStatus=document.getElementById('loader-status');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

const loaderMessages=[
  'CONNECTING TO THE GRID...',
  'LOADING SANDI SAPTA A.P...',
  'CALIBRATING CINEMATIC ENGINE...',
  'BUILDING DIGITAL EXPERIENCE...',
  'SYSTEM READY.'
];
let p=0, messageIndex=0;
const timer=setInterval(()=>{
  p+=Math.floor(Math.random()*6)+3;
  if(p>=100){
    p=100; clearInterval(timer);
    loader.classList.add('rush','glitch');
    loaderStatus.textContent='SYSTEM READY.';
    setTimeout(()=>loader.classList.add('hide'),700);
  }
  percent.textContent=p+'%'; bar.style.width=p+'%';
  const next=Math.min(4,Math.floor(p/25));
  if(next!==messageIndex){
    messageIndex=next; loaderStatus.textContent=loaderMessages[next];
    loader.classList.remove('glitch'); void loader.offsetWidth; loader.classList.add('glitch');
  }
},70);

function starsCanvas(id,count){
  const c=document.getElementById(id),ctx=c.getContext('2d');
  let items=[];
  function resize(){
    const d=devicePixelRatio||1;
    c.width=innerWidth*d;c.height=innerHeight*d;
    c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';
    ctx.setTransform(d,0,0,d,0,0);
    items=Array.from({length:count},()=>({
      x:Math.random()*innerWidth,y:Math.random()*innerHeight,
      r:Math.random()*1.4+.2,a:Math.random()*.75+.12,s:Math.random()*.38+.08
    }));
  }
  function draw(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(const s of items){
      s.y+=s.s;if(s.y>innerHeight)s.y=-2;
      ctx.globalAlpha=s.a;ctx.fillStyle=Math.random()>.9?'#4e82ff':'#fff';
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize();addEventListener('resize',resize);draw();
}
starsCanvas('stars',180);starsCanvas('stars-loader',320);

// Portrait transformation. It keeps the user's actual photo and adds a Spider-Man-inspired
// mask/web treatment rather than pretending an AI transformation is an authentic photograph.
const person=document.getElementById('person');
const personStage=document.querySelector('.person-stage');
person.addEventListener('click',()=>{
  const on=!person.classList.contains('spider');
  person.classList.toggle('spider');
  if(on){
    personStage.classList.remove('transforming');void personStage.offsetWidth;personStage.classList.add('transforming');
    for(let i=0;i<22;i++){
      const el=document.createElement('i');el.className='web-particle';
      el.style.setProperty('--angle',`${i*16+Math.random()*10}deg`);
      el.style.setProperty('--distance',`${100+Math.random()*190}px`);
      el.style.setProperty('--delay',`${Math.random()*80}ms`);
      personStage.appendChild(el);setTimeout(()=>el.remove(),1100);
    }
  }
});

// Active navigation
const links=[...document.querySelectorAll('.nav-link')];
const sections=[...document.querySelectorAll('section[id]')];
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id));});
},{threshold:.42});
sections.forEach(s=>observer.observe(s));

// Reveal sections
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}});
},{threshold:.12,rootMargin:'0px 0px -55px 0px'});
document.querySelectorAll('.reveal').forEach(e=>revealObserver.observe(e));

// Scroll progress + cinematic depth
const progress=document.getElementById('scroll-progress');
const cinematicSections=[...document.querySelectorAll('.cinematic-section')];
let scrollTick=false;
function updateScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  if(progress)progress.style.width=(max?scrollY/max*100:0)+'%';
  document.documentElement.style.setProperty('--scroll-y',`${scrollY}px`);
  cinematicSections.forEach(s=>{
    const r=s.getBoundingClientRect(),center=r.top+r.height/2;
    s.style.setProperty('--section-shift',`${((innerHeight/2-center)*.045).toFixed(2)}px`);
  });
  scrollTick=false;
}
addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(updateScroll);scrollTick=true;}},{passive:true});
updateScroll();

// Mouse spotlight + parallax
if(!reduceMotion && matchMedia('(pointer:fine)').matches){
  const glow=document.getElementById('cursor-glow');
  addEventListener('pointermove',e=>{
    glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';
    document.documentElement.style.setProperty('--mouse-x',`${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y',`${e.clientY}px`);
    document.querySelectorAll('[data-parallax]').forEach(el=>{
      const amount=parseFloat(el.dataset.parallax)||.05;
      const x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;
      el.style.transform=`translate3d(${(x*amount*35).toFixed(1)}px,${(y*amount*35).toFixed(1)}px,0)`;
    });
  });
}

// 3D project cards
document.querySelectorAll('.project,.award-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    if(reduceMotion||matchMedia('(pointer:fine)').matches===false)return;
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(850px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-7px)`;
  });
  card.addEventListener('pointerleave',()=>card.style.transform='');
});
