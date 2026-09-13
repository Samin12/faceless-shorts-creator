import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import captions from './captions.json';

export const compositionConfig = {
  id: 'SkinUgc', durationInSeconds: 29, fps: 30, width: 1080, height: 1920,
};
const ink = '#213E36';
const cream = '#F4F0E7';
const asset = (file: string) => staticFile(`projects/skin-ugc/${file}`);
type Word = {word:string; start:number; end:number; segment:number};

function Captions() {
  const t = useCurrentFrame()/30;
  const words = captions as Word[];
  const active = words.find(w=> t>=w.start && t<w.end+.08);
  if (!active) return null;
  const sentence = words.filter(w=>w.segment===active.segment);
  const local = sentence.indexOf(active);
  const first = Math.floor(local/6)*6;
  return <div style={{position:'absolute',bottom:290,left:85,right:85,textAlign:'center',fontSize:47,fontWeight:600,lineHeight:1.35}}>
    <span style={{background:ink,color:cream,padding:'12px 18px',borderRadius:12,boxDecorationBreak:'clone'}}>
      {sentence.slice(first,first+6).map((w,i)=><span key={i} style={{color:first+i===local?'#E5ECA8':cream}}>{w.word}{' '}</span>)}
    </span>
  </div>;
}

export default function SkinUgc() {
  const f = useCurrentFrame();
  const comparison = f>=435 && f<615;
  return <AbsoluteFill style={{background:ink,fontFamily:'Arial, sans-serif'}}>
    {[0,1,2].map(i=><Sequence key={i} from={[0,165,435][i]} durationInFrames={[165,270,435][i]}>
      <OffthreadVideo src={asset(`clip-${i+1}.mp4`)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
    </Sequence>)}
    <AbsoluteFill style={{background:'linear-gradient(#0007,transparent 25%,transparent 66%,#0009)'}}/>
    {comparison && <AbsoluteFill style={{background:ink,color:cream,padding:'400px 55px 350px'}}>
      <div style={{fontSize:30,letterSpacing:4,textAlign:'center'}}>A SIMULATED COMPARISON</div>
      <div style={{fontFamily:'Georgia',fontSize:85,lineHeight:1.12,textAlign:'center',margin:'45px 0 60px'}}>Realistic texture.<br/>No perfect-skin promise.</div>
      <Img src={asset('comparison.png')} style={{width:970,height:'auto',borderRadius:18}}/>
      <div style={{fontSize:34,lineHeight:1.45,textAlign:'center',marginTop:40}}>Not a patient result or evidence<br/>for a finished Samin product.</div>
    </AbsoluteFill>}
    <div style={{position:'absolute',left:70,top:95,right:70,color:cream}}>
      <span style={{background:ink,padding:'12px 18px',borderRadius:9,fontSize:28,letterSpacing:2}}>AI PRESENTER · CONCEPT AD</span>
      <div style={{fontSize:38,fontWeight:700,letterSpacing:2,marginTop:33,textShadow:'0 2px 8px #0008'}}>SAMIN’S AZELAIC ACID</div>
    </div>
    {f<80 && <div style={{position:'absolute',left:85,right:85,top:1110,color:cream,fontSize:100,lineHeight:1.02,fontWeight:700,textShadow:'0 3px 12px #0009'}}>Glass-skin goals?<br/><span style={{color:'#E5ECA8'}}>Know the roles.</span></div>}
    {f>=80 && f<165 && <div style={{position:'absolute',left:85,top:1250,color:ink,background:cream,padding:'20px 28px',borderRadius:18,fontSize:39}}>Azelaic acid → acne + lingering marks</div>}
    {f>=165 && f<435 && <div style={{position:'absolute',left:85,right:85,top:1190,color:ink,fontSize:36,lineHeight:1.4}}>
      <div style={{background:cream,padding:'17px 25px',borderRadius:15,marginBottom:15}}>Tretinoin → prescription pore-clearing</div>
      <div style={{background:cream,padding:'17px 25px',borderRadius:15}}>Cicaplast → moisturizing support</div>
    </div>}
    {f>=615 && <div style={{position:'absolute',left:85,right:85,top:1160,color:ink,background:cream,padding:'25px 30px',borderRadius:18,fontSize:36,lineHeight:1.45}}>Start gradually with your prescriber.<br/>Broad-spectrum SPF 30+.<br/>Avoid tretinoin during pregnancy.</div>}
    <Captions/>
    <div style={{position:'absolute',bottom:145,left:85,right:85,color:cream,fontSize:27,lineHeight:1.35,textShadow:'0 2px 6px #000'}}>Ingredient education · Results vary<br/>Fictional brand · No medical or brand endorsement</div>
  </AbsoluteFill>;
}
