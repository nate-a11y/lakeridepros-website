#!/usr/bin/env node

import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const META_GRAPH_API_VERSION = 'v26.0'
const GOOGLE_POSTS_API = 'https://mybusiness.googleapis.com/v4'
const DEFAULT_MIN_DAYS_BETWEEN_POSTS = 2
const DEFAULT_LOOKBACK_DAYS = 14
const MAX_SUMMARY_LENGTH = 650
const MIN_SUMMARY_LENGTH = 120
const BRAND_RELEVANCE_PATTERN = /\b(lake ride pros|transportation|ride|driver|shuttle|airport|wedding|party bus|charter bus|vehicle|fleet|pickup|transfer)\b/i

const TIME_SENSITIVE_PATTERN = new RegExp(
  String.raw`\b(today|tonight|tomorrow|this\s+(?:weekend|morning|afternoon|evening)|` +
    String.raw`january|february|march|april|june|july|august|september|october|november|december|` +
    String.raw`jan\.?|feb\.?|mar\.?|apr\.?|jun\.?|jul\.?|aug\.?|sep(?:t)?\.?|oct\.?|nov\.?|dec\.?)\b|` +
    String.raw`\bmay\s+\d{1,2}(?:st|nd|rd|th)?\b|\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b`,
  'i',
)

const RISK_PATTERNS = [
  ['promotion or contest', /\b(giveaway|contest|raffle|drawing|winner|win\s+(?:tickets?|passes?|a\s)|enter\s+to\s+win|promo(?:tion)?|discount|coupon|sale)\b/i],
  ['employment post', /\b(hiring|now\s+hiring|apply\s+now|job\s+opening|employment|signing\s+bonus)\b/i],
  ['time-sensitive post', TIME_SENSITIVE_PATTERN],
  ['event or ticket post', /\b(tickets?|concert|festival|showtime|doors\s+open|event\s+starts?|kickoff)\b/i],
  ['availability claim', /\b(last[- ]minute|spots?\s+(?:left|available)|limited\s+availability|book\s+now|selling\s+out|sold\s+out)\b/i],
  ['sensitive personal story', /\b(passed\s+away|funeral|memorial|cancer|terminal|tragedy|fatal|condolences|in\s+memory\s+of)\b/i],
  ['Facebook-only engagement prompt', /\b(tag\s+(?:a|your)|comment\s+(?:below|with)|share\s+this|like\s+and\s+share|follow\s+us)\b/i],
  ['competitor comparison', /\b(uber|lyft|rideshare|surge\s+pric(?:e|ing))\b/i],
]

export function parseEnvFile(contents) {
  const parsed = {}
  for (const line of contents.split(/\r?\n/)) {
    if (!line.trim() || /^\s*#/.test(line)) continue
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match) continue
    let value = match[2]
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    parsed[match[1]] = value
  }
  return parsed
}

export function sanitizeFacebookMessage(message) {
  const cleanedLines = String(message || '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '')
    .replace(/(?:\+?1[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/g, '')
    .replace(/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu, '')
    .split(/\r?\n/)
    .map((line) => line.replace(/(?:^|\s)#[\p{L}\p{N}_-]+/gu, ' ').trim())
    .filter(Boolean)
    .filter((line) => !/^(?:call|text|phone|email|dm)\s*(?:us|now|today)?\s*[:—-]?\s*$/i.test(line))
    .filter((line) => {
      const letters = line.match(/[A-Za-z]/g) || []
      const uppercase = line.match(/[A-Z]/g) || []
      return !(letters.length >= 12 && line.length <= 120 && uppercase.length / letters.length >= 0.8)
    })

  return cleanedLines
    .join(' ')
    .replace(/\s+([,.;!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function truncateSummary(text, maxLength = MAX_SUMMARY_LENGTH) {
  if (text.length <= maxLength) return text
  const candidate = text.slice(0, maxLength - 1)
  const sentenceEnd = Math.max(candidate.lastIndexOf('. '), candidate.lastIndexOf('! '), candidate.lastIndexOf('? '))
  if (sentenceEnd >= Math.floor(maxLength * 0.55)) return candidate.slice(0, sentenceEnd + 1).trim()
  const wordEnd = candidate.lastIndexOf(' ')
  return `${candidate.slice(0, wordEnd > 0 ? wordEnd : candidate.length).trim()}…`
}

export function classifyFacebookPost(post, options = {}) {
  const now = options.now || new Date()
  const lookbackDays = options.lookbackDays ?? DEFAULT_LOOKBACK_DAYS
  const createdAt = new Date(post.created_time)
  if (Number.isNaN(createdAt.getTime())) return { eligible: false, reason: 'invalid creation date' }

  const ageMs = now.getTime() - createdAt.getTime()
  if (ageMs < 0 || ageMs > lookbackDays * 86_400_000) return { eligible: false, reason: 'outside freshness window' }
  if (!post.full_picture || !String(post.full_picture).startsWith('https://')) {
    return { eligible: false, reason: 'missing public photo' }
  }

  const rawMessage = String(post.message || '')
  for (const [reason, pattern] of RISK_PATTERNS) {
    if (pattern.test(rawMessage)) return { eligible: false, reason }
  }
  if (!BRAND_RELEVANCE_PATTERN.test(rawMessage)) return { eligible: false, reason: 'not relevant to transportation' }

  const summary = truncateSummary(sanitizeFacebookMessage(rawMessage))
  if (summary.length < MIN_SUMMARY_LENGTH) return { eligible: false, reason: 'not enough reusable text' }
  return { eligible: true, summary, pillar: inferContentPillar(rawMessage) }
}

export function selectFacebookCandidate(posts, options = {}) {
  const processedIds = new Set(options.processedIds || [])
  const excludedPillars = new Set(options.excludedPillars || [])
  const sorted = [...posts].sort((a, b) => new Date(b.created_time) - new Date(a.created_time))
  const skipped = []

  for (const post of sorted) {
    if (!post?.id || processedIds.has(post.id)) continue
    const result = classifyFacebookPost(post, options)
    if (result.eligible && excludedPillars.has(result.pillar)) {
      skipped.push({ id: post.id, reason: 'recently used content pillar' })
      continue
    }
    if (result.eligible) return { post, summary: result.summary, pillar: result.pillar, skipped }
    skipped.push({ id: post.id, reason: result.reason })
  }
  return { post: null, summary: null, skipped }
}

export function chooseLandingPath(message) {
  const text = String(message || '').toLowerCase()
  if (/\b(airport|flight|aviation)\b/.test(text)) return '/lake-ozarks-airport-transportation'
  if (/\b(vehicle|fleet|bus|sprinter|suburban|suv)\b/.test(text)) return '/fleet'
  if (/\b(partner|restaurant|resort|hotel|venue|marina)\b/.test(text)) return '/local-premier-partners'
  if (/\b(school|football|sponsor|community)\b/.test(text)) return '/about-us'
  return '/services'
}

export function inferContentPillar(message) {
  const text = String(message || '').toLowerCase()
  if (/\b(airport|flight|aviation)\b/.test(text)) return 'airport'
  if (/\b(wedding|bride|groom|ceremony|reception)\b/.test(text)) return 'wedding'
  if (/\b(vehicle|fleet|bus|sprinter|suburban|suv)\b/.test(text)) return 'fleet'
  if (/\b(school|football|sponsor|community)\b/.test(text)) return 'community'
  if (/\b(partner|restaurant|resort|hotel|venue|marina)\b/.test(text)) return 'partner'
  if (/\b(customer|guest|review|testimonial)\b/.test(text)) return 'customer-story'
  return 'transportation'
}

export function buildTrackedUrl(message, facebookPostId) {
  const url = new URL(chooseLandingPath(message), 'https://www.lakeridepros.com')
  url.searchParams.set('utm_source', 'google')
  url.searchParams.set('utm_medium', 'organic')
  url.searchParams.set('utm_campaign', 'gbp_facebook_repurpose')
  url.searchParams.set('utm_content', `facebook_${facebookPostId.replace(/[^A-Za-z0-9_-]/g, '_')}`)
  return url.toString()
}

export function fingerprint(text) {
  return crypto.createHash('sha256').update(String(text).toLowerCase().replace(/\W+/g, ' ').trim()).digest('hex')
}

function notifyUser(message) {
  const script = `display notification ${JSON.stringify(message)} with title "Lake Ride Pros GBP Sync"`
  spawnSync('/usr/bin/osascript', ['-e', script], { stdio: 'ignore', timeout: 5_000 })
}

function loadEnvironment(repoRoot) {
  const envPath = path.join(repoRoot, '.env.local')
  if (!fs.existsSync(envPath)) throw new Error(`Missing ${envPath}`)
  const parsed = parseEnvFile(fs.readFileSync(envPath, 'utf8'))
  for (const [key, value] of Object.entries(parsed)) {
    if (!process.env[key]) process.env[key] = value
  }
}

function requiredEnvironment() {
  const keys = [
    'FACEBOOK_PAGE_ID',
    'META_PAGE_ACCESS_TOKEN',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REFRESH_TOKEN',
    'GOOGLE_BUSINESS_LOCATION_ID',
  ]
  for (const key of keys) if (!process.env[key]) throw new Error(`Missing ${key}`)
}

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000), ...options })
  const text = await response.text()
  let body = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }
  if (!response.ok) {
    const detail = typeof body === 'string' ? body.slice(0, 300) : body?.error?.message || JSON.stringify(body)
    throw new Error(`${response.status} ${response.statusText}: ${detail}`)
  }
  return body
}

async function getGoogleAccessToken() {
  const body = await jsonFetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  return body.access_token
}

async function getFacebookPosts() {
  const url = new URL(`https://graph.facebook.com/${META_GRAPH_API_VERSION}/${process.env.FACEBOOK_PAGE_ID}/published_posts`)
  url.searchParams.set('fields', 'id,message,created_time,permalink_url,full_picture,is_published')
  url.searchParams.set('limit', '100')
  const body = await jsonFetch(url, { headers: { authorization: `Bearer ${process.env.META_PAGE_ACCESS_TOKEN}` } })
  return body.data || []
}

async function getGooglePosts(accessToken) {
  const url = `${GOOGLE_POSTS_API}/${process.env.GOOGLE_BUSINESS_LOCATION_ID}/localPosts?pageSize=100`
  const body = await jsonFetch(url, { headers: { authorization: `Bearer ${accessToken}` } })
  return body.localPosts || []
}

function readState(stateFile) {
  if (!fs.existsSync(stateFile)) return { version: 1, processedFacebookPostIds: [], history: [] }
  try {
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
    return {
      version: 1,
      processedFacebookPostIds: Array.isArray(state.processedFacebookPostIds) ? state.processedFacebookPostIds : [],
      history: Array.isArray(state.history) ? state.history : [],
    }
  } catch {
    throw new Error(`Invalid state file: ${stateFile}`)
  }
}

function writeState(stateFile, state) {
  fs.mkdirSync(path.dirname(stateFile), { recursive: true, mode: 0o700 })
  const temporary = `${stateFile}.${process.pid}.tmp`
  fs.writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 })
  fs.renameSync(temporary, stateFile)
}

function latestPublishedTime(googlePosts, state) {
  const dates = [
    ...googlePosts.filter((post) => post.state === 'LIVE').map((post) => post.createTime),
    ...state.history.map((entry) => entry.publishedAt),
  ]
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
  return dates.length ? new Date(Math.max(...dates.map((date) => date.getTime()))) : null
}

function hasGoogleDuplicate(googlePosts, facebookPostId, summary) {
  const marker = `utm_content=facebook_${facebookPostId.replace(/[^A-Za-z0-9_-]/g, '_')}`
  const targetFingerprint = fingerprint(summary)
  return googlePosts.some(
    (post) => post.callToAction?.url?.includes(marker) || (post.summary && fingerprint(post.summary) === targetFingerprint),
  )
}

function parseArguments(argv) {
  const publish = argv.includes('--publish')
  const dryRun = argv.includes('--dry-run')
  if (publish === dryRun) throw new Error('Choose exactly one mode: --dry-run or --publish')
  const unknown = argv.filter((argument) => !['--publish', '--dry-run'].includes(argument))
  if (unknown.length) throw new Error(`Unknown argument: ${unknown.join(', ')}`)
  return { publish }
}

export async function run(options = {}) {
  const now = options.now || new Date()
  const repoRoot = options.repoRoot || path.resolve(import.meta.dirname, '..')
  const stateDir = options.stateDir || path.join(os.homedir(), 'Library', 'Application Support', 'LakeRidePros', 'facebook-to-gbp')
  const stateFile = path.join(stateDir, 'state.json')
  const lockDir = path.join(stateDir, 'run.lock')
  const publish = Boolean(options.publish)
  const minDaysBetweenPosts = Number(process.env.GBP_SYNC_MIN_DAYS || DEFAULT_MIN_DAYS_BETWEEN_POSTS)
  const lookbackDays = Number(process.env.GBP_SYNC_LOOKBACK_DAYS || DEFAULT_LOOKBACK_DAYS)

  fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 })
  try {
    fs.mkdirSync(lockDir)
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
    const lockAgeMs = now.getTime() - fs.statSync(lockDir).mtimeMs
    if (lockAgeMs <= 3_600_000) {
      console.log('Another Facebook-to-GBP sync is already running; exiting.')
      return { status: 'locked' }
    }
    fs.rmSync(lockDir, { recursive: true, force: true })
    fs.mkdirSync(lockDir)
    console.log('Removed a stale sync lock from an interrupted run.')
  }

  try {
    loadEnvironment(repoRoot)
    requiredEnvironment()
    console.log(`[${now.toISOString()}] Checking Facebook for a safe Google Business Profile candidate.`)
    const state = readState(stateFile)
    const [facebookPosts, googleAccessToken] = await Promise.all([getFacebookPosts(), getGoogleAccessToken()])
    const googlePosts = await getGooglePosts(googleAccessToken)
    const recentlyUsedPillars = state.history
      .filter((entry) => {
        const publishedAt = new Date(entry.publishedAt)
        return entry.pillar && !Number.isNaN(publishedAt.getTime()) && now.getTime() - publishedAt.getTime() < 14 * 86_400_000
      })
      .map((entry) => entry.pillar)
    const candidate = selectFacebookCandidate(facebookPosts, {
      now,
      lookbackDays,
      processedIds: state.processedFacebookPostIds,
      excludedPillars: recentlyUsedPillars,
    })

    if (!candidate.post) {
      console.log(`No safe Facebook post found in the last ${lookbackDays} days (${candidate.skipped.length} reviewed).`)
      return { status: 'no-candidate', skipped: candidate.skipped }
    }

    if (hasGoogleDuplicate(googlePosts, candidate.post.id, candidate.summary)) {
      state.processedFacebookPostIds = [...new Set([...state.processedFacebookPostIds, candidate.post.id])].slice(-500)
      writeState(stateFile, state)
      console.log('The newest eligible Facebook post is already present on Google; recorded as processed.')
      return { status: 'duplicate' }
    }

    const latest = latestPublishedTime(googlePosts, state)
    const elapsedDays = latest ? (now.getTime() - latest.getTime()) / 86_400_000 : Number.POSITIVE_INFINITY
    if (publish && elapsedDays < minDaysBetweenPosts) {
      console.log(
        `Eligible Facebook post found, but the ${minDaysBetweenPosts}-day cooldown is active (${elapsedDays.toFixed(1)} days elapsed).`,
      )
      return { status: 'cooldown', facebookPostId: candidate.post.id }
    }

    const trackedUrl = buildTrackedUrl(candidate.post.message, candidate.post.id)
    const postPayload = {
      languageCode: 'en-US',
      summary: candidate.summary,
      callToAction: { actionType: 'LEARN_MORE', url: trackedUrl },
      media: [{ mediaFormat: 'PHOTO', sourceUrl: candidate.post.full_picture }],
      topicType: 'STANDARD',
    }

    if (!publish) {
      console.log(JSON.stringify({
        mode: 'dry-run',
        facebookPostId: candidate.post.id,
        pillar: candidate.pillar,
        facebookCreatedTime: candidate.post.created_time,
        summary: candidate.summary,
        destination: trackedUrl,
        skippedBeforeCandidate: candidate.skipped.length,
        cooldown: {
          minimumDays: minDaysBetweenPosts,
          elapsedDays: Number.isFinite(elapsedDays) ? Number(elapsedDays.toFixed(1)) : null,
          active: elapsedDays < minDaysBetweenPosts,
        },
      }, null, 2))
      return { status: 'dry-run', payload: postPayload }
    }

    const created = await jsonFetch(
      `${GOOGLE_POSTS_API}/${process.env.GOOGLE_BUSINESS_LOCATION_ID}/localPosts`,
      {
        method: 'POST',
        headers: { authorization: `Bearer ${googleAccessToken}`, 'content-type': 'application/json' },
        body: JSON.stringify(postPayload),
      },
    )

    const publishedAt = created.createTime || now.toISOString()
    state.processedFacebookPostIds = [...new Set([...state.processedFacebookPostIds, candidate.post.id])].slice(-500)
    state.history = [
      ...state.history,
      {
        facebookPostId: candidate.post.id,
        facebookPermalink: candidate.post.permalink_url || null,
        pillar: candidate.pillar,
        publishedAt,
        googleState: created.state || null,
        googleSearchUrl: created.searchUrl || null,
        summaryFingerprint: fingerprint(candidate.summary),
      },
    ].slice(-100)
    writeState(stateFile, state)
    console.log(`Published Facebook post ${candidate.post.id} to Google (${created.state || 'submitted'}).`)
    if (created.searchUrl) console.log(`Google post: ${created.searchUrl}`)
    notifyUser('A Facebook post was published to Google Business Profile.')
    return { status: 'published', created }
  } finally {
    fs.rmSync(lockDir, { recursive: true, force: true })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { publish } = parseArguments(process.argv.slice(2))
    await run({ publish })
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Facebook-to-GBP sync failed: ${error.message}`)
    notifyUser('The scheduled sync failed. Check the local launchd error log.')
    process.exitCode = 1
  }
}
