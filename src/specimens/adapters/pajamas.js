import Vue from 'vue';import{GlButton,GlFormInput,GlFormCheckbox}from'@gitlab/ui';import'../../../node_modules/@gitlab/ui/dist/index.css';import'../../../node_modules/@gitlab/ui/dist/tailwind.css';import{words}from'../react-kit';
export default function mount(container,{view,language,name}){
 const t=words(language);const node=document.createElement('div');container.append(node);
 const app=new Vue({data:()=>({value:t.placeholder,checked:true,status:''}),render(h){
 const row=children=>h('div',{class:'specimen-row'},children);const section=(title,content)=>h('section',{class:'specimen-section'},[h('h2',title),content]);
 const b=(label,variant='confirm',disabled=false)=>h(GlButton,{props:{variant,disabled},on:{click:()=>{this.status=t.status}}},label);
 const content=view==='buttons'?[section(t.basic,row([b(t.save),b(t.cancel,'default'),b(t.more,'link')])),section(t.states,row([b(t.disabled,'confirm',true),b(t.disabled,'default',true)]))]:[section(t.form,h('div',{class:'specimen-field'},[h('label',t.name),h(GlFormInput,{props:{value:this.value},attrs:{'aria-label':t.name},on:{input:v=>{this.value=v}}})])),section(t.notify,h(GlFormCheckbox,{props:{checked:this.checked},on:{input:v=>{this.checked=v}}},t.notify)),row([b(t.save),b(t.cancel,'default')])];
 return h('div',{class:'specimen'},[h('header',{class:'specimen-header'},[h('span',name),h('span',t.specimen)]),...(view==='overview'?[section(t.type,h('div',{class:'specimen-heading-group'},[h('h1',t.heading),h('p',t.body)])),section(t.basic,row([b(t.save),b(t.cancel,'default'),b(t.disabled,'confirm',true)]))]:[]),...content,h('div',{class:'specimen-status',attrs:{role:'status'}},this.status)])}});app.$mount(node);return()=>app.$destroy();
}
