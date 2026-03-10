#!/bin/bash
cd ~/Desktop/luxprotyl || { echo "❌ Wrong directory"; exit 1; }

# Plain not-found — zero dependencies
cat > apps/web/src/app/not-found.tsx << 'TSX'
export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#0A1F12', gap:16 }}>
      <div style={{ fontSize:56 }}>🏚️</div>
      <h1 style={{ fontFamily:'serif', fontSize:32, fontWeight:900, color:'#C9943A', margin:0 }}>404</h1>
      <p style={{ fontSize:16, color:'rgba(245,237,216,0.6)', margin:0 }}>Page not found</p>
      <a href="/" style={{ marginTop:8, padding:'10px 24px', borderRadius:10, background:'linear-gradient(135deg,#C9943A,#8A5E18)', color:'white', fontWeight:700, textDecoration:'none', fontSize:14 }}>Go Home</a>
    </div>
  )
}
TSX
echo "✅ not-found.tsx — plain static, no Supabase"

# Ensure layout has force-dynamic and no Supabase at module level
grep -q "force-dynamic" apps/web/src/app/layout.tsx || \
  sed -i '' "1s/^/export const dynamic = 'force-dynamic'\n/" apps/web/src/app/layout.tsx
echo "✅ layout.tsx — force-dynamic confirmed"

echo ""
echo "git add -A && git commit -m 'fix: static not-found page, no supabase deps' && git push"