import{mount,unmount}from'svelte';import Bits from'./Bits.svelte';import{words}from'../react-kit';
export default function render(container,options){const app=mount(Bits,{target:container,props:{...options,t:words(options.language,options.copy)}});return()=>unmount(app)}
