/**
 * Resend Email Configuration Test
 *
 * This script helps diagnose Resend email configuration issues.
 * Run with: node test-resend.js
 */

require('dotenv').config()
const { Resend } = require('resend')

console.log('=== Resend Configuration Test ===\n')

// Check 1: Environment Variable
console.log('1. Checking RESEND_API_KEY...')
const apiKey = process.env.RESEND_API_KEY
if (!apiKey) {
  console.error('   ❌ RESEND_API_KEY is not set')
  console.log('   💡 Set it in your .env file or environment variables')
  process.exit(1)
} else if (apiKey.startsWith('re_')) {
  console.log('   ✅ RESEND_API_KEY is set')
  console.log(`   🔑 Key starts with: ${apiKey.substring(0, 10)}...`)
} else {
  console.error('   ⚠️  API key format looks incorrect (should start with "re_")')
}

// Check 2: Initialize Resend
console.log('\n2. Initializing Resend client...')
let resend
try {
  resend = new Resend(apiKey)
  console.log('   ✅ Resend client initialized')
} catch (error) {
  console.error('   ❌ Failed to initialize Resend:', error.message)
  process.exit(1)
}

// Check 3: Test Email Send
console.log('\n3. Attempting to send test email...')
console.log('   📧 From: Lake Ride Pros <hello@updates.lakeridepros.com>')
console.log('   📧 To: (using your test email)')

async function testSend() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Lake Ride Pros <hello@updates.lakeridepros.com>',
      to: 'test@example.com', // Replace with your email
      subject: 'Resend Test Email',
      html: '<p>This is a test email from Lake Ride Pros Resend setup.</p>',
    })

    if (error) {
      console.error('   ❌ Email send failed:', error)

      // Common error scenarios
      if (error.message?.includes('domain')) {
        console.log('\n   💡 SOLUTION: Verify your domain in Resend dashboard')
        console.log('      OR use Resend sandbox: onboarding@resend.dev')
        console.log('      Dashboard: https://resend.com/domains')
      }
      if (error.message?.includes('API key')) {
        console.log('\n   💡 SOLUTION: Check your API key is correct')
        console.log('      Dashboard: https://resend.com/api-keys')
      }
    } else {
      console.log('   ✅ Email sent successfully!')
      console.log('   📬 Email ID:', data.id)
      console.log('\n   💡 Check your Resend dashboard: https://resend.com/emails')
    }
  } catch (error) {
    console.error('   ❌ Unexpected error:', error.message)
  }
}

testSend()

console.log('\n=== Configuration Checklist ===')
console.log('□ RESEND_API_KEY set in .env file')
console.log('□ Domain verified in Resend dashboard (https://resend.com/domains)')
console.log('□ Check Resend email logs (https://resend.com/emails)')
console.log('□ For testing, consider using: onboarding@resend.dev')
console.log('')
