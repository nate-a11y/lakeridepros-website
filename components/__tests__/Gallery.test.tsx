import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import Gallery from '../Gallery'
const { api, embla }=vi.hoisted(()=>{const api={on:vi.fn(),off:vi.fn(),scrollTo:vi.fn(),scrollPrev:vi.fn(),scrollNext:vi.fn(),selectedScrollSnap:vi.fn()};return {api,embla:vi.fn(()=>[()=>{},api])}})
vi.mock('embla-carousel-react',()=>({default:embla}))
vi.mock('focus-trap-react',()=>({default:({children}:{children:React.ReactNode})=>children}))
const images=[{src:'/one.jpg',alt:'First vehicle'},{src:'/two.jpg',alt:'Second vehicle'}]
beforeEach(()=>{vi.clearAllMocks();api.selectedScrollSnap.mockReturnValue(0);embla.mockReturnValue([()=>{},api])})
it('renders nothing for an empty gallery and a single non-expandable image without arrows',()=>{
 const {container,rerender}=render(<Gallery images={[]}/>);expect(container).toBeEmptyDOMElement()
 rerender(<Gallery images={images.slice(0,1)} showLightbox={false}/>);expect(screen.getByRole('region',{name:'Image gallery'})).toBeVisible();expect(screen.queryByRole('button')).toBeNull()
})
it.each(['default','pink'] as const)('preserves carousel selection, fullscreen keyboard controls and scroll cleanup (%s)',accentVariant=>{
 const {unmount}=render(<Gallery images={images} title="Fleet" accentVariant={accentVariant}/>)
 fireEvent.click(screen.getByRole('button',{name:'Next image'}));expect(api.scrollNext).toHaveBeenCalled()
 fireEvent.click(screen.getByRole('button',{name:'Previous image'}));expect(api.scrollPrev).toHaveBeenCalled()
 fireEvent.click(screen.getByRole('button',{name:'View image 2'}));expect(api.scrollTo).toHaveBeenCalledWith(1)
 act(()=>{api.selectedScrollSnap.mockReturnValue(1);for(const [event,callback]of api.on.mock.calls)if(event==='select')callback()})
 expect(screen.getByRole('button',{name:'View image 2'})).toHaveAttribute('aria-current','true')
 fireEvent.click(screen.getByRole('button',{name:'View fullscreen'}))
 const dialog=screen.getByRole('dialog',{name:'Fleet fullscreen gallery'});expect(document.body.style.overflow).toBe('hidden')
 fireEvent.click(within(dialog).getByRole('button',{name:'Previous image'}));fireEvent.click(within(dialog).getByRole('button',{name:'Next image'}));fireEvent.click(within(dialog).getByRole('button',{name:'View image 1'}))
 fireEvent.keyDown(window,{key:'ArrowLeft'});fireEvent.keyDown(window,{key:'ArrowRight'});fireEvent.keyDown(window,{key:'Other'})
 act(()=>{for(const [event,callback]of api.on.mock.calls)if(event==='select')callback()})
 fireEvent.keyDown(window,{key:'Escape'});expect(screen.queryByRole('dialog')).toBeNull();expect(document.body.style.overflow).toBe('')
 fireEvent.click(screen.getByRole('button',{name:'View fullscreen'}));fireEvent.click(screen.getByRole('button',{name:'Close fullscreen view'}));expect(screen.queryByRole('dialog')).toBeNull()
 unmount();expect(api.off).toHaveBeenCalled()
})
it.each(['default','pink'] as const)('opens grid thumbnails with the correct fullscreen image (%s)',accentVariant=>{
 render(<Gallery images={images} mode="grid" accentVariant={accentVariant}/>)
 fireEvent.click(screen.getByRole('button',{name:'View Second vehicle in fullscreen'}));expect(screen.getByRole('dialog',{name:'Fullscreen gallery'})).toBeVisible()
 fireEvent.click(screen.getByRole('button',{name:'Close fullscreen view'}))
})
it('keeps grid tiles inert when lightbox is disabled, including when carousel APIs are absent',()=>{
 embla.mockReturnValue([()=>{},undefined] as never)
 const {rerender}=render(<Gallery images={images} mode="grid" showLightbox={false}/>);fireEvent.click(screen.getByRole('button',{name:'View First vehicle in fullscreen'}));expect(screen.queryByRole('dialog')).toBeNull()
 rerender(<Gallery images={images}/>);fireEvent.click(screen.getByRole('button',{name:'View fullscreen'}));fireEvent.keyDown(window,{key:'ArrowLeft'});fireEvent.keyDown(window,{key:'ArrowRight'});expect(screen.getByRole('dialog')).toBeVisible()
})
