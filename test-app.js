#!/usr/bin/env node

/**
 * Quick Test Script for Stock App
 * Run: node test-app.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Running Stock App Tests...\n');

// Test 1: Check if .env.local exists
console.log('1️⃣  Checking environment variables...');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    console.log('   ✅ .env.local file found');
    
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const requiredVars = [
        'MONGODB_URL',
        'BETTER_AUTH_SECRET',
        'BETTER_AUTH_URL',
        'FINNHUB_API_KEY',
        'GEMINI_API_KEY',
        'NODEMAILER_EMAIL',
        'NODEMAILER_PASSWORD'
    ];
    
    const missingVars = requiredVars.filter(v => !envContent.includes(v));
    if (missingVars.length > 0) {
        console.log('   ⚠️  Missing variables:', missingVars.join(', '));
    } else {
        console.log('   ✅ All required environment variables present');
    }
} else {
    console.log('   ❌ .env.local file not found - Create it using .env.example');
}

// Test 2: Check critical files
console.log('\n2️⃣  Checking critical files...');
const criticalFiles = [
    'database/mongoose.ts',
    'database/models/watchlist.model.ts',
    'lib/better-auth/auth.ts',
    'lib/inngest/client.ts',
    'lib/inngest/functions.ts',
    'lib/actions/watchlist.action.ts',
    'lib/actions/finnhub.action.ts',
    'components/SearchCommand.tsx',
    'components/WatchlistButton.tsx',
    'components/WatchlistTable.tsx',
    'app/(root)/watchlist/page.tsx',
    'app/api/inngest/route.ts'
];

let allFilesExist = true;
criticalFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

// Test 3: Check package.json scripts
console.log('\n3️⃣  Checking npm scripts...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
const requiredScripts = ['dev', 'build', 'start'];
requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
        console.log(`   ✅ Script "${script}" found`);
    } else {
        console.log(`   ❌ Script "${script}" missing`);
    }
});

// Test 4: Check dependencies
console.log('\n4️⃣  Checking key dependencies...');
const requiredDeps = [
    'next',
    'react',
    'mongoose',
    'better-auth',
    'inngest',
    'nodemailer',
    'sonner'
];

requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
        console.log(`   ✅ ${dep} (v${packageJson.dependencies[dep]})`);
    } else {
        console.log(`   ❌ ${dep} - MISSING`);
    }
});

// Final Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Test Summary');
console.log('='.repeat(50));

if (allFilesExist) {
    console.log('✅ All critical files present');
} else {
    console.log('❌ Some files are missing');
}

console.log('\n📝 Next Steps:');
console.log('   1. Ensure .env.local is configured with valid credentials');
console.log('   2. Run: npm run dev');
console.log('   3. Run (in another terminal): npx inngest-cli@latest dev');
console.log('   4. Visit: http://localhost:3000');
console.log('   5. Follow TESTING_GUIDE.md for complete testing');

console.log('\n✅ Pre-flight check complete!');
