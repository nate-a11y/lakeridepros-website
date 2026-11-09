import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {getFourthwallProducts,getFourthwallProduct,getFourthwallProductImage,getFourthwallStartingPrice,getFourthwallProductSchema} from '../storefront'
const variant={id:'v',name:'Small',sku:'small',unitPrice:{value:25,currency:'USD'},attributes:{description:'Small'},stock:{type:'UNLIMITED'},images:[]}
const product={type:'PRODUCT',id:'p',name:'Product',slug:'product',description:'Plain description',state:{type:'AVAILABLE'},access:{type:'PUBLIC'},images:[],variants:[variant]}
beforeEach(()=>{vi.stubEnv('FOURTHWALL_STOREFRONT_ENABLED','true');vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN','synthetic-token');vi.spyOn(console,'error').mockImplementation(()=>{})})
afterEach(()=>{vi.unstubAllEnvs();vi.restoreAllMocks()})
it('does not fabricate images, prices or offers for unavailable variants',()=>{
 const empty={...product,variants:[]} as never
 expect(getFourthwallProductImage(empty)).toBe('');expect(getFourthwallStartingPrice(empty)).toBeNull();expect(getFourthwallProductSchema(empty)).not.toHaveProperty('offers');expect(getFourthwallProductSchema(empty)).not.toHaveProperty('image')
 expect(getFourthwallProductImage({...product,variants:[{...variant,images:[{url:'/variant.jpg',transformedUrl:'/transformed.jpg'}]}]} as never)).toBe('/transformed.jpg')
})
it('bounds malformed upstream pagination and never returns a silently partial catalog',async()=>{
 const fetcher=vi.spyOn(globalThis,'fetch').mockImplementation(async()=>Response.json({results:[],paging:{hasNextPage:true}}))
 await expect(getFourthwallProducts()).resolves.toEqual([]);expect(fetcher).toHaveBeenCalledTimes(100)
 await expect(getFourthwallProducts({throwOnError:true})).rejects.toThrow('pagination limit');expect(fetcher).toHaveBeenCalledTimes(200)
})
it('rejects malformed images, variants and non-object product responses',async()=>{
 const fetcher=vi.spyOn(globalThis,'fetch').mockImplementation(async()=>Response.json({results:[product,null,{...product,images:[{id:'i',url:'/image.jpg',width:1,height:1,transformedUrl:123}]},{...product,variants:[{...variant,stock:{type:'UNKNOWN'}}]}]}))
 expect(await getFourthwallProducts()).toEqual([product]);fetcher.mockResolvedValueOnce(Response.json(null));expect(await getFourthwallProduct('product')).toBeNull()
})
it('fails closed on absent results, non-Error failures, rejected requests and missing configuration',async()=>{
 const fetcher=vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(Response.json({}))
 await expect(getFourthwallProducts({throwOnError:true})).rejects.toThrow('Invalid catalog')
 fetcher.mockRejectedValueOnce('offline');expect(await getFourthwallProducts()).toEqual([])
 fetcher.mockRejectedValueOnce(new Error('offline'));await expect(getFourthwallProducts({throwOnError:true})).rejects.toThrow('temporarily unavailable')
 fetcher.mockResolvedValueOnce(new Response('',{status:503}));await expect(getFourthwallProducts({throwOnError:true})).rejects.toThrow('rejected')
 vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN','');expect(await getFourthwallProducts()).toEqual([])
})
