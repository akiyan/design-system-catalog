import React from'react';import'@finastra/button';import kit from'../react-kit';
export default kit({sizes:false,Button:({variant,children,...p})=>React.createElement(variant==='secondary'?'fds-outlined-button':variant==='text'?'fds-text-button':'fds-button',{...p,label:children})});
