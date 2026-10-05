import Script from "next/script";
export const metadata={title:"FreedomVPN — Private Internet",description:"A simple WireGuard-powered VPN service."};
export default function RootLayout({children}){
 const client=process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
 return <html lang="en"><body style={{margin:0,fontFamily:"system-ui,sans-serif",background:"#07111f",color:"#f5f7fb"}}>
 {client&&<Script async strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`} crossOrigin="anonymous"/>}
 {children}</body></html>
}