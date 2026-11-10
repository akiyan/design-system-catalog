<script>
 import {Button,Label,Checkbox} from 'bits-ui';
 let {view,language,name,t}=$props();
 let value=$state(t.placeholder);let checked=$state(true);let status=$state('');
</script>
<div class="specimen">
 <header class="specimen-header"><span>{name}</span><span>{t.specimen}</span></header>
 {#if view==='overview'}
 <section class="specimen-section"><h2>{t.type}</h2><div class="specimen-heading-group"><h1>{t.heading}</h1><p>{t.body}</p></div></section>
 <section class="specimen-section"><h2>{t.basic}</h2><div class="specimen-row"><Button.Root onclick={()=>status=t.status}>{t.save}</Button.Root><Button.Root onclick={()=>status=t.status}>{t.cancel}</Button.Root><Button.Root disabled>{t.disabled}</Button.Root></div></section>
 {/if}
 {#if view==='overview'||view==='form'}
 <section class="specimen-section"><h2>{t.form}</h2><div class="specimen-field"><Label.Root for="project-name">{t.name}</Label.Root><input id="project-name" aria-label={t.name} bind:value/></div></section>
 <section class="specimen-section"><h2>{t.notify}</h2><Checkbox.Root bind:checked aria-label={t.notify}>{t.notify}</Checkbox.Root></section>
 {#if view==='form'}
 <section class="specimen-section"><h2>{t.basic}</h2><div class="specimen-row"><Button.Root onclick={()=>status=t.status}>{t.save}</Button.Root><Button.Root onclick={()=>status=t.status}>{t.cancel}</Button.Root><Button.Root onclick={()=>status=t.status}>{t.more}</Button.Root></div></section>
 <section class="specimen-section"><h2>{t.states}</h2><Button.Root disabled>{t.disabled}</Button.Root></section>
 {/if}
 {/if}
 <div class="specimen-status" role="status">{status}</div>
</div>
