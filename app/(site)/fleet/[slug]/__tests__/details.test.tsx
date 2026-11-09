import { render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import Page,{generateMetadata} from '../page'
const {vehicle,reviews,gallery}=vi.hoisted(()=>({vehicle:vi.fn(),reviews:vi.fn(),gallery:vi.fn()}))
vi.mock('@/lib/api/sanity',()=>({getVehicleBySlug:vehicle,getVehicleRelatedTestimonials:reviews,getMediaUrl:(image?:{url?:string})=>image?.url||''}))
vi.mock('@/components/Gallery',()=>({default:(props:unknown)=>{gallery(props);return null}}))
vi.mock('@/components/FleetBookingCTA',()=>({default:()=>null}))
vi.mock('@/components/fleet-editorial/FleetTestimonials',()=>({default:()=>null}))
const base={_id:'v',slug:'flex',name:'Flex',type:'suv',capacity:4,available:true}
const params=(slug='flex')=>({params:Promise.resolve({slug})})
beforeEach(()=>{vehicle.mockResolvedValue(base);reviews.mockResolvedValue([]);gallery.mockClear()})
it.each([null,{...base,available:false}])('redirects unavailable fleet entries instead of indexing stale vehicles',async record=>{vehicle.mockResolvedValue(record);await expect(Page(params())).rejects.toThrow('NEXT_REDIRECT')})
it('handles missing metadata and provider errors without inventing a vehicle',async()=>{vehicle.mockRejectedValue(new Error('offline'));expect((await generateMetadata(params())).title).toContain('Not Found');await expect(Page(params())).rejects.toThrow('NEXT_REDIRECT')})
it.each(['flex','elite','pink-patrol','other'])('keeps gallery photos, deduplicates assets and retains pricing authority for %s',async slug=>{
 vehicle.mockResolvedValue({...base,slug,featuredImage:{url:'/featured.jpg',asset:{_ref:'featured'}},description:'Comfortable ride',specifications:{make:'Example',model:'SUV',year:2026},pricingTiers:['flex','elite','lrp-black','unknown'],amenities:[{amenity:'WiFi'}],images:[{image:{url:'/duplicate.jpg',asset:{_id:'featured'}}},{image:{url:'/interior.jpg',asset:{_id:'interior'}},alt:'Interior'},{image:{url:'/lrp11.jpg',asset:{_ref:'car'}},alt:'LRP11'},{image:{url:'/no-asset.jpg'}},{image:{}},{}]})
 reviews.mockRejectedValue(new Error('reviews unavailable'))
 render(await Page(params(slug)));expect(screen.getByRole('link',{name:'View current pricing and minimums'})).toHaveAttribute('href','/pricing');expect(screen.getByText('WiFi')).toBeVisible()
 const props=gallery.mock.calls[0][0];expect(props.images).toHaveLength(4);expect(props.images.some((x:{src:string})=>x.src==='/duplicate.jpg')).toBe(false);if(slug==='flex')expect(props.images[0].alt).toBe('LRP11');expect(props.accentVariant).toBe(slug==='pink-patrol'?'pink':'default')
 expect(JSON.stringify(await generateMetadata(params(slug)))).toContain('/featured.jpg')
})
it('supports sparse galleries and fallback Open Graph artwork',async()=>{
 render(await Page(params()));expect(gallery.mock.calls[0][0].images).toEqual([]);expect(JSON.stringify(await generateMetadata(params()))).toContain('/og-image.jpg')
 vehicle.mockResolvedValue({...base,featuredImage:{asset:{}},images:[{image:{url:'/first.jpg'}}]});await Page(params());expect(JSON.stringify(await generateMetadata(params()))).toContain('/first.jpg')
})
