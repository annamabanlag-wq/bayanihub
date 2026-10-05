const client=process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const slot=process.env.NEXT_PUBLIC_ADSENSE_SLOT;
function AdSlot(){if(!client||!slot)return <div style={{padding:20,border:"1px dashed #48617c",borderRadius:12,color:"#9db0c6",textAlign:"center"}}>AdSense slot — configure publisher ID after approval</div>;
return <ins className="adsbygoogle" style={{display:"block"}} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"/>;}
export default function Home(){return <main style={{maxWidth:1050,margin:"0 auto",padding:"70px 24px"}}>
<div style={{display:"inline-block",padding:"7px 12px",borderRadius:999,background:"#12304d",color:"#8ed1ff",fontSize:13}}>WIREGUARD VPN</div>
<h1 style={{fontSize:"clamp(42px,7vw,76px)",lineHeight:1.02,margin:"22px 0 16px"}}>Private internet.<br/>Simple pricing.</h1>
<p style={{fontSize:20,lineHeight:1.6,color:"#b9c8d8",maxWidth:700}}>FreedomVPN is designed around WireGuard for fast, modern encrypted connections.</p>
<div style={{display:"flex",gap:14,flexWrap:"wrap",margin:"30px 0"}}><a href="#download" style={{padding:"14px 20px",borderRadius:12,background:"#4da3ff",color:"#04101d",fontWeight:700,textDecoration:"none"}}>Get VPN access</a><a href="#how" style={{padding:"14px 20px",borderRadius:12,border:"1px solid #48617c",color:"#fff",textDecoration:"none"}}>How it works</a></div>
<section style={{margin:"45px 0",padding:22,background:"#0c1b2b",borderRadius:16}}><AdSlot/></section>
<section id="how" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>{[["01","Install","Use the WireGuard client."],["02","Connect","Import your personal configuration."],["03","Browse","Send traffic through the encrypted tunnel."]].map(([n,t,d])=><article key={n} style={{padding:22,background:"#0c1b2b",borderRadius:16}}><div style={{color:"#71baff",fontWeight:800}}>{n}</div><h2>{t}</h2><p style={{color:"#aebfd0",lineHeight:1.55}}>{d}</p></article>)}</section>
<section id="download" style={{marginTop:45,padding:24,border:"1px solid #233b55",borderRadius:16}}><h2>Free plan</h2><p style={{color:"#b9c8d8"}}>Start with one WireGuard location and add paid locations later.</p><p style={{fontSize:13,color:"#7f94aa"}}>Ads appear only on the website and are never injected into VPN traffic.</p></section>
</main>}