import { expect, it } from 'vitest'
import { renderPortableTextToHtml, renderPortableTextToPlainHtml } from '../render-rich-text'
const block=(style='normal', marks: string[]=[], markDefs: unknown[]=[]) => ({_type:'block',_key:'block',style,markDefs,children:[{_type:'span',_key:'span',text:'Safe <content>',marks}]})
for(const render of [renderPortableTextToHtml,renderPortableTextToPlainHtml]){
 it.each([null,undefined,[],{}])(`${render.name} handles empty or invalid input %j`, value=>{expect(render(value as never)).toBe('')})
 it.each(['normal','h1','h2','h3','h4','h5','h6','blockquote'])(`${render.name} preserves %s semantic markup`, style=>{
 const html=render([block(style)] as never);const tag=style==='normal'?'p':style
 expect(html).toContain(`<${tag}`);expect(html).toContain(`</${tag}>`);expect(html).toContain('Safe &lt;content&gt;')
 })
 it.each([['strong','strong'],['em','em'],['underline','u'],['strike-through','s'],['code','code']])(`${render.name} preserves %s marks`,(mark,tag)=>{expect(render([block('normal',[mark])] as never)).toContain(`<${tag}>Safe &lt;content&gt;</${tag}>`)})
 it.each([['bullet','ul'],['number','ol']])(`${render.name} groups %s list items`,(listItem,tag)=>{
 const html=render([{...block(),listItem,level:1},{...block(),_key:'second',listItem,level:1}] as never)
 expect(html).toContain(`<${tag}`);expect(html.match(/<li/g)).toHaveLength(2);expect(html).toContain(`</${tag}>`)
 })
 it.each([false,true])(`${render.name} escapes link attributes with blank=%s`, blank=>{
 const html=render([block('normal',['link-1'],[{_type:'link',_key:'link-1',href:'https://example.com/?a="<b>&c',blank}])] as never)
 expect(html).toContain('&quot;&lt;b&gt;&amp;c');expect(html.includes('noopener noreferrer')).toBe(blank)
 const fallback=render([block('normal',['link-1'],[{_type:'link',_key:'link-1'}])] as never);expect(fallback).toContain('href="#"')
 })
}
