import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import HeaderClient from '../HeaderClient'
const {cart}=vi.hoisted(()=>({cart:vi.fn(()=>0) as ReturnType<typeof vi.fn>&{persist?:{rehydrate:ReturnType<typeof vi.fn>}}}))
vi.mock('@/lib/store/cart',()=>({useCart:cart}))
vi.mock('@/lib/analytics',()=>({trackServiceEvent:vi.fn().mockResolvedValue(undefined)}))
const services=[{name:'Z service',slug:'z'},{name:'Airport',slug:'airport-transfers'},{name:'A service',slug:'a'},{name:'Wedding',slug:'wedding-transportation'}]
beforeEach(()=>{cart.mockReturnValue(0);cart.persist=undefined})
it.each([{popularServiceSlugs:[]},{popularServiceSlugs:['wedding-transportation','airport-transfers']}])('retains service ordering and mobile disclosure/escape behavior with priority %j',async ({popularServiceSlugs})=>{
 const {container}=render(<HeaderClient services={services} popularServiceSlugs={popularServiceSlugs}/>);const trigger=screen.getByRole('button',{name:'Services'})
 fireEvent.mouseEnter(trigger.parentElement!);expect(trigger).toHaveAttribute('aria-expanded','true');const links=within(trigger.parentElement!).getAllByRole('link');expect(links.some(x=>x.textContent==='Airport')).toBe(true)
 fireEvent.keyDown(trigger,{key:'Other'});fireEvent.mouseLeave(trigger.parentElement!);expect(trigger).toHaveAttribute('aria-expanded','false')
 fireEvent.click(trigger);fireEvent.click(trigger);expect(trigger).toHaveAttribute('aria-expanded','false');fireEvent.keyDown(trigger,{key:'Escape'})
 fireEvent.click(screen.getByRole('button',{name:'Open menu'}));let mobile=within(container.querySelector('#mobile-menu') as HTMLElement)
 for(const name of ['Services','Partners','Explore']){const group=mobile.getByRole('button',{name});fireEvent.click(group);expect(group).toHaveAttribute('aria-expanded','true');fireEvent.click(group);expect(group).toHaveAttribute('aria-expanded','false')}
 fireEvent.keyDown(document,{key:'Other'});fireEvent.keyDown(document,{key:'Escape'});expect(screen.getByRole('button',{name:'Open menu'})).toHaveFocus();expect(container.querySelector('#mobile-menu')).toBeNull()
 fireEvent.click(screen.getByRole('button',{name:'Open menu'}));mobile=within(container.querySelector('#mobile-menu') as HTMLElement);fireEvent.click(mobile.getByRole('button',{name:'Services'}));fireEvent.click(mobile.getByRole('link',{name:'Airport'}));expect(container.querySelector('#mobile-menu')).toBeNull()
 await act(async()=>{})
})
it.each([1,2])('hydrates the persisted cart and gives the %s-item cart the right accessible name',async count=>{
 cart.mockReturnValue(count);cart.persist={rehydrate:vi.fn().mockResolvedValue(undefined)}
 await act(async()=>{render(<HeaderClient services={[]}/>)});expect(cart.persist.rehydrate).toHaveBeenCalledOnce();expect(screen.getAllByRole('link',{name:`Shopping cart, ${count} ${count===1?'item':'items'}`})).toHaveLength(2)
})
