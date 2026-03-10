#!/bin/bash
cd ~/Desktop/luxprotyl || { echo "❌ Wrong directory"; exit 1; }

echo "Step 1: Make sure .env files are in .gitignore..."
# Add all .env variants to .gitignore if not already there
grep -q "^apps/api/.env$" .gitignore 2>/dev/null || echo "apps/api/.env" >> .gitignore
grep -q "^\.env$" .gitignore 2>/dev/null || echo ".env" >> .gitignore
grep -q "^\.env\.local$" .gitignore 2>/dev/null || echo ".env.local" >> .gitignore
grep -q "^\*\*/.env$" .gitignore 2>/dev/null || echo "**/.env" >> .gitignore
grep -q "^\*\*/.env.local$" .gitignore 2>/dev/null || echo "**/.env.local" >> .gitignore
grep -q "^\*\*/.env.production$" .gitignore 2>/dev/null || echo "**/.env.production" >> .gitignore
echo "✅ .gitignore updated"

echo ""
echo "Step 2: Remove .env from git tracking (keep file locally)..."
git rm --cached apps/api/.env 2>/dev/null && echo "✅ apps/api/.env removed from git" || echo "ℹ️  apps/api/.env was not tracked"
git rm --cached apps/web/.env.local 2>/dev/null && echo "✅ apps/web/.env.local removed from git" || echo "ℹ️  apps/web/.env.local was not tracked"

echo ""
echo "Step 3: Rewrite history to remove the secret from commit 2ef7374..."
# Remove the file from ALL commits in history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch apps/api/.env' \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "Step 4: Force push clean history..."
git push origin main --force

echo ""
echo "════════════════════════════════════════════"
echo "✅ DONE. Now do ONE more thing:"
echo ""
echo "  🔴 ROTATE YOUR SUPABASE SERVICE KEY NOW:"
echo "  Supabase → Settings → API Keys → service_role → Regenerate"
echo "  Then update Vercel env var SUPABASE_SERVICE_KEY with the new key"
echo ""
echo "  The old key is now compromised — rotating it invalidates it."
echo "════════════════════════════════════════════"