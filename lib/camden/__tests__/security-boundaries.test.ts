// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import * as security from '../server/security'
vi.mock('../server/config', () => ({ getCamdenServerConfig: () => ({ otpPepper: 'synthetic-otp-pepper', sessionHashPepper: 'synthetic-session-pepper', turnstileSecret: 'synthetic-turnstile-secret' }) }))
beforeEach(() => vi.stubEnv('NODE_ENV', 'test'))
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); vi.useRealTimers() })
it.each([[null, null], [12, null], ['123', null], ['(573) 206-9499', '+15732069499'], ['1-573-206-9499', '+15732069499'], ['2-573-206-9499', null]])('normalizes US phone %s', (input, output) => { expect(security.normalizeUsPhone(input)).toBe(output) })
it('generates appropriately shaped independent challenges, codes and session tokens', () => {
 expect(security.createChallengeId()).toMatch(/^[\da-f-]{36}$/)
 expect(security.createOtp()).toMatch(/^\d{6}$/)
 const a=security.createSessionToken(), b=security.createSessionToken(); expect(a).toMatch(/^[\w-]{43}$/); expect(a).not.toBe(b)
 expect(security.hashOtp('challenge','123456')).toMatch(/^[\da-f]{64}$/)
 expect(security.hashOtp('other','123456')).not.toBe(security.hashOtp('challenge','123456'))
 expect(security.hashRequestValue('ip')).not.toBe(security.hashOtp('ip',''))
})
it.each([
 ['GET', {}, true], ['HEAD', {}, true], ['POST', {}, false],
 ['POST', {'x-camden-csrf':'1'}, false], ['POST', {'x-camden-csrf':'1','content-type':'text/plain'}, false],
 ['POST', {'x-camden-csrf':'1','content-type':'application/json','sec-fetch-site':'cross-site'}, false],
 ['POST', {'x-camden-csrf':'1','content-type':'application/json','sec-fetch-site':'same-site'}, false],
 ['POST', {'x-camden-csrf':'1','content-type':'Application/JSON; charset=utf8','origin':'https://portal.example','sec-fetch-site':'same-origin'}, true],
 ['POST', {'x-camden-csrf':'1','content-type':'application/json','origin':'invalid'}, false],
 ['POST', {'x-camden-csrf':'1','content-type':'application/json','origin':'https://evil.example'}, false],
 ['POST', {'x-camden-csrf':'1','content-type':'application/json','sec-fetch-site':'none'}, true],
] as const)('enforces CSRF/origin for %s %j', (method, headers, allowed) => { expect(security.isSameOriginMutation(new NextRequest('https://portal.example/api', {method, headers}))).toBe(allowed) })
it('requires an explicit matching production origin and handles invalid configuration', () => {
 const request=(origin?: string) => new NextRequest('https://portal.example/api',{method:'POST',headers:{'x-camden-csrf':'1','content-type':'application/json',...(origin?{origin}:{})}})
 vi.stubEnv('NODE_ENV','production');vi.stubEnv('CAMDEN_ALLOWED_ORIGIN','')
 expect(security.isSameOriginMutation(request())).toBe(false);expect(security.isSameOriginMutation(request('https://portal.example'))).toBe(false)
 vi.stubEnv('CAMDEN_ALLOWED_ORIGIN','https://allowed.example/path')
 expect(security.isSameOriginMutation(request('https://allowed.example'))).toBe(true)
 expect(security.isSameOriginMutation(request('https://portal.example'))).toBe(false)
 vi.stubEnv('NODE_ENV','test');expect(security.isSameOriginMutation(request('https://allowed.example'))).toBe(true)
 vi.stubEnv('CAMDEN_ALLOWED_ORIGIN','bad');expect(security.isSameOriginMutation(request('https://other.example'))).toBe(false)
})
it('prefers the trusted real IP, then the first forwarded address, then an opaque unknown value', () => {
 for(const [headers, ip] of [[{'x-real-ip':'192.0.2.1','x-forwarded-for':'192.0.2.2, 192.0.2.3'},'192.0.2.1'],[{'x-forwarded-for':' 192.0.2.2, 192.0.2.3'},'192.0.2.2'],[{},'unknown']] as const){
 const request=new NextRequest('https://portal.example',{headers});expect(security.clientIp(request)).toBe(ip);expect(security.requestFingerprint(request)).toBe(security.hashRequestValue(ip))
 }
})
it('enforces per-window limits, resets expired counters and evicts expired entries', () => {
 vi.useFakeTimers();vi.setSystemTime(1000)
 expect(security.passLocalRateLimit('window',2,100)).toBe(true);expect(security.passLocalRateLimit('window',2,100)).toBe(true);expect(security.passLocalRateLimit('window',2,100)).toBe(false)
 for(let i=0;i<2002;i++)security.passLocalRateLimit(`expired-${i}`,1,100)
 security.passLocalRateLimit('still-live',1,10000);vi.setSystemTime(1200)
 expect(security.passLocalRateLimit('after-eviction',1,100)).toBe(true)
 expect(security.passLocalRateLimit('window',2,100)).toBe(true);expect(security.passLocalRateLimit('still-live',1,10000)).toBe(false)
})
it('never sends invalid Turnstile tokens and fails closed for provider failures', async () => {
 const fetcher=vi.spyOn(globalThis,'fetch')
 for(const token of [null, 123, 'short', 'a'.repeat(4097)])expect(await security.verifyTurnstile(token,'unknown')).toBe(false)
 expect(fetcher).not.toHaveBeenCalled()
 fetcher.mockResolvedValueOnce(Response.json({success:true}));expect(await security.verifyTurnstile('test-token-long','192.0.2.1')).toBe(true)
 expect(String(fetcher.mock.calls[0][1]?.body)).toContain('remoteip=192.0.2.1')
 fetcher.mockResolvedValueOnce(Response.json({success:false}));expect(await security.verifyTurnstile('test-token-long','unknown')).toBe(false)
 expect(String(fetcher.mock.calls[1][1]?.body)).not.toContain('remoteip')
 fetcher.mockResolvedValueOnce(Response.json({}));expect(await security.verifyTurnstile('test-token-long','unknown')).toBe(false)
 fetcher.mockResolvedValueOnce(new Response('',{status:503}));expect(await security.verifyTurnstile('test-token-long','unknown')).toBe(false)
 fetcher.mockRejectedValueOnce(new Error('offline'));expect(await security.verifyTurnstile('test-token-long','unknown')).toBe(false)
})
