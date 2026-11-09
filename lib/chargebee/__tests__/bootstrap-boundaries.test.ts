import { expect, it, vi } from 'vitest'
import { runInsiderChargebeeBootstrap, parseBootstrapArguments, createBootstrapPlanMap, assertBootstrapApplyGuard, INSIDER_BOOTSTRAP_CONFIRMATION } from '../insider-bootstrap'
const planEnv=Object.fromEntries(['INDIVIDUAL','FAMILY','BUSINESS'].flatMap(type=>['MONTHLY','ANNUAL'].map(interval=>[`CHARGEBEE_INSIDER_${type}_${interval}_PRICE_ID`,`${type.toLowerCase()}-${interval.toLowerCase()}`])))
const subscription={id:'subscription-1',customer_id:'customer-1',status:'active',billing_period:1,billing_period_unit:'month',resource_version:100,current_term_start:1800000000,current_term_end:1802592000,currency_code:'USD',subscription_items:[{item_price_id:'family-monthly',item_type:'plan',quantity:1,amount:1999}]}
const customer={id:'customer-1',email:'member@example.com',phone:'+15732069499',first_name:'Example'}
const member={id:'member-1',email:'member@example.com',phone:'5732069499',chargebee_customer_id:'customer-1'}
async function dryRun(sub:Record<string,unknown>=subscription,person:Record<string,unknown>=customer,members:unknown[]=[member]){
 const rpc=vi.fn(), history=vi.fn().mockResolvedValue([])
 const summary=await runInsiderChargebeeBootstrap({chargebee:{listApprovedSubscriptions:vi.fn().mockResolvedValue([{subscription:sub,customer:person}]),listPaidInvoices:history,listSuccessfulTransactions:vi.fn().mockResolvedValue([])},members,planEnv,supabase:{rpc}} as never)
 expect(rpc).not.toHaveBeenCalled();return{summary,history}
}
it.each(['active','non_renewing','in_trial','future','paused'])('plans supported status %s without making writes',async status=>{const{summary}=await dryRun({...subscription,status});expect(summary.subscriptionsReady).toBe(1);expect(summary.mode).toBe('dry-run')})
it.each([{id:undefined}, {id:''},{customer_id:''},{resource_version:0},{resource_version:NaN},{billing_period:2},{billing_period_unit:'year'},{subscription_items:[]},{subscription_items:[{item_type:'addon',item_price_id:'family-monthly'}]},{subscription_items:[{item_type:'plan',item_price_id:'unknown'}]}])('rejects incomplete subscription fields %j before requesting invoice history',async patch=>{
 const{summary,history}=await dryRun({...subscription,...patch});expect(summary.issues).toHaveLength(1);expect(history).not.toHaveBeenCalled()
})
it('skips cancelled subscriptions before history reads and plans delinquent active subscriptions',async()=>{
 expect((await dryRun({...subscription,status:'cancelled'})).summary.subscriptionsSkippedCancelled).toBe(1)
 expect((await dryRun({...subscription,due_invoices_count:1})).summary.subscriptionsReady).toBe(1)
})
it.each([
 [{...customer,id:'different'} ,[member],0],
 [{...customer,email:null,phone:'123'},[],0],
 [{...customer,email:'other@example.com'},[{...member,chargebee_customer_id:null}],0],
 [customer,[member,{...member,id:'duplicate'}],0],
 [customer,[{...member,chargebee_customer_id:null},{...member,id:'different',email:'other@example.com'}],0],
 [{id:'customer-1',phone:'1-573-206-9499'},[{...member,email:null,chargebee_customer_id:null}],1],
 [{id:'customer-1',company:'Company'},[{...member,email:null,phone:null}],1],
 [{id:'customer-1'},[member],1],
] as const)('never writes ambiguous or incomplete customer identities %j',async(person,members,ready)=>{const{summary}=await dryRun(subscription,person,members as unknown as unknown[]);expect(summary.mode).toBe('dry-run');expect(summary.subscriptionsReady).toBe(ready)})
it('rejects duplicate plan mappings and accepts both inline and separated CLI confirmations',()=>{
 expect(()=>createBootstrapPlanMap({...planEnv,CHARGEBEE_INSIDER_FAMILY_MONTHLY_PRICE_ID:'individual-monthly'})).toThrow('mapped more than once')
 expect(()=>createBootstrapPlanMap({})).toThrow()
 for(const args of [['--apply','--confirm=example','--target-project-ref=ref','--target-chargebee-site=site'],['--dry-run','--confirm','example','--target-project-ref','ref','--target-chargebee-site','site','-h']])expect(parseBootstrapArguments(args)).toMatchObject({confirm:'example',targetProjectRef:'ref',targetChargebeeSite:'site'})
 expect(()=>parseBootstrapArguments(['--unknown'])).toThrow('Unknown');expect(()=>parseBootstrapArguments(['--apply','--dry-run'])).toThrow('either')
 const args={apply:true,confirm:INSIDER_BOOTSTRAP_CONFIRMATION,targetProjectRef:'ref',targetChargebeeSite:'site',help:false}
 const env={INSIDERS_CHARGEBEE_BOOTSTRAP_MODE:'apply',INSIDERS_CHARGEBEE_SYNC_MODE:'off',CHARGEBEE_SITE:'site',NEXT_PUBLIC_SUPABASE_URL:'https://ref.supabase.co'}
 expect(()=>assertBootstrapApplyGuard(args,env)).not.toThrow()
 for(const patch of [{INSIDERS_CHARGEBEE_BOOTSTRAP_MODE:'off'},{INSIDERS_CHARGEBEE_SYNC_MODE:'live'},{NEXT_PUBLIC_SUPABASE_URL:'https://example.com'},{NEXT_PUBLIC_SUPABASE_URL:''}])expect(()=>assertBootstrapApplyGuard(args,{...env,...patch})).toThrow()
 expect(()=>assertBootstrapApplyGuard({...args,targetProjectRef:'different'},env)).toThrow('Supabase')
 expect(()=>assertBootstrapApplyGuard({...args,targetProjectRef:null},env)).toThrow('Supabase')
})
it.each([['future','pending'],['in_trial','active'],['active','active'],['non_renewing','active'],['paused','hold']])('keeps %s snapshot state correct through a mocked-only RPC',async(status,accountStatus)=>{
 const rpc=vi.fn().mockResolvedValue({data:{bootstrapValidated:true,historicalBackfill:false,memberId:'member-1'},error:null})
 const summary=await runInsiderChargebeeBootstrap({apply:true,chargebee:{listApprovedSubscriptions:async()=>[{subscription:{...subscription,status,cancelled_at:1800000000},customer:{...customer,company:'Example Company'}}],listPaidInvoices:async()=>[],listSuccessfulTransactions:async()=>[]},members:[member],planEnv,supabase:{rpc}} as never)
 expect(summary.eventsApplied).toBe(1);expect(rpc).toHaveBeenCalledWith('apply_insider_chargebee_bootstrap_event',expect.objectContaining({target_subscription_status:status,target_account_status:accountStatus,target_customer_name:'Example Company',historical_backfill:false}))
})
it('never continues past an absent apply client or a failed mocked RPC postcondition',async()=>{
 await expect(runInsiderChargebeeBootstrap({apply:true} as never)).rejects.toThrow('RPC client')
 const rpc=vi.fn().mockResolvedValue({data:null,error:null})
 const summary=await runInsiderChargebeeBootstrap({apply:true,chargebee:{listApprovedSubscriptions:async()=>[{subscription:{...subscription,due_invoices_count:1,cancelled_at:-1},customer:{id:'customer-1'}}],listPaidInvoices:async()=>[],listSuccessfulTransactions:async()=>[]},members:[member],planEnv,supabase:{rpc}} as never)
 expect(summary.failures).toBe(1);expect(summary.eventsApplied).toBe(0);expect(rpc).toHaveBeenCalledOnce()
})
