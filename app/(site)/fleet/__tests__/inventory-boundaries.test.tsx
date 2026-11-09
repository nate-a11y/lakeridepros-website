import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import Page from '../page'
const {vehicles}=vi.hoisted(()=>({vehicles:vi.fn()}))
vi.mock('@/lib/api/sanity',()=>({getVehicles:vehicles,getMediaUrl:(image?:{url?:string})=>image?.url||''}))
it('offers a contact fallback when inventory is empty, missing or unavailable',async()=>{
 for(const data of [{docs:[]},{}]){vehicles.mockResolvedValue(data);const view=render(await Page());expect(screen.getByText(/fleet information is being updated/i)).toBeVisible();view.unmount()}
 vehicles.mockRejectedValue(new Error('offline'));render(await Page());expect(screen.getByText(/fleet information is being updated/i)).toBeVisible()
})
it('keeps everyday and group rides discoverable with sparse media and metadata',async()=>{
 vehicles.mockResolvedValue({docs:[
 {_id:'f',name:'Flex',slug:'flex',capacity:4,featuredImage:{url:'/featured.jpg'},images:[{image:{url:'/flex.jpg'}}],pricingTiers:['flex','unknown'],description:'Flex description'},
 {_id:'e',name:'Elite',slug:{current:'elite'},capacity:7,images:[{image:{url:'/elite.jpg'}}]},
 {_id:'s',name:'SUV',slug:'suv',capacity:6,order:2,images:[{image:{url:'/suv.jpg'},alt:'SUV image'}],pricingTiers:[]},
 {_id:'a',name:'A small ride',slug:'small',capacity:6,order:2,images:[]},
 {_id:'b',name:'Bus',slug:'bus',capacity:20,featuredImage:{},amenities:[],description:''},
 ]})
 render(await Page());expect(screen.getByRole('heading',{name:'Flex'})).toBeVisible();expect(screen.getByRole('heading',{name:'Bus'})).toBeVisible();expect(screen.getByRole('img',{name:'Elite private SUV transportation'})).toBeVisible();expect(screen.getAllByRole('link').find(link=>link.getAttribute('href')==='/fleet/suv')).toHaveAccessibleName()
})
it('supports group-only inventory without inventing a private-SUV hero',async()=>{vehicles.mockResolvedValue({docs:[{_id:'b',name:'Group Bus',slug:'bus',capacity:20,images:[],pricingTiers:['elite']}]});render(await Page());expect(screen.queryByRole('img')).toBeNull();expect(screen.getByRole('heading',{name:'Group Bus'})).toBeVisible()})
