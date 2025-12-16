import{r as v}from"./index.WFquGv8Z.js";var l={exports:{}},e={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var p;function c(){if(p)return e;p=1;var n=Symbol.for("react.transitional.element"),u=Symbol.for("react.fragment");function s(a,t,r){var i=null;if(r!==void 0&&(i=""+r),t.key!==void 0&&(i=""+t.key),"key"in t){r={};for(var o in t)o!=="key"&&(r[o]=t[o])}else r=t;return t=r.ref,{$$typeof:n,type:a,key:i,ref:t!==void 0?t:null,props:r}}return e.Fragment=u,e.jsx=s,e.jsxs=s,e}var d;function R(){return d||(d=1,l.exports=c()),l.exports}var x=R();const E=()=>{const[n,u]=v.useState(0),s=t=>(+t).toString(16).padStart(2,"0"),a=t=>{u(t.target.value)};return x.jsxs("div",{className:"ui_input mt-4",children:[x.jsx("input",{inputMode:"numeric",pattern:"[0-9]*",type:"number",value:n,onChange:a}),x.jsx("div",{className:"label",children:s(n)})]})};export{E as default};
