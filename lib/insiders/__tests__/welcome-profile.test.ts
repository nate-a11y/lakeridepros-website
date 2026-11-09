import { expect, it, vi } from 'vitest'
import { buildInsiderWelcomeEmail, getInsiderWelcomeProfileFromClient } from '../welcome'
const member={id:'member-1',name:' Example Member ',email:'member@example.com',membership_type:'family',joined_at:null,lifetime_tier:'diamond',complimentary_membership:true}
function profileClient({data=member,memberError=null,tier='gold',tierError=null,riders=[{name:'Owner',is_account_owner:true},{name:'Rider',is_account_owner:false}],riderError=null}:Record<string,unknown>={}){
 const memberQuery={select:vi.fn(),eq:vi.fn(),maybeSingle:vi.fn().mockResolvedValue({data,error:memberError})};memberQuery.select.mockReturnValue(memberQuery);memberQuery.eq.mockReturnValue(memberQuery)
 const riderQuery={select:vi.fn(),eq:vi.fn(),order:vi.fn().mockResolvedValue({data:riders,error:riderError})};riderQuery.select.mockReturnValue(riderQuery);riderQuery.eq.mockReturnValue(riderQuery)
 const client={from:vi.fn((table:string)=>table==='insider_members'?memberQuery:riderQuery),rpc:vi.fn().mockResolvedValue({data:tier,error:tierError})}
 return{client,memberQuery,riderQuery}
}
it('only reads active membership and rider rows and excludes the owner from additional riders',async()=>{
 const {client,memberQuery,riderQuery}=profileClient();const result=await getInsiderWelcomeProfileFromClient(client as never,'member-1')
 expect(result).toMatchObject({memberId:'member-1',approvedRiders:['Rider'],tier:'gold',complimentaryMembership:true,lifetimeTier:'diamond'})
 expect(memberQuery.eq).toHaveBeenCalledWith('is_active',true);expect(memberQuery.eq).toHaveBeenCalledWith('id','member-1');expect(riderQuery.eq).toHaveBeenCalledWith('member_id','member-1')
})
it.each([null,{...member,email:null}])('does not generate a welcome profile for missing/email-less members %j',async data=>{const{client}=profileClient({data});expect(await getInsiderWelcomeProfileFromClient(client as never,'member-1')).toBeNull();expect(client.rpc).not.toHaveBeenCalled()})
it.each([{memberError:{message:'member error'},message:'member error'},{memberError:{},message:'unknown error'},{tier:null,message:'missing tier'},{tierError:{message:'tier error'},message:'tier error'},{tierError:{},message:'missing tier'},{riderError:{message:'rider error'},message:'rider error'},{riderError:{},message:'unknown error'}])('fails closed on incomplete profile reads: $message',async options=>{const{client}=profileClient(options);await expect(getInsiderWelcomeProfileFromClient(client as never,'member-1')).rejects.toThrow(options.message)})
it('supports no additional riders and escapes family/lifetime welcome content without sending it',async()=>{
 const{client}=profileClient({riders:null});const profile=await getInsiderWelcomeProfileFromClient(client as never,'member-1');expect(profile?.approvedRiders).toEqual([])
 const email=buildInsiderWelcomeEmail({...profile!,name:' ',approvedRiders:['<b>Rider</b>']},'not a valid URL')
 expect(email.subject).toContain('Insider');expect(email.html).toContain('Diamond for life');expect(email.html).not.toContain('<b>Rider</b>');expect(email.html).toContain('https://www.lakeridepros.com/insider-rewards/')
})
