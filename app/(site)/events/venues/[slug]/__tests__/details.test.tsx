import { render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import Page, { generateMetadata } from '../page'
const { venue, events }=vi.hoisted(()=>({venue:vi.fn(),events:vi.fn()}))
vi.mock('@/lib/api/sanity',()=>({getVenueBySlug:venue,getUpcomingEvents:events,getMediaUrl:(image:{url:string})=>image.url}))
const params={params:Promise.resolve({slug:'test-venue'})}
const base={_id:'venue-1',name:'Test Venue',slug:'test-venue'}
beforeEach(()=>{venue.mockResolvedValue(base);events.mockResolvedValue([])})
it('returns missing-venue metadata and redirects stale venue URLs',async()=>{
 venue.mockResolvedValue(null);expect((await generateMetadata(params)).title).toContain('Not Found');await expect(Page(params)).rejects.toThrow('NEXT_REDIRECT')
})
it('preserves the empty calendar, fallback artwork, and booking destination',async()=>{
 const meta=await generateMetadata(params);expect(meta.alternates?.canonical).toContain('/test-venue');expect(JSON.stringify(meta.openGraph)).toContain('/og-image.jpg')
 render(await Page(params));expect(screen.getByText(/No upcoming events scheduled/)).toBeVisible();expect(screen.getAllByRole('link',{name:/Book|Quote/i}).length).toBeGreaterThan(0)
})
it.each([true,false])('renders public venue content, scoped events and accessible photo fallbacks (alt=%s)',async alt=>{
 venue.mockResolvedValue({...base,shortName:'Venue',address:'1 Example St',description:'Venue overview',phone:'5735550100',website:'example.com',image:{url:'/og-image.jpg',...(alt?{alt:'Main venue'}:{})},gallery:[{id:'a',image:{url:'/og-image.jpg',alt:'Photo alt'},caption:'Photo caption'},{image:{url:'/og-image.jpg',alt:'Photo alt'}},{image:{url:'/og-image.jpg'}},{image:'not-an-image'}],additionalInfo:[{_type:'block',_key:'details',style:'h1',children:[{_type:'span',text:'Details heading',marks:[]}]}]})
 events.mockResolvedValue([{_id:'e1',slug:'concert',name:'Venue Concert',venue:{_id:'venue-1'},date:'2099-06-01T19:00:00Z',time:'7 PM',rideAvailability:[{rideType:'flex',status:'available',notes:'Seats available'}]},{_id:'e2',slug:'other-date',name:'Another Concert',venue:'venue-1',date:'2099-06-02',rideAvailability:[]},{_id:'e3',slug:'unrelated',name:'Unrelated Concert',venue:{_id:'venue-2'},date:'2099-06-03'},{_id:'e4',name:'Unassigned',venue:null,date:'2099-06-04'}])
 const meta=await generateMetadata(params);expect(JSON.stringify(meta.openGraph)).toContain('/og-image.jpg')
 const {container}=render(await Page(params));expect(container.querySelectorAll('h1')).toHaveLength(1);expect(screen.getByRole('heading',{name:'Details heading',level:2})).toBeVisible();expect(screen.getByRole('link',{name:'Venue Concert'})).toHaveAttribute('href','/events/concert');expect(screen.queryByText('Unrelated Concert')).toBeNull();expect(screen.getByRole('link',{name:'Visit Website'})).toHaveAttribute('href','https://example.com/');expect(screen.getByText('Photo caption')).toBeVisible()
})
