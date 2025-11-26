(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){let t=Object.create(null);for(let n of e.split(`,`))t[n]=1;return e=>e in t}var t={},n=[],r=()=>{},i=()=>!1,a=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),o=e=>e.startsWith(`onUpdate:`),s=Object.assign,c=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},l=Object.prototype.hasOwnProperty,u=(e,t)=>l.call(e,t),d=Array.isArray,f=e=>b(e)===`[object Map]`,p=e=>b(e)===`[object Set]`,m=e=>typeof e==`function`,h=e=>typeof e==`string`,g=e=>typeof e==`symbol`,_=e=>typeof e==`object`&&!!e,v=e=>(_(e)||m(e))&&m(e.then)&&m(e.catch),y=Object.prototype.toString,b=e=>y.call(e),ee=e=>b(e).slice(8,-1),te=e=>b(e)===`[object Object]`,ne=e=>h(e)&&e!==`NaN`&&e[0]!==`-`&&``+parseInt(e,10)===e,re=e(`,key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted`),ie=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},ae=/-\w/g,oe=ie(e=>e.replace(ae,e=>e.slice(1).toUpperCase())),se=/\B([A-Z])/g,ce=ie(e=>e.replace(se,`-$1`).toLowerCase()),le=ie(e=>e.charAt(0).toUpperCase()+e.slice(1)),ue=ie(e=>e?`on${le(e)}`:``),de=(e,t)=>!Object.is(e,t),fe=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},pe=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},me=e=>{let t=parseFloat(e);return isNaN(t)?e:t},he,ge=()=>he||=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{};function _e(e){if(d(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],i=h(r)?xe(r):_e(r);if(i)for(let e in i)t[e]=i[e]}return t}else if(h(e)||_(e))return e}var ve=/;(?![^(]*\))/g,ye=/:([^]+)/,be=/\/\*[^]*?\*\//g;function xe(e){let t={};return e.replace(be,``).split(ve).forEach(e=>{if(e){let n=e.split(ye);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function x(e){let t=``;if(h(e))t=e;else if(d(e))for(let n=0;n<e.length;n++){let r=x(e[n]);r&&(t+=r+` `)}else if(_(e))for(let n in e)e[n]&&(t+=n+` `);return t.trim()}var Se=`itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`,Ce=e(Se);Se+``;function we(e){return!!e||e===``}var Te=e=>!!(e&&e.__v_isRef===!0),S=e=>h(e)?e:e==null?``:d(e)||_(e)&&(e.toString===y||!m(e.toString))?Te(e)?S(e.value):JSON.stringify(e,Ee,2):String(e),Ee=(e,t)=>Te(t)?Ee(e,t.value):f(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((e,[t,n],r)=>(e[De(t,r)+` =>`]=n,e),{})}:p(t)?{[`Set(${t.size})`]:[...t.values()].map(e=>De(e))}:g(t)?De(t):_(t)&&!d(t)&&!te(t)?String(t):t,De=(e,t=``)=>g(e)?`Symbol(${e.description??t})`:e,Oe,ke=class{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=Oe,!e&&Oe&&(this.index=(Oe.scopes||=[]).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].pause();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].resume();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].resume()}}run(e){if(this._active){let t=Oe;try{return Oe=this,e()}finally{Oe=t}}}on(){++this._on===1&&(this.prevScope=Oe,Oe=this)}off(){this._on>0&&--this._on===0&&(Oe=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){this._active=!1;let t,n;for(t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(this.effects.length=0,t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){let e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index)}this.parent=void 0}}};function Ae(){return Oe}var C,je=new WeakSet,Me=class{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Oe&&Oe.active&&Oe.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,je.has(this)&&(je.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Ie(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Ye(this),ze(this);let e=C,t=Ge;C=this,Ge=!0;try{return this.fn()}finally{Be(this),C=e,Ge=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Ue(e);this.deps=this.depsTail=void 0,Ye(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?je.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Ve(this)&&this.run()}get dirty(){return Ve(this)}},Ne=0,Pe,Fe;function Ie(e,t=!1){if(e.flags|=8,t){e.next=Fe,Fe=e;return}e.next=Pe,Pe=e}function Le(){Ne++}function Re(){if(--Ne>0)return;if(Fe){let e=Fe;for(Fe=void 0;e;){let t=e.next;e.next=void 0,e.flags&=-9,e=t}}let e;for(;Pe;){let t=Pe;for(Pe=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(t){e||=t}t=n}}if(e)throw e}function ze(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Be(e){let t,n=e.depsTail,r=n;for(;r;){let e=r.prevDep;r.version===-1?(r===n&&(n=e),Ue(r),We(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=e}e.deps=t,e.depsTail=n}function Ve(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(He(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function He(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Xe)||(e.globalVersion=Xe,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Ve(e))))return;e.flags|=2;let t=e.dep,n=C,r=Ge;C=e,Ge=!0;try{ze(e);let n=e.fn(e._value);(t.version===0||de(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(e){throw t.version++,e}finally{C=n,Ge=r,Be(e),e.flags&=-3}}function Ue(e,t=!1){let{dep:n,prevSub:r,nextSub:i}=e;if(r&&(r.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)Ue(e,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function We(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var Ge=!0,Ke=[];function qe(){Ke.push(Ge),Ge=!1}function Je(){let e=Ke.pop();Ge=e===void 0?!0:e}function Ye(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let e=C;C=void 0;try{t()}finally{C=e}}}var Xe=0,Ze=class{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},Qe=class{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!C||!Ge||C===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==C)t=this.activeLink=new Ze(C,this),C.deps?(t.prevDep=C.depsTail,C.depsTail.nextDep=t,C.depsTail=t):C.deps=C.depsTail=t,$e(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){let e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=C.depsTail,t.nextDep=void 0,C.depsTail.nextDep=t,C.depsTail=t,C.deps===t&&(C.deps=e)}return t}trigger(e){this.version++,Xe++,this.notify(e)}notify(e){Le();try{for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{Re()}}};function $e(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let e=t.deps;e;e=e.nextDep)$e(e)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var et=new WeakMap,tt=Symbol(``),nt=Symbol(``),rt=Symbol(``);function it(e,t,n){if(Ge&&C){let t=et.get(e);t||et.set(e,t=new Map);let r=t.get(n);r||(t.set(n,r=new Qe),r.map=t,r.key=n),r.track()}}function at(e,t,n,r,i,a){let o=et.get(e);if(!o){Xe++;return}let s=e=>{e&&e.trigger()};if(Le(),t===`clear`)o.forEach(s);else{let i=d(e),a=i&&ne(n);if(i&&n===`length`){let e=Number(r);o.forEach((t,n)=>{(n===`length`||n===rt||!g(n)&&n>=e)&&s(t)})}else switch((n!==void 0||o.has(void 0))&&s(o.get(n)),a&&s(o.get(rt)),t){case`add`:i?a&&s(o.get(`length`)):(s(o.get(tt)),f(e)&&s(o.get(nt)));break;case`delete`:i||(s(o.get(tt)),f(e)&&s(o.get(nt)));break;case`set`:f(e)&&s(o.get(tt));break}}Re()}function ot(e){let t=w(e);return t===e?t:(it(t,`iterate`,rt),Kt(e)?t:t.map(Yt))}function st(e){return it(e=w(e),`iterate`,rt),e}function ct(e,t){return Gt(e)?Wt(e)?Xt(Yt(t)):Xt(t):Yt(t)}var lt={__proto__:null,[Symbol.iterator](){return ut(this,Symbol.iterator,e=>ct(this,e))},concat(...e){return ot(this).concat(...e.map(e=>d(e)?ot(e):e))},entries(){return ut(this,`entries`,e=>(e[1]=ct(this,e[1]),e))},every(e,t){return ft(this,`every`,e,t,void 0,arguments)},filter(e,t){return ft(this,`filter`,e,t,e=>e.map(e=>ct(this,e)),arguments)},find(e,t){return ft(this,`find`,e,t,e=>ct(this,e),arguments)},findIndex(e,t){return ft(this,`findIndex`,e,t,void 0,arguments)},findLast(e,t){return ft(this,`findLast`,e,t,e=>ct(this,e),arguments)},findLastIndex(e,t){return ft(this,`findLastIndex`,e,t,void 0,arguments)},forEach(e,t){return ft(this,`forEach`,e,t,void 0,arguments)},includes(...e){return mt(this,`includes`,e)},indexOf(...e){return mt(this,`indexOf`,e)},join(e){return ot(this).join(e)},lastIndexOf(...e){return mt(this,`lastIndexOf`,e)},map(e,t){return ft(this,`map`,e,t,void 0,arguments)},pop(){return ht(this,`pop`)},push(...e){return ht(this,`push`,e)},reduce(e,...t){return pt(this,`reduce`,e,t)},reduceRight(e,...t){return pt(this,`reduceRight`,e,t)},shift(){return ht(this,`shift`)},some(e,t){return ft(this,`some`,e,t,void 0,arguments)},splice(...e){return ht(this,`splice`,e)},toReversed(){return ot(this).toReversed()},toSorted(e){return ot(this).toSorted(e)},toSpliced(...e){return ot(this).toSpliced(...e)},unshift(...e){return ht(this,`unshift`,e)},values(){return ut(this,`values`,e=>ct(this,e))}};function ut(e,t,n){let r=st(e),i=r[t]();return r!==e&&!Kt(e)&&(i._next=i.next,i.next=()=>{let e=i._next();return e.done||(e.value=n(e.value)),e}),i}var dt=Array.prototype;function ft(e,t,n,r,i,a){let o=st(e),s=o!==e&&!Kt(e),c=o[t];if(c!==dt[t]){let t=c.apply(e,a);return s?Yt(t):t}let l=n;o!==e&&(s?l=function(t,r){return n.call(this,ct(e,t),r,e)}:n.length>2&&(l=function(t,r){return n.call(this,t,r,e)}));let u=c.call(o,l,r);return s&&i?i(u):u}function pt(e,t,n,r){let i=st(e),a=n;return i!==e&&(Kt(e)?n.length>3&&(a=function(t,r,i){return n.call(this,t,r,i,e)}):a=function(t,r,i){return n.call(this,t,ct(e,r),i,e)}),i[t](a,...r)}function mt(e,t,n){let r=w(e);it(r,`iterate`,rt);let i=r[t](...n);return(i===-1||i===!1)&&qt(n[0])?(n[0]=w(n[0]),r[t](...n)):i}function ht(e,t,n=[]){qe(),Le();let r=w(e)[t].apply(e,n);return Re(),Je(),r}var gt=e(`__proto__,__v_isRef,__isVue`),_t=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!==`arguments`&&e!==`caller`).map(e=>Symbol[e]).filter(g));function vt(e){g(e)||(e=String(e));let t=w(this);return it(t,`has`,e),t.hasOwnProperty(e)}var yt=class{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,n){if(t===`__v_skip`)return e.__v_skip;let r=this._isReadonly,i=this._isShallow;if(t===`__v_isReactive`)return!r;if(t===`__v_isReadonly`)return r;if(t===`__v_isShallow`)return i;if(t===`__v_raw`)return n===(r?i?Lt:It:i?Ft:Pt).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;let a=d(e);if(!r){let e;if(a&&(e=lt[t]))return e;if(t===`hasOwnProperty`)return vt}let o=Reflect.get(e,t,Zt(e)?e:n);if((g(t)?_t.has(t):gt(t))||(r||it(e,`get`,t),i))return o;if(Zt(o)){let e=a&&ne(t)?o:o.value;return r&&_(e)?Ht(e):e}return _(o)?r?Ht(o):Bt(o):o}},bt=class extends yt{constructor(e=!1){super(!1,e)}set(e,t,n,r){let i=e[t],a=d(e)&&ne(t);if(!this._isShallow){let e=Gt(i);if(!Kt(n)&&!Gt(n)&&(i=w(i),n=w(n)),!a&&Zt(i)&&!Zt(n))return e||(i.value=n),!0}let o=a?Number(t)<e.length:u(e,t),s=Reflect.set(e,t,n,Zt(e)?e:r);return e===w(r)&&(o?de(n,i)&&at(e,`set`,t,n,i):at(e,`add`,t,n)),s}deleteProperty(e,t){let n=u(e,t),r=e[t],i=Reflect.deleteProperty(e,t);return i&&n&&at(e,`delete`,t,void 0,r),i}has(e,t){let n=Reflect.has(e,t);return(!g(t)||!_t.has(t))&&it(e,`has`,t),n}ownKeys(e){return it(e,`iterate`,d(e)?`length`:tt),Reflect.ownKeys(e)}},xt=class extends yt{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}},St=new bt,Ct=new xt,wt=new bt(!0),Tt=e=>e,Et=e=>Reflect.getPrototypeOf(e);function Dt(e,t,n){return function(...r){let i=this.__v_raw,a=w(i),o=f(a),s=e===`entries`||e===Symbol.iterator&&o,c=e===`keys`&&o,l=i[e](...r),u=n?Tt:t?Xt:Yt;return!t&&it(a,`iterate`,c?nt:tt),{next(){let{value:e,done:t}=l.next();return t?{value:e,done:t}:{value:s?[u(e[0]),u(e[1])]:u(e),done:t}},[Symbol.iterator](){return this}}}}function Ot(e){return function(...t){return e===`delete`?!1:e===`clear`?void 0:this}}function kt(e,t){let n={get(n){let r=this.__v_raw,i=w(r),a=w(n);e||(de(n,a)&&it(i,`get`,n),it(i,`get`,a));let{has:o}=Et(i),s=t?Tt:e?Xt:Yt;if(o.call(i,n))return s(r.get(n));if(o.call(i,a))return s(r.get(a));r!==i&&r.get(n)},get size(){let t=this.__v_raw;return!e&&it(w(t),`iterate`,tt),t.size},has(t){let n=this.__v_raw,r=w(n),i=w(t);return e||(de(t,i)&&it(r,`has`,t),it(r,`has`,i)),t===i?n.has(t):n.has(t)||n.has(i)},forEach(n,r){let i=this,a=i.__v_raw,o=w(a),s=t?Tt:e?Xt:Yt;return!e&&it(o,`iterate`,tt),a.forEach((e,t)=>n.call(r,s(e),s(t),i))}};return s(n,e?{add:Ot(`add`),set:Ot(`set`),delete:Ot(`delete`),clear:Ot(`clear`)}:{add(e){!t&&!Kt(e)&&!Gt(e)&&(e=w(e));let n=w(this);return Et(n).has.call(n,e)||(n.add(e),at(n,`add`,e,e)),this},set(e,n){!t&&!Kt(n)&&!Gt(n)&&(n=w(n));let r=w(this),{has:i,get:a}=Et(r),o=i.call(r,e);o||=(e=w(e),i.call(r,e));let s=a.call(r,e);return r.set(e,n),o?de(n,s)&&at(r,`set`,e,n,s):at(r,`add`,e,n),this},delete(e){let t=w(this),{has:n,get:r}=Et(t),i=n.call(t,e);i||=(e=w(e),n.call(t,e));let a=r?r.call(t,e):void 0,o=t.delete(e);return i&&at(t,`delete`,e,void 0,a),o},clear(){let e=w(this),t=e.size!==0,n=e.clear();return t&&at(e,`clear`,void 0,void 0,void 0),n}}),[`keys`,`values`,`entries`,Symbol.iterator].forEach(r=>{n[r]=Dt(r,e,t)}),n}function At(e,t){let n=kt(e,t);return(t,r,i)=>r===`__v_isReactive`?!e:r===`__v_isReadonly`?e:r===`__v_raw`?t:Reflect.get(u(n,r)&&r in t?n:t,r,i)}var jt={get:At(!1,!1)},Mt={get:At(!1,!0)},Nt={get:At(!0,!1)},Pt=new WeakMap,Ft=new WeakMap,It=new WeakMap,Lt=new WeakMap;function Rt(e){switch(e){case`Object`:case`Array`:return 1;case`Map`:case`Set`:case`WeakMap`:case`WeakSet`:return 2;default:return 0}}function zt(e){return e.__v_skip||!Object.isExtensible(e)?0:Rt(ee(e))}function Bt(e){return Gt(e)?e:Ut(e,!1,St,jt,Pt)}function Vt(e){return Ut(e,!1,wt,Mt,Ft)}function Ht(e){return Ut(e,!0,Ct,Nt,It)}function Ut(e,t,n,r,i){if(!_(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;let a=zt(e);if(a===0)return e;let o=i.get(e);if(o)return o;let s=new Proxy(e,a===2?r:n);return i.set(e,s),s}function Wt(e){return Gt(e)?Wt(e.__v_raw):!!(e&&e.__v_isReactive)}function Gt(e){return!!(e&&e.__v_isReadonly)}function Kt(e){return!!(e&&e.__v_isShallow)}function qt(e){return e?!!e.__v_raw:!1}function w(e){let t=e&&e.__v_raw;return t?w(t):e}function Jt(e){return!u(e,`__v_skip`)&&Object.isExtensible(e)&&pe(e,`__v_skip`,!0),e}var Yt=e=>_(e)?Bt(e):e,Xt=e=>_(e)?Ht(e):e;function Zt(e){return e?e.__v_isRef===!0:!1}function T(e){return Qt(e,!1)}function Qt(e,t){return Zt(e)?e:new $t(e,t)}var $t=class{constructor(e,t){this.dep=new Qe,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?e:w(e),this._value=t?e:Yt(e),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(e){let t=this._rawValue,n=this.__v_isShallow||Kt(e)||Gt(e);e=n?e:w(e),de(e,t)&&(this._rawValue=e,this._value=n?e:Yt(e),this.dep.trigger())}};function en(e){return Zt(e)?e.value:e}var tn={get:(e,t,n)=>t===`__v_raw`?e:en(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let i=e[t];return Zt(i)&&!Zt(n)?(i.value=n,!0):Reflect.set(e,t,n,r)}};function nn(e){return Wt(e)?e:new Proxy(e,tn)}var rn=class{constructor(e,t,n){this.fn=e,this.setter=t,this._value=void 0,this.dep=new Qe(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Xe-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&C!==this)return Ie(this,!0),!0}get value(){let e=this.dep.track();return He(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}};function an(e,t,n=!1){let r,i;return m(e)?r=e:(r=e.get,i=e.set),new rn(r,i,n)}var on={},sn=new WeakMap,cn=void 0;function ln(e,t=!1,n=cn){if(n){let t=sn.get(n);t||sn.set(n,t=[]),t.push(e)}}function un(e,n,i=t){let{immediate:a,deep:o,once:s,scheduler:l,augmentJob:u,call:f}=i,p=e=>o?e:Kt(e)||o===!1||o===0?dn(e,1):dn(e),h,g,_,v,y=!1,b=!1;if(Zt(e)?(g=()=>e.value,y=Kt(e)):Wt(e)?(g=()=>p(e),y=!0):d(e)?(b=!0,y=e.some(e=>Wt(e)||Kt(e)),g=()=>e.map(e=>{if(Zt(e))return e.value;if(Wt(e))return p(e);if(m(e))return f?f(e,2):e()})):g=m(e)?n?f?()=>f(e,2):e:()=>{if(_){qe();try{_()}finally{Je()}}let t=cn;cn=h;try{return f?f(e,3,[v]):e(v)}finally{cn=t}}:r,n&&o){let e=g,t=o===!0?1/0:o;g=()=>dn(e(),t)}let ee=Ae(),te=()=>{h.stop(),ee&&ee.active&&c(ee.effects,h)};if(s&&n){let e=n;n=(...t)=>{e(...t),te()}}let ne=b?Array(e.length).fill(on):on,re=e=>{if(!(!(h.flags&1)||!h.dirty&&!e))if(n){let e=h.run();if(o||y||(b?e.some((e,t)=>de(e,ne[t])):de(e,ne))){_&&_();let t=cn;cn=h;try{let t=[e,ne===on?void 0:b&&ne[0]===on?[]:ne,v];ne=e,f?f(n,3,t):n(...t)}finally{cn=t}}}else h.run()};return u&&u(re),h=new Me(g),h.scheduler=l?()=>l(re,!1):re,v=e=>ln(e,!1,h),_=h.onStop=()=>{let e=sn.get(h);if(e){if(f)f(e,4);else for(let t of e)t();sn.delete(h)}},n?a?re(!0):ne=h.run():l?l(re.bind(null,!0),!0):h.run(),te.pause=h.pause.bind(h),te.resume=h.resume.bind(h),te.stop=te,te}function dn(e,t=1/0,n){if(t<=0||!_(e)||e.__v_skip||(n||=new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,Zt(e))dn(e.value,t,n);else if(d(e))for(let r=0;r<e.length;r++)dn(e[r],t,n);else if(p(e)||f(e))e.forEach(e=>{dn(e,t,n)});else if(te(e)){for(let r in e)dn(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&dn(e[r],t,n)}return e}function fn(e,t,n,r){try{return r?e(...r):e()}catch(e){mn(e,t,n)}}function pn(e,t,n,r){if(m(e)){let i=fn(e,t,n,r);return i&&v(i)&&i.catch(e=>{mn(e,t,n)}),i}if(d(e)){let i=[];for(let a=0;a<e.length;a++)i.push(pn(e[a],t,n,r));return i}}function mn(e,n,r,i=!0){let a=n?n.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:s}=n&&n.appContext.config||t;if(n){let t=n.parent,i=n.proxy,a=`https://vuejs.org/error-reference/#runtime-${r}`;for(;t;){let n=t.ec;if(n){for(let t=0;t<n.length;t++)if(n[t](e,i,a)===!1)return}t=t.parent}if(o){qe(),fn(o,null,10,[e,i,a]),Je();return}}hn(e,r,a,i,s)}function hn(e,t,n,r=!0,i=!1){if(i)throw e;console.error(e)}var gn=[],_n=-1,vn=[],yn=null,bn=0,xn=Promise.resolve(),Sn=null;function Cn(e){let t=Sn||xn;return e?t.then(this?e.bind(this):e):t}function wn(e){let t=_n+1,n=gn.length;for(;t<n;){let r=t+n>>>1,i=gn[r],a=An(i);a<e||a===e&&i.flags&2?t=r+1:n=r}return t}function Tn(e){if(!(e.flags&1)){let t=An(e),n=gn[gn.length-1];!n||!(e.flags&2)&&t>=An(n)?gn.push(e):gn.splice(wn(t),0,e),e.flags|=1,En()}}function En(){Sn||=xn.then(jn)}function Dn(e){d(e)?vn.push(...e):yn&&e.id===-1?yn.splice(bn+1,0,e):e.flags&1||(vn.push(e),e.flags|=1),En()}function On(e,t,n=_n+1){for(;n<gn.length;n++){let t=gn[n];if(t&&t.flags&2){if(e&&t.id!==e.uid)continue;gn.splice(n,1),n--,t.flags&4&&(t.flags&=-2),t(),t.flags&4||(t.flags&=-2)}}}function kn(e){if(vn.length){let e=[...new Set(vn)].sort((e,t)=>An(e)-An(t));if(vn.length=0,yn){yn.push(...e);return}for(yn=e,bn=0;bn<yn.length;bn++){let e=yn[bn];e.flags&4&&(e.flags&=-2),e.flags&8||e(),e.flags&=-2}yn=null,bn=0}}var An=e=>e.id==null?e.flags&2?-1:1/0:e.id;function jn(e){try{for(_n=0;_n<gn.length;_n++){let e=gn[_n];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),fn(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;_n<gn.length;_n++){let e=gn[_n];e&&(e.flags&=-2)}_n=-1,gn.length=0,kn(e),Sn=null,(gn.length||vn.length)&&jn(e)}}var Mn=null,Nn=null;function Pn(e){let t=Mn;return Mn=e,Nn=e&&e.type.__scopeId||null,t}function Fn(e,t=Mn,n){if(!t||e._n)return e;let r=(...n)=>{r._d&&zi(-1);let i=Pn(t),a;try{a=e(...n)}finally{Pn(i),r._d&&zi(1)}return a};return r._n=!0,r._c=!0,r._d=!0,r}function In(e,n){if(Mn===null)return e;let r=Sa(Mn),i=e.dirs||=[];for(let e=0;e<n.length;e++){let[a,o,s,c=t]=n[e];a&&(m(a)&&(a={mounted:a,updated:a}),a.deep&&dn(o),i.push({dir:a,instance:r,value:o,oldValue:void 0,arg:s,modifiers:c}))}return e}function Ln(e,t,n,r){let i=e.dirs,a=t&&t.dirs;for(let o=0;o<i.length;o++){let s=i[o];a&&(s.oldValue=a[o].value);let c=s.dir[r];c&&(qe(),pn(c,n,8,[e.el,s,e,t]),Je())}}var Rn=Symbol(`_vte`),zn=e=>e.__isTeleport,Bn=Symbol(`_leaveCb`);function Vn(e,t){e.shapeFlag&6&&e.component?(e.transition=t,Vn(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Hn(e){e.ids=[e.ids[0]+ e.ids[2]+++`-`,0,0]}var Un=new WeakMap;function Wn(e,n,r,a,o=!1){if(d(e)){e.forEach((e,t)=>Wn(e,n&&(d(n)?n[t]:n),r,a,o));return}if(Kn(a)&&!o){a.shapeFlag&512&&a.type.__asyncResolved&&a.component.subTree.component&&Wn(e,n,r,a.component.subTree);return}let s=a.shapeFlag&4?Sa(a.component):a.el,l=o?null:s,{i:f,r:p}=e,g=n&&n.r,_=f.refs===t?f.refs={}:f.refs,v=f.setupState,y=w(v),b=v===t?i:e=>u(y,e),ee=e=>!0;if(g!=null&&g!==p){if(Gn(n),h(g))_[g]=null,b(g)&&(v[g]=null);else if(Zt(g)){ee(g)&&(g.value=null);let e=n;e.k&&(_[e.k]=null)}}if(m(p))fn(p,f,12,[l,_]);else{let t=h(p),n=Zt(p);if(t||n){let i=()=>{if(e.f){let n=t?b(p)?v[p]:_[p]:ee(p)||!e.k?p.value:_[e.k];if(o)d(n)&&c(n,s);else if(d(n))n.includes(s)||n.push(s);else if(t)_[p]=[s],b(p)&&(v[p]=_[p]);else{let t=[s];ee(p)&&(p.value=t),e.k&&(_[e.k]=t)}}else t?(_[p]=l,b(p)&&(v[p]=l)):n&&(ee(p)&&(p.value=l),e.k&&(_[e.k]=l))};if(l){let t=()=>{i(),Un.delete(e)};t.id=-1,Un.set(e,t),yi(t,r)}else Gn(e),i()}}}function Gn(e){let t=Un.get(e);t&&(t.flags|=8,Un.delete(e))}ge().requestIdleCallback,ge().cancelIdleCallback;var Kn=e=>!!e.type.__asyncLoader,qn=e=>e.type.__isKeepAlive;function Jn(e,t){Xn(e,`a`,t)}function Yn(e,t){Xn(e,`da`,t)}function Xn(e,t,n=oa){let r=e.__wdc||=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent}return e()};if(Qn(t,r,n),n){let e=n.parent;for(;e&&e.parent;)qn(e.parent.vnode)&&Zn(r,t,n,e),e=e.parent}}function Zn(e,t,n,r){let i=Qn(t,e,r,!0);ar(()=>{c(r[t],i)},n)}function Qn(e,t,n=oa,r=!1){if(n){let i=n[e]||(n[e]=[]),a=t.__weh||=(...r)=>{qe();let i=ua(n),a=pn(t,n,e,r);return i(),Je(),a};return r?i.unshift(a):i.push(a),a}}var $n=e=>(t,n=oa)=>{(!pa||e===`sp`)&&Qn(e,(...e)=>t(...e),n)},er=$n(`bm`),tr=$n(`m`),nr=$n(`bu`),rr=$n(`u`),ir=$n(`bum`),ar=$n(`um`),or=$n(`sp`),sr=$n(`rtg`),cr=$n(`rtc`);function lr(e,t=oa){Qn(`ec`,e,t)}var ur=Symbol.for(`v-ndc`);function dr(e,t,n,r){let i,a=n&&n[r],o=d(e);if(o||h(e)){let n=o&&Wt(e),r=!1,s=!1;n&&(r=!Kt(e),s=Gt(e),e=st(e)),i=Array(e.length);for(let n=0,o=e.length;n<o;n++)i[n]=t(r?s?Xt(Yt(e[n])):Yt(e[n]):e[n],n,void 0,a&&a[n])}else if(typeof e==`number`){i=Array(e);for(let n=0;n<e;n++)i[n]=t(n+1,n,void 0,a&&a[n])}else if(_(e))if(e[Symbol.iterator])i=Array.from(e,(e,n)=>t(e,n,void 0,a&&a[n]));else{let n=Object.keys(e);i=Array(n.length);for(let r=0,o=n.length;r<o;r++){let o=n[r];i[r]=t(e[o],o,r,a&&a[r])}}else i=[];return n&&(n[r]=i),i}var fr=e=>e?fa(e)?Sa(e):fr(e.parent):null,pr=s(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>fr(e.parent),$root:e=>fr(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Sr(e),$forceUpdate:e=>e.f||=()=>{Tn(e.update)},$nextTick:e=>e.n||=Cn.bind(e.proxy),$watch:e=>Hr.bind(e)}),mr=(e,n)=>e!==t&&!e.__isScriptSetup&&u(e,n),hr={get({_:e},n){if(n===`__v_skip`)return!0;let{ctx:r,setupState:i,data:a,props:o,accessCache:s,type:c,appContext:l}=e;if(n[0]!==`$`){let e=s[n];if(e!==void 0)switch(e){case 1:return i[n];case 2:return a[n];case 4:return r[n];case 3:return o[n]}else if(mr(i,n))return s[n]=1,i[n];else if(a!==t&&u(a,n))return s[n]=2,a[n];else if(u(o,n))return s[n]=3,o[n];else if(r!==t&&u(r,n))return s[n]=4,r[n];else _r&&(s[n]=0)}let d=pr[n],f,p;if(d)return n===`$attrs`&&it(e.attrs,`get`,``),d(e);if((f=c.__cssModules)&&(f=f[n]))return f;if(r!==t&&u(r,n))return s[n]=4,r[n];if(p=l.config.globalProperties,u(p,n))return p[n]},set({_:e},n,r){let{data:i,setupState:a,ctx:o}=e;return mr(a,n)?(a[n]=r,!0):i!==t&&u(i,n)?(i[n]=r,!0):u(e.props,n)||n[0]===`$`&&n.slice(1)in e?!1:(o[n]=r,!0)},has({_:{data:e,setupState:n,accessCache:r,ctx:i,appContext:a,props:o,type:s}},c){let l;return!!(r[c]||e!==t&&c[0]!==`$`&&u(e,c)||mr(n,c)||u(o,c)||u(i,c)||u(pr,c)||u(a.config.globalProperties,c)||(l=s.__cssModules)&&l[c])},defineProperty(e,t,n){return n.get==null?u(n,`value`)&&this.set(e,t,n.value,null):e._.accessCache[t]=0,Reflect.defineProperty(e,t,n)}};function gr(e){return d(e)?e.reduce((e,t)=>(e[t]=null,e),{}):e}var _r=!0;function vr(e){let t=Sr(e),n=e.proxy,i=e.ctx;_r=!1,t.beforeCreate&&br(t.beforeCreate,e,`bc`);let{data:a,computed:o,methods:s,watch:c,provide:l,inject:u,created:f,beforeMount:p,mounted:h,beforeUpdate:g,updated:v,activated:y,deactivated:b,beforeDestroy:ee,beforeUnmount:te,destroyed:ne,unmounted:re,render:ie,renderTracked:ae,renderTriggered:oe,errorCaptured:se,serverPrefetch:ce,expose:le,inheritAttrs:ue,components:de,directives:fe,filters:pe}=t;if(u&&yr(u,i,null),s)for(let e in s){let t=s[e];m(t)&&(i[e]=t.bind(n))}if(a){let t=a.call(n,n);_(t)&&(e.data=Bt(t))}if(_r=!0,o)for(let e in o){let t=o[e],a=wa({get:m(t)?t.bind(n,n):m(t.get)?t.get.bind(n,n):r,set:!m(t)&&m(t.set)?t.set.bind(n):r});Object.defineProperty(i,e,{enumerable:!0,configurable:!0,get:()=>a.value,set:e=>a.value=e})}if(c)for(let e in c)xr(c[e],i,n,e);if(l){let e=m(l)?l.call(n):l;Reflect.ownKeys(e).forEach(t=>{Ir(t,e[t])})}f&&br(f,e,`c`);function me(e,t){d(t)?t.forEach(t=>e(t.bind(n))):t&&e(t.bind(n))}if(me(er,p),me(tr,h),me(nr,g),me(rr,v),me(Jn,y),me(Yn,b),me(lr,se),me(cr,ae),me(sr,oe),me(ir,te),me(ar,re),me(or,ce),d(le))if(le.length){let t=e.exposed||={};le.forEach(e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t,enumerable:!0})})}else e.exposed||={};ie&&e.render===r&&(e.render=ie),ue!=null&&(e.inheritAttrs=ue),de&&(e.components=de),fe&&(e.directives=fe),ce&&Hn(e)}function yr(e,t,n=r){for(let n in d(e)&&(e=Dr(e)),e){let r=e[n],i;i=_(r)?`default`in r?Lr(r.from||n,r.default,!0):Lr(r.from||n):Lr(r),Zt(i)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e}):t[n]=i}}function br(e,t,n){pn(d(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n)}function xr(e,t,n,r){let i=r.includes(`.`)?Ur(n,r):()=>n[r];if(h(e)){let n=t[e];m(n)&&Br(i,n)}else if(m(e))Br(i,e.bind(n));else if(_(e))if(d(e))e.forEach(e=>xr(e,t,n,r));else{let r=m(e.handler)?e.handler.bind(n):t[e.handler];m(r)&&Br(i,r,e)}}function Sr(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:i,optionsCache:a,config:{optionMergeStrategies:o}}=e.appContext,s=a.get(t),c;return s?c=s:!i.length&&!n&&!r?c=t:(c={},i.length&&i.forEach(e=>Cr(c,e,o,!0)),Cr(c,t,o)),_(t)&&a.set(t,c),c}function Cr(e,t,n,r=!1){let{mixins:i,extends:a}=t;for(let o in a&&Cr(e,a,n,!0),i&&i.forEach(t=>Cr(e,t,n,!0)),t)if(!(r&&o===`expose`)){let r=wr[o]||n&&n[o];e[o]=r?r(e[o],t[o]):t[o]}return e}var wr={data:Tr,props:Ar,emits:Ar,methods:kr,computed:kr,beforeCreate:Or,created:Or,beforeMount:Or,mounted:Or,beforeUpdate:Or,updated:Or,beforeDestroy:Or,beforeUnmount:Or,destroyed:Or,unmounted:Or,activated:Or,deactivated:Or,errorCaptured:Or,serverPrefetch:Or,components:kr,directives:kr,watch:jr,provide:Tr,inject:Er};function Tr(e,t){return t?e?function(){return s(m(e)?e.call(this,this):e,m(t)?t.call(this,this):t)}:t:e}function Er(e,t){return kr(Dr(e),Dr(t))}function Dr(e){if(d(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function Or(e,t){return e?[...new Set([].concat(e,t))]:t}function kr(e,t){return e?s(Object.create(null),e,t):t}function Ar(e,t){return e?d(e)&&d(t)?[...new Set([...e,...t])]:s(Object.create(null),gr(e),gr(t??{})):t}function jr(e,t){if(!e)return t;if(!t)return e;let n=s(Object.create(null),e);for(let r in t)n[r]=Or(e[r],t[r]);return n}function Mr(){return{app:null,config:{isNativeTag:i,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Nr=0;function Pr(e,t){return function(n,r=null){m(n)||(n=s({},n)),r!=null&&!_(r)&&(r=null);let i=Mr(),a=new WeakSet,o=[],c=!1,l=i.app={_uid:Nr++,_component:n,_props:r,_container:null,_context:i,_instance:null,version:Ta,get config(){return i.config},set config(e){},use(e,...t){return a.has(e)||(e&&m(e.install)?(a.add(e),e.install(l,...t)):m(e)&&(a.add(e),e(l,...t))),l},mixin(e){return i.mixins.includes(e)||i.mixins.push(e),l},component(e,t){return t?(i.components[e]=t,l):i.components[e]},directive(e,t){return t?(i.directives[e]=t,l):i.directives[e]},mount(a,o,s){if(!c){let u=l._ceVNode||Ki(n,r);return u.appContext=i,s===!0?s=`svg`:s===!1&&(s=void 0),o&&t?t(u,a):e(u,a,s),c=!0,l._container=a,a.__vue_app__=l,Sa(u.component)}},onUnmount(e){o.push(e)},unmount(){c&&(pn(o,l._instance,16),e(null,l._container),delete l._container.__vue_app__)},provide(e,t){return i.provides[e]=t,l},runWithContext(e){let t=Fr;Fr=l;try{return e()}finally{Fr=t}}};return l}}var Fr=null;function Ir(e,t){if(oa){let n=oa.provides,r=oa.parent&&oa.parent.provides;r===n&&(n=oa.provides=Object.create(r)),n[e]=t}}function Lr(e,t,n=!1){let r=sa();if(r||Fr){let i=Fr?Fr._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(i&&e in i)return i[e];if(arguments.length>1)return n&&m(t)?t.call(r&&r.proxy):t}}var Rr=Symbol.for(`v-scx`),zr=()=>Lr(Rr);function Br(e,t,n){return Vr(e,t,n)}function Vr(e,n,i=t){let{immediate:a,deep:o,flush:c,once:l}=i,u=s({},i),d=n&&a||!n&&c!==`post`,f;if(pa){if(c===`sync`){let e=zr();f=e.__watcherHandles||=[]}else if(!d){let e=()=>{};return e.stop=r,e.resume=r,e.pause=r,e}}let p=oa;u.call=(e,t,n)=>pn(e,p,t,n);let m=!1;c===`post`?u.scheduler=e=>{yi(e,p&&p.suspense)}:c!==`sync`&&(m=!0,u.scheduler=(e,t)=>{t?e():Tn(e)}),u.augmentJob=e=>{n&&(e.flags|=4),m&&(e.flags|=2,p&&(e.id=p.uid,e.i=p))};let h=un(e,n,u);return pa&&(f?f.push(h):d&&h()),h}function Hr(e,t,n){let r=this.proxy,i=h(e)?e.includes(`.`)?Ur(r,e):()=>r[e]:e.bind(r,r),a;m(t)?a=t:(a=t.handler,n=t);let o=ua(this),s=Vr(i,a.bind(r),n);return o(),s}function Ur(e,t){let n=t.split(`.`);return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}var Wr=(e,t)=>t===`modelValue`||t===`model-value`?e.modelModifiers:e[`${t}Modifiers`]||e[`${oe(t)}Modifiers`]||e[`${ce(t)}Modifiers`];function Gr(e,n,...r){if(e.isUnmounted)return;let i=e.vnode.props||t,a=r,o=n.startsWith(`update:`),s=o&&Wr(i,n.slice(7));s&&(s.trim&&(a=r.map(e=>h(e)?e.trim():e)),s.number&&(a=r.map(me)));let c,l=i[c=ue(n)]||i[c=ue(oe(n))];!l&&o&&(l=i[c=ue(ce(n))]),l&&pn(l,e,6,a);let u=i[c+`Once`];if(u){if(!e.emitted)e.emitted={};else if(e.emitted[c])return;e.emitted[c]=!0,pn(u,e,6,a)}}var Kr=new WeakMap;function qr(e,t,n=!1){let r=n?Kr:t.emitsCache,i=r.get(e);if(i!==void 0)return i;let a=e.emits,o={},c=!1;if(!m(e)){let r=e=>{let n=qr(e,t,!0);n&&(c=!0,s(o,n))};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return!a&&!c?(_(e)&&r.set(e,null),null):(d(a)?a.forEach(e=>o[e]=null):s(o,a),_(e)&&r.set(e,o),o)}function Jr(e,t){return!e||!a(t)?!1:(t=t.slice(2).replace(/Once$/,``),u(e,t[0].toLowerCase()+t.slice(1))||u(e,ce(t))||u(e,t))}function Yr(e){let{type:t,vnode:n,proxy:r,withProxy:i,propsOptions:[a],slots:s,attrs:c,emit:l,render:u,renderCache:d,props:f,data:p,setupState:m,ctx:h,inheritAttrs:g}=e,_=Pn(e),v,y;try{if(n.shapeFlag&4){let e=i||r,t=e;v=Qi(u.call(t,e,d,f,m,p,h)),y=c}else{let e=t;v=Qi(e.length>1?e(f,{attrs:c,slots:s,emit:l}):e(f,null)),y=t.props?c:Xr(c)}}catch(t){Fi.length=0,mn(t,e,1),v=Ki(Ni)}let b=v;if(y&&g!==!1){let e=Object.keys(y),{shapeFlag:t}=b;e.length&&t&7&&(a&&e.some(o)&&(y=Zr(y,a)),b=Yi(b,y,!1,!0))}return n.dirs&&(b=Yi(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&Vn(b,n.transition),v=b,Pn(_),v}var Xr=e=>{let t;for(let n in e)(n===`class`||n===`style`||a(n))&&((t||={})[n]=e[n]);return t},Zr=(e,t)=>{let n={};for(let r in e)(!o(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function Qr(e,t,n){let{props:r,children:i,component:a}=e,{props:o,children:s,patchFlag:c}=t,l=a.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?$r(r,o,l):!!o;if(c&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t];if(o[n]!==r[n]&&!Jr(l,n))return!0}}}else return(i||s)&&(!s||!s.$stable)?!0:r===o?!1:r?o?$r(r,o,l):!0:!!o;return!1}function $r(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let i=0;i<r.length;i++){let a=r[i];if(t[a]!==e[a]&&!Jr(n,a))return!0}return!1}function ei({vnode:e,parent:t},n){for(;t;){let r=t.subTree;if(r.suspense&&r.suspense.activeBranch===e&&(r.el=e.el),r===e)(e=t.vnode).el=n,t=t.parent;else break}}var ti={},ni=()=>Object.create(ti),ri=e=>Object.getPrototypeOf(e)===ti;function ii(e,t,n,r=!1){let i={},a=ni();for(let n in e.propsDefaults=Object.create(null),oi(e,t,i,a),e.propsOptions[0])n in i||(i[n]=void 0);n?e.props=r?i:Vt(i):e.type.props?e.props=i:e.props=a,e.attrs=a}function ai(e,t,n,r){let{props:i,attrs:a,vnode:{patchFlag:o}}=e,s=w(i),[c]=e.propsOptions,l=!1;if((r||o>0)&&!(o&16)){if(o&8){let n=e.vnode.dynamicProps;for(let r=0;r<n.length;r++){let o=n[r];if(Jr(e.emitsOptions,o))continue;let d=t[o];if(c)if(u(a,o))d!==a[o]&&(a[o]=d,l=!0);else{let t=oe(o);i[t]=si(c,s,t,d,e,!1)}else d!==a[o]&&(a[o]=d,l=!0)}}}else{oi(e,t,i,a)&&(l=!0);let r;for(let a in s)(!t||!u(t,a)&&((r=ce(a))===a||!u(t,r)))&&(c?n&&(n[a]!==void 0||n[r]!==void 0)&&(i[a]=si(c,s,a,void 0,e,!0)):delete i[a]);if(a!==s)for(let e in a)(!t||!u(t,e))&&(delete a[e],l=!0)}l&&at(e.attrs,`set`,``)}function oi(e,n,r,i){let[a,o]=e.propsOptions,s=!1,c;if(n)for(let t in n){if(re(t))continue;let l=n[t],d;a&&u(a,d=oe(t))?!o||!o.includes(d)?r[d]=l:(c||={})[d]=l:Jr(e.emitsOptions,t)||(!(t in i)||l!==i[t])&&(i[t]=l,s=!0)}if(o){let n=w(r),i=c||t;for(let t=0;t<o.length;t++){let s=o[t];r[s]=si(a,n,s,i[s],e,!u(i,s))}}return s}function si(e,t,n,r,i,a){let o=e[n];if(o!=null){let e=u(o,`default`);if(e&&r===void 0){let e=o.default;if(o.type!==Function&&!o.skipFactory&&m(e)){let{propsDefaults:a}=i;if(n in a)r=a[n];else{let o=ua(i);r=a[n]=e.call(null,t),o()}}else r=e;i.ce&&i.ce._setProp(n,r)}o[0]&&(a&&!e?r=!1:o[1]&&(r===``||r===ce(n))&&(r=!0))}return r}var ci=new WeakMap;function li(e,r,i=!1){let a=i?ci:r.propsCache,o=a.get(e);if(o)return o;let c=e.props,l={},f=[],p=!1;if(!m(e)){let t=e=>{p=!0;let[t,n]=li(e,r,!0);s(l,t),n&&f.push(...n)};!i&&r.mixins.length&&r.mixins.forEach(t),e.extends&&t(e.extends),e.mixins&&e.mixins.forEach(t)}if(!c&&!p)return _(e)&&a.set(e,n),n;if(d(c))for(let e=0;e<c.length;e++){let n=oe(c[e]);ui(n)&&(l[n]=t)}else if(c)for(let e in c){let t=oe(e);if(ui(t)){let n=c[e],r=l[t]=d(n)||m(n)?{type:n}:s({},n),i=r.type,a=!1,o=!0;if(d(i))for(let e=0;e<i.length;++e){let t=i[e],n=m(t)&&t.name;if(n===`Boolean`){a=!0;break}else n===`String`&&(o=!1)}else a=m(i)&&i.name===`Boolean`;r[0]=a,r[1]=o,(a||u(r,`default`))&&f.push(t)}}let h=[l,f];return _(e)&&a.set(e,h),h}function ui(e){return e[0]!==`$`&&!re(e)}var di=e=>e===`_`||e===`_ctx`||e===`$stable`,fi=e=>d(e)?e.map(Qi):[Qi(e)],pi=(e,t,n)=>{if(t._n)return t;let r=Fn((...e)=>fi(t(...e)),n);return r._c=!1,r},mi=(e,t,n)=>{let r=e._ctx;for(let n in e){if(di(n))continue;let i=e[n];if(m(i))t[n]=pi(n,i,r);else if(i!=null){let e=fi(i);t[n]=()=>e}}},hi=(e,t)=>{let n=fi(t);e.slots.default=()=>n},gi=(e,t,n)=>{for(let r in t)(n||!di(r))&&(e[r]=t[r])},_i=(e,t,n)=>{let r=e.slots=ni();if(e.vnode.shapeFlag&32){let e=t._;e?(gi(r,t,n),n&&pe(r,`_`,e,!0)):mi(t,r)}else t&&hi(e,t)},vi=(e,n,r)=>{let{vnode:i,slots:a}=e,o=!0,s=t;if(i.shapeFlag&32){let e=n._;e?r&&e===1?o=!1:gi(a,n,r):(o=!n.$stable,mi(n,a)),s=n}else n&&(hi(e,n),s={default:1});if(o)for(let e in a)!di(e)&&s[e]==null&&delete a[e]},yi=Ai;function bi(e){return xi(e)}function xi(e,i){let a=ge();a.__VUE__=!0;let{insert:o,remove:s,patchProp:c,createElement:l,createText:u,createComment:d,setText:f,setElementText:p,parentNode:m,nextSibling:h,setScopeId:g=r,insertStaticContent:_}=e,v=(e,t,n,r=null,i=null,a=null,o=void 0,s=null,c=!!t.dynamicChildren)=>{if(e===t)return;e&&!Ui(e,t)&&(r=Ee(e),Se(e,i,a,!0),e=null),t.patchFlag===-2&&(c=!1,t.dynamicChildren=null);let{type:l,ref:u,shapeFlag:d}=t;switch(l){case Mi:y(e,t,n,r);break;case Ni:b(e,t,n,r);break;case Pi:e??ee(t,n,r,o);break;case ji:de(e,t,n,r,i,a,o,s,c);break;default:d&1?ie(e,t,n,r,i,a,o,s,c):d&6?pe(e,t,n,r,i,a,o,s,c):(d&64||d&128)&&l.process(e,t,n,r,i,a,o,s,c,ke)}u!=null&&i?Wn(u,e&&e.ref,a,t||e,!t):u==null&&e&&e.ref!=null&&Wn(e.ref,null,a,e,!0)},y=(e,t,n,r)=>{if(e==null)o(t.el=u(t.children),n,r);else{let n=t.el=e.el;t.children!==e.children&&f(n,t.children)}},b=(e,t,n,r)=>{e==null?o(t.el=d(t.children||``),n,r):t.el=e.el},ee=(e,t,n,r)=>{[e.el,e.anchor]=_(e.children,t,n,r,e.el,e.anchor)},te=({el:e,anchor:t},n,r)=>{let i;for(;e&&e!==t;)i=h(e),o(e,n,r),e=i;o(t,n,r)},ne=({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=h(e),s(e),e=n;s(t)},ie=(e,t,n,r,i,a,o,s,c)=>{if(t.type===`svg`?o=`svg`:t.type===`math`&&(o=`mathml`),e==null)ae(t,n,r,i,a,o,s,c);else{let n=e.el&&e.el._isVueCE?e.el:null;try{n&&n._beginPatch(),ce(e,t,i,a,o,s,c)}finally{n&&n._endPatch()}}},ae=(e,t,n,r,i,a,s,u)=>{let d,f,{props:m,shapeFlag:h,transition:g,dirs:_}=e;if(d=e.el=l(e.type,a,m&&m.is,m),h&8?p(d,e.children):h&16&&se(e.children,d,null,r,i,Si(e,a),s,u),_&&Ln(e,null,r,`created`),oe(d,e,e.scopeId,s,r),m){for(let e in m)e!==`value`&&!re(e)&&c(d,e,null,m[e],a,r);`value`in m&&c(d,`value`,null,m.value,a),(f=m.onVnodeBeforeMount)&&na(f,r,e)}_&&Ln(e,null,r,`beforeMount`);let v=wi(i,g);v&&g.beforeEnter(d),o(d,t,n),((f=m&&m.onVnodeMounted)||v||_)&&yi(()=>{f&&na(f,r,e),v&&g.enter(d),_&&Ln(e,null,r,`mounted`)},i)},oe=(e,t,n,r,i)=>{if(n&&g(e,n),r)for(let t=0;t<r.length;t++)g(e,r[t]);if(i){let n=i.subTree;if(t===n||ki(n.type)&&(n.ssContent===t||n.ssFallback===t)){let t=i.vnode;oe(e,t,t.scopeId,t.slotScopeIds,i.parent)}}},se=(e,t,n,r,i,a,o,s,c=0)=>{for(let l=c;l<e.length;l++)v(null,e[l]=s?$i(e[l]):Qi(e[l]),t,n,r,i,a,o,s)},ce=(e,n,r,i,a,o,s)=>{let l=n.el=e.el,{patchFlag:u,dynamicChildren:d,dirs:f}=n;u|=e.patchFlag&16;let m=e.props||t,h=n.props||t,g;if(r&&Ci(r,!1),(g=h.onVnodeBeforeUpdate)&&na(g,r,n,e),f&&Ln(n,e,r,`beforeUpdate`),r&&Ci(r,!0),(m.innerHTML&&h.innerHTML==null||m.textContent&&h.textContent==null)&&p(l,``),d?le(e.dynamicChildren,d,l,r,i,Si(n,a),o):s||ye(e,n,l,null,r,i,Si(n,a),o,!1),u>0){if(u&16)ue(l,m,h,r,a);else if(u&2&&m.class!==h.class&&c(l,`class`,null,h.class,a),u&4&&c(l,`style`,m.style,h.style,a),u&8){let e=n.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t],i=m[n],o=h[n];(o!==i||n===`value`)&&c(l,n,i,o,a,r)}}u&1&&e.children!==n.children&&p(l,n.children)}else !s&&d==null&&ue(l,m,h,r,a);((g=h.onVnodeUpdated)||f)&&yi(()=>{g&&na(g,r,n,e),f&&Ln(n,e,r,`updated`)},i)},le=(e,t,n,r,i,a,o)=>{for(let s=0;s<t.length;s++){let c=e[s],l=t[s];v(c,l,c.el&&(c.type===ji||!Ui(c,l)||c.shapeFlag&198)?m(c.el):n,null,r,i,a,o,!0)}},ue=(e,n,r,i,a)=>{if(n!==r){if(n!==t)for(let t in n)!re(t)&&!(t in r)&&c(e,t,n[t],null,a,i);for(let t in r){if(re(t))continue;let o=r[t],s=n[t];o!==s&&t!==`value`&&c(e,t,s,o,a,i)}`value`in r&&c(e,`value`,n.value,r.value,a)}},de=(e,t,n,r,i,a,s,c,l)=>{let d=t.el=e?e.el:u(``),f=t.anchor=e?e.anchor:u(``),{patchFlag:p,dynamicChildren:m,slotScopeIds:h}=t;h&&(c=c?c.concat(h):h),e==null?(o(d,n,r),o(f,n,r),se(t.children||[],n,f,i,a,s,c,l)):p>0&&p&64&&m&&e.dynamicChildren?(le(e.dynamicChildren,m,n,i,a,s,c),(t.key!=null||i&&t===i.subTree)&&Ti(e,t,!0)):ye(e,t,n,f,i,a,s,c,l)},pe=(e,t,n,r,i,a,o,s,c)=>{t.slotScopeIds=s,e==null?t.shapeFlag&512?i.ctx.activate(t,n,r,o,c):me(t,n,r,i,a,o,c):he(e,t,c)},me=(e,t,n,r,i,a,o)=>{let s=e.component=aa(e,r,i);if(qn(e)&&(s.ctx.renderer=ke),ma(s,!1,o),s.asyncDep){if(i&&i.registerDep(s,_e,o),!e.el){let r=s.subTree=Ki(Ni);b(null,r,t,n),e.placeholder=r.el}}else _e(s,e,t,n,i,a,o)},he=(e,t,n)=>{let r=t.component=e.component;if(Qr(e,t,n))if(r.asyncDep&&!r.asyncResolved){ve(r,t,n);return}else r.next=t,r.update();else t.el=e.el,r.vnode=t},_e=(e,t,n,r,i,a,o)=>{let s=()=>{if(e.isMounted){let{next:t,bu:n,u:r,parent:c,vnode:l}=e;{let n=Di(e);if(n){t&&(t.el=l.el,ve(e,t,o)),n.asyncDep.then(()=>{e.isUnmounted||s()});return}}let u=t,d;Ci(e,!1),t?(t.el=l.el,ve(e,t,o)):t=l,n&&fe(n),(d=t.props&&t.props.onVnodeBeforeUpdate)&&na(d,c,t,l),Ci(e,!0);let f=Yr(e),p=e.subTree;e.subTree=f,v(p,f,m(p.el),Ee(p),e,i,a),t.el=f.el,u===null&&ei(e,f.el),r&&yi(r,i),(d=t.props&&t.props.onVnodeUpdated)&&yi(()=>na(d,c,t,l),i)}else{let o,{el:s,props:c}=t,{bm:l,m:u,parent:d,root:f,type:p}=e,m=Kn(t);if(Ci(e,!1),l&&fe(l),!m&&(o=c&&c.onVnodeBeforeMount)&&na(o,d,t),Ci(e,!0),s&&C){let t=()=>{e.subTree=Yr(e),C(s,e.subTree,e,i,null)};m&&p.__asyncHydrate?p.__asyncHydrate(s,e,t):t()}else{f.ce&&f.ce._def.shadowRoot!==!1&&f.ce._injectChildStyle(p);let o=e.subTree=Yr(e);v(null,o,n,r,e,i,a),t.el=o.el}if(u&&yi(u,i),!m&&(o=c&&c.onVnodeMounted)){let e=t;yi(()=>na(o,d,e),i)}(t.shapeFlag&256||d&&Kn(d.vnode)&&d.vnode.shapeFlag&256)&&e.a&&yi(e.a,i),e.isMounted=!0,t=n=r=null}};e.scope.on();let c=e.effect=new Me(s);e.scope.off();let l=e.update=c.run.bind(c),u=e.job=c.runIfDirty.bind(c);u.i=e,u.id=e.uid,c.scheduler=()=>Tn(u),Ci(e,!0),l()},ve=(e,t,n)=>{t.component=e;let r=e.vnode.props;e.vnode=t,e.next=null,ai(e,t.props,r,n),vi(e,t.children,n),qe(),On(e),Je()},ye=(e,t,n,r,i,a,o,s,c=!1)=>{let l=e&&e.children,u=e?e.shapeFlag:0,d=t.children,{patchFlag:f,shapeFlag:m}=t;if(f>0){if(f&128){xe(l,d,n,r,i,a,o,s,c);return}else if(f&256){be(l,d,n,r,i,a,o,s,c);return}}m&8?(u&16&&S(l,i,a),d!==l&&p(n,d)):u&16?m&16?xe(l,d,n,r,i,a,o,s,c):S(l,i,a,!0):(u&8&&p(n,``),m&16&&se(d,n,r,i,a,o,s,c))},be=(e,t,r,i,a,o,s,c,l)=>{e||=n,t||=n;let u=e.length,d=t.length,f=Math.min(u,d),p;for(p=0;p<f;p++){let n=t[p]=l?$i(t[p]):Qi(t[p]);v(e[p],n,r,null,a,o,s,c,l)}u>d?S(e,a,o,!0,!1,f):se(t,r,i,a,o,s,c,l,f)},xe=(e,t,r,i,a,o,s,c,l)=>{let u=0,d=t.length,f=e.length-1,p=d-1;for(;u<=f&&u<=p;){let n=e[u],i=t[u]=l?$i(t[u]):Qi(t[u]);if(Ui(n,i))v(n,i,r,null,a,o,s,c,l);else break;u++}for(;u<=f&&u<=p;){let n=e[f],i=t[p]=l?$i(t[p]):Qi(t[p]);if(Ui(n,i))v(n,i,r,null,a,o,s,c,l);else break;f--,p--}if(u>f){if(u<=p){let e=p+1,n=e<d?t[e].el:i;for(;u<=p;)v(null,t[u]=l?$i(t[u]):Qi(t[u]),r,n,a,o,s,c,l),u++}}else if(u>p)for(;u<=f;)Se(e[u],a,o,!0),u++;else{let m=u,h=u,g=new Map;for(u=h;u<=p;u++){let e=t[u]=l?$i(t[u]):Qi(t[u]);e.key!=null&&g.set(e.key,u)}let _,y=0,b=p-h+1,ee=!1,te=0,ne=Array(b);for(u=0;u<b;u++)ne[u]=0;for(u=m;u<=f;u++){let n=e[u];if(y>=b){Se(n,a,o,!0);continue}let i;if(n.key!=null)i=g.get(n.key);else for(_=h;_<=p;_++)if(ne[_-h]===0&&Ui(n,t[_])){i=_;break}i===void 0?Se(n,a,o,!0):(ne[i-h]=u+1,i>=te?te=i:ee=!0,v(n,t[i],r,null,a,o,s,c,l),y++)}let re=ee?Ei(ne):n;for(_=re.length-1,u=b-1;u>=0;u--){let e=h+u,n=t[e],f=t[e+1],p=e+1<d?f.el||f.placeholder:i;ne[u]===0?v(null,n,r,p,a,o,s,c,l):ee&&(_<0||u!==re[_]?x(n,r,p,2):_--)}}},x=(e,t,n,r,i=null)=>{let{el:a,type:c,transition:l,children:u,shapeFlag:d}=e;if(d&6){x(e.component.subTree,t,n,r);return}if(d&128){e.suspense.move(t,n,r);return}if(d&64){c.move(e,t,n,ke);return}if(c===ji){o(a,t,n);for(let e=0;e<u.length;e++)x(u[e],t,n,r);o(e.anchor,t,n);return}if(c===Pi){te(e,t,n);return}if(r!==2&&d&1&&l)if(r===0)l.beforeEnter(a),o(a,t,n),yi(()=>l.enter(a),i);else{let{leave:r,delayLeave:i,afterLeave:c}=l,u=()=>{e.ctx.isUnmounted?s(a):o(a,t,n)},d=()=>{a._isLeaving&&a[Bn](!0),r(a,()=>{u(),c&&c()})};i?i(a,u,d):d()}else o(a,t,n)},Se=(e,t,n,r=!1,i=!1)=>{let{type:a,props:o,ref:s,children:c,dynamicChildren:l,shapeFlag:u,patchFlag:d,dirs:f,cacheIndex:p}=e;if(d===-2&&(i=!1),s!=null&&(qe(),Wn(s,null,n,e,!0),Je()),p!=null&&(t.renderCache[p]=void 0),u&256){t.ctx.deactivate(e);return}let m=u&1&&f,h=!Kn(e),g;if(h&&(g=o&&o.onVnodeBeforeUnmount)&&na(g,t,e),u&6)Te(e.component,n,r);else{if(u&128){e.suspense.unmount(n,r);return}m&&Ln(e,null,t,`beforeUnmount`),u&64?e.type.remove(e,t,n,ke,r):l&&!l.hasOnce&&(a!==ji||d>0&&d&64)?S(l,t,n,!1,!0):(a===ji&&d&384||!i&&u&16)&&S(c,t,n),r&&Ce(e)}(h&&(g=o&&o.onVnodeUnmounted)||m)&&yi(()=>{g&&na(g,t,e),m&&Ln(e,null,t,`unmounted`)},n)},Ce=e=>{let{type:t,el:n,anchor:r,transition:i}=e;if(t===ji){we(n,r);return}if(t===Pi){ne(e);return}let a=()=>{s(n),i&&!i.persisted&&i.afterLeave&&i.afterLeave()};if(e.shapeFlag&1&&i&&!i.persisted){let{leave:t,delayLeave:r}=i,o=()=>t(n,a);r?r(e.el,a,o):o()}else a()},we=(e,t)=>{let n;for(;e!==t;)n=h(e),s(e),e=n;s(t)},Te=(e,t,n)=>{let{bum:r,scope:i,job:a,subTree:o,um:s,m:c,a:l}=e;Oi(c),Oi(l),r&&fe(r),i.stop(),a&&(a.flags|=8,Se(o,e,t,n)),s&&yi(s,t),yi(()=>{e.isUnmounted=!0},t)},S=(e,t,n,r=!1,i=!1,a=0)=>{for(let o=a;o<e.length;o++)Se(e[o],t,n,r,i)},Ee=e=>{if(e.shapeFlag&6)return Ee(e.component.subTree);if(e.shapeFlag&128)return e.suspense.next();let t=h(e.anchor||e.el),n=t&&t[Rn];return n?h(n):t},De=!1,Oe=(e,t,n)=>{e==null?t._vnode&&Se(t._vnode,null,null,!0):v(t._vnode||null,e,t,null,null,null,n),t._vnode=e,De||=(De=!0,On(),kn(),!1)},ke={p:v,um:Se,m:x,r:Ce,mt:me,mc:se,pc:ye,pbc:le,n:Ee,o:e},Ae,C;return i&&([Ae,C]=i(ke)),{render:Oe,hydrate:Ae,createApp:Pr(Oe,Ae)}}function Si({type:e,props:t},n){return n===`svg`&&e===`foreignObject`||n===`mathml`&&e===`annotation-xml`&&t&&t.encoding&&t.encoding.includes(`html`)?void 0:n}function Ci({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function wi(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Ti(e,t,n=!1){let r=e.children,i=t.children;if(d(r)&&d(i))for(let e=0;e<r.length;e++){let t=r[e],a=i[e];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=i[e]=$i(i[e]),a.el=t.el),!n&&a.patchFlag!==-2&&Ti(t,a)),a.type===Mi&&a.patchFlag!==-1&&(a.el=t.el),a.type===Ni&&!a.el&&(a.el=t.el)}}function Ei(e){let t=e.slice(),n=[0],r,i,a,o,s,c=e.length;for(r=0;r<c;r++){let c=e[r];if(c!==0){if(i=n[n.length-1],e[i]<c){t[r]=i,n.push(r);continue}for(a=0,o=n.length-1;a<o;)s=a+o>>1,e[n[s]]<c?a=s+1:o=s;c<e[n[a]]&&(a>0&&(t[r]=n[a-1]),n[a]=r)}}for(a=n.length,o=n[a-1];a-- >0;)n[a]=o,o=t[o];return n}function Di(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Di(t)}function Oi(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}var ki=e=>e.__isSuspense;function Ai(e,t){t&&t.pendingBranch?d(e)?t.effects.push(...e):t.effects.push(e):Dn(e)}var ji=Symbol.for(`v-fgt`),Mi=Symbol.for(`v-txt`),Ni=Symbol.for(`v-cmt`),Pi=Symbol.for(`v-stc`),Fi=[],Ii=null;function E(e=!1){Fi.push(Ii=e?null:[])}function Li(){Fi.pop(),Ii=Fi[Fi.length-1]||null}var Ri=1;function zi(e,t=!1){Ri+=e,e<0&&Ii&&t&&(Ii.hasOnce=!0)}function Bi(e){return e.dynamicChildren=Ri>0?Ii||n:null,Li(),Ri>0&&Ii&&Ii.push(e),e}function D(e,t,n,r,i,a){return Bi(O(e,t,n,r,i,a,!0))}function Vi(e,t,n,r,i){return Bi(Ki(e,t,n,r,i,!0))}function Hi(e){return e?e.__v_isVNode===!0:!1}function Ui(e,t){return e.type===t.type&&e.key===t.key}var Wi=({key:e})=>e??null,Gi=({ref:e,ref_key:t,ref_for:n})=>(typeof e==`number`&&(e=``+e),e==null?null:h(e)||Zt(e)||m(e)?{i:Mn,r:e,k:t,f:!!n}:e);function O(e,t=null,n=null,r=0,i=null,a=e===ji?0:1,o=!1,s=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Wi(t),ref:t&&Gi(t),scopeId:Nn,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:a,patchFlag:r,dynamicProps:i,dynamicChildren:null,appContext:null,ctx:Mn};return s?(ea(c,n),a&128&&e.normalize(c)):n&&(c.shapeFlag|=h(n)?8:16),Ri>0&&!o&&Ii&&(c.patchFlag>0||a&6)&&c.patchFlag!==32&&Ii.push(c),c}var Ki=qi;function qi(e,t=null,n=null,r=0,i=null,a=!1){if((!e||e===ur)&&(e=Ni),Hi(e)){let r=Yi(e,t,!0);return n&&ea(r,n),Ri>0&&!a&&Ii&&(r.shapeFlag&6?Ii[Ii.indexOf(e)]=r:Ii.push(r)),r.patchFlag=-2,r}if(Ca(e)&&(e=e.__vccOpts),t){t=Ji(t);let{class:e,style:n}=t;e&&!h(e)&&(t.class=x(e)),_(n)&&(qt(n)&&!d(n)&&(n=s({},n)),t.style=_e(n))}let o=h(e)?1:ki(e)?128:zn(e)?64:_(e)?4:m(e)?2:0;return O(e,t,n,r,i,o,a,!0)}function Ji(e){return e?qt(e)||ri(e)?s({},e):e:null}function Yi(e,t,n=!1,r=!1){let{props:i,ref:a,patchFlag:o,children:s,transition:c}=e,l=t?ta(i||{},t):i,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:l,key:l&&Wi(l),ref:t&&t.ref?n&&a?d(a)?a.concat(Gi(t)):[a,Gi(t)]:Gi(t):a,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==ji?o===-1?16:o|16:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Yi(e.ssContent),ssFallback:e.ssFallback&&Yi(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return c&&r&&Vn(u,c.clone(u)),u}function Xi(e=` `,t=0){return Ki(Mi,null,e,t)}function Zi(e=``,t=!1){return t?(E(),Vi(Ni,null,e)):Ki(Ni,null,e)}function Qi(e){return e==null||typeof e==`boolean`?Ki(Ni):d(e)?Ki(ji,null,e.slice()):Hi(e)?$i(e):Ki(Mi,null,String(e))}function $i(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Yi(e)}function ea(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(d(t))n=16;else if(typeof t==`object`)if(r&65){let n=t.default;n&&(n._c&&(n._d=!1),ea(e,n()),n._c&&(n._d=!0));return}else{n=32;let r=t._;!r&&!ri(t)?t._ctx=Mn:r===3&&Mn&&(Mn.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else m(t)?(t={default:t,_ctx:Mn},n=32):(t=String(t),r&64?(n=16,t=[Xi(t)]):n=8);e.children=t,e.shapeFlag|=n}function ta(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let e in r)if(e===`class`)t.class!==r.class&&(t.class=x([t.class,r.class]));else if(e===`style`)t.style=_e([t.style,r.style]);else if(a(e)){let n=t[e],i=r[e];i&&n!==i&&!(d(n)&&n.includes(i))&&(t[e]=n?[].concat(n,i):i)}else e!==``&&(t[e]=r[e])}return t}function na(e,t,n,r=null){pn(e,t,7,[n,r])}var ra=Mr(),ia=0;function aa(e,n,r){let i=e.type,a=(n?n.appContext:e.appContext)||ra,o={uid:ia++,vnode:e,type:i,parent:n,appContext:a,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new ke(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:n?n.provides:Object.create(a.provides),ids:n?n.ids:[``,0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:li(i,a),emitsOptions:qr(i,a),emit:null,emitted:null,propsDefaults:t,inheritAttrs:i.inheritAttrs,ctx:t,data:t,props:t,attrs:t,slots:t,refs:t,setupState:t,setupContext:null,suspense:r,suspenseId:r?r.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=n?n.root:o,o.emit=Gr.bind(null,o),e.ce&&e.ce(o),o}var oa=null,sa=()=>oa||Mn,ca,la;{let e=ge(),t=(t,n)=>{let r;return(r=e[t])||(r=e[t]=[]),r.push(n),e=>{r.length>1?r.forEach(t=>t(e)):r[0](e)}};ca=t(`__VUE_INSTANCE_SETTERS__`,e=>oa=e),la=t(`__VUE_SSR_SETTERS__`,e=>pa=e)}var ua=e=>{let t=oa;return ca(e),e.scope.on(),()=>{e.scope.off(),ca(t)}},da=()=>{oa&&oa.scope.off(),ca(null)};function fa(e){return e.vnode.shapeFlag&4}var pa=!1;function ma(e,t=!1,n=!1){t&&la(t);let{props:r,children:i}=e.vnode,a=fa(e);ii(e,r,a,t),_i(e,i,n||t);let o=a?ha(e,t):void 0;return t&&la(!1),o}function ha(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,hr);let{setup:r}=n;if(r){qe();let n=e.setupContext=r.length>1?xa(e):null,i=ua(e),a=fn(r,e,0,[e.props,n]),o=v(a);if(Je(),i(),(o||e.sp)&&!Kn(e)&&Hn(e),o){if(a.then(da,da),t)return a.then(n=>{ga(e,n,t)}).catch(t=>{mn(t,e,0)});e.asyncDep=a}else ga(e,a,t)}else ya(e,t)}function ga(e,t,n){m(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:_(t)&&(e.setupState=nn(t)),ya(e,n)}var _a,va;function ya(e,t,n){let i=e.type;if(!e.render){if(!t&&_a&&!i.render){let t=i.template||Sr(e).template;if(t){let{isCustomElement:n,compilerOptions:r}=e.appContext.config,{delimiters:a,compilerOptions:o}=i;i.render=_a(t,s(s({isCustomElement:n,delimiters:a},r),o))}}e.render=i.render||r,va&&va(e)}{let t=ua(e);qe();try{vr(e)}finally{Je(),t()}}}var ba={get(e,t){return it(e,`get`,``),e[t]}};function xa(e){return{attrs:new Proxy(e.attrs,ba),slots:e.slots,emit:e.emit,expose:t=>{e.exposed=t||{}}}}function Sa(e){return e.exposed?e.exposeProxy||=new Proxy(nn(Jt(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in pr)return pr[n](e)},has(e,t){return t in e||t in pr}}):e.proxy}function Ca(e){return m(e)&&`__vccOpts`in e}var wa=(e,t)=>an(e,t,pa),Ta=`3.5.25`,Ea=void 0,Da=typeof window<`u`&&window.trustedTypes;if(Da)try{Ea=Da.createPolicy(`vue`,{createHTML:e=>e})}catch{}var Oa=Ea?e=>Ea.createHTML(e):e=>e,ka=`http://www.w3.org/2000/svg`,Aa=`http://www.w3.org/1998/Math/MathML`,ja=typeof document<`u`?document:null,Ma=ja&&ja.createElement(`template`),Na={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let i=t===`svg`?ja.createElementNS(ka,e):t===`mathml`?ja.createElementNS(Aa,e):n?ja.createElement(e,{is:n}):ja.createElement(e);return e===`select`&&r&&r.multiple!=null&&i.setAttribute(`multiple`,r.multiple),i},createText:e=>ja.createTextNode(e),createComment:e=>ja.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>ja.querySelector(e),setScopeId(e,t){e.setAttribute(t,``)},insertStaticContent(e,t,n,r,i,a){let o=n?n.previousSibling:t.lastChild;if(i&&(i===a||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),n),!(i===a||!(i=i.nextSibling)););else{Ma.innerHTML=Oa(r===`svg`?`<svg>${e}</svg>`:r===`mathml`?`<math>${e}</math>`:e);let i=Ma.content;if(r===`svg`||r===`mathml`){let e=i.firstChild;for(;e.firstChild;)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},Pa=Symbol(`_vtc`);function Fa(e,t,n){let r=e[Pa];r&&(t=(t?[t,...r]:[...r]).join(` `)),t==null?e.removeAttribute(`class`):n?e.setAttribute(`class`,t):e.className=t}var Ia=Symbol(`_vod`),La=Symbol(`_vsh`),Ra=Symbol(``),za=/(?:^|;)\s*display\s*:/;function Ba(e,t,n){let r=e.style,i=h(n),a=!1;if(n&&!i){if(t)if(h(t))for(let e of t.split(`;`)){let t=e.slice(0,e.indexOf(`:`)).trim();n[t]??Ha(r,t,``)}else for(let e in t)n[e]??Ha(r,e,``);for(let e in n)e===`display`&&(a=!0),Ha(r,e,n[e])}else if(i){if(t!==n){let e=r[Ra];e&&(n+=`;`+e),r.cssText=n,a=za.test(n)}}else t&&e.removeAttribute(`style`);Ia in e&&(e[Ia]=a?r.display:``,e[La]&&(r.display=`none`))}var Va=/\s*!important$/;function Ha(e,t,n){if(d(n))n.forEach(n=>Ha(e,t,n));else if(n??=``,t.startsWith(`--`))e.setProperty(t,n);else{let r=Ga(e,t);Va.test(n)?e.setProperty(ce(r),n.replace(Va,``),`important`):e[r]=n}}var Ua=[`Webkit`,`Moz`,`ms`],Wa={};function Ga(e,t){let n=Wa[t];if(n)return n;let r=oe(t);if(r!==`filter`&&r in e)return Wa[t]=r;r=le(r);for(let n=0;n<Ua.length;n++){let i=Ua[n]+r;if(i in e)return Wa[t]=i}return t}var Ka=`http://www.w3.org/1999/xlink`;function qa(e,t,n,r,i,a=Ce(t)){r&&t.startsWith(`xlink:`)?n==null?e.removeAttributeNS(Ka,t.slice(6,t.length)):e.setAttributeNS(Ka,t,n):n==null||a&&!we(n)?e.removeAttribute(t):e.setAttribute(t,a?``:g(n)?String(n):n)}function Ja(e,t,n,r,i){if(t===`innerHTML`||t===`textContent`){n!=null&&(e[t]=t===`innerHTML`?Oa(n):n);return}let a=e.tagName;if(t===`value`&&a!==`PROGRESS`&&!a.includes(`-`)){let r=a===`OPTION`?e.getAttribute(`value`)||``:e.value,i=n==null?e.type===`checkbox`?`on`:``:String(n);(r!==i||!(`_value`in e))&&(e.value=i),n??e.removeAttribute(t),e._value=n;return}let o=!1;if(n===``||n==null){let r=typeof e[t];r===`boolean`?n=we(n):n==null&&r===`string`?(n=``,o=!0):r===`number`&&(n=0,o=!0)}try{e[t]=n}catch{}o&&e.removeAttribute(i||t)}function Ya(e,t,n,r){e.addEventListener(t,n,r)}function Xa(e,t,n,r){e.removeEventListener(t,n,r)}var Za=Symbol(`_vei`);function Qa(e,t,n,r,i=null){let a=e[Za]||(e[Za]={}),o=a[t];if(r&&o)o.value=r;else{let[n,s]=eo(t);r?Ya(e,n,a[t]=io(r,i),s):o&&(Xa(e,n,o,s),a[t]=void 0)}}var $a=/(?:Once|Passive|Capture)$/;function eo(e){let t;if($a.test(e)){t={};let n;for(;n=e.match($a);)e=e.slice(0,e.length-n[0].length),t[n[0].toLowerCase()]=!0}return[e[2]===`:`?e.slice(3):ce(e.slice(2)),t]}var to=0,no=Promise.resolve(),ro=()=>to||=(no.then(()=>to=0),Date.now());function io(e,t){let n=e=>{if(!e._vts)e._vts=Date.now();else if(e._vts<=n.attached)return;pn(ao(e,n.value),t,5,[e])};return n.value=e,n.attached=ro(),n}function ao(e,t){if(d(t)){let n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map(e=>t=>!t._stopped&&e&&e(t))}else return t}var oo=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,so=(e,t,n,r,i,s)=>{let c=i===`svg`;t===`class`?Fa(e,r,c):t===`style`?Ba(e,n,r):a(t)?o(t)||Qa(e,t,n,r,s):(t[0]===`.`?(t=t.slice(1),!0):t[0]===`^`?(t=t.slice(1),!1):co(e,t,r,c))?(Ja(e,t,r),!e.tagName.includes(`-`)&&(t===`value`||t===`checked`||t===`selected`)&&qa(e,t,r,c,s,t!==`value`)):e._isVueCE&&(/[A-Z]/.test(t)||!h(r))?Ja(e,oe(t),r,s,t):(t===`true-value`?e._trueValue=r:t===`false-value`&&(e._falseValue=r),qa(e,t,r,c))};function co(e,t,n,r){if(r)return!!(t===`innerHTML`||t===`textContent`||t in e&&oo(t)&&m(n));if(t===`spellcheck`||t===`draggable`||t===`translate`||t===`autocorrect`||t===`sandbox`&&e.tagName===`IFRAME`||t===`form`||t===`list`&&e.tagName===`INPUT`||t===`type`&&e.tagName===`TEXTAREA`)return!1;if(t===`width`||t===`height`){let t=e.tagName;if(t===`IMG`||t===`VIDEO`||t===`CANVAS`||t===`SOURCE`)return!1}return oo(t)&&h(n)?!1:t in e}var lo=e=>{let t=e.props[`onUpdate:modelValue`]||!1;return d(t)?e=>fe(t,e):t};function uo(e){e.target.composing=!0}function fo(e){let t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event(`input`)))}var po=Symbol(`_assign`);function mo(e,t,n){return t&&(e=e.trim()),n&&(e=me(e)),e}var ho={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e[po]=lo(i);let a=r||i.props&&i.props.type===`number`;Ya(e,t?`change`:`input`,t=>{t.target.composing||e[po](mo(e.value,n,a))}),(n||a)&&Ya(e,`change`,()=>{e.value=mo(e.value,n,a)}),t||(Ya(e,`compositionstart`,uo),Ya(e,`compositionend`,fo),Ya(e,`change`,fo))},mounted(e,{value:t}){e.value=t??``},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:r,trim:i,number:a}},o){if(e[po]=lo(o),e.composing)return;let s=(a||e.type===`number`)&&!/^0\d/.test(e.value)?me(e.value):e.value,c=t??``;s!==c&&(document.activeElement===e&&e.type!==`range`&&(r&&t===n||i&&e.value.trim()===c)||(e.value=c))}},go=[`ctrl`,`shift`,`alt`,`meta`],_o={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>`button`in e&&e.button!==0,middle:e=>`button`in e&&e.button!==1,right:e=>`button`in e&&e.button!==2,exact:(e,t)=>go.some(n=>e[`${n}Key`]&&!t.includes(n))},vo=(e,t)=>{let n=e._withMods||={},r=t.join(`.`);return n[r]||(n[r]=((n,...r)=>{for(let e=0;e<t.length;e++){let r=_o[t[e]];if(r&&r(n,t))return}return e(n,...r)}))},yo=s({patchProp:so},Na),bo;function xo(){return bo||=bi(yo)}var So=((...e)=>{let t=xo().createApp(...e),{mount:n}=t;return t.mount=e=>{let r=wo(e);if(!r)return;let i=t._component;!m(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent=``);let a=n(r,!1,Co(r));return r instanceof Element&&(r.removeAttribute(`v-cloak`),r.setAttribute(`data-v-app`,``)),a},t});function Co(e){if(e instanceof SVGElement)return`svg`;if(typeof MathMLElement==`function`&&e instanceof MathMLElement)return`mathml`}function wo(e){return h(e)?document.querySelector(e):e}var To=(e,t)=>{let n=e.__vccOpts||e;for(let[e,r]of t)n[e]=r;return n},Eo=[`title`],Do={class:`session-header`},Oo={class:`session-icon`},ko={key:0,class:`unread-badge`},Ao={class:`session-title-wrapper`},jo={class:`session-title`},Mo={class:`session-footer`},No={key:0,class:`session-changes`},Po={class:`changes-added`},Fo={class:`changes-removed`},Io={key:1,class:`session-status`},Lo={class:`session-metadata`},Ro={class:`session-location`},zo={class:`session-time`},Bo=To({__name:`SessionItem`,props:{session:{type:Object,required:!0},archived:{type:Boolean,default:!1},unread:{type:Boolean,default:!1}},emits:[`archive`],setup(e,{emit:t}){let n=e,r=t,i=T(!1),a=e=>{e.stopPropagation(),r(`archive`)},o=wa(()=>{if(n.session.icon)return n.session.icon;switch(n.session.status){case`Complete`:return`issue-closed`;case`Running`:return`loading codicon-modifier-spin`;case`Failed`:return`error`;default:return`circle-outline`}}),s=wa(()=>n.session.status.toLowerCase());return wa(()=>{switch(n.session.location){case`Local`:return`device-desktop`;case`Cloud`:return`cloud`;case`Background`:return`server-process`;default:return`circle-outline`}}),(t,n)=>(E(),D(`div`,{class:x([`session-item`,{unread:e.unread}]),onMouseenter:n[0]||=e=>i.value=!0,onMouseleave:n[1]||=e=>i.value=!1},[i.value?(E(),D(`button`,{key:0,class:`archive-button`,onClick:a,title:e.archived?`Unarchive`:`Archive`},[O(`i`,{class:x(e.archived?`codicon codicon-inbox`:`codicon codicon-archive`)},null,2)],8,Eo)):Zi(``,!0),O(`div`,Do,[O(`div`,Oo,[O(`i`,{class:x(`codicon codicon-${o.value} ${s.value}`)},null,2),e.unread?(E(),D(`div`,ko)):Zi(``,!0)]),O(`div`,Ao,[O(`div`,jo,S(e.session.title),1),O(`div`,Mo,[e.session.changes?(E(),D(`div`,No,[O(`span`,Po,`+`+S(e.session.changes.added),1),O(`span`,Fo,`-`+S(e.session.changes.removed),1)])):(E(),D(`div`,Io,S(e.session.status),1)),O(`div`,Lo,[O(`span`,Ro,S(e.session.location),1),n[2]||=O(`span`,{class:`separator`},`•`,-1),O(`span`,zo,S(e.session.time),1)])])])])],34))}},[[`__scopeId`,`data-v-3198c432`]]),Vo={class:`sessions-container`},Ho={class:`list-section`},Uo={class:`session-list`},Wo=[`onDragstart`,`onDragover`,`onClick`],Go={key:0,class:`list-section`},Ko={key:0,class:`session-list`},qo=[`onDragstart`,`onDragover`,`onClick`],Jo=To({__name:`SessionList`,props:{locationFilter:{type:Array,default:()=>[`All`]}},setup(e,{expose:t}){let n=e,r=Date.now(),i=T([{id:1,title:`Commenting code for clarity and readability`,status:`Complete`,icon:`issue-closed`,location:`Background`,timestamp:r-3600*1e3,unread:!1},{id:2,title:`Replacing placeholder text for inline chat`,status:`Complete`,icon:`issue-closed`,location:`Cloud`,timestamp:r-1800*1e3,changes:{added:150,removed:10},unread:!0},{id:3,title:`Refining preview layout and icons`,status:`Complete`,icon:`git-pull-request-closed`,location:`Local`,timestamp:r-60*1e3,unread:!1},{id:4,title:`Implementing authentication middleware`,status:`Running`,icon:`git-pull-request`,location:`Cloud`,timestamp:r-120*1e3,changes:{added:45,removed:5},unread:!0},{id:5,title:`Optimizing database queries`,status:`Failed`,icon:`error`,location:`Local`,timestamp:r-300*1e3,unread:!1},{id:6,title:`Adding unit tests for API endpoints`,status:`Complete`,icon:`issue-closed`,location:`Cloud`,timestamp:r-900*1e3,changes:{added:230,removed:12},unread:!0},{id:7,title:`Refactoring component structure`,status:`Complete`,icon:`issue-closed`,location:`Local`,timestamp:r-2700*1e3,changes:{added:78,removed:134},unread:!1},{id:8,title:`Building user dashboard components`,status:`Running`,icon:`loading codicon-modifier-spin`,location:`Local`,timestamp:r,unread:!1},{id:9,title:`Setting up CI/CD pipeline configuration`,status:`Running`,icon:`loading codicon-modifier-spin`,location:`Background`,timestamp:r,unread:!0}]),a=T([]),o=T(!1),s=T(!1),c=T(Date.now()),l=e=>{let t=c.value-e,n=Math.floor(t/1e3),r=Math.floor(n/60),i=Math.floor(r/60),a=Math.floor(i/24);return n<10?`now`:n<60?`${n} sec`:r<60?`${r} min`:i<24?`${i} hr`:`${a} day${a>1?`s`:``}`},u=wa(()=>{let e=i.value;n.locationFilter.includes(`All`)||(e=e.filter(e=>n.locationFilter.includes(e.location)));let t=[...e].map(e=>({...e,time:l(e.timestamp)})).sort((e,t)=>e.unread===t.unread?t.timestamp-e.timestamp:e.unread?-1:1);if(!s.value){let e=t.filter(e=>e.unread),n=t.filter(e=>!e.unread);return e.length>=3?e.slice(0,3):[...e,...n.slice(0,3-e.length)]}return t}),d=wa(()=>{let e=a.value;return n.locationFilter.includes(`All`)||(e=e.filter(e=>n.locationFilter.includes(e.location))),[...e].map(e=>({...e,time:l(e.timestamp)})).sort((e,t)=>e.unread===t.unread?t.timestamp-e.timestamp:e.unread?-1:1)}),f=T(null),p=T(null),m=T(null),h=T(null),g=e=>{console.log(`Session clicked:`,e);let t=i.value.find(t=>t.id===e.id)||a.value.find(t=>t.id===e.id);t&&(t.unread=!1)},_=()=>{o.value=!o.value},v=(e,t)=>{if(t===`active`){let t=i.value.findIndex(t=>t.id===e);if(t!==-1){let[e]=i.value.splice(t,1);a.value.push(e)}}else{let t=a.value.findIndex(t=>t.id===e);if(t!==-1){let[e]=a.value.splice(t,1);i.value.push(e)}}},y=(e,t)=>{f.value=e,h.value=t},b=(e,t,n)=>{e.preventDefault(),e.stopPropagation(),(p.value!==t||m.value!==n)&&(p.value=t,m.value=n)},ee=()=>{if(f.value!==null&&p.value!==null&&h.value&&m.value){if(h.value===m.value&&f.value!==p.value){let e=h.value===`active`?[...i.value]:[...a.value],[t]=e.splice(f.value,1);e.splice(p.value,0,t),h.value===`active`?i.value=e:a.value=e}else if(h.value!==m.value){let e=h.value===`active`?i.value:a.value,t=m.value===`active`?i.value:a.value,[n]=e.splice(f.value,1);t.splice(p.value,0,n)}}f.value=null,p.value=null,m.value=null,h.value=null},te=e=>{e.currentTarget.contains(e.relatedTarget)||(p.value=null,m.value=null)},ne=()=>{let e=i.value.filter(e=>!e.unread);if(e.length>0){let t=e[Math.floor(Math.random()*e.length)];t.unread=!0,t.timestamp=Date.now(),console.log(`Simulated new message for:`,t.title)}},re=e=>{(e.key===`n`||e.key===`N`)&&ne()},ie=(e,t)=>{let n=i.value.find(t=>t.id===e);n&&n.status===`Running`&&(n.status=`Complete`,n.icon=`issue-closed`,n.timestamp=Date.now(),n.unread=!0,n.changes={added:Math.floor(Math.random()*200)+50,removed:Math.floor(Math.random()*50)+5},console.log(`Session ${e} completed after ${t}ms`))};t({addNewSession:e=>{let t=Math.max(...i.value.map(e=>e.id))+1,n=[`Local`,`Cloud`,`Background`],r=n[Math.floor(Math.random()*n.length)],a={id:t,title:e.substring(0,50)+(e.length>50?`...`:``),status:`Running`,icon:`loading codicon-modifier-spin`,location:r,timestamp:Date.now(),unread:!0};i.value.unshift(a);let o=Math.floor(Math.random()*7e3)+8e3,s=setTimeout(()=>ie(t,o),o);oe.push(s),console.log(`New session ${t} created, will complete in ${o}ms`)}});let ae,oe=[];return tr(()=>{window.addEventListener(`keydown`,re),ae=setInterval(()=>{c.value=Date.now()},1e4);let e=i.value.find(e=>e.id===8),t=i.value.find(e=>e.id===9);if(e){let e=setTimeout(()=>ie(8,12e3),12e3);oe.push(e)}if(t){let e=setTimeout(()=>ie(9,18e3),18e3);oe.push(e)}}),ar(()=>{window.removeEventListener(`keydown`,re),ae&&clearInterval(ae),oe.forEach(e=>clearTimeout(e))}),(e,t)=>(E(),D(`div`,Vo,[O(`div`,Ho,[O(`div`,Uo,[(E(!0),D(ji,null,dr(u.value,(e,t)=>(E(),D(`div`,{key:e.id,class:x({"drag-over":p.value===t&&m.value===`active`}),draggable:`true`,onDragstart:e=>y(t,`active`),onDragover:e=>b(e,t,`active`),onDragleave:te,onDragend:ee,onClick:t=>g(e)},[Ki(Bo,{session:e,unread:e.unread,onArchive:t=>v(e.id,`active`)},null,8,[`session`,`unread`,`onArchive`])],42,Wo))),128))]),!s.value&&u.value.length>=3?(E(),D(`button`,{key:0,class:`show-all-button`,onClick:t[0]||=e=>s.value=!0},` Show all sessions `)):Zi(``,!0)]),a.value.length>0?(E(),D(`div`,Go,[O(`div`,{class:`list-header collapsible`,onClick:_},[O(`i`,{class:x(`codicon codicon-chevron-${o.value?`down`:`right`}`)},null,2),t[1]||=Xi(` Archived `,-1)]),o.value?(E(),D(`div`,Ko,[(E(!0),D(ji,null,dr(d.value,(e,t)=>(E(),D(`div`,{key:e.id,class:x({"drag-over":p.value===t&&m.value===`archived`}),draggable:`true`,onDragstart:e=>y(t,`archived`),onDragover:e=>b(e,t,`archived`),onDragleave:te,onDragend:ee,onClick:t=>g(e)},[Ki(Bo,{session:e,archived:!0,unread:e.unread,onArchive:t=>v(e.id,`archived`)},null,8,[`session`,`unread`,`onArchive`])],42,qo))),128))])):Zi(``,!0)])):Zi(``,!0)]))}},[[`__scopeId`,`data-v-b8129c9e`]]),Yo={class:`custom-dropdown`},Xo={key:0,class:`dropdown-menu`},Zo=[`onClick`],Qo={key:0,class:`codicon codicon-check`},$o={key:1,class:`item-spacer`},es={class:`item-label`},ts={key:2,class:`item-metadata`},ns=To({__name:`CustomDropdown`,props:{modelValue:String,options:Array},emits:[`update:modelValue`],setup(e,{emit:t}){let n=e,r=t,i=T(!1),a=wa(()=>n.options.find(e=>e.value===n.modelValue)),o=e=>{r(`update:modelValue`,e.value),i.value=!1},s=()=>{i.value=!i.value};return typeof window<`u`&&document.addEventListener(`click`,e=>{e.target.closest(`.custom-dropdown`)||(i.value=!1)}),(t,n)=>(E(),D(`div`,Yo,[O(`button`,{class:x([`dropdown-trigger`,{open:i.value}]),onClick:vo(s,[`stop`])},[O(`span`,null,S(a.value?.label),1),n[0]||=O(`i`,{class:`codicon codicon-chevron-down`},null,-1)],2),i.value?(E(),D(`div`,Xo,[(E(!0),D(ji,null,dr(e.options,t=>(E(),D(`div`,{key:t.value,class:x([`dropdown-item`,{selected:t.value===e.modelValue}]),onClick:e=>o(t)},[t.value===e.modelValue?(E(),D(`i`,Qo)):(E(),D(`span`,$o)),O(`span`,es,S(t.label),1),t.costMultiplier!==void 0&&t.contextLimit!==void 0?(E(),D(`span`,ts,S(t.costMultiplier)+`x • `+S(t.contextLimit)+`k `,1)):Zi(``,!0)],10,Zo))),128))])):Zi(``,!0)]))}},[[`__scopeId`,`data-v-69b61aa4`]]),rs={class:`attachment-row`},is={class:`attachments-section`},as={key:0,class:`attachment-text`},os={class:`file-name`},ss=[`onClick`],cs={class:`context-info-wrapper`},ls={class:`context-info`},us={key:0,class:`pending-context`},ds={class:`input-row`},fs=[`placeholder`],ps={class:`footer-row`},ms={class:`dropdowns`},hs={class:`action-buttons`},gs=[`disabled`],_s=[`disabled`],vs=To({__name:`ChatInputBox`,props:{modelValue:{type:String,default:``},chatMode:{type:String,default:`ask`},selectedModel:{type:String,default:`claude`},attachedFiles:{type:Array,default:()=>[]},pendingContext:{type:Number,default:0},placeholder:{type:String,default:`Describe what to build next`}},emits:[`update:modelValue`,`update:chatMode`,`update:selectedModel`,`send`,`attach`,`removeFile`,`focus`,`blur`],setup(e,{emit:t}){let n=e,r=t,i=T(null),a=T(!1),o=wa({get:()=>n.modelValue,set:e=>r(`update:modelValue`,e)}),s=wa({get:()=>n.chatMode,set:e=>r(`update:chatMode`,e)}),c=wa({get:()=>n.selectedModel,set:e=>r(`update:selectedModel`,e)}),l=wa(()=>o.value.trim()===``),u=[{value:`ask`,label:`Ask`},{value:`agent`,label:`Agent`},{value:`plan`,label:`Plan`},{value:`edit`,label:`Edit`}],d=[{value:`gpt`,label:`GPT-4`,contextLimit:32,costMultiplier:1.5},{value:`claude`,label:`Claude Sonnet 4.5`,contextLimit:64,costMultiplier:1},{value:`gemini`,label:`Gemini`,contextLimit:128,costMultiplier:.3},{value:`llama`,label:`Llama`,contextLimit:256,costMultiplier:.1}],f=()=>{i.value&&(i.value.style.height=`auto`,i.value.style.height=i.value.scrollHeight+`px`)},p=()=>{l.value||r(`send`)},m=e=>{e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),p())},h=()=>{a.value=!0,r(`focus`)},g=()=>{a.value=!1,r(`blur`)},_=()=>{r(`attach`)},v=e=>{r(`removeFile`,e)};return Br(o,()=>{Cn(()=>{f()})}),(t,n)=>(E(),D(`div`,{class:x([`chat-input-wrapper`,{focused:a.value}])},[O(`div`,rs,[O(`div`,is,[O(`button`,{class:`attachment-button`,onClick:_,title:`Attach files`},[n[3]||=O(`i`,{class:`codicon codicon-attach`},null,-1),e.attachedFiles.length===0?(E(),D(`span`,as,`Add Context...`)):Zi(``,!0)]),(E(!0),D(ji,null,dr(e.attachedFiles,(e,t)=>(E(),D(`div`,{key:t,class:`file-chip`},[n[5]||=O(`i`,{class:`codicon codicon-file`},null,-1),O(`span`,os,S(e.name),1),O(`button`,{class:`remove-file`,onClick:e=>v(t),title:`Remove`},[...n[4]||=[O(`i`,{class:`codicon codicon-close`},null,-1)]],8,ss)]))),128))]),O(`div`,cs,[O(`div`,ls,[e.pendingContext>0?(E(),D(`span`,us,`+`+S(e.pendingContext.toFixed(1))+`k`,1)):Zi(``,!0)])])]),O(`div`,ds,[In(O(`textarea`,{ref_key:`textarea`,ref:i,"onUpdate:modelValue":n[0]||=e=>o.value=e,onInput:f,onKeydown:m,onFocus:h,onBlur:g,placeholder:e.placeholder,rows:`1`,class:`chat-textarea`},null,40,fs),[[ho,o.value]])]),O(`div`,ps,[O(`div`,ms,[Ki(ns,{modelValue:s.value,"onUpdate:modelValue":n[1]||=e=>s.value=e,options:u},null,8,[`modelValue`]),Ki(ns,{modelValue:c.value,"onUpdate:modelValue":n[2]||=e=>c.value=e,options:d},null,8,[`modelValue`])]),O(`div`,hs,[O(`button`,{class:x([`forward-button`,{disabled:l.value}]),disabled:l.value,title:`Forward`},[...n[6]||=[O(`i`,{class:`codicon codicon-forward`},null,-1)]],10,gs),O(`button`,{class:x([`send-button`,{disabled:l.value}]),onClick:p,disabled:l.value,title:`Send`},[...n[7]||=[O(`i`,{class:`codicon codicon-send`},null,-1)]],10,_s)])])],2))}},[[`__scopeId`,`data-v-f4300633`]]),ys={class:`app-container`},bs={class:`panel-header`},xs={class:`header-actions`},Ss={class:`filter-container`},Cs=[`title`],ws={key:0,class:`filter-menu`},Ts=[`onClick`],Es={key:0,class:`codicon codicon-check`},Ds={class:`session-list-container`},Os={class:`chat-container`},ks=To({__name:`App`,setup(e){let t=T(``),n=T(`agent`),r=T(`claude`),i=T([]),a=T(0),o=T([`All`]),s=T(!1),c=T(!1),l=T(null),u=()=>{c.value=!0,t.value||=`Sending a new message here would start a new session & move you to the chat view`},d=()=>{c.value=!1,setTimeout(()=>{t.value===`Sending a new message here would start a new session & move you to the chat view`&&(t.value=``)},100)},f=()=>{t.value.trim()&&(l.value&&l.value.addNewSession(t.value),t.value=``,i.value=[],a.value=0)},p=()=>{let e=[{name:`App.vue`,tokens:2.5},{name:`main.js`,tokens:1.2},{name:`SessionList.vue`,tokens:3.1}],t=e[Math.floor(Math.random()*e.length)];i.value.push(t),a.value+=t.tokens},m=e=>{let t=i.value[e];a.value-=t.tokens,i.value.splice(e,1)},h=()=>{s.value=!s.value},g=e=>{if(e===`All`)o.value=[`All`];else{let t=o.value.filter(e=>e!==`All`),n=t.indexOf(e);n>-1?t.splice(n,1):t.push(e),o.value=t.length===0?[`All`]:t}s.value=!1},_=e=>o.value.includes(e),v=e=>{let t=document.querySelector(`.filter-container`);t&&!t.contains(e.target)&&(s.value=!1)};return tr(()=>{document.addEventListener(`click`,v)}),ar(()=>{document.removeEventListener(`click`,v)}),(e,c)=>(E(),D(`div`,ys,[O(`div`,bs,[c[7]||=O(`div`,{class:`header-content`},[O(`h2`,null,`AGENTS`)],-1),O(`div`,xs,[c[4]||=O(`button`,{class:`action-icon`,title:`Refresh`},[O(`i`,{class:`codicon codicon-refresh`})],-1),c[5]||=O(`button`,{class:`action-icon`,title:`Search`},[O(`i`,{class:`codicon codicon-search`})],-1),O(`div`,Ss,[O(`button`,{class:`action-icon`,onClick:h,title:`Filter: ${o.value.join(`, `)}`},[...c[3]||=[O(`i`,{class:`codicon codicon-list-filter`},null,-1)]],8,Cs),s.value?(E(),D(`div`,ws,[(E(),D(ji,null,dr([`All`,`Cloud`,`Local`,`Background`],e=>O(`div`,{key:e,class:x([`filter-option`,{selected:_(e)}]),onClick:t=>g(e)},[_(e)?(E(),D(`i`,Es)):Zi(``,!0),O(`span`,null,S(e),1)],10,Ts)),64))])):Zi(``,!0)]),c[6]||=O(`button`,{class:`action-icon`,title:`More`},[O(`i`,{class:`codicon codicon-ellipsis`})],-1)])]),O(`div`,Ds,[Ki(Jo,{ref_key:`sessionListRef`,ref:l,"location-filter":o.value},null,8,[`location-filter`])]),O(`div`,Os,[Ki(vs,{modelValue:t.value,"onUpdate:modelValue":c[0]||=e=>t.value=e,"chat-mode":n.value,"onUpdate:chatMode":c[1]||=e=>n.value=e,"selected-model":r.value,"onUpdate:selectedModel":c[2]||=e=>r.value=e,"attached-files":i.value,"pending-context":a.value,placeholder:`Start a new session...`,onSend:f,onAttach:p,onRemoveFile:m,onFocus:u,onBlur:d},null,8,[`modelValue`,`chat-mode`,`selected-model`,`attached-files`,`pending-context`])])]))}},[[`__scopeId`,`data-v-633be1af`]]),As=globalThis,js=As.ShadowRoot&&(As.ShadyCSS===void 0||As.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,Ms=Symbol(),Ns=new WeakMap,Ps=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==Ms)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(js&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=Ns.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&Ns.set(t,e))}return e}toString(){return this.cssText}},Fs=e=>new Ps(typeof e==`string`?e:e+``,void 0,Ms),k=(e,...t)=>new Ps(e.length===1?e[0]:t.reduce(((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1]),e[0]),e,Ms),Is=(e,t)=>{if(js)e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(let n of t){let t=document.createElement(`style`),r=As.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},Ls=js?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return Fs(t)})(e):e,{is:Rs,defineProperty:zs,getOwnPropertyDescriptor:Bs,getOwnPropertyNames:Vs,getOwnPropertySymbols:Hs,getPrototypeOf:Us}=Object,Ws=globalThis,Gs=Ws.trustedTypes,Ks=Gs?Gs.emptyScript:``,qs=Ws.reactiveElementPolyfillSupport,Js=(e,t)=>e,Ys={toAttribute(e,t){switch(t){case Boolean:e=e?Ks:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Xs=(e,t)=>!Rs(e,t),Zs={attribute:!0,type:String,converter:Ys,reflect:!1,useDefault:!1,hasChanged:Xs};Symbol.metadata??=Symbol(`metadata`),Ws.litPropertyMetadata??=new WeakMap;var Qs=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Zs){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&zs(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=Bs(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Zs}static _$Ei(){if(this.hasOwnProperty(Js(`elementProperties`)))return;let e=Us(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Js(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Js(`properties`))){let e=this.properties,t=[...Vs(e),...Hs(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(Ls(e))}else e!==void 0&&t.push(Ls(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Is(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?Ys:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?Ys:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n){if(e!==void 0){let r=this.constructor,i=this[e];if(n??=r.getPropertyOptions(e),!((n.hasChanged??Xs)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};Qs.elementStyles=[],Qs.shadowRootOptions={mode:`open`},Qs[Js(`elementProperties`)]=new Map,Qs[Js(`finalized`)]=new Map,qs?.({ReactiveElement:Qs}),(Ws.reactiveElementVersions??=[]).push(`2.1.1`);var $s=globalThis,ec=$s.trustedTypes,tc=ec?ec.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,nc=`$lit$`,rc=`lit$${Math.random().toFixed(9).slice(2)}$`,ic=`?`+rc,ac=`<${ic}>`,oc=document,sc=()=>oc.createComment(``),cc=e=>e===null||typeof e!=`object`&&typeof e!=`function`,lc=Array.isArray,uc=e=>lc(e)||typeof e?.[Symbol.iterator]==`function`,dc=`[ 	
\f\r]`,fc=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pc=/-->/g,mc=/>/g,hc=RegExp(`>|${dc}(?:([^\\s"'>=/]+)(${dc}*=${dc}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),gc=/'/g,_c=/"/g,vc=/^(?:script|style|textarea|title)$/i,yc=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),A=yc(1),bc=yc(2),xc=Symbol.for(`lit-noChange`),j=Symbol.for(`lit-nothing`),Sc=new WeakMap,Cc=oc.createTreeWalker(oc,129);function wc(e,t){if(!lc(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return tc===void 0?t:tc.createHTML(t)}var Tc=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=fc;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===fc?c[1]===`!--`?o=pc:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=hc):(vc.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=hc):o=mc:o===hc?c[0]===`>`?(o=i??fc,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?hc:c[3]===`"`?_c:gc):o===_c||o===gc?o=hc:o===pc||o===mc?o=fc:(o=hc,i=void 0);let d=o===hc&&e[t+1].startsWith(`/>`)?` `:``;a+=o===fc?n+ac:l>=0?(r.push(s),n.slice(0,l)+nc+n.slice(l)+rc+d):n+rc+(l===-2?t:d)}return[wc(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Ec=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Tc(t,n);if(this.el=e.createElement(l,r),Cc.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=Cc.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(nc)){let t=u[o++],n=i.getAttribute(e).split(rc),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?jc:r[1]===`?`?Mc:r[1]===`@`?Nc:Ac}),i.removeAttribute(e)}else e.startsWith(rc)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(vc.test(i.tagName)){let e=i.textContent.split(rc),t=e.length-1;if(t>0){i.textContent=ec?ec.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],sc()),Cc.nextNode(),c.push({type:2,index:++a});i.append(e[t],sc())}}}else if(i.nodeType===8)if(i.data===ic)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(rc,e+1))!==-1;)c.push({type:7,index:a}),e+=rc.length-1}a++}}static createElement(e,t){let n=oc.createElement(`template`);return n.innerHTML=e,n}};function Dc(e,t,n=e,r){if(t===xc)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=cc(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=Dc(e,i._$AS(e,t.values),i,r)),t}var Oc=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??oc).importNode(t,!0);Cc.currentNode=r;let i=Cc.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new kc(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Pc(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=Cc.nextNode(),a++)}return Cc.currentNode=oc,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},kc=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Dc(this,e,t),cc(e)?e===j||e==null||e===``?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==xc&&this._(e):e._$litType$===void 0?e.nodeType===void 0?uc(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&cc(this._$AH)?this._$AA.nextSibling.data=e:this.T(oc.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Ec.createElement(wc(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Oc(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=Sc.get(e.strings);return t===void 0&&Sc.set(e.strings,t=new Ec(e)),t}k(t){lc(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(sc()),this.O(sc()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=e.nextSibling;e.remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Ac=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=j}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=Dc(this,e,t,0),a=!cc(e)||e!==this._$AH&&e!==xc,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=Dc(this,r[n+o],t,o),s===xc&&(s=this._$AH[o]),a||=!cc(s)||s!==this._$AH[o],s===j?e=j:e!==j&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},jc=class extends Ac{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}},Mc=class extends Ac{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}},Nc=class extends Ac{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=Dc(this,e,t,0)??j)===xc)return;let n=this._$AH,r=e===j&&n!==j||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==j&&(n===j||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Pc=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){Dc(this,e)}},Fc={M:nc,P:rc,A:ic,C:1,L:Tc,R:Oc,D:uc,V:Dc,I:kc,H:Ac,N:Mc,U:Nc,B:jc,F:Pc},Ic=$s.litHtmlPolyfillSupport;Ic?.(Ec,kc),($s.litHtmlVersions??=[]).push(`3.3.1`);var Lc=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new kc(t.insertBefore(sc(),e),e,void 0,n??{})}return i._$AI(e),i},Rc=globalThis,zc=class extends Qs{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Lc(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return xc}};zc._$litElement$=!0,zc.finalized=!0,Rc.litElementHydrateSupport?.({LitElement:zc});var Bc=Rc.litElementPolyfillSupport;Bc?.({LitElement:zc}),(Rc.litElementVersions??=[]).push(`4.2.1`);var Vc={attribute:!0,type:String,converter:Ys,reflect:!1,hasChanged:Xs},Hc=(e=Vc,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e)}}throw Error(`Unsupported decorator location: `+r)};function M(e){return(t,n)=>typeof n==`object`?Hc(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function N(e){return M({...e,state:!0,attribute:!1})}var Uc=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function P(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return Uc(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return Uc(n,r,{get(){return a(this)}})}}var Wc;function Gc(e){return(t,n)=>Uc(t,n,{get(){return(this.renderRoot??(Wc??=document.createDocumentFragment())).querySelectorAll(e)}})}function Kc(e){return(t,n)=>{let{slot:r,selector:i}=e??{},a=`slot`+(r?`[name=${r}]`:`:not([name])`);return Uc(t,n,{get(){let t=(this.renderRoot?.querySelector(a))?.assignedElements(e)??[];return i===void 0?t:t.filter((e=>e.matches(i)))}})}}function qc(e){return(t,n)=>{let{slot:r}=e??{},i=`slot`+(r?`[name=${r}]`:`:not([name])`);return Uc(t,n,{get(){return(this.renderRoot?.querySelector(i))?.assignedNodes(e)??[]}})}}var Jc=`2.3.1`,Yc=`__vscodeElements_disableRegistryWarning__`,F=class extends zc{get version(){return Jc}};const I=e=>t=>{if(!customElements.get(e)){customElements.define(e,t);return}if(Yc in window)return;let n=document.createElement(e)?.version,r=``;n?n===Jc?r+=`is already registered by the same version of VSCode Elements (${Jc}).`:(r+=`is already registered by a different version of VSCode Elements. `,r+=`This version is "${Jc}", while the other one is "${n}".`):r+=`is already registered by an unknown custom element handler class.`,console.warn(`[VSCode Elements] ${e} ${r}\nTo suppress this warning, set window.${Yc} to true`)};var L=k`
  :host([hidden]) {
    display: none;
  }

  :host([disabled]),
  :host(:disabled) {
    cursor: not-allowed;
    opacity: 0.4;
    pointer-events: none;
  }
`;function Xc(){return navigator.userAgent.indexOf(`Linux`)>-1?`system-ui, "Ubuntu", "Droid Sans", sans-serif`:navigator.userAgent.indexOf(`Mac`)>-1?`-apple-system, BlinkMacSystemFont, sans-serif`:navigator.userAgent.indexOf(`Windows`)>-1?`"Segoe WPC", "Segoe UI", sans-serif`:`sans-serif`}var Zc=[L,k`
    :host {
      display: inline-block;
    }

    .root {
      background-color: var(--vscode-badge-background, #616161);
      border: 1px solid var(--vscode-contrastBorder, transparent);
      border-radius: 2px;
      box-sizing: border-box;
      color: var(--vscode-badge-foreground, #f8f8f8);
      display: block;
      font-family: var(--vscode-font-family, ${Fs(Xc())});
      font-size: 11px;
      font-weight: 400;
      line-height: 14px;
      min-width: 18px;
      padding: 2px 3px;
      text-align: center;
      white-space: nowrap;
    }

    :host([variant='counter']) .root {
      border-radius: 11px;
      line-height: 11px;
      min-height: 18px;
      min-width: 18px;
      padding: 3px 6px;
    }

    :host([variant='activity-bar-counter']) .root {
      background-color: var(--vscode-activityBarBadge-background, #0078d4);
      border-radius: 20px;
      color: var(--vscode-activityBarBadge-foreground, #ffffff);
      font-size: 9px;
      font-weight: 600;
      line-height: 16px;
      padding: 0 4px;
    }

    :host([variant='tab-header-counter']) .root {
      background-color: var(--vscode-activityBarBadge-background, #0078d4);
      border-radius: 10px;
      color: var(--vscode-activityBarBadge-foreground, #ffffff);
      line-height: 10px;
      min-height: 16px;
      min-width: 16px;
      padding: 3px 5px;
    }
  `],Qc=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},$c=class extends F{constructor(){super(...arguments),this.variant=`default`}render(){return A`<div class="root"><slot></slot></div>`}};$c.styles=Zc,Qc([M({reflect:!0})],$c.prototype,`variant`,void 0),$c=Qc([I(`vscode-badge`)],$c);var el={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},tl=e=>(...t)=>({_$litDirective$:e,values:t}),nl=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},R=tl(class extends nl{constructor(e){if(super(e),e.type!==el.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter((t=>e[t])).join(` `)+` `}update(e,[t]){if(this.st===void 0){for(let n in this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter((e=>e!==``)))),t)t[n]&&!this.nt?.has(n)&&this.st.add(n);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return xc}}),z=e=>e??j;const rl=tl(class extends nl{constructor(e){if(super(e),this._prevProperties={},e.type!==el.PROPERTY||e.name!==`style`)throw Error("The `stylePropertyMap` directive must be used in the `style` property")}update(e,[t]){return Object.entries(t).forEach(([t,n])=>{this._prevProperties[t]!==n&&(t.startsWith(`--`)?e.element.style.setProperty(t,n):e.element.style[t]=n,this._prevProperties[t]=n)}),xc}render(e){return xc}});var il=[L,k`
    :host {
      color: var(--vscode-icon-foreground, #cccccc);
      display: inline-block;
    }

    .codicon[class*='codicon-'] {
      display: block;
    }

    .icon,
    .button {
      background-color: transparent;
      display: block;
      padding: 0;
    }

    .button {
      border-color: transparent;
      border-style: solid;
      border-width: 1px;
      border-radius: 5px;
      color: currentColor;
      cursor: pointer;
      padding: 2px;
    }

    .button:hover {
      background-color: var(
        --vscode-toolbar-hoverBackground,
        rgba(90, 93, 94, 0.31)
      );
    }

    .button:active {
      background-color: var(
        --vscode-toolbar-activeBackground,
        rgba(99, 102, 103, 0.31)
      );
    }

    .button:focus {
      outline: none;
    }

    .button:focus-visible {
      border-color: var(--vscode-focusBorder, #0078d4);
    }

    @keyframes icon-spin {
      100% {
        transform: rotate(360deg);
      }
    }

    .spin {
      animation-name: icon-spin;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
  `],al=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ol,sl=ol=class extends F{constructor(){super(...arguments),this.label=``,this.name=``,this.size=16,this.spin=!1,this.spinDuration=1.5,this.actionIcon=!1,this._onButtonClick=e=>{this.dispatchEvent(new CustomEvent(`vsc-click`,{detail:{originalEvent:e}}))}}connectedCallback(){super.connectedCallback();let{href:e,nonce:t}=this._getStylesheetConfig();ol.stylesheetHref=e,ol.nonce=t}_getStylesheetConfig(){let e=document.getElementById(`vscode-codicon-stylesheet`),t=e?.getAttribute(`href`)||void 0,n=e?.nonce||void 0;if(!e){let e="[VSCode Elements] To use the Icon component, the codicons.css file must be included in the page with the id `vscode-codicon-stylesheet`! ";e+=`See https://vscode-elements.github.io/components/icon/ for more details.`,console.warn(e)}return{nonce:n,href:t}}render(){let{stylesheetHref:e,nonce:t}=ol,n=A`<span
      class=${R({codicon:!0,[`codicon-`+this.name]:!0,spin:this.spin})}
      .style=${rl({animationDuration:String(this.spinDuration)+`s`,fontSize:this.size+`px`,height:this.size+`px`,width:this.size+`px`})}
    ></span>`,r=this.actionIcon?A` <button
          class="button"
          @click=${this._onButtonClick}
          aria-label=${this.label}
        >
          ${n}
        </button>`:A` <span class="icon" aria-hidden="true" role="presentation"
          >${n}</span
        >`;return A`
      <link
        rel="stylesheet"
        href=${z(e)}
        nonce=${z(t)}
      >
      ${r}
    `}};sl.styles=il,sl.stylesheetHref=``,sl.nonce=``,al([M()],sl.prototype,`label`,void 0),al([M({type:String})],sl.prototype,`name`,void 0),al([M({type:Number})],sl.prototype,`size`,void 0),al([M({type:Boolean,reflect:!0})],sl.prototype,`spin`,void 0),al([M({type:Number,attribute:`spin-duration`})],sl.prototype,`spinDuration`,void 0),al([M({type:Boolean,reflect:!0,attribute:`action-icon`})],sl.prototype,`actionIcon`,void 0),sl=ol=al([I(`vscode-icon`)],sl);var cl=[L,k`
    :host {
      cursor: pointer;
      display: inline-block;
      width: auto;
    }

    .base {
      align-items: center;
      background-color: var(--vscode-button-background, #0078d4);
      border-bottom-left-radius: var(--vsc-border-left-radius, 2px);
      border-bottom-right-radius: var(--vsc-border-right-radius, 2px);
      border-bottom-width: 1px;
      border-color: var(--vscode-button-border, transparent);
      border-left-width: var(--vsc-border-left-width, 1px);
      border-right-width: var(--vsc-border-right-width, 1px);
      border-style: solid;
      border-top-left-radius: var(--vsc-border-left-radius, 2px);
      border-top-right-radius: var(--vsc-border-right-radius, 2px);
      border-top-width: 1px;
      box-sizing: border-box;
      color: var(--vscode-button-foreground, #ffffff);
      display: flex;
      font-family: var(--vscode-font-family, ${Fs(Xc())});
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      height: 100%;
      justify-content: center;
      line-height: 22px;
      overflow: hidden;
      padding: 1px calc(13px + var(--vsc-base-additional-right-padding, 0px))
        1px 13px;
      position: relative;
      user-select: none;
      white-space: nowrap;
      width: 100%;
    }

    .base:after {
      background-color: var(
        --vscode-button-separator,
        rgba(255, 255, 255, 0.4)
      );
      content: var(--vsc-base-after-content);
      display: var(--vsc-divider-display, none);
      position: absolute;
      right: 0;
      top: 4px;
      bottom: 4px;
      width: 1px;
    }

    :host([secondary]) .base:after {
      background-color: var(--vscode-button-secondaryForeground, #cccccc);
      opacity: 0.4;
    }

    :host([secondary]) .base {
      color: var(--vscode-button-secondaryForeground, #cccccc);
      background-color: var(--vscode-button-secondaryBackground, #313131);
      border-color: var(
        --vscode-button-border,
        var(--vscode-button-secondaryBackground, rgba(255, 255, 255, 0.07))
      );
    }

    :host([disabled]) {
      cursor: default;
      opacity: 0.4;
      pointer-events: none;
    }

    :host(:hover) .base {
      background-color: var(--vscode-button-hoverBackground, #026ec1);
    }

    :host([disabled]:hover) .base {
      background-color: var(--vscode-button-background, #0078d4);
    }

    :host([secondary]:hover) .base {
      background-color: var(--vscode-button-secondaryHoverBackground, #3c3c3c);
    }

    :host([secondary][disabled]:hover) .base {
      background-color: var(--vscode-button-secondaryBackground, #313131);
    }

    :host(:focus),
    :host(:active) {
      outline: none;
    }

    :host(:focus) .base {
      background-color: var(--vscode-button-hoverBackground, #026ec1);
      outline: 1px solid var(--vscode-focusBorder, #0078d4);
      outline-offset: 2px;
    }

    :host([disabled]:focus) .base {
      background-color: var(--vscode-button-background, #0078d4);
      outline: 0;
    }

    :host([secondary]:focus) .base {
      background-color: var(--vscode-button-secondaryHoverBackground, #3c3c3c);
    }

    :host([secondary][disabled]:focus) .base {
      background-color: var(--vscode-button-secondaryBackground, #313131);
    }

    ::slotted(*) {
      display: inline-block;
      margin-left: 4px;
      margin-right: 4px;
    }

    ::slotted(*:first-child) {
      margin-left: 0;
    }

    ::slotted(*:last-child) {
      margin-right: 0;
    }

    ::slotted(vscode-icon) {
      color: inherit;
    }

    .content {
      display: flex;
      position: relative;
      width: 100%;
      height: 100%;
      padding: 1px 13px;
    }

    :host(:empty) .base,
    .base.icon-only {
      min-height: 24px;
      min-width: 26px;
      padding: 1px 4px;
    }

    slot {
      align-items: center;
      display: flex;
      height: 100%;
    }

    .has-content-before slot[name='content-before'] {
      margin-right: 4px;
    }

    .has-content-after slot[name='content-after'] {
      margin-left: 4px;
    }

    .icon,
    .icon-after {
      color: inherit;
      display: block;
    }

    :host(:not(:empty)) .icon {
      margin-right: 3px;
    }

    :host(:not(:empty)) .icon-after,
    :host([icon]) .icon-after {
      margin-left: 3px;
    }
  `],B=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},V=class extends F{get form(){return this._internals.form}constructor(){super(),this.autofocus=!1,this.tabIndex=0,this.secondary=!1,this.role=`button`,this.disabled=!1,this.icon=``,this.iconSpin=!1,this.iconAfter=``,this.iconAfterSpin=!1,this.focused=!1,this.name=void 0,this.iconOnly=!1,this.type=`button`,this.value=``,this._prevTabindex=0,this._hasContentBefore=!1,this._hasContentAfter=!1,this._handleFocus=()=>{this.focused=!0},this._handleBlur=()=>{this.focused=!1},this.addEventListener(`keydown`,this._handleKeyDown.bind(this)),this.addEventListener(`click`,this._handleClick.bind(this)),this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.autofocus&&(this.tabIndex<0&&(this.tabIndex=0),this.updateComplete.then(()=>{this.focus(),this.requestUpdate()})),this.addEventListener(`focus`,this._handleFocus),this.addEventListener(`blur`,this._handleBlur)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(`focus`,this._handleFocus),this.removeEventListener(`blur`,this._handleBlur)}update(e){super.update(e),e.has(`value`)&&this._internals.setFormValue(this.value),e.has(`disabled`)&&(this.disabled?(this._prevTabindex=this.tabIndex,this.tabIndex=-1):this.tabIndex=this._prevTabindex)}_executeAction(){this.type===`submit`&&this._internals.form&&this._internals.form.requestSubmit(),this.type===`reset`&&this._internals.form&&this._internals.form.reset()}_handleKeyDown(e){if((e.key===`Enter`||e.key===` `)&&!this.hasAttribute(`disabled`)){let e=new MouseEvent(`click`,{bubbles:!0,cancelable:!0});e.synthetic=!0,this.dispatchEvent(e),this._executeAction()}}_handleClick(e){e.synthetic||this.hasAttribute(`disabled`)||this._executeAction()}_handleSlotChange(e){let t=e.target;t.name===`content-before`&&(this._hasContentBefore=t.assignedElements().length>0),t.name===`content-after`&&(this._hasContentAfter=t.assignedElements().length>0)}render(){let e=this.icon!==``,t=this.iconAfter!==``,n={base:!0,"icon-only":this.iconOnly,"has-content-before":this._hasContentBefore,"has-content-after":this._hasContentAfter},r=e?A`<vscode-icon
          name=${this.icon}
          ?spin=${this.iconSpin}
          spin-duration=${z(this.iconSpinDuration)}
          class="icon"
        ></vscode-icon>`:j,i=t?A`<vscode-icon
          name=${this.iconAfter}
          ?spin=${this.iconAfterSpin}
          spin-duration=${z(this.iconAfterSpinDuration)}
          class="icon-after"
        ></vscode-icon>`:j;return A`
      <div
        class=${R(n)}
        part="base"
        @slotchange=${this._handleSlotChange}
      >
        <slot name="content-before"></slot>
        ${r}
        <slot></slot>
        ${i}
        <slot name="content-after"></slot>
      </div>
    `}};V.styles=cl,V.formAssociated=!0,B([M({type:Boolean,reflect:!0})],V.prototype,`autofocus`,void 0),B([M({type:Number,reflect:!0})],V.prototype,`tabIndex`,void 0),B([M({type:Boolean,reflect:!0})],V.prototype,`secondary`,void 0),B([M({reflect:!0})],V.prototype,`role`,void 0),B([M({type:Boolean,reflect:!0})],V.prototype,`disabled`,void 0),B([M()],V.prototype,`icon`,void 0),B([M({type:Boolean,reflect:!0,attribute:`icon-spin`})],V.prototype,`iconSpin`,void 0),B([M({type:Number,reflect:!0,attribute:`icon-spin-duration`})],V.prototype,`iconSpinDuration`,void 0),B([M({attribute:`icon-after`})],V.prototype,`iconAfter`,void 0),B([M({type:Boolean,reflect:!0,attribute:`icon-after-spin`})],V.prototype,`iconAfterSpin`,void 0),B([M({type:Number,reflect:!0,attribute:`icon-after-spin-duration`})],V.prototype,`iconAfterSpinDuration`,void 0),B([M({type:Boolean,reflect:!0})],V.prototype,`focused`,void 0),B([M({type:String,reflect:!0})],V.prototype,`name`,void 0),B([M({type:Boolean,reflect:!0,attribute:`icon-only`})],V.prototype,`iconOnly`,void 0),B([M({reflect:!0})],V.prototype,`type`,void 0),B([M()],V.prototype,`value`,void 0),B([N()],V.prototype,`_hasContentBefore`,void 0),B([N()],V.prototype,`_hasContentAfter`,void 0),V=B([I(`vscode-button`)],V);var ll=[L,k`
    :host {
      display: inline-block;
    }

    .root {
      align-items: stretch;
      display: flex;
      width: 100%;
    }

    ::slotted(vscode-button:not(:first-child)) {
      --vsc-border-left-width: 0;
      --vsc-border-left-radius: 0;
      --vsc-border-left-width: 0;
    }

    ::slotted(vscode-button:not(:last-child)) {
      --vsc-divider-display: block;
      --vsc-base-additional-right-padding: 1px;
      --vsc-base-after-content: '';
      --vsc-border-right-width: 0;
      --vsc-border-right-radius: 0;
      --vsc-border-right-width: 0;
    }

    ::slotted(vscode-button:focus) {
      z-index: 1;
    }

    ::slotted(vscode-button:not(:empty)) {
      width: 100%;
    }
  `],ul=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},dl=class extends F{render(){return A`<div class="root"><slot></slot></div>`}};dl.styles=ll,dl=ul([I(`vscode-button-group`)],dl);var fl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},pl=class extends F{constructor(){super(),this.focused=!1,this._prevTabindex=0,this._handleFocus=()=>{this.focused=!0},this._handleBlur=()=>{this.focused=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener(`focus`,this._handleFocus),this.addEventListener(`blur`,this._handleBlur)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(`focus`,this._handleFocus),this.removeEventListener(`blur`,this._handleBlur)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===`disabled`&&this.hasAttribute(`disabled`)?(this._prevTabindex=this.tabIndex,this.tabIndex=-1):e===`disabled`&&!this.hasAttribute(`disabled`)&&(this.tabIndex=this._prevTabindex)}};fl([M({type:Boolean,reflect:!0})],pl.prototype,`focused`,void 0);var ml=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a};const hl=e=>{class t extends e{constructor(){super(...arguments),this._label=``,this._slottedText=``}set label(e){this._label=e,this._slottedText===``&&this.setAttribute(`aria-label`,e)}get label(){return this._label}_handleSlotChange(){this._slottedText=this.textContent?this.textContent.trim():``,this._slottedText!==``&&this.setAttribute(`aria-label`,this._slottedText)}_renderLabelAttribute(){return this._slottedText===``?A`<span class="label-attr">${this._label}</span>`:A`${j}`}}return ml([M()],t.prototype,`label`,null),t};var gl=[k`
    :host {
      display: inline-block;
    }

    :host(:focus) {
      outline: none;
    }

    :host([disabled]) {
      opacity: 0.4;
    }

    .wrapper {
      color: var(--vscode-foreground, #cccccc);
      cursor: pointer;
      display: block;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      line-height: 18px;
      margin-bottom: 4px;
      margin-top: 4px;
      min-height: 18px;
      position: relative;
      user-select: none;
    }

    :host([disabled]) .wrapper {
      cursor: default;
    }

    input {
      clip: rect(1px, 1px, 1px, 1px);
      height: 1px;
      left: 9px;
      margin: 0;
      overflow: hidden;
      position: absolute;
      top: 17px;
      white-space: nowrap;
      width: 1px;
    }

    .icon {
      align-items: center;
      background-color: var(--vscode-settings-checkboxBackground, #313131);
      background-size: 16px;
      border: 1px solid var(--vscode-settings-checkboxBorder, #3c3c3c);
      box-sizing: border-box;
      color: var(--vscode-settings-checkboxForeground, #cccccc);
      display: flex;
      height: 18px;
      justify-content: center;
      left: 0;
      margin-left: 0;
      margin-right: 9px;
      padding: 0;
      pointer-events: none;
      position: absolute;
      top: 0;
      width: 18px;
    }

    .icon.before-empty-label {
      margin-right: 0;
    }

    .label {
      cursor: pointer;
      display: block;
      min-height: 18px;
      min-width: 18px;
    }

    .label-inner {
      display: block;
      opacity: 0.9;
      padding-left: 27px;
    }

    .label-inner.empty {
      padding-left: 0;
    }

    :host([disabled]) .label {
      cursor: default;
    }
  `],_l=[L,gl,k`
    :host(:invalid) .icon,
    :host([invalid]) .icon {
      background-color: var(--vscode-inputValidation-errorBackground, #5a1d1d);
      border-color: var(--vscode-inputValidation-errorBorder, #be1100);
    }

    .icon {
      border-radius: 3px;
    }

    .indeterminate-icon {
      background-color: currentColor;
      position: absolute;
      height: 1px;
      width: 12px;
    }

    :host(:focus):host(:not([disabled])) .icon {
      outline: 1px solid var(--vscode-focusBorder, #0078d4);
      outline-offset: -1px;
    }

    /* Toggle appearance */
    :host([toggle]) .icon {
      /* Track */
      width: 36px;
      height: 20px;
      border-radius: 999px;
      background-color: var(--vscode-button-secondaryBackground, #313131);
      border-color: var(--vscode-button-border, transparent);
      justify-content: flex-start;
      position: absolute;
    }

    :host(:focus):host([toggle]):host(:not([disabled])) .icon {
      outline-offset: 2px;
    }

    /* Reserve space for the wider toggle track so text doesn't overlap */
    :host([toggle]) .label-inner {
      padding-left: 45px; /* 36px track + 9px spacing */
    }

    :host([toggle]) .label {
      min-height: 20px;
    }

    :host([toggle]) .wrapper {
      min-height: 20px;
      line-height: 20px;
    }

    :host([toggle]) .thumb {
      /* Thumb */
      box-sizing: border-box;
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: var(--vscode-button-secondaryForeground, #cccccc);
      margin-left: 1px;
      transition: transform 120ms ease-in-out;
    }

    :host([toggle][checked]) .icon {
      background-color: var(--vscode-button-background, #04395e);
      border-color: var(--vscode-button-border, transparent);
    }

    :host([toggle][checked]) .thumb {
      transform: translateX(16px);
      background-color: var(--vscode-button-foreground, #ffffff);
    }

    :host([toggle]):host(:invalid) .icon {
      background-color: var(--vscode-inputValidation-errorBackground, #5a1d1d);
      border-color: var(--vscode-inputValidation-errorBorder, #be1100);
    }

    :host([toggle]):host(:invalid) .thumb {
      background-color: var(--vscode-inputValidation-errorBorder, #be1100);
    }

    :host([toggle]) .check-icon,
    :host([toggle]) .indeterminate-icon {
      display: none;
    }

    :host([toggle]:focus):host(:not([disabled])) .icon {
      outline: 1px solid var(--vscode-focusBorder, #0078d4);
      outline-offset: -1px;
    }
  `],vl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},yl=class extends hl(pl){set checked(e){this._checked=e,this._manageRequired(),this.requestUpdate()}get checked(){return this._checked}set required(e){this._required=e,this._manageRequired(),this.requestUpdate()}get required(){return this._required}get form(){return this._internals.form}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}constructor(){super(),this.autofocus=!1,this._checked=!1,this.defaultChecked=!1,this.invalid=!1,this.name=void 0,this.toggle=!1,this.value=``,this.disabled=!1,this.indeterminate=!1,this._required=!1,this.type=`checkbox`,this._handleClick=e=>{e.preventDefault(),!this.disabled&&this._toggleState()},this._handleKeyDown=e=>{!this.disabled&&(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),e.key===` `&&this._toggleState(),e.key===`Enter`&&this._internals.form?.requestSubmit())},this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.addEventListener(`keydown`,this._handleKeyDown),this.updateComplete.then(()=>{this._manageRequired(),this._setActualFormValue()})}disconnectedCallback(){this.removeEventListener(`keydown`,this._handleKeyDown)}formResetCallback(){this.checked=this.defaultChecked}formStateRestoreCallback(e,t){e&&(this.checked=!0)}_setActualFormValue(){let e=``;e=this.checked?this.value?this.value:`on`:null,this._internals.setFormValue(e)}_toggleState(){this.checked=!this.checked,this.indeterminate=!1,this._setActualFormValue(),this._manageRequired(),this.dispatchEvent(new Event(`change`,{bubbles:!0}))}_manageRequired(){!this.checked&&this.required?this._internals.setValidity({valueMissing:!0},`Please check this box if you want to proceed.`,this._inputEl??void 0):this._internals.setValidity({})}render(){let e=R({icon:!0,checked:this.checked,indeterminate:this.indeterminate}),t=R({"label-inner":!0}),n=A`<svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      class="check-icon"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
      />
    </svg>`,r=this.checked&&!this.indeterminate?n:j,i=this.indeterminate?A`<span class="indeterminate-icon"></span>`:j,a=this.toggle?A`<span class="thumb"></span>`:A`${i}${r}`;return A`
      <div class="wrapper">
        <input
          ?autofocus=${this.autofocus}
          id="input"
          class="checkbox"
          type="checkbox"
          ?checked=${this.checked}
          role=${z(this.toggle?`switch`:void 0)}
          aria-checked=${z(this.toggle?this.checked?`true`:`false`:void 0)}
          value=${this.value}
        >
        <div class=${e}>${a}</div>
        <label for="input" class="label" @click=${this._handleClick}>
          <span class=${t}>
            ${this._renderLabelAttribute()}
            <slot @slotchange=${this._handleSlotChange}></slot>
          </span>
        </label>
      </div>
    `}};yl.styles=_l,yl.formAssociated=!0,yl.shadowRootOptions={...zc.shadowRootOptions,delegatesFocus:!0},vl([M({type:Boolean,reflect:!0})],yl.prototype,`autofocus`,void 0),vl([M({type:Boolean,reflect:!0})],yl.prototype,`checked`,null),vl([M({type:Boolean,reflect:!0,attribute:`default-checked`})],yl.prototype,`defaultChecked`,void 0),vl([M({type:Boolean,reflect:!0})],yl.prototype,`invalid`,void 0),vl([M({reflect:!0})],yl.prototype,`name`,void 0),vl([M({type:Boolean,reflect:!0})],yl.prototype,`toggle`,void 0),vl([M()],yl.prototype,`value`,void 0),vl([M({type:Boolean,reflect:!0})],yl.prototype,`disabled`,void 0),vl([M({type:Boolean,reflect:!0})],yl.prototype,`indeterminate`,void 0),vl([M({type:Boolean,reflect:!0})],yl.prototype,`required`,null),vl([M()],yl.prototype,`type`,void 0),vl([P(`#input`)],yl.prototype,`_inputEl`,void 0),yl=vl([I(`vscode-checkbox`)],yl);var bl=[L,k`
    :host {
      display: block;
    }

    .wrapper {
      display: flex;
      flex-wrap: wrap;
    }

    :host([variant='vertical']) .wrapper {
      display: block;
    }

    ::slotted(vscode-checkbox) {
      margin-right: 20px;
    }

    ::slotted(vscode-checkbox:last-child) {
      margin-right: 0;
    }

    :host([variant='vertical']) ::slotted(vscode-checkbox) {
      display: block;
      margin-bottom: 15px;
    }

    :host([variant='vertical']) ::slotted(vscode-checkbox:last-child) {
      margin-bottom: 0;
    }
  `],xl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Sl=class extends F{constructor(){super(...arguments),this.role=`group`,this.variant=`horizontal`}render(){return A`
      <div class="wrapper">
        <slot></slot>
      </div>
    `}};Sl.styles=bl,xl([M({reflect:!0})],Sl.prototype,`role`,void 0),xl([M({reflect:!0})],Sl.prototype,`variant`,void 0),Sl=xl([I(`vscode-checkbox-group`)],Sl);var Cl=[L,k`
    .collapsible {
      background-color: var(--vscode-sideBar-background, #181818);
    }

    .collapsible-header {
      align-items: center;
      background-color: var(--vscode-sideBarSectionHeader-background, #181818);
      cursor: pointer;
      display: flex;
      height: 22px;
      line-height: 22px;
      user-select: none;
    }

    .collapsible-header:focus {
      opacity: 1;
      outline-offset: -1px;
      outline-style: solid;
      outline-width: 1px;
      outline-color: var(--vscode-focusBorder, #0078d4);
    }

    .title {
      color: var(--vscode-sideBarTitle-foreground, #cccccc);
      display: block;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: 11px;
      font-weight: 700;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .title .description {
      font-weight: 400;
      margin-left: 10px;
      text-transform: none;
      opacity: 0.6;
    }

    .header-icon {
      color: var(--vscode-icon-foreground, #cccccc);
      display: block;
      flex-shrink: 0;
      margin: 0 3px;
    }

    .collapsible.open .header-icon {
      transform: rotate(90deg);
    }

    .header-slots {
      align-items: center;
      display: flex;
      height: 22px;
      margin-left: auto;
      margin-right: 4px;
    }

    .actions {
      display: none;
    }

    .collapsible.open .actions.always-visible,
    .collapsible.open:hover .actions {
      display: block;
    }

    .header-slots slot {
      display: flex;
      max-height: 22px;
      overflow: hidden;
    }

    .header-slots slot::slotted(div) {
      align-items: center;
      display: flex;
    }

    .collapsible-body {
      display: none;
      overflow: hidden;
    }

    .collapsible.open .collapsible-body {
      display: block;
    }
  `],wl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Tl=class extends F{constructor(){super(...arguments),this.alwaysShowHeaderActions=!1,this.title=``,this.heading=``,this.description=``,this.open=!1}_emitToggleEvent(){this.dispatchEvent(new CustomEvent(`vsc-collapsible-toggle`,{detail:{open:this.open}}))}_onHeaderClick(){this.open=!this.open,this._emitToggleEvent()}_onHeaderKeyDown(e){e.key===`Enter`&&(this.open=!this.open,this._emitToggleEvent())}render(){let e={collapsible:!0,open:this.open},t={actions:!0,"always-visible":this.alwaysShowHeaderActions},n=this.heading?this.heading:this.title,r=A`<svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      class="header-icon"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"
      />
    </svg>`,i=this.description?A`<span class="description">${this.description}</span>`:j;return A`
      <div class=${R(e)}>
        <div
          class="collapsible-header"
          tabindex="0"
          @click=${this._onHeaderClick}
          @keydown=${this._onHeaderKeyDown}
        >
          ${r}
          <h3 class="title">${n}${i}</h3>
          <div class="header-slots">
            <div class=${R(t)}>
              <slot name="actions"></slot>
            </div>
            <div class="decorations"><slot name="decorations"></slot></div>
          </div>
        </div>
        <div class="collapsible-body" part="body">
          <slot></slot>
        </div>
      </div>
    `}};Tl.styles=Cl,wl([M({type:Boolean,reflect:!0,attribute:`always-show-header-actions`})],Tl.prototype,`alwaysShowHeaderActions`,void 0),wl([M({type:String})],Tl.prototype,`title`,void 0),wl([M()],Tl.prototype,`heading`,void 0),wl([M()],Tl.prototype,`description`,void 0),wl([M({type:Boolean,reflect:!0})],Tl.prototype,`open`,void 0),Tl=wl([I(`vscode-collapsible`)],Tl);var El=[L,k`
    :host {
      display: block;
      outline: none;
      position: relative;
    }

    .context-menu-item {
      background-color: var(--vscode-menu-background, #1f1f1f);
      color: var(--vscode-menu-foreground, #cccccc);
      display: flex;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      line-height: 1.4em;
      user-select: none;
      white-space: nowrap;
    }

    .ruler {
      border-bottom: 1px solid var(--vscode-menu-separatorBackground, #454545);
      display: block;
      margin: 0 0 4px;
      padding-top: 4px;
      width: 100%;
    }

    .context-menu-item a {
      align-items: center;
      border-color: transparent;
      border-radius: 3px;
      border-style: solid;
      border-width: 1px;
      box-sizing: border-box;
      color: var(--vscode-menu-foreground, #cccccc);
      cursor: pointer;
      display: flex;
      flex: 1 1 auto;
      height: 2em;
      margin-left: 4px;
      margin-right: 4px;
      outline: none;
      position: relative;
      text-decoration: inherit;
    }

    :host([selected]) .context-menu-item a {
      background-color: var(--vscode-menu-selectionBackground, #0078d4);
      border-color: var(--vscode-menu-selectionBorder, transparent);
      color: var(--vscode-menu-selectionForeground, #ffffff);
    }

    .label {
      background: none;
      display: flex;
      flex: 1 1 auto;
      font-size: 12px;
      line-height: 1;
      padding: 0 22px;
      text-decoration: none;
    }

    .keybinding {
      display: block;
      flex: 2 1 auto;
      line-height: 1;
      padding: 0 22px;
      text-align: right;
    }
  `],Dl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ol=class extends F{constructor(){super(...arguments),this.label=``,this.keybinding=``,this.value=``,this.separator=!1,this.tabindex=0}onItemClick(){this.dispatchEvent(new CustomEvent(`vsc-click`,{detail:{label:this.label,keybinding:this.keybinding,value:this.value||this.label,separator:this.separator,tabindex:this.tabindex},bubbles:!0,composed:!0}))}render(){return A`
      ${this.separator?A`
            <div class="context-menu-item separator">
              <span class="ruler"></span>
            </div>
          `:A`
            <div class="context-menu-item">
              <a @click=${this.onItemClick}>
                ${this.label?A`<span class="label">${this.label}</span>`:j}
                ${this.keybinding?A`<span class="keybinding">${this.keybinding}</span>`:j}
              </a>
            </div>
          `}
    `}};Ol.styles=El,Dl([M({type:String})],Ol.prototype,`label`,void 0),Dl([M({type:String})],Ol.prototype,`keybinding`,void 0),Dl([M({type:String})],Ol.prototype,`value`,void 0),Dl([M({type:Boolean,reflect:!0})],Ol.prototype,`separator`,void 0),Dl([M({type:Number})],Ol.prototype,`tabindex`,void 0),Ol=Dl([I(`vscode-context-menu-item`)],Ol);var kl=[L,k`
    :host {
      display: block;
      position: relative;
    }

    .context-menu {
      background-color: var(--vscode-menu-background, #1f1f1f);
      border-color: var(--vscode-menu-border, #454545);
      border-radius: 5px;
      border-style: solid;
      border-width: 1px;
      box-shadow: 0 2px 8px var(--vscode-widget-shadow, rgba(0, 0, 0, 0.36));
      color: var(--vscode-menu-foreground, #cccccc);
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      line-height: 1.4em;
      padding: 4px 0;
      white-space: nowrap;
    }

    .context-menu:focus {
      outline: 0;
    }
  `],Al=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},jl=class extends F{set data(e){this._data=e;let t=[];e.forEach((e,n)=>{e.separator||t.push(n)}),this._clickableItemIndexes=t}get data(){return this._data}set show(e){this._show=e,this._selectedClickableItemIndex=-1,e&&this.updateComplete.then(()=>{this._wrapperEl&&this._wrapperEl.focus(),requestAnimationFrame(()=>{document.addEventListener(`click`,this._onClickOutsideBound,{once:!0})})})}get show(){return this._show}constructor(){super(),this.preventClose=!1,this.tabIndex=0,this._selectedClickableItemIndex=-1,this._show=!1,this._data=[],this._clickableItemIndexes=[],this._onClickOutsideBound=this._onClickOutside.bind(this),this.addEventListener(`keydown`,this._onKeyDown)}_onClickOutside(e){e.composedPath().includes(this)||(this.show=!1)}_onKeyDown(e){let{key:t}=e;switch((t===`ArrowUp`||t===`ArrowDown`||t===`Escape`||t===`Enter`)&&e.preventDefault(),t){case`ArrowUp`:this._handleArrowUp();break;case`ArrowDown`:this._handleArrowDown();break;case`Escape`:this._handleEscape();break;case`Enter`:this._handleEnter();break;default:}}_handleArrowUp(){this._selectedClickableItemIndex===0?this._selectedClickableItemIndex=this._clickableItemIndexes.length-1:--this._selectedClickableItemIndex}_handleArrowDown(){this._selectedClickableItemIndex+1<this._clickableItemIndexes.length?this._selectedClickableItemIndex+=1:this._selectedClickableItemIndex=0}_handleEscape(){this.show=!1,document.removeEventListener(`click`,this._onClickOutsideBound)}_dispatchSelectEvent(e){let{keybinding:t,label:n,value:r,separator:i,tabindex:a}=e;this.dispatchEvent(new CustomEvent(`vsc-context-menu-select`,{detail:{keybinding:t,label:n,separator:i,tabindex:a,value:r}}))}_handleEnter(){if(this._selectedClickableItemIndex===-1)return;let e=this._clickableItemIndexes[this._selectedClickableItemIndex],t=this._wrapperEl.querySelectorAll(`vscode-context-menu-item`)[e];this._dispatchSelectEvent(t),this.preventClose||(this.show=!1,document.removeEventListener(`click`,this._onClickOutsideBound))}_onItemClick(e){let t=e.currentTarget;this._dispatchSelectEvent(t),this.preventClose||(this.show=!1)}_onItemMouseOver(e){let t=e.target,n=t.dataset.index?+t.dataset.index:-1,r=this._clickableItemIndexes.findIndex(e=>e===n);r!==-1&&(this._selectedClickableItemIndex=r)}_onItemMouseOut(){this._selectedClickableItemIndex=-1}render(){if(!this._show)return A`${j}`;let e=this._clickableItemIndexes[this._selectedClickableItemIndex];return A`
      <div class="context-menu" tabindex="0">
        ${this.data?this.data.map(({label:t=``,keybinding:n=``,value:r=``,separator:i=!1,tabindex:a=0},o)=>A`
                <vscode-context-menu-item
                  label=${t}
                  keybinding=${n}
                  value=${r}
                  ?separator=${i}
                  ?selected=${o===e}
                  tabindex=${a}
                  @vsc-click=${this._onItemClick}
                  @mouseover=${this._onItemMouseOver}
                  @mouseout=${this._onItemMouseOut}
                  data-index=${o}
                ></vscode-context-menu-item>
              `):A`<slot></slot>`}
      </div>
    `}};jl.styles=kl,Al([M({type:Array,attribute:!1})],jl.prototype,`data`,null),Al([M({type:Boolean,reflect:!0,attribute:`prevent-close`})],jl.prototype,`preventClose`,void 0),Al([M({type:Boolean,reflect:!0})],jl.prototype,`show`,null),Al([M({type:Number,reflect:!0})],jl.prototype,`tabIndex`,void 0),Al([N()],jl.prototype,`_selectedClickableItemIndex`,void 0),Al([N()],jl.prototype,`_show`,void 0),Al([P(`.context-menu`)],jl.prototype,`_wrapperEl`,void 0),jl=Al([I(`vscode-context-menu`)],jl);var Ml=[L,k`
    :host {
      display: block;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    div {
      background-color: var(--vscode-foreground, #cccccc);
      height: 1px;
      opacity: 0.4;
    }
  `],Nl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Pl=class extends F{constructor(){super(...arguments),this.role=`separator`}render(){return A`<div></div>`}};Pl.styles=Ml,Nl([M({reflect:!0})],Pl.prototype,`role`,void 0),Pl=Nl([I(`vscode-divider`)],Pl);var Fl=[L,k`
    :host {
      display: block;
      max-width: 727px;
    }
  `],Il=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ll;(function(e){e.HORIZONTAL=`horizontal`,e.VERTICAL=`vertical`})(Ll||={});var Rl=class extends F{constructor(){super(...arguments),this.breakpoint=490,this._responsive=!1,this._firstUpdateComplete=!1,this._resizeObserverCallbackBound=this._resizeObserverCallback.bind(this)}set responsive(e){this._responsive=e,this._firstUpdateComplete&&(e?this._activateResponsiveLayout():this._deactivateResizeObserver())}get responsive(){return this._responsive}_toggleCompactLayout(e){this._assignedFormGroups.forEach(t=>{t.dataset.originalVariant||(t.dataset.originalVariant=t.variant);let n=t.dataset.originalVariant;e===Ll.VERTICAL&&n===`horizontal`?t.variant=`vertical`:t.variant=n,t.querySelectorAll(`vscode-checkbox-group, vscode-radio-group`).forEach(t=>{t.dataset.originalVariant||(t.dataset.originalVariant=t.variant);let n=t.dataset.originalVariant;e===Ll.HORIZONTAL&&n===Ll.HORIZONTAL?t.variant=`horizontal`:t.variant=`vertical`})})}_resizeObserverCallback(e){let t=0;for(let n of e)t=n.contentRect.width;let n=t<this.breakpoint?Ll.VERTICAL:Ll.HORIZONTAL;n!==this._currentFormGroupLayout&&(this._toggleCompactLayout(n),this._currentFormGroupLayout=n)}_activateResponsiveLayout(){this._resizeObserver=new ResizeObserver(this._resizeObserverCallbackBound),this._resizeObserver.observe(this._wrapperElement)}_deactivateResizeObserver(){this._resizeObserver?.disconnect(),this._resizeObserver=null}firstUpdated(){this._firstUpdateComplete=!0,this._responsive&&this._activateResponsiveLayout()}render(){return A`
      <div class="wrapper">
        <slot></slot>
      </div>
    `}};Rl.styles=Fl,Il([M({type:Boolean,reflect:!0})],Rl.prototype,`responsive`,null),Il([M({type:Number})],Rl.prototype,`breakpoint`,void 0),Il([P(`.wrapper`)],Rl.prototype,`_wrapperElement`,void 0),Il([Kc({selector:`vscode-form-group`})],Rl.prototype,`_assignedFormGroups`,void 0),Rl=Il([I(`vscode-form-container`)],Rl);var zl=[L,k`
    :host {
      --label-right-margin: 14px;
      --label-width: 150px;

      display: block;
      margin: 15px 0;
    }

    :host([variant='settings-group']) {
      margin: 0;
      padding: 12px 14px 18px;
      max-width: 727px;
    }

    .wrapper {
      display: flex;
      flex-wrap: wrap;
    }

    :host([variant='vertical']) .wrapper,
    :host([variant='settings-group']) .wrapper {
      display: block;
    }

    :host([variant='horizontal']) ::slotted(vscode-checkbox-group),
    :host([variant='horizontal']) ::slotted(vscode-radio-group) {
      width: calc(100% - calc(var(--label-width) + var(--label-right-margin)));
    }

    :host([variant='horizontal']) ::slotted(vscode-label) {
      margin-right: var(--label-right-margin);
      text-align: right;
      width: var(--label-width);
    }

    :host([variant='settings-group']) ::slotted(vscode-label) {
      height: 18px;
      line-height: 18px;
      margin-bottom: 4px;
      margin-right: 0;
      padding: 0;
    }

    ::slotted(vscode-form-helper) {
      margin-left: calc(var(--label-width) + var(--label-right-margin));
    }

    :host([variant='vertical']) ::slotted(vscode-form-helper),
    :host([variant='settings-group']) ::slotted(vscode-form-helper) {
      display: block;
      margin-left: 0;
    }

    :host([variant='settings-group']) ::slotted(vscode-form-helper) {
      margin-bottom: 0;
      margin-top: 0;
    }

    :host([variant='vertical']) ::slotted(vscode-label),
    :host([variant='settings-group']) ::slotted(vscode-label) {
      display: block;
      margin-left: 0;
      text-align: left;
    }

    :host([variant='settings-group']) ::slotted(vscode-inputbox),
    :host([variant='settings-group']) ::slotted(vscode-textfield),
    :host([variant='settings-group']) ::slotted(vscode-textarea),
    :host([variant='settings-group']) ::slotted(vscode-single-select),
    :host([variant='settings-group']) ::slotted(vscode-multi-select) {
      margin-top: 9px;
    }

    ::slotted(vscode-button:first-child) {
      margin-left: calc(var(--label-width) + var(--label-right-margin));
    }

    :host([variant='vertical']) ::slotted(vscode-button) {
      margin-left: 0;
    }

    ::slotted(vscode-button) {
      margin-right: 4px;
    }
  `],Bl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Vl=class extends F{constructor(){super(...arguments),this.variant=`horizontal`}render(){return A`
      <div class="wrapper">
        <slot></slot>
      </div>
    `}};Vl.styles=zl,Bl([M({reflect:!0})],Vl.prototype,`variant`,void 0),Vl=Bl([I(`vscode-form-group`)],Vl);var Hl=[L,k`
    :host {
      display: block;
      line-height: 1.4em;
      margin-bottom: 4px;
      margin-top: 4px;
      max-width: 720px;
      opacity: 0.9;
    }

    :host([vertical]) {
      margin-left: 0;
    }
  `],Ul=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Wl=new CSSStyleSheet;Wl.replaceSync(`
  vscode-form-helper * {
    margin: 0;
  }

  vscode-form-helper *:not(:last-child) {
    margin-bottom: 8px;
  }
`);var Gl=class extends F{constructor(){super(),this._injectLightDOMStyles()}_injectLightDOMStyles(){document.adoptedStyleSheets.find(e=>e===Wl)||document.adoptedStyleSheets.push(Wl)}render(){return A`<slot></slot>`}};Gl.styles=Hl,Gl=Ul([I(`vscode-form-helper`)],Gl);var Kl=0,ql=(e=``)=>(Kl++,`${e}${Kl}`),Jl=[L,k`
    :host {
      display: block;
    }

    .wrapper {
      color: var(--vscode-foreground, #cccccc);
      cursor: default;
      display: block;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: 600;
      line-height: ${1.2307692307692308};
      padding: 5px 0;
    }

    .wrapper.required:after {
      content: ' *';
    }

    ::slotted(.normal) {
      font-weight: normal;
    }

    ::slotted(.lightened) {
      color: var(--vscode-foreground, #cccccc);
      opacity: 0.9;
    }
  `],Yl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Xl=class extends F{constructor(){super(...arguments),this.required=!1,this._id=``,this._htmlFor=``,this._connected=!1}set htmlFor(e){this._htmlFor=e,this.setAttribute(`for`,e),this._connected&&this._connectWithTarget()}get htmlFor(){return this._htmlFor}set id(e){this._id=e}get id(){return this._id}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n)}connectedCallback(){super.connectedCallback(),this._connected=!0,this._id===``&&(this._id=ql(`vscode-label-`),this.setAttribute(`id`,this._id)),this._connectWithTarget()}_getTarget(){let e=null;if(this._htmlFor){let t=this.getRootNode({composed:!1});t&&(e=t.querySelector(`#${this._htmlFor}`))}return e}async _connectWithTarget(){await this.updateComplete;let e=this._getTarget();[`vscode-radio-group`,`vscode-checkbox-group`].includes(e?.tagName.toLowerCase()??``)&&e.setAttribute(`aria-labelledby`,this._id);let t=``;this.textContent&&(t=this.textContent.trim()),e&&`label`in e&&[`vscode-textfield`,`vscode-textarea`,`vscode-single-select`,`vscode-multi-select`].includes(e?.tagName.toLowerCase()??``)&&(e.label=t)}_handleClick(){let e=this._getTarget();e&&`focus`in e&&e.focus()}render(){return A`
      <label
        class=${R({wrapper:!0,required:this.required})}
        @click=${this._handleClick}
        ><slot></slot
      ></label>
    `}};Xl.styles=Jl,Yl([M({reflect:!0,attribute:`for`})],Xl.prototype,`htmlFor`,null),Yl([M()],Xl.prototype,`id`,null),Yl([M({type:Boolean,reflect:!0})],Xl.prototype,`required`,void 0),Xl=Yl([I(`vscode-label`)],Xl);const Zl=A`
  <span class="icon">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"
      />
    </svg>
  </span>
`,Ql=bc`<svg
  width="16"
  height="16"
  viewBox="0 0 16 16"
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
  />
</svg>`;var{I:$l}=Fc,eu=()=>document.createComment(``),tu=(e,t,n)=>{let r=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0)n=new $l(r.insertBefore(eu(),i),r.insertBefore(eu(),i),e,e.options);else{let t=n._$AB.nextSibling,a=n._$AM,o=a!==e;if(o){let t;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(t=e._$AU)!==a._$AU&&n._$AP(t)}if(t!==i||o){let e=n._$AA;for(;e!==t;){let t=e.nextSibling;r.insertBefore(e,i),e=t}}}return n},nu=(e,t,n=e)=>(e._$AI(t,n),e),ru={},iu=(e,t=ru)=>e._$AH=t,au=e=>e._$AH,ou=e=>{e._$AR(),e._$AA.remove()},su=(e,t,n)=>{let r=new Map;for(let i=t;i<=n;i++)r.set(e[i],i);return r},cu=tl(class extends nl{constructor(e){if(super(e),e.type!==el.CHILD)throw Error(`repeat() can only be used in text expressions`)}dt(e,t,n){let r;n===void 0?n=t:t!==void 0&&(r=t);let i=[],a=[],o=0;for(let t of e)i[o]=r?r(t,o):o,a[o]=n(t,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,r]){let i=au(e),{values:a,keys:o}=this.dt(t,n,r);if(!Array.isArray(i))return this.ut=o,a;let s=this.ut??=[],c=[],l,u,d=0,f=i.length-1,p=0,m=a.length-1;for(;d<=f&&p<=m;)if(i[d]===null)d++;else if(i[f]===null)f--;else if(s[d]===o[p])c[p]=nu(i[d],a[p]),d++,p++;else if(s[f]===o[m])c[m]=nu(i[f],a[m]),f--,m--;else if(s[d]===o[m])c[m]=nu(i[d],a[m]),tu(e,c[m+1],i[d]),d++,m--;else if(s[f]===o[p])c[p]=nu(i[f],a[p]),tu(e,i[d],i[f]),f--,p++;else if(l===void 0&&(l=su(o,p,m),u=su(s,d,f)),l.has(s[d]))if(l.has(s[f])){let t=u.get(o[p]),n=t===void 0?null:i[t];if(n===null){let t=tu(e,i[d]);nu(t,a[p]),c[p]=t}else c[p]=nu(n,a[p]),tu(e,i[d],n),i[t]=null;p++}else ou(i[f]),f--;else ou(i[d]),d++;for(;p<=m;){let t=tu(e,c[m+1]);nu(t,a[p]),c[p++]=t}for(;d<=f;){let e=i[d++];e!==null&&ou(e)}return this.ut=o,iu(e,c),xc}});function lu(e,t,n){return e?t(e):n?.(e)}var uu=L,du=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},fu=class extends F{constructor(){super(...arguments),this.description=``,this.selected=!1,this.disabled=!1,this._initialized=!1,this._handleSlotChange=()=>{this._initialized&&this.dispatchEvent(new Event(`vsc-option-state-change`,{bubbles:!0}))}}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this._initialized=!0})}willUpdate(e){this._initialized&&(e.has(`description`)||e.has(`value`)||e.has(`selected`)||e.has(`disabled`))&&this.dispatchEvent(new Event(`vsc-option-state-change`,{bubbles:!0}))}render(){return A`<slot @slotchange=${this._handleSlotChange}></slot>`}};fu.styles=uu,du([M({type:String})],fu.prototype,`value`,void 0),du([M({type:String})],fu.prototype,`description`,void 0),du([M({type:Boolean,reflect:!0})],fu.prototype,`selected`,void 0),du([M({type:Boolean,reflect:!0})],fu.prototype,`disabled`,void 0),fu=du([I(`vscode-option`)],fu);const pu=(e,t)=>{let n={match:!1,ranges:[]},r=e.toLowerCase(),i=t.toLowerCase(),a=r.split(` `),o=0;return a.forEach((t,r)=>{if(r>0&&(o+=a[r-1].length+1),n.match)return;let s=t.indexOf(i),c=i.length;s===0&&(n.match=!0,n.ranges.push([o+s,Math.min(o+s+c,e.length)]))}),n},mu=(e,t)=>{let n={match:!1,ranges:[]};return e.toLowerCase().indexOf(t.toLowerCase())===0&&(n.match=!0,n.ranges=[[0,t.length]]),n},hu=(e,t)=>{let n={match:!1,ranges:[]},r=e.toLowerCase().indexOf(t.toLowerCase());return r>-1&&(n.match=!0,n.ranges=[[r,r+t.length]]),n},gu=(e,t)=>{let n={match:!1,ranges:[]},r=0,i=0,a=t.length-1,o=e.toLowerCase(),s=t.toLowerCase();for(let e=0;e<=a;e++){if(i=o.indexOf(s[e],r),i===-1)return{match:!1,ranges:[]};n.match=!0,n.ranges.push([i,i+1]),r=i+1}return n},_u=(e,t,n)=>{let r=[];return e.forEach(e=>{let i;switch(n){case`startsWithPerTerm`:i=pu(e.label,t);break;case`startsWith`:i=mu(e.label,t);break;case`contains`:i=hu(e.label,t);break;default:i=gu(e.label,t)}i.match&&r.push({...e,ranges:i.ranges})}),r};var vu=e=>{let t=[];return e===` `?(t.push(A`&nbsp;`),t):(e.indexOf(` `)===0&&t.push(A`&nbsp;`),t.push(A`${e.trimStart().trimEnd()}`),e.lastIndexOf(` `)===e.length-1&&t.push(A`&nbsp;`),t)};const yu=(e,t)=>{let n=[],r=t.length;return r<1?A`${e}`:(t.forEach((i,a)=>{let o=e.substring(i[0],i[1]);a===0&&i[0]!==0&&n.push(...vu(e.substring(0,t[0][0]))),a>0&&a<r&&i[0]-t[a-1][1]!==0&&n.push(...vu(e.substring(t[a-1][1],i[0]))),n.push(A`<b>${vu(o)}</b>`),a===r-1&&i[1]<e.length&&n.push(...vu(e.substring(i[1],e.length)))}),n)};var bu=class{constructor(e){this._activeIndex=-1,this._options=[],this._filterPattern=``,this._filterMethod=`fuzzy`,this._combobox=!1,this._indexByValue=new Map,this._indexByLabel=new Map,this._selectedIndex=-1,this._selectedIndexes=new Set,this._multiSelect=!1,this._numOfVisibleOptions=0,(this._host=e).addController(this)}hostConnected(){}get activeIndex(){return this._activeIndex}set activeIndex(e){this._activeIndex=e,this._host.requestUpdate()}get relativeActiveIndex(){return this._options[this._activeIndex]?.filteredIndex??-1}set comboboxMode(e){this._combobox=e,this._host.requestUpdate()}get comboboxMode(){return this._combobox}get multiSelect(){return this._multiSelect}set multiSelect(e){this._selectedIndex=-1,this._selectedIndexes.clear(),this._multiSelect=e,this._host.requestUpdate()}get selectedIndex(){return this._selectedIndex}set selectedIndex(e){this._selectedIndex!==-1&&this._options[this._selectedIndex]&&(this._options[this._selectedIndex].selected??=!1),this._selectedIndex=this.getOptionByIndex(e)?e:-1,this._host.requestUpdate()}get selectedIndexes(){return Array.from(this._selectedIndexes)}set selectedIndexes(e){this._selectedIndexes.forEach(e=>{this._options[e].selected=!1}),this._selectedIndexes=new Set(e),e.forEach(e=>{this._options[e]!==void 0&&(this._options[e].selected=!0)}),this._host.requestUpdate()}set value(e){if(this._multiSelect){let t=e.map(e=>this._indexByValue.get(e)).filter(e=>e!==void 0);this._selectedIndexes=new Set(t)}else this._selectedIndex=this._indexByValue.get(e)??-1;this._host.requestUpdate()}get value(){return this._multiSelect?this._selectedIndexes.size>0?Array.from(this._selectedIndexes).filter(e=>e>=0&&e<this._options.length).map(e=>this._options[e].value):[]:this._selectedIndex>-1&&this._selectedIndex<this._options.length?this._options[this._selectedIndex].value:``}set multiSelectValue(e){let t=e.map(e=>this._indexByValue.get(e)).filter(e=>e!==void 0);this._selectedIndexes=new Set(t)}get multiSelectValue(){return this._selectedIndexes.size>0?Array.from(this._selectedIndexes).map(e=>this._options[e].value):[]}get filterPattern(){return this._filterPattern}set filterPattern(e){e!==this._filterPattern&&(this._filterPattern=e,this._updateState())}get filterMethod(){return this._filterMethod}set filterMethod(e){e!==this._filterMethod&&(this._filterMethod=e,this._updateState())}get options(){return this._options}get numOfVisibleOptions(){return this._numOfVisibleOptions}get numOptions(){return this._options.length}populate(e){this._indexByValue.clear(),this._indexByLabel.clear(),this._options=e.map((e,t)=>(this._indexByValue.set(e.value??``,t),this._indexByLabel.set(e.label??``,t),{description:e.description??``,disabled:e.disabled??!1,label:e.label??``,selected:e.selected??!1,value:e.value??``,index:t,filteredIndex:t,ranges:[],visible:!0})),this._numOfVisibleOptions=this._options.length}add(e){let t=this._options.length,{description:n,disabled:r,label:i,selected:a,value:o}=e,s=!0,c=[];if(this._combobox&&this._filterPattern!==``){let e=this._searchByPattern(i??``);s=e.match,c=e.ranges}this._indexByValue.set(o??``,t),this._indexByLabel.set(i??``,t),a&&(this._selectedIndex=t,this._selectedIndexes.add(t),this._activeIndex=t),this._options.push({index:t,filteredIndex:t,description:n??``,disabled:r??!1,label:i??``,selected:a??!1,value:o??``,visible:s,ranges:c}),s&&(this._numOfVisibleOptions+=1)}clear(){this._options=[],this._indexByValue.clear(),this._indexByLabel.clear(),this._numOfVisibleOptions=0,this._selectedIndex=-1,this._selectedIndexes.clear(),this._activeIndex=-1}getIsIndexSelected(e){return this._multiSelect?this._selectedIndexes.has(e):this._selectedIndex===e}expandMultiSelection(e){e.forEach(e=>{let t=this._indexByValue.get(e)??-1;t!==-1&&this._selectedIndexes.add(t)}),this._host.requestUpdate()}toggleActiveMultiselectOption(){let e=this._options[this._activeIndex]??null;e&&(this._selectedIndexes.has(e.index)?this._selectedIndexes.delete(e.index):this._selectedIndexes.add(e.index),this._host.requestUpdate())}toggleOptionSelected(e){let t=this._selectedIndexes.has(e);this._options[e].selected=!this._options[e].selected,t?this._selectedIndexes.delete(e):this._selectedIndexes.add(e),this._host.requestUpdate()}getActiveOption(){return this._options[this._activeIndex]??null}getSelectedOption(){return this._options[this._selectedIndex]??null}getOptionByIndex(e){return this._options[e]??null}findOptionIndex(e){return this._indexByValue.get(e)??-1}getOptionByValue(e,t=!1){let n=this._indexByValue.get(e)??-1;return n===-1?null:t||this._options[n].visible?this._options[n]:null}getOptionByLabel(e){let t=this._indexByLabel.get(e)??-1;return t===-1?null:this._options[t]}next(e){let t=e??this._activeIndex,n=-1;for(let e=t+1;e<this._options.length;e++)if(this._options[e]&&!this._options[e].disabled&&this._options[e].visible){n=e;break}return n>-1?this._options[n]:null}prev(e){let t=e??this._activeIndex,n=-1;for(let e=t-1;e>=0;e--)if(this._options[e]&&!this._options[e].disabled&&this._options[e].visible){n=e;break}return n>-1?this._options[n]:null}activateDefault(){if(this._multiSelect){if(this._selectedIndexes.size>0){let e=this._selectedIndexes.values().next();this._activeIndex=e.value?e.value:0}}else this._selectedIndex>-1?this._activeIndex=this._selectedIndex:this._activeIndex=0;this._host.requestUpdate()}selectAll(){this._multiSelect&&(this._options.forEach((e,t)=>{this._options[t].selected=!0,this._selectedIndexes.add(t)}),this._host.requestUpdate())}selectNone(){this._multiSelect&&(this._options.forEach((e,t)=>{this._options[t].selected=!1}),this._selectedIndexes.clear(),this._host.requestUpdate())}_searchByPattern(e){let t;switch(this._filterMethod){case`startsWithPerTerm`:t=pu(e,this._filterPattern);break;case`startsWith`:t=mu(e,this._filterPattern);break;case`contains`:t=hu(e,this._filterPattern);break;default:t=gu(e,this._filterPattern)}return t}_updateState(){if(!this._combobox||this._filterPattern===``)this._options.forEach((e,t)=>{this._options[t].visible=!0,this._options[t].ranges=[]}),this._numOfVisibleOptions=this._options.length;else{let e=-1;this._numOfVisibleOptions=0,this._options.forEach(({label:t},n)=>{let r=this._searchByPattern(t);this._options[n].visible=r.match,this._options[n].ranges=r.ranges,this._options[n].filteredIndex=r.match?++e:-1,r.match&&(this._numOfVisibleOptions+=1)})}this._host.requestUpdate()}},xu=[L,k`
    :host {
      display: block;
      position: relative;
    }

    .scrollable-container {
      height: 100%;
      overflow: auto;
    }

    .scrollable-container::-webkit-scrollbar {
      cursor: default;
      width: 0;
    }

    .scrollable-container {
      scrollbar-width: none;
    }

    .shadow {
      box-shadow: var(--vscode-scrollbar-shadow, #000000) 0 6px 6px -6px inset;
      display: none;
      height: 3px;
      left: 0;
      pointer-events: none;
      position: absolute;
      top: 0;
      z-index: 1;
      width: 100%;
    }

    .shadow.visible {
      display: block;
    }

    .scrollbar-track {
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      width: 10px;
      z-index: 100;
    }

    .scrollbar-track.hidden {
      display: none;
    }

    .scrollbar-thumb {
      background-color: transparent;
      min-height: var(--min-thumb-height, 20px);
      opacity: 0;
      position: absolute;
      right: 0;
      width: 10px;
    }

    .scrollbar-thumb.visible {
      background-color: var(
        --vscode-scrollbarSlider-background,
        rgba(121, 121, 121, 0.4)
      );
      opacity: 1;
      transition: opacity 100ms;
    }

    .scrollbar-thumb.fade {
      background-color: var(
        --vscode-scrollbarSlider-background,
        rgba(121, 121, 121, 0.4)
      );
      opacity: 0;
      transition: opacity 800ms;
    }

    .scrollbar-thumb.visible:hover {
      background-color: var(
        --vscode-scrollbarSlider-hoverBackground,
        rgba(100, 100, 100, 0.7)
      );
    }

    .scrollbar-thumb.visible.active,
    .scrollbar-thumb.visible.active:hover {
      background-color: var(
        --vscode-scrollbarSlider-activeBackground,
        rgba(191, 191, 191, 0.4)
      );
    }

    .prevent-interaction {
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      position: absolute;
      z-index: 99;
    }

    .content {
      overflow: hidden;
    }
  `],H=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},U=class extends F{set scrollPos(e){this._scrollPos=this._limitScrollPos(e),this._updateScrollbar(),this._updateThumbPosition(),this.requestUpdate()}get scrollPos(){return this._scrollPos}get scrollMax(){return this._scrollableContainer?this._scrollableContainer.scrollHeight-this._scrollableContainer.clientHeight:0}constructor(){super(),this.alwaysVisible=!1,this.fastScrollSensitivity=5,this.minThumbSize=20,this.mouseWheelScrollSensitivity=1,this.shadow=!0,this.scrolled=!1,this._scrollPos=0,this._isDragging=!1,this._thumbHeight=0,this._thumbY=0,this._thumbVisible=!1,this._thumbFade=!1,this._thumbActive=!1,this._componentHeight=0,this._contentHeight=0,this._scrollThumbStartY=0,this._mouseStartY=0,this._scrollbarVisible=!0,this._scrollbarTrackZ=0,this._resizeObserverCallback=()=>{this._componentHeight=this.offsetHeight,this._contentHeight=this._contentElement.offsetHeight,this._updateScrollbar(),this._updateThumbPosition()},this._handleSlotChange=()=>{this._updateScrollbar(),this._updateThumbPosition(),this._zIndexFix()},this._handleScrollThumbMouseMove=e=>{let t=this._scrollThumbStartY+(e.screenY-this._mouseStartY);this._thumbY=this._limitThumbPos(t),this.scrollPos=this._calculateScrollPosFromThumbPos(this._thumbY),this.dispatchEvent(new CustomEvent(`vsc-scrollable-scroll`,{detail:this.scrollPos}))},this._handleScrollThumbMouseUp=e=>{this._isDragging=!1,this._thumbActive=!1;let{x:t,y:n,width:r,height:i}=this.getBoundingClientRect(),{pageX:a,pageY:o}=e;(a>t+r||a<t||o>n+i||o<n)&&(this._thumbFade=!0,this._thumbVisible=!1),document.removeEventListener(`mousemove`,this._handleScrollThumbMouseMove),document.removeEventListener(`mouseup`,this._handleScrollThumbMouseUp)},this._handleComponentMouseOver=()=>{this._thumbVisible=!0,this._thumbFade=!1},this._handleComponentMouseOut=()=>{this._thumbActive||(this._thumbVisible=!1,this._thumbFade=!0)},this._handleComponentWheel=e=>{if(this._contentHeight<=this._componentHeight)return;e.preventDefault();let t=e.altKey?this.mouseWheelScrollSensitivity*this.fastScrollSensitivity:this.mouseWheelScrollSensitivity;this.scrollPos=this._limitScrollPos(this.scrollPos+e.deltaY*t),this.dispatchEvent(new CustomEvent(`vsc-scrollable-scroll`,{detail:this.scrollPos}))},this._handleScrollableContainerScroll=e=>{e.currentTarget&&(this.scrollPos=e.currentTarget.scrollTop)},this.addEventListener(`mouseover`,this._handleComponentMouseOver),this.addEventListener(`mouseout`,this._handleComponentMouseOut),this.addEventListener(`wheel`,this._handleComponentWheel)}connectedCallback(){super.connectedCallback(),this._hostResizeObserver=new ResizeObserver(this._resizeObserverCallback),this._contentResizeObserver=new ResizeObserver(this._resizeObserverCallback),this.requestUpdate(),this.updateComplete.then(()=>{this._hostResizeObserver.observe(this),this._contentResizeObserver.observe(this._contentElement),this._updateThumbPosition()})}disconnectedCallback(){super.disconnectedCallback(),this._hostResizeObserver.unobserve(this),this._hostResizeObserver.disconnect(),this._contentResizeObserver.unobserve(this._contentElement),this._contentResizeObserver.disconnect()}firstUpdated(e){this._updateThumbPosition()}_calcThumbHeight(){let e=this.offsetHeight,t=e*(e/(this._contentElement?.offsetHeight??0));return Math.max(this.minThumbSize,t)}_updateScrollbar(){let e=this._contentElement?.offsetHeight??0;this.offsetHeight>=e?this._scrollbarVisible=!1:(this._scrollbarVisible=!0,this._thumbHeight=this._calcThumbHeight()),this.requestUpdate()}_zIndexFix(){let e=0;this._assignedElements.forEach(t=>{if(`style`in t){let n=window.getComputedStyle(t).zIndex;/([0-9-])+/g.test(n)&&(e=Number(n)>e?Number(n):e)}}),this._scrollbarTrackZ=e+1,this.requestUpdate()}_updateThumbPosition(){if(!this._scrollableContainer)return;this.scrolled=this.scrollPos>0;let e=this.offsetHeight,t=this._thumbHeight,n=this._contentElement.offsetHeight-e,r=this.scrollPos/n,i=e-t;this._thumbY=Math.min(r*(e-t),i)}_calculateScrollPosFromThumbPos(e){let t=this.getBoundingClientRect().height,n=this._scrollThumbElement.getBoundingClientRect().height,r=this._contentElement.getBoundingClientRect().height,i=e/(t-n)*(r-t);return this._limitScrollPos(i)}_limitScrollPos(e){return e<0?0:e>this.scrollMax?this.scrollMax:e}_limitThumbPos(e){let t=this.getBoundingClientRect().height,n=this._scrollThumbElement.getBoundingClientRect().height;return e<0?0:e>t-n?t-n:e}_handleScrollThumbMouseDown(e){let t=this.getBoundingClientRect(),n=this._scrollThumbElement.getBoundingClientRect();this._mouseStartY=e.screenY,this._scrollThumbStartY=n.top-t.top,this._isDragging=!0,this._thumbActive=!0,document.addEventListener(`mousemove`,this._handleScrollThumbMouseMove),document.addEventListener(`mouseup`,this._handleScrollThumbMouseUp)}_handleScrollbarTrackPress(e){e.target===e.currentTarget&&(this._thumbY=e.offsetY-this._thumbHeight/2,this.scrollPos=this._calculateScrollPosFromThumbPos(this._thumbY))}render(){return A`
      <div
        class="scrollable-container"
        .style=${rl({userSelect:this._isDragging?`none`:`auto`})}
        .scrollTop=${this.scrollPos}
        @scroll=${this._handleScrollableContainerScroll}
      >
        <div
          class=${R({shadow:!0,visible:this.scrolled})}
          .style=${rl({zIndex:String(this._scrollbarTrackZ)})}
        ></div>
        ${this._isDragging?A`<div class="prevent-interaction"></div>`:j}
        <div
          class=${R({"scrollbar-track":!0,hidden:!this._scrollbarVisible})}
          @mousedown=${this._handleScrollbarTrackPress}
        >
          <div
            class=${R({"scrollbar-thumb":!0,visible:this.alwaysVisible?!0:this._thumbVisible,fade:this.alwaysVisible?!1:this._thumbFade,active:this._thumbActive})}
            .style=${rl({height:`${this._thumbHeight}px`,top:`${this._thumbY}px`})}
            @mousedown=${this._handleScrollThumbMouseDown}
          ></div>
        </div>
        <div class="content">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </div>
    `}};U.styles=xu,H([M({type:Boolean,reflect:!0,attribute:`always-visible`})],U.prototype,`alwaysVisible`,void 0),H([M({type:Number,attribute:`fast-scroll-sensitivity`})],U.prototype,`fastScrollSensitivity`,void 0),H([M({type:Number,attribute:`min-thumb-size`})],U.prototype,`minThumbSize`,void 0),H([M({type:Number,attribute:`mouse-wheel-scroll-sensitivity`})],U.prototype,`mouseWheelScrollSensitivity`,void 0),H([M({type:Boolean,reflect:!0})],U.prototype,`shadow`,void 0),H([M({type:Boolean,reflect:!0})],U.prototype,`scrolled`,void 0),H([M({type:Number,attribute:`scroll-pos`})],U.prototype,`scrollPos`,null),H([N()],U.prototype,`_isDragging`,void 0),H([N()],U.prototype,`_thumbHeight`,void 0),H([N()],U.prototype,`_thumbY`,void 0),H([N()],U.prototype,`_thumbVisible`,void 0),H([N()],U.prototype,`_thumbFade`,void 0),H([N()],U.prototype,`_thumbActive`,void 0),H([P(`.content`)],U.prototype,`_contentElement`,void 0),H([P(`.scrollbar-thumb`,!0)],U.prototype,`_scrollThumbElement`,void 0),H([P(`.scrollable-container`)],U.prototype,`_scrollableContainer`,void 0),H([Kc()],U.prototype,`_assignedElements`,void 0),U=H([I(`vscode-scrollable`)],U);var W=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},G=class extends F{set combobox(e){this._opts.comboboxMode=e}get combobox(){return this._opts.comboboxMode}set disabled(e){this._disabled=e,this.ariaDisabled=e?`true`:`false`,e===!0?(this._originalTabIndex=this.tabIndex,this.tabIndex=-1):(this.tabIndex=this._originalTabIndex??0,this._originalTabIndex=void 0),this.requestUpdate()}get disabled(){return this._disabled}set filter(e){let t=[`contains`,`fuzzy`,`startsWith`,`startsWithPerTerm`],n;t.includes(e)?n=e:(console.warn(`[VSCode Webview Elements] Invalid filter: "${e}", fallback to default. Valid values are: "contains", "fuzzy", "startsWith", "startsWithPerm".`,this),n=`fuzzy`),this._opts.filterMethod=n}get filter(){return this._opts.filterMethod}set options(e){this._opts.populate(e)}get options(){return this._opts.options.map(({label:e,value:t,description:n,selected:r,disabled:i})=>({label:e,value:t,description:n,selected:r,disabled:i}))}constructor(){super(),this.creatable=!1,this.label=``,this.invalid=!1,this.focused=!1,this.open=!1,this.position=`below`,this._opts=new bu(this),this._firstUpdateCompleted=!1,this._currentDescription=``,this._filter=`fuzzy`,this._selectedIndexes=[],this._options=[],this._value=``,this._values=[],this._isPlaceholderOptionActive=!1,this._isBeingFiltered=!1,this._optionListScrollPos=0,this._isHoverForbidden=!1,this._disabled=!1,this._originalTabIndex=void 0,this._onMouseMove=()=>{this._isHoverForbidden=!1,window.removeEventListener(`mousemove`,this._onMouseMove)},this._onOptionListScroll=e=>{this._optionListScrollPos=e.detail},this._onComponentKeyDown=e=>{[` `,`ArrowUp`,`ArrowDown`,`Escape`].includes(e.key)&&(e.stopPropagation(),e.preventDefault()),e.key===`Enter`&&this._onEnterKeyDown(e),e.key===` `&&this._onSpaceKeyDown(),e.key===`Escape`&&this._onEscapeKeyDown(),e.key===`ArrowUp`&&this._onArrowUpKeyDown(),e.key===`ArrowDown`&&this._onArrowDownKeyDown()},this._onComponentFocus=()=>{this.focused=!0},this._onComponentBlur=()=>{this.focused=!1},this._handleWindowScroll=()=>{this.open=!1},this.addEventListener(`vsc-option-state-change`,e=>{e.stopPropagation(),this._setStateFromSlottedElements(),this.requestUpdate()})}connectedCallback(){super.connectedCallback(),this.addEventListener(`keydown`,this._onComponentKeyDown),this.addEventListener(`focus`,this._onComponentFocus),this.addEventListener(`blur`,this._onComponentBlur),this._setAutoFocus()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(`keydown`,this._onComponentKeyDown),this.removeEventListener(`focus`,this._onComponentFocus),this.removeEventListener(`blur`,this._onComponentBlur)}firstUpdated(e){this._firstUpdateCompleted=!0}willUpdate(e){e.has(`required`)&&this._firstUpdateCompleted&&this._manageRequired(),e.has(`open`)&&this._firstUpdateCompleted&&(this.open?(this._dropdownEl.showPopover(),window.addEventListener(`scroll`,this._handleWindowScroll,{capture:!0}),this._opts.activateDefault(),this._scrollActiveElementToTop()):(this._dropdownEl.hidePopover(),window.removeEventListener(`scroll`,this._handleWindowScroll)))}get _filteredOptions(){return!this.combobox||this._opts.filterPattern===``?this._options:_u(this._options,this._opts.filterPattern,this._filter)}_setAutoFocus(){this.hasAttribute(`autofocus`)&&(this.tabIndex<0&&(this.tabIndex=0),this.combobox?this.updateComplete.then(()=>{this.shadowRoot?.querySelector(`.combobox-input`).focus()}):this.updateComplete.then(()=>{this.shadowRoot?.querySelector(`.select-face`).focus()}))}get _isSuggestedOptionVisible(){if(!(this.combobox&&this.creatable))return!1;let e=this._opts.getOptionByValue(this._opts.filterPattern)!==null,t=this._opts.filterPattern.length>0;return!e&&t}_manageRequired(){}_setStateFromSlottedElements(){let e=this._assignedOptions??[];this._opts.clear(),e.forEach(e=>{let{innerText:t,description:n,disabled:r}=e,i=typeof e.value==`string`?e.value:t.trim(),a=e.selected??!1,o={label:t.trim(),value:i,description:n,selected:a,disabled:r};this._opts.add(o)})}_createSuggestedOption(){let e=this._opts.numOptions,t=document.createElement(`vscode-option`);return t.value=this._opts.filterPattern,Lc(this._opts.filterPattern,t),this.appendChild(t),e}_dispatchChangeEvent(){this.dispatchEvent(new Event(`change`)),this.dispatchEvent(new Event(`input`))}async _createAndSelectSuggestedOption(){}_toggleComboboxDropdown(){this._opts.filterPattern=``,this.open=!this.open}_scrollActiveElementToTop(){this._optionListScrollPos=Math.floor(this._opts.relativeActiveIndex*22)}async _adjustOptionListScrollPos(e,t){let n=this._opts.numOfVisibleOptions;if(this._isSuggestedOptionVisible&&(n+=1),n<=10)return;this._isHoverForbidden=!0,window.addEventListener(`mousemove`,this._onMouseMove);let r=this._optionListScrollPos,i=t*22,a=i>=r&&i<=r+220-22;e===`down`&&(a||(this._optionListScrollPos=t*22-198)),e===`up`&&(a||(this._optionListScrollPos=Math.floor(this._opts.relativeActiveIndex*22)))}_onFaceClick(){this.open=!this.open}_handleDropdownToggle(e){this.open=e.newState===`open`}_onComboboxButtonClick(){this._toggleComboboxDropdown()}_onComboboxButtonKeyDown(e){e.key===`Enter`&&this._toggleComboboxDropdown()}_onOptionMouseOver(e){if(this._isHoverForbidden)return;let t=e.target;t.matches(`.option`)&&(t.matches(`.placeholder`)?(this._isPlaceholderOptionActive=!0,this._opts.activeIndex=-1):(this._isPlaceholderOptionActive=!1,this._opts.activeIndex=+t.dataset.index))}_onPlaceholderOptionMouseOut(){this._isPlaceholderOptionActive=!1}_onNoOptionsClick(e){e.stopPropagation()}_onEnterKeyDown(e){this._isBeingFiltered=!1,e?.composedPath&&e.composedPath().find(e=>e.matches?e.matches(`vscode-button.button-accept`):!1)}_onSpaceKeyDown(){if(!this.open){this.open=!0;return}}_onArrowUpKeyDown(){if(this.open){if(this._opts.activeIndex<=0&&!(this.combobox&&this.creatable))return;if(this._isPlaceholderOptionActive){let e=this._opts.numOfVisibleOptions-1;this._opts.activeIndex=e,this._isPlaceholderOptionActive=!1}else{let e=this._opts.prev();if(e!==null){this._opts.activeIndex=e?.index??-1;let t=e?.filteredIndex??-1;t>-1&&this._adjustOptionListScrollPos(`up`,t)}}}else this.open=!0,this._opts.activateDefault()}_onArrowDownKeyDown(){let e=this._opts.numOfVisibleOptions,t=this._isSuggestedOptionVisible;if(t&&(e+=1),this.open){if(this._isPlaceholderOptionActive&&this._opts.activeIndex===-1)return;let n=this._opts.next();if(t&&n===null)this._isPlaceholderOptionActive=!0,this._adjustOptionListScrollPos(`down`,e-1),this._opts.activeIndex=-1;else if(n!==null){let e=n?.filteredIndex??-1;this._opts.activeIndex=n?.index??-1,e>-1&&this._adjustOptionListScrollPos(`down`,e)}}else this.open=!0,this._opts.activateDefault()}_onEscapeKeyDown(){this.open=!1}_onSlotChange(){this._setStateFromSlottedElements(),this.requestUpdate()}_onComboboxInputFocus(e){e.target.select(),this._isBeingFiltered=!1,this._opts.filterPattern=``}_onComboboxInputBlur(){this._isBeingFiltered=!1}_onComboboxInputInput(e){this._isBeingFiltered=!0,this._opts.filterPattern=e.target.value,this._opts.activeIndex=-1,this.open=!0}_onComboboxInputClick(){this._isBeingFiltered=this._opts.filterPattern!==``,this.open=!0}_onComboboxInputSpaceKeyDown(e){e.key===` `&&e.stopPropagation()}_onOptionClick(e){this._isBeingFiltered=!1}_renderCheckbox(e,t){return A`<span class=${R({"checkbox-icon":!0,checked:e})}>${Ql}</span
      ><span class="option-label">${t}</span>`}_renderOptions(){let e=this._opts.options;return A`
      <ul
        aria-label=${z(this.label??void 0)}
        aria-multiselectable=${z(this._opts.multiSelect?`true`:void 0)}
        class="options"
        id="select-listbox"
        role="listbox"
        tabindex="-1"
        @click=${this._onOptionClick}
        @mouseover=${this._onOptionMouseOver}
      >
        ${cu(e,e=>e.index,(e,t)=>{if(!e.visible)return j;let n=e.index===this._opts.activeIndex&&!e.disabled,r=this._opts.getIsIndexSelected(e.index),i={active:n,disabled:e.disabled,option:!0,"single-select":!this._opts.multiSelect,"multi-select":this._opts.multiSelect,selected:r},a=e.ranges?.length??!1?yu(e.label,e.ranges??[]):e.label;return A`
              <li
                aria-selected=${r?`true`:`false`}
                class=${R(i)}
                data-index=${e.index}
                data-filtered-index=${t}
                id=${`op-${e.index}`}
                role="option"
                tabindex="-1"
              >
                ${lu(this._opts.multiSelect,()=>this._renderCheckbox(r,a),()=>a)}
              </li>
            `})}
        ${this._renderPlaceholderOption(this._opts.numOfVisibleOptions<1)}
      </ul>
    `}_renderPlaceholderOption(e){return!this.combobox||this._opts.getOptionByLabel(this._opts.filterPattern)?j:this.creatable&&this._opts.filterPattern.length>0?A`<li
        class=${R({option:!0,placeholder:!0,active:this._isPlaceholderOptionActive})}
        @mouseout=${this._onPlaceholderOptionMouseOut}
      >
        Add "${this._opts.filterPattern}"
      </li>`:e?A`<li class="no-options" @click=${this._onNoOptionsClick}>
            No options
          </li>`:j}_renderDescription(){let e=this._opts.getActiveOption();if(!e)return j;let{description:t}=e;return t?A`<div class="description">${t}</div>`:j}_renderSelectFace(){return A`${j}`}_renderComboboxFace(){return A`${j}`}_renderDropdownControls(){return A`${j}`}_renderDropdown(){let e={dropdown:!0,multiple:this._opts.multiSelect,open:this.open},t=this._isSuggestedOptionVisible||this._opts.numOfVisibleOptions===0?this._opts.numOfVisibleOptions+1:this._opts.numOfVisibleOptions,n=Math.min(t*22,220),r=this.getBoundingClientRect(),i={width:`${r.width}px`,left:`${r.left}px`,top:this.position===`below`?`${r.top+r.height}px`:`unset`,bottom:this.position===`below`?`unset`:`${document.documentElement.clientHeight-r.top}px`};return A`
      <div
        class=${R(e)}
        popover="auto"
        @toggle=${this._handleDropdownToggle}
        .style=${rl(i)}
      >
        ${this.position===`above`?this._renderDescription():j}
        <vscode-scrollable
          always-visible
          class="scrollable"
          min-thumb-size="40"
          tabindex="-1"
          @vsc-scrollable-scroll=${this._onOptionListScroll}
          .scrollPos=${this._optionListScrollPos}
          .style=${rl({height:`${n}px`})}
        >
          ${this._renderOptions()} ${this._renderDropdownControls()}
        </vscode-scrollable>
        ${this.position===`below`?this._renderDescription():j}
      </div>
    `}};W([M({type:Boolean,reflect:!0})],G.prototype,`creatable`,void 0),W([M({type:Boolean,reflect:!0})],G.prototype,`combobox`,null),W([M({reflect:!0})],G.prototype,`label`,void 0),W([M({type:Boolean,reflect:!0})],G.prototype,`disabled`,null),W([M({type:Boolean,reflect:!0})],G.prototype,`invalid`,void 0),W([M()],G.prototype,`filter`,null),W([M({type:Boolean,reflect:!0})],G.prototype,`focused`,void 0),W([M({type:Boolean,reflect:!0})],G.prototype,`open`,void 0),W([M({type:Array})],G.prototype,`options`,null),W([M({reflect:!0})],G.prototype,`position`,void 0),W([Kc({flatten:!0,selector:`vscode-option`})],G.prototype,`_assignedOptions`,void 0),W([P(`.dropdown`,!0)],G.prototype,`_dropdownEl`,void 0),W([N()],G.prototype,`_currentDescription`,void 0),W([N()],G.prototype,`_filter`,void 0),W([N()],G.prototype,`_filteredOptions`,null),W([N()],G.prototype,`_selectedIndexes`,void 0),W([N()],G.prototype,`_options`,void 0),W([N()],G.prototype,`_value`,void 0),W([N()],G.prototype,`_values`,void 0),W([N()],G.prototype,`_isPlaceholderOptionActive`,void 0),W([N()],G.prototype,`_isBeingFiltered`,void 0),W([N()],G.prototype,`_optionListScrollPos`,void 0);var Su=[L,k`
    :host {
      display: inline-block;
      max-width: 100%;
      outline: none;
      position: relative;
      width: 320px;
    }

    .main-slot {
      display: none;
    }

    .select-face,
    .combobox-face {
      background-color: var(--vscode-settings-dropdownBackground, #313131);
      border-color: var(--vscode-settings-dropdownBorder, #3c3c3c);
      border-radius: 2px;
      border-style: solid;
      border-width: 1px;
      box-sizing: border-box;
      color: var(--vscode-settings-dropdownForeground, #cccccc);
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      line-height: 18px;
      position: relative;
      user-select: none;
      width: 100%;
    }

    :host([invalid]) .select-face,
    :host(:invalid) .select-face,
    :host([invalid]) .combobox-face,
    :host(:invalid) .combobox-face {
      background-color: var(--vscode-inputValidation-errorBackground, #5a1d1d);
      border-color: var(--vscode-inputValidation-errorBorder, #be1100);
    }

    .select-face {
      cursor: pointer;
      display: block;
      padding: 3px 4px;
    }

    .select-face .text {
      display: block;
      height: 18px;
      overflow: hidden;
      padding-right: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .select-face.multiselect {
      padding: 0;
    }

    .select-face-badge {
      background-color: var(--vscode-badge-background, #616161);
      border-radius: 2px;
      color: var(--vscode-badge-foreground, #f8f8f8);
      display: inline-block;
      flex-shrink: 0;
      font-size: 11px;
      line-height: 16px;
      margin: 2px;
      padding: 2px 3px;
      white-space: nowrap;
    }

    .select-face-badge.no-item {
      background-color: transparent;
      color: inherit;
    }

    .combobox-face {
      display: flex;
    }

    :host(:focus) .select-face,
    :host(:focus) .combobox-face,
    :host([focused]) .select-face,
    :host([focused]) .combobox-face {
      border-color: var(--vscode-focusBorder, #0078d4);
      outline: none;
    }

    .combobox-input {
      background-color: transparent;
      box-sizing: border-box;
      border: 0;
      color: var(--vscode-foreground, #cccccc);
      display: block;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      line-height: 16px;
      padding: 4px;
      width: 100%;
    }

    .combobox-input:focus {
      outline: none;
    }

    .combobox-button {
      align-items: center;
      background-color: transparent;
      border: 0;
      border-radius: 2px;
      box-sizing: content-box;
      color: var(--vscode-foreground, #cccccc);
      cursor: pointer;
      display: flex;
      flex-shrink: 0;
      height: 16px;
      justify-content: center;
      margin: 1px 1px 0 0;
      padding: 3px;
      width: 22px;
    }

    .combobox-button:hover,
    .combobox-button:focus-visible {
      background-color: var(
        --vscode-toolbar-hoverBackground,
        rgba(90, 93, 94, 0.31)
      );
      outline-style: dashed;
      outline-color: var(--vscode-toolbar-hoverOutline, transparent);
    }

    .combobox-button:focus-visible {
      outline: none;
    }

    .icon {
      color: var(--vscode-foreground, #cccccc);
      display: block;
      height: 14px;
      pointer-events: none;
      width: 14px;
    }

    .select-face .icon {
      position: absolute;
      right: 6px;
      top: 5px;
    }

    .icon svg {
      color: var(--vscode-foreground, #cccccc);
      height: 100%;
      width: 100%;
    }

    .dropdown {
      background-color: var(--vscode-settings-dropdownBackground, #313131);
      border-color: var(--vscode-settings-dropdownListBorder, #454545);
      border-radius: 0 0 3px 3px;
      border-style: solid;
      border-width: 1px;
      bottom: unset;
      box-sizing: border-box;
      display: none;
      padding-bottom: 2px;
      padding-left: 0;
      padding-right: 0;
      padding-top: 0;
      right: unset;
    }

    .dropdown.open {
      display: block;
    }

    :host([position='above']) .dropdown {
      border-radius: 3px 3px 0 0;
      bottom: 26px;
      padding-bottom: 0;
      padding-top: 2px;
      top: unset;
    }

    :host(:focus) .dropdown,
    :host([focused]) .dropdown {
      border-color: var(--vscode-focusBorder, #0078d4);
    }

    .scrollable {
      display: block;
      max-height: 222px;
      margin: 1px;
      outline: none;
      overflow: hidden;
    }

    .options {
      box-sizing: border-box;
      cursor: pointer;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .option {
      box-sizing: border-box;
      color: var(--vscode-foreground, #cccccc);
      cursor: pointer;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      height: 22px;
      line-height: 20px;
      min-height: calc(var(--vscode-font-size) * 1.3);
      padding: 1px 3px;
      user-select: none;
      outline-color: transparent;
      outline-offset: -1px;
      outline-style: solid;
      outline-width: 1px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .option.single-select {
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .option.multi-select {
      align-items: center;
      display: flex;
    }

    .option b {
      color: var(--vscode-list-highlightForeground, #2aaaff);
    }

    .option.active b {
      color: var(--vscode-list-focusHighlightForeground, #2aaaff);
    }

    .option:not(.disabled):hover {
      background-color: var(--vscode-list-hoverBackground, #2a2d2e);
      color: var(--vscode-list-hoverForeground, #ffffff);
    }

    :host-context(body[data-vscode-theme-kind='vscode-high-contrast'])
      .option:hover,
    :host-context(body[data-vscode-theme-kind='vscode-high-contrast-light'])
      .option:hover {
      outline-style: dotted;
      outline-color: var(--vscode-list-focusOutline, #0078d4);
      outline-width: 1px;
    }

    .option.disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }

    .option.active,
    .option.active:hover {
      background-color: var(--vscode-list-activeSelectionBackground, #04395e);
      color: var(--vscode-list-activeSelectionForeground, #ffffff);
      outline-color: var(--vscode-list-activeSelectionBackground, #04395e);
      outline-style: solid;
      outline-width: 1px;
    }

    .no-options {
      align-items: center;
      border-color: transparent;
      border-style: solid;
      border-width: 1px;
      color: var(--vscode-foreground, #cccccc);
      cursor: default;
      display: flex;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      line-height: 18px;
      min-height: calc(var(--vscode-font-size) * 1.3);
      opacity: 0.85;
      padding: 1px 3px;
      user-select: none;
    }

    .placeholder {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .placeholder span {
      font-weight: bold;
    }

    .placeholder:not(.disabled):hover {
      color: var(--vscode-list-activeSelectionForeground, #ffffff);
    }

    :host-context(body[data-vscode-theme-kind='vscode-high-contrast'])
      .option.active,
    :host-context(body[data-vscode-theme-kind='vscode-high-contrast-light'])
      .option.active:hover {
      outline-color: var(--vscode-list-focusOutline, #0078d4);
      outline-style: dashed;
    }

    .option-label {
      display: block;
      overflow: hidden;
      pointer-events: none;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    .dropdown.multiple .option.selected {
      background-color: var(--vscode-list-hoverBackground, #2a2d2e);
      outline-color: var(--vscode-list-hoverBackground, #2a2d2e);
    }

    .dropdown.multiple .option.selected.active {
      background-color: var(--vscode-list-activeSelectionBackground, #04395e);
      color: var(--vscode-list-activeSelectionForeground, #ffffff);
      outline-color: var(--vscode-list-activeSelectionBackground, #04395e);
    }

    .checkbox-icon {
      align-items: center;
      background-color: var(--vscode-checkbox-background, #313131);
      border-radius: 2px;
      border: 1px solid var(--vscode-checkbox-border);
      box-sizing: border-box;
      color: var(--vscode-checkbox-foreground);
      display: flex;
      flex-basis: 15px;
      flex-shrink: 0;
      height: 15px;
      justify-content: center;
      margin-right: 5px;
      overflow: hidden;
      position: relative;
      width: 15px;
    }

    .checkbox-icon svg {
      display: none;
      height: 13px;
      width: 13px;
    }

    .checkbox-icon.checked svg {
      display: block;
    }

    .dropdown-controls {
      display: flex;
      justify-content: flex-end;
      padding: 4px;
    }

    .dropdown-controls :not(:last-child) {
      margin-right: 4px;
    }

    .action-icon {
      align-items: center;
      background-color: transparent;
      border: 0;
      color: var(--vscode-foreground, #cccccc);
      cursor: pointer;
      display: flex;
      height: 24px;
      justify-content: center;
      padding: 0;
      width: 24px;
    }

    .action-icon:focus {
      outline: none;
    }

    .action-icon:focus-visible {
      outline: 1px solid var(--vscode-focusBorder, #0078d4);
      outline-offset: -1px;
    }

    .description {
      border-color: var(--vscode-settings-dropdownBorder, #3c3c3c);
      border-style: solid;
      border-width: 1px 0 0;
      color: var(--vscode-foreground, #cccccc);
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      line-height: 1.3;
      padding: 6px 4px;
      word-wrap: break-word;
    }

    :host([position='above']) .description {
      border-width: 0 0 1px;
    }
  `],Cu=Su,wu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Tu=class extends G{set selectedIndexes(e){this._opts.selectedIndexes=e}get selectedIndexes(){return this._opts.selectedIndexes}set value(e){this._opts.multiSelectValue=e,this._opts.selectedIndexes.length>0?this._requestedValueToSetLater=[]:this._requestedValueToSetLater=Array.isArray(e)?e:[e],this._setFormValue(),this._manageRequired()}get value(){return this._opts.multiSelectValue}get form(){return this._internals.form}get type(){return`select-multiple`}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}selectAll(){this._opts.selectAll()}selectNone(){this._opts.selectNone()}constructor(){super(),this.defaultValue=[],this.required=!1,this.name=void 0,this._requestedValueToSetLater=[],this._onOptionClick=e=>{let t=e.composedPath().find(e=>`matches`in e?e.matches(`li.option`):!1);if(!t)return;if(t.classList.contains(`placeholder`)){this._createAndSelectSuggestedOption();return}let n=Number(t.dataset.index);this._opts.toggleOptionSelected(n),this._setFormValue(),this._manageRequired(),this._dispatchChangeEvent()},this._opts.multiSelect=!0,this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this._setDefaultValue(),this._manageRequired()})}formResetCallback(){this.updateComplete.then(()=>{this.value=this.defaultValue})}formStateRestoreCallback(e,t){let n=Array.from(e.entries()).map(e=>String(e[1]));this.updateComplete.then(()=>{this.value=n})}_setDefaultValue(){Array.isArray(this.defaultValue)&&this.defaultValue.length>0&&(this.value=this.defaultValue.map(e=>String(e)))}_dispatchChangeEvent(){super._dispatchChangeEvent()}_onFaceClick(){super._onFaceClick(),this._opts.activeIndex=0}_toggleComboboxDropdown(){super._toggleComboboxDropdown(),this._opts.activeIndex=-1}_manageRequired(){let{value:e}=this;e.length===0&&this.required?this._internals.setValidity({valueMissing:!0},`Please select an item in the list.`,this._faceElement):this._internals.setValidity({})}_setFormValue(){let e=new FormData;this._values.forEach(t=>{e.append(this.name??``,t)}),this._internals.setFormValue(e)}async _createAndSelectSuggestedOption(){super._createAndSelectSuggestedOption();let e=this._createSuggestedOption();await this.updateComplete,this.selectedIndexes=[...this.selectedIndexes,e],this._dispatchChangeEvent();let t=new CustomEvent(`vsc-multi-select-create-option`,{detail:{value:this._opts.getOptionByIndex(e)?.value??``}});this.dispatchEvent(t),this.open=!1,this._isPlaceholderOptionActive=!1}_onSlotChange(){super._onSlotChange(),this._requestedValueToSetLater.length>0&&(this._opts.expandMultiSelection(this._requestedValueToSetLater),this._requestedValueToSetLater=this._requestedValueToSetLater.filter(e=>this._opts.findOptionIndex(e)===-1))}_onEnterKeyDown(e){super._onEnterKeyDown(e),this.open?this._isPlaceholderOptionActive?this._createAndSelectSuggestedOption():(this._opts.toggleActiveMultiselectOption(),this._setFormValue(),this._manageRequired(),this._dispatchChangeEvent()):(this._opts.filterPattern=``,this.open=!0)}_onMultiAcceptClick(){this.open=!1}_onMultiDeselectAllClick(){this._opts.selectedIndexes=[],this._values=[],this._options=this._options.map(e=>({...e,selected:!1})),this._manageRequired(),this._dispatchChangeEvent()}_onMultiSelectAllClick(){this._opts.selectedIndexes=[],this._values=[],this._options=this._options.map(e=>({...e,selected:!0})),this._options.forEach((e,t)=>{this._selectedIndexes.push(t),this._values.push(e.value),this._dispatchChangeEvent()}),this._setFormValue(),this._manageRequired()}_onComboboxInputBlur(){super._onComboboxInputBlur(),this._opts.filterPattern=``}_renderLabel(){switch(this._opts.selectedIndexes.length){case 0:return A`<span class="select-face-badge no-item">0 Selected</span>`;default:return A`<span class="select-face-badge"
          >${this._opts.selectedIndexes.length} Selected</span
        >`}}_renderComboboxFace(){let e=this._opts.activeIndex>-1?`op-${this._opts.activeIndex}`:``,t=this.open?`true`:`false`;return A`
      <div class="combobox-face face">
        ${this._opts.multiSelect?this._renderLabel():j}
        <input
          aria-activedescendant=${e}
          aria-autocomplete="list"
          aria-controls="select-listbox"
          aria-expanded=${t}
          aria-haspopup="listbox"
          aria-label=${z(this.label)}
          class="combobox-input"
          role="combobox"
          spellcheck="false"
          type="text"
          autocomplete="off"
          .value=${this._opts.filterPattern}
          @focus=${this._onComboboxInputFocus}
          @blur=${this._onComboboxInputBlur}
          @input=${this._onComboboxInputInput}
          @click=${this._onComboboxInputClick}
          @keydown=${this._onComboboxInputSpaceKeyDown}
        >
        <button
          aria-label="Open the list of options"
          class="combobox-button"
          type="button"
          @click=${this._onComboboxButtonClick}
          @keydown=${this._onComboboxButtonKeyDown}
          tabindex="-1"
        >
          ${Zl}
        </button>
      </div>
    `}_renderSelectFace(){let e=this._opts.activeIndex>-1?`op-${this._opts.activeIndex}`:``,t=this.open?`true`:`false`;return A`
      <div
        aria-activedescendant=${z(this._opts.multiSelect?void 0:e)}
        aria-controls="select-listbox"
        aria-expanded=${z(this._opts.multiSelect?void 0:t)}
        aria-haspopup="listbox"
        aria-label=${z(this.label??void 0)}
        class="select-face face multiselect"
        @click=${this._onFaceClick}
        .tabIndex=${this.disabled?-1:0}
      >
        ${this._renderLabel()} ${Zl}
      </div>
    `}_renderDropdownControls(){return this._filteredOptions.length>0?A`
          <div class="dropdown-controls">
            <button
              type="button"
              @click=${this._onMultiSelectAllClick}
              title="Select all"
              class="action-icon"
              id="select-all"
            >
              <vscode-icon name="checklist"></vscode-icon>
            </button>
            <button
              type="button"
              @click=${this._onMultiDeselectAllClick}
              title="Deselect all"
              class="action-icon"
              id="select-none"
            >
              <vscode-icon name="clear-all"></vscode-icon>
            </button>
            <vscode-button
              class="button-accept"
              @click=${this._onMultiAcceptClick}
              >OK</vscode-button
            >
          </div>
        `:A`${j}`}render(){return A`
      <div class="multi-select">
        <slot class="main-slot" @slotchange=${this._onSlotChange}></slot>
        ${this.combobox?this._renderComboboxFace():this._renderSelectFace()}
        ${this._renderDropdown()}
      </div>
    `}};Tu.styles=Cu,Tu.shadowRootOptions={...zc.shadowRootOptions,delegatesFocus:!0},Tu.formAssociated=!0,wu([M({type:Array,attribute:`default-value`})],Tu.prototype,`defaultValue`,void 0),wu([M({type:Boolean,reflect:!0})],Tu.prototype,`required`,void 0),wu([M({reflect:!0})],Tu.prototype,`name`,void 0),wu([M({type:Array,attribute:!1})],Tu.prototype,`selectedIndexes`,null),wu([M({type:Array})],Tu.prototype,`value`,null),wu([P(`.face`)],Tu.prototype,`_faceElement`,void 0),Tu=wu([I(`vscode-multi-select`)],Tu);var Eu=[L,k`
    :host {
      display: block;
      height: 28px;
      margin: 0;
      outline: none;
      width: 28px;
    }

    .progress {
      height: 100%;
      width: 100%;
    }

    .background {
      fill: none;
      stroke: transparent;
      stroke-width: 2px;
    }

    .indeterminate-indicator-1 {
      fill: none;
      stroke: var(--vscode-progressBar-background, #0078d4);
      stroke-width: 2px;
      stroke-linecap: square;
      transform-origin: 50% 50%;
      transform: rotate(-90deg);
      transition: all 0.2s ease-in-out;
      animation: spin-infinite 2s linear infinite;
    }

    @keyframes spin-infinite {
      0% {
        stroke-dasharray: 0.01px 43.97px;
        transform: rotate(0deg);
      }
      50% {
        stroke-dasharray: 21.99px 21.99px;
        transform: rotate(450deg);
      }
      100% {
        stroke-dasharray: 0.01px 43.97px;
        transform: rotate(1080deg);
      }
    }
  `],Du=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ou=class extends F{constructor(){super(...arguments),this.ariaLabel=`Loading`,this.ariaLive=`assertive`,this.role=`alert`}render(){return A`<svg class="progress" part="progress" viewBox="0 0 16 16">
      <circle
        class="background"
        part="background"
        cx="8px"
        cy="8px"
        r="7px"
      ></circle>
      <circle
        class="indeterminate-indicator-1"
        part="indeterminate-indicator-1"
        cx="8px"
        cy="8px"
        r="7px"
      ></circle>
    </svg>`}};Ou.styles=Eu,Du([M({reflect:!0,attribute:`aria-label`})],Ou.prototype,`ariaLabel`,void 0),Du([M({reflect:!0,attribute:`aria-live`})],Ou.prototype,`ariaLive`,void 0),Du([M({reflect:!0})],Ou.prototype,`role`,void 0),Ou=Du([I(`vscode-progress-ring`)],Ou);var ku=[L,k`
    :host {
      display: block;
      height: 2px;
      width: 100%;
      outline: none;
    }

    .container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .track {
      position: absolute;
      inset: 0;
      background: transparent;
    }

    .indicator {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      height: 100%;
      background: var(--vscode-progressBar-background, #0078d4);
      will-change: transform, width, left;
    }

    /* Determinate mode: width is set inline via style attribute */
    .discrete .indicator {
      transition: width 100ms linear;
    }

    /* Indeterminate mode: VS Code style progress bit */
    .infinite .indicator {
      width: 2%;
      animation-name: progress;
      animation-duration: 4s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      transform: translate3d(0px, 0px, 0px);
    }

    /* Long running: reduce GPU pressure using stepped animation */
    .infinite.infinite-long-running .indicator {
      animation-timing-function: steps(100);
    }

    /* Keyframes adapted from VS Code */
    @keyframes progress {
      from {
        transform: translateX(0%) scaleX(1);
      }
      50% {
        transform: translateX(2500%) scaleX(3);
      }
      to {
        transform: translateX(4900%) scaleX(1);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .discrete .indicator {
        transition: none;
      }
      .infinite .indicator,
      .infinite-long-running .indicator {
        animation: none;
        width: 100%;
      }
    }
  `],Au=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ju=class extends F{constructor(){super(...arguments),this.ariaLabel=`Loading`,this.max=100,this.indeterminate=!1,this.longRunningThreshold=15e3,this._longRunning=!1}get _isDeterminate(){return!this.indeterminate&&typeof this.value==`number`&&isFinite(this.value)}connectedCallback(){super.connectedCallback(),this._maybeStartLongRunningTimer()}disconnectedCallback(){super.disconnectedCallback(),this._clearLongRunningTimer()}willUpdate(){this._maybeStartLongRunningTimer()}render(){let e=this.max>0?this.max:100,t=this._isDeterminate?Math.min(Math.max(this.value??0,0),e):0,n=this._isDeterminate?t/e*100:0;return A`
      <div
        class=${R({container:!0,discrete:this._isDeterminate,infinite:!this._isDeterminate,"infinite-long-running":this._longRunning&&!this._isDeterminate})}
        part="container"
        role="progressbar"
        aria-label=${this.ariaLabel}
        aria-valuemin="0"
        aria-valuemax=${String(e)}
        aria-valuenow=${z(this._isDeterminate?String(Math.round(t)):void 0)}
      >
        <div class="track" part="track"></div>
        <div
          class="indicator"
          part="indicator"
          .style=${rl({width:this._isDeterminate?`${n}%`:void 0})}
        ></div>
      </div>
    `}_maybeStartLongRunningTimer(){if(!(!this._isDeterminate&&this.longRunningThreshold>0&&this.isConnected)){this._clearLongRunningTimer(),this._longRunning=!1;return}this._longRunningHandle||=setTimeout(()=>{this._longRunning=!0,this._longRunningHandle=void 0,this.requestUpdate()},this.longRunningThreshold)}_clearLongRunningTimer(){this._longRunningHandle&&=(clearTimeout(this._longRunningHandle),void 0)}};ju.styles=ku,Au([M({reflect:!0,attribute:`aria-label`})],ju.prototype,`ariaLabel`,void 0),Au([M({type:Number,reflect:!0})],ju.prototype,`value`,void 0),Au([M({type:Number,reflect:!0})],ju.prototype,`max`,void 0),Au([M({type:Boolean,reflect:!0})],ju.prototype,`indeterminate`,void 0),Au([M({type:Number,attribute:`long-running-threshold`})],ju.prototype,`longRunningThreshold`,void 0),Au([N()],ju.prototype,`_longRunning`,void 0),ju=Au([I(`vscode-progress-bar`)],ju);var Mu=[L,gl,k`
    :host(:invalid) .icon,
    :host([invalid]) .icon {
      background-color: var(--vscode-inputValidation-errorBackground, #5a1d1d);
      border-color: var(--vscode-inputValidation-errorBorder, #be1100);
    }

    .icon {
      border-radius: 9px;
    }

    .icon.checked:before {
      background-color: currentColor;
      border-radius: 4px;
      content: '';
      height: 8px;
      left: 50%;
      margin: -4px 0 0 -4px;
      position: absolute;
      top: 50%;
      width: 8px;
    }

    :host(:focus):host(:not([disabled])) .icon {
      outline: 1px solid var(--vscode-focusBorder, #0078d4);
      outline-offset: -1px;
    }
  `],Nu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Pu=class extends hl(pl){get form(){return this._internals.form}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}constructor(){super(),this.autofocus=!1,this.checked=!1,this.defaultChecked=!1,this.invalid=!1,this.name=``,this.type=`radio`,this.value=``,this.disabled=!1,this.required=!1,this.tabIndex=0,this._slottedText=``,this._handleClick=()=>{this.disabled||this.checked||(this._checkButton(),this._handleValueChange(),this.dispatchEvent(new Event(`change`,{bubbles:!0})))},this._handleKeyDown=e=>{!this.disabled&&(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),e.key===` `&&!this.checked&&(this.checked=!0,this._handleValueChange(),this.dispatchEvent(new Event(`change`,{bubbles:!0}))),e.key===`Enter`&&this._internals.form?.requestSubmit())},this._internals=this.attachInternals(),this.addEventListener(`keydown`,this._handleKeyDown),this.addEventListener(`click`,this._handleClick)}connectedCallback(){super.connectedCallback(),this._handleValueChange()}update(e){super.update(e),e.has(`checked`)&&this._handleValueChange(),e.has(`required`)&&this._handleValueChange()}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}formResetCallback(){this._getRadios().forEach(e=>{e.checked=e.defaultChecked}),this.updateComplete.then(()=>{this._handleValueChange()})}formStateRestoreCallback(e,t){this.value===e&&e!==``&&(this.checked=!0)}setComponentValidity(e){e?this._internals.setValidity({}):this._internals.setValidity({valueMissing:!0},`Please select one of these options.`,this._inputEl)}_getRadios(){let e=this.getRootNode({composed:!1});if(!e)return[];let t=e.querySelectorAll(`vscode-radio[name="${this.name}"]`);return Array.from(t)}_uncheckOthers(e){e.forEach(e=>{e!==this&&(e.checked=!1)})}_checkButton(){let e=this._getRadios();this.checked=!0,e.forEach(e=>{e!==this&&(e.checked=!1)})}_setGroupValidity(e,t){this.updateComplete.then(()=>{e.forEach(e=>{e.setComponentValidity(t)})})}_setActualFormValue(){let e=``;e=this.checked?this.value?this.value:`on`:null,this._internals.setFormValue(e)}_handleValueChange(){let e=this._getRadios(),t=e.some(e=>e.required);if(this._setActualFormValue(),this.checked)this._uncheckOthers(e),this._setGroupValidity(e,!0);else{let n=!!e.find(e=>e.checked),r=t&&!n;this._setGroupValidity(e,!r)}}render(){let e=R({icon:!0,checked:this.checked}),t=R({"label-inner":!0,"is-slot-empty":this._slottedText===``});return A`
      <div class="wrapper">
        <input
          ?autofocus=${this.autofocus}
          id="input"
          class="radio"
          type="checkbox"
          ?checked=${this.checked}
          value=${this.value}
          tabindex=${this.tabIndex}
        >
        <div class=${e}></div>
        <label for="input" class="label" @click=${this._handleClick}>
          <span class=${t}>
            ${this._renderLabelAttribute()}
            <slot @slotchange=${this._handleSlotChange}></slot>
          </span>
        </label>
      </div>
    `}};Pu.styles=Mu,Pu.formAssociated=!0,Pu.shadowRootOptions={...zc.shadowRootOptions,delegatesFocus:!0},Nu([M({type:Boolean,reflect:!0})],Pu.prototype,`autofocus`,void 0),Nu([M({type:Boolean,reflect:!0})],Pu.prototype,`checked`,void 0),Nu([M({type:Boolean,reflect:!0,attribute:`default-checked`})],Pu.prototype,`defaultChecked`,void 0),Nu([M({type:Boolean,reflect:!0})],Pu.prototype,`invalid`,void 0),Nu([M({reflect:!0})],Pu.prototype,`name`,void 0),Nu([M()],Pu.prototype,`type`,void 0),Nu([M()],Pu.prototype,`value`,void 0),Nu([M({type:Boolean,reflect:!0})],Pu.prototype,`disabled`,void 0),Nu([M({type:Boolean,reflect:!0})],Pu.prototype,`required`,void 0),Nu([M({type:Number,reflect:!0})],Pu.prototype,`tabIndex`,void 0),Nu([N()],Pu.prototype,`_slottedText`,void 0),Nu([P(`#input`)],Pu.prototype,`_inputEl`,void 0),Pu=Nu([I(`vscode-radio`)],Pu);var Fu=[L,k`
    :host {
      display: block;
    }

    .wrapper {
      display: flex;
      flex-wrap: wrap;
    }

    :host([variant='vertical']) .wrapper {
      display: block;
    }

    ::slotted(vscode-radio) {
      margin-right: 20px;
    }

    ::slotted(vscode-radio:last-child) {
      margin-right: 0;
    }

    :host([variant='vertical']) ::slotted(vscode-radio) {
      display: block;
      margin-bottom: 15px;
    }

    :host([variant='vertical']) ::slotted(vscode-radio:last-child) {
      margin-bottom: 0;
    }
  `],Iu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Lu=class extends F{constructor(){super(),this.variant=`horizontal`,this.role=`radiogroup`,this._focusedRadio=-1,this._checkedRadio=-1,this._firstContentLoaded=!1,this._handleKeyDown=e=>{let{key:t}=e;[`ArrowLeft`,`ArrowUp`,`ArrowRight`,`ArrowDown`].includes(t)&&e.preventDefault(),(t===`ArrowRight`||t===`ArrowDown`)&&this._checkNext(),(t===`ArrowLeft`||t===`ArrowUp`)&&this._checkPrev()},this.addEventListener(`keydown`,this._handleKeyDown)}_uncheckPreviousChecked(e,t){e!==-1&&(this._radios[e].checked=!1),t!==-1&&(this._radios[t].tabIndex=-1)}_afterCheck(){this._focusedRadio=this._checkedRadio,this._radios[this._checkedRadio].checked=!0,this._radios[this._checkedRadio].tabIndex=0,this._radios[this._checkedRadio].focus()}_checkPrev(){let e=this._radios.findIndex(e=>e.checked),t=this._radios.findIndex(e=>e.focused),n=t===-1?e:t;this._uncheckPreviousChecked(e,t),n===-1?this._checkedRadio=this._radios.length-1:n-1>=0?this._checkedRadio=n-1:this._checkedRadio=this._radios.length-1,this._afterCheck()}_checkNext(){let e=this._radios.findIndex(e=>e.checked),t=this._radios.findIndex(e=>e.focused),n=t===-1?e:t;this._uncheckPreviousChecked(e,t),n===-1?this._checkedRadio=0:n+1<this._radios.length?this._checkedRadio=n+1:this._checkedRadio=0,this._afterCheck()}_handleChange(e){let t=this._radios.findIndex(t=>t===e.target);t!==-1&&(this._focusedRadio!==-1&&(this._radios[this._focusedRadio].tabIndex=-1),this._checkedRadio!==-1&&this._checkedRadio!==t&&(this._radios[this._checkedRadio].checked=!1),this._focusedRadio=t,this._checkedRadio=t,this._radios[t].tabIndex=0)}_handleSlotChange(){if(!this._firstContentLoaded){let e=this._radios.findIndex(e=>e.autofocus);e>-1&&(this._focusedRadio=e),this._firstContentLoaded=!0}let e=-1;this._radios.forEach((t,n)=>{this._focusedRadio>-1?t.tabIndex=n===this._focusedRadio?0:-1:t.tabIndex=n===0?0:-1,t.defaultChecked&&(e>-1&&(this._radios[e].defaultChecked=!1),e=n)}),e>-1&&(this._radios[e].checked=!0)}render(){return A`
      <div class="wrapper">
        <slot
          @slotchange=${this._handleSlotChange}
          @change=${this._handleChange}
        ></slot>
      </div>
    `}};Lu.styles=Fu,Iu([M({reflect:!0})],Lu.prototype,`variant`,void 0),Iu([M({reflect:!0})],Lu.prototype,`role`,void 0),Iu([Kc({selector:`vscode-radio`})],Lu.prototype,`_radios`,void 0),Iu([N()],Lu.prototype,`_focusedRadio`,void 0),Iu([N()],Lu.prototype,`_checkedRadio`,void 0),Lu=Iu([I(`vscode-radio-group`)],Lu);var Ru=Su,zu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Bu=class extends G{set selectedIndex(e){this._opts.selectedIndex=e;let t=this._opts.getOptionByIndex(e);t?(this._opts.activeIndex=e,this._value=t.value,this._internals.setFormValue(this._value),this._manageRequired()):(this._value=``,this._internals.setFormValue(``),this._manageRequired())}get selectedIndex(){return this._opts.selectedIndex}set value(e){this._opts.value=e,this._opts.selectedIndex>-1?this._requestedValueToSetLater=``:this._requestedValueToSetLater=e,this._internals.setFormValue(this._value),this._manageRequired()}get value(){return this._opts.value}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}updateInputValue(){if(!this.combobox)return;let e=this.renderRoot.querySelector(`.combobox-input`);e&&(e.value=this._opts.getSelectedOption()?.label??``)}constructor(){super(),this.defaultValue=``,this.name=void 0,this.required=!1,this._requestedValueToSetLater=``,this._opts.multiSelect=!1,this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this._manageRequired()})}formResetCallback(){this.value=this.defaultValue}formStateRestoreCallback(e,t){this.updateComplete.then(()=>{this.value=e})}get type(){return`select-one`}get form(){return this._internals.form}async _createAndSelectSuggestedOption(){let e=this._createSuggestedOption();await this.updateComplete,this._opts.selectedIndex=e,this._dispatchChangeEvent();let t=new CustomEvent(`vsc-single-select-create-option`,{detail:{value:this._opts.getOptionByIndex(e)?.value??``}});this.dispatchEvent(t),this.open=!1,this._isPlaceholderOptionActive=!1}_setStateFromSlottedElements(){super._setStateFromSlottedElements(),!this.combobox&&this._opts.selectedIndexes.length===0&&(this._opts.selectedIndex=this._opts.options.length>0?0:-1)}_onSlotChange(){if(super._onSlotChange(),this._requestedValueToSetLater){let e=this._opts.getOptionByValue(this._requestedValueToSetLater);e&&(this._opts.selectedIndex=e.index,this._requestedValueToSetLater=``)}this._opts.selectedIndex>-1&&this._opts.numOptions>0?(this._internals.setFormValue(this._opts.value),this._manageRequired()):(this._internals.setFormValue(null),this._manageRequired())}_onEnterKeyDown(e){super._onEnterKeyDown(e);let t=!1;this.combobox?this.open?this._isPlaceholderOptionActive?this._createAndSelectSuggestedOption():(t=this._opts.activeIndex!==this._opts.selectedIndex,this._opts.selectedIndex=this._opts.activeIndex,this.open=!1):(this.open=!0,this._scrollActiveElementToTop()):this.open?(t=this._opts.activeIndex!==this._opts.selectedIndex,this._opts.selectedIndex=this._opts.activeIndex,this.open=!1):(this.open=!0,this._scrollActiveElementToTop()),t&&(this._dispatchChangeEvent(),this.updateInputValue(),this._internals.setFormValue(this._opts.value),this._manageRequired())}_onOptionClick(e){super._onOptionClick(e);let t=e.composedPath().find(e=>{let t=e;if(`matches`in t)return t.matches(`li.option`)});!t||t.matches(`.disabled`)||(t.classList.contains(`placeholder`)?this.creatable&&this._createAndSelectSuggestedOption():(this._opts.selectedIndex=Number(t.dataset.index),this.open=!1,this._internals.setFormValue(this._value),this._manageRequired(),this._dispatchChangeEvent()))}_manageRequired(){let{value:e}=this;e===``&&this.required?this._internals.setValidity({valueMissing:!0},`Please select an item in the list.`,this._face):this._internals.setValidity({})}_renderSelectFace(){let e=this._opts.getSelectedOption()?.label??``;return A`
      <div
        aria-activedescendant=${this._opts.activeIndex>-1?`op-${this._opts.activeIndex}`:``}
        aria-controls="select-listbox"
        aria-expanded=${this.open?`true`:`false`}
        aria-haspopup="listbox"
        aria-label=${z(this.label)}
        class="select-face face"
        @click=${this._onFaceClick}
        role="combobox"
        tabindex="0"
      >
        <span class="text">${e}</span> ${Zl}
      </div>
    `}_renderComboboxFace(){let e=``;return e=this._isBeingFiltered?this._opts.filterPattern:this._opts.getSelectedOption()?.label??``,A`
      <div class="combobox-face face">
        <input
          aria-activedescendant=${this._opts.activeIndex>-1?`op-${this._opts.activeIndex}`:``}
          aria-autocomplete="list"
          aria-controls="select-listbox"
          aria-expanded=${this.open?`true`:`false`}
          aria-haspopup="listbox"
          aria-label=${z(this.label)}
          class="combobox-input"
          role="combobox"
          spellcheck="false"
          type="text"
          autocomplete="off"
          .value=${e}
          @focus=${this._onComboboxInputFocus}
          @blur=${this._onComboboxInputBlur}
          @input=${this._onComboboxInputInput}
          @click=${this._onComboboxInputClick}
          @keydown=${this._onComboboxInputSpaceKeyDown}
        >
        <button
          aria-label="Open the list of options"
          class="combobox-button"
          type="button"
          @click=${this._onComboboxButtonClick}
          @keydown=${this._onComboboxButtonKeyDown}
          tabindex="-1"
        >
          ${Zl}
        </button>
      </div>
    `}render(){return A`
      <div class="single-select">
        <slot class="main-slot" @slotchange=${this._onSlotChange}></slot>
        ${this.combobox?this._renderComboboxFace():this._renderSelectFace()}
        ${this._renderDropdown()}
      </div>
    `}};Bu.styles=Ru,Bu.shadowRootOptions={...zc.shadowRootOptions,delegatesFocus:!0},Bu.formAssociated=!0,zu([M({attribute:`default-value`})],Bu.prototype,`defaultValue`,void 0),zu([M({reflect:!0})],Bu.prototype,`name`,void 0),zu([M({type:Number,attribute:`selected-index`})],Bu.prototype,`selectedIndex`,null),zu([M({type:String})],Bu.prototype,`value`,null),zu([M({type:Boolean,reflect:!0})],Bu.prototype,`required`,void 0),zu([P(`.face`)],Bu.prototype,`_face`,void 0),Bu=zu([I(`vscode-single-select`)],Bu);var Vu=[L,k`
    :host {
      --separator-border: var(--vscode-editorWidget-border, #454545);

      border: 1px solid var(--vscode-editorWidget-border, #454545);
      display: block;
      overflow: hidden;
      position: relative;
    }

    ::slotted(*) {
      height: 100%;
      width: 100%;
    }

    ::slotted(vscode-split-layout) {
      border: 0;
    }

    .wrapper {
      display: flex;
      height: 100%;
      width: 100%;
    }

    .wrapper.horizontal {
      flex-direction: column;
    }

    .start {
      box-sizing: border-box;
      flex: 1;
      min-height: 0;
      min-width: 0;
    }

    :host([split='vertical']) .start {
      border-right: 1px solid var(--separator-border);
    }

    :host([split='horizontal']) .start {
      border-bottom: 1px solid var(--separator-border);
    }

    .end {
      flex: 1;
      min-height: 0;
      min-width: 0;
    }

    :host([split='vertical']) .start,
    :host([split='vertical']) .end {
      height: 100%;
    }

    :host([split='horizontal']) .start,
    :host([split='horizontal']) .end {
      width: 100%;
    }

    .handle-overlay {
      display: none;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 1;
    }

    .handle-overlay.active {
      display: block;
    }

    .handle-overlay.split-vertical {
      cursor: ew-resize;
    }

    .handle-overlay.split-horizontal {
      cursor: ns-resize;
    }

    .handle {
      background-color: transparent;
      position: absolute;
      z-index: 2;
    }

    .handle.hover {
      transition: background-color 0.1s ease-out 0.3s;
      background-color: var(--vscode-sash-hoverBorder, #0078d4);
    }

    .handle.hide {
      background-color: transparent;
      transition: background-color 0.1s ease-out;
    }

    .handle.split-vertical {
      cursor: ew-resize;
      height: 100%;
    }

    .handle.split-horizontal {
      cursor: ns-resize;
      width: 100%;
    }
  `],Hu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Uu,Wu=`50%`,Gu=4;const Ku=e=>{if(!e)return{value:0,unit:`pixel`};let t,n;return e.endsWith(`%`)?(t=`percent`,n=+e.substring(0,e.length-1)):e.endsWith(`px`)?(t=`pixel`,n=+e.substring(0,e.length-2)):(t=`pixel`,n=+e),{unit:t,value:isNaN(n)?0:n}},qu=(e,t)=>t===0?0:Math.min(100,e/t*100),Ju=(e,t)=>t*(e/100);var K=Uu=class extends F{set split(e){this._split!==e&&(this._split=e,this.resetHandlePosition())}get split(){return this._split}set handlePosition(e){this._rawHandlePosition=e,this._handlePositionPropChanged()}get handlePosition(){return this._rawHandlePosition}set fixedPane(e){this._fixedPane=e,this._fixedPanePropChanged()}get fixedPane(){return this._fixedPane}constructor(){super(),this._split=`vertical`,this.resetOnDblClick=!1,this.handleSize=4,this.initialHandlePosition=Wu,this._fixedPane=`none`,this._handlePosition=0,this._isDragActive=!1,this._hover=!1,this._hide=!1,this._boundRect=new DOMRect,this._handleOffset=0,this._wrapperObserved=!1,this._fixedPaneSize=0,this._handleResize=e=>{let t=e[0].contentRect,{width:n,height:r}=t;this._boundRect=t;let i=this.split===`vertical`?n:r;this.fixedPane===`start`&&(this._handlePosition=this._fixedPaneSize),this.fixedPane===`end`&&(this._handlePosition=i-this._fixedPaneSize)},this._handleMouseUp=e=>{this._isDragActive=!1,e.target!==this&&(this._hover=!1,this._hide=!0),window.removeEventListener(`mouseup`,this._handleMouseUp),window.removeEventListener(`mousemove`,this._handleMouseMove);let{width:t,height:n}=this._boundRect,r=this.split===`vertical`?t:n,i=qu(this._handlePosition,r);this.dispatchEvent(new CustomEvent(`vsc-split-layout-change`,{detail:{position:this._handlePosition,positionInPercentage:i},composed:!0}))},this._handleMouseMove=e=>{let{clientX:t,clientY:n}=e,{left:r,top:i,height:a,width:o}=this._boundRect,s=this.split===`vertical`,c=s?o:a,l=s?t-r:n-i;this._handlePosition=Math.max(0,Math.min(l-this._handleOffset+this.handleSize/2,c)),this.fixedPane===`start`&&(this._fixedPaneSize=this._handlePosition),this.fixedPane===`end`&&(this._fixedPaneSize=c-this._handlePosition)},this._resizeObserver=new ResizeObserver(this._handleResize)}resetHandlePosition(){if(!this._wrapperEl){this._handlePosition=0;return}let{width:e,height:t}=this._wrapperEl.getBoundingClientRect(),n=this.split===`vertical`?e:t,{value:r,unit:i}=Ku(this.initialHandlePosition??Wu);i===`percent`?this._handlePosition=Ju(r,n):this._handlePosition=r}connectedCallback(){super.connectedCallback()}firstUpdated(e){this.fixedPane!==`none`&&(this._resizeObserver.observe(this._wrapperEl),this._wrapperObserved=!0),this._boundRect=this._wrapperEl.getBoundingClientRect();let{value:t,unit:n}=this.handlePosition?Ku(this.handlePosition):Ku(this.initialHandlePosition);this._setPosition(t,n),this._initFixedPane()}_handlePositionPropChanged(){if(this.handlePosition&&this._wrapperEl){this._boundRect=this._wrapperEl.getBoundingClientRect();let{value:e,unit:t}=Ku(this.handlePosition);this._setPosition(e,t)}}_fixedPanePropChanged(){this._wrapperEl&&this._initFixedPane()}_initFixedPane(){if(this.fixedPane===`none`)this._wrapperObserved&&=(this._resizeObserver.unobserve(this._wrapperEl),!1);else{let{width:e,height:t}=this._boundRect,n=this.split===`vertical`?e:t;this._fixedPaneSize=this.fixedPane===`start`?this._handlePosition:n-this._handlePosition,this._wrapperObserved||=(this._resizeObserver.observe(this._wrapperEl),!0)}}_setPosition(e,t){let{width:n,height:r}=this._boundRect,i=this.split===`vertical`?n:r;this._handlePosition=t===`percent`?Ju(e,i):e}_handleMouseOver(){this._hover=!0,this._hide=!1}_handleMouseOut(e){e.buttons!==1&&(this._hover=!1,this._hide=!0)}_handleMouseDown(e){e.stopPropagation(),e.preventDefault(),this._boundRect=this._wrapperEl.getBoundingClientRect();let{left:t,top:n}=this._boundRect,{left:r,top:i}=this._handleEl.getBoundingClientRect(),a=e.clientX-t,o=e.clientY-n;this.split===`vertical`&&(this._handleOffset=a-(r-t)),this.split===`horizontal`&&(this._handleOffset=o-(i-n)),this._isDragActive=!0,window.addEventListener(`mouseup`,this._handleMouseUp),window.addEventListener(`mousemove`,this._handleMouseMove)}_handleDblClick(){this.resetOnDblClick&&this.resetHandlePosition()}_handleSlotChange(){[...this._nestedLayoutsAtStart,...this._nestedLayoutsAtEnd].forEach(e=>{e instanceof Uu&&e.resetHandlePosition()})}render(){let{width:e,height:t}=this._boundRect,n=this.split===`vertical`?e:t,r=this.fixedPane===`none`?`${qu(this._handlePosition,n)}%`:`${this._handlePosition}px`,i=``;i=this.fixedPane===`start`?`0 0 ${this._fixedPaneSize}px`:`1 1 ${qu(this._handlePosition,n)}%`;let a=``;a=this.fixedPane===`end`?`0 0 ${this._fixedPaneSize}px`:`1 1 ${qu(n-this._handlePosition,n)}%`;let o={left:this.split===`vertical`?r:`0`,top:this.split===`vertical`?`0`:r},s=this.handleSize??Gu;this.split===`vertical`&&(o.marginLeft=`${0-s/2}px`,o.width=`${s}px`),this.split===`horizontal`&&(o.height=`${s}px`,o.marginTop=`${0-s/2}px`);let c=R({"handle-overlay":!0,active:this._isDragActive,"split-vertical":this.split===`vertical`,"split-horizontal":this.split===`horizontal`}),l=R({handle:!0,hover:this._hover,hide:this._hide,"split-vertical":this.split===`vertical`,"split-horizontal":this.split===`horizontal`});return A`
      <div class=${R({wrapper:!0,horizontal:this.split===`horizontal`})}>
        <div class="start" .style=${rl({flex:i})}>
          <slot name="start" @slotchange=${this._handleSlotChange}></slot>
        </div>
        <div class="end" .style=${rl({flex:a})}>
          <slot name="end" @slotchange=${this._handleSlotChange}></slot>
        </div>
        <div class=${c}></div>
        <div
          class=${l}
          .style=${rl(o)}
          @mouseover=${this._handleMouseOver}
          @mouseout=${this._handleMouseOut}
          @mousedown=${this._handleMouseDown}
          @dblclick=${this._handleDblClick}
        ></div>
      </div>
    `}};K.styles=Vu,Hu([M({reflect:!0})],K.prototype,`split`,null),Hu([M({type:Boolean,reflect:!0,attribute:`reset-on-dbl-click`})],K.prototype,`resetOnDblClick`,void 0),Hu([M({type:Number,reflect:!0,attribute:`handle-size`})],K.prototype,`handleSize`,void 0),Hu([M({reflect:!0,attribute:`initial-handle-position`})],K.prototype,`initialHandlePosition`,void 0),Hu([M({attribute:`handle-position`})],K.prototype,`handlePosition`,null),Hu([M({attribute:`fixed-pane`})],K.prototype,`fixedPane`,null),Hu([N()],K.prototype,`_handlePosition`,void 0),Hu([N()],K.prototype,`_isDragActive`,void 0),Hu([N()],K.prototype,`_hover`,void 0),Hu([N()],K.prototype,`_hide`,void 0),Hu([P(`.wrapper`)],K.prototype,`_wrapperEl`,void 0),Hu([P(`.handle`)],K.prototype,`_handleEl`,void 0),Hu([Kc({slot:`start`,selector:`vscode-split-layout`})],K.prototype,`_nestedLayoutsAtStart`,void 0),Hu([Kc({slot:`end`,selector:`vscode-split-layout`})],K.prototype,`_nestedLayoutsAtEnd`,void 0),K=Uu=Hu([I(`vscode-split-layout`)],K);var Yu=[L,k`
    :host {
      cursor: pointer;
      display: block;
      user-select: none;
    }

    .wrapper {
      align-items: center;
      border-bottom: 1px solid transparent;
      color: var(--vscode-foreground, #cccccc);
      display: flex;
      min-height: 20px;
      overflow: hidden;
      padding: 7px 8px;
      position: relative;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([active]) .wrapper {
      border-bottom-color: var(--vscode-panelTitle-activeForeground, #cccccc);
      color: var(--vscode-panelTitle-activeForeground, #cccccc);
    }

    :host([panel]) .wrapper {
      border-bottom: 0;
      margin-bottom: 0;
      padding: 0;
    }

    :host(:focus-visible) {
      outline: none;
    }

    .wrapper {
      align-items: center;
      color: var(--vscode-foreground, #cccccc);
      display: flex;
      min-height: 20px;
      overflow: inherit;
      text-overflow: inherit;
      position: relative;
    }

    .wrapper.panel {
      color: var(--vscode-panelTitle-inactiveForeground, #9d9d9d);
    }

    .wrapper.panel.active,
    .wrapper.panel:hover {
      color: var(--vscode-panelTitle-activeForeground, #cccccc);
    }

    :host([panel]) .wrapper {
      display: flex;
      font-size: 11px;
      height: 31px;
      padding: 2px 10px;
      text-transform: uppercase;
    }

    .main {
      overflow: inherit;
      text-overflow: inherit;
    }

    .active-indicator {
      display: none;
    }

    .active-indicator.panel.active {
      border-top: 1px solid var(--vscode-panelTitle-activeBorder, #0078d4);
      bottom: 4px;
      display: block;
      left: 8px;
      pointer-events: none;
      position: absolute;
      right: 8px;
    }

    :host(:focus-visible) .wrapper {
      outline-color: var(--vscode-focusBorder, #0078d4);
      outline-offset: 3px;
      outline-style: solid;
      outline-width: 1px;
    }

    :host(:focus-visible) .wrapper.panel {
      outline-offset: -2px;
    }

    slot[name='content-before']::slotted(vscode-badge) {
      margin-right: 8px;
    }

    slot[name='content-after']::slotted(vscode-badge) {
      margin-left: 8px;
    }
  `],Xu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Zu=class extends F{constructor(){super(...arguments),this.active=!1,this.ariaControls=``,this.panel=!1,this.role=`tab`,this.tabId=-1}attributeChangedCallback(e,t,n){if(super.attributeChangedCallback(e,t,n),e===`active`){let e=n!==null;this.ariaSelected=e?`true`:`false`,this.tabIndex=e?0:-1}}render(){return A`
      <div
        class=${R({wrapper:!0,active:this.active,panel:this.panel})}
      >
        <div class="before"><slot name="content-before"></slot></div>
        <div class="main"><slot></slot></div>
        <div class="after"><slot name="content-after"></slot></div>
        <span
          class=${R({"active-indicator":!0,active:this.active,panel:this.panel})}
        ></span>
      </div>
    `}};Zu.styles=Yu,Xu([M({type:Boolean,reflect:!0})],Zu.prototype,`active`,void 0),Xu([M({reflect:!0,attribute:`aria-controls`})],Zu.prototype,`ariaControls`,void 0),Xu([M({type:Boolean,reflect:!0})],Zu.prototype,`panel`,void 0),Xu([M({reflect:!0})],Zu.prototype,`role`,void 0),Xu([M({type:Number,reflect:!0,attribute:`tab-id`})],Zu.prototype,`tabId`,void 0),Zu=Xu([I(`vscode-tab-header`)],Zu);var Qu=[L,k`
    :host {
      display: block;
      overflow: hidden;
    }

    :host(:focus-visible) {
      outline-color: var(--vscode-focusBorder, #0078d4);
      outline-offset: 3px;
      outline-style: solid;
      outline-width: 1px;
    }

    :host([panel]) {
      background-color: var(--vscode-panel-background, #181818);
    }
  `],$u=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ed=class extends F{constructor(){super(...arguments),this.hidden=!1,this.ariaLabelledby=``,this.panel=!1,this.role=`tabpanel`,this.tabIndex=0}render(){return A` <slot></slot> `}};ed.styles=Qu,$u([M({type:Boolean,reflect:!0})],ed.prototype,`hidden`,void 0),$u([M({reflect:!0,attribute:`aria-labelledby`})],ed.prototype,`ariaLabelledby`,void 0),$u([M({type:Boolean,reflect:!0})],ed.prototype,`panel`,void 0),$u([M({reflect:!0})],ed.prototype,`role`,void 0),$u([M({type:Number,reflect:!0})],ed.prototype,`tabIndex`,void 0),ed=$u([I(`vscode-tab-panel`)],ed);var td=[L,k`
    :host {
      display: table;
      table-layout: fixed;
      width: 100%;
    }

    ::slotted(vscode-table-row:nth-child(even)) {
      background-color: var(--vsc-row-even-background);
    }

    ::slotted(vscode-table-row:nth-child(odd)) {
      background-color: var(--vsc-row-odd-background);
    }
  `],nd=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},rd=class extends F{constructor(){super(...arguments),this.role=`rowgroup`}render(){return A` <slot></slot> `}};rd.styles=td,nd([M({reflect:!0})],rd.prototype,`role`,void 0),rd=nd([I(`vscode-table-body`)],rd);var id=[L,k`
    :host {
      border-bottom-color: var(
        --vscode-editorGroup-border,
        rgba(255, 255, 255, 0.09)
      );
      border-bottom-style: solid;
      border-bottom-width: var(--vsc-row-border-bottom-width);
      box-sizing: border-box;
      color: var(--vscode-foreground, #cccccc);
      display: table-cell;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      height: 24px;
      overflow: hidden;
      padding-left: 10px;
      text-overflow: ellipsis;
      vertical-align: middle;
      white-space: nowrap;
    }

    :host([compact]) {
      display: block;
      height: auto;
      padding-bottom: 5px;
      width: 100% !important;
    }

    :host([compact]:first-child) {
      padding-top: 10px;
    }

    :host([compact]:last-child) {
      padding-bottom: 10px;
    }

    .wrapper {
      overflow: inherit;
      text-overflow: inherit;
      white-space: inherit;
      width: 100%;
    }

    .column-label {
      font-weight: bold;
    }
  `],ad=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},od=class extends F{constructor(){super(...arguments),this.role=`cell`,this.columnLabel=``,this.compact=!1}render(){return A`
      <div class="wrapper">
        ${this.columnLabel?A`<div class="column-label" role="presentation">
          ${this.columnLabel}
        </div>`:j}
        <slot></slot>
      </div>
    `}};od.styles=id,ad([M({reflect:!0})],od.prototype,`role`,void 0),ad([M({attribute:`column-label`})],od.prototype,`columnLabel`,void 0),ad([M({type:Boolean,reflect:!0})],od.prototype,`compact`,void 0),od=ad([I(`vscode-table-cell`)],od);var sd=[L,k`
    :host {
      background-color: var(
        --vscode-keybindingTable-headerBackground,
        rgba(204, 204, 204, 0.04)
      );
      display: table;
      table-layout: fixed;
      width: 100%;
    }
  `],cd=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ld=class extends F{constructor(){super(...arguments),this.role=`rowgroup`}render(){return A` <slot></slot> `}};ld.styles=sd,cd([M({reflect:!0})],ld.prototype,`role`,void 0),ld=cd([I(`vscode-table-header`)],ld);var ud=[L,k`
    :host {
      box-sizing: border-box;
      color: var(--vscode-foreground, #cccccc);
      display: table-cell;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: bold;
      line-height: 20px;
      overflow: hidden;
      padding-bottom: 5px;
      padding-left: 10px;
      padding-right: 0;
      padding-top: 5px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .wrapper {
      box-sizing: inherit;
      overflow: inherit;
      text-overflow: inherit;
      white-space: inherit;
      width: 100%;
    }
  `],dd=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},fd=class extends F{constructor(){super(...arguments),this.role=`columnheader`}render(){return A`
      <div class="wrapper">
        <slot></slot>
      </div>
    `}};fd.styles=ud,dd([M({reflect:!0})],fd.prototype,`role`,void 0),fd=dd([I(`vscode-table-header-cell`)],fd);var pd=[L,k`
    :host {
      border-top-color: var(
        --vscode-editorGroup-border,
        rgba(255, 255, 255, 0.09)
      );
      border-top-style: solid;
      border-top-width: var(--vsc-row-border-top-width);
      display: var(--vsc-row-display);
      width: 100%;
    }
  `],md=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},hd=class extends F{constructor(){super(...arguments),this.role=`row`}render(){return A` <slot></slot> `}};hd.styles=pd,md([M({reflect:!0})],hd.prototype,`role`,void 0),hd=md([I(`vscode-table-row`)],hd);const gd=(e,t)=>typeof e==`number`&&!Number.isNaN(e)?e/t*100:typeof e==`string`&&/^[0-9.]+$/.test(e)?Number(e)/t*100:typeof e==`string`&&/^[0-9.]+%$/.test(e)?Number(e.substring(0,e.length-1)):typeof e==`string`&&/^[0-9.]+px$/.test(e)?Number(e.substring(0,e.length-2))/t*100:null;var _d=[L,k`
    :host {
      display: block;
      --vsc-row-even-background: transparent;
      --vsc-row-odd-background: transparent;
      --vsc-row-border-bottom-width: 0;
      --vsc-row-border-top-width: 0;
      --vsc-row-display: table-row;
    }

    :host([bordered]),
    :host([bordered-rows]) {
      --vsc-row-border-bottom-width: 1px;
    }

    :host([compact]) {
      --vsc-row-display: block;
    }

    :host([bordered][compact]),
    :host([bordered-rows][compact]) {
      --vsc-row-border-bottom-width: 0;
      --vsc-row-border-top-width: 1px;
    }

    :host([zebra]) {
      --vsc-row-even-background: var(
        --vscode-keybindingTable-rowsBackground,
        rgba(204, 204, 204, 0.04)
      );
    }

    :host([zebra-odd]) {
      --vsc-row-odd-background: var(
        --vscode-keybindingTable-rowsBackground,
        rgba(204, 204, 204, 0.04)
      );
    }

    ::slotted(vscode-table-row) {
      width: 100%;
    }

    .wrapper {
      height: 100%;
      max-width: 100%;
      overflow: hidden;
      position: relative;
      width: 100%;
    }

    .wrapper.select-disabled {
      user-select: none;
    }

    .wrapper.resize-cursor {
      cursor: ew-resize;
    }

    .wrapper.compact-view .header-slot-wrapper {
      height: 0;
      overflow: hidden;
    }

    .scrollable {
      height: 100%;
    }

    .scrollable:before {
      background-color: transparent;
      content: '';
      display: block;
      height: 1px;
      position: absolute;
      width: 100%;
    }

    .wrapper:not(.compact-view) .scrollable:not([scrolled]):before {
      background-color: var(
        --vscode-editorGroup-border,
        rgba(255, 255, 255, 0.09)
      );
    }

    .sash {
      visibility: hidden;
    }

    :host([bordered-columns]) .sash,
    :host([bordered]) .sash {
      visibility: visible;
    }

    :host([resizable]) .wrapper:hover .sash {
      visibility: visible;
    }

    .sash {
      height: 100%;
      position: absolute;
      top: 0;
      width: 1px;
    }

    .wrapper.compact-view .sash {
      display: none;
    }

    .sash.resizable {
      cursor: ew-resize;
    }

    .sash-visible {
      background-color: var(
        --vscode-editorGroup-border,
        rgba(255, 255, 255, 0.09)
      );
      height: 100%;
      position: absolute;
      top: 30px;
      width: 1px;
    }

    .sash.hover .sash-visible {
      background-color: var(--vscode-sash-hoverBorder, #0078d4);
      transition: background-color 50ms linear 300ms;
    }

    .sash .sash-clickable {
      background-color: transparent;
      height: 100%;
      left: -2px;
      position: absolute;
      width: 5px;
    }
  `],q=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},vd=100,J=class extends F{constructor(){super(...arguments),this.role=`table`,this.resizable=!1,this.responsive=!1,this.bordered=!1,this.borderedColumns=!1,this.borderedRows=!1,this.breakpoint=300,this.minColumnWidth=`50px`,this.delayedResizing=!1,this.compact=!1,this.zebra=!1,this.zebraOdd=!1,this._sashPositions=[],this._isDragging=!1,this._sashHovers=[],this._columns=[],this._activeSashElementIndex=-1,this._activeSashCursorOffset=0,this._componentX=0,this._componentH=0,this._componentW=0,this._headerCells=[],this._cellsOfFirstRow=[],this._prevHeaderHeight=0,this._prevComponentHeight=0,this._componentResizeObserverCallback=()=>{this._memoizeComponentDimensions(),this._updateResizeHandlersSize(),this.responsive&&this._toggleCompactView(),this._resizeTableBody()},this._headerResizeObserverCallback=()=>{this._updateResizeHandlersSize()},this._bodyResizeObserverCallback=()=>{this._resizeTableBody()},this._onResizingMouseMove=e=>{e.stopPropagation(),this._updateActiveSashPosition(e.pageX),this.delayedResizing?this._resizeColumns(!1):this._resizeColumns(!0)},this._onResizingMouseUp=e=>{this._resizeColumns(!0),this._updateActiveSashPosition(e.pageX),this._sashHovers[this._activeSashElementIndex]=!1,this._isDragging=!1,this._activeSashElementIndex=-1,document.removeEventListener(`mousemove`,this._onResizingMouseMove),document.removeEventListener(`mouseup`,this._onResizingMouseUp)}}set columns(e){this._columns=e,this.isConnected&&this._initDefaultColumnSizes()}get columns(){return this._columns}connectedCallback(){super.connectedCallback(),this._memoizeComponentDimensions(),this._initDefaultColumnSizes()}disconnectedCallback(){super.disconnectedCallback(),this._componentResizeObserver?.unobserve(this),this._componentResizeObserver?.disconnect(),this._bodyResizeObserver?.disconnect()}_px2Percent(e){return e/this._componentW*100}_percent2Px(e){return this._componentW*e/100}_memoizeComponentDimensions(){let e=this.getBoundingClientRect();this._componentH=e.height,this._componentW=e.width,this._componentX=e.x}_queryHeaderCells(){let e=this._assignedHeaderElements;return e&&e[0]?Array.from(e[0].querySelectorAll(`vscode-table-header-cell`)):[]}_getHeaderCells(){return this._headerCells.length||(this._headerCells=this._queryHeaderCells()),this._headerCells}_queryCellsOfFirstRow(){let e=this._assignedBodyElements;return e&&e[0]?Array.from(e[0].querySelectorAll(`vscode-table-row:first-child vscode-table-cell`)):[]}_getCellsOfFirstRow(){return this._cellsOfFirstRow.length||(this._cellsOfFirstRow=this._queryCellsOfFirstRow()),this._cellsOfFirstRow}_resizeTableBody(){let e=0,t=0,n=this.getBoundingClientRect().height;this._assignedHeaderElements&&this._assignedHeaderElements.length&&(e=this._assignedHeaderElements[0].getBoundingClientRect().height),this._assignedBodyElements&&this._assignedBodyElements.length&&(t=this._assignedBodyElements[0].getBoundingClientRect().height);let r=t-e-n;this._scrollableElement.style.height=r>0?`${n-e}px`:`auto`}_initResizeObserver(){this._componentResizeObserver=new ResizeObserver(this._componentResizeObserverCallback),this._componentResizeObserver.observe(this),this._headerResizeObserver=new ResizeObserver(this._headerResizeObserverCallback),this._headerResizeObserver.observe(this._headerElement)}_calcColWidthPercentages(){let e=this._getHeaderCells().length,t=this.columns.slice(0,e),n=t.filter(e=>e===`auto`).length+e-t.length,r=100;if(t=t.map(e=>{let t=gd(e,this._componentW);return t===null?`auto`:(r-=t,t)}),t.length<e)for(let n=t.length;n<e;n++)t.push(`auto`);return t=t.map(e=>e===`auto`?r/n:e),t}_initHeaderCellSizes(e){this._getHeaderCells().forEach((t,n)=>{t.style.width=`${e[n]}%`})}_initBodyColumnSizes(e){this._getCellsOfFirstRow().forEach((t,n)=>{t.style.width=`${e[n]}%`})}_initSashes(e){let t=e.length,n=0;this._sashPositions=[],e.forEach((e,r)=>{if(r<t-1){let t=n+e;this._sashPositions.push(t),n=t}})}_initDefaultColumnSizes(){let e=this._calcColWidthPercentages();this._initHeaderCellSizes(e),this._initBodyColumnSizes(e),this._initSashes(e)}_updateResizeHandlersSize(){let e=this._headerElement.getBoundingClientRect();if(e.height===this._prevHeaderHeight&&this._componentH===this._prevComponentHeight)return;this._prevHeaderHeight=e.height,this._prevComponentHeight=this._componentH;let t=this._componentH-e.height;this._sashVisibleElements.forEach(n=>{n.style.height=`${t}px`,n.style.top=`${e.height}px`})}_applyCompactViewColumnLabels(){let e=this._getHeaderCells().map(e=>e.innerText);this.querySelectorAll(`vscode-table-row`).forEach(t=>{t.querySelectorAll(`vscode-table-cell`).forEach((t,n)=>{t.columnLabel=e[n],t.compact=!0})})}_clearCompactViewColumnLabels(){this.querySelectorAll(`vscode-table-cell`).forEach(e=>{e.columnLabel=``,e.compact=!1})}_toggleCompactView(){let e=this.getBoundingClientRect().width<this.breakpoint;this.compact!==e&&(this.compact=e,e?this._applyCompactViewColumnLabels():this._clearCompactViewColumnLabels())}_onDefaultSlotChange(){this._assignedElements.forEach(e=>{if(e.tagName.toLowerCase()===`vscode-table-header`){e.slot=`header`;return}if(e.tagName.toLowerCase()===`vscode-table-body`){e.slot=`body`;return}})}_onHeaderSlotChange(){this._headerCells=this._queryHeaderCells()}_onBodySlotChange(){if(this._initDefaultColumnSizes(),this._initResizeObserver(),this._updateResizeHandlersSize(),!this._bodyResizeObserver){let e=this._assignedBodyElements[0]??null;e&&(this._bodyResizeObserver=new ResizeObserver(this._bodyResizeObserverCallback),this._bodyResizeObserver.observe(e))}}_onSashMouseOver(e){if(this._isDragging)return;let t=e.currentTarget,n=Number(t.dataset.index);this._sashHovers[n]=!0,this.requestUpdate()}_onSashMouseOut(e){if(e.stopPropagation(),this._isDragging)return;let t=e.currentTarget,n=Number(t.dataset.index);this._sashHovers[n]=!1,this.requestUpdate()}_onSashMouseDown(e){e.stopPropagation();let{pageX:t,currentTarget:n}=e,r=n,i=Number(r.dataset.index),a=r.getBoundingClientRect().x;this._isDragging=!0,this._activeSashElementIndex=i,this._sashHovers[this._activeSashElementIndex]=!0,this._activeSashCursorOffset=this._px2Percent(t-a);let o=this._getHeaderCells();this._headerCellsToResize=[],this._headerCellsToResize.push(o[i]),o[i+1]&&(this._headerCellsToResize[1]=o[i+1]);let s=this._bodySlot.assignedElements()[0].querySelectorAll(`vscode-table-row:first-child > vscode-table-cell`);this._cellsToResize=[],this._cellsToResize.push(s[i]),s[i+1]&&this._cellsToResize.push(s[i+1]),document.addEventListener(`mousemove`,this._onResizingMouseMove),document.addEventListener(`mouseup`,this._onResizingMouseUp)}_updateActiveSashPosition(e){let{prevSashPos:t,nextSashPos:n}=this._getSashPositions(),r=gd(this.minColumnWidth,this._componentW);r===null&&(r=0);let i=t?t+r:r,a=n?n-r:vd-r,o=this._px2Percent(e-this._componentX-this._percent2Px(this._activeSashCursorOffset));o=Math.max(o,i),o=Math.min(o,a),this._sashPositions[this._activeSashElementIndex]=o,this.requestUpdate()}_getSashPositions(){return{sashPos:this._sashPositions[this._activeSashElementIndex],prevSashPos:this._sashPositions[this._activeSashElementIndex-1]||0,nextSashPos:this._sashPositions[this._activeSashElementIndex+1]||vd}}_resizeColumns(e=!0){let{sashPos:t,prevSashPos:n,nextSashPos:r}=this._getSashPositions(),i=t-n,a=r-t,o=`${i}%`,s=`${a}%`;this._headerCellsToResize[0].style.width=o,this._headerCellsToResize[1]&&(this._headerCellsToResize[1].style.width=s),e&&this._cellsToResize[0]&&(this._cellsToResize[0].style.width=o,this._cellsToResize[1]&&(this._cellsToResize[1].style.width=s))}render(){let e=this._sashPositions.map((e,t)=>{let n=R({sash:!0,hover:this._sashHovers[t],resizable:this.resizable}),r=`${e}%`;return this.resizable?A`
            <div
              class=${n}
              data-index=${t}
              .style=${rl({left:r})}
              @mousedown=${this._onSashMouseDown}
              @mouseover=${this._onSashMouseOver}
              @mouseout=${this._onSashMouseOut}
            >
              <div class="sash-visible"></div>
              <div class="sash-clickable"></div>
            </div>
          `:A`<div
            class=${n}
            data-index=${t}
            .style=${rl({left:r})}
          >
            <div class="sash-visible"></div>
          </div>`});return A`
      <div class=${R({wrapper:!0,"select-disabled":this._isDragging,"resize-cursor":this._isDragging,"compact-view":this.compact})}>
        <div class="header">
          <slot name="caption"></slot>
          <div class="header-slot-wrapper">
            <slot name="header" @slotchange=${this._onHeaderSlotChange}></slot>
          </div>
        </div>
        <vscode-scrollable class="scrollable">
          <div>
            <slot name="body" @slotchange=${this._onBodySlotChange}></slot>
          </div>
        </vscode-scrollable>
        ${e}
        <slot @slotchange=${this._onDefaultSlotChange}></slot>
      </div>
    `}};J.styles=_d,q([M({reflect:!0})],J.prototype,`role`,void 0),q([M({type:Boolean,reflect:!0})],J.prototype,`resizable`,void 0),q([M({type:Boolean,reflect:!0})],J.prototype,`responsive`,void 0),q([M({type:Boolean,reflect:!0})],J.prototype,`bordered`,void 0),q([M({type:Boolean,reflect:!0,attribute:`bordered-columns`})],J.prototype,`borderedColumns`,void 0),q([M({type:Boolean,reflect:!0,attribute:`bordered-rows`})],J.prototype,`borderedRows`,void 0),q([M({type:Number})],J.prototype,`breakpoint`,void 0),q([M({type:Array})],J.prototype,`columns`,null),q([M({attribute:`min-column-width`})],J.prototype,`minColumnWidth`,void 0),q([M({type:Boolean,reflect:!0,attribute:`delayed-resizing`})],J.prototype,`delayedResizing`,void 0),q([M({type:Boolean,reflect:!0})],J.prototype,`compact`,void 0),q([M({type:Boolean,reflect:!0})],J.prototype,`zebra`,void 0),q([M({type:Boolean,reflect:!0,attribute:`zebra-odd`})],J.prototype,`zebraOdd`,void 0),q([P(`slot[name="body"]`)],J.prototype,`_bodySlot`,void 0),q([P(`.header`)],J.prototype,`_headerElement`,void 0),q([P(`.scrollable`)],J.prototype,`_scrollableElement`,void 0),q([Gc(`.sash-visible`)],J.prototype,`_sashVisibleElements`,void 0),q([Kc({flatten:!0,selector:`vscode-table-header, vscode-table-body`})],J.prototype,`_assignedElements`,void 0),q([Kc({slot:`header`,flatten:!0,selector:`vscode-table-header`})],J.prototype,`_assignedHeaderElements`,void 0),q([Kc({slot:`body`,flatten:!0,selector:`vscode-table-body`})],J.prototype,`_assignedBodyElements`,void 0),q([N()],J.prototype,`_sashPositions`,void 0),q([N()],J.prototype,`_isDragging`,void 0),J=q([I(`vscode-table`)],J);var yd=[L,k`
    :host {
      display: block;
    }

    .header {
      align-items: center;
      display: flex;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      width: 100%;
    }

    .header {
      border-bottom-color: var(--vscode-settings-headerBorder, #2b2b2b);
      border-bottom-style: solid;
      border-bottom-width: 1px;
    }

    .header.panel {
      background-color: var(--vscode-panel-background, #181818);
      border-bottom-width: 0;
      box-sizing: border-box;
      padding-left: 8px;
      padding-right: 8px;
    }

    .tablist {
      display: flex;
      margin-bottom: -1px;
    }

    slot[name='addons'] {
      display: block;
      margin-left: auto;
    }
  `],bd=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},xd=class extends F{constructor(){super(),this.panel=!1,this.selectedIndex=0,this._tabHeaders=[],this._tabPanels=[],this._componentId=``,this._tabFocus=0,this._componentId=ql()}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===`selected-index`&&this._setActiveTab(),e===`panel`&&(this._tabHeaders.forEach(e=>e.panel=n!==null),this._tabPanels.forEach(e=>e.panel=n!==null))}_dispatchSelectEvent(){this.dispatchEvent(new CustomEvent(`vsc-tabs-select`,{detail:{selectedIndex:this.selectedIndex},composed:!0}))}_setActiveTab(){this._tabFocus=this.selectedIndex,this._tabPanels.forEach((e,t)=>{e.hidden=t!==this.selectedIndex}),this._tabHeaders.forEach((e,t)=>{e.active=t===this.selectedIndex})}_focusPrevTab(){this._tabFocus===0?this._tabFocus=this._tabHeaders.length-1:--this._tabFocus}_focusNextTab(){this._tabFocus===this._tabHeaders.length-1?this._tabFocus=0:this._tabFocus+=1}_onHeaderKeyDown(e){(e.key===`ArrowLeft`||e.key===`ArrowRight`)&&(e.preventDefault(),this._tabHeaders[this._tabFocus].setAttribute(`tabindex`,`-1`),e.key===`ArrowLeft`?this._focusPrevTab():e.key===`ArrowRight`&&this._focusNextTab(),this._tabHeaders[this._tabFocus].setAttribute(`tabindex`,`0`),this._tabHeaders[this._tabFocus].focus()),e.key===`Enter`&&(e.preventDefault(),this.selectedIndex=this._tabFocus,this._dispatchSelectEvent())}_moveHeadersToHeaderSlot(){let e=this._mainSlotElements.filter(e=>e instanceof Zu);e.length>0&&e.forEach(e=>e.setAttribute(`slot`,`header`))}_onMainSlotChange(){this._moveHeadersToHeaderSlot(),this._tabPanels=this._mainSlotElements.filter(e=>e instanceof ed),this._tabPanels.forEach((e,t)=>{e.ariaLabelledby=`t${this._componentId}-h${t}`,e.id=`t${this._componentId}-p${t}`,e.panel=this.panel}),this._setActiveTab()}_onHeaderSlotChange(){this._tabHeaders=this._headerSlotElements.filter(e=>e instanceof Zu),this._tabHeaders.forEach((e,t)=>{e.tabId=t,e.id=`t${this._componentId}-h${t}`,e.ariaControls=`t${this._componentId}-p${t}`,e.panel=this.panel,e.active=t===this.selectedIndex})}_onHeaderClick(e){let t=e.composedPath().find(e=>e instanceof Zu);t&&(this.selectedIndex=t.tabId,this._setActiveTab(),this._dispatchSelectEvent())}render(){return A`
      <div
        class=${R({header:!0,panel:this.panel})}
        @click=${this._onHeaderClick}
        @keydown=${this._onHeaderKeyDown}
      >
        <div role="tablist" class="tablist">
          <slot
            name="header"
            @slotchange=${this._onHeaderSlotChange}
            role="tablist"
          ></slot>
        </div>
        <slot name="addons"></slot>
      </div>
      <slot @slotchange=${this._onMainSlotChange}></slot>
    `}};xd.styles=yd,bd([M({type:Boolean,reflect:!0})],xd.prototype,`panel`,void 0),bd([M({type:Number,reflect:!0,attribute:`selected-index`})],xd.prototype,`selectedIndex`,void 0),bd([Kc({slot:`header`})],xd.prototype,`_headerSlotElements`,void 0),bd([Kc()],xd.prototype,`_mainSlotElements`,void 0),xd=bd([I(`vscode-tabs`)],xd);var Sd=[L,k`
    :host {
      display: inline-block;
      height: auto;
      position: relative;
      width: 320px;
    }

    :host([cols]) {
      width: auto;
    }

    :host([rows]) {
      height: auto;
    }

    .shadow {
      box-shadow: var(--vscode-scrollbar-shadow, #000000) 0 6px 6px -6px inset;
      display: none;
      inset: 0 0 auto 0;
      height: 6px;
      pointer-events: none;
      position: absolute;
      width: 100%;
    }

    .shadow.visible {
      display: block;
    }

    textarea {
      background-color: var(--vscode-settings-textInputBackground, #313131);
      border-color: var(--vscode-settings-textInputBorder, transparent);
      border-radius: 2px;
      border-style: solid;
      border-width: 1px;
      box-sizing: border-box;
      color: var(--vscode-settings-textInputForeground, #cccccc);
      display: block;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      height: 100%;
      width: 100%;
    }

    :host([cols]) textarea {
      width: auto;
    }

    :host([rows]) textarea {
      height: auto;
    }

    :host([invalid]) textarea,
    :host(:invalid) textarea {
      background-color: var(--vscode-inputValidation-errorBackground, #5a1d1d);
      border-color: var(--vscode-inputValidation-errorBorder, #be1100);
    }

    textarea.monospace {
      background-color: var(--vscode-editor-background, #1f1f1f);
      color: var(--vscode-editor-foreground, #cccccc);
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: var(--vscode-editor-font-size, 14px);
      font-weight: var(--vscode-editor-font-weight, normal);
    }

    .textarea.monospace::placeholder {
      color: var(
        --vscode-editor-inlineValuesForeground,
        rgba(255, 255, 255, 0.5)
      );
    }

    textarea.cursor-pointer {
      cursor: pointer;
    }

    textarea:focus {
      border-color: var(--vscode-focusBorder, #0078d4);
      outline: none;
    }

    textarea::placeholder {
      color: var(--vscode-input-placeholderForeground, #989898);
      opacity: 1;
    }

    textarea::-webkit-scrollbar-track {
      background-color: transparent;
    }

    textarea::-webkit-scrollbar {
      width: 14px;
    }

    textarea::-webkit-scrollbar-thumb {
      background-color: transparent;
    }

    textarea:hover::-webkit-scrollbar-thumb {
      background-color: var(
        --vscode-scrollbarSlider-background,
        rgba(121, 121, 121, 0.4)
      );
    }

    textarea::-webkit-scrollbar-thumb:hover {
      background-color: var(
        --vscode-scrollbarSlider-hoverBackground,
        rgba(100, 100, 100, 0.7)
      );
    }

    textarea::-webkit-scrollbar-thumb:active {
      background-color: var(
        --vscode-scrollbarSlider-activeBackground,
        rgba(191, 191, 191, 0.4)
      );
    }

    textarea::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    textarea::-webkit-resizer {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACJJREFUeJxjYMAOZuIQZ5j5//9/rJJESczEKYGsG6cEXgAAsEEefMxkua4AAAAASUVORK5CYII=');
      background-repeat: no-repeat;
      background-position: right bottom;
    }
  `],Y=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},X=class extends F{set value(e){this._value=e,this._internals.setFormValue(e)}get value(){return this._value}get wrappedElement(){return this._textareaEl}get form(){return this._internals.form}get type(){return`textarea`}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}set minlength(e){this.minLength=e}get minlength(){return this.minLength}set maxlength(e){this.maxLength=e}get maxlength(){return this.maxLength}constructor(){super(),this.autocomplete=void 0,this.autofocus=!1,this.defaultValue=``,this.disabled=!1,this.invalid=!1,this.label=``,this.maxLength=void 0,this.minLength=void 0,this.rows=void 0,this.cols=void 0,this.name=void 0,this.placeholder=void 0,this.readonly=!1,this.resize=`none`,this.required=!1,this.spellcheck=!1,this.monospace=!1,this._value=``,this._textareaPointerCursor=!1,this._shadow=!1,this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this._textareaEl.checkValidity(),this._setValidityFromInput(),this._internals.setFormValue(this._textareaEl.value)})}updated(e){let t=[`maxLength`,`minLength`,`required`];for(let n of e.keys())if(t.includes(String(n))){this.updateComplete.then(()=>{this._setValidityFromInput()});break}}formResetCallback(){this.value=this.defaultValue}formStateRestoreCallback(e,t){this.updateComplete.then(()=>{this._value=e})}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}_setValidityFromInput(){this._internals.setValidity(this._textareaEl.validity,this._textareaEl.validationMessage,this._textareaEl)}_dataChanged(){this._value=this._textareaEl.value,this._internals.setFormValue(this._textareaEl.value)}_handleChange(){this._dataChanged(),this._setValidityFromInput(),this.dispatchEvent(new Event(`change`))}_handleInput(){this._dataChanged(),this._setValidityFromInput()}_handleMouseMove(e){if(this._textareaEl.clientHeight>=this._textareaEl.scrollHeight){this._textareaPointerCursor=!1;return}let t=this._textareaEl.getBoundingClientRect();this._textareaPointerCursor=e.clientX>=t.left+t.width-14-2}_handleScroll(){this._shadow=this._textareaEl.scrollTop>0}render(){return A`
      <div
        class=${R({shadow:!0,visible:this._shadow})}
      ></div>
      <textarea
        autocomplete=${z(this.autocomplete)}
        ?autofocus=${this.autofocus}
        ?disabled=${this.disabled}
        aria-label=${this.label}
        id="textarea"
        class=${R({monospace:this.monospace,"cursor-pointer":this._textareaPointerCursor})}
        maxlength=${z(this.maxLength)}
        minlength=${z(this.minLength)}
        rows=${z(this.rows)}
        cols=${z(this.cols)}
        name=${z(this.name)}
        placeholder=${z(this.placeholder)}
        ?readonly=${this.readonly}
        .style=${rl({resize:this.resize})}
        ?required=${this.required}
        spellcheck=${this.spellcheck}
        @change=${this._handleChange}
        @input=${this._handleInput}
        @mousemove=${this._handleMouseMove}
        @scroll=${this._handleScroll}
        .value=${this._value}
      ></textarea>
    `}};X.styles=Sd,X.formAssociated=!0,X.shadowRootOptions={...zc.shadowRootOptions,delegatesFocus:!0},Y([M()],X.prototype,`autocomplete`,void 0),Y([M({type:Boolean,reflect:!0})],X.prototype,`autofocus`,void 0),Y([M({attribute:`default-value`})],X.prototype,`defaultValue`,void 0),Y([M({type:Boolean,reflect:!0})],X.prototype,`disabled`,void 0),Y([M({type:Boolean,reflect:!0})],X.prototype,`invalid`,void 0),Y([M({attribute:!1})],X.prototype,`label`,void 0),Y([M({type:Number})],X.prototype,`maxLength`,void 0),Y([M({type:Number})],X.prototype,`minLength`,void 0),Y([M({type:Number})],X.prototype,`rows`,void 0),Y([M({type:Number})],X.prototype,`cols`,void 0),Y([M()],X.prototype,`name`,void 0),Y([M()],X.prototype,`placeholder`,void 0),Y([M({type:Boolean,reflect:!0})],X.prototype,`readonly`,void 0),Y([M()],X.prototype,`resize`,void 0),Y([M({type:Boolean,reflect:!0})],X.prototype,`required`,void 0),Y([M({type:Boolean})],X.prototype,`spellcheck`,void 0),Y([M({type:Boolean,reflect:!0})],X.prototype,`monospace`,void 0),Y([M()],X.prototype,`value`,null),Y([P(`#textarea`)],X.prototype,`_textareaEl`,void 0),Y([N()],X.prototype,`_value`,void 0),Y([N()],X.prototype,`_textareaPointerCursor`,void 0),Y([N()],X.prototype,`_shadow`,void 0),X=Y([I(`vscode-textarea`)],X);var Cd=Fs(Xc()),wd=[L,k`
    :host {
      display: inline-block;
      width: 320px;
    }

    .root {
      align-items: center;
      background-color: var(--vscode-settings-textInputBackground, #313131);
      border-color: var(
        --vscode-settings-textInputBorder,
        var(--vscode-settings-textInputBackground, #3c3c3c)
      );
      border-radius: 2px;
      border-style: solid;
      border-width: 1px;
      box-sizing: border-box;
      color: var(--vscode-settings-textInputForeground, #cccccc);
      display: flex;
      max-width: 100%;
      position: relative;
      width: 100%;
    }

    :host([focused]) .root {
      border-color: var(--vscode-focusBorder, #0078d4);
    }

    :host([invalid]),
    :host(:invalid) {
      border-color: var(--vscode-inputValidation-errorBorder, #be1100);
    }

    :host([invalid]) input,
    :host(:invalid) input {
      background-color: var(--vscode-inputValidation-errorBackground, #5a1d1d);
    }

    ::slotted([slot='content-before']) {
      display: block;
      margin-left: 2px;
    }

    ::slotted([slot='content-after']) {
      display: block;
      margin-right: 2px;
    }

    slot[name='content-before'],
    slot[name='content-after'] {
      align-items: center;
      display: flex;
    }

    input {
      background-color: var(--vscode-settings-textInputBackground, #313131);
      border: 0;
      box-sizing: border-box;
      color: var(--vscode-settings-textInputForeground, #cccccc);
      display: block;
      font-family: var(--vscode-font-family, ${Cd});
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, 'normal');
      line-height: 18px;
      outline: none;
      padding-bottom: 3px;
      padding-left: 4px;
      padding-right: 4px;
      padding-top: 3px;
      width: 100%;
    }

    input:read-only:not([type='file']) {
      cursor: not-allowed;
    }

    input::placeholder {
      color: var(--vscode-input-placeholderForeground, #989898);
      opacity: 1;
    }

    input[type='file'] {
      line-height: 24px;
      padding-bottom: 0;
      padding-left: 2px;
      padding-top: 0;
    }

    input[type='file']::file-selector-button {
      background-color: var(--vscode-button-background, #0078d4);
      border: 0;
      border-radius: 2px;
      color: var(--vscode-button-foreground, #ffffff);
      cursor: pointer;
      font-family: var(--vscode-font-family, ${Cd});
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, 'normal');
      line-height: 20px;
      padding: 0 14px;
    }

    input[type='file']::file-selector-button:hover {
      background-color: var(--vscode-button-hoverBackground, #026ec1);
    }
  `],Z=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Q=class extends F{set type(e){this._type=[`color`,`date`,`datetime-local`,`email`,`file`,`month`,`number`,`password`,`search`,`tel`,`text`,`time`,`url`,`week`].includes(e)?e:`text`}get type(){return this._type}set value(e){this.type!==`file`&&(this._value=e,this._internals.setFormValue(e)),this.updateComplete.then(()=>{this._setValidityFromInput()})}get value(){return this._value}set minlength(e){this.minLength=e}get minlength(){return this.minLength}set maxlength(e){this.maxLength=e}get maxlength(){return this.maxLength}get form(){return this._internals.form}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._setValidityFromInput(),this._internals.checkValidity()}reportValidity(){return this._setValidityFromInput(),this._internals.reportValidity()}get wrappedElement(){return this._inputEl}constructor(){super(),this.autocomplete=void 0,this.autofocus=!1,this.defaultValue=``,this.disabled=!1,this.focused=!1,this.invalid=!1,this.label=``,this.max=void 0,this.maxLength=void 0,this.min=void 0,this.minLength=void 0,this.multiple=!1,this.name=void 0,this.pattern=void 0,this.placeholder=void 0,this.readonly=!1,this.required=!1,this.step=void 0,this._value=``,this._type=`text`,this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this._inputEl.checkValidity(),this._setValidityFromInput(),this._internals.setFormValue(this._inputEl.value)})}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),[`max`,`maxlength`,`min`,`minlength`,`pattern`,`required`,`step`].includes(e)&&this.updateComplete.then(()=>{this._setValidityFromInput()})}formResetCallback(){this.value=this.defaultValue,this.requestUpdate()}formStateRestoreCallback(e,t){this.value=e}_dataChanged(){if(this._value=this._inputEl.value,this.type===`file`&&this._inputEl.files)for(let e of this._inputEl.files)this._internals.setFormValue(e);else this._internals.setFormValue(this._inputEl.value)}_setValidityFromInput(){this._inputEl&&this._internals.setValidity(this._inputEl.validity,this._inputEl.validationMessage,this._inputEl)}_onInput(){this._dataChanged(),this._setValidityFromInput()}_onChange(){this._dataChanged(),this._setValidityFromInput(),this.dispatchEvent(new Event(`change`))}_onFocus(){this.focused=!0}_onBlur(){this.focused=!1}_onKeyDown(e){e.key===`Enter`&&this._internals.form&&this._internals.form?.requestSubmit()}render(){return A`
      <div class="root">
        <slot name="content-before"></slot>
        <input
          id="input"
          type=${this.type}
          ?autofocus=${this.autofocus}
          autocomplete=${z(this.autocomplete)}
          aria-label=${this.label}
          ?disabled=${this.disabled}
          max=${z(this.max)}
          maxlength=${z(this.maxLength)}
          min=${z(this.min)}
          minlength=${z(this.minLength)}
          ?multiple=${this.multiple}
          name=${z(this.name)}
          pattern=${z(this.pattern)}
          placeholder=${z(this.placeholder)}
          ?readonly=${this.readonly}
          ?required=${this.required}
          step=${z(this.step)}
          .value=${this._value}
          @blur=${this._onBlur}
          @change=${this._onChange}
          @focus=${this._onFocus}
          @input=${this._onInput}
          @keydown=${this._onKeyDown}
        >
        <slot name="content-after"></slot>
      </div>
    `}};Q.styles=wd,Q.formAssociated=!0,Q.shadowRootOptions={...zc.shadowRootOptions,delegatesFocus:!0},Z([M()],Q.prototype,`autocomplete`,void 0),Z([M({type:Boolean,reflect:!0})],Q.prototype,`autofocus`,void 0),Z([M({attribute:`default-value`})],Q.prototype,`defaultValue`,void 0),Z([M({type:Boolean,reflect:!0})],Q.prototype,`disabled`,void 0),Z([M({type:Boolean,reflect:!0})],Q.prototype,`focused`,void 0),Z([M({type:Boolean,reflect:!0})],Q.prototype,`invalid`,void 0),Z([M({attribute:!1})],Q.prototype,`label`,void 0),Z([M({type:Number})],Q.prototype,`max`,void 0),Z([M({type:Number})],Q.prototype,`maxLength`,void 0),Z([M({type:Number})],Q.prototype,`min`,void 0),Z([M({type:Number})],Q.prototype,`minLength`,void 0),Z([M({type:Boolean,reflect:!0})],Q.prototype,`multiple`,void 0),Z([M({reflect:!0})],Q.prototype,`name`,void 0),Z([M()],Q.prototype,`pattern`,void 0),Z([M()],Q.prototype,`placeholder`,void 0),Z([M({type:Boolean,reflect:!0})],Q.prototype,`readonly`,void 0),Z([M({type:Boolean,reflect:!0})],Q.prototype,`required`,void 0),Z([M({type:Number})],Q.prototype,`step`,void 0),Z([M({reflect:!0})],Q.prototype,`type`,null),Z([M()],Q.prototype,`value`,null),Z([P(`#input`)],Q.prototype,`_inputEl`,void 0),Z([N()],Q.prototype,`_value`,void 0),Z([N()],Q.prototype,`_type`,void 0),Q=Z([I(`vscode-textfield`)],Q);var Td=[L,k`
    :host {
      display: inline-flex;
    }

    button {
      align-items: center;
      background-color: transparent;
      border: 0;
      border-radius: 5px;
      color: var(--vscode-foreground, #cccccc);
      cursor: pointer;
      display: flex;
      outline-offset: -1px;
      outline-width: 1px;
      padding: 0;
      user-select: none;
    }

    button:focus-visible {
      outline-color: var(--vscode-focusBorder, #0078d4);
      outline-style: solid;
    }

    button:hover {
      background-color: var(
        --vscode-toolbar-hoverBackground,
        rgba(90, 93, 94, 0.31)
      );
      outline-style: dashed;
      outline-color: var(--vscode-toolbar-hoverOutline, transparent);
    }

    button:active {
      background-color: var(
        --vscode-toolbar-activeBackground,
        rgba(99, 102, 103, 0.31)
      );
    }

    button.checked {
      background-color: var(
        --vscode-inputOption-activeBackground,
        rgba(36, 137, 219, 0.51)
      );
      outline-color: var(--vscode-inputOption-activeBorder, #2488db);
      outline-style: solid;
      color: var(--vscode-inputOption-activeForeground, #ffffff);
    }

    button.checked vscode-icon {
      color: var(--vscode-inputOption-activeForeground, #ffffff);
    }

    vscode-icon {
      display: block;
      padding: 3px;
    }

    slot:not(.empty) {
      align-items: center;
      display: flex;
      height: 22px;
      padding: 0 5px 0 2px;
    }

    slot.textOnly:not(.empty) {
      padding: 0 5px;
    }
  `],Ed=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Dd=class extends F{constructor(){super(...arguments),this.icon=``,this.label=void 0,this.toggleable=!1,this.checked=!1,this._isSlotEmpty=!0}_handleSlotChange(){this._isSlotEmpty=!((this._assignedNodes?.length??0)>0)}_handleButtonClick(){this.toggleable&&(this.checked=!this.checked,this.dispatchEvent(new Event(`change`)))}render(){let e=this.checked?`true`:`false`;return A`
      <button
        type="button"
        aria-label=${z(this.label)}
        role=${z(this.toggleable?`switch`:void 0)}
        aria-checked=${z(this.toggleable?e:void 0)}
        class=${R({checked:this.toggleable&&this.checked})}
        @click=${this._handleButtonClick}
      >
        ${this.icon?A`<vscode-icon name=${this.icon}></vscode-icon>`:j}
        <slot
          @slotchange=${this._handleSlotChange}
          class=${R({empty:this._isSlotEmpty,textOnly:!this.icon})}
        ></slot>
      </button>
    `}};Dd.styles=Td,Ed([M({reflect:!0})],Dd.prototype,`icon`,void 0),Ed([M()],Dd.prototype,`label`,void 0),Ed([M({type:Boolean,reflect:!0})],Dd.prototype,`toggleable`,void 0),Ed([M({type:Boolean,reflect:!0})],Dd.prototype,`checked`,void 0),Ed([N()],Dd.prototype,`_isSlotEmpty`,void 0),Ed([qc()],Dd.prototype,`_assignedNodes`,void 0),Dd=Ed([I(`vscode-toolbar-button`)],Dd);var Od=[L,k`
    :host {
      display: block;
    }

    div {
      gap: 4px;
      display: flex;
      align-items: center;
    }
  `],kd=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ad=class extends F{render(){return A`<div><slot></slot></div>`}};Ad.styles=Od,Ad=kd([I(`vscode-toolbar-container`)],Ad);var jd=class extends Event{constructor(e,t,n,r){super(`context-request`,{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t,this.callback=n,this.subscribe=r??!1}};function Md(e){return e}var Nd=class{constructor(e,t,n,r){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(e,t)=>{this.unsubscribe&&(this.unsubscribe!==t&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=e,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(e,t)),this.unsubscribe=t},this.host=e,t.context!==void 0){let e=t;this.context=e.context,this.callback=e.callback,this.subscribe=e.subscribe??!1}else this.context=t,this.callback=n,this.subscribe=r??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&=(this.unsubscribe(),void 0)}dispatchRequest(){this.host.dispatchEvent(new jd(this.context,this.host,this.t,this.subscribe))}},Pd=class{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,t=!1){let n=t||!Object.is(e,this.o);this.o=e,n&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(let[e,{disposer:t}]of this.subscriptions)e(this.o,t)},e!==void 0&&(this.value=e)}addCallback(e,t,n){if(!n)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:t});let{disposer:r}=this.subscriptions.get(e);e(this.value,r)}clearCallbacks(){this.subscriptions.clear()}},Fd=class extends Event{constructor(e,t){super(`context-provider`,{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t}},Id=class extends Pd{constructor(e,t,n){super(t.context===void 0?n:t.initialValue),this.onContextRequest=e=>{if(e.context!==this.context)return;let t=e.contextTarget??e.composedPath()[0];t!==this.host&&(e.stopPropagation(),this.addCallback(e.callback,t,e.subscribe))},this.onProviderRequest=e=>{if(e.context!==this.context||(e.contextTarget??e.composedPath()[0])===this.host)return;let t=new Set;for(let[e,{consumerHost:n}]of this.subscriptions)t.has(e)||(t.add(e),n.dispatchEvent(new jd(this.context,n,e,!0)));e.stopPropagation()},this.host=e,t.context===void 0?this.context=t:this.context=t.context,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener(`context-request`,this.onContextRequest),this.host.addEventListener(`context-provider`,this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new Fd(this.context,this.host))}};function Ld({context:e}){return(t,n)=>{let r=new WeakMap;if(typeof n==`object`)return{get(){return t.get.call(this)},set(e){return r.get(this).setValue(e),t.set.call(this,e)},init(t){return r.set(this,new Id(this,{context:e,initialValue:t})),t}};{t.constructor.addInitializer((t=>{r.set(t,new Id(t,{context:e}))}));let i=Object.getOwnPropertyDescriptor(t,n),a;if(i===void 0){let e=new WeakMap;a={get(){return e.get(this)},set(t){r.get(this).setValue(t),e.set(this,t)},configurable:!0,enumerable:!0}}else{let e=i.set;a={...i,set(t){r.get(this).setValue(t),e?.call(this,t)}}}Object.defineProperty(t,n,a);return}}}function Rd({context:e,subscribe:t}){return(n,r)=>{typeof r==`object`?r.addInitializer((function(){new Nd(this,{context:e,callback:e=>{n.set.call(this,e)},subscribe:t})})):n.constructor.addInitializer((n=>{new Nd(n,{context:e,callback:e=>{n[r]=e},subscribe:t})}))}}var zd=[L,k`
    :host {
      --vsc-tree-item-arrow-display: flex;
      --internal-selectionBackground: var(
        --vscode-list-inactiveSelectionBackground,
        #37373d
      );
      --internal-selectionForeground: var(--vscode-foreground, #cccccc);
      --internal-selectionIconForeground: var(
        --vscode-icon-foreground,
        #cccccc
      );
      --internal-defaultIndentGuideDisplay: none;
      --internal-highlightedIndentGuideDisplay: block;

      display: block;
    }

    :host(:hover) {
      --internal-defaultIndentGuideDisplay: block;
      --internal-highlightedIndentGuideDisplay: block;
    }

    :host(:focus-within) {
      --internal-selectionBackground: var(
        --vscode-list-activeSelectionBackground,
        #04395e
      );
      --internal-selectionForeground: var(
        --vscode-list-activeSelectionForeground,
        #ffffff
      );
      --internal-selectionIconForeground: var(
        --vscode-list-activeSelectionIconForeground,
        #ffffff
      );
    }

    :host([hide-arrows]) {
      --vsc-tree-item-arrow-display: none;
    }

    :host([indent-guides='none']),
    :host([indent-guides='none']:hover) {
      --internal-defaultIndentGuideDisplay: none;
      --internal-highlightedIndentGuideDisplay: none;
    }

    :host([indent-guides='always']),
    :host([indent-guides='always']:hover) {
      --internal-defaultIndentGuideDisplay: block;
      --internal-highlightedIndentGuideDisplay: block;
    }
  `];const Bd=Md(`vscode-list`),Vd=Md(Symbol(`configContext`));var Hd=e=>e instanceof Element&&e.matches(`vscode-tree-item`),Ud=e=>e instanceof Element&&e.matches(`vscode-tree`);const Wd=(e,t)=>{let n=t.length,r=Ud(e)?-1:e.level;`branch`in e&&(e.branch=n>0),t.forEach((t,n)=>{`path`in e?t.path=[...e.path,n]:t.path=[n],t.level=r+1,t.dataset.path=t.path.join(`.`)})},Gd=e=>{let t=e.lastElementChild;return!t||!Hd(t)?e:t.branch&&t.open?Gd(t):t},Kd=e=>!e.parentElement||!Hd(e.parentElement)?null:qd(e.parentElement)||Kd(e.parentElement);var qd=e=>{let t=e.nextElementSibling;for(;t&&!Hd(t);)t=t.nextElementSibling;return t};const Jd=e=>{let{parentElement:t}=e;if(!t||!Hd(e))return null;let n;if(e.branch&&e.open){let t=e.querySelector(`vscode-tree-item`);t?n=t:(n=qd(e),n||=Kd(e))}else n=qd(e),n||=Kd(e);return n||e},Yd=e=>{let{parentElement:t}=e;if(!t||!Hd(e))return null;let n=e.previousElementSibling;for(;n&&!Hd(n);)n=n.previousElementSibling;return!n&&Hd(t)?t:n&&n.branch&&n.open?Gd(n):n};function Xd(e){return!e.parentElement||!Hd(e.parentElement)?null:e.parentElement}var Zd=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a};const Qd={singleClick:`singleClick`,doubleClick:`doubleClick`},$d={none:`none`,onHover:`onHover`,always:`always`};var ef=[` `,`ArrowDown`,`ArrowUp`,`ArrowLeft`,`ArrowRight`,`Enter`,`Escape`,`Shift`],tf=class extends F{constructor(){super(),this.expandMode=`singleClick`,this.hideArrows=!1,this.indent=8,this.indentGuides=`onHover`,this.multiSelect=!1,this._treeContextState={isShiftPressed:!1,activeItem:null,selectedItems:new Set,allItems:null,itemListUpToDate:!1,focusedItem:null,prevFocusedItem:null,hasBranchItem:!1,rootElement:this,highlightedItems:new Set,highlightIndentGuides:()=>{this._highlightIndentGuides()},emitSelectEvent:()=>{this._emitSelectEvent()}},this._configContext={hideArrows:this.hideArrows,expandMode:this.expandMode,indent:this.indent,indentGuides:this.indentGuides,multiSelect:this.multiSelect},this._handleComponentKeyDown=e=>{let t=e.key;switch(ef.includes(t)&&(e.stopPropagation(),e.preventDefault()),t){case` `:case`Enter`:this._handleEnterPress();break;case`ArrowDown`:this._handleArrowDownPress();break;case`ArrowLeft`:this._handleArrowLeftPress(e);break;case`ArrowRight`:this._handleArrowRightPress();break;case`ArrowUp`:this._handleArrowUpPress();break;case`Shift`:this._handleShiftPress();break;default:}},this._handleComponentKeyUp=e=>{e.key===`Shift`&&(this._treeContextState.isShiftPressed=!1)},this._handleSlotChange=()=>{this._treeContextState.itemListUpToDate=!1,Wd(this,this._assignedTreeItems),this.updateComplete.then(()=>{if(this._treeContextState.activeItem===null){let e=this.querySelector(`:scope > vscode-tree-item`);e&&(e.active=!0)}})},this.addEventListener(`keyup`,this._handleComponentKeyUp),this.addEventListener(`keydown`,this._handleComponentKeyDown)}connectedCallback(){super.connectedCallback(),this.role=`tree`}willUpdate(e){this._updateConfigContext(e),e.has(`multiSelect`)&&(this.ariaMultiSelectable=this.multiSelect?`true`:`false`)}expandAll(){this.querySelectorAll(`vscode-tree-item`).forEach(e=>{e.branch&&(e.open=!0)})}collapseAll(){this.querySelectorAll(`vscode-tree-item`).forEach(e=>{e.branch&&(e.open=!1)})}updateHasBranchItemFlag(){let e=this._assignedTreeItems.some(e=>e.branch);this._treeContextState={...this._treeContextState,hasBranchItem:e}}_emitSelectEvent(){let e=new CustomEvent(`vsc-tree-select`,{detail:Array.from(this._treeContextState.selectedItems)});this.dispatchEvent(e)}_highlightIndentGuideOfItem(e){if(e.branch&&e.open)e.highlightedGuides=!0,this._treeContextState.highlightedItems?.add(e);else{let t=Xd(e);t&&(t.highlightedGuides=!0,this._treeContextState.highlightedItems?.add(t))}}_highlightIndentGuides(){this.indentGuides!==$d.none&&(this._treeContextState.highlightedItems?.forEach(e=>e.highlightedGuides=!1),this._treeContextState.highlightedItems?.clear(),this._treeContextState.activeItem&&this._highlightIndentGuideOfItem(this._treeContextState.activeItem),this._treeContextState.selectedItems.forEach(e=>{this._highlightIndentGuideOfItem(e)}))}_updateConfigContext(e){let{hideArrows:t,expandMode:n,indent:r,indentGuides:i,multiSelect:a}=this;e.has(`hideArrows`)&&(this._configContext={...this._configContext,hideArrows:t}),e.has(`expandMode`)&&(this._configContext={...this._configContext,expandMode:n}),e.has(`indent`)&&(this._configContext={...this._configContext,indent:r}),e.has(`indentGuides`)&&(this._configContext={...this._configContext,indentGuides:i}),e.has(`multiSelect`)&&(this._configContext={...this._configContext,multiSelect:a})}_focusItem(e){e.active=!0,e.updateComplete.then(()=>{e.focus(),this._highlightIndentGuides()})}_focusPrevItem(){if(this._treeContextState.focusedItem){let e=Yd(this._treeContextState.focusedItem);e&&(this._focusItem(e),this._treeContextState.isShiftPressed&&this.multiSelect&&(e.selected=!e.selected,this._emitSelectEvent()))}}_focusNextItem(){if(this._treeContextState.focusedItem){let e=Jd(this._treeContextState.focusedItem);e&&(this._focusItem(e),this._treeContextState.isShiftPressed&&this.multiSelect&&(e.selected=!e.selected,this._emitSelectEvent()))}}_handleArrowRightPress(){if(!this._treeContextState.focusedItem)return;let{focusedItem:e}=this._treeContextState;e.branch&&(e.open?this._focusNextItem():e.open=!0)}_handleArrowLeftPress(e){if(e.ctrlKey){this.collapseAll();return}if(!this._treeContextState.focusedItem)return;let{focusedItem:t}=this._treeContextState,n=Xd(t);t.branch&&t.open?t.open=!1:n&&n.branch&&this._focusItem(n)}_handleArrowDownPress(){this._treeContextState.focusedItem?this._focusNextItem():this._focusItem(this._assignedTreeItems[0])}_handleArrowUpPress(){this._treeContextState.focusedItem?this._focusPrevItem():this._focusItem(this._assignedTreeItems[0])}_handleEnterPress(){let{focusedItem:e}=this._treeContextState;e&&(this._treeContextState.selectedItems.forEach(e=>e.selected=!1),this._treeContextState.selectedItems.clear(),this._highlightIndentGuides(),e.selected=!0,this._emitSelectEvent(),e.branch&&(e.open=!e.open))}_handleShiftPress(){this._treeContextState.isShiftPressed=!0}render(){return A`<div>
      <slot @slotchange=${this._handleSlotChange}></slot>
    </div>`}};tf.styles=zd,Zd([M({type:String,attribute:`expand-mode`})],tf.prototype,`expandMode`,void 0),Zd([M({type:Boolean,reflect:!0,attribute:`hide-arrows`})],tf.prototype,`hideArrows`,void 0),Zd([M({type:Number,reflect:!0})],tf.prototype,`indent`,void 0),Zd([M({type:String,attribute:`indent-guides`,useDefault:!0,reflect:!0})],tf.prototype,`indentGuides`,void 0),Zd([M({type:Boolean,reflect:!0,attribute:`multi-select`})],tf.prototype,`multiSelect`,void 0),Zd([Ld({context:Bd})],tf.prototype,`_treeContextState`,void 0),Zd([Ld({context:Vd})],tf.prototype,`_configContext`,void 0),Zd([Kc({selector:`vscode-tree-item`})],tf.prototype,`_assignedTreeItems`,void 0),tf=Zd([I(`vscode-tree`)],tf);var nf=[L,k`
    :host {
      --hover-outline-color: transparent;
      --hover-outline-style: solid;
      --hover-outline-width: 0;

      --selected-outline-color: transparent;
      --selected-outline-style: solid;
      --selected-outline-width: 0;

      cursor: pointer;
      display: block;
      user-select: none;
    }

    ::slotted(vscode-icon) {
      display: block;
    }

    .root {
      display: block;
    }

    .wrapper {
      align-items: flex-start;
      color: var(--vscode-foreground, #cccccc);
      display: flex;
      font-family: var(--vscode-font-family, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, normal);
      outline-offset: -1px;
      padding-right: 12px;
    }

    .wrapper:hover {
      background-color: var(--vscode-list-hoverBackground, #2a2d2e);
      color: var(
        --vscode-list-hoverForeground,
        var(--vscode-foreground, #cccccc)
      );
    }

    :host([selected]) .wrapper {
      color: var(--internal-selectionForeground);
      background-color: var(--internal-selectionBackground);
    }

    :host([selected]) ::slotted(vscode-icon) {
      color: var(--internal-selectionForeground);
    }

    :host(:focus) {
      outline: none;
    }

    :host(:focus) .wrapper.active {
      outline-color: var(
        --vscode-list-focusAndSelectionOutline,
        var(--vscode-list-focusOutline, #0078d4)
      );
      outline-style: solid;
      outline-width: 1px;
    }

    .arrow-container {
      align-items: center;
      display: var(--vsc-tree-item-arrow-display);
      height: 22px;
      justify-content: center;
      padding-left: 8px;
      padding-right: 6px;
      width: 16px;
    }

    .arrow-container svg {
      display: block;
      fill: var(--vscode-icon-foreground, #cccccc);
    }

    .arrow-container.icon-rotated svg {
      transform: rotate(90deg);
    }

    :host([selected]) .arrow-container svg {
      fill: var(--internal-selectionIconForeground);
    }

    .icon-container {
      align-items: center;
      display: flex;
      margin-bottom: 3px;
      margin-top: 3px;
      overflow: hidden;
    }

    .icon-container slot {
      display: block;
    }

    .icon-container.has-icon {
      height: 16px;
      margin-right: 6px;
      width: 16px;
    }

    .children {
      position: relative;
    }

    .children.guide:before {
      background-color: var(
        --vscode-tree-inactiveIndentGuidesStroke,
        rgba(88, 88, 88, 0.4)
      );
      content: '';
      display: none;
      height: 100%;
      left: var(--indentation-guide-left);
      pointer-events: none;
      position: absolute;
      width: 1px;
      z-index: 1;
    }

    .children.guide.default-guide:before {
      display: var(--internal-defaultIndentGuideDisplay);
    }

    .children.guide.highlighted-guide:before {
      display: var(--internal-highlightedIndentGuideDisplay);
      background-color: var(--vscode-tree-indentGuidesStroke, #585858);
    }

    .content {
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([branch]) ::slotted(vscode-tree-item) {
      display: none;
    }

    :host([branch][open]) ::slotted(vscode-tree-item) {
      display: block;
    }
  `],rf=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},af=3,of=30,sf=A`<svg
  width="16"
  height="16"
  viewBox="0 0 16 16"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"
  />
</svg>`;function cf(e){return!e.parentElement||!(e.parentElement instanceof $)?null:e.parentElement}var $=class extends F{set selected(e){this._selected=e,this._treeContextState.selectedItems.add(this),this.ariaSelected=e?`true`:`false`}get selected(){return this._selected}set path(e){this._path=e}get path(){return this._path}constructor(){super(),this.active=!1,this.branch=!1,this.hasActiveItem=!1,this.hasSelectedItem=!1,this.highlightedGuides=!1,this.open=!1,this.level=0,this._selected=!1,this._path=[],this._hasBranchIcon=!1,this._hasBranchOpenedIcon=!1,this._hasLeafIcon=!1,this._treeContextState={isShiftPressed:!1,selectedItems:new Set,allItems:null,itemListUpToDate:!1,focusedItem:null,prevFocusedItem:null,hasBranchItem:!1,rootElement:null,activeItem:null},this._handleMainSlotChange=()=>{this._mainSlotChange(),this._treeContextState.itemListUpToDate=!1},this._handleComponentFocus=()=>{this._treeContextState.focusedItem&&this._treeContextState.focusedItem!==this&&(this._treeContextState.isShiftPressed||(this._treeContextState.prevFocusedItem=this._treeContextState.focusedItem),this._treeContextState.focusedItem=null),this._treeContextState.focusedItem=this},this._internals=this.attachInternals(),this.addEventListener(`focus`,this._handleComponentFocus)}connectedCallback(){super.connectedCallback(),this._mainSlotChange(),this.role=`treeitem`,this.ariaDisabled=`false`}willUpdate(e){e.has(`active`)&&this._toggleActiveState(),(e.has(`open`)||e.has(`branch`))&&this._setAriaExpanded()}_setAriaExpanded(){this.branch?this.ariaExpanded=this.open?`true`:`false`:this.ariaExpanded=null}_setHasActiveItemFlagOnParent(e,t){let n=cf(e);n&&(n.hasActiveItem=t)}_toggleActiveState(){this.active?(this._treeContextState.activeItem&&(this._treeContextState.activeItem.active=!1,this._setHasActiveItemFlagOnParent(this._treeContextState.activeItem,!1)),this._treeContextState.activeItem=this,this._setHasActiveItemFlagOnParent(this,!0),this.tabIndex=0,this._internals.states.add(`active`)):(this._treeContextState.activeItem===this&&(this._treeContextState.activeItem=null,this._setHasActiveItemFlagOnParent(this,!1)),this.tabIndex=-1,this._internals.states.delete(`active`))}_selectItem(e){let{selectedItems:t}=this._treeContextState,{multiSelect:n}=this._configContext;n&&e?this.selected?(this.selected=!1,t.delete(this)):(this.selected=!0,t.add(this)):(t.forEach(e=>e.selected=!1),t.clear(),this.selected=!0,t.add(this))}_selectRange(){let e=this._treeContextState.prevFocusedItem;if(!e||e===this)return;this._treeContextState.itemListUpToDate||(this._treeContextState.allItems=this._treeContextState.rootElement.querySelectorAll(`vscode-tree-item`),this._treeContextState.allItems&&this._treeContextState.allItems.forEach((e,t)=>{e.dataset.score=t.toString()}),this._treeContextState.itemListUpToDate=!0);let t=+(e.dataset.score??-1),n=+(this.dataset.score??-1);t>n&&([t,n]=[n,t]),this._treeContextState.selectedItems.forEach(e=>e.selected=!1),this._treeContextState.selectedItems.clear(),this._selectItemsAndAllVisibleDescendants(t,n)}_selectItemsAndAllVisibleDescendants(e,t){let n=e;for(;n<=t;)if(this._treeContextState.allItems){let e=this._treeContextState.allItems[n];if(e.branch&&!e.open){e.selected=!0;let t=e.querySelectorAll(`vscode-tree-item`).length;n+=t}else e.branch&&e.open?(e.selected=!0,n+=this._selectItemsAndAllVisibleDescendants(n+1,t)):(e.selected=!0,n+=1)}return n}_mainSlotChange(){this._initiallyAssignedTreeItems.forEach(e=>{e.setAttribute(`slot`,`children`)})}_handleChildrenSlotChange(){Wd(this,this._childrenTreeItems),this._treeContextState.rootElement&&this._treeContextState.rootElement.updateHasBranchItemFlag()}_handleContentClick(e){e.stopPropagation();let t=e.ctrlKey||e.metaKey,n=e.shiftKey;n&&this._configContext.multiSelect?(this._selectRange(),this._treeContextState.emitSelectEvent?.(),this.updateComplete.then(()=>{this._treeContextState.highlightIndentGuides?.()})):(this._selectItem(t),this._treeContextState.emitSelectEvent?.(),this.updateComplete.then(()=>{this._treeContextState.highlightIndentGuides?.()}),this._configContext.expandMode===Qd.singleClick&&this.branch&&!(this._configContext.multiSelect&&t)&&(this.open=!this.open)),this.active=!0,n||(this._treeContextState.prevFocusedItem=this)}_handleDoubleClick(e){this._configContext.expandMode===Qd.doubleClick&&this.branch&&!(this._configContext.multiSelect&&(e.ctrlKey||e.metaKey))&&(this.open=!this.open)}_handleIconSlotChange(e){let t=e.target,n=t.assignedElements().length>0;switch(t.name){case`icon-branch`:this._hasBranchIcon=n;break;case`icon-branch-opened`:this._hasBranchOpenedIcon=n;break;case`icon-leaf`:this._hasLeafIcon=n;break;default:}}render(){let{hideArrows:e,indent:t,indentGuides:n}=this._configContext,{hasBranchItem:r}=this._treeContextState,i=af+this.level*t,a=e?3:13,o=af+this.level*t+a;!this.branch&&!e&&r&&(i+=of);let s=this._hasBranchIcon&&this.branch||this._hasBranchOpenedIcon&&this.branch&&this.open||this._hasLeafIcon&&!this.branch,c={wrapper:!0,active:this.active},l={children:!0,guide:n!==$d.none,"default-guide":n!==$d.none,"highlighted-guide":this.highlightedGuides},u={"icon-container":!0,"has-icon":s};return A` <div class="root">
      <div
        class=${R(c)}
        @click=${this._handleContentClick}
        @dblclick=${this._handleDoubleClick}
        .style=${rl({paddingLeft:`${i}px`})}
      >
        ${this.branch&&!e?A`<div
              class=${R({"arrow-container":!0,"icon-rotated":this.open})}
            >
              ${sf}
            </div>`:j}
        <div class=${R(u)}>
          ${this.branch&&!this.open?A`<slot
                name="icon-branch"
                @slotchange=${this._handleIconSlotChange}
              ></slot>`:j}
          ${this.branch&&this.open?A`<slot
                name="icon-branch-opened"
                @slotchange=${this._handleIconSlotChange}
              ></slot>`:j}
          ${this.branch?j:A`<slot
                name="icon-leaf"
                @slotchange=${this._handleIconSlotChange}
              ></slot>`}
        </div>
        <div class="content" part="content">
          <slot @slotchange=${this._handleMainSlotChange}></slot>
        </div>
      </div>
      <div
        class=${R(l)}
        .style=${rl({"--indentation-guide-left":`${o}px`})}
        role="group"
        part="children"
      >
        <slot
          name="children"
          @slotchange=${this._handleChildrenSlotChange}
        ></slot>
      </div>
    </div>`}};if($.styles=nf,rf([M({type:Boolean})],$.prototype,`active`,void 0),rf([M({type:Boolean,reflect:!0})],$.prototype,`branch`,void 0),rf([M({type:Boolean})],$.prototype,`hasActiveItem`,void 0),rf([M({type:Boolean})],$.prototype,`hasSelectedItem`,void 0),rf([M({type:Boolean})],$.prototype,`highlightedGuides`,void 0),rf([M({type:Boolean,reflect:!0})],$.prototype,`open`,void 0),rf([M({type:Number,reflect:!0})],$.prototype,`level`,void 0),rf([M({type:Boolean,reflect:!0})],$.prototype,`selected`,null),rf([N()],$.prototype,`_hasBranchIcon`,void 0),rf([N()],$.prototype,`_hasBranchOpenedIcon`,void 0),rf([N()],$.prototype,`_hasLeafIcon`,void 0),rf([Rd({context:Bd,subscribe:!0})],$.prototype,`_treeContextState`,void 0),rf([Rd({context:Vd,subscribe:!0})],$.prototype,`_configContext`,void 0),rf([Kc({selector:`vscode-tree-item`})],$.prototype,`_initiallyAssignedTreeItems`,void 0),rf([Kc({selector:`vscode-tree-item`,slot:`children`})],$.prototype,`_childrenTreeItems`,void 0),$=rf([I(`vscode-tree-item`)],$),!customElements.get(`vscode-icon`)){class e extends HTMLElement{static get observedAttributes(){return[`name`]}connectedCallback(){this.render()}attributeChangedCallback(){this.render()}render(){this.innerHTML=`<i class="codicon codicon-${this.getAttribute(`name`)}"></i>`}}customElements.define(`vscode-icon`,e)}var lf=So(ks);lf.config.compilerOptions.isCustomElement=e=>e.startsWith(`vscode-`),lf.mount(`#app`);