import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import words from './captions.json';

export const compositionConfig = {
  id: 'SkinTrio', durationInSeconds: 53, fps: 30, width: 1080, height: 1920,
};
const ink = '#213E36';
const paper = '#F4F0E7';
const colors = ['#AFC1A0', '#E2AB8B', '#E8DCC7'];
const asset = (name: string) => staticFile(`projects/skin-trio/${name}`);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Skin: React.FC<{after?: boolean}> = ({after = false}) => <svg viewBox="0 0 420 490" width="100%">
  <defs><pattern id={after ? 'pa' : 'pb'} width="23" height="23" patternUnits="userSpaceOnUse"><circle cx="8" cy="9" r="1.4" fill="#8E5741" opacity=".24"/></pattern></defs>
  <rect width="420" height="490" rx="45" fill="#C68F70"/>
  <rect width="420" height="490" rx="45" fill={`url(#${after ? 'pa' : 'pb'})`}/>
  <path d="M190 0 Q155 200 200 270 Q280 310 190 340" fill="none" stroke="#AC7356" strokeWidth="8"/>
  {[[75,110],[310,110],[310,240],[80,320],[320,390],[125,215],[235,410]].map(([x,y],i) => <g key={i} opacity={after ? (i < 3 ? .45 : .12) : .85}>
    <circle cx={x} cy={y} r={i % 2 ? 15 : 22} fill={i % 2 ? '#88513F' : '#B74F49'}/>
    {i % 2 === 0 && <circle cx={x-3} cy={y-4} r="7" fill="#D99B89"/>}
  </g>)}
</svg>;

const Pore: React.FC<{type: number; frame: number}> = ({type, frame}) => {
  const p = interpolate(frame,[0,90],[0,1],clamp);
  return <svg viewBox="0 0 880 610" width="100%">
    <rect x="0" y="200" width="880" height="400" rx="50" fill="#D6AB8E"/>
    <path d="M0 215 H340 Q370 210 370 300 V415 Q440 525 510 415 V300 Q510 210 540 215 H880" fill="none" stroke="#A76F59" strokeWidth="18"/>
    {type !== 2 && <g opacity={1-p*.85}>
      {[0,1,2,3,4].map(i=><circle key={i} cx={410+(i%2)*55} cy={270+i*27} r="27" fill={type===0?'#AE5F53':'#B88255'}/>)}
    </g>}
    {type === 0 && [0,1,2,3].map(i=><circle key={i} cx={160+i*180} cy={100+p*80} r="23" fill={colors[0]}/>)}
    {type === 1 && <path d={`M320 ${125-p*40} L440 ${75-p*40} L560 ${125-p*40}`} fill="none" stroke={ink} strokeWidth="14" strokeLinecap="round"/>}
    {type === 2 && <rect x="15" y="165" width={850*p} height="45" rx="22" fill="#F8F2DC"/>}
    <text x="440" y="570" textAnchor="middle" fontSize="28" fill={ink}>Simplified mechanism illustration</text>
  </svg>;
};

const Stage: React.FC<{index:number; title:string; sub:string}> = ({index,title,sub}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{padding:'285px 85px 320px',background:paper,color:ink}}>
    <div style={{fontSize:29,letterSpacing:7}}>THE ROLE / 0{index+1}</div>
    <h1 style={{fontFamily:'Georgia',fontSize:104,lineHeight:1.02,fontWeight:400,margin:'35px 0 25px',transform:`translateY(${interpolate(f,[0,16],[24,0],clamp)}px)`}}>{title}</h1>
    <div style={{fontSize:38,lineHeight:1.4,maxWidth:840}}>{sub}</div>
    <div style={{marginTop:60,width:780,alignSelf:'center'}}><Pore type={index} frame={f}/></div>
    <div style={{marginTop:42,fontSize:27,letterSpacing:3}}>{['ACNE + LINGERING MARKS','PRESCRIPTION RETINOID','MOISTURIZING SUPPORT'][index]}</div>
  </AbsoluteFill>;
};

const Captions = () => {
  const t = useCurrentFrame()/30;
  const active = words.findIndex(w=>t>=w.start && t<w.end+.08);
  if (active < 0) return null;
  const sentence = words.filter(w=>w.segment === words[active].segment);
  const local = sentence.indexOf(words[active]);
  const start = Math.floor(local/5)*5;
  return <div style={{position:'absolute',bottom:245,left:80,right:80,textAlign:'center',fontSize:40,lineHeight:1.5,fontWeight:500}}>
    <span style={{background:ink,color:paper,padding:'12px 20px',boxDecorationBreak:'clone',borderRadius:12}}>
      {sentence.slice(start,start+5).map((w,i)=><span key={i} style={{color:start+i===local?'#DFE9AB':paper}}>{w.word}{' '}</span>)}
    </span>
  </div>;
};

export default function SkinTrio() {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background:paper,color:ink,fontFamily:'Arial, sans-serif'}}>
    <Audio src={asset('samins-narration.wav')}/>
    <Sequence durationInFrames={190}>
      <AbsoluteFill><Img src={asset('textures.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/><Sequence durationInFrames={150}><OffthreadVideo muted src={asset('motion.mp4')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></Sequence></AbsoluteFill>
      <AbsoluteFill style={{padding:'290px 85px',background:'linear-gradient(#F4F0E7dd,transparent 65%)'}}>
        <div style={{fontSize:29,letterSpacing:6}}>THE GLASS-SKIN ROUTINE</div>
        <h1 style={{fontFamily:'Georgia',fontSize:133,fontWeight:400,lineHeight:1.03,marginTop:30}}>One lead<br/>ingredient.<br/><i>Three roles.</i></h1>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={190} durationInFrames={199}><Stage index={0} title="Azelaic acid" sub="Helps treat acne and the dark marks it leaves behind."/></Sequence>
    <Sequence from={389} durationInFrames={100}><Stage index={1} title="Tretinoin" sub="Helps clear pores and keep acne under control."/></Sequence>
    <Sequence from={489} durationInFrames={196}><Stage index={2} title="Cicaplast Baume B5+" sub="Moisturizes and soothes dry, irritated skin."/></Sequence>
    <Sequence from={685} durationInFrames={282}>
      <AbsoluteFill style={{padding:'300px 85px',background:ink,color:paper}}>
        <div style={{fontSize:29,letterSpacing:6}}>HOW THEY FIT</div>
        <h1 style={{fontFamily:'Georgia',fontSize:116,fontWeight:400,lineHeight:1.04}}>Treatment<br/><i>+ comfort.</i></h1>
        {['Azelaic acid / acne + marks','Tretinoin / pore clearing','Cicaplast / moisturizing'].map((text,i)=><div key={text} style={{padding:'38px 30px',marginTop:20,borderRadius:20,color:ink,background:colors[i],fontSize:37}}>{text}</div>)}
        <p style={{fontSize:33,lineHeight:1.5,marginTop:65}}>Glass skin is a goal, not a guarantee.<br/>No proven three-product cure.</p>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={967} durationInFrames={246}>
      <AbsoluteFill style={{padding:'285px 85px',background:paper}}>
        <div style={{fontSize:29,letterSpacing:5}}>REALISTIC EXPECTATIONS</div>
        <h1 style={{fontFamily:'Georgia',fontSize:107,fontWeight:400,lineHeight:1.04}}>Progress takes<br/><i>time.</i></h1>
        <div style={{display:'flex',gap:28,marginTop:50}}>{[false,true].map(after=><div key={String(after)} style={{width:'50%'}}><div style={{fontSize:30,marginBottom:25}}>{after?'POTENTIAL AFTER':'BEFORE'}</div><Skin after={after}/></div>)}</div>
        <div style={{background:ink,color:paper,borderRadius:12,padding:24,marginTop:30,fontSize:30,textAlign:'center'}}>Illustration · not a patient result</div>
        <p style={{fontSize:34,lineHeight:1.4}}>Weeks to months. Results vary.<br/>Marks may take longer.</p>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={1213}>
      <AbsoluteFill style={{padding:'280px 85px',background:paper}}>
        <Img src={asset('textures.png')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:.1}}/>
        <div style={{position:'relative'}}>
        <div style={{fontSize:29,letterSpacing:5}}>MAKE IT SUSTAINABLE</div>
        <h1 style={{fontFamily:'Georgia',fontSize:106,fontWeight:400,lineHeight:1.05}}>Gentle.<br/>Consistent.<br/><i>Protected.</i></h1>
        {['Start gradually with your prescriber','Moisturize + broad-spectrum SPF 30+','Avoid tretinoin during pregnancy'].map((text,i)=><div key={i} style={{fontSize:37,lineHeight:1.35,borderTop:'2px solid #213E3640',padding:'32px 0'}}>{text}</div>)}
        <div style={{fontSize:38,lineHeight:1.4,marginTop:25,fontWeight:600}}>More irritation ≠ better results.</div>
        </div>
      </AbsoluteFill>
    </Sequence>
    <div style={{position:'absolute',top:110,left:85,fontSize:32,letterSpacing:3,color:f>=685&&f<967?paper:ink}}>SAMIN’S AZELAIC ACID</div>
    <div style={{position:'absolute',top:165,left:85,fontSize:22,letterSpacing:2,color:f>=685&&f<967?paper:ink}}>SKIN NOTES / FICTIONAL BRAND DEMO</div>
    <Captions/>
    <div style={{position:'absolute',bottom:145,left:85,right:85,fontSize:23,lineHeight:1.4,color:f>=685&&f<967?paper:ink}}>General education · Sources: AAD + La Roche-Posay<br/>No brand affiliation · Full references in project notes</div>
    <div style={{position:'absolute',bottom:0,height:9,width:`${f/1590*100}%`,background:'#91A782'}}/>
  </AbsoluteFill>;
}
