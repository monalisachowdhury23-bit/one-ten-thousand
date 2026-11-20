(()=>{
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const cv=$('#stage'), ctx=cv.getContext('2d');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ss=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const ease=t=>1-Math.pow(1-clamp(t),3);
const lerp=(a,b,t)=>a+(b-a)*t;
const hash=(a,b=0)=>{let h=2166136261^(a*374761393)^(b*668265263);h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296};
const MONO='"Space Mono",ui-monospace,Menlo,monospace', GROT='"Space Grotesk",system-ui,sans-serif';
const PINK=[255,90,54], INK=[236,230,219];

/* ───────── the thousand ───────── */
const REAL=[
 {t:'Book the table for Saturday',s:'waiting',m:[
   ['u','Book a table for four on Saturday. Near Priya’s, not too loud, around 8.'],
   ['a','On it. Checking places within ten minutes of Priya’s that take bookings.'],
   ['a','Three that fit: Nova, Little Bao, Casa Rosa. Casa Rosa is loud on weekends, skipping it.'],
   ['a','Nova has 7:45 or 9:15. Everything between 8 and 9 is gone. Little Bao has 8:15, but it’s a counter, not a table.'],
   ['q','Sam’s train gets in at 7:50, so 7:45 is tight. <b>Take 9:15 at Nova, or 8:15 at the counter?</b>']],
   last:'Needs you: 9:15 at Nova, or 8:15 at the counter?'},
 {t:'Order the cake',s:'waiting',m:[['u','A cake for Saturday. Chocolate, no nuts, for four.'],['a','Flour & Co can do it, pickup Saturday 11am. The other two are fully booked.'],['q','<b>Writing on top costs 15 extra. Add “Happy birthday Priya”?</b>']],last:'Needs you: add writing for 15 extra?'},
 {t:'Get Sam from the station',s:'waiting',m:[['u','Sam’s train gets in at 7:50 on Saturday. Get him to dinner.'],['a','The taxi rank is busy on Saturday nights. Booking ahead costs 6 more.'],['q','<b>Book a cab for 7:55?</b>']],last:'Needs you: book a cab for 7:55?'},
 {t:'Find a gift for Priya',s:'working',m:[['u','A gift for Priya, under 60. She’s into ceramics lately.'],['a','Reading forty listings from four shops.'],['a','Two good ones ship by Friday. Checking reviews.']],last:'Two ship by Friday. Checking reviews.'},
 {t:'Tell the guests',s:'done',m:[['u','Let Sam, Riya and Dev know the plan.'],['a','Messages sent. Riya and Dev confirmed.'],['a','Done.']],last:'Done. Two confirmed, Sam pending.'},
 {t:'Ask Dev what he can’t eat',s:'done',m:[['u','Check Dev’s allergies.'],['a','Asked. Shellfish, nothing else.'],['a','Done. Passed to the table and cake agents.']],last:'Done. Shellfish only.'},
 {t:'Plan something after dinner',s:'waiting',m:[['u','Something to do after dinner, walking distance.'],['a','Jazz at The Vault from 10, or the gallery’s late opening until 11.'],['q','<b>Jazz, or the gallery?</b>']],last:'Needs you: jazz, or the gallery?'},
 {t:'Book a cab home',s:'working',m:[['u','Four people home after 11.'],['a','Two firms have cars after 11. Comparing prices.']],last:'Comparing two firms.'},
 {t:'Buy a card',s:'done',m:[['u','A birthday card, posted to arrive by Friday.'],['a','Ordered. Arrives Friday.'],['a','Done.']],last:'Done. Arrives Friday.'},
 {t:'Set up the bill split',s:'done',m:[['u','Set up a way to split dinner four ways.'],['a','Group created for four. Link sent to everyone.'],['a','Done.']],last:'Done. Group set up for four.'}
];
const BASE=['Check Nova’s menu for shellfish','Ask Little Bao about a booth','Call Casa Rosa about noise','Compare six bakeries','Check Flour & Co pickup times','Check train delays for Sam','Compare cab prices','Read reviews for the ceramic vase','Check gift delivery dates','Look up The Vault’s line-up','Check the gallery’s late hours','Find parking near Nova','Check the walk to The Vault','Ask Riya about dessert','Find candles','Compare wrapping options','Check Nova’s cancellation policy','Check Saturday’s weather','Find a backup restaurant','Check the cab rank queue','Ask the bakery about nut traces','Check if Nova takes deposits','Compare three florists','Find a quieter time slot','Read the bakery reviews','Check the card shop stock','Ask Sam about his bag','Check late buses home','Compare bars near Nova','Confirm the cake size','Check gallery ticket prices','Look up The Vault’s dress code','Track the gift parcel','Check Riya’s pickup time','Find a second gift option','Ask Nova about a window table','Check the station exits','Compare two vase sellers','Check bakery opening hours','Ask Dev about his train home'];
const SUF=['','','',' for Saturday',' near Priya’s',' before Friday',' again',' for four',', second try',', backup'];
const WORK=['Checking three options.','Reading the reply.','On hold, 12 minutes.','Comparing prices.','Waiting for the site to load.','Second attempt.','Drafting the email.','Found two, checking a third.','Filling the form.'];
const WAITQ=['Needs you: pay the deposit?','Needs you: 7 or 7:30?','Needs you: go ahead at this price?','Needs you: which card?','Needs you: is Sam bringing a bag?','Needs you: is this the right address?','Needs you: candles or sparklers?','Needs you: which of the two?'];
const DONE=['Done. Confirmation sent.','Done. Paid.','Done. Passed up.','Done. Booked for Saturday.','Done. Reply forwarded.','Done, nothing further.'];
const N_ALL=1000, C=[];
for(let i=0;i<N_ALL;i++){
  const r=i<REAL.length?REAL[i]:null;
  const st=r?r.s:(hash(i,1)<.5?'working':hash(i,1)<.78?'waiting':'done');
  const title=r?r.t:BASE[(i*7)%BASE.length]+SUF[Math.floor(hash(i,2)*SUF.length)];
  const last=r?r.last:(st==='working'?WORK[Math.floor(hash(i,3)*WORK.length)]:st==='waiting'?WAITQ[Math.floor(hash(i,4)*WAITQ.length)]:DONE[Math.floor(hash(i,5)*DONE.length)]);
  const a=(i+1)*2.399963, rr=Math.sqrt(i+1);             /* sunflower spiral around your agent at 0,0 */
  C.push({i,t:title,s:st,m:r?r.m:null,last,x:Math.cos(a)*rr,y:Math.sin(a)*rr,ph:hash(i,6)*6.28,sp:.7+hash(i,7)*.8,src:(title+' '+last).replace(/\s+/g,' ')});
}
/* who hired whom: ten jobs under your agent, each later agent under the nearest one a level up */
for(let i=0;i<N_ALL;i++){ const c=C[i]; if(i<10){c.p=-1;c.lv=1;continue}
  const lo=i<100?0:10, hi=i<100?10:100; let best=lo,bd=1e9;
  for(let j=lo;j<hi;j++){ const d=Math.hypot(c.x-C[j].x,c.y-C[j].y); if(d<bd){bd=d;best=j} }
  c.p=best; c.lv=i<100?2:3; }

/* ───────── state ───────── */
let vw,vh,dpr,cx,cy,K,mobile,cwA=7.8;
const scenes=$$('.scene'), inners=scenes.map(s=>s.querySelector('.inner'));
let tops=[],hs=[],P=[],RAWP=[],scene=0,last=0;
let camN=1, camX=0, camY=0, s=300, G=0, yaw=0, pitch=.3, playZoom=3, dragging=false, dragMoved=false, lx=0, ly=0, hover=-1, openId=-1, mouse={x:-1e4,y:-1e4};
let play=false, grid=null, found=false, playT0=0, agentBox=null;
const T0=Date.now()-40*60*1000;

function resize(){
  vw=innerWidth;vh=innerHeight;dpr=Math.min(2,devicePixelRatio||1);mobile=vw<820;
  cv.width=Math.round(vw*dpr);cv.height=Math.round(vh*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  if(mobile){cx=vw/2;cy=vh*.27;K=Math.min(vw*.46,vh*.24)}else{cx=vw*.66;cy=vh*.5;K=Math.min(vw*.3,vh*.42)}
  tops=scenes.map(x=>x.offsetTop);hs=scenes.map(x=>x.offsetHeight);
  ctx.font=`13px ${MONO}`;cwA=ctx.measureText('@').width||7.8;
  const cols=Math.ceil(vw/cwA)+1, rows=Math.ceil(vh/15)+1;
  grid={cols,rows,I:new Float32Array(cols*rows),ID:new Int32Array(cols*rows),P:new Float32Array(cols*rows)};
}

/* ───────── conversation panel ───────── */
const convo=$('#convo');
function renderConvo(id,typedChars){
  const c=C[id]; let h='';
  if(c.m){
    h+=`<div class="who">${c.t}</div>`; let used=0;
    const M=c.m, last=M.length-1;
    M.forEach(([k,txt],j)=>{ const plain=txt.replace(/<[^>]+>/g,''); let show, partial=false;
      if(typedChars==null) show=txt; else { const n=clamp(typedChars-used,0,plain.length); used+=plain.length; partial=n<plain.length; show = partial?plain.slice(0,n):txt; if(n<=0) return; }
      h+=`<div class="msg vis ${k==='u'?'u':k==='q'?'a q':'a'}">${show}</div>`; });
    if(c.s==='waiting'&&(typedChars==null||typedChars>=c.m.reduce((n,[,t])=>n+t.replace(/<[^>]+>/g,'').length,0)))
      h+=`<div class="wait vis"><i></i>waiting for you · <span data-ago>${agoText()}</span></div>`;
    if(c.s==='done') h+=`<div class="wait vis" style="color:var(--mute)">done</div>`;
    if(c.s==='working') h+=`<div class="wait vis" style="color:var(--ink)"><i style="background:var(--ink)"></i>working</div>`;
  } else {
    h+=`<div class="empty"><b>${c.t}</b>${c.s} · ${c.last}<br><br>One of 990 like it. Nobody has read it.</div>`;
  }
  if(typedChars==null) h+=`<button class="close" id="cls">close ×</button>`;
  convo.innerHTML=h; const b=$('#cls'); if(b) b.onclick=()=>{openId=-1};
}
function agoText(){const m=Math.floor((Date.now()-T0)/60000);return m+' min'}
let lastTyped=-1, lastOpen=-2;


/* card labels at scale ten. On a phone they are kept on screen, titles are
   placed first, and any title or last line that would overlap is left out. */
function drawCard(c,i,a,r,cardA,placed,pass){
  const f1=mobile?11:13, f2=mobile?9:10.5, pad=12, al=cardA*a;
  const hit=b=>placed.some(q=>!(b[2]<q[0]||b[0]>q[2]||b[3]<q[1]||b[1]>q[3]));
  const fit=(x,w)=>Math.max(pad,Math.min(vw-pad-w,x));
  const back=b=>{ ctx.fillStyle=`rgba(20,16,22,${.82*al})`; ctx.fillRect(b[0],b[1],b[2]-b[0],b[3]-b[1]); };
  if(pass===0){
    ctx.font=`500 ${f1}px ${GROT}`; const w=ctx.measureText(c.t).width;
    const ty=c.sy-r*.7-14, tx=fit(c.sx-w/2,w), tb=[tx-4,ty-f1,tx+w+4,ty+5];
    c.tOk=!mobile||i===0||(ty>=72&&!hit(tb));
    if(!c.tOk) return;
    if(mobile){ placed.push(tb); back(tb); }
    ctx.fillStyle=`rgba(236,230,219,${al*.95})`; ctx.fillText(c.t,tx,ty); return;
  }
  if(!c.tOk) return;
  const l=c.last.length>44?c.last.slice(0,43)+'…':c.last;
  ctx.font=`${f2}px ${MONO}`; const w2=ctx.measureText(l).width;
  const ly=c.sy+r*.7+14, lx=fit(c.sx-w2/2,w2), lb=[lx-4,ly-f2-1,lx+w2+4,ly+4];
  if(mobile){ if(i>0&&hit(lb)) return; placed.push(lb); back(lb); }
  ctx.fillStyle=i===0&&!(play&&!found)?`rgba(255,90,54,${al})`:`rgba(236,230,219,${al*.55})`; ctx.fillText(l,lx,ly);
}

/* ───────── per-frame ───────── */
function frame(t){
  const dt=Math.min(.1,(t-last)/1000||.016); last=t; const kk=r=>RM?1:1-Math.exp(-dt*r);
  const y=scrollY;
  scenes.forEach((sc,k)=>{const raw=(y-tops[k])/Math.max(1,hs[k]-vh);RAWP[k]=raw;P[k]=clamp(raw);if(y+vh*.5>=tops[k])scene=k});
  if(y<tops[1]-vh*.6) scene=0;
  const wasPlay=play; play=RAWP[6]>.04&&RAWP[7]<.02; if(play&&!wasPlay&&!playT0) playT0=Date.now();
  const hl0=!(play&&!found);
  cv.classList.toggle('play',play);

  /* how many exist right now (log scale through the three zoom scenes) */
  let logN=0;
  if(P[2]>0) logN=ease(P[2]/.9); if(P[3]>0) logN=1+ease(P[3]/.9); if(P[4]>0) logN=2+ease(P[4]/.9);
  if(play) logN=playZoom;
  const Ncur=Math.pow(10,logN);
  if(!play){const f=1-ss(0,1,logN); camX+=(C[0].x*f-camX)*kk(6);camY+=(C[0].y*f-camY)*kk(6)}
  /* zoom: fit the first N into the stage. Extra push-in at the very start so one conversation fills the frame. */
  const sT=K/Math.sqrt(Math.max(1,Ncur))*(1+1.6*(1-ss(0,.35,logN)))*(1+(mobile?.08:.45)*ss(.3,1,logN)*(1-ss(1.2,2,logN)));
  s+=(sT-s)*kk(7); camN+=(Ncur-camN)*kk(7);
  G=ease((P[7]-.05)/.6);
  if(G>.5&&!dragging&&!RM) yaw+=dt*.12;

  /* counter + progress + cue */
  const shown=Math.round(camN); $('#count').innerHTML=shown.toLocaleString()+`<small>${shown===1?'agent':'agents'}</small>`;
  $$('#prog a').forEach((a,k)=>a.classList.toggle('on',k===scene));
  $('#cue').classList.toggle('off',y>40);
  $('#ago').textContent=agoText();

  /* typing on scroll in scene 1 */
  const total=C[0].m.reduce((n,[,x])=>n+x.replace(/<[^>]+>/g,'').length,0);
  const typedN=Math.round(ease(P[1]/.72)*total);
  $('#s1b').classList.toggle('on',P[1]>.8);
  const panelA=ss(.55,1.6,s/K)*(1-G)*ss(-.02,.05,RAWP[1]);
  if(openId>=0){ if(lastOpen!==openId){renderConvo(openId,null);lastOpen=openId} convo.style.opacity=1; convo.classList.add('live');
    convo.style.left=(mobile?vw/2:cx)+'px'; convo.style.top=(mobile?cy+vh*.03:cy)+'px'; convo.style.transform=`translate(-50%,-50%) scale(${mobile?.92:1})`; }
  else { lastOpen=-2; if(panelA>.02){ if(lastTyped!==typedN){renderConvo(0,typedN);lastTyped=typedN} const a=convo.querySelector('[data-ago]'); if(a)a.textContent=agoText(); }
    convo.style.opacity=panelA; convo.classList.toggle('live',panelA>.5);
    const px=cx+(C[0].x-camX)*s, py=cy+(C[0].y-camY)*s; const sc=clamp(s/(K*2.6),.3,1)*(mobile?.9:1);
    convo.style.left=px+'px'; convo.style.top=(mobile?py+vh*.05:py)+'px'; convo.style.transform=`translate(-50%,-50%) scale(${sc})`; }

  /* ── field ── */
  const {cols,rows,I,ID,P:PI}=grid; I.fill(0); ID.fill(-1); PI.fill(0);
  const rowH=15, r=clamp(s*.3,3.2,150), wait5=ss(.05,.5,P[5])*(1-ss(0,.4,P[6]));
  const gR=K*(mobile?1.05:.92); const tn=t/1000;
  const vis=Math.min(N_ALL,Math.ceil(camN*1.15));
  for(let i=0;i<vis;i++){
    const c=C[i]; let a=clamp(camN*1.15-i)*(i<10?1:1); if(a<=0) continue;
    /* status animation */
    let st=1;
    if(c.s==='done') st=.38;
    else if(c.s==='waiting') st=RM?.8:.55+.45*Math.max(0,Math.sin(tn*1.3*c.sp+c.ph));
    if(i===0) st=1;
    if(wait5>0&&i>0) a*=1-wait5*.8;
    let sx,sy,dz=1;
    if(G>.001){ const rr=Math.hypot(c.x,c.y)/Math.sqrt(N_ALL), th=Math.atan2(c.y,c.x), phi=rr*2.9;
      let X=Math.sin(phi)*Math.cos(th),Y=Math.sin(phi)*Math.sin(th),Z=Math.cos(phi);
      const cyw=Math.cos(yaw),syw=Math.sin(yaw);let X2=X*cyw+Z*syw,Z2=-X*syw+Z*cyw;const cp=Math.cos(pitch),sp=Math.sin(pitch);const Y2=Y*cp-Z2*sp,Z3=Y*sp+Z2*cp;
      const fx=cx+(c.x-camX)*s, fy=cy+(c.y-camY)*s; sx=lerp(fx,cx+X2*gR,G); sy=lerp(fy,cy+Y2*gR,G); dz=lerp(1,clamp(Z3*2.2+.6,.05,1),G); }
    else { sx=cx+(c.x-camX)*s; sy=cy+(c.y-camY)*s; }
    c.sx=sx;c.sy=sy;c.on=a*dz>.05;
    const rr=lerp(r,3.5,G); const w=a*st*dz*(i===0?(1-panelA*.97):1)*(hover===i?1.25:1);
    /* a paragraph: rows of varying length */
    const hw=rr*1.15, hh=rr*.62;
    const c0=Math.max(0,Math.floor((sx-hw)/cwA)), c1=Math.min(cols-1,Math.ceil((sx+hw)/cwA));
    const r0=Math.max(0,Math.floor((sy-hh)/rowH)), r1=Math.min(rows-1,Math.ceil((sy+hh)/rowH));
    if(c1<c0||r1<r0){ if(rr<5){ const ci=Math.round(sx/cwA), ri=Math.round(sy/rowH); if(ci>=0&&ci<cols&&ri>=0&&ri<rows){const k=ri*cols+ci; if(w>I[k]){I[k]=w;ID[k]=i} } } continue; }
    const nrows=r1-r0+1;
    for(let rw=r0;rw<=r1;rw++){
      const fr=(rw-r0)/Math.max(1,nrows-1), len=rw===r1?.45+hash(i,rw)*.4:.8+hash(i,rw)*.2; /* last line shorter */
      const edge=1-Math.pow(Math.abs(fr-.5)*2,4);
      for(let cl=c0;cl<=c1;cl++){
        const fc=(cl-c0)/Math.max(1,c1-c0); if(fc>len) break;
        let v=w*(.55+.45*edge); if(rr<6) v=w;
        const k=rw*cols+cl; if(v>I[k]){I[k]=v;ID[k]=i}
      }
    }
  }
  /* draw */
  ctx.setTransform(dpr,0,0,dpr,0,0); ctx.fillStyle='#141016'; ctx.fillRect(0,0,vw,vh);
  if(G>0){ ctx.save(); ctx.globalAlpha=G*.08; ctx.fillStyle='#ECE6DB'; ctx.beginPath(); ctx.arc(cx,cy,gR,0,6.3); ctx.fill(); ctx.restore(); }
  /* who hired whom */
  const linkA=(1-G)*ss(.5,1,logN), rx=cx-camX*s, ry=cy-camY*s;
  if(linkA>.01){
    ctx.lineWidth=1;
    for(let i=vis-1;i>=0;i--){ const c=C[i]; if(!c.on) continue; const ca=clamp(camN*1.15-i); if(ca<.05) continue;
      const px2=c.p<0?rx:C[c.p].sx, py2=c.p<0?ry:C[c.p].sy, dx=px2-c.sx, dy=py2-c.sy, L=Math.hypot(dx,dy); if(L<2) continue;
      const cut=Math.min(r*.95,L*.3), ux=dx/L, uy=dy/L;
      let al=linkA*ca*(c.lv===1?.42:c.lv===2?.26:.16); if(wait5>0&&i>0) al*=1-wait5*.8;
      const pk=i===0&&hl0; if(pk) al=Math.min(1,linkA*(.6+.4*wait5));
      ctx.lineWidth=pk?1.75:1; ctx.strokeStyle=pk?`rgba(255,90,54,${al})`:`rgba(236,230,219,${al})`;
      ctx.beginPath(); ctx.moveTo(c.sx+ux*cut,c.sy+uy*cut); ctx.lineTo(px2-ux*(c.p<0?8:cut),py2-uy*(c.p<0?8:cut)); ctx.stroke();
      if(pk&&wait5>.05&&!RM){ const k=(tn*.45)%1, qx=lerp(c.sx+ux*cut,px2-ux*8,k), qy=lerp(c.sy+uy*cut,py2-uy*8,k);
        ctx.fillStyle=`rgba(255,90,54,${wait5*(1-k*.6)})`; ctx.beginPath(); ctx.arc(qx,qy,3,0,6.3); ctx.fill(); }
    }
    /* your agent */
    ctx.fillStyle=`rgba(236,230,219,${linkA})`; ctx.beginPath(); ctx.arc(rx,ry,4.5,0,6.3); ctx.fill();
    ctx.strokeStyle=`rgba(236,230,219,${linkA*.5})`; ctx.beginPath(); ctx.arc(rx,ry,8,0,6.3); ctx.stroke();
    const la=linkA*(1-ss(2.1,2.7,logN)); agentBox=la>.02?[rx-44,ry-34,rx+44,ry-12]:null;
    if(la>.02){ ctx.font=`500 ${mobile?11:13}px ${GROT}`; ctx.fillStyle=`rgba(236,230,219,${la})`; const t1='Your agent'; ctx.fillText(t1,rx-ctx.measureText(t1).width/2,ry-20);
      ctx.font=`${mobile?9:10.5}px ${MONO}`; ctx.fillStyle=`rgba(236,230,219,${la*.6})`; const t2='Sort out Priya’s birthday'; if(!mobile||logN<.5) ctx.fillText(t2,rx-ctx.measureText(t2).width/2,ry+21); }
  }
  ctx.font=`13px ${MONO}`; ctx.textBaseline='middle';
  const scr=RM?0:.12;
  const B=[.28,.5,.82];
  for(let rw=0;rw<rows;rw++){
    const si=['','',''], sp=['','','']; let any=0; const py=rw*rowH+8;
    for(let cl=0;cl<cols;cl++){
      const k=rw*cols+cl, v=I[k];
      if(v<.04){for(let b=0;b<3;b++){si[b]+=' ';sp[b]+=' '}continue}
      const id=ID[k], c=C[id]; let ch;
      const tick=c.s==='working'&&!RM?Math.floor(tn*(1.6*c.sp)+hash(id,9)*9):0;
      const idx=(cl*31+rw*17+tick*7+id*3)%c.src.length; ch=c.src[idx]; if(ch===' ') ch=hash(cl,rw)<.5?'·':' ';
      if(c.s==='working'&&scr>0&&hash(cl+tick,rw+id)<scr) ch='·:+=*'[Math.floor(hash(rw,cl+tick)*5)];
      if(v<.25) ch=hash(cl,rw+1)<v*2.8?ch:'·';
      const b=v<.3?0:v<.62?1:2;
      for(let q=0;q<3;q++){ if(q===b){ if(id===0&&hl0){sp[q]+=ch;si[q]+=' '} else {si[q]+=ch;sp[q]+=' '} } else {si[q]+=' ';sp[q]+=' '} }
      any=1;
    }
    if(!any) continue;
    for(let q=0;q<3;q++){ ctx.fillStyle=`rgba(236,230,219,${B[q]})`; ctx.fillText(si[q],0,py); ctx.fillStyle=`rgba(255,90,54,${Math.min(1,B[q]+.18)})`; ctx.fillText(sp[q],0,py); }
  }
  /* cards at scale ten; marks at hundred; hover */
  const cardA=ss(K*.16,K*.3,s)*(1-ss(K*.75,K*1.2,s))*(1-G), markA=ss(K*.045,K*.09,s)*(1-ss(K*.16,K*.3,s))*(1-G);
  const placed=agentBox&&mobile?[agentBox]:[];
  if(cardA>.02) for(let pass=0;pass<2;pass++) for(let i=0;i<vis;i++){ const c=C[i]; if(c.on) drawCard(c,i,clamp(camN*1.15-i),r,cardA,placed,pass); }
  for(let i=0;i<vis;i++){ const c=C[i]; if(!c.on) continue; const a=clamp(camN*1.15-i);
    if(markA>.02&&c.s==='waiting'){ ctx.font=`11px ${MONO}`; ctx.fillStyle=i===0&&hl0?`rgba(255,90,54,${markA*a})`:`rgba(236,230,219,${markA*a*.7})`; ctx.fillText('?',c.sx+r*1.25,c.sy-r*.7); }
  }
  /* scene 5: ring around the one that waits */
  const ringA=Math.max(wait5,found&&play?1:0);
  if(ringA>.01){ const c=C[0]; ctx.strokeStyle=`rgba(255,90,54,${ringA*(.5+.5*Math.sin(tn*2))})`; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(c.sx,c.sy,10+6*Math.sin(tn*2)+r*.9,0,6.3); ctx.stroke(); }
  /* copy fades */
  inners.forEach((el,k)=>{const raw=RAWP[k];let op=1;if(k>0)op*=ss(-.04,.1,raw);if(k<inners.length-1)op*=1-ss(.9,1.03,raw);el.style.opacity=op;el.style.pointerEvents=op>.4?'auto':'none'});
  cv.style.cursor=G>.5||play?(dragging?'grabbing':(hover>=0?'pointer':'grab')):(hover>=0?'pointer':'default');
  requestAnimationFrame(frame);
}

/* ───────── interaction ───────── */
const tip=$('#tip');
function pick(x,y){ let best=-1,bd=1e9; const rr=Math.max(10,clamp(s*.36,3.2,150)*1.2); const vis=Math.min(N_ALL,Math.ceil(camN*1.15));
  for(let i=0;i<vis;i++){const c=C[i]; if(!c.on) continue; const d=Math.hypot(x-c.sx,y-c.sy); if(d<rr&&d<bd){bd=d;best=i}} return best; }
function onMove(e){
  mouse.x=e.clientX;mouse.y=e.clientY;
  if(dragging){ const dx=e.clientX-lx, dy=e.clientY-ly; lx=e.clientX; ly=e.clientY; if(Math.abs(dx)+Math.abs(dy)>2) dragMoved=true;
    if(G>.5){yaw+=dx*.008;pitch=clamp(pitch+dy*.006,-1.2,1.2)} else {camX-=dx/s;camY-=dy/s} return; }
  const canHover=(play||G>.5||scene>=2)&&openId<0;
  hover=canHover?pick(e.clientX,e.clientY):-1;
  if(hover>=0&&!(scene===1)){ const c=C[hover]; tip.innerHTML=`<b>${c.t}</b><i></i>${c.s} · ${c.last}`; tip.style.opacity=1; tip.style.left=Math.min(vw-270,e.clientX+14)+'px'; tip.style.top=(e.clientY+16)+'px'; } else tip.style.opacity=0;
}
addEventListener('pointermove',onMove,{passive:true});
cv.addEventListener('pointerdown',e=>{ if(play||G>.5){dragging=true;dragMoved=false;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId)} });
cv.addEventListener('pointerup',e=>{ const wasDrag=dragging&&dragMoved; dragging=false; if(wasDrag) return; if(!(play||G>.5||scene>=2)) return;
  const h=pick(e.clientX,e.clientY); if(h>=0){openId=h; tip.style.opacity=0; if(h===0&&play&&!found) foundIt()} else if(openId>=0) openId=-1; });
addEventListener('keydown',e=>{ if(e.key==='Escape') openId=-1; });
function foundIt(){ found=true; const sec=Math.max(1,Math.round((Date.now()-(playT0||Date.now()))/1000));
  const took=sec<90?sec+(sec===1?' second':' seconds'):Math.round(sec/60)+' minutes';
  $('#found').textContent=`Found it. That took you ${took}, and it has been waiting ${agoText()}.`; }
const zoom=$('#zoom'); zoom.oninput=()=>{playZoom=zoom.value/1000*3; $('#zl').textContent=Math.round(Math.pow(10,playZoom)).toLocaleString()};
cv.addEventListener('wheel',e=>{ if(!play||!e.ctrlKey) return; e.preventDefault(); playZoom=clamp(playZoom+e.deltaY*.0012,0,3); zoom.value=playZoom/3*1000; $('#zl').textContent=Math.round(Math.pow(10,playZoom)).toLocaleString(); },{passive:false});
/* progress nav */
$('#prog').innerHTML=scenes.map((sc,k)=>`<a href="#" data-k="${k}" class="${k===5?'pinkdot':''}"><span>${sc.dataset.label}</span><i></i></a>`).join('');
$$('#prog a').forEach(a=>a.onclick=e=>{e.preventDefault();const k=+a.dataset.k;scrollTo({top:tops[k]+(k===0?0:vh*.3),behavior:RM?'auto':'smooth'})});
addEventListener('resize',resize);
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(resize);
/* the one thing that plays on its own */
const TASK='Sort out Priya’s birthday on Saturday.'; const typed=$('#typed');
if(RM){typed.textContent=TASK}else{let i=0;setTimeout(function tick(){typed.textContent=TASK.slice(0,++i);if(i<TASK.length)setTimeout(tick,45+Math.random()*55)},600)}
if(matchMedia('(hover: none)').matches) $('#hint').textContent='Drag to move, tap an agent to open it. Use the slider to zoom.';
resize(); requestAnimationFrame(frame);
})();
