(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){let t=Object.create(null);for(let n of e.split(`,`))t[n]=1;return e=>e in t}var t={},n=[],r=()=>{},i=()=>!1,a=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),o=e=>e.startsWith(`onUpdate:`),s=Object.assign,c=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},l=Object.prototype.hasOwnProperty,u=(e,t)=>l.call(e,t),d=Array.isArray,f=e=>b(e)===`[object Map]`,p=e=>b(e)===`[object Set]`,m=e=>typeof e==`function`,h=e=>typeof e==`string`,g=e=>typeof e==`symbol`,_=e=>typeof e==`object`&&!!e,v=e=>(_(e)||m(e))&&m(e.then)&&m(e.catch),y=Object.prototype.toString,b=e=>y.call(e),ee=e=>b(e).slice(8,-1),te=e=>b(e)===`[object Object]`,ne=e=>h(e)&&e!==`NaN`&&e[0]!==`-`&&``+parseInt(e,10)===e,re=e(`,key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted`),ie=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},ae=/-\w/g,oe=ie(e=>e.replace(ae,e=>e.slice(1).toUpperCase())),se=/\B([A-Z])/g,ce=ie(e=>e.replace(se,`-$1`).toLowerCase()),le=ie(e=>e.charAt(0).toUpperCase()+e.slice(1)),ue=ie(e=>e?`on${le(e)}`:``),de=(e,t)=>!Object.is(e,t),fe=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},pe=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},x=e=>{let t=parseFloat(e);return isNaN(t)?e:t},me,he=()=>me||=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{};function ge(e){if(d(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],i=h(r)?be(r):ge(r);if(i)for(let e in i)t[e]=i[e]}return t}else if(h(e)||_(e))return e}var _e=/;(?![^(]*\))/g,ve=/:([^]+)/,ye=/\/\*[^]*?\*\//g;function be(e){let t={};return e.replace(ye,``).split(_e).forEach(e=>{if(e){let n=e.split(ve);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function S(e){let t=``;if(h(e))t=e;else if(d(e))for(let n=0;n<e.length;n++){let r=S(e[n]);r&&(t+=r+` `)}else if(_(e))for(let n in e)e[n]&&(t+=n+` `);return t.trim()}var xe=`itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`,Se=e(xe);xe+``;function Ce(e){return!!e||e===``}var we=e=>!!(e&&e.__v_isRef===!0),C=e=>h(e)?e:e==null?``:d(e)||_(e)&&(e.toString===y||!m(e.toString))?we(e)?C(e.value):JSON.stringify(e,Te,2):String(e),Te=(e,t)=>we(t)?Te(e,t.value):f(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((e,[t,n],r)=>(e[Ee(t,r)+` =>`]=n,e),{})}:p(t)?{[`Set(${t.size})`]:[...t.values()].map(e=>Ee(e))}:g(t)?Ee(t):_(t)&&!d(t)&&!te(t)?String(t):t,Ee=(e,t=``)=>g(e)?`Symbol(${e.description??t})`:e,De,Oe=class{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=De,!e&&De&&(this.index=(De.scopes||=[]).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].pause();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].resume();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].resume()}}run(e){if(this._active){let t=De;try{return De=this,e()}finally{De=t}}}on(){++this._on===1&&(this.prevScope=De,De=this)}off(){this._on>0&&--this._on===0&&(De=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){this._active=!1;let t,n;for(t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(this.effects.length=0,t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){let e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index)}this.parent=void 0}}};function ke(){return De}var w,Ae=new WeakSet,je=class{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,De&&De.active&&De.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Ae.has(this)&&(Ae.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Fe(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Je(this),Re(this);let e=w,t=We;w=this,We=!0;try{return this.fn()}finally{ze(this),w=e,We=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)He(e);this.deps=this.depsTail=void 0,Je(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Ae.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Be(this)&&this.run()}get dirty(){return Be(this)}},Me=0,Ne,Pe;function Fe(e,t=!1){if(e.flags|=8,t){e.next=Pe,Pe=e;return}e.next=Ne,Ne=e}function Ie(){Me++}function Le(){if(--Me>0)return;if(Pe){let e=Pe;for(Pe=void 0;e;){let t=e.next;e.next=void 0,e.flags&=-9,e=t}}let e;for(;Ne;){let t=Ne;for(Ne=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(t){e||=t}t=n}}if(e)throw e}function Re(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function ze(e){let t,n=e.depsTail,r=n;for(;r;){let e=r.prevDep;r.version===-1?(r===n&&(n=e),He(r),Ue(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=e}e.deps=t,e.depsTail=n}function Be(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Ve(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Ve(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Ye)||(e.globalVersion=Ye,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Be(e))))return;e.flags|=2;let t=e.dep,n=w,r=We;w=e,We=!0;try{Re(e);let n=e.fn(e._value);(t.version===0||de(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(e){throw t.version++,e}finally{w=n,We=r,ze(e),e.flags&=-3}}function He(e,t=!1){let{dep:n,prevSub:r,nextSub:i}=e;if(r&&(r.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)He(e,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function Ue(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var We=!0,Ge=[];function Ke(){Ge.push(We),We=!1}function qe(){let e=Ge.pop();We=e===void 0?!0:e}function Je(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let e=w;w=void 0;try{t()}finally{w=e}}}var Ye=0,Xe=class{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},Ze=class{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!w||!We||w===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==w)t=this.activeLink=new Xe(w,this),w.deps?(t.prevDep=w.depsTail,w.depsTail.nextDep=t,w.depsTail=t):w.deps=w.depsTail=t,Qe(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){let e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=w.depsTail,t.nextDep=void 0,w.depsTail.nextDep=t,w.depsTail=t,w.deps===t&&(w.deps=e)}return t}trigger(e){this.version++,Ye++,this.notify(e)}notify(e){Ie();try{for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{Le()}}};function Qe(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let e=t.deps;e;e=e.nextDep)Qe(e)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var $e=new WeakMap,et=Symbol(``),tt=Symbol(``),nt=Symbol(``);function rt(e,t,n){if(We&&w){let t=$e.get(e);t||$e.set(e,t=new Map);let r=t.get(n);r||(t.set(n,r=new Ze),r.map=t,r.key=n),r.track()}}function it(e,t,n,r,i,a){let o=$e.get(e);if(!o){Ye++;return}let s=e=>{e&&e.trigger()};if(Ie(),t===`clear`)o.forEach(s);else{let i=d(e),a=i&&ne(n);if(i&&n===`length`){let e=Number(r);o.forEach((t,n)=>{(n===`length`||n===nt||!g(n)&&n>=e)&&s(t)})}else switch((n!==void 0||o.has(void 0))&&s(o.get(n)),a&&s(o.get(nt)),t){case`add`:i?a&&s(o.get(`length`)):(s(o.get(et)),f(e)&&s(o.get(tt)));break;case`delete`:i||(s(o.get(et)),f(e)&&s(o.get(tt)));break;case`set`:f(e)&&s(o.get(et));break}}Le()}function at(e){let t=T(e);return t===e?t:(rt(t,`iterate`,nt),Gt(e)?t:t.map(Jt))}function ot(e){return rt(e=T(e),`iterate`,nt),e}function st(e,t){return Wt(e)?Ut(e)?Yt(Jt(t)):Yt(t):Jt(t)}var ct={__proto__:null,[Symbol.iterator](){return lt(this,Symbol.iterator,e=>st(this,e))},concat(...e){return at(this).concat(...e.map(e=>d(e)?at(e):e))},entries(){return lt(this,`entries`,e=>(e[1]=st(this,e[1]),e))},every(e,t){return dt(this,`every`,e,t,void 0,arguments)},filter(e,t){return dt(this,`filter`,e,t,e=>e.map(e=>st(this,e)),arguments)},find(e,t){return dt(this,`find`,e,t,e=>st(this,e),arguments)},findIndex(e,t){return dt(this,`findIndex`,e,t,void 0,arguments)},findLast(e,t){return dt(this,`findLast`,e,t,e=>st(this,e),arguments)},findLastIndex(e,t){return dt(this,`findLastIndex`,e,t,void 0,arguments)},forEach(e,t){return dt(this,`forEach`,e,t,void 0,arguments)},includes(...e){return pt(this,`includes`,e)},indexOf(...e){return pt(this,`indexOf`,e)},join(e){return at(this).join(e)},lastIndexOf(...e){return pt(this,`lastIndexOf`,e)},map(e,t){return dt(this,`map`,e,t,void 0,arguments)},pop(){return mt(this,`pop`)},push(...e){return mt(this,`push`,e)},reduce(e,...t){return ft(this,`reduce`,e,t)},reduceRight(e,...t){return ft(this,`reduceRight`,e,t)},shift(){return mt(this,`shift`)},some(e,t){return dt(this,`some`,e,t,void 0,arguments)},splice(...e){return mt(this,`splice`,e)},toReversed(){return at(this).toReversed()},toSorted(e){return at(this).toSorted(e)},toSpliced(...e){return at(this).toSpliced(...e)},unshift(...e){return mt(this,`unshift`,e)},values(){return lt(this,`values`,e=>st(this,e))}};function lt(e,t,n){let r=ot(e),i=r[t]();return r!==e&&!Gt(e)&&(i._next=i.next,i.next=()=>{let e=i._next();return e.done||(e.value=n(e.value)),e}),i}var ut=Array.prototype;function dt(e,t,n,r,i,a){let o=ot(e),s=o!==e&&!Gt(e),c=o[t];if(c!==ut[t]){let t=c.apply(e,a);return s?Jt(t):t}let l=n;o!==e&&(s?l=function(t,r){return n.call(this,st(e,t),r,e)}:n.length>2&&(l=function(t,r){return n.call(this,t,r,e)}));let u=c.call(o,l,r);return s&&i?i(u):u}function ft(e,t,n,r){let i=ot(e),a=n;return i!==e&&(Gt(e)?n.length>3&&(a=function(t,r,i){return n.call(this,t,r,i,e)}):a=function(t,r,i){return n.call(this,t,st(e,r),i,e)}),i[t](a,...r)}function pt(e,t,n){let r=T(e);rt(r,`iterate`,nt);let i=r[t](...n);return(i===-1||i===!1)&&Kt(n[0])?(n[0]=T(n[0]),r[t](...n)):i}function mt(e,t,n=[]){Ke(),Ie();let r=T(e)[t].apply(e,n);return Le(),qe(),r}var ht=e(`__proto__,__v_isRef,__isVue`),gt=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!==`arguments`&&e!==`caller`).map(e=>Symbol[e]).filter(g));function _t(e){g(e)||(e=String(e));let t=T(this);return rt(t,`has`,e),t.hasOwnProperty(e)}var vt=class{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,n){if(t===`__v_skip`)return e.__v_skip;let r=this._isReadonly,i=this._isShallow;if(t===`__v_isReactive`)return!r;if(t===`__v_isReadonly`)return r;if(t===`__v_isShallow`)return i;if(t===`__v_raw`)return n===(r?i?It:Ft:i?Pt:Nt).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;let a=d(e);if(!r){let e;if(a&&(e=ct[t]))return e;if(t===`hasOwnProperty`)return _t}let o=Reflect.get(e,t,Xt(e)?e:n);if((g(t)?gt.has(t):ht(t))||(r||rt(e,`get`,t),i))return o;if(Xt(o)){let e=a&&ne(t)?o:o.value;return r&&_(e)?Vt(e):e}return _(o)?r?Vt(o):zt(o):o}},yt=class extends vt{constructor(e=!1){super(!1,e)}set(e,t,n,r){let i=e[t],a=d(e)&&ne(t);if(!this._isShallow){let e=Wt(i);if(!Gt(n)&&!Wt(n)&&(i=T(i),n=T(n)),!a&&Xt(i)&&!Xt(n))return e||(i.value=n),!0}let o=a?Number(t)<e.length:u(e,t),s=Reflect.set(e,t,n,Xt(e)?e:r);return e===T(r)&&(o?de(n,i)&&it(e,`set`,t,n,i):it(e,`add`,t,n)),s}deleteProperty(e,t){let n=u(e,t),r=e[t],i=Reflect.deleteProperty(e,t);return i&&n&&it(e,`delete`,t,void 0,r),i}has(e,t){let n=Reflect.has(e,t);return(!g(t)||!gt.has(t))&&rt(e,`has`,t),n}ownKeys(e){return rt(e,`iterate`,d(e)?`length`:et),Reflect.ownKeys(e)}},bt=class extends vt{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}},xt=new yt,St=new bt,Ct=new yt(!0),wt=e=>e,Tt=e=>Reflect.getPrototypeOf(e);function Et(e,t,n){return function(...r){let i=this.__v_raw,a=T(i),o=f(a),s=e===`entries`||e===Symbol.iterator&&o,c=e===`keys`&&o,l=i[e](...r),u=n?wt:t?Yt:Jt;return!t&&rt(a,`iterate`,c?tt:et),{next(){let{value:e,done:t}=l.next();return t?{value:e,done:t}:{value:s?[u(e[0]),u(e[1])]:u(e),done:t}},[Symbol.iterator](){return this}}}}function Dt(e){return function(...t){return e===`delete`?!1:e===`clear`?void 0:this}}function Ot(e,t){let n={get(n){let r=this.__v_raw,i=T(r),a=T(n);e||(de(n,a)&&rt(i,`get`,n),rt(i,`get`,a));let{has:o}=Tt(i),s=t?wt:e?Yt:Jt;if(o.call(i,n))return s(r.get(n));if(o.call(i,a))return s(r.get(a));r!==i&&r.get(n)},get size(){let t=this.__v_raw;return!e&&rt(T(t),`iterate`,et),t.size},has(t){let n=this.__v_raw,r=T(n),i=T(t);return e||(de(t,i)&&rt(r,`has`,t),rt(r,`has`,i)),t===i?n.has(t):n.has(t)||n.has(i)},forEach(n,r){let i=this,a=i.__v_raw,o=T(a),s=t?wt:e?Yt:Jt;return!e&&rt(o,`iterate`,et),a.forEach((e,t)=>n.call(r,s(e),s(t),i))}};return s(n,e?{add:Dt(`add`),set:Dt(`set`),delete:Dt(`delete`),clear:Dt(`clear`)}:{add(e){!t&&!Gt(e)&&!Wt(e)&&(e=T(e));let n=T(this);return Tt(n).has.call(n,e)||(n.add(e),it(n,`add`,e,e)),this},set(e,n){!t&&!Gt(n)&&!Wt(n)&&(n=T(n));let r=T(this),{has:i,get:a}=Tt(r),o=i.call(r,e);o||=(e=T(e),i.call(r,e));let s=a.call(r,e);return r.set(e,n),o?de(n,s)&&it(r,`set`,e,n,s):it(r,`add`,e,n),this},delete(e){let t=T(this),{has:n,get:r}=Tt(t),i=n.call(t,e);i||=(e=T(e),n.call(t,e));let a=r?r.call(t,e):void 0,o=t.delete(e);return i&&it(t,`delete`,e,void 0,a),o},clear(){let e=T(this),t=e.size!==0,n=e.clear();return t&&it(e,`clear`,void 0,void 0,void 0),n}}),[`keys`,`values`,`entries`,Symbol.iterator].forEach(r=>{n[r]=Et(r,e,t)}),n}function kt(e,t){let n=Ot(e,t);return(t,r,i)=>r===`__v_isReactive`?!e:r===`__v_isReadonly`?e:r===`__v_raw`?t:Reflect.get(u(n,r)&&r in t?n:t,r,i)}var At={get:kt(!1,!1)},jt={get:kt(!1,!0)},Mt={get:kt(!0,!1)},Nt=new WeakMap,Pt=new WeakMap,Ft=new WeakMap,It=new WeakMap;function Lt(e){switch(e){case`Object`:case`Array`:return 1;case`Map`:case`Set`:case`WeakMap`:case`WeakSet`:return 2;default:return 0}}function Rt(e){return e.__v_skip||!Object.isExtensible(e)?0:Lt(ee(e))}function zt(e){return Wt(e)?e:Ht(e,!1,xt,At,Nt)}function Bt(e){return Ht(e,!1,Ct,jt,Pt)}function Vt(e){return Ht(e,!0,St,Mt,Ft)}function Ht(e,t,n,r,i){if(!_(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;let a=Rt(e);if(a===0)return e;let o=i.get(e);if(o)return o;let s=new Proxy(e,a===2?r:n);return i.set(e,s),s}function Ut(e){return Wt(e)?Ut(e.__v_raw):!!(e&&e.__v_isReactive)}function Wt(e){return!!(e&&e.__v_isReadonly)}function Gt(e){return!!(e&&e.__v_isShallow)}function Kt(e){return e?!!e.__v_raw:!1}function T(e){let t=e&&e.__v_raw;return t?T(t):e}function qt(e){return!u(e,`__v_skip`)&&Object.isExtensible(e)&&pe(e,`__v_skip`,!0),e}var Jt=e=>_(e)?zt(e):e,Yt=e=>_(e)?Vt(e):e;function Xt(e){return e?e.__v_isRef===!0:!1}function Zt(e){return Qt(e,!1)}function Qt(e,t){return Xt(e)?e:new $t(e,t)}var $t=class{constructor(e,t){this.dep=new Ze,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?e:T(e),this._value=t?e:Jt(e),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(e){let t=this._rawValue,n=this.__v_isShallow||Gt(e)||Wt(e);e=n?e:T(e),de(e,t)&&(this._rawValue=e,this._value=n?e:Jt(e),this.dep.trigger())}};function en(e){return Xt(e)?e.value:e}var tn={get:(e,t,n)=>t===`__v_raw`?e:en(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let i=e[t];return Xt(i)&&!Xt(n)?(i.value=n,!0):Reflect.set(e,t,n,r)}};function nn(e){return Ut(e)?e:new Proxy(e,tn)}var rn=class{constructor(e,t,n){this.fn=e,this.setter=t,this._value=void 0,this.dep=new Ze(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Ye-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&w!==this)return Fe(this,!0),!0}get value(){let e=this.dep.track();return Ve(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}};function an(e,t,n=!1){let r,i;return m(e)?r=e:(r=e.get,i=e.set),new rn(r,i,n)}var on={},sn=new WeakMap,cn=void 0;function ln(e,t=!1,n=cn){if(n){let t=sn.get(n);t||sn.set(n,t=[]),t.push(e)}}function un(e,n,i=t){let{immediate:a,deep:o,once:s,scheduler:l,augmentJob:u,call:f}=i,p=e=>o?e:Gt(e)||o===!1||o===0?dn(e,1):dn(e),h,g,_,v,y=!1,b=!1;if(Xt(e)?(g=()=>e.value,y=Gt(e)):Ut(e)?(g=()=>p(e),y=!0):d(e)?(b=!0,y=e.some(e=>Ut(e)||Gt(e)),g=()=>e.map(e=>{if(Xt(e))return e.value;if(Ut(e))return p(e);if(m(e))return f?f(e,2):e()})):g=m(e)?n?f?()=>f(e,2):e:()=>{if(_){Ke();try{_()}finally{qe()}}let t=cn;cn=h;try{return f?f(e,3,[v]):e(v)}finally{cn=t}}:r,n&&o){let e=g,t=o===!0?1/0:o;g=()=>dn(e(),t)}let ee=ke(),te=()=>{h.stop(),ee&&ee.active&&c(ee.effects,h)};if(s&&n){let e=n;n=(...t)=>{e(...t),te()}}let ne=b?Array(e.length).fill(on):on,re=e=>{if(!(!(h.flags&1)||!h.dirty&&!e))if(n){let e=h.run();if(o||y||(b?e.some((e,t)=>de(e,ne[t])):de(e,ne))){_&&_();let t=cn;cn=h;try{let t=[e,ne===on?void 0:b&&ne[0]===on?[]:ne,v];ne=e,f?f(n,3,t):n(...t)}finally{cn=t}}}else h.run()};return u&&u(re),h=new je(g),h.scheduler=l?()=>l(re,!1):re,v=e=>ln(e,!1,h),_=h.onStop=()=>{let e=sn.get(h);if(e){if(f)f(e,4);else for(let t of e)t();sn.delete(h)}},n?a?re(!0):ne=h.run():l?l(re.bind(null,!0),!0):h.run(),te.pause=h.pause.bind(h),te.resume=h.resume.bind(h),te.stop=te,te}function dn(e,t=1/0,n){if(t<=0||!_(e)||e.__v_skip||(n||=new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,Xt(e))dn(e.value,t,n);else if(d(e))for(let r=0;r<e.length;r++)dn(e[r],t,n);else if(p(e)||f(e))e.forEach(e=>{dn(e,t,n)});else if(te(e)){for(let r in e)dn(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&dn(e[r],t,n)}return e}function fn(e,t,n,r){try{return r?e(...r):e()}catch(e){mn(e,t,n)}}function pn(e,t,n,r){if(m(e)){let i=fn(e,t,n,r);return i&&v(i)&&i.catch(e=>{mn(e,t,n)}),i}if(d(e)){let i=[];for(let a=0;a<e.length;a++)i.push(pn(e[a],t,n,r));return i}}function mn(e,n,r,i=!0){let a=n?n.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:s}=n&&n.appContext.config||t;if(n){let t=n.parent,i=n.proxy,a=`https://vuejs.org/error-reference/#runtime-${r}`;for(;t;){let n=t.ec;if(n){for(let t=0;t<n.length;t++)if(n[t](e,i,a)===!1)return}t=t.parent}if(o){Ke(),fn(o,null,10,[e,i,a]),qe();return}}hn(e,r,a,i,s)}function hn(e,t,n,r=!0,i=!1){if(i)throw e;console.error(e)}var gn=[],_n=-1,vn=[],yn=null,bn=0,xn=Promise.resolve(),Sn=null;function Cn(e){let t=Sn||xn;return e?t.then(this?e.bind(this):e):t}function wn(e){let t=_n+1,n=gn.length;for(;t<n;){let r=t+n>>>1,i=gn[r],a=An(i);a<e||a===e&&i.flags&2?t=r+1:n=r}return t}function Tn(e){if(!(e.flags&1)){let t=An(e),n=gn[gn.length-1];!n||!(e.flags&2)&&t>=An(n)?gn.push(e):gn.splice(wn(t),0,e),e.flags|=1,En()}}function En(){Sn||=xn.then(jn)}function Dn(e){d(e)?vn.push(...e):yn&&e.id===-1?yn.splice(bn+1,0,e):e.flags&1||(vn.push(e),e.flags|=1),En()}function On(e,t,n=_n+1){for(;n<gn.length;n++){let t=gn[n];if(t&&t.flags&2){if(e&&t.id!==e.uid)continue;gn.splice(n,1),n--,t.flags&4&&(t.flags&=-2),t(),t.flags&4||(t.flags&=-2)}}}function kn(e){if(vn.length){let e=[...new Set(vn)].sort((e,t)=>An(e)-An(t));if(vn.length=0,yn){yn.push(...e);return}for(yn=e,bn=0;bn<yn.length;bn++){let e=yn[bn];e.flags&4&&(e.flags&=-2),e.flags&8||e(),e.flags&=-2}yn=null,bn=0}}var An=e=>e.id==null?e.flags&2?-1:1/0:e.id;function jn(e){try{for(_n=0;_n<gn.length;_n++){let e=gn[_n];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),fn(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;_n<gn.length;_n++){let e=gn[_n];e&&(e.flags&=-2)}_n=-1,gn.length=0,kn(e),Sn=null,(gn.length||vn.length)&&jn(e)}}var Mn=null,Nn=null;function Pn(e){let t=Mn;return Mn=e,Nn=e&&e.type.__scopeId||null,t}function Fn(e,t=Mn,n){if(!t||e._n)return e;let r=(...n)=>{r._d&&Ui(-1);let i=Pn(t),a;try{a=e(...n)}finally{Pn(i),r._d&&Ui(1)}return a};return r._n=!0,r._c=!0,r._d=!0,r}function In(e,n){if(Mn===null)return e;let r=Ta(Mn),i=e.dirs||=[];for(let e=0;e<n.length;e++){let[a,o,s,c=t]=n[e];a&&(m(a)&&(a={mounted:a,updated:a}),a.deep&&dn(o),i.push({dir:a,instance:r,value:o,oldValue:void 0,arg:s,modifiers:c}))}return e}function Ln(e,t,n,r){let i=e.dirs,a=t&&t.dirs;for(let o=0;o<i.length;o++){let s=i[o];a&&(s.oldValue=a[o].value);let c=s.dir[r];c&&(Ke(),pn(c,n,8,[e.el,s,e,t]),qe())}}var Rn=Symbol(`_vte`),zn=e=>e.__isTeleport,Bn=Symbol(`_leaveCb`);function Vn(e,t){e.shapeFlag&6&&e.component?(e.transition=t,Vn(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Hn(e){e.ids=[e.ids[0]+ e.ids[2]+++`-`,0,0]}var Un=new WeakMap;function Wn(e,n,r,a,o=!1){if(d(e)){e.forEach((e,t)=>Wn(e,n&&(d(n)?n[t]:n),r,a,o));return}if(Kn(a)&&!o){a.shapeFlag&512&&a.type.__asyncResolved&&a.component.subTree.component&&Wn(e,n,r,a.component.subTree);return}let s=a.shapeFlag&4?Ta(a.component):a.el,l=o?null:s,{i:f,r:p}=e,g=n&&n.r,_=f.refs===t?f.refs={}:f.refs,v=f.setupState,y=T(v),b=v===t?i:e=>u(y,e),ee=e=>!0;if(g!=null&&g!==p){if(Gn(n),h(g))_[g]=null,b(g)&&(v[g]=null);else if(Xt(g)){ee(g)&&(g.value=null);let e=n;e.k&&(_[e.k]=null)}}if(m(p))fn(p,f,12,[l,_]);else{let t=h(p),n=Xt(p);if(t||n){let i=()=>{if(e.f){let n=t?b(p)?v[p]:_[p]:ee(p)||!e.k?p.value:_[e.k];if(o)d(n)&&c(n,s);else if(d(n))n.includes(s)||n.push(s);else if(t)_[p]=[s],b(p)&&(v[p]=_[p]);else{let t=[s];ee(p)&&(p.value=t),e.k&&(_[e.k]=t)}}else t?(_[p]=l,b(p)&&(v[p]=l)):n&&(ee(p)&&(p.value=l),e.k&&(_[e.k]=l))};if(l){let t=()=>{i(),Un.delete(e)};t.id=-1,Un.set(e,t),Ci(t,r)}else Gn(e),i()}}}function Gn(e){let t=Un.get(e);t&&(t.flags|=8,Un.delete(e))}he().requestIdleCallback,he().cancelIdleCallback;var Kn=e=>!!e.type.__asyncLoader,qn=e=>e.type.__isKeepAlive;function Jn(e,t){Xn(e,`a`,t)}function Yn(e,t){Xn(e,`da`,t)}function Xn(e,t,n=la){let r=e.__wdc||=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent}return e()};if(Qn(t,r,n),n){let e=n.parent;for(;e&&e.parent;)qn(e.parent.vnode)&&Zn(r,t,n,e),e=e.parent}}function Zn(e,t,n,r){let i=Qn(t,e,r,!0);ar(()=>{c(r[t],i)},n)}function Qn(e,t,n=la,r=!1){if(n){let i=n[e]||(n[e]=[]),a=t.__weh||=(...r)=>{Ke();let i=pa(n),a=pn(t,n,e,r);return i(),qe(),a};return r?i.unshift(a):i.push(a),a}}var $n=e=>(t,n=la)=>{(!ga||e===`sp`)&&Qn(e,(...e)=>t(...e),n)},er=$n(`bm`),tr=$n(`m`),nr=$n(`bu`),rr=$n(`u`),ir=$n(`bum`),ar=$n(`um`),or=$n(`sp`),sr=$n(`rtg`),cr=$n(`rtc`);function lr(e,t=la){Qn(`ec`,e,t)}var ur=`components`;function dr(e,t){return pr(ur,e,!0,t)||e}var fr=Symbol.for(`v-ndc`);function pr(e,t,n=!0,r=!1){let i=Mn||la;if(i){let n=i.type;if(e===ur){let e=Ea(n,!1);if(e&&(e===t||e===oe(t)||e===le(oe(t))))return n}let a=mr(i[e]||n[e],t)||mr(i.appContext[e],t);return!a&&r?n:a}}function mr(e,t){return e&&(e[t]||e[oe(t)]||e[le(oe(t))])}function hr(e,t,n,r){let i,a=n&&n[r],o=d(e);if(o||h(e)){let n=o&&Ut(e),r=!1,s=!1;n&&(r=!Gt(e),s=Wt(e),e=ot(e)),i=Array(e.length);for(let n=0,o=e.length;n<o;n++)i[n]=t(r?s?Yt(Jt(e[n])):Jt(e[n]):e[n],n,void 0,a&&a[n])}else if(typeof e==`number`){i=Array(e);for(let n=0;n<e;n++)i[n]=t(n+1,n,void 0,a&&a[n])}else if(_(e))if(e[Symbol.iterator])i=Array.from(e,(e,n)=>t(e,n,void 0,a&&a[n]));else{let n=Object.keys(e);i=Array(n.length);for(let r=0,o=n.length;r<o;r++){let o=n[r];i[r]=t(e[o],o,r,a&&a[r])}}else i=[];return n&&(n[r]=i),i}var gr=e=>e?ha(e)?Ta(e):gr(e.parent):null,_r=s(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>gr(e.parent),$root:e=>gr(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Er(e),$forceUpdate:e=>e.f||=()=>{Tn(e.update)},$nextTick:e=>e.n||=Cn.bind(e.proxy),$watch:e=>Kr.bind(e)}),vr=(e,n)=>e!==t&&!e.__isScriptSetup&&u(e,n),yr={get({_:e},n){if(n===`__v_skip`)return!0;let{ctx:r,setupState:i,data:a,props:o,accessCache:s,type:c,appContext:l}=e;if(n[0]!==`$`){let e=s[n];if(e!==void 0)switch(e){case 1:return i[n];case 2:return a[n];case 4:return r[n];case 3:return o[n]}else if(vr(i,n))return s[n]=1,i[n];else if(a!==t&&u(a,n))return s[n]=2,a[n];else if(u(o,n))return s[n]=3,o[n];else if(r!==t&&u(r,n))return s[n]=4,r[n];else xr&&(s[n]=0)}let d=_r[n],f,p;if(d)return n===`$attrs`&&rt(e.attrs,`get`,``),d(e);if((f=c.__cssModules)&&(f=f[n]))return f;if(r!==t&&u(r,n))return s[n]=4,r[n];if(p=l.config.globalProperties,u(p,n))return p[n]},set({_:e},n,r){let{data:i,setupState:a,ctx:o}=e;return vr(a,n)?(a[n]=r,!0):i!==t&&u(i,n)?(i[n]=r,!0):u(e.props,n)||n[0]===`$`&&n.slice(1)in e?!1:(o[n]=r,!0)},has({_:{data:e,setupState:n,accessCache:r,ctx:i,appContext:a,props:o,type:s}},c){let l;return!!(r[c]||e!==t&&c[0]!==`$`&&u(e,c)||vr(n,c)||u(o,c)||u(i,c)||u(_r,c)||u(a.config.globalProperties,c)||(l=s.__cssModules)&&l[c])},defineProperty(e,t,n){return n.get==null?u(n,`value`)&&this.set(e,t,n.value,null):e._.accessCache[t]=0,Reflect.defineProperty(e,t,n)}};function br(e){return d(e)?e.reduce((e,t)=>(e[t]=null,e),{}):e}var xr=!0;function Sr(e){let t=Er(e),n=e.proxy,i=e.ctx;xr=!1,t.beforeCreate&&wr(t.beforeCreate,e,`bc`);let{data:a,computed:o,methods:s,watch:c,provide:l,inject:u,created:f,beforeMount:p,mounted:h,beforeUpdate:g,updated:v,activated:y,deactivated:b,beforeDestroy:ee,beforeUnmount:te,destroyed:ne,unmounted:re,render:ie,renderTracked:ae,renderTriggered:oe,errorCaptured:se,serverPrefetch:ce,expose:le,inheritAttrs:ue,components:de,directives:fe,filters:pe}=t;if(u&&Cr(u,i,null),s)for(let e in s){let t=s[e];m(t)&&(i[e]=t.bind(n))}if(a){let t=a.call(n,n);_(t)&&(e.data=zt(t))}if(xr=!0,o)for(let e in o){let t=o[e],a=Oa({get:m(t)?t.bind(n,n):m(t.get)?t.get.bind(n,n):r,set:!m(t)&&m(t.set)?t.set.bind(n):r});Object.defineProperty(i,e,{enumerable:!0,configurable:!0,get:()=>a.value,set:e=>a.value=e})}if(c)for(let e in c)Tr(c[e],i,n,e);if(l){let e=m(l)?l.call(n):l;Reflect.ownKeys(e).forEach(t=>{Br(t,e[t])})}f&&wr(f,e,`c`);function x(e,t){d(t)?t.forEach(t=>e(t.bind(n))):t&&e(t.bind(n))}if(x(er,p),x(tr,h),x(nr,g),x(rr,v),x(Jn,y),x(Yn,b),x(lr,se),x(cr,ae),x(sr,oe),x(ir,te),x(ar,re),x(or,ce),d(le))if(le.length){let t=e.exposed||={};le.forEach(e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t,enumerable:!0})})}else e.exposed||={};ie&&e.render===r&&(e.render=ie),ue!=null&&(e.inheritAttrs=ue),de&&(e.components=de),fe&&(e.directives=fe),ce&&Hn(e)}function Cr(e,t,n=r){for(let n in d(e)&&(e=jr(e)),e){let r=e[n],i;i=_(r)?`default`in r?Vr(r.from||n,r.default,!0):Vr(r.from||n):Vr(r),Xt(i)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e}):t[n]=i}}function wr(e,t,n){pn(d(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n)}function Tr(e,t,n,r){let i=r.includes(`.`)?qr(n,r):()=>n[r];if(h(e)){let n=t[e];m(n)&&Wr(i,n)}else if(m(e))Wr(i,e.bind(n));else if(_(e))if(d(e))e.forEach(e=>Tr(e,t,n,r));else{let r=m(e.handler)?e.handler.bind(n):t[e.handler];m(r)&&Wr(i,r,e)}}function Er(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:i,optionsCache:a,config:{optionMergeStrategies:o}}=e.appContext,s=a.get(t),c;return s?c=s:!i.length&&!n&&!r?c=t:(c={},i.length&&i.forEach(e=>Dr(c,e,o,!0)),Dr(c,t,o)),_(t)&&a.set(t,c),c}function Dr(e,t,n,r=!1){let{mixins:i,extends:a}=t;for(let o in a&&Dr(e,a,n,!0),i&&i.forEach(t=>Dr(e,t,n,!0)),t)if(!(r&&o===`expose`)){let r=Or[o]||n&&n[o];e[o]=r?r(e[o],t[o]):t[o]}return e}var Or={data:kr,props:Pr,emits:Pr,methods:Nr,computed:Nr,beforeCreate:Mr,created:Mr,beforeMount:Mr,mounted:Mr,beforeUpdate:Mr,updated:Mr,beforeDestroy:Mr,beforeUnmount:Mr,destroyed:Mr,unmounted:Mr,activated:Mr,deactivated:Mr,errorCaptured:Mr,serverPrefetch:Mr,components:Nr,directives:Nr,watch:Fr,provide:kr,inject:Ar};function kr(e,t){return t?e?function(){return s(m(e)?e.call(this,this):e,m(t)?t.call(this,this):t)}:t:e}function Ar(e,t){return Nr(jr(e),jr(t))}function jr(e){if(d(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function Mr(e,t){return e?[...new Set([].concat(e,t))]:t}function Nr(e,t){return e?s(Object.create(null),e,t):t}function Pr(e,t){return e?d(e)&&d(t)?[...new Set([...e,...t])]:s(Object.create(null),br(e),br(t??{})):t}function Fr(e,t){if(!e)return t;if(!t)return e;let n=s(Object.create(null),e);for(let r in t)n[r]=Mr(e[r],t[r]);return n}function Ir(){return{app:null,config:{isNativeTag:i,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Lr=0;function Rr(e,t){return function(n,r=null){m(n)||(n=s({},n)),r!=null&&!_(r)&&(r=null);let i=Ir(),a=new WeakSet,o=[],c=!1,l=i.app={_uid:Lr++,_component:n,_props:r,_container:null,_context:i,_instance:null,version:ka,get config(){return i.config},set config(e){},use(e,...t){return a.has(e)||(e&&m(e.install)?(a.add(e),e.install(l,...t)):m(e)&&(a.add(e),e(l,...t))),l},mixin(e){return i.mixins.includes(e)||i.mixins.push(e),l},component(e,t){return t?(i.components[e]=t,l):i.components[e]},directive(e,t){return t?(i.directives[e]=t,l):i.directives[e]},mount(a,o,s){if(!c){let u=l._ceVNode||k(n,r);return u.appContext=i,s===!0?s=`svg`:s===!1&&(s=void 0),o&&t?t(u,a):e(u,a,s),c=!0,l._container=a,a.__vue_app__=l,Ta(u.component)}},onUnmount(e){o.push(e)},unmount(){c&&(pn(o,l._instance,16),e(null,l._container),delete l._container.__vue_app__)},provide(e,t){return i.provides[e]=t,l},runWithContext(e){let t=zr;zr=l;try{return e()}finally{zr=t}}};return l}}var zr=null;function Br(e,t){if(la){let n=la.provides,r=la.parent&&la.parent.provides;r===n&&(n=la.provides=Object.create(r)),n[e]=t}}function Vr(e,t,n=!1){let r=ua();if(r||zr){let i=zr?zr._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(i&&e in i)return i[e];if(arguments.length>1)return n&&m(t)?t.call(r&&r.proxy):t}}var Hr=Symbol.for(`v-scx`),Ur=()=>Vr(Hr);function Wr(e,t,n){return Gr(e,t,n)}function Gr(e,n,i=t){let{immediate:a,deep:o,flush:c,once:l}=i,u=s({},i),d=n&&a||!n&&c!==`post`,f;if(ga){if(c===`sync`){let e=Ur();f=e.__watcherHandles||=[]}else if(!d){let e=()=>{};return e.stop=r,e.resume=r,e.pause=r,e}}let p=la;u.call=(e,t,n)=>pn(e,p,t,n);let m=!1;c===`post`?u.scheduler=e=>{Ci(e,p&&p.suspense)}:c!==`sync`&&(m=!0,u.scheduler=(e,t)=>{t?e():Tn(e)}),u.augmentJob=e=>{n&&(e.flags|=4),m&&(e.flags|=2,p&&(e.id=p.uid,e.i=p))};let h=un(e,n,u);return ga&&(f?f.push(h):d&&h()),h}function Kr(e,t,n){let r=this.proxy,i=h(e)?e.includes(`.`)?qr(r,e):()=>r[e]:e.bind(r,r),a;m(t)?a=t:(a=t.handler,n=t);let o=pa(this),s=Gr(i,a.bind(r),n);return o(),s}function qr(e,t){let n=t.split(`.`);return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}var Jr=(e,t)=>t===`modelValue`||t===`model-value`?e.modelModifiers:e[`${t}Modifiers`]||e[`${oe(t)}Modifiers`]||e[`${ce(t)}Modifiers`];function Yr(e,n,...r){if(e.isUnmounted)return;let i=e.vnode.props||t,a=r,o=n.startsWith(`update:`),s=o&&Jr(i,n.slice(7));s&&(s.trim&&(a=r.map(e=>h(e)?e.trim():e)),s.number&&(a=r.map(x)));let c,l=i[c=ue(n)]||i[c=ue(oe(n))];!l&&o&&(l=i[c=ue(ce(n))]),l&&pn(l,e,6,a);let u=i[c+`Once`];if(u){if(!e.emitted)e.emitted={};else if(e.emitted[c])return;e.emitted[c]=!0,pn(u,e,6,a)}}var Xr=new WeakMap;function Zr(e,t,n=!1){let r=n?Xr:t.emitsCache,i=r.get(e);if(i!==void 0)return i;let a=e.emits,o={},c=!1;if(!m(e)){let r=e=>{let n=Zr(e,t,!0);n&&(c=!0,s(o,n))};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return!a&&!c?(_(e)&&r.set(e,null),null):(d(a)?a.forEach(e=>o[e]=null):s(o,a),_(e)&&r.set(e,o),o)}function Qr(e,t){return!e||!a(t)?!1:(t=t.slice(2).replace(/Once$/,``),u(e,t[0].toLowerCase()+t.slice(1))||u(e,ce(t))||u(e,t))}function $r(e){let{type:t,vnode:n,proxy:r,withProxy:i,propsOptions:[a],slots:s,attrs:c,emit:l,render:u,renderCache:d,props:f,data:p,setupState:m,ctx:h,inheritAttrs:g}=e,_=Pn(e),v,y;try{if(n.shapeFlag&4){let e=i||r,t=e;v=ta(u.call(t,e,d,f,m,p,h)),y=c}else{let e=t;v=ta(e.length>1?e(f,{attrs:c,slots:s,emit:l}):e(f,null)),y=t.props?c:ei(c)}}catch(t){zi.length=0,mn(t,e,1),v=k(Li)}let b=v;if(y&&g!==!1){let e=Object.keys(y),{shapeFlag:t}=b;e.length&&t&7&&(a&&e.some(o)&&(y=ti(y,a)),b=Qi(b,y,!1,!0))}return n.dirs&&(b=Qi(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&Vn(b,n.transition),v=b,Pn(_),v}var ei=e=>{let t;for(let n in e)(n===`class`||n===`style`||a(n))&&((t||={})[n]=e[n]);return t},ti=(e,t)=>{let n={};for(let r in e)(!o(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function ni(e,t,n){let{props:r,children:i,component:a}=e,{props:o,children:s,patchFlag:c}=t,l=a.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?ri(r,o,l):!!o;if(c&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t];if(o[n]!==r[n]&&!Qr(l,n))return!0}}}else return(i||s)&&(!s||!s.$stable)?!0:r===o?!1:r?o?ri(r,o,l):!0:!!o;return!1}function ri(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let i=0;i<r.length;i++){let a=r[i];if(t[a]!==e[a]&&!Qr(n,a))return!0}return!1}function ii({vnode:e,parent:t},n){for(;t;){let r=t.subTree;if(r.suspense&&r.suspense.activeBranch===e&&(r.el=e.el),r===e)(e=t.vnode).el=n,t=t.parent;else break}}var ai={},oi=()=>Object.create(ai),si=e=>Object.getPrototypeOf(e)===ai;function ci(e,t,n,r=!1){let i={},a=oi();for(let n in e.propsDefaults=Object.create(null),ui(e,t,i,a),e.propsOptions[0])n in i||(i[n]=void 0);n?e.props=r?i:Bt(i):e.type.props?e.props=i:e.props=a,e.attrs=a}function li(e,t,n,r){let{props:i,attrs:a,vnode:{patchFlag:o}}=e,s=T(i),[c]=e.propsOptions,l=!1;if((r||o>0)&&!(o&16)){if(o&8){let n=e.vnode.dynamicProps;for(let r=0;r<n.length;r++){let o=n[r];if(Qr(e.emitsOptions,o))continue;let d=t[o];if(c)if(u(a,o))d!==a[o]&&(a[o]=d,l=!0);else{let t=oe(o);i[t]=di(c,s,t,d,e,!1)}else d!==a[o]&&(a[o]=d,l=!0)}}}else{ui(e,t,i,a)&&(l=!0);let r;for(let a in s)(!t||!u(t,a)&&((r=ce(a))===a||!u(t,r)))&&(c?n&&(n[a]!==void 0||n[r]!==void 0)&&(i[a]=di(c,s,a,void 0,e,!0)):delete i[a]);if(a!==s)for(let e in a)(!t||!u(t,e))&&(delete a[e],l=!0)}l&&it(e.attrs,`set`,``)}function ui(e,n,r,i){let[a,o]=e.propsOptions,s=!1,c;if(n)for(let t in n){if(re(t))continue;let l=n[t],d;a&&u(a,d=oe(t))?!o||!o.includes(d)?r[d]=l:(c||={})[d]=l:Qr(e.emitsOptions,t)||(!(t in i)||l!==i[t])&&(i[t]=l,s=!0)}if(o){let n=T(r),i=c||t;for(let t=0;t<o.length;t++){let s=o[t];r[s]=di(a,n,s,i[s],e,!u(i,s))}}return s}function di(e,t,n,r,i,a){let o=e[n];if(o!=null){let e=u(o,`default`);if(e&&r===void 0){let e=o.default;if(o.type!==Function&&!o.skipFactory&&m(e)){let{propsDefaults:a}=i;if(n in a)r=a[n];else{let o=pa(i);r=a[n]=e.call(null,t),o()}}else r=e;i.ce&&i.ce._setProp(n,r)}o[0]&&(a&&!e?r=!1:o[1]&&(r===``||r===ce(n))&&(r=!0))}return r}var fi=new WeakMap;function pi(e,r,i=!1){let a=i?fi:r.propsCache,o=a.get(e);if(o)return o;let c=e.props,l={},f=[],p=!1;if(!m(e)){let t=e=>{p=!0;let[t,n]=pi(e,r,!0);s(l,t),n&&f.push(...n)};!i&&r.mixins.length&&r.mixins.forEach(t),e.extends&&t(e.extends),e.mixins&&e.mixins.forEach(t)}if(!c&&!p)return _(e)&&a.set(e,n),n;if(d(c))for(let e=0;e<c.length;e++){let n=oe(c[e]);mi(n)&&(l[n]=t)}else if(c)for(let e in c){let t=oe(e);if(mi(t)){let n=c[e],r=l[t]=d(n)||m(n)?{type:n}:s({},n),i=r.type,a=!1,o=!0;if(d(i))for(let e=0;e<i.length;++e){let t=i[e],n=m(t)&&t.name;if(n===`Boolean`){a=!0;break}else n===`String`&&(o=!1)}else a=m(i)&&i.name===`Boolean`;r[0]=a,r[1]=o,(a||u(r,`default`))&&f.push(t)}}let h=[l,f];return _(e)&&a.set(e,h),h}function mi(e){return e[0]!==`$`&&!re(e)}var hi=e=>e===`_`||e===`_ctx`||e===`$stable`,gi=e=>d(e)?e.map(ta):[ta(e)],_i=(e,t,n)=>{if(t._n)return t;let r=Fn((...e)=>gi(t(...e)),n);return r._c=!1,r},vi=(e,t,n)=>{let r=e._ctx;for(let n in e){if(hi(n))continue;let i=e[n];if(m(i))t[n]=_i(n,i,r);else if(i!=null){let e=gi(i);t[n]=()=>e}}},yi=(e,t)=>{let n=gi(t);e.slots.default=()=>n},bi=(e,t,n)=>{for(let r in t)(n||!hi(r))&&(e[r]=t[r])},xi=(e,t,n)=>{let r=e.slots=oi();if(e.vnode.shapeFlag&32){let e=t._;e?(bi(r,t,n),n&&pe(r,`_`,e,!0)):vi(t,r)}else t&&yi(e,t)},Si=(e,n,r)=>{let{vnode:i,slots:a}=e,o=!0,s=t;if(i.shapeFlag&32){let e=n._;e?r&&e===1?o=!1:bi(a,n,r):(o=!n.$stable,vi(n,a)),s=n}else n&&(yi(e,n),s={default:1});if(o)for(let e in a)!hi(e)&&s[e]==null&&delete a[e]},Ci=Pi;function wi(e){return Ti(e)}function Ti(e,i){let a=he();a.__VUE__=!0;let{insert:o,remove:s,patchProp:c,createElement:l,createText:u,createComment:d,setText:f,setElementText:p,parentNode:m,nextSibling:h,setScopeId:g=r,insertStaticContent:_}=e,v=(e,t,n,r=null,i=null,a=null,o=void 0,s=null,c=!!t.dynamicChildren)=>{if(e===t)return;e&&!qi(e,t)&&(r=Te(e),xe(e,i,a,!0),e=null),t.patchFlag===-2&&(c=!1,t.dynamicChildren=null);let{type:l,ref:u,shapeFlag:d}=t;switch(l){case Ii:y(e,t,n,r);break;case Li:b(e,t,n,r);break;case Ri:e??ee(t,n,r,o);break;case Fi:de(e,t,n,r,i,a,o,s,c);break;default:d&1?ie(e,t,n,r,i,a,o,s,c):d&6?pe(e,t,n,r,i,a,o,s,c):(d&64||d&128)&&l.process(e,t,n,r,i,a,o,s,c,Oe)}u!=null&&i?Wn(u,e&&e.ref,a,t||e,!t):u==null&&e&&e.ref!=null&&Wn(e.ref,null,a,e,!0)},y=(e,t,n,r)=>{if(e==null)o(t.el=u(t.children),n,r);else{let n=t.el=e.el;t.children!==e.children&&f(n,t.children)}},b=(e,t,n,r)=>{e==null?o(t.el=d(t.children||``),n,r):t.el=e.el},ee=(e,t,n,r)=>{[e.el,e.anchor]=_(e.children,t,n,r,e.el,e.anchor)},te=({el:e,anchor:t},n,r)=>{let i;for(;e&&e!==t;)i=h(e),o(e,n,r),e=i;o(t,n,r)},ne=({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=h(e),s(e),e=n;s(t)},ie=(e,t,n,r,i,a,o,s,c)=>{if(t.type===`svg`?o=`svg`:t.type===`math`&&(o=`mathml`),e==null)ae(t,n,r,i,a,o,s,c);else{let n=e.el&&e.el._isVueCE?e.el:null;try{n&&n._beginPatch(),ce(e,t,i,a,o,s,c)}finally{n&&n._endPatch()}}},ae=(e,t,n,r,i,a,s,u)=>{let d,f,{props:m,shapeFlag:h,transition:g,dirs:_}=e;if(d=e.el=l(e.type,a,m&&m.is,m),h&8?p(d,e.children):h&16&&se(e.children,d,null,r,i,Ei(e,a),s,u),_&&Ln(e,null,r,`created`),oe(d,e,e.scopeId,s,r),m){for(let e in m)e!==`value`&&!re(e)&&c(d,e,null,m[e],a,r);`value`in m&&c(d,`value`,null,m.value,a),(f=m.onVnodeBeforeMount)&&aa(f,r,e)}_&&Ln(e,null,r,`beforeMount`);let v=Oi(i,g);v&&g.beforeEnter(d),o(d,t,n),((f=m&&m.onVnodeMounted)||v||_)&&Ci(()=>{f&&aa(f,r,e),v&&g.enter(d),_&&Ln(e,null,r,`mounted`)},i)},oe=(e,t,n,r,i)=>{if(n&&g(e,n),r)for(let t=0;t<r.length;t++)g(e,r[t]);if(i){let n=i.subTree;if(t===n||Ni(n.type)&&(n.ssContent===t||n.ssFallback===t)){let t=i.vnode;oe(e,t,t.scopeId,t.slotScopeIds,i.parent)}}},se=(e,t,n,r,i,a,o,s,c=0)=>{for(let l=c;l<e.length;l++)v(null,e[l]=s?na(e[l]):ta(e[l]),t,n,r,i,a,o,s)},ce=(e,n,r,i,a,o,s)=>{let l=n.el=e.el,{patchFlag:u,dynamicChildren:d,dirs:f}=n;u|=e.patchFlag&16;let m=e.props||t,h=n.props||t,g;if(r&&Di(r,!1),(g=h.onVnodeBeforeUpdate)&&aa(g,r,n,e),f&&Ln(n,e,r,`beforeUpdate`),r&&Di(r,!0),(m.innerHTML&&h.innerHTML==null||m.textContent&&h.textContent==null)&&p(l,``),d?le(e.dynamicChildren,d,l,r,i,Ei(n,a),o):s||ve(e,n,l,null,r,i,Ei(n,a),o,!1),u>0){if(u&16)ue(l,m,h,r,a);else if(u&2&&m.class!==h.class&&c(l,`class`,null,h.class,a),u&4&&c(l,`style`,m.style,h.style,a),u&8){let e=n.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t],i=m[n],o=h[n];(o!==i||n===`value`)&&c(l,n,i,o,a,r)}}u&1&&e.children!==n.children&&p(l,n.children)}else !s&&d==null&&ue(l,m,h,r,a);((g=h.onVnodeUpdated)||f)&&Ci(()=>{g&&aa(g,r,n,e),f&&Ln(n,e,r,`updated`)},i)},le=(e,t,n,r,i,a,o)=>{for(let s=0;s<t.length;s++){let c=e[s],l=t[s];v(c,l,c.el&&(c.type===Fi||!qi(c,l)||c.shapeFlag&198)?m(c.el):n,null,r,i,a,o,!0)}},ue=(e,n,r,i,a)=>{if(n!==r){if(n!==t)for(let t in n)!re(t)&&!(t in r)&&c(e,t,n[t],null,a,i);for(let t in r){if(re(t))continue;let o=r[t],s=n[t];o!==s&&t!==`value`&&c(e,t,s,o,a,i)}`value`in r&&c(e,`value`,n.value,r.value,a)}},de=(e,t,n,r,i,a,s,c,l)=>{let d=t.el=e?e.el:u(``),f=t.anchor=e?e.anchor:u(``),{patchFlag:p,dynamicChildren:m,slotScopeIds:h}=t;h&&(c=c?c.concat(h):h),e==null?(o(d,n,r),o(f,n,r),se(t.children||[],n,f,i,a,s,c,l)):p>0&&p&64&&m&&e.dynamicChildren?(le(e.dynamicChildren,m,n,i,a,s,c),(t.key!=null||i&&t===i.subTree)&&ki(e,t,!0)):ve(e,t,n,f,i,a,s,c,l)},pe=(e,t,n,r,i,a,o,s,c)=>{t.slotScopeIds=s,e==null?t.shapeFlag&512?i.ctx.activate(t,n,r,o,c):x(t,n,r,i,a,o,c):me(e,t,c)},x=(e,t,n,r,i,a,o)=>{let s=e.component=ca(e,r,i);if(qn(e)&&(s.ctx.renderer=Oe),_a(s,!1,o),s.asyncDep){if(i&&i.registerDep(s,ge,o),!e.el){let r=s.subTree=k(Li);b(null,r,t,n),e.placeholder=r.el}}else ge(s,e,t,n,i,a,o)},me=(e,t,n)=>{let r=t.component=e.component;if(ni(e,t,n))if(r.asyncDep&&!r.asyncResolved){_e(r,t,n);return}else r.next=t,r.update();else t.el=e.el,r.vnode=t},ge=(e,t,n,r,i,a,o)=>{let s=()=>{if(e.isMounted){let{next:t,bu:n,u:r,parent:c,vnode:l}=e;{let n=ji(e);if(n){t&&(t.el=l.el,_e(e,t,o)),n.asyncDep.then(()=>{e.isUnmounted||s()});return}}let u=t,d;Di(e,!1),t?(t.el=l.el,_e(e,t,o)):t=l,n&&fe(n),(d=t.props&&t.props.onVnodeBeforeUpdate)&&aa(d,c,t,l),Di(e,!0);let f=$r(e),p=e.subTree;e.subTree=f,v(p,f,m(p.el),Te(p),e,i,a),t.el=f.el,u===null&&ii(e,f.el),r&&Ci(r,i),(d=t.props&&t.props.onVnodeUpdated)&&Ci(()=>aa(d,c,t,l),i)}else{let o,{el:s,props:c}=t,{bm:l,m:u,parent:d,root:f,type:p}=e,m=Kn(t);if(Di(e,!1),l&&fe(l),!m&&(o=c&&c.onVnodeBeforeMount)&&aa(o,d,t),Di(e,!0),s&&w){let t=()=>{e.subTree=$r(e),w(s,e.subTree,e,i,null)};m&&p.__asyncHydrate?p.__asyncHydrate(s,e,t):t()}else{f.ce&&f.ce._def.shadowRoot!==!1&&f.ce._injectChildStyle(p);let o=e.subTree=$r(e);v(null,o,n,r,e,i,a),t.el=o.el}if(u&&Ci(u,i),!m&&(o=c&&c.onVnodeMounted)){let e=t;Ci(()=>aa(o,d,e),i)}(t.shapeFlag&256||d&&Kn(d.vnode)&&d.vnode.shapeFlag&256)&&e.a&&Ci(e.a,i),e.isMounted=!0,t=n=r=null}};e.scope.on();let c=e.effect=new je(s);e.scope.off();let l=e.update=c.run.bind(c),u=e.job=c.runIfDirty.bind(c);u.i=e,u.id=e.uid,c.scheduler=()=>Tn(u),Di(e,!0),l()},_e=(e,t,n)=>{t.component=e;let r=e.vnode.props;e.vnode=t,e.next=null,li(e,t.props,r,n),Si(e,t.children,n),Ke(),On(e),qe()},ve=(e,t,n,r,i,a,o,s,c=!1)=>{let l=e&&e.children,u=e?e.shapeFlag:0,d=t.children,{patchFlag:f,shapeFlag:m}=t;if(f>0){if(f&128){be(l,d,n,r,i,a,o,s,c);return}else if(f&256){ye(l,d,n,r,i,a,o,s,c);return}}m&8?(u&16&&C(l,i,a),d!==l&&p(n,d)):u&16?m&16?be(l,d,n,r,i,a,o,s,c):C(l,i,a,!0):(u&8&&p(n,``),m&16&&se(d,n,r,i,a,o,s,c))},ye=(e,t,r,i,a,o,s,c,l)=>{e||=n,t||=n;let u=e.length,d=t.length,f=Math.min(u,d),p;for(p=0;p<f;p++){let n=t[p]=l?na(t[p]):ta(t[p]);v(e[p],n,r,null,a,o,s,c,l)}u>d?C(e,a,o,!0,!1,f):se(t,r,i,a,o,s,c,l,f)},be=(e,t,r,i,a,o,s,c,l)=>{let u=0,d=t.length,f=e.length-1,p=d-1;for(;u<=f&&u<=p;){let n=e[u],i=t[u]=l?na(t[u]):ta(t[u]);if(qi(n,i))v(n,i,r,null,a,o,s,c,l);else break;u++}for(;u<=f&&u<=p;){let n=e[f],i=t[p]=l?na(t[p]):ta(t[p]);if(qi(n,i))v(n,i,r,null,a,o,s,c,l);else break;f--,p--}if(u>f){if(u<=p){let e=p+1,n=e<d?t[e].el:i;for(;u<=p;)v(null,t[u]=l?na(t[u]):ta(t[u]),r,n,a,o,s,c,l),u++}}else if(u>p)for(;u<=f;)xe(e[u],a,o,!0),u++;else{let m=u,h=u,g=new Map;for(u=h;u<=p;u++){let e=t[u]=l?na(t[u]):ta(t[u]);e.key!=null&&g.set(e.key,u)}let _,y=0,b=p-h+1,ee=!1,te=0,ne=Array(b);for(u=0;u<b;u++)ne[u]=0;for(u=m;u<=f;u++){let n=e[u];if(y>=b){xe(n,a,o,!0);continue}let i;if(n.key!=null)i=g.get(n.key);else for(_=h;_<=p;_++)if(ne[_-h]===0&&qi(n,t[_])){i=_;break}i===void 0?xe(n,a,o,!0):(ne[i-h]=u+1,i>=te?te=i:ee=!0,v(n,t[i],r,null,a,o,s,c,l),y++)}let re=ee?Ai(ne):n;for(_=re.length-1,u=b-1;u>=0;u--){let e=h+u,n=t[e],f=t[e+1],p=e+1<d?f.el||f.placeholder:i;ne[u]===0?v(null,n,r,p,a,o,s,c,l):ee&&(_<0||u!==re[_]?S(n,r,p,2):_--)}}},S=(e,t,n,r,i=null)=>{let{el:a,type:c,transition:l,children:u,shapeFlag:d}=e;if(d&6){S(e.component.subTree,t,n,r);return}if(d&128){e.suspense.move(t,n,r);return}if(d&64){c.move(e,t,n,Oe);return}if(c===Fi){o(a,t,n);for(let e=0;e<u.length;e++)S(u[e],t,n,r);o(e.anchor,t,n);return}if(c===Ri){te(e,t,n);return}if(r!==2&&d&1&&l)if(r===0)l.beforeEnter(a),o(a,t,n),Ci(()=>l.enter(a),i);else{let{leave:r,delayLeave:i,afterLeave:c}=l,u=()=>{e.ctx.isUnmounted?s(a):o(a,t,n)},d=()=>{a._isLeaving&&a[Bn](!0),r(a,()=>{u(),c&&c()})};i?i(a,u,d):d()}else o(a,t,n)},xe=(e,t,n,r=!1,i=!1)=>{let{type:a,props:o,ref:s,children:c,dynamicChildren:l,shapeFlag:u,patchFlag:d,dirs:f,cacheIndex:p}=e;if(d===-2&&(i=!1),s!=null&&(Ke(),Wn(s,null,n,e,!0),qe()),p!=null&&(t.renderCache[p]=void 0),u&256){t.ctx.deactivate(e);return}let m=u&1&&f,h=!Kn(e),g;if(h&&(g=o&&o.onVnodeBeforeUnmount)&&aa(g,t,e),u&6)we(e.component,n,r);else{if(u&128){e.suspense.unmount(n,r);return}m&&Ln(e,null,t,`beforeUnmount`),u&64?e.type.remove(e,t,n,Oe,r):l&&!l.hasOnce&&(a!==Fi||d>0&&d&64)?C(l,t,n,!1,!0):(a===Fi&&d&384||!i&&u&16)&&C(c,t,n),r&&Se(e)}(h&&(g=o&&o.onVnodeUnmounted)||m)&&Ci(()=>{g&&aa(g,t,e),m&&Ln(e,null,t,`unmounted`)},n)},Se=e=>{let{type:t,el:n,anchor:r,transition:i}=e;if(t===Fi){Ce(n,r);return}if(t===Ri){ne(e);return}let a=()=>{s(n),i&&!i.persisted&&i.afterLeave&&i.afterLeave()};if(e.shapeFlag&1&&i&&!i.persisted){let{leave:t,delayLeave:r}=i,o=()=>t(n,a);r?r(e.el,a,o):o()}else a()},Ce=(e,t)=>{let n;for(;e!==t;)n=h(e),s(e),e=n;s(t)},we=(e,t,n)=>{let{bum:r,scope:i,job:a,subTree:o,um:s,m:c,a:l}=e;Mi(c),Mi(l),r&&fe(r),i.stop(),a&&(a.flags|=8,xe(o,e,t,n)),s&&Ci(s,t),Ci(()=>{e.isUnmounted=!0},t)},C=(e,t,n,r=!1,i=!1,a=0)=>{for(let o=a;o<e.length;o++)xe(e[o],t,n,r,i)},Te=e=>{if(e.shapeFlag&6)return Te(e.component.subTree);if(e.shapeFlag&128)return e.suspense.next();let t=h(e.anchor||e.el),n=t&&t[Rn];return n?h(n):t},Ee=!1,De=(e,t,n)=>{e==null?t._vnode&&xe(t._vnode,null,null,!0):v(t._vnode||null,e,t,null,null,null,n),t._vnode=e,Ee||=(Ee=!0,On(),kn(),!1)},Oe={p:v,um:xe,m:S,r:Se,mt:x,mc:se,pc:ve,pbc:le,n:Te,o:e},ke,w;return i&&([ke,w]=i(Oe)),{render:De,hydrate:ke,createApp:Rr(De,ke)}}function Ei({type:e,props:t},n){return n===`svg`&&e===`foreignObject`||n===`mathml`&&e===`annotation-xml`&&t&&t.encoding&&t.encoding.includes(`html`)?void 0:n}function Di({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function Oi(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function ki(e,t,n=!1){let r=e.children,i=t.children;if(d(r)&&d(i))for(let e=0;e<r.length;e++){let t=r[e],a=i[e];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=i[e]=na(i[e]),a.el=t.el),!n&&a.patchFlag!==-2&&ki(t,a)),a.type===Ii&&a.patchFlag!==-1&&(a.el=t.el),a.type===Li&&!a.el&&(a.el=t.el)}}function Ai(e){let t=e.slice(),n=[0],r,i,a,o,s,c=e.length;for(r=0;r<c;r++){let c=e[r];if(c!==0){if(i=n[n.length-1],e[i]<c){t[r]=i,n.push(r);continue}for(a=0,o=n.length-1;a<o;)s=a+o>>1,e[n[s]]<c?a=s+1:o=s;c<e[n[a]]&&(a>0&&(t[r]=n[a-1]),n[a]=r)}}for(a=n.length,o=n[a-1];a-- >0;)n[a]=o,o=t[o];return n}function ji(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:ji(t)}function Mi(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}var Ni=e=>e.__isSuspense;function Pi(e,t){t&&t.pendingBranch?d(e)?t.effects.push(...e):t.effects.push(e):Dn(e)}var Fi=Symbol.for(`v-fgt`),Ii=Symbol.for(`v-txt`),Li=Symbol.for(`v-cmt`),Ri=Symbol.for(`v-stc`),zi=[],Bi=null;function E(e=!1){zi.push(Bi=e?null:[])}function Vi(){zi.pop(),Bi=zi[zi.length-1]||null}var Hi=1;function Ui(e,t=!1){Hi+=e,e<0&&Bi&&t&&(Bi.hasOnce=!0)}function Wi(e){return e.dynamicChildren=Hi>0?Bi||n:null,Vi(),Hi>0&&Bi&&Bi.push(e),e}function D(e,t,n,r,i,a){return Wi(O(e,t,n,r,i,a,!0))}function Gi(e,t,n,r,i){return Wi(k(e,t,n,r,i,!0))}function Ki(e){return e?e.__v_isVNode===!0:!1}function qi(e,t){return e.type===t.type&&e.key===t.key}var Ji=({key:e})=>e??null,Yi=({ref:e,ref_key:t,ref_for:n})=>(typeof e==`number`&&(e=``+e),e==null?null:h(e)||Xt(e)||m(e)?{i:Mn,r:e,k:t,f:!!n}:e);function O(e,t=null,n=null,r=0,i=null,a=e===Fi?0:1,o=!1,s=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Ji(t),ref:t&&Yi(t),scopeId:Nn,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:a,patchFlag:r,dynamicProps:i,dynamicChildren:null,appContext:null,ctx:Mn};return s?(ra(c,n),a&128&&e.normalize(c)):n&&(c.shapeFlag|=h(n)?8:16),Hi>0&&!o&&Bi&&(c.patchFlag>0||a&6)&&c.patchFlag!==32&&Bi.push(c),c}var k=Xi;function Xi(e,t=null,n=null,r=0,i=null,a=!1){if((!e||e===fr)&&(e=Li),Ki(e)){let r=Qi(e,t,!0);return n&&ra(r,n),Hi>0&&!a&&Bi&&(r.shapeFlag&6?Bi[Bi.indexOf(e)]=r:Bi.push(r)),r.patchFlag=-2,r}if(Da(e)&&(e=e.__vccOpts),t){t=Zi(t);let{class:e,style:n}=t;e&&!h(e)&&(t.class=S(e)),_(n)&&(Kt(n)&&!d(n)&&(n=s({},n)),t.style=ge(n))}let o=h(e)?1:Ni(e)?128:zn(e)?64:_(e)?4:m(e)?2:0;return O(e,t,n,r,i,o,a,!0)}function Zi(e){return e?Kt(e)||si(e)?s({},e):e:null}function Qi(e,t,n=!1,r=!1){let{props:i,ref:a,patchFlag:o,children:s,transition:c}=e,l=t?ia(i||{},t):i,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:l,key:l&&Ji(l),ref:t&&t.ref?n&&a?d(a)?a.concat(Yi(t)):[a,Yi(t)]:Yi(t):a,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Fi?o===-1?16:o|16:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Qi(e.ssContent),ssFallback:e.ssFallback&&Qi(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return c&&r&&Vn(u,c.clone(u)),u}function $i(e=` `,t=0){return k(Ii,null,e,t)}function ea(e=``,t=!1){return t?(E(),Gi(Li,null,e)):k(Li,null,e)}function ta(e){return e==null||typeof e==`boolean`?k(Li):d(e)?k(Fi,null,e.slice()):Ki(e)?na(e):k(Ii,null,String(e))}function na(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Qi(e)}function ra(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(d(t))n=16;else if(typeof t==`object`)if(r&65){let n=t.default;n&&(n._c&&(n._d=!1),ra(e,n()),n._c&&(n._d=!0));return}else{n=32;let r=t._;!r&&!si(t)?t._ctx=Mn:r===3&&Mn&&(Mn.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else m(t)?(t={default:t,_ctx:Mn},n=32):(t=String(t),r&64?(n=16,t=[$i(t)]):n=8);e.children=t,e.shapeFlag|=n}function ia(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let e in r)if(e===`class`)t.class!==r.class&&(t.class=S([t.class,r.class]));else if(e===`style`)t.style=ge([t.style,r.style]);else if(a(e)){let n=t[e],i=r[e];i&&n!==i&&!(d(n)&&n.includes(i))&&(t[e]=n?[].concat(n,i):i)}else e!==``&&(t[e]=r[e])}return t}function aa(e,t,n,r=null){pn(e,t,7,[n,r])}var oa=Ir(),sa=0;function ca(e,n,r){let i=e.type,a=(n?n.appContext:e.appContext)||oa,o={uid:sa++,vnode:e,type:i,parent:n,appContext:a,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Oe(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:n?n.provides:Object.create(a.provides),ids:n?n.ids:[``,0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:pi(i,a),emitsOptions:Zr(i,a),emit:null,emitted:null,propsDefaults:t,inheritAttrs:i.inheritAttrs,ctx:t,data:t,props:t,attrs:t,slots:t,refs:t,setupState:t,setupContext:null,suspense:r,suspenseId:r?r.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=n?n.root:o,o.emit=Yr.bind(null,o),e.ce&&e.ce(o),o}var la=null,ua=()=>la||Mn,da,fa;{let e=he(),t=(t,n)=>{let r;return(r=e[t])||(r=e[t]=[]),r.push(n),e=>{r.length>1?r.forEach(t=>t(e)):r[0](e)}};da=t(`__VUE_INSTANCE_SETTERS__`,e=>la=e),fa=t(`__VUE_SSR_SETTERS__`,e=>ga=e)}var pa=e=>{let t=la;return da(e),e.scope.on(),()=>{e.scope.off(),da(t)}},ma=()=>{la&&la.scope.off(),da(null)};function ha(e){return e.vnode.shapeFlag&4}var ga=!1;function _a(e,t=!1,n=!1){t&&fa(t);let{props:r,children:i}=e.vnode,a=ha(e);ci(e,r,a,t),xi(e,i,n||t);let o=a?va(e,t):void 0;return t&&fa(!1),o}function va(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,yr);let{setup:r}=n;if(r){Ke();let n=e.setupContext=r.length>1?wa(e):null,i=pa(e),a=fn(r,e,0,[e.props,n]),o=v(a);if(qe(),i(),(o||e.sp)&&!Kn(e)&&Hn(e),o){if(a.then(ma,ma),t)return a.then(n=>{ya(e,n,t)}).catch(t=>{mn(t,e,0)});e.asyncDep=a}else ya(e,a,t)}else Sa(e,t)}function ya(e,t,n){m(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:_(t)&&(e.setupState=nn(t)),Sa(e,n)}var ba,xa;function Sa(e,t,n){let i=e.type;if(!e.render){if(!t&&ba&&!i.render){let t=i.template||Er(e).template;if(t){let{isCustomElement:n,compilerOptions:r}=e.appContext.config,{delimiters:a,compilerOptions:o}=i;i.render=ba(t,s(s({isCustomElement:n,delimiters:a},r),o))}}e.render=i.render||r,xa&&xa(e)}{let t=pa(e);Ke();try{Sr(e)}finally{qe(),t()}}}var Ca={get(e,t){return rt(e,`get`,``),e[t]}};function wa(e){return{attrs:new Proxy(e.attrs,Ca),slots:e.slots,emit:e.emit,expose:t=>{e.exposed=t||{}}}}function Ta(e){return e.exposed?e.exposeProxy||=new Proxy(nn(qt(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in _r)return _r[n](e)},has(e,t){return t in e||t in _r}}):e.proxy}function Ea(e,t=!0){return m(e)?e.displayName||e.name:e.name||t&&e.__name}function Da(e){return m(e)&&`__vccOpts`in e}var Oa=(e,t)=>an(e,t,ga),ka=`3.5.25`,Aa=void 0,ja=typeof window<`u`&&window.trustedTypes;if(ja)try{Aa=ja.createPolicy(`vue`,{createHTML:e=>e})}catch{}var Ma=Aa?e=>Aa.createHTML(e):e=>e,Na=`http://www.w3.org/2000/svg`,Pa=`http://www.w3.org/1998/Math/MathML`,Fa=typeof document<`u`?document:null,Ia=Fa&&Fa.createElement(`template`),La={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let i=t===`svg`?Fa.createElementNS(Na,e):t===`mathml`?Fa.createElementNS(Pa,e):n?Fa.createElement(e,{is:n}):Fa.createElement(e);return e===`select`&&r&&r.multiple!=null&&i.setAttribute(`multiple`,r.multiple),i},createText:e=>Fa.createTextNode(e),createComment:e=>Fa.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Fa.querySelector(e),setScopeId(e,t){e.setAttribute(t,``)},insertStaticContent(e,t,n,r,i,a){let o=n?n.previousSibling:t.lastChild;if(i&&(i===a||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),n),!(i===a||!(i=i.nextSibling)););else{Ia.innerHTML=Ma(r===`svg`?`<svg>${e}</svg>`:r===`mathml`?`<math>${e}</math>`:e);let i=Ia.content;if(r===`svg`||r===`mathml`){let e=i.firstChild;for(;e.firstChild;)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},Ra=Symbol(`_vtc`);function za(e,t,n){let r=e[Ra];r&&(t=(t?[t,...r]:[...r]).join(` `)),t==null?e.removeAttribute(`class`):n?e.setAttribute(`class`,t):e.className=t}var Ba=Symbol(`_vod`),Va=Symbol(`_vsh`),Ha=Symbol(``),Ua=/(?:^|;)\s*display\s*:/;function Wa(e,t,n){let r=e.style,i=h(n),a=!1;if(n&&!i){if(t)if(h(t))for(let e of t.split(`;`)){let t=e.slice(0,e.indexOf(`:`)).trim();n[t]??Ka(r,t,``)}else for(let e in t)n[e]??Ka(r,e,``);for(let e in n)e===`display`&&(a=!0),Ka(r,e,n[e])}else if(i){if(t!==n){let e=r[Ha];e&&(n+=`;`+e),r.cssText=n,a=Ua.test(n)}}else t&&e.removeAttribute(`style`);Ba in e&&(e[Ba]=a?r.display:``,e[Va]&&(r.display=`none`))}var Ga=/\s*!important$/;function Ka(e,t,n){if(d(n))n.forEach(n=>Ka(e,t,n));else if(n??=``,t.startsWith(`--`))e.setProperty(t,n);else{let r=Ya(e,t);Ga.test(n)?e.setProperty(ce(r),n.replace(Ga,``),`important`):e[r]=n}}var qa=[`Webkit`,`Moz`,`ms`],Ja={};function Ya(e,t){let n=Ja[t];if(n)return n;let r=oe(t);if(r!==`filter`&&r in e)return Ja[t]=r;r=le(r);for(let n=0;n<qa.length;n++){let i=qa[n]+r;if(i in e)return Ja[t]=i}return t}var Xa=`http://www.w3.org/1999/xlink`;function Za(e,t,n,r,i,a=Se(t)){r&&t.startsWith(`xlink:`)?n==null?e.removeAttributeNS(Xa,t.slice(6,t.length)):e.setAttributeNS(Xa,t,n):n==null||a&&!Ce(n)?e.removeAttribute(t):e.setAttribute(t,a?``:g(n)?String(n):n)}function Qa(e,t,n,r,i){if(t===`innerHTML`||t===`textContent`){n!=null&&(e[t]=t===`innerHTML`?Ma(n):n);return}let a=e.tagName;if(t===`value`&&a!==`PROGRESS`&&!a.includes(`-`)){let r=a===`OPTION`?e.getAttribute(`value`)||``:e.value,i=n==null?e.type===`checkbox`?`on`:``:String(n);(r!==i||!(`_value`in e))&&(e.value=i),n??e.removeAttribute(t),e._value=n;return}let o=!1;if(n===``||n==null){let r=typeof e[t];r===`boolean`?n=Ce(n):n==null&&r===`string`?(n=``,o=!0):r===`number`&&(n=0,o=!0)}try{e[t]=n}catch{}o&&e.removeAttribute(i||t)}function $a(e,t,n,r){e.addEventListener(t,n,r)}function eo(e,t,n,r){e.removeEventListener(t,n,r)}var to=Symbol(`_vei`);function no(e,t,n,r,i=null){let a=e[to]||(e[to]={}),o=a[t];if(r&&o)o.value=r;else{let[n,s]=io(t);r?$a(e,n,a[t]=co(r,i),s):o&&(eo(e,n,o,s),a[t]=void 0)}}var ro=/(?:Once|Passive|Capture)$/;function io(e){let t;if(ro.test(e)){t={};let n;for(;n=e.match(ro);)e=e.slice(0,e.length-n[0].length),t[n[0].toLowerCase()]=!0}return[e[2]===`:`?e.slice(3):ce(e.slice(2)),t]}var ao=0,oo=Promise.resolve(),so=()=>ao||=(oo.then(()=>ao=0),Date.now());function co(e,t){let n=e=>{if(!e._vts)e._vts=Date.now();else if(e._vts<=n.attached)return;pn(lo(e,n.value),t,5,[e])};return n.value=e,n.attached=so(),n}function lo(e,t){if(d(t)){let n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map(e=>t=>!t._stopped&&e&&e(t))}else return t}var uo=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,fo=(e,t,n,r,i,s)=>{let c=i===`svg`;t===`class`?za(e,r,c):t===`style`?Wa(e,n,r):a(t)?o(t)||no(e,t,n,r,s):(t[0]===`.`?(t=t.slice(1),!0):t[0]===`^`?(t=t.slice(1),!1):po(e,t,r,c))?(Qa(e,t,r),!e.tagName.includes(`-`)&&(t===`value`||t===`checked`||t===`selected`)&&Za(e,t,r,c,s,t!==`value`)):e._isVueCE&&(/[A-Z]/.test(t)||!h(r))?Qa(e,oe(t),r,s,t):(t===`true-value`?e._trueValue=r:t===`false-value`&&(e._falseValue=r),Za(e,t,r,c))};function po(e,t,n,r){if(r)return!!(t===`innerHTML`||t===`textContent`||t in e&&uo(t)&&m(n));if(t===`spellcheck`||t===`draggable`||t===`translate`||t===`autocorrect`||t===`sandbox`&&e.tagName===`IFRAME`||t===`form`||t===`list`&&e.tagName===`INPUT`||t===`type`&&e.tagName===`TEXTAREA`)return!1;if(t===`width`||t===`height`){let t=e.tagName;if(t===`IMG`||t===`VIDEO`||t===`CANVAS`||t===`SOURCE`)return!1}return uo(t)&&h(n)?!1:t in e}var mo=e=>{let t=e.props[`onUpdate:modelValue`]||!1;return d(t)?e=>fe(t,e):t};function ho(e){e.target.composing=!0}function go(e){let t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event(`input`)))}var _o=Symbol(`_assign`);function vo(e,t,n){return t&&(e=e.trim()),n&&(e=x(e)),e}var yo={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e[_o]=mo(i);let a=r||i.props&&i.props.type===`number`;$a(e,t?`change`:`input`,t=>{t.target.composing||e[_o](vo(e.value,n,a))}),(n||a)&&$a(e,`change`,()=>{e.value=vo(e.value,n,a)}),t||($a(e,`compositionstart`,ho),$a(e,`compositionend`,go),$a(e,`change`,go))},mounted(e,{value:t}){e.value=t??``},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:r,trim:i,number:a}},o){if(e[_o]=mo(o),e.composing)return;let s=(a||e.type===`number`)&&!/^0\d/.test(e.value)?x(e.value):e.value,c=t??``;s!==c&&(document.activeElement===e&&e.type!==`range`&&(r&&t===n||i&&e.value.trim()===c)||(e.value=c))}},bo=[`ctrl`,`shift`,`alt`,`meta`],xo={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>`button`in e&&e.button!==0,middle:e=>`button`in e&&e.button!==1,right:e=>`button`in e&&e.button!==2,exact:(e,t)=>bo.some(n=>e[`${n}Key`]&&!t.includes(n))},So=(e,t)=>{let n=e._withMods||={},r=t.join(`.`);return n[r]||(n[r]=((n,...r)=>{for(let e=0;e<t.length;e++){let r=xo[t[e]];if(r&&r(n,t))return}return e(n,...r)}))},Co=s({patchProp:fo},La),wo;function To(){return wo||=wi(Co)}var Eo=((...e)=>{let t=To().createApp(...e),{mount:n}=t;return t.mount=e=>{let r=Oo(e);if(!r)return;let i=t._component;!m(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent=``);let a=n(r,!1,Do(r));return r instanceof Element&&(r.removeAttribute(`v-cloak`),r.setAttribute(`data-v-app`,``)),a},t});function Do(e){if(e instanceof SVGElement)return`svg`;if(typeof MathMLElement==`function`&&e instanceof MathMLElement)return`mathml`}function Oo(e){return h(e)?document.querySelector(e):e}var ko=(e,t)=>{let n=e.__vccOpts||e;for(let[e,r]of t)n[e]=r;return n},Ao=[`title`],jo={class:`session-header`},Mo={class:`session-icon`},No={class:`session-title-wrapper`},Po={class:`session-title`},Fo={class:`session-footer`},Io={key:0,class:`session-changes`},Lo={class:`changes-added`},Ro={class:`changes-removed`},zo={key:1,class:`session-status`},Bo={class:`session-metadata`},Vo={class:`session-location`},Ho={class:`session-time`},Uo=ko({__name:`SessionItem`,props:{session:{type:Object,required:!0},archived:{type:Boolean,default:!1}},emits:[`archive`],setup(e,{emit:t}){let n=e,r=t,i=Zt(!1),a=e=>{e.stopPropagation(),r(`archive`)},o=Oa(()=>{if(n.session.icon)return n.session.icon;switch(n.session.status){case`Complete`:return`check`;case`Running`:return`loading~spin`;case`Failed`:return`error`;default:return`circle-outline`}}),s=Oa(()=>n.session.status.toLowerCase());return Oa(()=>{switch(n.session.location){case`Local`:return`device-desktop`;case`Cloud`:return`cloud`;case`Background`:return`server-process`;default:return`circle-outline`}}),(t,n)=>(E(),D(`div`,{class:`session-item`,onMouseenter:n[0]||=e=>i.value=!0,onMouseleave:n[1]||=e=>i.value=!1},[i.value?(E(),D(`button`,{key:0,class:`archive-button`,onClick:a,title:e.archived?`Unarchive`:`Archive`},[O(`i`,{class:S(e.archived?`codicon codicon-inbox`:`codicon codicon-archive`)},null,2)],8,Ao)):ea(``,!0),O(`div`,jo,[O(`div`,Mo,[O(`i`,{class:S(`codicon codicon-${o.value} ${s.value}`)},null,2)]),O(`div`,No,[O(`div`,Po,C(e.session.title),1),O(`div`,Fo,[e.session.changes?(E(),D(`div`,Io,[O(`span`,Lo,`+`+C(e.session.changes.added),1),O(`span`,Ro,`-`+C(e.session.changes.removed),1)])):(E(),D(`div`,zo,C(e.session.status),1)),O(`div`,Bo,[O(`span`,Vo,C(e.session.location),1),n[2]||=O(`span`,{class:`separator`},`•`,-1),O(`span`,Ho,C(e.session.time),1)])])])])],32))}},[[`__scopeId`,`data-v-ae6dd562`]]),Wo={class:`sessions-container`},Go={class:`list-section`},Ko={class:`session-list`},qo=[`onDragstart`,`onDragover`,`onClick`],Jo={key:0,class:`list-section`},Yo={key:0,class:`session-list`},Xo=[`onDragstart`,`onDragover`,`onClick`],Zo=ko({__name:`SessionList`,setup(e){let t=Zt([{id:1,title:`Commenting code for clarity and readability`,status:`Complete`,icon:`check`,location:`Background`,time:`1 hr`},{id:2,title:`Replacing placeholder text for inline chat`,status:`Complete`,icon:`issue-closed`,location:`Cloud`,time:`30 min`,changes:{added:150,removed:10}},{id:3,title:`Refining preview layout and icons`,status:`Complete`,icon:`git-pull-request-closed`,location:`Local`,time:`1 min`},{id:4,title:`Implementing authentication middleware`,status:`Running`,icon:`git-pull-request`,location:`Cloud`,time:`2 min`,changes:{added:45,removed:5}},{id:5,title:`Optimizing database queries`,status:`Failed`,icon:`error`,location:`Local`,time:`5 min`},{id:6,title:`Adding unit tests for API endpoints`,status:`Complete`,icon:`check`,location:`Cloud`,time:`15 min`,changes:{added:230,removed:12}},{id:7,title:`Refactoring component structure`,status:`Complete`,icon:`issue-closed`,location:`Local`,time:`45 min`,changes:{added:78,removed:134}}]),n=Zt([]),r=Zt(!0),i=Zt(null),a=Zt(null),o=Zt(null),s=Zt(null),c=e=>{console.log(`Session clicked:`,e)},l=()=>{r.value=!r.value},u=(e,r)=>{if(r===`active`){let r=t.value.findIndex(t=>t.id===e);if(r!==-1){let[e]=t.value.splice(r,1);n.value.push(e)}}else{let r=n.value.findIndex(t=>t.id===e);if(r!==-1){let[e]=n.value.splice(r,1);t.value.push(e)}}},d=(e,t)=>{i.value=e,s.value=t},f=(e,t,n)=>{e.preventDefault(),e.stopPropagation(),(a.value!==t||o.value!==n)&&(a.value=t,o.value=n)},p=()=>{if(i.value!==null&&a.value!==null&&s.value&&o.value){if(s.value===o.value&&i.value!==a.value){let e=s.value===`active`?[...t.value]:[...n.value],[r]=e.splice(i.value,1);e.splice(a.value,0,r),s.value===`active`?t.value=e:n.value=e}else if(s.value!==o.value){let e=s.value===`active`?t.value:n.value,r=o.value===`active`?t.value:n.value,[c]=e.splice(i.value,1);r.splice(a.value,0,c)}}i.value=null,a.value=null,o.value=null,s.value=null},m=e=>{e.currentTarget.contains(e.relatedTarget)||(a.value=null,o.value=null)};return(e,i)=>(E(),D(`div`,Wo,[O(`div`,Go,[O(`div`,Ko,[(E(!0),D(Fi,null,hr(t.value,(e,t)=>(E(),D(`div`,{key:e.id,class:S({"drag-over":a.value===t&&o.value===`active`}),draggable:`true`,onDragstart:e=>d(t,`active`),onDragover:e=>f(e,t,`active`),onDragleave:m,onDragend:p,onClick:t=>c(e)},[k(Uo,{session:e,onArchive:t=>u(e.id,`active`)},null,8,[`session`,`onArchive`])],42,qo))),128))])]),n.value.length>0?(E(),D(`div`,Jo,[O(`div`,{class:`list-header collapsible`,onClick:l},[O(`i`,{class:S(`codicon codicon-chevron-${r.value?`down`:`right`}`)},null,2),i[0]||=$i(` Archived `,-1)]),r.value?(E(),D(`div`,Yo,[(E(!0),D(Fi,null,hr(n.value,(e,t)=>(E(),D(`div`,{key:e.id,class:S({"drag-over":a.value===t&&o.value===`archived`}),draggable:`true`,onDragstart:e=>d(t,`archived`),onDragover:e=>f(e,t,`archived`),onDragleave:m,onDragend:p,onClick:t=>c(e)},[k(Uo,{session:e,archived:!0,onArchive:t=>u(e.id,`archived`)},null,8,[`session`,`onArchive`])],42,Xo))),128))])):ea(``,!0)])):ea(``,!0)]))}},[[`__scopeId`,`data-v-a77bebc8`]]),Qo={class:`custom-dropdown`},$o={key:0,class:`dropdown-menu`},es=[`onClick`],ts={key:0,class:`codicon codicon-check`},ns={key:1,class:`item-spacer`},rs={class:`item-label`},is={key:2,class:`item-metadata`},as=ko({__name:`CustomDropdown`,props:{modelValue:String,options:Array},emits:[`update:modelValue`],setup(e,{emit:t}){let n=e,r=t,i=Zt(!1),a=Oa(()=>n.options.find(e=>e.value===n.modelValue)),o=e=>{r(`update:modelValue`,e.value),i.value=!1},s=()=>{i.value=!i.value};return typeof window<`u`&&document.addEventListener(`click`,e=>{e.target.closest(`.custom-dropdown`)||(i.value=!1)}),(t,n)=>(E(),D(`div`,Qo,[O(`button`,{class:S([`dropdown-trigger`,{open:i.value}]),onClick:So(s,[`stop`])},[O(`span`,null,C(a.value?.label),1),n[0]||=O(`i`,{class:`codicon codicon-chevron-down`},null,-1)],2),i.value?(E(),D(`div`,$o,[(E(!0),D(Fi,null,hr(e.options,t=>(E(),D(`div`,{key:t.value,class:S([`dropdown-item`,{selected:t.value===e.modelValue}]),onClick:e=>o(t)},[t.value===e.modelValue?(E(),D(`i`,ts)):(E(),D(`span`,ns)),O(`span`,rs,C(t.label),1),t.costMultiplier!==void 0&&t.contextLimit!==void 0?(E(),D(`span`,is,C(t.costMultiplier)+`x • `+C(t.contextLimit)+`k `,1)):ea(``,!0)],10,es))),128))])):ea(``,!0)]))}},[[`__scopeId`,`data-v-69b61aa4`]]),os={class:`attachment-row`},ss={class:`attachments-section`},cs={key:0,class:`attachment-text`},ls={class:`file-name`},us=[`onClick`],ds={class:`context-info-wrapper`},fs={class:`context-info`},ps={key:0,class:`pending-context`},ms={class:`input-row`},hs=[`placeholder`],gs={class:`footer-row`},_s={class:`dropdowns`},vs={class:`action-buttons`},ys=[`disabled`],bs=[`disabled`],xs=ko({__name:`ChatInputBox`,props:{modelValue:{type:String,default:``},chatMode:{type:String,default:`ask`},selectedModel:{type:String,default:`claude`},attachedFiles:{type:Array,default:()=>[]},pendingContext:{type:Number,default:0},placeholder:{type:String,default:`Describe what to build next`}},emits:[`update:modelValue`,`update:chatMode`,`update:selectedModel`,`send`,`attach`,`removeFile`],setup(e,{emit:t}){let n=e,r=t,i=Zt(null),a=Zt(!1),o=Oa({get:()=>n.modelValue,set:e=>r(`update:modelValue`,e)}),s=Oa({get:()=>n.chatMode,set:e=>r(`update:chatMode`,e)}),c=Oa({get:()=>n.selectedModel,set:e=>r(`update:selectedModel`,e)}),l=Oa(()=>o.value.trim()===``),u=[{value:`ask`,label:`Ask`},{value:`agent`,label:`Agent`},{value:`plan`,label:`Plan`},{value:`edit`,label:`Edit`}],d=[{value:`gpt`,label:`GPT-4`,contextLimit:32,costMultiplier:1.5},{value:`claude`,label:`Claude Sonnet 4.5`,contextLimit:64,costMultiplier:1},{value:`gemini`,label:`Gemini`,contextLimit:128,costMultiplier:.3},{value:`llama`,label:`Llama`,contextLimit:256,costMultiplier:.1}],f=()=>{i.value&&(i.value.style.height=`auto`,i.value.style.height=i.value.scrollHeight+`px`)},p=()=>{l.value||r(`send`)},m=e=>{e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),p())},h=()=>{r(`attach`)},g=e=>{r(`removeFile`,e)};return(t,n)=>(E(),D(`div`,{class:S([`chat-input-wrapper`,{focused:a.value}])},[O(`div`,os,[O(`div`,ss,[O(`button`,{class:`attachment-button`,onClick:h,title:`Attach files`},[n[5]||=O(`i`,{class:`codicon codicon-attach`},null,-1),e.attachedFiles.length===0?(E(),D(`span`,cs,`Add Context...`)):ea(``,!0)]),(E(!0),D(Fi,null,hr(e.attachedFiles,(e,t)=>(E(),D(`div`,{key:t,class:`file-chip`},[n[7]||=O(`i`,{class:`codicon codicon-file`},null,-1),O(`span`,ls,C(e.name),1),O(`button`,{class:`remove-file`,onClick:e=>g(t),title:`Remove`},[...n[6]||=[O(`i`,{class:`codicon codicon-close`},null,-1)]],8,us)]))),128))]),O(`div`,ds,[O(`div`,fs,[e.pendingContext>0?(E(),D(`span`,ps,`+`+C(e.pendingContext.toFixed(1))+`k`,1)):ea(``,!0)])])]),O(`div`,ms,[In(O(`textarea`,{ref_key:`textarea`,ref:i,"onUpdate:modelValue":n[0]||=e=>o.value=e,onInput:f,onKeydown:m,onFocus:n[1]||=e=>a.value=!0,onBlur:n[2]||=e=>a.value=!1,placeholder:e.placeholder,rows:`1`,class:`chat-textarea`},null,40,hs),[[yo,o.value]])]),O(`div`,gs,[O(`div`,_s,[k(as,{modelValue:s.value,"onUpdate:modelValue":n[3]||=e=>s.value=e,options:u},null,8,[`modelValue`]),k(as,{modelValue:c.value,"onUpdate:modelValue":n[4]||=e=>c.value=e,options:d},null,8,[`modelValue`])]),O(`div`,vs,[O(`button`,{class:S([`forward-button`,{disabled:l.value}]),disabled:l.value,title:`Forward`},[...n[8]||=[O(`i`,{class:`codicon codicon-forward`},null,-1)]],10,ys),O(`button`,{class:S([`send-button`,{disabled:l.value}]),onClick:p,disabled:l.value,title:`Send`},[...n[9]||=[O(`i`,{class:`codicon codicon-send`},null,-1)]],10,bs)])])],2))}},[[`__scopeId`,`data-v-582c1ce7`]]),Ss={class:`app-container`},Cs={class:`panel-header`},ws={class:`header-actions`},Ts={class:`session-list-container`},Es={class:`chat-container`},Ds=ko({__name:`App`,setup(e){let t=Zt(``),n=Zt(`agent`),r=Zt(`claude`),i=Zt([]),a=Zt(0),o=()=>{console.log(`Message sent:`,t.value),console.log(`Mode:`,n.value),console.log(`Model:`,r.value),console.log(`Files:`,i.value),t.value=``,i.value=[],a.value=0},s=()=>{let e=[{name:`App.vue`,tokens:2.5},{name:`main.js`,tokens:1.2},{name:`SessionList.vue`,tokens:3.1}],t=e[Math.floor(Math.random()*e.length)];i.value.push(t),a.value+=t.tokens},c=e=>{let t=i.value[e];a.value-=t.tokens,i.value.splice(e,1)};return(e,l)=>{let u=dr(`vscode-icon`);return E(),D(`div`,Ss,[O(`div`,Cs,[l[3]||=O(`div`,{class:`header-content`},[O(`h2`,null,`AGENT SESSIONS`)],-1),O(`div`,ws,[k(u,{name:`refresh`,class:`action-icon`}),k(u,{name:`settings-gear`,class:`action-icon`})])]),O(`div`,Ts,[k(Zo)]),O(`div`,Es,[k(xs,{modelValue:t.value,"onUpdate:modelValue":l[0]||=e=>t.value=e,"chat-mode":n.value,"onUpdate:chatMode":l[1]||=e=>n.value=e,"selected-model":r.value,"onUpdate:selectedModel":l[2]||=e=>r.value=e,"attached-files":i.value,"pending-context":a.value,placeholder:`Ask a question or describe what to build...`,onSend:o,onAttach:s,onRemoveFile:c},null,8,[`modelValue`,`chat-mode`,`selected-model`,`attached-files`,`pending-context`])])])}}},[[`__scopeId`,`data-v-00554e6c`]]),Os=globalThis,ks=Os.ShadowRoot&&(Os.ShadyCSS===void 0||Os.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,As=Symbol(),js=new WeakMap,Ms=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==As)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(ks&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=js.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&js.set(t,e))}return e}toString(){return this.cssText}},Ns=e=>new Ms(typeof e==`string`?e:e+``,void 0,As),A=(e,...t)=>new Ms(e.length===1?e[0]:t.reduce(((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1]),e[0]),e,As),Ps=(e,t)=>{if(ks)e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(let n of t){let t=document.createElement(`style`),r=Os.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},Fs=ks?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return Ns(t)})(e):e,{is:Is,defineProperty:Ls,getOwnPropertyDescriptor:Rs,getOwnPropertyNames:zs,getOwnPropertySymbols:Bs,getPrototypeOf:Vs}=Object,Hs=globalThis,Us=Hs.trustedTypes,Ws=Us?Us.emptyScript:``,Gs=Hs.reactiveElementPolyfillSupport,Ks=(e,t)=>e,qs={toAttribute(e,t){switch(t){case Boolean:e=e?Ws:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Js=(e,t)=>!Is(e,t),Ys={attribute:!0,type:String,converter:qs,reflect:!1,useDefault:!1,hasChanged:Js};Symbol.metadata??=Symbol(`metadata`),Hs.litPropertyMetadata??=new WeakMap;var Xs=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ys){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&Ls(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=Rs(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ys}static _$Ei(){if(this.hasOwnProperty(Ks(`elementProperties`)))return;let e=Vs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Ks(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ks(`properties`))){let e=this.properties,t=[...zs(e),...Bs(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(Fs(e))}else e!==void 0&&t.push(Fs(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ps(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?qs:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?qs:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n){if(e!==void 0){let r=this.constructor,i=this[e];if(n??=r.getPropertyOptions(e),!((n.hasChanged??Js)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};Xs.elementStyles=[],Xs.shadowRootOptions={mode:`open`},Xs[Ks(`elementProperties`)]=new Map,Xs[Ks(`finalized`)]=new Map,Gs?.({ReactiveElement:Xs}),(Hs.reactiveElementVersions??=[]).push(`2.1.1`);var Zs=globalThis,Qs=Zs.trustedTypes,$s=Qs?Qs.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,ec=`$lit$`,tc=`lit$${Math.random().toFixed(9).slice(2)}$`,nc=`?`+tc,rc=`<${nc}>`,ic=document,ac=()=>ic.createComment(``),oc=e=>e===null||typeof e!=`object`&&typeof e!=`function`,sc=Array.isArray,cc=e=>sc(e)||typeof e?.[Symbol.iterator]==`function`,lc=`[ 	
\f\r]`,uc=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,dc=/-->/g,fc=/>/g,pc=RegExp(`>|${lc}(?:([^\\s"'>=/]+)(${lc}*=${lc}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),mc=/'/g,hc=/"/g,gc=/^(?:script|style|textarea|title)$/i,_c=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),j=_c(1),vc=_c(2),yc=Symbol.for(`lit-noChange`),M=Symbol.for(`lit-nothing`),bc=new WeakMap,xc=ic.createTreeWalker(ic,129);function Sc(e,t){if(!sc(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return $s===void 0?t:$s.createHTML(t)}var Cc=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=uc;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===uc?c[1]===`!--`?o=dc:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=pc):(gc.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=pc):o=fc:o===pc?c[0]===`>`?(o=i??uc,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?pc:c[3]===`"`?hc:mc):o===hc||o===mc?o=pc:o===dc||o===fc?o=uc:(o=pc,i=void 0);let d=o===pc&&e[t+1].startsWith(`/>`)?` `:``;a+=o===uc?n+rc:l>=0?(r.push(s),n.slice(0,l)+ec+n.slice(l)+tc+d):n+tc+(l===-2?t:d)}return[Sc(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},wc=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Cc(t,n);if(this.el=e.createElement(l,r),xc.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=xc.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(ec)){let t=u[o++],n=i.getAttribute(e).split(tc),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?kc:r[1]===`?`?Ac:r[1]===`@`?jc:Oc}),i.removeAttribute(e)}else e.startsWith(tc)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(gc.test(i.tagName)){let e=i.textContent.split(tc),t=e.length-1;if(t>0){i.textContent=Qs?Qs.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],ac()),xc.nextNode(),c.push({type:2,index:++a});i.append(e[t],ac())}}}else if(i.nodeType===8)if(i.data===nc)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(tc,e+1))!==-1;)c.push({type:7,index:a}),e+=tc.length-1}a++}}static createElement(e,t){let n=ic.createElement(`template`);return n.innerHTML=e,n}};function Tc(e,t,n=e,r){if(t===yc)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=oc(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=Tc(e,i._$AS(e,t.values),i,r)),t}var Ec=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??ic).importNode(t,!0);xc.currentNode=r;let i=xc.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new Dc(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Mc(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=xc.nextNode(),a++)}return xc.currentNode=ic,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},Dc=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Tc(this,e,t),oc(e)?e===M||e==null||e===``?(this._$AH!==M&&this._$AR(),this._$AH=M):e!==this._$AH&&e!==yc&&this._(e):e._$litType$===void 0?e.nodeType===void 0?cc(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==M&&oc(this._$AH)?this._$AA.nextSibling.data=e:this.T(ic.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=wc.createElement(Sc(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Ec(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=bc.get(e.strings);return t===void 0&&bc.set(e.strings,t=new wc(e)),t}k(t){sc(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(ac()),this.O(ac()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=e.nextSibling;e.remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Oc=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=M,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=M}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=Tc(this,e,t,0),a=!oc(e)||e!==this._$AH&&e!==yc,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=Tc(this,r[n+o],t,o),s===yc&&(s=this._$AH[o]),a||=!oc(s)||s!==this._$AH[o],s===M?e=M:e!==M&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},kc=class extends Oc{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===M?void 0:e}},Ac=class extends Oc{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==M)}},jc=class extends Oc{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=Tc(this,e,t,0)??M)===yc)return;let n=this._$AH,r=e===M&&n!==M||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==M&&(n===M||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Mc=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){Tc(this,e)}},Nc={M:ec,P:tc,A:nc,C:1,L:Cc,R:Ec,D:cc,V:Tc,I:Dc,H:Oc,N:Ac,U:jc,B:kc,F:Mc},Pc=Zs.litHtmlPolyfillSupport;Pc?.(wc,Dc),(Zs.litHtmlVersions??=[]).push(`3.3.1`);var Fc=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new Dc(t.insertBefore(ac(),e),e,void 0,n??{})}return i._$AI(e),i},Ic=globalThis,Lc=class extends Xs{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Fc(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return yc}};Lc._$litElement$=!0,Lc.finalized=!0,Ic.litElementHydrateSupport?.({LitElement:Lc});var Rc=Ic.litElementPolyfillSupport;Rc?.({LitElement:Lc}),(Ic.litElementVersions??=[]).push(`4.2.1`);var zc={attribute:!0,type:String,converter:qs,reflect:!1,hasChanged:Js},Bc=(e=zc,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e)}}throw Error(`Unsupported decorator location: `+r)};function N(e){return(t,n)=>typeof n==`object`?Bc(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function P(e){return N({...e,state:!0,attribute:!1})}var Vc=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function F(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return Vc(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return Vc(n,r,{get(){return a(this)}})}}var Hc;function Uc(e){return(t,n)=>Vc(t,n,{get(){return(this.renderRoot??(Hc??=document.createDocumentFragment())).querySelectorAll(e)}})}function Wc(e){return(t,n)=>{let{slot:r,selector:i}=e??{},a=`slot`+(r?`[name=${r}]`:`:not([name])`);return Vc(t,n,{get(){let t=(this.renderRoot?.querySelector(a))?.assignedElements(e)??[];return i===void 0?t:t.filter((e=>e.matches(i)))}})}}function Gc(e){return(t,n)=>{let{slot:r}=e??{},i=`slot`+(r?`[name=${r}]`:`:not([name])`);return Vc(t,n,{get(){return(this.renderRoot?.querySelector(i))?.assignedNodes(e)??[]}})}}var Kc=`2.3.1`,qc=`__vscodeElements_disableRegistryWarning__`,I=class extends Lc{get version(){return Kc}};const L=e=>t=>{if(!customElements.get(e)){customElements.define(e,t);return}if(qc in window)return;let n=document.createElement(e)?.version,r=``;n?n===Kc?r+=`is already registered by the same version of VSCode Elements (${Kc}).`:(r+=`is already registered by a different version of VSCode Elements. `,r+=`This version is "${Kc}", while the other one is "${n}".`):r+=`is already registered by an unknown custom element handler class.`,console.warn(`[VSCode Elements] ${e} ${r}\nTo suppress this warning, set window.${qc} to true`)};var R=A`
  :host([hidden]) {
    display: none;
  }

  :host([disabled]),
  :host(:disabled) {
    cursor: not-allowed;
    opacity: 0.4;
    pointer-events: none;
  }
`;function Jc(){return navigator.userAgent.indexOf(`Linux`)>-1?`system-ui, "Ubuntu", "Droid Sans", sans-serif`:navigator.userAgent.indexOf(`Mac`)>-1?`-apple-system, BlinkMacSystemFont, sans-serif`:navigator.userAgent.indexOf(`Windows`)>-1?`"Segoe WPC", "Segoe UI", sans-serif`:`sans-serif`}var Yc=[R,A`
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
      font-family: var(--vscode-font-family, ${Ns(Jc())});
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
  `],Xc=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Zc=class extends I{constructor(){super(...arguments),this.variant=`default`}render(){return j`<div class="root"><slot></slot></div>`}};Zc.styles=Yc,Xc([N({reflect:!0})],Zc.prototype,`variant`,void 0),Zc=Xc([L(`vscode-badge`)],Zc);var Qc={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},$c=e=>(...t)=>({_$litDirective$:e,values:t}),el=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},z=$c(class extends el{constructor(e){if(super(e),e.type!==Qc.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter((t=>e[t])).join(` `)+` `}update(e,[t]){if(this.st===void 0){for(let n in this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter((e=>e!==``)))),t)t[n]&&!this.nt?.has(n)&&this.st.add(n);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return yc}}),B=e=>e??M;const tl=$c(class extends el{constructor(e){if(super(e),this._prevProperties={},e.type!==Qc.PROPERTY||e.name!==`style`)throw Error("The `stylePropertyMap` directive must be used in the `style` property")}update(e,[t]){return Object.entries(t).forEach(([t,n])=>{this._prevProperties[t]!==n&&(t.startsWith(`--`)?e.element.style.setProperty(t,n):e.element.style[t]=n,this._prevProperties[t]=n)}),yc}render(e){return yc}});var nl=[R,A`
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
  `],rl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},il,al=il=class extends I{constructor(){super(...arguments),this.label=``,this.name=``,this.size=16,this.spin=!1,this.spinDuration=1.5,this.actionIcon=!1,this._onButtonClick=e=>{this.dispatchEvent(new CustomEvent(`vsc-click`,{detail:{originalEvent:e}}))}}connectedCallback(){super.connectedCallback();let{href:e,nonce:t}=this._getStylesheetConfig();il.stylesheetHref=e,il.nonce=t}_getStylesheetConfig(){let e=document.getElementById(`vscode-codicon-stylesheet`),t=e?.getAttribute(`href`)||void 0,n=e?.nonce||void 0;if(!e){let e="[VSCode Elements] To use the Icon component, the codicons.css file must be included in the page with the id `vscode-codicon-stylesheet`! ";e+=`See https://vscode-elements.github.io/components/icon/ for more details.`,console.warn(e)}return{nonce:n,href:t}}render(){let{stylesheetHref:e,nonce:t}=il,n=j`<span
      class=${z({codicon:!0,[`codicon-`+this.name]:!0,spin:this.spin})}
      .style=${tl({animationDuration:String(this.spinDuration)+`s`,fontSize:this.size+`px`,height:this.size+`px`,width:this.size+`px`})}
    ></span>`,r=this.actionIcon?j` <button
          class="button"
          @click=${this._onButtonClick}
          aria-label=${this.label}
        >
          ${n}
        </button>`:j` <span class="icon" aria-hidden="true" role="presentation"
          >${n}</span
        >`;return j`
      <link
        rel="stylesheet"
        href=${B(e)}
        nonce=${B(t)}
      >
      ${r}
    `}};al.styles=nl,al.stylesheetHref=``,al.nonce=``,rl([N()],al.prototype,`label`,void 0),rl([N({type:String})],al.prototype,`name`,void 0),rl([N({type:Number})],al.prototype,`size`,void 0),rl([N({type:Boolean,reflect:!0})],al.prototype,`spin`,void 0),rl([N({type:Number,attribute:`spin-duration`})],al.prototype,`spinDuration`,void 0),rl([N({type:Boolean,reflect:!0,attribute:`action-icon`})],al.prototype,`actionIcon`,void 0),al=il=rl([L(`vscode-icon`)],al);var ol=[R,A`
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
      font-family: var(--vscode-font-family, ${Ns(Jc())});
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
  `],V=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},H=class extends I{get form(){return this._internals.form}constructor(){super(),this.autofocus=!1,this.tabIndex=0,this.secondary=!1,this.role=`button`,this.disabled=!1,this.icon=``,this.iconSpin=!1,this.iconAfter=``,this.iconAfterSpin=!1,this.focused=!1,this.name=void 0,this.iconOnly=!1,this.type=`button`,this.value=``,this._prevTabindex=0,this._hasContentBefore=!1,this._hasContentAfter=!1,this._handleFocus=()=>{this.focused=!0},this._handleBlur=()=>{this.focused=!1},this.addEventListener(`keydown`,this._handleKeyDown.bind(this)),this.addEventListener(`click`,this._handleClick.bind(this)),this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.autofocus&&(this.tabIndex<0&&(this.tabIndex=0),this.updateComplete.then(()=>{this.focus(),this.requestUpdate()})),this.addEventListener(`focus`,this._handleFocus),this.addEventListener(`blur`,this._handleBlur)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(`focus`,this._handleFocus),this.removeEventListener(`blur`,this._handleBlur)}update(e){super.update(e),e.has(`value`)&&this._internals.setFormValue(this.value),e.has(`disabled`)&&(this.disabled?(this._prevTabindex=this.tabIndex,this.tabIndex=-1):this.tabIndex=this._prevTabindex)}_executeAction(){this.type===`submit`&&this._internals.form&&this._internals.form.requestSubmit(),this.type===`reset`&&this._internals.form&&this._internals.form.reset()}_handleKeyDown(e){if((e.key===`Enter`||e.key===` `)&&!this.hasAttribute(`disabled`)){let e=new MouseEvent(`click`,{bubbles:!0,cancelable:!0});e.synthetic=!0,this.dispatchEvent(e),this._executeAction()}}_handleClick(e){e.synthetic||this.hasAttribute(`disabled`)||this._executeAction()}_handleSlotChange(e){let t=e.target;t.name===`content-before`&&(this._hasContentBefore=t.assignedElements().length>0),t.name===`content-after`&&(this._hasContentAfter=t.assignedElements().length>0)}render(){let e=this.icon!==``,t=this.iconAfter!==``,n={base:!0,"icon-only":this.iconOnly,"has-content-before":this._hasContentBefore,"has-content-after":this._hasContentAfter},r=e?j`<vscode-icon
          name=${this.icon}
          ?spin=${this.iconSpin}
          spin-duration=${B(this.iconSpinDuration)}
          class="icon"
        ></vscode-icon>`:M,i=t?j`<vscode-icon
          name=${this.iconAfter}
          ?spin=${this.iconAfterSpin}
          spin-duration=${B(this.iconAfterSpinDuration)}
          class="icon-after"
        ></vscode-icon>`:M;return j`
      <div
        class=${z(n)}
        part="base"
        @slotchange=${this._handleSlotChange}
      >
        <slot name="content-before"></slot>
        ${r}
        <slot></slot>
        ${i}
        <slot name="content-after"></slot>
      </div>
    `}};H.styles=ol,H.formAssociated=!0,V([N({type:Boolean,reflect:!0})],H.prototype,`autofocus`,void 0),V([N({type:Number,reflect:!0})],H.prototype,`tabIndex`,void 0),V([N({type:Boolean,reflect:!0})],H.prototype,`secondary`,void 0),V([N({reflect:!0})],H.prototype,`role`,void 0),V([N({type:Boolean,reflect:!0})],H.prototype,`disabled`,void 0),V([N()],H.prototype,`icon`,void 0),V([N({type:Boolean,reflect:!0,attribute:`icon-spin`})],H.prototype,`iconSpin`,void 0),V([N({type:Number,reflect:!0,attribute:`icon-spin-duration`})],H.prototype,`iconSpinDuration`,void 0),V([N({attribute:`icon-after`})],H.prototype,`iconAfter`,void 0),V([N({type:Boolean,reflect:!0,attribute:`icon-after-spin`})],H.prototype,`iconAfterSpin`,void 0),V([N({type:Number,reflect:!0,attribute:`icon-after-spin-duration`})],H.prototype,`iconAfterSpinDuration`,void 0),V([N({type:Boolean,reflect:!0})],H.prototype,`focused`,void 0),V([N({type:String,reflect:!0})],H.prototype,`name`,void 0),V([N({type:Boolean,reflect:!0,attribute:`icon-only`})],H.prototype,`iconOnly`,void 0),V([N({reflect:!0})],H.prototype,`type`,void 0),V([N()],H.prototype,`value`,void 0),V([P()],H.prototype,`_hasContentBefore`,void 0),V([P()],H.prototype,`_hasContentAfter`,void 0),H=V([L(`vscode-button`)],H);var sl=[R,A`
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
  `],cl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ll=class extends I{render(){return j`<div class="root"><slot></slot></div>`}};ll.styles=sl,ll=cl([L(`vscode-button-group`)],ll);var ul=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},dl=class extends I{constructor(){super(),this.focused=!1,this._prevTabindex=0,this._handleFocus=()=>{this.focused=!0},this._handleBlur=()=>{this.focused=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener(`focus`,this._handleFocus),this.addEventListener(`blur`,this._handleBlur)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(`focus`,this._handleFocus),this.removeEventListener(`blur`,this._handleBlur)}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===`disabled`&&this.hasAttribute(`disabled`)?(this._prevTabindex=this.tabIndex,this.tabIndex=-1):e===`disabled`&&!this.hasAttribute(`disabled`)&&(this.tabIndex=this._prevTabindex)}};ul([N({type:Boolean,reflect:!0})],dl.prototype,`focused`,void 0);var fl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a};const pl=e=>{class t extends e{constructor(){super(...arguments),this._label=``,this._slottedText=``}set label(e){this._label=e,this._slottedText===``&&this.setAttribute(`aria-label`,e)}get label(){return this._label}_handleSlotChange(){this._slottedText=this.textContent?this.textContent.trim():``,this._slottedText!==``&&this.setAttribute(`aria-label`,this._slottedText)}_renderLabelAttribute(){return this._slottedText===``?j`<span class="label-attr">${this._label}</span>`:j`${M}`}}return fl([N()],t.prototype,`label`,null),t};var ml=[A`
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
  `],hl=[R,ml,A`
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
  `],gl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},_l=class extends pl(dl){set checked(e){this._checked=e,this._manageRequired(),this.requestUpdate()}get checked(){return this._checked}set required(e){this._required=e,this._manageRequired(),this.requestUpdate()}get required(){return this._required}get form(){return this._internals.form}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}constructor(){super(),this.autofocus=!1,this._checked=!1,this.defaultChecked=!1,this.invalid=!1,this.name=void 0,this.toggle=!1,this.value=``,this.disabled=!1,this.indeterminate=!1,this._required=!1,this.type=`checkbox`,this._handleClick=e=>{e.preventDefault(),!this.disabled&&this._toggleState()},this._handleKeyDown=e=>{!this.disabled&&(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),e.key===` `&&this._toggleState(),e.key===`Enter`&&this._internals.form?.requestSubmit())},this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.addEventListener(`keydown`,this._handleKeyDown),this.updateComplete.then(()=>{this._manageRequired(),this._setActualFormValue()})}disconnectedCallback(){this.removeEventListener(`keydown`,this._handleKeyDown)}formResetCallback(){this.checked=this.defaultChecked}formStateRestoreCallback(e,t){e&&(this.checked=!0)}_setActualFormValue(){let e=``;e=this.checked?this.value?this.value:`on`:null,this._internals.setFormValue(e)}_toggleState(){this.checked=!this.checked,this.indeterminate=!1,this._setActualFormValue(),this._manageRequired(),this.dispatchEvent(new Event(`change`,{bubbles:!0}))}_manageRequired(){!this.checked&&this.required?this._internals.setValidity({valueMissing:!0},`Please check this box if you want to proceed.`,this._inputEl??void 0):this._internals.setValidity({})}render(){let e=z({icon:!0,checked:this.checked,indeterminate:this.indeterminate}),t=z({"label-inner":!0}),n=j`<svg
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
    </svg>`,r=this.checked&&!this.indeterminate?n:M,i=this.indeterminate?j`<span class="indeterminate-icon"></span>`:M,a=this.toggle?j`<span class="thumb"></span>`:j`${i}${r}`;return j`
      <div class="wrapper">
        <input
          ?autofocus=${this.autofocus}
          id="input"
          class="checkbox"
          type="checkbox"
          ?checked=${this.checked}
          role=${B(this.toggle?`switch`:void 0)}
          aria-checked=${B(this.toggle?this.checked?`true`:`false`:void 0)}
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
    `}};_l.styles=hl,_l.formAssociated=!0,_l.shadowRootOptions={...Lc.shadowRootOptions,delegatesFocus:!0},gl([N({type:Boolean,reflect:!0})],_l.prototype,`autofocus`,void 0),gl([N({type:Boolean,reflect:!0})],_l.prototype,`checked`,null),gl([N({type:Boolean,reflect:!0,attribute:`default-checked`})],_l.prototype,`defaultChecked`,void 0),gl([N({type:Boolean,reflect:!0})],_l.prototype,`invalid`,void 0),gl([N({reflect:!0})],_l.prototype,`name`,void 0),gl([N({type:Boolean,reflect:!0})],_l.prototype,`toggle`,void 0),gl([N()],_l.prototype,`value`,void 0),gl([N({type:Boolean,reflect:!0})],_l.prototype,`disabled`,void 0),gl([N({type:Boolean,reflect:!0})],_l.prototype,`indeterminate`,void 0),gl([N({type:Boolean,reflect:!0})],_l.prototype,`required`,null),gl([N()],_l.prototype,`type`,void 0),gl([F(`#input`)],_l.prototype,`_inputEl`,void 0),_l=gl([L(`vscode-checkbox`)],_l);var vl=[R,A`
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
  `],yl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},bl=class extends I{constructor(){super(...arguments),this.role=`group`,this.variant=`horizontal`}render(){return j`
      <div class="wrapper">
        <slot></slot>
      </div>
    `}};bl.styles=vl,yl([N({reflect:!0})],bl.prototype,`role`,void 0),yl([N({reflect:!0})],bl.prototype,`variant`,void 0),bl=yl([L(`vscode-checkbox-group`)],bl);var xl=[R,A`
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
  `],Sl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Cl=class extends I{constructor(){super(...arguments),this.alwaysShowHeaderActions=!1,this.title=``,this.heading=``,this.description=``,this.open=!1}_emitToggleEvent(){this.dispatchEvent(new CustomEvent(`vsc-collapsible-toggle`,{detail:{open:this.open}}))}_onHeaderClick(){this.open=!this.open,this._emitToggleEvent()}_onHeaderKeyDown(e){e.key===`Enter`&&(this.open=!this.open,this._emitToggleEvent())}render(){let e={collapsible:!0,open:this.open},t={actions:!0,"always-visible":this.alwaysShowHeaderActions},n=this.heading?this.heading:this.title,r=j`<svg
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
    </svg>`,i=this.description?j`<span class="description">${this.description}</span>`:M;return j`
      <div class=${z(e)}>
        <div
          class="collapsible-header"
          tabindex="0"
          @click=${this._onHeaderClick}
          @keydown=${this._onHeaderKeyDown}
        >
          ${r}
          <h3 class="title">${n}${i}</h3>
          <div class="header-slots">
            <div class=${z(t)}>
              <slot name="actions"></slot>
            </div>
            <div class="decorations"><slot name="decorations"></slot></div>
          </div>
        </div>
        <div class="collapsible-body" part="body">
          <slot></slot>
        </div>
      </div>
    `}};Cl.styles=xl,Sl([N({type:Boolean,reflect:!0,attribute:`always-show-header-actions`})],Cl.prototype,`alwaysShowHeaderActions`,void 0),Sl([N({type:String})],Cl.prototype,`title`,void 0),Sl([N()],Cl.prototype,`heading`,void 0),Sl([N()],Cl.prototype,`description`,void 0),Sl([N({type:Boolean,reflect:!0})],Cl.prototype,`open`,void 0),Cl=Sl([L(`vscode-collapsible`)],Cl);var wl=[R,A`
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
  `],Tl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},El=class extends I{constructor(){super(...arguments),this.label=``,this.keybinding=``,this.value=``,this.separator=!1,this.tabindex=0}onItemClick(){this.dispatchEvent(new CustomEvent(`vsc-click`,{detail:{label:this.label,keybinding:this.keybinding,value:this.value||this.label,separator:this.separator,tabindex:this.tabindex},bubbles:!0,composed:!0}))}render(){return j`
      ${this.separator?j`
            <div class="context-menu-item separator">
              <span class="ruler"></span>
            </div>
          `:j`
            <div class="context-menu-item">
              <a @click=${this.onItemClick}>
                ${this.label?j`<span class="label">${this.label}</span>`:M}
                ${this.keybinding?j`<span class="keybinding">${this.keybinding}</span>`:M}
              </a>
            </div>
          `}
    `}};El.styles=wl,Tl([N({type:String})],El.prototype,`label`,void 0),Tl([N({type:String})],El.prototype,`keybinding`,void 0),Tl([N({type:String})],El.prototype,`value`,void 0),Tl([N({type:Boolean,reflect:!0})],El.prototype,`separator`,void 0),Tl([N({type:Number})],El.prototype,`tabindex`,void 0),El=Tl([L(`vscode-context-menu-item`)],El);var Dl=[R,A`
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
  `],Ol=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},kl=class extends I{set data(e){this._data=e;let t=[];e.forEach((e,n)=>{e.separator||t.push(n)}),this._clickableItemIndexes=t}get data(){return this._data}set show(e){this._show=e,this._selectedClickableItemIndex=-1,e&&this.updateComplete.then(()=>{this._wrapperEl&&this._wrapperEl.focus(),requestAnimationFrame(()=>{document.addEventListener(`click`,this._onClickOutsideBound,{once:!0})})})}get show(){return this._show}constructor(){super(),this.preventClose=!1,this.tabIndex=0,this._selectedClickableItemIndex=-1,this._show=!1,this._data=[],this._clickableItemIndexes=[],this._onClickOutsideBound=this._onClickOutside.bind(this),this.addEventListener(`keydown`,this._onKeyDown)}_onClickOutside(e){e.composedPath().includes(this)||(this.show=!1)}_onKeyDown(e){let{key:t}=e;switch((t===`ArrowUp`||t===`ArrowDown`||t===`Escape`||t===`Enter`)&&e.preventDefault(),t){case`ArrowUp`:this._handleArrowUp();break;case`ArrowDown`:this._handleArrowDown();break;case`Escape`:this._handleEscape();break;case`Enter`:this._handleEnter();break;default:}}_handleArrowUp(){this._selectedClickableItemIndex===0?this._selectedClickableItemIndex=this._clickableItemIndexes.length-1:--this._selectedClickableItemIndex}_handleArrowDown(){this._selectedClickableItemIndex+1<this._clickableItemIndexes.length?this._selectedClickableItemIndex+=1:this._selectedClickableItemIndex=0}_handleEscape(){this.show=!1,document.removeEventListener(`click`,this._onClickOutsideBound)}_dispatchSelectEvent(e){let{keybinding:t,label:n,value:r,separator:i,tabindex:a}=e;this.dispatchEvent(new CustomEvent(`vsc-context-menu-select`,{detail:{keybinding:t,label:n,separator:i,tabindex:a,value:r}}))}_handleEnter(){if(this._selectedClickableItemIndex===-1)return;let e=this._clickableItemIndexes[this._selectedClickableItemIndex],t=this._wrapperEl.querySelectorAll(`vscode-context-menu-item`)[e];this._dispatchSelectEvent(t),this.preventClose||(this.show=!1,document.removeEventListener(`click`,this._onClickOutsideBound))}_onItemClick(e){let t=e.currentTarget;this._dispatchSelectEvent(t),this.preventClose||(this.show=!1)}_onItemMouseOver(e){let t=e.target,n=t.dataset.index?+t.dataset.index:-1,r=this._clickableItemIndexes.findIndex(e=>e===n);r!==-1&&(this._selectedClickableItemIndex=r)}_onItemMouseOut(){this._selectedClickableItemIndex=-1}render(){if(!this._show)return j`${M}`;let e=this._clickableItemIndexes[this._selectedClickableItemIndex];return j`
      <div class="context-menu" tabindex="0">
        ${this.data?this.data.map(({label:t=``,keybinding:n=``,value:r=``,separator:i=!1,tabindex:a=0},o)=>j`
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
              `):j`<slot></slot>`}
      </div>
    `}};kl.styles=Dl,Ol([N({type:Array,attribute:!1})],kl.prototype,`data`,null),Ol([N({type:Boolean,reflect:!0,attribute:`prevent-close`})],kl.prototype,`preventClose`,void 0),Ol([N({type:Boolean,reflect:!0})],kl.prototype,`show`,null),Ol([N({type:Number,reflect:!0})],kl.prototype,`tabIndex`,void 0),Ol([P()],kl.prototype,`_selectedClickableItemIndex`,void 0),Ol([P()],kl.prototype,`_show`,void 0),Ol([F(`.context-menu`)],kl.prototype,`_wrapperEl`,void 0),kl=Ol([L(`vscode-context-menu`)],kl);var Al=[R,A`
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
  `],jl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ml=class extends I{constructor(){super(...arguments),this.role=`separator`}render(){return j`<div></div>`}};Ml.styles=Al,jl([N({reflect:!0})],Ml.prototype,`role`,void 0),Ml=jl([L(`vscode-divider`)],Ml);var Nl=[R,A`
    :host {
      display: block;
      max-width: 727px;
    }
  `],Pl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Fl;(function(e){e.HORIZONTAL=`horizontal`,e.VERTICAL=`vertical`})(Fl||={});var Il=class extends I{constructor(){super(...arguments),this.breakpoint=490,this._responsive=!1,this._firstUpdateComplete=!1,this._resizeObserverCallbackBound=this._resizeObserverCallback.bind(this)}set responsive(e){this._responsive=e,this._firstUpdateComplete&&(e?this._activateResponsiveLayout():this._deactivateResizeObserver())}get responsive(){return this._responsive}_toggleCompactLayout(e){this._assignedFormGroups.forEach(t=>{t.dataset.originalVariant||(t.dataset.originalVariant=t.variant);let n=t.dataset.originalVariant;e===Fl.VERTICAL&&n===`horizontal`?t.variant=`vertical`:t.variant=n,t.querySelectorAll(`vscode-checkbox-group, vscode-radio-group`).forEach(t=>{t.dataset.originalVariant||(t.dataset.originalVariant=t.variant);let n=t.dataset.originalVariant;e===Fl.HORIZONTAL&&n===Fl.HORIZONTAL?t.variant=`horizontal`:t.variant=`vertical`})})}_resizeObserverCallback(e){let t=0;for(let n of e)t=n.contentRect.width;let n=t<this.breakpoint?Fl.VERTICAL:Fl.HORIZONTAL;n!==this._currentFormGroupLayout&&(this._toggleCompactLayout(n),this._currentFormGroupLayout=n)}_activateResponsiveLayout(){this._resizeObserver=new ResizeObserver(this._resizeObserverCallbackBound),this._resizeObserver.observe(this._wrapperElement)}_deactivateResizeObserver(){this._resizeObserver?.disconnect(),this._resizeObserver=null}firstUpdated(){this._firstUpdateComplete=!0,this._responsive&&this._activateResponsiveLayout()}render(){return j`
      <div class="wrapper">
        <slot></slot>
      </div>
    `}};Il.styles=Nl,Pl([N({type:Boolean,reflect:!0})],Il.prototype,`responsive`,null),Pl([N({type:Number})],Il.prototype,`breakpoint`,void 0),Pl([F(`.wrapper`)],Il.prototype,`_wrapperElement`,void 0),Pl([Wc({selector:`vscode-form-group`})],Il.prototype,`_assignedFormGroups`,void 0),Il=Pl([L(`vscode-form-container`)],Il);var Ll=[R,A`
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
  `],Rl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},zl=class extends I{constructor(){super(...arguments),this.variant=`horizontal`}render(){return j`
      <div class="wrapper">
        <slot></slot>
      </div>
    `}};zl.styles=Ll,Rl([N({reflect:!0})],zl.prototype,`variant`,void 0),zl=Rl([L(`vscode-form-group`)],zl);var Bl=[R,A`
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
  `],Vl=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Hl=new CSSStyleSheet;Hl.replaceSync(`
  vscode-form-helper * {
    margin: 0;
  }

  vscode-form-helper *:not(:last-child) {
    margin-bottom: 8px;
  }
`);var Ul=class extends I{constructor(){super(),this._injectLightDOMStyles()}_injectLightDOMStyles(){document.adoptedStyleSheets.find(e=>e===Hl)||document.adoptedStyleSheets.push(Hl)}render(){return j`<slot></slot>`}};Ul.styles=Bl,Ul=Vl([L(`vscode-form-helper`)],Ul);var Wl=0,Gl=(e=``)=>(Wl++,`${e}${Wl}`),Kl=[R,A`
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
  `],ql=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Jl=class extends I{constructor(){super(...arguments),this.required=!1,this._id=``,this._htmlFor=``,this._connected=!1}set htmlFor(e){this._htmlFor=e,this.setAttribute(`for`,e),this._connected&&this._connectWithTarget()}get htmlFor(){return this._htmlFor}set id(e){this._id=e}get id(){return this._id}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n)}connectedCallback(){super.connectedCallback(),this._connected=!0,this._id===``&&(this._id=Gl(`vscode-label-`),this.setAttribute(`id`,this._id)),this._connectWithTarget()}_getTarget(){let e=null;if(this._htmlFor){let t=this.getRootNode({composed:!1});t&&(e=t.querySelector(`#${this._htmlFor}`))}return e}async _connectWithTarget(){await this.updateComplete;let e=this._getTarget();[`vscode-radio-group`,`vscode-checkbox-group`].includes(e?.tagName.toLowerCase()??``)&&e.setAttribute(`aria-labelledby`,this._id);let t=``;this.textContent&&(t=this.textContent.trim()),e&&`label`in e&&[`vscode-textfield`,`vscode-textarea`,`vscode-single-select`,`vscode-multi-select`].includes(e?.tagName.toLowerCase()??``)&&(e.label=t)}_handleClick(){let e=this._getTarget();e&&`focus`in e&&e.focus()}render(){return j`
      <label
        class=${z({wrapper:!0,required:this.required})}
        @click=${this._handleClick}
        ><slot></slot
      ></label>
    `}};Jl.styles=Kl,ql([N({reflect:!0,attribute:`for`})],Jl.prototype,`htmlFor`,null),ql([N()],Jl.prototype,`id`,null),ql([N({type:Boolean,reflect:!0})],Jl.prototype,`required`,void 0),Jl=ql([L(`vscode-label`)],Jl);const Yl=j`
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
`,Xl=vc`<svg
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
</svg>`;var{I:Zl}=Nc,Ql=()=>document.createComment(``),$l=(e,t,n)=>{let r=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0)n=new Zl(r.insertBefore(Ql(),i),r.insertBefore(Ql(),i),e,e.options);else{let t=n._$AB.nextSibling,a=n._$AM,o=a!==e;if(o){let t;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(t=e._$AU)!==a._$AU&&n._$AP(t)}if(t!==i||o){let e=n._$AA;for(;e!==t;){let t=e.nextSibling;r.insertBefore(e,i),e=t}}}return n},eu=(e,t,n=e)=>(e._$AI(t,n),e),tu={},nu=(e,t=tu)=>e._$AH=t,ru=e=>e._$AH,iu=e=>{e._$AR(),e._$AA.remove()},au=(e,t,n)=>{let r=new Map;for(let i=t;i<=n;i++)r.set(e[i],i);return r},ou=$c(class extends el{constructor(e){if(super(e),e.type!==Qc.CHILD)throw Error(`repeat() can only be used in text expressions`)}dt(e,t,n){let r;n===void 0?n=t:t!==void 0&&(r=t);let i=[],a=[],o=0;for(let t of e)i[o]=r?r(t,o):o,a[o]=n(t,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,r]){let i=ru(e),{values:a,keys:o}=this.dt(t,n,r);if(!Array.isArray(i))return this.ut=o,a;let s=this.ut??=[],c=[],l,u,d=0,f=i.length-1,p=0,m=a.length-1;for(;d<=f&&p<=m;)if(i[d]===null)d++;else if(i[f]===null)f--;else if(s[d]===o[p])c[p]=eu(i[d],a[p]),d++,p++;else if(s[f]===o[m])c[m]=eu(i[f],a[m]),f--,m--;else if(s[d]===o[m])c[m]=eu(i[d],a[m]),$l(e,c[m+1],i[d]),d++,m--;else if(s[f]===o[p])c[p]=eu(i[f],a[p]),$l(e,i[d],i[f]),f--,p++;else if(l===void 0&&(l=au(o,p,m),u=au(s,d,f)),l.has(s[d]))if(l.has(s[f])){let t=u.get(o[p]),n=t===void 0?null:i[t];if(n===null){let t=$l(e,i[d]);eu(t,a[p]),c[p]=t}else c[p]=eu(n,a[p]),$l(e,i[d],n),i[t]=null;p++}else iu(i[f]),f--;else iu(i[d]),d++;for(;p<=m;){let t=$l(e,c[m+1]);eu(t,a[p]),c[p++]=t}for(;d<=f;){let e=i[d++];e!==null&&iu(e)}return this.ut=o,nu(e,c),yc}});function su(e,t,n){return e?t(e):n?.(e)}var cu=R,lu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},uu=class extends I{constructor(){super(...arguments),this.description=``,this.selected=!1,this.disabled=!1,this._initialized=!1,this._handleSlotChange=()=>{this._initialized&&this.dispatchEvent(new Event(`vsc-option-state-change`,{bubbles:!0}))}}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this._initialized=!0})}willUpdate(e){this._initialized&&(e.has(`description`)||e.has(`value`)||e.has(`selected`)||e.has(`disabled`))&&this.dispatchEvent(new Event(`vsc-option-state-change`,{bubbles:!0}))}render(){return j`<slot @slotchange=${this._handleSlotChange}></slot>`}};uu.styles=cu,lu([N({type:String})],uu.prototype,`value`,void 0),lu([N({type:String})],uu.prototype,`description`,void 0),lu([N({type:Boolean,reflect:!0})],uu.prototype,`selected`,void 0),lu([N({type:Boolean,reflect:!0})],uu.prototype,`disabled`,void 0),uu=lu([L(`vscode-option`)],uu);const du=(e,t)=>{let n={match:!1,ranges:[]},r=e.toLowerCase(),i=t.toLowerCase(),a=r.split(` `),o=0;return a.forEach((t,r)=>{if(r>0&&(o+=a[r-1].length+1),n.match)return;let s=t.indexOf(i),c=i.length;s===0&&(n.match=!0,n.ranges.push([o+s,Math.min(o+s+c,e.length)]))}),n},fu=(e,t)=>{let n={match:!1,ranges:[]};return e.toLowerCase().indexOf(t.toLowerCase())===0&&(n.match=!0,n.ranges=[[0,t.length]]),n},pu=(e,t)=>{let n={match:!1,ranges:[]},r=e.toLowerCase().indexOf(t.toLowerCase());return r>-1&&(n.match=!0,n.ranges=[[r,r+t.length]]),n},mu=(e,t)=>{let n={match:!1,ranges:[]},r=0,i=0,a=t.length-1,o=e.toLowerCase(),s=t.toLowerCase();for(let e=0;e<=a;e++){if(i=o.indexOf(s[e],r),i===-1)return{match:!1,ranges:[]};n.match=!0,n.ranges.push([i,i+1]),r=i+1}return n},hu=(e,t,n)=>{let r=[];return e.forEach(e=>{let i;switch(n){case`startsWithPerTerm`:i=du(e.label,t);break;case`startsWith`:i=fu(e.label,t);break;case`contains`:i=pu(e.label,t);break;default:i=mu(e.label,t)}i.match&&r.push({...e,ranges:i.ranges})}),r};var gu=e=>{let t=[];return e===` `?(t.push(j`&nbsp;`),t):(e.indexOf(` `)===0&&t.push(j`&nbsp;`),t.push(j`${e.trimStart().trimEnd()}`),e.lastIndexOf(` `)===e.length-1&&t.push(j`&nbsp;`),t)};const _u=(e,t)=>{let n=[],r=t.length;return r<1?j`${e}`:(t.forEach((i,a)=>{let o=e.substring(i[0],i[1]);a===0&&i[0]!==0&&n.push(...gu(e.substring(0,t[0][0]))),a>0&&a<r&&i[0]-t[a-1][1]!==0&&n.push(...gu(e.substring(t[a-1][1],i[0]))),n.push(j`<b>${gu(o)}</b>`),a===r-1&&i[1]<e.length&&n.push(...gu(e.substring(i[1],e.length)))}),n)};var vu=class{constructor(e){this._activeIndex=-1,this._options=[],this._filterPattern=``,this._filterMethod=`fuzzy`,this._combobox=!1,this._indexByValue=new Map,this._indexByLabel=new Map,this._selectedIndex=-1,this._selectedIndexes=new Set,this._multiSelect=!1,this._numOfVisibleOptions=0,(this._host=e).addController(this)}hostConnected(){}get activeIndex(){return this._activeIndex}set activeIndex(e){this._activeIndex=e,this._host.requestUpdate()}get relativeActiveIndex(){return this._options[this._activeIndex]?.filteredIndex??-1}set comboboxMode(e){this._combobox=e,this._host.requestUpdate()}get comboboxMode(){return this._combobox}get multiSelect(){return this._multiSelect}set multiSelect(e){this._selectedIndex=-1,this._selectedIndexes.clear(),this._multiSelect=e,this._host.requestUpdate()}get selectedIndex(){return this._selectedIndex}set selectedIndex(e){this._selectedIndex!==-1&&this._options[this._selectedIndex]&&(this._options[this._selectedIndex].selected??=!1),this._selectedIndex=this.getOptionByIndex(e)?e:-1,this._host.requestUpdate()}get selectedIndexes(){return Array.from(this._selectedIndexes)}set selectedIndexes(e){this._selectedIndexes.forEach(e=>{this._options[e].selected=!1}),this._selectedIndexes=new Set(e),e.forEach(e=>{this._options[e]!==void 0&&(this._options[e].selected=!0)}),this._host.requestUpdate()}set value(e){if(this._multiSelect){let t=e.map(e=>this._indexByValue.get(e)).filter(e=>e!==void 0);this._selectedIndexes=new Set(t)}else this._selectedIndex=this._indexByValue.get(e)??-1;this._host.requestUpdate()}get value(){return this._multiSelect?this._selectedIndexes.size>0?Array.from(this._selectedIndexes).filter(e=>e>=0&&e<this._options.length).map(e=>this._options[e].value):[]:this._selectedIndex>-1&&this._selectedIndex<this._options.length?this._options[this._selectedIndex].value:``}set multiSelectValue(e){let t=e.map(e=>this._indexByValue.get(e)).filter(e=>e!==void 0);this._selectedIndexes=new Set(t)}get multiSelectValue(){return this._selectedIndexes.size>0?Array.from(this._selectedIndexes).map(e=>this._options[e].value):[]}get filterPattern(){return this._filterPattern}set filterPattern(e){e!==this._filterPattern&&(this._filterPattern=e,this._updateState())}get filterMethod(){return this._filterMethod}set filterMethod(e){e!==this._filterMethod&&(this._filterMethod=e,this._updateState())}get options(){return this._options}get numOfVisibleOptions(){return this._numOfVisibleOptions}get numOptions(){return this._options.length}populate(e){this._indexByValue.clear(),this._indexByLabel.clear(),this._options=e.map((e,t)=>(this._indexByValue.set(e.value??``,t),this._indexByLabel.set(e.label??``,t),{description:e.description??``,disabled:e.disabled??!1,label:e.label??``,selected:e.selected??!1,value:e.value??``,index:t,filteredIndex:t,ranges:[],visible:!0})),this._numOfVisibleOptions=this._options.length}add(e){let t=this._options.length,{description:n,disabled:r,label:i,selected:a,value:o}=e,s=!0,c=[];if(this._combobox&&this._filterPattern!==``){let e=this._searchByPattern(i??``);s=e.match,c=e.ranges}this._indexByValue.set(o??``,t),this._indexByLabel.set(i??``,t),a&&(this._selectedIndex=t,this._selectedIndexes.add(t),this._activeIndex=t),this._options.push({index:t,filteredIndex:t,description:n??``,disabled:r??!1,label:i??``,selected:a??!1,value:o??``,visible:s,ranges:c}),s&&(this._numOfVisibleOptions+=1)}clear(){this._options=[],this._indexByValue.clear(),this._indexByLabel.clear(),this._numOfVisibleOptions=0,this._selectedIndex=-1,this._selectedIndexes.clear(),this._activeIndex=-1}getIsIndexSelected(e){return this._multiSelect?this._selectedIndexes.has(e):this._selectedIndex===e}expandMultiSelection(e){e.forEach(e=>{let t=this._indexByValue.get(e)??-1;t!==-1&&this._selectedIndexes.add(t)}),this._host.requestUpdate()}toggleActiveMultiselectOption(){let e=this._options[this._activeIndex]??null;e&&(this._selectedIndexes.has(e.index)?this._selectedIndexes.delete(e.index):this._selectedIndexes.add(e.index),this._host.requestUpdate())}toggleOptionSelected(e){let t=this._selectedIndexes.has(e);this._options[e].selected=!this._options[e].selected,t?this._selectedIndexes.delete(e):this._selectedIndexes.add(e),this._host.requestUpdate()}getActiveOption(){return this._options[this._activeIndex]??null}getSelectedOption(){return this._options[this._selectedIndex]??null}getOptionByIndex(e){return this._options[e]??null}findOptionIndex(e){return this._indexByValue.get(e)??-1}getOptionByValue(e,t=!1){let n=this._indexByValue.get(e)??-1;return n===-1?null:t||this._options[n].visible?this._options[n]:null}getOptionByLabel(e){let t=this._indexByLabel.get(e)??-1;return t===-1?null:this._options[t]}next(e){let t=e??this._activeIndex,n=-1;for(let e=t+1;e<this._options.length;e++)if(this._options[e]&&!this._options[e].disabled&&this._options[e].visible){n=e;break}return n>-1?this._options[n]:null}prev(e){let t=e??this._activeIndex,n=-1;for(let e=t-1;e>=0;e--)if(this._options[e]&&!this._options[e].disabled&&this._options[e].visible){n=e;break}return n>-1?this._options[n]:null}activateDefault(){if(this._multiSelect){if(this._selectedIndexes.size>0){let e=this._selectedIndexes.values().next();this._activeIndex=e.value?e.value:0}}else this._selectedIndex>-1?this._activeIndex=this._selectedIndex:this._activeIndex=0;this._host.requestUpdate()}selectAll(){this._multiSelect&&(this._options.forEach((e,t)=>{this._options[t].selected=!0,this._selectedIndexes.add(t)}),this._host.requestUpdate())}selectNone(){this._multiSelect&&(this._options.forEach((e,t)=>{this._options[t].selected=!1}),this._selectedIndexes.clear(),this._host.requestUpdate())}_searchByPattern(e){let t;switch(this._filterMethod){case`startsWithPerTerm`:t=du(e,this._filterPattern);break;case`startsWith`:t=fu(e,this._filterPattern);break;case`contains`:t=pu(e,this._filterPattern);break;default:t=mu(e,this._filterPattern)}return t}_updateState(){if(!this._combobox||this._filterPattern===``)this._options.forEach((e,t)=>{this._options[t].visible=!0,this._options[t].ranges=[]}),this._numOfVisibleOptions=this._options.length;else{let e=-1;this._numOfVisibleOptions=0,this._options.forEach(({label:t},n)=>{let r=this._searchByPattern(t);this._options[n].visible=r.match,this._options[n].ranges=r.ranges,this._options[n].filteredIndex=r.match?++e:-1,r.match&&(this._numOfVisibleOptions+=1)})}this._host.requestUpdate()}},yu=[R,A`
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
  `],U=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},W=class extends I{set scrollPos(e){this._scrollPos=this._limitScrollPos(e),this._updateScrollbar(),this._updateThumbPosition(),this.requestUpdate()}get scrollPos(){return this._scrollPos}get scrollMax(){return this._scrollableContainer?this._scrollableContainer.scrollHeight-this._scrollableContainer.clientHeight:0}constructor(){super(),this.alwaysVisible=!1,this.fastScrollSensitivity=5,this.minThumbSize=20,this.mouseWheelScrollSensitivity=1,this.shadow=!0,this.scrolled=!1,this._scrollPos=0,this._isDragging=!1,this._thumbHeight=0,this._thumbY=0,this._thumbVisible=!1,this._thumbFade=!1,this._thumbActive=!1,this._componentHeight=0,this._contentHeight=0,this._scrollThumbStartY=0,this._mouseStartY=0,this._scrollbarVisible=!0,this._scrollbarTrackZ=0,this._resizeObserverCallback=()=>{this._componentHeight=this.offsetHeight,this._contentHeight=this._contentElement.offsetHeight,this._updateScrollbar(),this._updateThumbPosition()},this._handleSlotChange=()=>{this._updateScrollbar(),this._updateThumbPosition(),this._zIndexFix()},this._handleScrollThumbMouseMove=e=>{let t=this._scrollThumbStartY+(e.screenY-this._mouseStartY);this._thumbY=this._limitThumbPos(t),this.scrollPos=this._calculateScrollPosFromThumbPos(this._thumbY),this.dispatchEvent(new CustomEvent(`vsc-scrollable-scroll`,{detail:this.scrollPos}))},this._handleScrollThumbMouseUp=e=>{this._isDragging=!1,this._thumbActive=!1;let{x:t,y:n,width:r,height:i}=this.getBoundingClientRect(),{pageX:a,pageY:o}=e;(a>t+r||a<t||o>n+i||o<n)&&(this._thumbFade=!0,this._thumbVisible=!1),document.removeEventListener(`mousemove`,this._handleScrollThumbMouseMove),document.removeEventListener(`mouseup`,this._handleScrollThumbMouseUp)},this._handleComponentMouseOver=()=>{this._thumbVisible=!0,this._thumbFade=!1},this._handleComponentMouseOut=()=>{this._thumbActive||(this._thumbVisible=!1,this._thumbFade=!0)},this._handleComponentWheel=e=>{if(this._contentHeight<=this._componentHeight)return;e.preventDefault();let t=e.altKey?this.mouseWheelScrollSensitivity*this.fastScrollSensitivity:this.mouseWheelScrollSensitivity;this.scrollPos=this._limitScrollPos(this.scrollPos+e.deltaY*t),this.dispatchEvent(new CustomEvent(`vsc-scrollable-scroll`,{detail:this.scrollPos}))},this._handleScrollableContainerScroll=e=>{e.currentTarget&&(this.scrollPos=e.currentTarget.scrollTop)},this.addEventListener(`mouseover`,this._handleComponentMouseOver),this.addEventListener(`mouseout`,this._handleComponentMouseOut),this.addEventListener(`wheel`,this._handleComponentWheel)}connectedCallback(){super.connectedCallback(),this._hostResizeObserver=new ResizeObserver(this._resizeObserverCallback),this._contentResizeObserver=new ResizeObserver(this._resizeObserverCallback),this.requestUpdate(),this.updateComplete.then(()=>{this._hostResizeObserver.observe(this),this._contentResizeObserver.observe(this._contentElement),this._updateThumbPosition()})}disconnectedCallback(){super.disconnectedCallback(),this._hostResizeObserver.unobserve(this),this._hostResizeObserver.disconnect(),this._contentResizeObserver.unobserve(this._contentElement),this._contentResizeObserver.disconnect()}firstUpdated(e){this._updateThumbPosition()}_calcThumbHeight(){let e=this.offsetHeight,t=e*(e/(this._contentElement?.offsetHeight??0));return Math.max(this.minThumbSize,t)}_updateScrollbar(){let e=this._contentElement?.offsetHeight??0;this.offsetHeight>=e?this._scrollbarVisible=!1:(this._scrollbarVisible=!0,this._thumbHeight=this._calcThumbHeight()),this.requestUpdate()}_zIndexFix(){let e=0;this._assignedElements.forEach(t=>{if(`style`in t){let n=window.getComputedStyle(t).zIndex;/([0-9-])+/g.test(n)&&(e=Number(n)>e?Number(n):e)}}),this._scrollbarTrackZ=e+1,this.requestUpdate()}_updateThumbPosition(){if(!this._scrollableContainer)return;this.scrolled=this.scrollPos>0;let e=this.offsetHeight,t=this._thumbHeight,n=this._contentElement.offsetHeight-e,r=this.scrollPos/n,i=e-t;this._thumbY=Math.min(r*(e-t),i)}_calculateScrollPosFromThumbPos(e){let t=this.getBoundingClientRect().height,n=this._scrollThumbElement.getBoundingClientRect().height,r=this._contentElement.getBoundingClientRect().height,i=e/(t-n)*(r-t);return this._limitScrollPos(i)}_limitScrollPos(e){return e<0?0:e>this.scrollMax?this.scrollMax:e}_limitThumbPos(e){let t=this.getBoundingClientRect().height,n=this._scrollThumbElement.getBoundingClientRect().height;return e<0?0:e>t-n?t-n:e}_handleScrollThumbMouseDown(e){let t=this.getBoundingClientRect(),n=this._scrollThumbElement.getBoundingClientRect();this._mouseStartY=e.screenY,this._scrollThumbStartY=n.top-t.top,this._isDragging=!0,this._thumbActive=!0,document.addEventListener(`mousemove`,this._handleScrollThumbMouseMove),document.addEventListener(`mouseup`,this._handleScrollThumbMouseUp)}_handleScrollbarTrackPress(e){e.target===e.currentTarget&&(this._thumbY=e.offsetY-this._thumbHeight/2,this.scrollPos=this._calculateScrollPosFromThumbPos(this._thumbY))}render(){return j`
      <div
        class="scrollable-container"
        .style=${tl({userSelect:this._isDragging?`none`:`auto`})}
        .scrollTop=${this.scrollPos}
        @scroll=${this._handleScrollableContainerScroll}
      >
        <div
          class=${z({shadow:!0,visible:this.scrolled})}
          .style=${tl({zIndex:String(this._scrollbarTrackZ)})}
        ></div>
        ${this._isDragging?j`<div class="prevent-interaction"></div>`:M}
        <div
          class=${z({"scrollbar-track":!0,hidden:!this._scrollbarVisible})}
          @mousedown=${this._handleScrollbarTrackPress}
        >
          <div
            class=${z({"scrollbar-thumb":!0,visible:this.alwaysVisible?!0:this._thumbVisible,fade:this.alwaysVisible?!1:this._thumbFade,active:this._thumbActive})}
            .style=${tl({height:`${this._thumbHeight}px`,top:`${this._thumbY}px`})}
            @mousedown=${this._handleScrollThumbMouseDown}
          ></div>
        </div>
        <div class="content">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </div>
    `}};W.styles=yu,U([N({type:Boolean,reflect:!0,attribute:`always-visible`})],W.prototype,`alwaysVisible`,void 0),U([N({type:Number,attribute:`fast-scroll-sensitivity`})],W.prototype,`fastScrollSensitivity`,void 0),U([N({type:Number,attribute:`min-thumb-size`})],W.prototype,`minThumbSize`,void 0),U([N({type:Number,attribute:`mouse-wheel-scroll-sensitivity`})],W.prototype,`mouseWheelScrollSensitivity`,void 0),U([N({type:Boolean,reflect:!0})],W.prototype,`shadow`,void 0),U([N({type:Boolean,reflect:!0})],W.prototype,`scrolled`,void 0),U([N({type:Number,attribute:`scroll-pos`})],W.prototype,`scrollPos`,null),U([P()],W.prototype,`_isDragging`,void 0),U([P()],W.prototype,`_thumbHeight`,void 0),U([P()],W.prototype,`_thumbY`,void 0),U([P()],W.prototype,`_thumbVisible`,void 0),U([P()],W.prototype,`_thumbFade`,void 0),U([P()],W.prototype,`_thumbActive`,void 0),U([F(`.content`)],W.prototype,`_contentElement`,void 0),U([F(`.scrollbar-thumb`,!0)],W.prototype,`_scrollThumbElement`,void 0),U([F(`.scrollable-container`)],W.prototype,`_scrollableContainer`,void 0),U([Wc()],W.prototype,`_assignedElements`,void 0),W=U([L(`vscode-scrollable`)],W);var G=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},K=class extends I{set combobox(e){this._opts.comboboxMode=e}get combobox(){return this._opts.comboboxMode}set disabled(e){this._disabled=e,this.ariaDisabled=e?`true`:`false`,e===!0?(this._originalTabIndex=this.tabIndex,this.tabIndex=-1):(this.tabIndex=this._originalTabIndex??0,this._originalTabIndex=void 0),this.requestUpdate()}get disabled(){return this._disabled}set filter(e){let t=[`contains`,`fuzzy`,`startsWith`,`startsWithPerTerm`],n;t.includes(e)?n=e:(console.warn(`[VSCode Webview Elements] Invalid filter: "${e}", fallback to default. Valid values are: "contains", "fuzzy", "startsWith", "startsWithPerm".`,this),n=`fuzzy`),this._opts.filterMethod=n}get filter(){return this._opts.filterMethod}set options(e){this._opts.populate(e)}get options(){return this._opts.options.map(({label:e,value:t,description:n,selected:r,disabled:i})=>({label:e,value:t,description:n,selected:r,disabled:i}))}constructor(){super(),this.creatable=!1,this.label=``,this.invalid=!1,this.focused=!1,this.open=!1,this.position=`below`,this._opts=new vu(this),this._firstUpdateCompleted=!1,this._currentDescription=``,this._filter=`fuzzy`,this._selectedIndexes=[],this._options=[],this._value=``,this._values=[],this._isPlaceholderOptionActive=!1,this._isBeingFiltered=!1,this._optionListScrollPos=0,this._isHoverForbidden=!1,this._disabled=!1,this._originalTabIndex=void 0,this._onMouseMove=()=>{this._isHoverForbidden=!1,window.removeEventListener(`mousemove`,this._onMouseMove)},this._onOptionListScroll=e=>{this._optionListScrollPos=e.detail},this._onComponentKeyDown=e=>{[` `,`ArrowUp`,`ArrowDown`,`Escape`].includes(e.key)&&(e.stopPropagation(),e.preventDefault()),e.key===`Enter`&&this._onEnterKeyDown(e),e.key===` `&&this._onSpaceKeyDown(),e.key===`Escape`&&this._onEscapeKeyDown(),e.key===`ArrowUp`&&this._onArrowUpKeyDown(),e.key===`ArrowDown`&&this._onArrowDownKeyDown()},this._onComponentFocus=()=>{this.focused=!0},this._onComponentBlur=()=>{this.focused=!1},this._handleWindowScroll=()=>{this.open=!1},this.addEventListener(`vsc-option-state-change`,e=>{e.stopPropagation(),this._setStateFromSlottedElements(),this.requestUpdate()})}connectedCallback(){super.connectedCallback(),this.addEventListener(`keydown`,this._onComponentKeyDown),this.addEventListener(`focus`,this._onComponentFocus),this.addEventListener(`blur`,this._onComponentBlur),this._setAutoFocus()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(`keydown`,this._onComponentKeyDown),this.removeEventListener(`focus`,this._onComponentFocus),this.removeEventListener(`blur`,this._onComponentBlur)}firstUpdated(e){this._firstUpdateCompleted=!0}willUpdate(e){e.has(`required`)&&this._firstUpdateCompleted&&this._manageRequired(),e.has(`open`)&&this._firstUpdateCompleted&&(this.open?(this._dropdownEl.showPopover(),window.addEventListener(`scroll`,this._handleWindowScroll,{capture:!0}),this._opts.activateDefault(),this._scrollActiveElementToTop()):(this._dropdownEl.hidePopover(),window.removeEventListener(`scroll`,this._handleWindowScroll)))}get _filteredOptions(){return!this.combobox||this._opts.filterPattern===``?this._options:hu(this._options,this._opts.filterPattern,this._filter)}_setAutoFocus(){this.hasAttribute(`autofocus`)&&(this.tabIndex<0&&(this.tabIndex=0),this.combobox?this.updateComplete.then(()=>{this.shadowRoot?.querySelector(`.combobox-input`).focus()}):this.updateComplete.then(()=>{this.shadowRoot?.querySelector(`.select-face`).focus()}))}get _isSuggestedOptionVisible(){if(!(this.combobox&&this.creatable))return!1;let e=this._opts.getOptionByValue(this._opts.filterPattern)!==null,t=this._opts.filterPattern.length>0;return!e&&t}_manageRequired(){}_setStateFromSlottedElements(){let e=this._assignedOptions??[];this._opts.clear(),e.forEach(e=>{let{innerText:t,description:n,disabled:r}=e,i=typeof e.value==`string`?e.value:t.trim(),a=e.selected??!1,o={label:t.trim(),value:i,description:n,selected:a,disabled:r};this._opts.add(o)})}_createSuggestedOption(){let e=this._opts.numOptions,t=document.createElement(`vscode-option`);return t.value=this._opts.filterPattern,Fc(this._opts.filterPattern,t),this.appendChild(t),e}_dispatchChangeEvent(){this.dispatchEvent(new Event(`change`)),this.dispatchEvent(new Event(`input`))}async _createAndSelectSuggestedOption(){}_toggleComboboxDropdown(){this._opts.filterPattern=``,this.open=!this.open}_scrollActiveElementToTop(){this._optionListScrollPos=Math.floor(this._opts.relativeActiveIndex*22)}async _adjustOptionListScrollPos(e,t){let n=this._opts.numOfVisibleOptions;if(this._isSuggestedOptionVisible&&(n+=1),n<=10)return;this._isHoverForbidden=!0,window.addEventListener(`mousemove`,this._onMouseMove);let r=this._optionListScrollPos,i=t*22,a=i>=r&&i<=r+220-22;e===`down`&&(a||(this._optionListScrollPos=t*22-198)),e===`up`&&(a||(this._optionListScrollPos=Math.floor(this._opts.relativeActiveIndex*22)))}_onFaceClick(){this.open=!this.open}_handleDropdownToggle(e){this.open=e.newState===`open`}_onComboboxButtonClick(){this._toggleComboboxDropdown()}_onComboboxButtonKeyDown(e){e.key===`Enter`&&this._toggleComboboxDropdown()}_onOptionMouseOver(e){if(this._isHoverForbidden)return;let t=e.target;t.matches(`.option`)&&(t.matches(`.placeholder`)?(this._isPlaceholderOptionActive=!0,this._opts.activeIndex=-1):(this._isPlaceholderOptionActive=!1,this._opts.activeIndex=+t.dataset.index))}_onPlaceholderOptionMouseOut(){this._isPlaceholderOptionActive=!1}_onNoOptionsClick(e){e.stopPropagation()}_onEnterKeyDown(e){this._isBeingFiltered=!1,e?.composedPath&&e.composedPath().find(e=>e.matches?e.matches(`vscode-button.button-accept`):!1)}_onSpaceKeyDown(){if(!this.open){this.open=!0;return}}_onArrowUpKeyDown(){if(this.open){if(this._opts.activeIndex<=0&&!(this.combobox&&this.creatable))return;if(this._isPlaceholderOptionActive){let e=this._opts.numOfVisibleOptions-1;this._opts.activeIndex=e,this._isPlaceholderOptionActive=!1}else{let e=this._opts.prev();if(e!==null){this._opts.activeIndex=e?.index??-1;let t=e?.filteredIndex??-1;t>-1&&this._adjustOptionListScrollPos(`up`,t)}}}else this.open=!0,this._opts.activateDefault()}_onArrowDownKeyDown(){let e=this._opts.numOfVisibleOptions,t=this._isSuggestedOptionVisible;if(t&&(e+=1),this.open){if(this._isPlaceholderOptionActive&&this._opts.activeIndex===-1)return;let n=this._opts.next();if(t&&n===null)this._isPlaceholderOptionActive=!0,this._adjustOptionListScrollPos(`down`,e-1),this._opts.activeIndex=-1;else if(n!==null){let e=n?.filteredIndex??-1;this._opts.activeIndex=n?.index??-1,e>-1&&this._adjustOptionListScrollPos(`down`,e)}}else this.open=!0,this._opts.activateDefault()}_onEscapeKeyDown(){this.open=!1}_onSlotChange(){this._setStateFromSlottedElements(),this.requestUpdate()}_onComboboxInputFocus(e){e.target.select(),this._isBeingFiltered=!1,this._opts.filterPattern=``}_onComboboxInputBlur(){this._isBeingFiltered=!1}_onComboboxInputInput(e){this._isBeingFiltered=!0,this._opts.filterPattern=e.target.value,this._opts.activeIndex=-1,this.open=!0}_onComboboxInputClick(){this._isBeingFiltered=this._opts.filterPattern!==``,this.open=!0}_onComboboxInputSpaceKeyDown(e){e.key===` `&&e.stopPropagation()}_onOptionClick(e){this._isBeingFiltered=!1}_renderCheckbox(e,t){return j`<span class=${z({"checkbox-icon":!0,checked:e})}>${Xl}</span
      ><span class="option-label">${t}</span>`}_renderOptions(){let e=this._opts.options;return j`
      <ul
        aria-label=${B(this.label??void 0)}
        aria-multiselectable=${B(this._opts.multiSelect?`true`:void 0)}
        class="options"
        id="select-listbox"
        role="listbox"
        tabindex="-1"
        @click=${this._onOptionClick}
        @mouseover=${this._onOptionMouseOver}
      >
        ${ou(e,e=>e.index,(e,t)=>{if(!e.visible)return M;let n=e.index===this._opts.activeIndex&&!e.disabled,r=this._opts.getIsIndexSelected(e.index),i={active:n,disabled:e.disabled,option:!0,"single-select":!this._opts.multiSelect,"multi-select":this._opts.multiSelect,selected:r},a=e.ranges?.length??!1?_u(e.label,e.ranges??[]):e.label;return j`
              <li
                aria-selected=${r?`true`:`false`}
                class=${z(i)}
                data-index=${e.index}
                data-filtered-index=${t}
                id=${`op-${e.index}`}
                role="option"
                tabindex="-1"
              >
                ${su(this._opts.multiSelect,()=>this._renderCheckbox(r,a),()=>a)}
              </li>
            `})}
        ${this._renderPlaceholderOption(this._opts.numOfVisibleOptions<1)}
      </ul>
    `}_renderPlaceholderOption(e){return!this.combobox||this._opts.getOptionByLabel(this._opts.filterPattern)?M:this.creatable&&this._opts.filterPattern.length>0?j`<li
        class=${z({option:!0,placeholder:!0,active:this._isPlaceholderOptionActive})}
        @mouseout=${this._onPlaceholderOptionMouseOut}
      >
        Add "${this._opts.filterPattern}"
      </li>`:e?j`<li class="no-options" @click=${this._onNoOptionsClick}>
            No options
          </li>`:M}_renderDescription(){let e=this._opts.getActiveOption();if(!e)return M;let{description:t}=e;return t?j`<div class="description">${t}</div>`:M}_renderSelectFace(){return j`${M}`}_renderComboboxFace(){return j`${M}`}_renderDropdownControls(){return j`${M}`}_renderDropdown(){let e={dropdown:!0,multiple:this._opts.multiSelect,open:this.open},t=this._isSuggestedOptionVisible||this._opts.numOfVisibleOptions===0?this._opts.numOfVisibleOptions+1:this._opts.numOfVisibleOptions,n=Math.min(t*22,220),r=this.getBoundingClientRect(),i={width:`${r.width}px`,left:`${r.left}px`,top:this.position===`below`?`${r.top+r.height}px`:`unset`,bottom:this.position===`below`?`unset`:`${document.documentElement.clientHeight-r.top}px`};return j`
      <div
        class=${z(e)}
        popover="auto"
        @toggle=${this._handleDropdownToggle}
        .style=${tl(i)}
      >
        ${this.position===`above`?this._renderDescription():M}
        <vscode-scrollable
          always-visible
          class="scrollable"
          min-thumb-size="40"
          tabindex="-1"
          @vsc-scrollable-scroll=${this._onOptionListScroll}
          .scrollPos=${this._optionListScrollPos}
          .style=${tl({height:`${n}px`})}
        >
          ${this._renderOptions()} ${this._renderDropdownControls()}
        </vscode-scrollable>
        ${this.position===`below`?this._renderDescription():M}
      </div>
    `}};G([N({type:Boolean,reflect:!0})],K.prototype,`creatable`,void 0),G([N({type:Boolean,reflect:!0})],K.prototype,`combobox`,null),G([N({reflect:!0})],K.prototype,`label`,void 0),G([N({type:Boolean,reflect:!0})],K.prototype,`disabled`,null),G([N({type:Boolean,reflect:!0})],K.prototype,`invalid`,void 0),G([N()],K.prototype,`filter`,null),G([N({type:Boolean,reflect:!0})],K.prototype,`focused`,void 0),G([N({type:Boolean,reflect:!0})],K.prototype,`open`,void 0),G([N({type:Array})],K.prototype,`options`,null),G([N({reflect:!0})],K.prototype,`position`,void 0),G([Wc({flatten:!0,selector:`vscode-option`})],K.prototype,`_assignedOptions`,void 0),G([F(`.dropdown`,!0)],K.prototype,`_dropdownEl`,void 0),G([P()],K.prototype,`_currentDescription`,void 0),G([P()],K.prototype,`_filter`,void 0),G([P()],K.prototype,`_filteredOptions`,null),G([P()],K.prototype,`_selectedIndexes`,void 0),G([P()],K.prototype,`_options`,void 0),G([P()],K.prototype,`_value`,void 0),G([P()],K.prototype,`_values`,void 0),G([P()],K.prototype,`_isPlaceholderOptionActive`,void 0),G([P()],K.prototype,`_isBeingFiltered`,void 0),G([P()],K.prototype,`_optionListScrollPos`,void 0);var bu=[R,A`
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
  `],xu=bu,Su=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Cu=class extends K{set selectedIndexes(e){this._opts.selectedIndexes=e}get selectedIndexes(){return this._opts.selectedIndexes}set value(e){this._opts.multiSelectValue=e,this._opts.selectedIndexes.length>0?this._requestedValueToSetLater=[]:this._requestedValueToSetLater=Array.isArray(e)?e:[e],this._setFormValue(),this._manageRequired()}get value(){return this._opts.multiSelectValue}get form(){return this._internals.form}get type(){return`select-multiple`}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}selectAll(){this._opts.selectAll()}selectNone(){this._opts.selectNone()}constructor(){super(),this.defaultValue=[],this.required=!1,this.name=void 0,this._requestedValueToSetLater=[],this._onOptionClick=e=>{let t=e.composedPath().find(e=>`matches`in e?e.matches(`li.option`):!1);if(!t)return;if(t.classList.contains(`placeholder`)){this._createAndSelectSuggestedOption();return}let n=Number(t.dataset.index);this._opts.toggleOptionSelected(n),this._setFormValue(),this._manageRequired(),this._dispatchChangeEvent()},this._opts.multiSelect=!0,this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this._setDefaultValue(),this._manageRequired()})}formResetCallback(){this.updateComplete.then(()=>{this.value=this.defaultValue})}formStateRestoreCallback(e,t){let n=Array.from(e.entries()).map(e=>String(e[1]));this.updateComplete.then(()=>{this.value=n})}_setDefaultValue(){Array.isArray(this.defaultValue)&&this.defaultValue.length>0&&(this.value=this.defaultValue.map(e=>String(e)))}_dispatchChangeEvent(){super._dispatchChangeEvent()}_onFaceClick(){super._onFaceClick(),this._opts.activeIndex=0}_toggleComboboxDropdown(){super._toggleComboboxDropdown(),this._opts.activeIndex=-1}_manageRequired(){let{value:e}=this;e.length===0&&this.required?this._internals.setValidity({valueMissing:!0},`Please select an item in the list.`,this._faceElement):this._internals.setValidity({})}_setFormValue(){let e=new FormData;this._values.forEach(t=>{e.append(this.name??``,t)}),this._internals.setFormValue(e)}async _createAndSelectSuggestedOption(){super._createAndSelectSuggestedOption();let e=this._createSuggestedOption();await this.updateComplete,this.selectedIndexes=[...this.selectedIndexes,e],this._dispatchChangeEvent();let t=new CustomEvent(`vsc-multi-select-create-option`,{detail:{value:this._opts.getOptionByIndex(e)?.value??``}});this.dispatchEvent(t),this.open=!1,this._isPlaceholderOptionActive=!1}_onSlotChange(){super._onSlotChange(),this._requestedValueToSetLater.length>0&&(this._opts.expandMultiSelection(this._requestedValueToSetLater),this._requestedValueToSetLater=this._requestedValueToSetLater.filter(e=>this._opts.findOptionIndex(e)===-1))}_onEnterKeyDown(e){super._onEnterKeyDown(e),this.open?this._isPlaceholderOptionActive?this._createAndSelectSuggestedOption():(this._opts.toggleActiveMultiselectOption(),this._setFormValue(),this._manageRequired(),this._dispatchChangeEvent()):(this._opts.filterPattern=``,this.open=!0)}_onMultiAcceptClick(){this.open=!1}_onMultiDeselectAllClick(){this._opts.selectedIndexes=[],this._values=[],this._options=this._options.map(e=>({...e,selected:!1})),this._manageRequired(),this._dispatchChangeEvent()}_onMultiSelectAllClick(){this._opts.selectedIndexes=[],this._values=[],this._options=this._options.map(e=>({...e,selected:!0})),this._options.forEach((e,t)=>{this._selectedIndexes.push(t),this._values.push(e.value),this._dispatchChangeEvent()}),this._setFormValue(),this._manageRequired()}_onComboboxInputBlur(){super._onComboboxInputBlur(),this._opts.filterPattern=``}_renderLabel(){switch(this._opts.selectedIndexes.length){case 0:return j`<span class="select-face-badge no-item">0 Selected</span>`;default:return j`<span class="select-face-badge"
          >${this._opts.selectedIndexes.length} Selected</span
        >`}}_renderComboboxFace(){let e=this._opts.activeIndex>-1?`op-${this._opts.activeIndex}`:``,t=this.open?`true`:`false`;return j`
      <div class="combobox-face face">
        ${this._opts.multiSelect?this._renderLabel():M}
        <input
          aria-activedescendant=${e}
          aria-autocomplete="list"
          aria-controls="select-listbox"
          aria-expanded=${t}
          aria-haspopup="listbox"
          aria-label=${B(this.label)}
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
          ${Yl}
        </button>
      </div>
    `}_renderSelectFace(){let e=this._opts.activeIndex>-1?`op-${this._opts.activeIndex}`:``,t=this.open?`true`:`false`;return j`
      <div
        aria-activedescendant=${B(this._opts.multiSelect?void 0:e)}
        aria-controls="select-listbox"
        aria-expanded=${B(this._opts.multiSelect?void 0:t)}
        aria-haspopup="listbox"
        aria-label=${B(this.label??void 0)}
        class="select-face face multiselect"
        @click=${this._onFaceClick}
        .tabIndex=${this.disabled?-1:0}
      >
        ${this._renderLabel()} ${Yl}
      </div>
    `}_renderDropdownControls(){return this._filteredOptions.length>0?j`
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
        `:j`${M}`}render(){return j`
      <div class="multi-select">
        <slot class="main-slot" @slotchange=${this._onSlotChange}></slot>
        ${this.combobox?this._renderComboboxFace():this._renderSelectFace()}
        ${this._renderDropdown()}
      </div>
    `}};Cu.styles=xu,Cu.shadowRootOptions={...Lc.shadowRootOptions,delegatesFocus:!0},Cu.formAssociated=!0,Su([N({type:Array,attribute:`default-value`})],Cu.prototype,`defaultValue`,void 0),Su([N({type:Boolean,reflect:!0})],Cu.prototype,`required`,void 0),Su([N({reflect:!0})],Cu.prototype,`name`,void 0),Su([N({type:Array,attribute:!1})],Cu.prototype,`selectedIndexes`,null),Su([N({type:Array})],Cu.prototype,`value`,null),Su([F(`.face`)],Cu.prototype,`_faceElement`,void 0),Cu=Su([L(`vscode-multi-select`)],Cu);var wu=[R,A`
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
  `],Tu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Eu=class extends I{constructor(){super(...arguments),this.ariaLabel=`Loading`,this.ariaLive=`assertive`,this.role=`alert`}render(){return j`<svg class="progress" part="progress" viewBox="0 0 16 16">
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
    </svg>`}};Eu.styles=wu,Tu([N({reflect:!0,attribute:`aria-label`})],Eu.prototype,`ariaLabel`,void 0),Tu([N({reflect:!0,attribute:`aria-live`})],Eu.prototype,`ariaLive`,void 0),Tu([N({reflect:!0})],Eu.prototype,`role`,void 0),Eu=Tu([L(`vscode-progress-ring`)],Eu);var Du=[R,A`
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
  `],Ou=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ku=class extends I{constructor(){super(...arguments),this.ariaLabel=`Loading`,this.max=100,this.indeterminate=!1,this.longRunningThreshold=15e3,this._longRunning=!1}get _isDeterminate(){return!this.indeterminate&&typeof this.value==`number`&&isFinite(this.value)}connectedCallback(){super.connectedCallback(),this._maybeStartLongRunningTimer()}disconnectedCallback(){super.disconnectedCallback(),this._clearLongRunningTimer()}willUpdate(){this._maybeStartLongRunningTimer()}render(){let e=this.max>0?this.max:100,t=this._isDeterminate?Math.min(Math.max(this.value??0,0),e):0,n=this._isDeterminate?t/e*100:0;return j`
      <div
        class=${z({container:!0,discrete:this._isDeterminate,infinite:!this._isDeterminate,"infinite-long-running":this._longRunning&&!this._isDeterminate})}
        part="container"
        role="progressbar"
        aria-label=${this.ariaLabel}
        aria-valuemin="0"
        aria-valuemax=${String(e)}
        aria-valuenow=${B(this._isDeterminate?String(Math.round(t)):void 0)}
      >
        <div class="track" part="track"></div>
        <div
          class="indicator"
          part="indicator"
          .style=${tl({width:this._isDeterminate?`${n}%`:void 0})}
        ></div>
      </div>
    `}_maybeStartLongRunningTimer(){if(!(!this._isDeterminate&&this.longRunningThreshold>0&&this.isConnected)){this._clearLongRunningTimer(),this._longRunning=!1;return}this._longRunningHandle||=setTimeout(()=>{this._longRunning=!0,this._longRunningHandle=void 0,this.requestUpdate()},this.longRunningThreshold)}_clearLongRunningTimer(){this._longRunningHandle&&=(clearTimeout(this._longRunningHandle),void 0)}};ku.styles=Du,Ou([N({reflect:!0,attribute:`aria-label`})],ku.prototype,`ariaLabel`,void 0),Ou([N({type:Number,reflect:!0})],ku.prototype,`value`,void 0),Ou([N({type:Number,reflect:!0})],ku.prototype,`max`,void 0),Ou([N({type:Boolean,reflect:!0})],ku.prototype,`indeterminate`,void 0),Ou([N({type:Number,attribute:`long-running-threshold`})],ku.prototype,`longRunningThreshold`,void 0),Ou([P()],ku.prototype,`_longRunning`,void 0),ku=Ou([L(`vscode-progress-bar`)],ku);var Au=[R,ml,A`
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
  `],ju=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Mu=class extends pl(dl){get form(){return this._internals.form}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}constructor(){super(),this.autofocus=!1,this.checked=!1,this.defaultChecked=!1,this.invalid=!1,this.name=``,this.type=`radio`,this.value=``,this.disabled=!1,this.required=!1,this.tabIndex=0,this._slottedText=``,this._handleClick=()=>{this.disabled||this.checked||(this._checkButton(),this._handleValueChange(),this.dispatchEvent(new Event(`change`,{bubbles:!0})))},this._handleKeyDown=e=>{!this.disabled&&(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),e.key===` `&&!this.checked&&(this.checked=!0,this._handleValueChange(),this.dispatchEvent(new Event(`change`,{bubbles:!0}))),e.key===`Enter`&&this._internals.form?.requestSubmit())},this._internals=this.attachInternals(),this.addEventListener(`keydown`,this._handleKeyDown),this.addEventListener(`click`,this._handleClick)}connectedCallback(){super.connectedCallback(),this._handleValueChange()}update(e){super.update(e),e.has(`checked`)&&this._handleValueChange(),e.has(`required`)&&this._handleValueChange()}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}formResetCallback(){this._getRadios().forEach(e=>{e.checked=e.defaultChecked}),this.updateComplete.then(()=>{this._handleValueChange()})}formStateRestoreCallback(e,t){this.value===e&&e!==``&&(this.checked=!0)}setComponentValidity(e){e?this._internals.setValidity({}):this._internals.setValidity({valueMissing:!0},`Please select one of these options.`,this._inputEl)}_getRadios(){let e=this.getRootNode({composed:!1});if(!e)return[];let t=e.querySelectorAll(`vscode-radio[name="${this.name}"]`);return Array.from(t)}_uncheckOthers(e){e.forEach(e=>{e!==this&&(e.checked=!1)})}_checkButton(){let e=this._getRadios();this.checked=!0,e.forEach(e=>{e!==this&&(e.checked=!1)})}_setGroupValidity(e,t){this.updateComplete.then(()=>{e.forEach(e=>{e.setComponentValidity(t)})})}_setActualFormValue(){let e=``;e=this.checked?this.value?this.value:`on`:null,this._internals.setFormValue(e)}_handleValueChange(){let e=this._getRadios(),t=e.some(e=>e.required);if(this._setActualFormValue(),this.checked)this._uncheckOthers(e),this._setGroupValidity(e,!0);else{let n=!!e.find(e=>e.checked),r=t&&!n;this._setGroupValidity(e,!r)}}render(){let e=z({icon:!0,checked:this.checked}),t=z({"label-inner":!0,"is-slot-empty":this._slottedText===``});return j`
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
    `}};Mu.styles=Au,Mu.formAssociated=!0,Mu.shadowRootOptions={...Lc.shadowRootOptions,delegatesFocus:!0},ju([N({type:Boolean,reflect:!0})],Mu.prototype,`autofocus`,void 0),ju([N({type:Boolean,reflect:!0})],Mu.prototype,`checked`,void 0),ju([N({type:Boolean,reflect:!0,attribute:`default-checked`})],Mu.prototype,`defaultChecked`,void 0),ju([N({type:Boolean,reflect:!0})],Mu.prototype,`invalid`,void 0),ju([N({reflect:!0})],Mu.prototype,`name`,void 0),ju([N()],Mu.prototype,`type`,void 0),ju([N()],Mu.prototype,`value`,void 0),ju([N({type:Boolean,reflect:!0})],Mu.prototype,`disabled`,void 0),ju([N({type:Boolean,reflect:!0})],Mu.prototype,`required`,void 0),ju([N({type:Number,reflect:!0})],Mu.prototype,`tabIndex`,void 0),ju([P()],Mu.prototype,`_slottedText`,void 0),ju([F(`#input`)],Mu.prototype,`_inputEl`,void 0),Mu=ju([L(`vscode-radio`)],Mu);var Nu=[R,A`
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
  `],Pu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Fu=class extends I{constructor(){super(),this.variant=`horizontal`,this.role=`radiogroup`,this._focusedRadio=-1,this._checkedRadio=-1,this._firstContentLoaded=!1,this._handleKeyDown=e=>{let{key:t}=e;[`ArrowLeft`,`ArrowUp`,`ArrowRight`,`ArrowDown`].includes(t)&&e.preventDefault(),(t===`ArrowRight`||t===`ArrowDown`)&&this._checkNext(),(t===`ArrowLeft`||t===`ArrowUp`)&&this._checkPrev()},this.addEventListener(`keydown`,this._handleKeyDown)}_uncheckPreviousChecked(e,t){e!==-1&&(this._radios[e].checked=!1),t!==-1&&(this._radios[t].tabIndex=-1)}_afterCheck(){this._focusedRadio=this._checkedRadio,this._radios[this._checkedRadio].checked=!0,this._radios[this._checkedRadio].tabIndex=0,this._radios[this._checkedRadio].focus()}_checkPrev(){let e=this._radios.findIndex(e=>e.checked),t=this._radios.findIndex(e=>e.focused),n=t===-1?e:t;this._uncheckPreviousChecked(e,t),n===-1?this._checkedRadio=this._radios.length-1:n-1>=0?this._checkedRadio=n-1:this._checkedRadio=this._radios.length-1,this._afterCheck()}_checkNext(){let e=this._radios.findIndex(e=>e.checked),t=this._radios.findIndex(e=>e.focused),n=t===-1?e:t;this._uncheckPreviousChecked(e,t),n===-1?this._checkedRadio=0:n+1<this._radios.length?this._checkedRadio=n+1:this._checkedRadio=0,this._afterCheck()}_handleChange(e){let t=this._radios.findIndex(t=>t===e.target);t!==-1&&(this._focusedRadio!==-1&&(this._radios[this._focusedRadio].tabIndex=-1),this._checkedRadio!==-1&&this._checkedRadio!==t&&(this._radios[this._checkedRadio].checked=!1),this._focusedRadio=t,this._checkedRadio=t,this._radios[t].tabIndex=0)}_handleSlotChange(){if(!this._firstContentLoaded){let e=this._radios.findIndex(e=>e.autofocus);e>-1&&(this._focusedRadio=e),this._firstContentLoaded=!0}let e=-1;this._radios.forEach((t,n)=>{this._focusedRadio>-1?t.tabIndex=n===this._focusedRadio?0:-1:t.tabIndex=n===0?0:-1,t.defaultChecked&&(e>-1&&(this._radios[e].defaultChecked=!1),e=n)}),e>-1&&(this._radios[e].checked=!0)}render(){return j`
      <div class="wrapper">
        <slot
          @slotchange=${this._handleSlotChange}
          @change=${this._handleChange}
        ></slot>
      </div>
    `}};Fu.styles=Nu,Pu([N({reflect:!0})],Fu.prototype,`variant`,void 0),Pu([N({reflect:!0})],Fu.prototype,`role`,void 0),Pu([Wc({selector:`vscode-radio`})],Fu.prototype,`_radios`,void 0),Pu([P()],Fu.prototype,`_focusedRadio`,void 0),Pu([P()],Fu.prototype,`_checkedRadio`,void 0),Fu=Pu([L(`vscode-radio-group`)],Fu);var Iu=bu,Lu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ru=class extends K{set selectedIndex(e){this._opts.selectedIndex=e;let t=this._opts.getOptionByIndex(e);t?(this._opts.activeIndex=e,this._value=t.value,this._internals.setFormValue(this._value),this._manageRequired()):(this._value=``,this._internals.setFormValue(``),this._manageRequired())}get selectedIndex(){return this._opts.selectedIndex}set value(e){this._opts.value=e,this._opts.selectedIndex>-1?this._requestedValueToSetLater=``:this._requestedValueToSetLater=e,this._internals.setFormValue(this._value),this._manageRequired()}get value(){return this._opts.value}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}updateInputValue(){if(!this.combobox)return;let e=this.renderRoot.querySelector(`.combobox-input`);e&&(e.value=this._opts.getSelectedOption()?.label??``)}constructor(){super(),this.defaultValue=``,this.name=void 0,this.required=!1,this._requestedValueToSetLater=``,this._opts.multiSelect=!1,this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this._manageRequired()})}formResetCallback(){this.value=this.defaultValue}formStateRestoreCallback(e,t){this.updateComplete.then(()=>{this.value=e})}get type(){return`select-one`}get form(){return this._internals.form}async _createAndSelectSuggestedOption(){let e=this._createSuggestedOption();await this.updateComplete,this._opts.selectedIndex=e,this._dispatchChangeEvent();let t=new CustomEvent(`vsc-single-select-create-option`,{detail:{value:this._opts.getOptionByIndex(e)?.value??``}});this.dispatchEvent(t),this.open=!1,this._isPlaceholderOptionActive=!1}_setStateFromSlottedElements(){super._setStateFromSlottedElements(),!this.combobox&&this._opts.selectedIndexes.length===0&&(this._opts.selectedIndex=this._opts.options.length>0?0:-1)}_onSlotChange(){if(super._onSlotChange(),this._requestedValueToSetLater){let e=this._opts.getOptionByValue(this._requestedValueToSetLater);e&&(this._opts.selectedIndex=e.index,this._requestedValueToSetLater=``)}this._opts.selectedIndex>-1&&this._opts.numOptions>0?(this._internals.setFormValue(this._opts.value),this._manageRequired()):(this._internals.setFormValue(null),this._manageRequired())}_onEnterKeyDown(e){super._onEnterKeyDown(e);let t=!1;this.combobox?this.open?this._isPlaceholderOptionActive?this._createAndSelectSuggestedOption():(t=this._opts.activeIndex!==this._opts.selectedIndex,this._opts.selectedIndex=this._opts.activeIndex,this.open=!1):(this.open=!0,this._scrollActiveElementToTop()):this.open?(t=this._opts.activeIndex!==this._opts.selectedIndex,this._opts.selectedIndex=this._opts.activeIndex,this.open=!1):(this.open=!0,this._scrollActiveElementToTop()),t&&(this._dispatchChangeEvent(),this.updateInputValue(),this._internals.setFormValue(this._opts.value),this._manageRequired())}_onOptionClick(e){super._onOptionClick(e);let t=e.composedPath().find(e=>{let t=e;if(`matches`in t)return t.matches(`li.option`)});!t||t.matches(`.disabled`)||(t.classList.contains(`placeholder`)?this.creatable&&this._createAndSelectSuggestedOption():(this._opts.selectedIndex=Number(t.dataset.index),this.open=!1,this._internals.setFormValue(this._value),this._manageRequired(),this._dispatchChangeEvent()))}_manageRequired(){let{value:e}=this;e===``&&this.required?this._internals.setValidity({valueMissing:!0},`Please select an item in the list.`,this._face):this._internals.setValidity({})}_renderSelectFace(){let e=this._opts.getSelectedOption()?.label??``;return j`
      <div
        aria-activedescendant=${this._opts.activeIndex>-1?`op-${this._opts.activeIndex}`:``}
        aria-controls="select-listbox"
        aria-expanded=${this.open?`true`:`false`}
        aria-haspopup="listbox"
        aria-label=${B(this.label)}
        class="select-face face"
        @click=${this._onFaceClick}
        role="combobox"
        tabindex="0"
      >
        <span class="text">${e}</span> ${Yl}
      </div>
    `}_renderComboboxFace(){let e=``;return e=this._isBeingFiltered?this._opts.filterPattern:this._opts.getSelectedOption()?.label??``,j`
      <div class="combobox-face face">
        <input
          aria-activedescendant=${this._opts.activeIndex>-1?`op-${this._opts.activeIndex}`:``}
          aria-autocomplete="list"
          aria-controls="select-listbox"
          aria-expanded=${this.open?`true`:`false`}
          aria-haspopup="listbox"
          aria-label=${B(this.label)}
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
          ${Yl}
        </button>
      </div>
    `}render(){return j`
      <div class="single-select">
        <slot class="main-slot" @slotchange=${this._onSlotChange}></slot>
        ${this.combobox?this._renderComboboxFace():this._renderSelectFace()}
        ${this._renderDropdown()}
      </div>
    `}};Ru.styles=Iu,Ru.shadowRootOptions={...Lc.shadowRootOptions,delegatesFocus:!0},Ru.formAssociated=!0,Lu([N({attribute:`default-value`})],Ru.prototype,`defaultValue`,void 0),Lu([N({reflect:!0})],Ru.prototype,`name`,void 0),Lu([N({type:Number,attribute:`selected-index`})],Ru.prototype,`selectedIndex`,null),Lu([N({type:String})],Ru.prototype,`value`,null),Lu([N({type:Boolean,reflect:!0})],Ru.prototype,`required`,void 0),Lu([F(`.face`)],Ru.prototype,`_face`,void 0),Ru=Lu([L(`vscode-single-select`)],Ru);var zu=[R,A`
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
  `],Bu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Vu,Hu=`50%`,Uu=4;const Wu=e=>{if(!e)return{value:0,unit:`pixel`};let t,n;return e.endsWith(`%`)?(t=`percent`,n=+e.substring(0,e.length-1)):e.endsWith(`px`)?(t=`pixel`,n=+e.substring(0,e.length-2)):(t=`pixel`,n=+e),{unit:t,value:isNaN(n)?0:n}},Gu=(e,t)=>t===0?0:Math.min(100,e/t*100),Ku=(e,t)=>t*(e/100);var qu=Vu=class extends I{set split(e){this._split!==e&&(this._split=e,this.resetHandlePosition())}get split(){return this._split}set handlePosition(e){this._rawHandlePosition=e,this._handlePositionPropChanged()}get handlePosition(){return this._rawHandlePosition}set fixedPane(e){this._fixedPane=e,this._fixedPanePropChanged()}get fixedPane(){return this._fixedPane}constructor(){super(),this._split=`vertical`,this.resetOnDblClick=!1,this.handleSize=4,this.initialHandlePosition=Hu,this._fixedPane=`none`,this._handlePosition=0,this._isDragActive=!1,this._hover=!1,this._hide=!1,this._boundRect=new DOMRect,this._handleOffset=0,this._wrapperObserved=!1,this._fixedPaneSize=0,this._handleResize=e=>{let t=e[0].contentRect,{width:n,height:r}=t;this._boundRect=t;let i=this.split===`vertical`?n:r;this.fixedPane===`start`&&(this._handlePosition=this._fixedPaneSize),this.fixedPane===`end`&&(this._handlePosition=i-this._fixedPaneSize)},this._handleMouseUp=e=>{this._isDragActive=!1,e.target!==this&&(this._hover=!1,this._hide=!0),window.removeEventListener(`mouseup`,this._handleMouseUp),window.removeEventListener(`mousemove`,this._handleMouseMove);let{width:t,height:n}=this._boundRect,r=this.split===`vertical`?t:n,i=Gu(this._handlePosition,r);this.dispatchEvent(new CustomEvent(`vsc-split-layout-change`,{detail:{position:this._handlePosition,positionInPercentage:i},composed:!0}))},this._handleMouseMove=e=>{let{clientX:t,clientY:n}=e,{left:r,top:i,height:a,width:o}=this._boundRect,s=this.split===`vertical`,c=s?o:a,l=s?t-r:n-i;this._handlePosition=Math.max(0,Math.min(l-this._handleOffset+this.handleSize/2,c)),this.fixedPane===`start`&&(this._fixedPaneSize=this._handlePosition),this.fixedPane===`end`&&(this._fixedPaneSize=c-this._handlePosition)},this._resizeObserver=new ResizeObserver(this._handleResize)}resetHandlePosition(){if(!this._wrapperEl){this._handlePosition=0;return}let{width:e,height:t}=this._wrapperEl.getBoundingClientRect(),n=this.split===`vertical`?e:t,{value:r,unit:i}=Wu(this.initialHandlePosition??Hu);i===`percent`?this._handlePosition=Ku(r,n):this._handlePosition=r}connectedCallback(){super.connectedCallback()}firstUpdated(e){this.fixedPane!==`none`&&(this._resizeObserver.observe(this._wrapperEl),this._wrapperObserved=!0),this._boundRect=this._wrapperEl.getBoundingClientRect();let{value:t,unit:n}=this.handlePosition?Wu(this.handlePosition):Wu(this.initialHandlePosition);this._setPosition(t,n),this._initFixedPane()}_handlePositionPropChanged(){if(this.handlePosition&&this._wrapperEl){this._boundRect=this._wrapperEl.getBoundingClientRect();let{value:e,unit:t}=Wu(this.handlePosition);this._setPosition(e,t)}}_fixedPanePropChanged(){this._wrapperEl&&this._initFixedPane()}_initFixedPane(){if(this.fixedPane===`none`)this._wrapperObserved&&=(this._resizeObserver.unobserve(this._wrapperEl),!1);else{let{width:e,height:t}=this._boundRect,n=this.split===`vertical`?e:t;this._fixedPaneSize=this.fixedPane===`start`?this._handlePosition:n-this._handlePosition,this._wrapperObserved||=(this._resizeObserver.observe(this._wrapperEl),!0)}}_setPosition(e,t){let{width:n,height:r}=this._boundRect,i=this.split===`vertical`?n:r;this._handlePosition=t===`percent`?Ku(e,i):e}_handleMouseOver(){this._hover=!0,this._hide=!1}_handleMouseOut(e){e.buttons!==1&&(this._hover=!1,this._hide=!0)}_handleMouseDown(e){e.stopPropagation(),e.preventDefault(),this._boundRect=this._wrapperEl.getBoundingClientRect();let{left:t,top:n}=this._boundRect,{left:r,top:i}=this._handleEl.getBoundingClientRect(),a=e.clientX-t,o=e.clientY-n;this.split===`vertical`&&(this._handleOffset=a-(r-t)),this.split===`horizontal`&&(this._handleOffset=o-(i-n)),this._isDragActive=!0,window.addEventListener(`mouseup`,this._handleMouseUp),window.addEventListener(`mousemove`,this._handleMouseMove)}_handleDblClick(){this.resetOnDblClick&&this.resetHandlePosition()}_handleSlotChange(){[...this._nestedLayoutsAtStart,...this._nestedLayoutsAtEnd].forEach(e=>{e instanceof Vu&&e.resetHandlePosition()})}render(){let{width:e,height:t}=this._boundRect,n=this.split===`vertical`?e:t,r=this.fixedPane===`none`?`${Gu(this._handlePosition,n)}%`:`${this._handlePosition}px`,i=``;i=this.fixedPane===`start`?`0 0 ${this._fixedPaneSize}px`:`1 1 ${Gu(this._handlePosition,n)}%`;let a=``;a=this.fixedPane===`end`?`0 0 ${this._fixedPaneSize}px`:`1 1 ${Gu(n-this._handlePosition,n)}%`;let o={left:this.split===`vertical`?r:`0`,top:this.split===`vertical`?`0`:r},s=this.handleSize??Uu;this.split===`vertical`&&(o.marginLeft=`${0-s/2}px`,o.width=`${s}px`),this.split===`horizontal`&&(o.height=`${s}px`,o.marginTop=`${0-s/2}px`);let c=z({"handle-overlay":!0,active:this._isDragActive,"split-vertical":this.split===`vertical`,"split-horizontal":this.split===`horizontal`}),l=z({handle:!0,hover:this._hover,hide:this._hide,"split-vertical":this.split===`vertical`,"split-horizontal":this.split===`horizontal`});return j`
      <div class=${z({wrapper:!0,horizontal:this.split===`horizontal`})}>
        <div class="start" .style=${tl({flex:i})}>
          <slot name="start" @slotchange=${this._handleSlotChange}></slot>
        </div>
        <div class="end" .style=${tl({flex:a})}>
          <slot name="end" @slotchange=${this._handleSlotChange}></slot>
        </div>
        <div class=${c}></div>
        <div
          class=${l}
          .style=${tl(o)}
          @mouseover=${this._handleMouseOver}
          @mouseout=${this._handleMouseOut}
          @mousedown=${this._handleMouseDown}
          @dblclick=${this._handleDblClick}
        ></div>
      </div>
    `}};qu.styles=zu,Bu([N({reflect:!0})],qu.prototype,`split`,null),Bu([N({type:Boolean,reflect:!0,attribute:`reset-on-dbl-click`})],qu.prototype,`resetOnDblClick`,void 0),Bu([N({type:Number,reflect:!0,attribute:`handle-size`})],qu.prototype,`handleSize`,void 0),Bu([N({reflect:!0,attribute:`initial-handle-position`})],qu.prototype,`initialHandlePosition`,void 0),Bu([N({attribute:`handle-position`})],qu.prototype,`handlePosition`,null),Bu([N({attribute:`fixed-pane`})],qu.prototype,`fixedPane`,null),Bu([P()],qu.prototype,`_handlePosition`,void 0),Bu([P()],qu.prototype,`_isDragActive`,void 0),Bu([P()],qu.prototype,`_hover`,void 0),Bu([P()],qu.prototype,`_hide`,void 0),Bu([F(`.wrapper`)],qu.prototype,`_wrapperEl`,void 0),Bu([F(`.handle`)],qu.prototype,`_handleEl`,void 0),Bu([Wc({slot:`start`,selector:`vscode-split-layout`})],qu.prototype,`_nestedLayoutsAtStart`,void 0),Bu([Wc({slot:`end`,selector:`vscode-split-layout`})],qu.prototype,`_nestedLayoutsAtEnd`,void 0),qu=Vu=Bu([L(`vscode-split-layout`)],qu);var Ju=[R,A`
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
  `],Yu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Xu=class extends I{constructor(){super(...arguments),this.active=!1,this.ariaControls=``,this.panel=!1,this.role=`tab`,this.tabId=-1}attributeChangedCallback(e,t,n){if(super.attributeChangedCallback(e,t,n),e===`active`){let e=n!==null;this.ariaSelected=e?`true`:`false`,this.tabIndex=e?0:-1}}render(){return j`
      <div
        class=${z({wrapper:!0,active:this.active,panel:this.panel})}
      >
        <div class="before"><slot name="content-before"></slot></div>
        <div class="main"><slot></slot></div>
        <div class="after"><slot name="content-after"></slot></div>
        <span
          class=${z({"active-indicator":!0,active:this.active,panel:this.panel})}
        ></span>
      </div>
    `}};Xu.styles=Ju,Yu([N({type:Boolean,reflect:!0})],Xu.prototype,`active`,void 0),Yu([N({reflect:!0,attribute:`aria-controls`})],Xu.prototype,`ariaControls`,void 0),Yu([N({type:Boolean,reflect:!0})],Xu.prototype,`panel`,void 0),Yu([N({reflect:!0})],Xu.prototype,`role`,void 0),Yu([N({type:Number,reflect:!0,attribute:`tab-id`})],Xu.prototype,`tabId`,void 0),Xu=Yu([L(`vscode-tab-header`)],Xu);var Zu=[R,A`
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
  `],Qu=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},$u=class extends I{constructor(){super(...arguments),this.hidden=!1,this.ariaLabelledby=``,this.panel=!1,this.role=`tabpanel`,this.tabIndex=0}render(){return j` <slot></slot> `}};$u.styles=Zu,Qu([N({type:Boolean,reflect:!0})],$u.prototype,`hidden`,void 0),Qu([N({reflect:!0,attribute:`aria-labelledby`})],$u.prototype,`ariaLabelledby`,void 0),Qu([N({type:Boolean,reflect:!0})],$u.prototype,`panel`,void 0),Qu([N({reflect:!0})],$u.prototype,`role`,void 0),Qu([N({type:Number,reflect:!0})],$u.prototype,`tabIndex`,void 0),$u=Qu([L(`vscode-tab-panel`)],$u);var ed=[R,A`
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
  `],td=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},nd=class extends I{constructor(){super(...arguments),this.role=`rowgroup`}render(){return j` <slot></slot> `}};nd.styles=ed,td([N({reflect:!0})],nd.prototype,`role`,void 0),nd=td([L(`vscode-table-body`)],nd);var rd=[R,A`
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
  `],id=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ad=class extends I{constructor(){super(...arguments),this.role=`cell`,this.columnLabel=``,this.compact=!1}render(){return j`
      <div class="wrapper">
        ${this.columnLabel?j`<div class="column-label" role="presentation">
          ${this.columnLabel}
        </div>`:M}
        <slot></slot>
      </div>
    `}};ad.styles=rd,id([N({reflect:!0})],ad.prototype,`role`,void 0),id([N({attribute:`column-label`})],ad.prototype,`columnLabel`,void 0),id([N({type:Boolean,reflect:!0})],ad.prototype,`compact`,void 0),ad=id([L(`vscode-table-cell`)],ad);var od=[R,A`
    :host {
      background-color: var(
        --vscode-keybindingTable-headerBackground,
        rgba(204, 204, 204, 0.04)
      );
      display: table;
      table-layout: fixed;
      width: 100%;
    }
  `],sd=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},cd=class extends I{constructor(){super(...arguments),this.role=`rowgroup`}render(){return j` <slot></slot> `}};cd.styles=od,sd([N({reflect:!0})],cd.prototype,`role`,void 0),cd=sd([L(`vscode-table-header`)],cd);var ld=[R,A`
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
  `],ud=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},dd=class extends I{constructor(){super(...arguments),this.role=`columnheader`}render(){return j`
      <div class="wrapper">
        <slot></slot>
      </div>
    `}};dd.styles=ld,ud([N({reflect:!0})],dd.prototype,`role`,void 0),dd=ud([L(`vscode-table-header-cell`)],dd);var fd=[R,A`
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
  `],pd=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},md=class extends I{constructor(){super(...arguments),this.role=`row`}render(){return j` <slot></slot> `}};md.styles=fd,pd([N({reflect:!0})],md.prototype,`role`,void 0),md=pd([L(`vscode-table-row`)],md);const hd=(e,t)=>typeof e==`number`&&!Number.isNaN(e)?e/t*100:typeof e==`string`&&/^[0-9.]+$/.test(e)?Number(e)/t*100:typeof e==`string`&&/^[0-9.]+%$/.test(e)?Number(e.substring(0,e.length-1)):typeof e==`string`&&/^[0-9.]+px$/.test(e)?Number(e.substring(0,e.length-2))/t*100:null;var gd=[R,A`
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
  `],q=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},_d=100,J=class extends I{constructor(){super(...arguments),this.role=`table`,this.resizable=!1,this.responsive=!1,this.bordered=!1,this.borderedColumns=!1,this.borderedRows=!1,this.breakpoint=300,this.minColumnWidth=`50px`,this.delayedResizing=!1,this.compact=!1,this.zebra=!1,this.zebraOdd=!1,this._sashPositions=[],this._isDragging=!1,this._sashHovers=[],this._columns=[],this._activeSashElementIndex=-1,this._activeSashCursorOffset=0,this._componentX=0,this._componentH=0,this._componentW=0,this._headerCells=[],this._cellsOfFirstRow=[],this._prevHeaderHeight=0,this._prevComponentHeight=0,this._componentResizeObserverCallback=()=>{this._memoizeComponentDimensions(),this._updateResizeHandlersSize(),this.responsive&&this._toggleCompactView(),this._resizeTableBody()},this._headerResizeObserverCallback=()=>{this._updateResizeHandlersSize()},this._bodyResizeObserverCallback=()=>{this._resizeTableBody()},this._onResizingMouseMove=e=>{e.stopPropagation(),this._updateActiveSashPosition(e.pageX),this.delayedResizing?this._resizeColumns(!1):this._resizeColumns(!0)},this._onResizingMouseUp=e=>{this._resizeColumns(!0),this._updateActiveSashPosition(e.pageX),this._sashHovers[this._activeSashElementIndex]=!1,this._isDragging=!1,this._activeSashElementIndex=-1,document.removeEventListener(`mousemove`,this._onResizingMouseMove),document.removeEventListener(`mouseup`,this._onResizingMouseUp)}}set columns(e){this._columns=e,this.isConnected&&this._initDefaultColumnSizes()}get columns(){return this._columns}connectedCallback(){super.connectedCallback(),this._memoizeComponentDimensions(),this._initDefaultColumnSizes()}disconnectedCallback(){super.disconnectedCallback(),this._componentResizeObserver?.unobserve(this),this._componentResizeObserver?.disconnect(),this._bodyResizeObserver?.disconnect()}_px2Percent(e){return e/this._componentW*100}_percent2Px(e){return this._componentW*e/100}_memoizeComponentDimensions(){let e=this.getBoundingClientRect();this._componentH=e.height,this._componentW=e.width,this._componentX=e.x}_queryHeaderCells(){let e=this._assignedHeaderElements;return e&&e[0]?Array.from(e[0].querySelectorAll(`vscode-table-header-cell`)):[]}_getHeaderCells(){return this._headerCells.length||(this._headerCells=this._queryHeaderCells()),this._headerCells}_queryCellsOfFirstRow(){let e=this._assignedBodyElements;return e&&e[0]?Array.from(e[0].querySelectorAll(`vscode-table-row:first-child vscode-table-cell`)):[]}_getCellsOfFirstRow(){return this._cellsOfFirstRow.length||(this._cellsOfFirstRow=this._queryCellsOfFirstRow()),this._cellsOfFirstRow}_resizeTableBody(){let e=0,t=0,n=this.getBoundingClientRect().height;this._assignedHeaderElements&&this._assignedHeaderElements.length&&(e=this._assignedHeaderElements[0].getBoundingClientRect().height),this._assignedBodyElements&&this._assignedBodyElements.length&&(t=this._assignedBodyElements[0].getBoundingClientRect().height);let r=t-e-n;this._scrollableElement.style.height=r>0?`${n-e}px`:`auto`}_initResizeObserver(){this._componentResizeObserver=new ResizeObserver(this._componentResizeObserverCallback),this._componentResizeObserver.observe(this),this._headerResizeObserver=new ResizeObserver(this._headerResizeObserverCallback),this._headerResizeObserver.observe(this._headerElement)}_calcColWidthPercentages(){let e=this._getHeaderCells().length,t=this.columns.slice(0,e),n=t.filter(e=>e===`auto`).length+e-t.length,r=100;if(t=t.map(e=>{let t=hd(e,this._componentW);return t===null?`auto`:(r-=t,t)}),t.length<e)for(let n=t.length;n<e;n++)t.push(`auto`);return t=t.map(e=>e===`auto`?r/n:e),t}_initHeaderCellSizes(e){this._getHeaderCells().forEach((t,n)=>{t.style.width=`${e[n]}%`})}_initBodyColumnSizes(e){this._getCellsOfFirstRow().forEach((t,n)=>{t.style.width=`${e[n]}%`})}_initSashes(e){let t=e.length,n=0;this._sashPositions=[],e.forEach((e,r)=>{if(r<t-1){let t=n+e;this._sashPositions.push(t),n=t}})}_initDefaultColumnSizes(){let e=this._calcColWidthPercentages();this._initHeaderCellSizes(e),this._initBodyColumnSizes(e),this._initSashes(e)}_updateResizeHandlersSize(){let e=this._headerElement.getBoundingClientRect();if(e.height===this._prevHeaderHeight&&this._componentH===this._prevComponentHeight)return;this._prevHeaderHeight=e.height,this._prevComponentHeight=this._componentH;let t=this._componentH-e.height;this._sashVisibleElements.forEach(n=>{n.style.height=`${t}px`,n.style.top=`${e.height}px`})}_applyCompactViewColumnLabels(){let e=this._getHeaderCells().map(e=>e.innerText);this.querySelectorAll(`vscode-table-row`).forEach(t=>{t.querySelectorAll(`vscode-table-cell`).forEach((t,n)=>{t.columnLabel=e[n],t.compact=!0})})}_clearCompactViewColumnLabels(){this.querySelectorAll(`vscode-table-cell`).forEach(e=>{e.columnLabel=``,e.compact=!1})}_toggleCompactView(){let e=this.getBoundingClientRect().width<this.breakpoint;this.compact!==e&&(this.compact=e,e?this._applyCompactViewColumnLabels():this._clearCompactViewColumnLabels())}_onDefaultSlotChange(){this._assignedElements.forEach(e=>{if(e.tagName.toLowerCase()===`vscode-table-header`){e.slot=`header`;return}if(e.tagName.toLowerCase()===`vscode-table-body`){e.slot=`body`;return}})}_onHeaderSlotChange(){this._headerCells=this._queryHeaderCells()}_onBodySlotChange(){if(this._initDefaultColumnSizes(),this._initResizeObserver(),this._updateResizeHandlersSize(),!this._bodyResizeObserver){let e=this._assignedBodyElements[0]??null;e&&(this._bodyResizeObserver=new ResizeObserver(this._bodyResizeObserverCallback),this._bodyResizeObserver.observe(e))}}_onSashMouseOver(e){if(this._isDragging)return;let t=e.currentTarget,n=Number(t.dataset.index);this._sashHovers[n]=!0,this.requestUpdate()}_onSashMouseOut(e){if(e.stopPropagation(),this._isDragging)return;let t=e.currentTarget,n=Number(t.dataset.index);this._sashHovers[n]=!1,this.requestUpdate()}_onSashMouseDown(e){e.stopPropagation();let{pageX:t,currentTarget:n}=e,r=n,i=Number(r.dataset.index),a=r.getBoundingClientRect().x;this._isDragging=!0,this._activeSashElementIndex=i,this._sashHovers[this._activeSashElementIndex]=!0,this._activeSashCursorOffset=this._px2Percent(t-a);let o=this._getHeaderCells();this._headerCellsToResize=[],this._headerCellsToResize.push(o[i]),o[i+1]&&(this._headerCellsToResize[1]=o[i+1]);let s=this._bodySlot.assignedElements()[0].querySelectorAll(`vscode-table-row:first-child > vscode-table-cell`);this._cellsToResize=[],this._cellsToResize.push(s[i]),s[i+1]&&this._cellsToResize.push(s[i+1]),document.addEventListener(`mousemove`,this._onResizingMouseMove),document.addEventListener(`mouseup`,this._onResizingMouseUp)}_updateActiveSashPosition(e){let{prevSashPos:t,nextSashPos:n}=this._getSashPositions(),r=hd(this.minColumnWidth,this._componentW);r===null&&(r=0);let i=t?t+r:r,a=n?n-r:_d-r,o=this._px2Percent(e-this._componentX-this._percent2Px(this._activeSashCursorOffset));o=Math.max(o,i),o=Math.min(o,a),this._sashPositions[this._activeSashElementIndex]=o,this.requestUpdate()}_getSashPositions(){return{sashPos:this._sashPositions[this._activeSashElementIndex],prevSashPos:this._sashPositions[this._activeSashElementIndex-1]||0,nextSashPos:this._sashPositions[this._activeSashElementIndex+1]||_d}}_resizeColumns(e=!0){let{sashPos:t,prevSashPos:n,nextSashPos:r}=this._getSashPositions(),i=t-n,a=r-t,o=`${i}%`,s=`${a}%`;this._headerCellsToResize[0].style.width=o,this._headerCellsToResize[1]&&(this._headerCellsToResize[1].style.width=s),e&&this._cellsToResize[0]&&(this._cellsToResize[0].style.width=o,this._cellsToResize[1]&&(this._cellsToResize[1].style.width=s))}render(){let e=this._sashPositions.map((e,t)=>{let n=z({sash:!0,hover:this._sashHovers[t],resizable:this.resizable}),r=`${e}%`;return this.resizable?j`
            <div
              class=${n}
              data-index=${t}
              .style=${tl({left:r})}
              @mousedown=${this._onSashMouseDown}
              @mouseover=${this._onSashMouseOver}
              @mouseout=${this._onSashMouseOut}
            >
              <div class="sash-visible"></div>
              <div class="sash-clickable"></div>
            </div>
          `:j`<div
            class=${n}
            data-index=${t}
            .style=${tl({left:r})}
          >
            <div class="sash-visible"></div>
          </div>`});return j`
      <div class=${z({wrapper:!0,"select-disabled":this._isDragging,"resize-cursor":this._isDragging,"compact-view":this.compact})}>
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
    `}};J.styles=gd,q([N({reflect:!0})],J.prototype,`role`,void 0),q([N({type:Boolean,reflect:!0})],J.prototype,`resizable`,void 0),q([N({type:Boolean,reflect:!0})],J.prototype,`responsive`,void 0),q([N({type:Boolean,reflect:!0})],J.prototype,`bordered`,void 0),q([N({type:Boolean,reflect:!0,attribute:`bordered-columns`})],J.prototype,`borderedColumns`,void 0),q([N({type:Boolean,reflect:!0,attribute:`bordered-rows`})],J.prototype,`borderedRows`,void 0),q([N({type:Number})],J.prototype,`breakpoint`,void 0),q([N({type:Array})],J.prototype,`columns`,null),q([N({attribute:`min-column-width`})],J.prototype,`minColumnWidth`,void 0),q([N({type:Boolean,reflect:!0,attribute:`delayed-resizing`})],J.prototype,`delayedResizing`,void 0),q([N({type:Boolean,reflect:!0})],J.prototype,`compact`,void 0),q([N({type:Boolean,reflect:!0})],J.prototype,`zebra`,void 0),q([N({type:Boolean,reflect:!0,attribute:`zebra-odd`})],J.prototype,`zebraOdd`,void 0),q([F(`slot[name="body"]`)],J.prototype,`_bodySlot`,void 0),q([F(`.header`)],J.prototype,`_headerElement`,void 0),q([F(`.scrollable`)],J.prototype,`_scrollableElement`,void 0),q([Uc(`.sash-visible`)],J.prototype,`_sashVisibleElements`,void 0),q([Wc({flatten:!0,selector:`vscode-table-header, vscode-table-body`})],J.prototype,`_assignedElements`,void 0),q([Wc({slot:`header`,flatten:!0,selector:`vscode-table-header`})],J.prototype,`_assignedHeaderElements`,void 0),q([Wc({slot:`body`,flatten:!0,selector:`vscode-table-body`})],J.prototype,`_assignedBodyElements`,void 0),q([P()],J.prototype,`_sashPositions`,void 0),q([P()],J.prototype,`_isDragging`,void 0),J=q([L(`vscode-table`)],J);var vd=[R,A`
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
  `],yd=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},bd=class extends I{constructor(){super(),this.panel=!1,this.selectedIndex=0,this._tabHeaders=[],this._tabPanels=[],this._componentId=``,this._tabFocus=0,this._componentId=Gl()}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),e===`selected-index`&&this._setActiveTab(),e===`panel`&&(this._tabHeaders.forEach(e=>e.panel=n!==null),this._tabPanels.forEach(e=>e.panel=n!==null))}_dispatchSelectEvent(){this.dispatchEvent(new CustomEvent(`vsc-tabs-select`,{detail:{selectedIndex:this.selectedIndex},composed:!0}))}_setActiveTab(){this._tabFocus=this.selectedIndex,this._tabPanels.forEach((e,t)=>{e.hidden=t!==this.selectedIndex}),this._tabHeaders.forEach((e,t)=>{e.active=t===this.selectedIndex})}_focusPrevTab(){this._tabFocus===0?this._tabFocus=this._tabHeaders.length-1:--this._tabFocus}_focusNextTab(){this._tabFocus===this._tabHeaders.length-1?this._tabFocus=0:this._tabFocus+=1}_onHeaderKeyDown(e){(e.key===`ArrowLeft`||e.key===`ArrowRight`)&&(e.preventDefault(),this._tabHeaders[this._tabFocus].setAttribute(`tabindex`,`-1`),e.key===`ArrowLeft`?this._focusPrevTab():e.key===`ArrowRight`&&this._focusNextTab(),this._tabHeaders[this._tabFocus].setAttribute(`tabindex`,`0`),this._tabHeaders[this._tabFocus].focus()),e.key===`Enter`&&(e.preventDefault(),this.selectedIndex=this._tabFocus,this._dispatchSelectEvent())}_moveHeadersToHeaderSlot(){let e=this._mainSlotElements.filter(e=>e instanceof Xu);e.length>0&&e.forEach(e=>e.setAttribute(`slot`,`header`))}_onMainSlotChange(){this._moveHeadersToHeaderSlot(),this._tabPanels=this._mainSlotElements.filter(e=>e instanceof $u),this._tabPanels.forEach((e,t)=>{e.ariaLabelledby=`t${this._componentId}-h${t}`,e.id=`t${this._componentId}-p${t}`,e.panel=this.panel}),this._setActiveTab()}_onHeaderSlotChange(){this._tabHeaders=this._headerSlotElements.filter(e=>e instanceof Xu),this._tabHeaders.forEach((e,t)=>{e.tabId=t,e.id=`t${this._componentId}-h${t}`,e.ariaControls=`t${this._componentId}-p${t}`,e.panel=this.panel,e.active=t===this.selectedIndex})}_onHeaderClick(e){let t=e.composedPath().find(e=>e instanceof Xu);t&&(this.selectedIndex=t.tabId,this._setActiveTab(),this._dispatchSelectEvent())}render(){return j`
      <div
        class=${z({header:!0,panel:this.panel})}
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
    `}};bd.styles=vd,yd([N({type:Boolean,reflect:!0})],bd.prototype,`panel`,void 0),yd([N({type:Number,reflect:!0,attribute:`selected-index`})],bd.prototype,`selectedIndex`,void 0),yd([Wc({slot:`header`})],bd.prototype,`_headerSlotElements`,void 0),yd([Wc()],bd.prototype,`_mainSlotElements`,void 0),bd=yd([L(`vscode-tabs`)],bd);var xd=[R,A`
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
  `],Y=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},X=class extends I{set value(e){this._value=e,this._internals.setFormValue(e)}get value(){return this._value}get wrappedElement(){return this._textareaEl}get form(){return this._internals.form}get type(){return`textarea`}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}set minlength(e){this.minLength=e}get minlength(){return this.minLength}set maxlength(e){this.maxLength=e}get maxlength(){return this.maxLength}constructor(){super(),this.autocomplete=void 0,this.autofocus=!1,this.defaultValue=``,this.disabled=!1,this.invalid=!1,this.label=``,this.maxLength=void 0,this.minLength=void 0,this.rows=void 0,this.cols=void 0,this.name=void 0,this.placeholder=void 0,this.readonly=!1,this.resize=`none`,this.required=!1,this.spellcheck=!1,this.monospace=!1,this._value=``,this._textareaPointerCursor=!1,this._shadow=!1,this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this._textareaEl.checkValidity(),this._setValidityFromInput(),this._internals.setFormValue(this._textareaEl.value)})}updated(e){let t=[`maxLength`,`minLength`,`required`];for(let n of e.keys())if(t.includes(String(n))){this.updateComplete.then(()=>{this._setValidityFromInput()});break}}formResetCallback(){this.value=this.defaultValue}formStateRestoreCallback(e,t){this.updateComplete.then(()=>{this._value=e})}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}_setValidityFromInput(){this._internals.setValidity(this._textareaEl.validity,this._textareaEl.validationMessage,this._textareaEl)}_dataChanged(){this._value=this._textareaEl.value,this._internals.setFormValue(this._textareaEl.value)}_handleChange(){this._dataChanged(),this._setValidityFromInput(),this.dispatchEvent(new Event(`change`))}_handleInput(){this._dataChanged(),this._setValidityFromInput()}_handleMouseMove(e){if(this._textareaEl.clientHeight>=this._textareaEl.scrollHeight){this._textareaPointerCursor=!1;return}let t=this._textareaEl.getBoundingClientRect();this._textareaPointerCursor=e.clientX>=t.left+t.width-14-2}_handleScroll(){this._shadow=this._textareaEl.scrollTop>0}render(){return j`
      <div
        class=${z({shadow:!0,visible:this._shadow})}
      ></div>
      <textarea
        autocomplete=${B(this.autocomplete)}
        ?autofocus=${this.autofocus}
        ?disabled=${this.disabled}
        aria-label=${this.label}
        id="textarea"
        class=${z({monospace:this.monospace,"cursor-pointer":this._textareaPointerCursor})}
        maxlength=${B(this.maxLength)}
        minlength=${B(this.minLength)}
        rows=${B(this.rows)}
        cols=${B(this.cols)}
        name=${B(this.name)}
        placeholder=${B(this.placeholder)}
        ?readonly=${this.readonly}
        .style=${tl({resize:this.resize})}
        ?required=${this.required}
        spellcheck=${this.spellcheck}
        @change=${this._handleChange}
        @input=${this._handleInput}
        @mousemove=${this._handleMouseMove}
        @scroll=${this._handleScroll}
        .value=${this._value}
      ></textarea>
    `}};X.styles=xd,X.formAssociated=!0,X.shadowRootOptions={...Lc.shadowRootOptions,delegatesFocus:!0},Y([N()],X.prototype,`autocomplete`,void 0),Y([N({type:Boolean,reflect:!0})],X.prototype,`autofocus`,void 0),Y([N({attribute:`default-value`})],X.prototype,`defaultValue`,void 0),Y([N({type:Boolean,reflect:!0})],X.prototype,`disabled`,void 0),Y([N({type:Boolean,reflect:!0})],X.prototype,`invalid`,void 0),Y([N({attribute:!1})],X.prototype,`label`,void 0),Y([N({type:Number})],X.prototype,`maxLength`,void 0),Y([N({type:Number})],X.prototype,`minLength`,void 0),Y([N({type:Number})],X.prototype,`rows`,void 0),Y([N({type:Number})],X.prototype,`cols`,void 0),Y([N()],X.prototype,`name`,void 0),Y([N()],X.prototype,`placeholder`,void 0),Y([N({type:Boolean,reflect:!0})],X.prototype,`readonly`,void 0),Y([N()],X.prototype,`resize`,void 0),Y([N({type:Boolean,reflect:!0})],X.prototype,`required`,void 0),Y([N({type:Boolean})],X.prototype,`spellcheck`,void 0),Y([N({type:Boolean,reflect:!0})],X.prototype,`monospace`,void 0),Y([N()],X.prototype,`value`,null),Y([F(`#textarea`)],X.prototype,`_textareaEl`,void 0),Y([P()],X.prototype,`_value`,void 0),Y([P()],X.prototype,`_textareaPointerCursor`,void 0),Y([P()],X.prototype,`_shadow`,void 0),X=Y([L(`vscode-textarea`)],X);var Sd=Ns(Jc()),Cd=[R,A`
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
      font-family: var(--vscode-font-family, ${Sd});
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
      font-family: var(--vscode-font-family, ${Sd});
      font-size: var(--vscode-font-size, 13px);
      font-weight: var(--vscode-font-weight, 'normal');
      line-height: 20px;
      padding: 0 14px;
    }

    input[type='file']::file-selector-button:hover {
      background-color: var(--vscode-button-hoverBackground, #026ec1);
    }
  `],Z=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Q=class extends I{set type(e){this._type=[`color`,`date`,`datetime-local`,`email`,`file`,`month`,`number`,`password`,`search`,`tel`,`text`,`time`,`url`,`week`].includes(e)?e:`text`}get type(){return this._type}set value(e){this.type!==`file`&&(this._value=e,this._internals.setFormValue(e)),this.updateComplete.then(()=>{this._setValidityFromInput()})}get value(){return this._value}set minlength(e){this.minLength=e}get minlength(){return this.minLength}set maxlength(e){this.maxLength=e}get maxlength(){return this.maxLength}get form(){return this._internals.form}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._setValidityFromInput(),this._internals.checkValidity()}reportValidity(){return this._setValidityFromInput(),this._internals.reportValidity()}get wrappedElement(){return this._inputEl}constructor(){super(),this.autocomplete=void 0,this.autofocus=!1,this.defaultValue=``,this.disabled=!1,this.focused=!1,this.invalid=!1,this.label=``,this.max=void 0,this.maxLength=void 0,this.min=void 0,this.minLength=void 0,this.multiple=!1,this.name=void 0,this.pattern=void 0,this.placeholder=void 0,this.readonly=!1,this.required=!1,this.step=void 0,this._value=``,this._type=`text`,this._internals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this._inputEl.checkValidity(),this._setValidityFromInput(),this._internals.setFormValue(this._inputEl.value)})}attributeChangedCallback(e,t,n){super.attributeChangedCallback(e,t,n),[`max`,`maxlength`,`min`,`minlength`,`pattern`,`required`,`step`].includes(e)&&this.updateComplete.then(()=>{this._setValidityFromInput()})}formResetCallback(){this.value=this.defaultValue,this.requestUpdate()}formStateRestoreCallback(e,t){this.value=e}_dataChanged(){if(this._value=this._inputEl.value,this.type===`file`&&this._inputEl.files)for(let e of this._inputEl.files)this._internals.setFormValue(e);else this._internals.setFormValue(this._inputEl.value)}_setValidityFromInput(){this._inputEl&&this._internals.setValidity(this._inputEl.validity,this._inputEl.validationMessage,this._inputEl)}_onInput(){this._dataChanged(),this._setValidityFromInput()}_onChange(){this._dataChanged(),this._setValidityFromInput(),this.dispatchEvent(new Event(`change`))}_onFocus(){this.focused=!0}_onBlur(){this.focused=!1}_onKeyDown(e){e.key===`Enter`&&this._internals.form&&this._internals.form?.requestSubmit()}render(){return j`
      <div class="root">
        <slot name="content-before"></slot>
        <input
          id="input"
          type=${this.type}
          ?autofocus=${this.autofocus}
          autocomplete=${B(this.autocomplete)}
          aria-label=${this.label}
          ?disabled=${this.disabled}
          max=${B(this.max)}
          maxlength=${B(this.maxLength)}
          min=${B(this.min)}
          minlength=${B(this.minLength)}
          ?multiple=${this.multiple}
          name=${B(this.name)}
          pattern=${B(this.pattern)}
          placeholder=${B(this.placeholder)}
          ?readonly=${this.readonly}
          ?required=${this.required}
          step=${B(this.step)}
          .value=${this._value}
          @blur=${this._onBlur}
          @change=${this._onChange}
          @focus=${this._onFocus}
          @input=${this._onInput}
          @keydown=${this._onKeyDown}
        >
        <slot name="content-after"></slot>
      </div>
    `}};Q.styles=Cd,Q.formAssociated=!0,Q.shadowRootOptions={...Lc.shadowRootOptions,delegatesFocus:!0},Z([N()],Q.prototype,`autocomplete`,void 0),Z([N({type:Boolean,reflect:!0})],Q.prototype,`autofocus`,void 0),Z([N({attribute:`default-value`})],Q.prototype,`defaultValue`,void 0),Z([N({type:Boolean,reflect:!0})],Q.prototype,`disabled`,void 0),Z([N({type:Boolean,reflect:!0})],Q.prototype,`focused`,void 0),Z([N({type:Boolean,reflect:!0})],Q.prototype,`invalid`,void 0),Z([N({attribute:!1})],Q.prototype,`label`,void 0),Z([N({type:Number})],Q.prototype,`max`,void 0),Z([N({type:Number})],Q.prototype,`maxLength`,void 0),Z([N({type:Number})],Q.prototype,`min`,void 0),Z([N({type:Number})],Q.prototype,`minLength`,void 0),Z([N({type:Boolean,reflect:!0})],Q.prototype,`multiple`,void 0),Z([N({reflect:!0})],Q.prototype,`name`,void 0),Z([N()],Q.prototype,`pattern`,void 0),Z([N()],Q.prototype,`placeholder`,void 0),Z([N({type:Boolean,reflect:!0})],Q.prototype,`readonly`,void 0),Z([N({type:Boolean,reflect:!0})],Q.prototype,`required`,void 0),Z([N({type:Number})],Q.prototype,`step`,void 0),Z([N({reflect:!0})],Q.prototype,`type`,null),Z([N()],Q.prototype,`value`,null),Z([F(`#input`)],Q.prototype,`_inputEl`,void 0),Z([P()],Q.prototype,`_value`,void 0),Z([P()],Q.prototype,`_type`,void 0),Q=Z([L(`vscode-textfield`)],Q);var wd=[R,A`
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
  `],Td=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ed=class extends I{constructor(){super(...arguments),this.icon=``,this.label=void 0,this.toggleable=!1,this.checked=!1,this._isSlotEmpty=!0}_handleSlotChange(){this._isSlotEmpty=!((this._assignedNodes?.length??0)>0)}_handleButtonClick(){this.toggleable&&(this.checked=!this.checked,this.dispatchEvent(new Event(`change`)))}render(){let e=this.checked?`true`:`false`;return j`
      <button
        type="button"
        aria-label=${B(this.label)}
        role=${B(this.toggleable?`switch`:void 0)}
        aria-checked=${B(this.toggleable?e:void 0)}
        class=${z({checked:this.toggleable&&this.checked})}
        @click=${this._handleButtonClick}
      >
        ${this.icon?j`<vscode-icon name=${this.icon}></vscode-icon>`:M}
        <slot
          @slotchange=${this._handleSlotChange}
          class=${z({empty:this._isSlotEmpty,textOnly:!this.icon})}
        ></slot>
      </button>
    `}};Ed.styles=wd,Td([N({reflect:!0})],Ed.prototype,`icon`,void 0),Td([N()],Ed.prototype,`label`,void 0),Td([N({type:Boolean,reflect:!0})],Ed.prototype,`toggleable`,void 0),Td([N({type:Boolean,reflect:!0})],Ed.prototype,`checked`,void 0),Td([P()],Ed.prototype,`_isSlotEmpty`,void 0),Td([Gc()],Ed.prototype,`_assignedNodes`,void 0),Ed=Td([L(`vscode-toolbar-button`)],Ed);var Dd=[R,A`
    :host {
      display: block;
    }

    div {
      gap: 4px;
      display: flex;
      align-items: center;
    }
  `],Od=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},kd=class extends I{render(){return j`<div><slot></slot></div>`}};kd.styles=Dd,kd=Od([L(`vscode-toolbar-container`)],kd);var Ad=class extends Event{constructor(e,t,n,r){super(`context-request`,{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t,this.callback=n,this.subscribe=r??!1}};function jd(e){return e}var Md=class{constructor(e,t,n,r){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(e,t)=>{this.unsubscribe&&(this.unsubscribe!==t&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=e,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(e,t)),this.unsubscribe=t},this.host=e,t.context!==void 0){let e=t;this.context=e.context,this.callback=e.callback,this.subscribe=e.subscribe??!1}else this.context=t,this.callback=n,this.subscribe=r??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&=(this.unsubscribe(),void 0)}dispatchRequest(){this.host.dispatchEvent(new Ad(this.context,this.host,this.t,this.subscribe))}},Nd=class{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,t=!1){let n=t||!Object.is(e,this.o);this.o=e,n&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(let[e,{disposer:t}]of this.subscriptions)e(this.o,t)},e!==void 0&&(this.value=e)}addCallback(e,t,n){if(!n)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:t});let{disposer:r}=this.subscriptions.get(e);e(this.value,r)}clearCallbacks(){this.subscriptions.clear()}},Pd=class extends Event{constructor(e,t){super(`context-provider`,{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t}},Fd=class extends Nd{constructor(e,t,n){super(t.context===void 0?n:t.initialValue),this.onContextRequest=e=>{if(e.context!==this.context)return;let t=e.contextTarget??e.composedPath()[0];t!==this.host&&(e.stopPropagation(),this.addCallback(e.callback,t,e.subscribe))},this.onProviderRequest=e=>{if(e.context!==this.context||(e.contextTarget??e.composedPath()[0])===this.host)return;let t=new Set;for(let[e,{consumerHost:n}]of this.subscriptions)t.has(e)||(t.add(e),n.dispatchEvent(new Ad(this.context,n,e,!0)));e.stopPropagation()},this.host=e,t.context===void 0?this.context=t:this.context=t.context,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener(`context-request`,this.onContextRequest),this.host.addEventListener(`context-provider`,this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new Pd(this.context,this.host))}};function Id({context:e}){return(t,n)=>{let r=new WeakMap;if(typeof n==`object`)return{get(){return t.get.call(this)},set(e){return r.get(this).setValue(e),t.set.call(this,e)},init(t){return r.set(this,new Fd(this,{context:e,initialValue:t})),t}};{t.constructor.addInitializer((t=>{r.set(t,new Fd(t,{context:e}))}));let i=Object.getOwnPropertyDescriptor(t,n),a;if(i===void 0){let e=new WeakMap;a={get(){return e.get(this)},set(t){r.get(this).setValue(t),e.set(this,t)},configurable:!0,enumerable:!0}}else{let e=i.set;a={...i,set(t){r.get(this).setValue(t),e?.call(this,t)}}}Object.defineProperty(t,n,a);return}}}function Ld({context:e,subscribe:t}){return(n,r)=>{typeof r==`object`?r.addInitializer((function(){new Md(this,{context:e,callback:e=>{n.set.call(this,e)},subscribe:t})})):n.constructor.addInitializer((n=>{new Md(n,{context:e,callback:e=>{n[r]=e},subscribe:t})}))}}var Rd=[R,A`
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
  `];const zd=jd(`vscode-list`),Bd=jd(Symbol(`configContext`));var Vd=e=>e instanceof Element&&e.matches(`vscode-tree-item`),Hd=e=>e instanceof Element&&e.matches(`vscode-tree`);const Ud=(e,t)=>{let n=t.length,r=Hd(e)?-1:e.level;`branch`in e&&(e.branch=n>0),t.forEach((t,n)=>{`path`in e?t.path=[...e.path,n]:t.path=[n],t.level=r+1,t.dataset.path=t.path.join(`.`)})},Wd=e=>{let t=e.lastElementChild;return!t||!Vd(t)?e:t.branch&&t.open?Wd(t):t},Gd=e=>!e.parentElement||!Vd(e.parentElement)?null:Kd(e.parentElement)||Gd(e.parentElement);var Kd=e=>{let t=e.nextElementSibling;for(;t&&!Vd(t);)t=t.nextElementSibling;return t};const qd=e=>{let{parentElement:t}=e;if(!t||!Vd(e))return null;let n;if(e.branch&&e.open){let t=e.querySelector(`vscode-tree-item`);t?n=t:(n=Kd(e),n||=Gd(e))}else n=Kd(e),n||=Gd(e);return n||e},Jd=e=>{let{parentElement:t}=e;if(!t||!Vd(e))return null;let n=e.previousElementSibling;for(;n&&!Vd(n);)n=n.previousElementSibling;return!n&&Vd(t)?t:n&&n.branch&&n.open?Wd(n):n};function Yd(e){return!e.parentElement||!Vd(e.parentElement)?null:e.parentElement}var Xd=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a};const Zd={singleClick:`singleClick`,doubleClick:`doubleClick`},Qd={none:`none`,onHover:`onHover`,always:`always`};var $d=[` `,`ArrowDown`,`ArrowUp`,`ArrowLeft`,`ArrowRight`,`Enter`,`Escape`,`Shift`],ef=class extends I{constructor(){super(),this.expandMode=`singleClick`,this.hideArrows=!1,this.indent=8,this.indentGuides=`onHover`,this.multiSelect=!1,this._treeContextState={isShiftPressed:!1,activeItem:null,selectedItems:new Set,allItems:null,itemListUpToDate:!1,focusedItem:null,prevFocusedItem:null,hasBranchItem:!1,rootElement:this,highlightedItems:new Set,highlightIndentGuides:()=>{this._highlightIndentGuides()},emitSelectEvent:()=>{this._emitSelectEvent()}},this._configContext={hideArrows:this.hideArrows,expandMode:this.expandMode,indent:this.indent,indentGuides:this.indentGuides,multiSelect:this.multiSelect},this._handleComponentKeyDown=e=>{let t=e.key;switch($d.includes(t)&&(e.stopPropagation(),e.preventDefault()),t){case` `:case`Enter`:this._handleEnterPress();break;case`ArrowDown`:this._handleArrowDownPress();break;case`ArrowLeft`:this._handleArrowLeftPress(e);break;case`ArrowRight`:this._handleArrowRightPress();break;case`ArrowUp`:this._handleArrowUpPress();break;case`Shift`:this._handleShiftPress();break;default:}},this._handleComponentKeyUp=e=>{e.key===`Shift`&&(this._treeContextState.isShiftPressed=!1)},this._handleSlotChange=()=>{this._treeContextState.itemListUpToDate=!1,Ud(this,this._assignedTreeItems),this.updateComplete.then(()=>{if(this._treeContextState.activeItem===null){let e=this.querySelector(`:scope > vscode-tree-item`);e&&(e.active=!0)}})},this.addEventListener(`keyup`,this._handleComponentKeyUp),this.addEventListener(`keydown`,this._handleComponentKeyDown)}connectedCallback(){super.connectedCallback(),this.role=`tree`}willUpdate(e){this._updateConfigContext(e),e.has(`multiSelect`)&&(this.ariaMultiSelectable=this.multiSelect?`true`:`false`)}expandAll(){this.querySelectorAll(`vscode-tree-item`).forEach(e=>{e.branch&&(e.open=!0)})}collapseAll(){this.querySelectorAll(`vscode-tree-item`).forEach(e=>{e.branch&&(e.open=!1)})}updateHasBranchItemFlag(){let e=this._assignedTreeItems.some(e=>e.branch);this._treeContextState={...this._treeContextState,hasBranchItem:e}}_emitSelectEvent(){let e=new CustomEvent(`vsc-tree-select`,{detail:Array.from(this._treeContextState.selectedItems)});this.dispatchEvent(e)}_highlightIndentGuideOfItem(e){if(e.branch&&e.open)e.highlightedGuides=!0,this._treeContextState.highlightedItems?.add(e);else{let t=Yd(e);t&&(t.highlightedGuides=!0,this._treeContextState.highlightedItems?.add(t))}}_highlightIndentGuides(){this.indentGuides!==Qd.none&&(this._treeContextState.highlightedItems?.forEach(e=>e.highlightedGuides=!1),this._treeContextState.highlightedItems?.clear(),this._treeContextState.activeItem&&this._highlightIndentGuideOfItem(this._treeContextState.activeItem),this._treeContextState.selectedItems.forEach(e=>{this._highlightIndentGuideOfItem(e)}))}_updateConfigContext(e){let{hideArrows:t,expandMode:n,indent:r,indentGuides:i,multiSelect:a}=this;e.has(`hideArrows`)&&(this._configContext={...this._configContext,hideArrows:t}),e.has(`expandMode`)&&(this._configContext={...this._configContext,expandMode:n}),e.has(`indent`)&&(this._configContext={...this._configContext,indent:r}),e.has(`indentGuides`)&&(this._configContext={...this._configContext,indentGuides:i}),e.has(`multiSelect`)&&(this._configContext={...this._configContext,multiSelect:a})}_focusItem(e){e.active=!0,e.updateComplete.then(()=>{e.focus(),this._highlightIndentGuides()})}_focusPrevItem(){if(this._treeContextState.focusedItem){let e=Jd(this._treeContextState.focusedItem);e&&(this._focusItem(e),this._treeContextState.isShiftPressed&&this.multiSelect&&(e.selected=!e.selected,this._emitSelectEvent()))}}_focusNextItem(){if(this._treeContextState.focusedItem){let e=qd(this._treeContextState.focusedItem);e&&(this._focusItem(e),this._treeContextState.isShiftPressed&&this.multiSelect&&(e.selected=!e.selected,this._emitSelectEvent()))}}_handleArrowRightPress(){if(!this._treeContextState.focusedItem)return;let{focusedItem:e}=this._treeContextState;e.branch&&(e.open?this._focusNextItem():e.open=!0)}_handleArrowLeftPress(e){if(e.ctrlKey){this.collapseAll();return}if(!this._treeContextState.focusedItem)return;let{focusedItem:t}=this._treeContextState,n=Yd(t);t.branch&&t.open?t.open=!1:n&&n.branch&&this._focusItem(n)}_handleArrowDownPress(){this._treeContextState.focusedItem?this._focusNextItem():this._focusItem(this._assignedTreeItems[0])}_handleArrowUpPress(){this._treeContextState.focusedItem?this._focusPrevItem():this._focusItem(this._assignedTreeItems[0])}_handleEnterPress(){let{focusedItem:e}=this._treeContextState;e&&(this._treeContextState.selectedItems.forEach(e=>e.selected=!1),this._treeContextState.selectedItems.clear(),this._highlightIndentGuides(),e.selected=!0,this._emitSelectEvent(),e.branch&&(e.open=!e.open))}_handleShiftPress(){this._treeContextState.isShiftPressed=!0}render(){return j`<div>
      <slot @slotchange=${this._handleSlotChange}></slot>
    </div>`}};ef.styles=Rd,Xd([N({type:String,attribute:`expand-mode`})],ef.prototype,`expandMode`,void 0),Xd([N({type:Boolean,reflect:!0,attribute:`hide-arrows`})],ef.prototype,`hideArrows`,void 0),Xd([N({type:Number,reflect:!0})],ef.prototype,`indent`,void 0),Xd([N({type:String,attribute:`indent-guides`,useDefault:!0,reflect:!0})],ef.prototype,`indentGuides`,void 0),Xd([N({type:Boolean,reflect:!0,attribute:`multi-select`})],ef.prototype,`multiSelect`,void 0),Xd([Id({context:zd})],ef.prototype,`_treeContextState`,void 0),Xd([Id({context:Bd})],ef.prototype,`_configContext`,void 0),Xd([Wc({selector:`vscode-tree-item`})],ef.prototype,`_assignedTreeItems`,void 0),ef=Xd([L(`vscode-tree`)],ef);var tf=[R,A`
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
  `],nf=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},rf=3,af=30,of=j`<svg
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
</svg>`;function sf(e){return!e.parentElement||!(e.parentElement instanceof $)?null:e.parentElement}var $=class extends I{set selected(e){this._selected=e,this._treeContextState.selectedItems.add(this),this.ariaSelected=e?`true`:`false`}get selected(){return this._selected}set path(e){this._path=e}get path(){return this._path}constructor(){super(),this.active=!1,this.branch=!1,this.hasActiveItem=!1,this.hasSelectedItem=!1,this.highlightedGuides=!1,this.open=!1,this.level=0,this._selected=!1,this._path=[],this._hasBranchIcon=!1,this._hasBranchOpenedIcon=!1,this._hasLeafIcon=!1,this._treeContextState={isShiftPressed:!1,selectedItems:new Set,allItems:null,itemListUpToDate:!1,focusedItem:null,prevFocusedItem:null,hasBranchItem:!1,rootElement:null,activeItem:null},this._handleMainSlotChange=()=>{this._mainSlotChange(),this._treeContextState.itemListUpToDate=!1},this._handleComponentFocus=()=>{this._treeContextState.focusedItem&&this._treeContextState.focusedItem!==this&&(this._treeContextState.isShiftPressed||(this._treeContextState.prevFocusedItem=this._treeContextState.focusedItem),this._treeContextState.focusedItem=null),this._treeContextState.focusedItem=this},this._internals=this.attachInternals(),this.addEventListener(`focus`,this._handleComponentFocus)}connectedCallback(){super.connectedCallback(),this._mainSlotChange(),this.role=`treeitem`,this.ariaDisabled=`false`}willUpdate(e){e.has(`active`)&&this._toggleActiveState(),(e.has(`open`)||e.has(`branch`))&&this._setAriaExpanded()}_setAriaExpanded(){this.branch?this.ariaExpanded=this.open?`true`:`false`:this.ariaExpanded=null}_setHasActiveItemFlagOnParent(e,t){let n=sf(e);n&&(n.hasActiveItem=t)}_toggleActiveState(){this.active?(this._treeContextState.activeItem&&(this._treeContextState.activeItem.active=!1,this._setHasActiveItemFlagOnParent(this._treeContextState.activeItem,!1)),this._treeContextState.activeItem=this,this._setHasActiveItemFlagOnParent(this,!0),this.tabIndex=0,this._internals.states.add(`active`)):(this._treeContextState.activeItem===this&&(this._treeContextState.activeItem=null,this._setHasActiveItemFlagOnParent(this,!1)),this.tabIndex=-1,this._internals.states.delete(`active`))}_selectItem(e){let{selectedItems:t}=this._treeContextState,{multiSelect:n}=this._configContext;n&&e?this.selected?(this.selected=!1,t.delete(this)):(this.selected=!0,t.add(this)):(t.forEach(e=>e.selected=!1),t.clear(),this.selected=!0,t.add(this))}_selectRange(){let e=this._treeContextState.prevFocusedItem;if(!e||e===this)return;this._treeContextState.itemListUpToDate||(this._treeContextState.allItems=this._treeContextState.rootElement.querySelectorAll(`vscode-tree-item`),this._treeContextState.allItems&&this._treeContextState.allItems.forEach((e,t)=>{e.dataset.score=t.toString()}),this._treeContextState.itemListUpToDate=!0);let t=+(e.dataset.score??-1),n=+(this.dataset.score??-1);t>n&&([t,n]=[n,t]),this._treeContextState.selectedItems.forEach(e=>e.selected=!1),this._treeContextState.selectedItems.clear(),this._selectItemsAndAllVisibleDescendants(t,n)}_selectItemsAndAllVisibleDescendants(e,t){let n=e;for(;n<=t;)if(this._treeContextState.allItems){let e=this._treeContextState.allItems[n];if(e.branch&&!e.open){e.selected=!0;let t=e.querySelectorAll(`vscode-tree-item`).length;n+=t}else e.branch&&e.open?(e.selected=!0,n+=this._selectItemsAndAllVisibleDescendants(n+1,t)):(e.selected=!0,n+=1)}return n}_mainSlotChange(){this._initiallyAssignedTreeItems.forEach(e=>{e.setAttribute(`slot`,`children`)})}_handleChildrenSlotChange(){Ud(this,this._childrenTreeItems),this._treeContextState.rootElement&&this._treeContextState.rootElement.updateHasBranchItemFlag()}_handleContentClick(e){e.stopPropagation();let t=e.ctrlKey||e.metaKey,n=e.shiftKey;n&&this._configContext.multiSelect?(this._selectRange(),this._treeContextState.emitSelectEvent?.(),this.updateComplete.then(()=>{this._treeContextState.highlightIndentGuides?.()})):(this._selectItem(t),this._treeContextState.emitSelectEvent?.(),this.updateComplete.then(()=>{this._treeContextState.highlightIndentGuides?.()}),this._configContext.expandMode===Zd.singleClick&&this.branch&&!(this._configContext.multiSelect&&t)&&(this.open=!this.open)),this.active=!0,n||(this._treeContextState.prevFocusedItem=this)}_handleDoubleClick(e){this._configContext.expandMode===Zd.doubleClick&&this.branch&&!(this._configContext.multiSelect&&(e.ctrlKey||e.metaKey))&&(this.open=!this.open)}_handleIconSlotChange(e){let t=e.target,n=t.assignedElements().length>0;switch(t.name){case`icon-branch`:this._hasBranchIcon=n;break;case`icon-branch-opened`:this._hasBranchOpenedIcon=n;break;case`icon-leaf`:this._hasLeafIcon=n;break;default:}}render(){let{hideArrows:e,indent:t,indentGuides:n}=this._configContext,{hasBranchItem:r}=this._treeContextState,i=rf+this.level*t,a=e?3:13,o=rf+this.level*t+a;!this.branch&&!e&&r&&(i+=af);let s=this._hasBranchIcon&&this.branch||this._hasBranchOpenedIcon&&this.branch&&this.open||this._hasLeafIcon&&!this.branch,c={wrapper:!0,active:this.active},l={children:!0,guide:n!==Qd.none,"default-guide":n!==Qd.none,"highlighted-guide":this.highlightedGuides},u={"icon-container":!0,"has-icon":s};return j` <div class="root">
      <div
        class=${z(c)}
        @click=${this._handleContentClick}
        @dblclick=${this._handleDoubleClick}
        .style=${tl({paddingLeft:`${i}px`})}
      >
        ${this.branch&&!e?j`<div
              class=${z({"arrow-container":!0,"icon-rotated":this.open})}
            >
              ${of}
            </div>`:M}
        <div class=${z(u)}>
          ${this.branch&&!this.open?j`<slot
                name="icon-branch"
                @slotchange=${this._handleIconSlotChange}
              ></slot>`:M}
          ${this.branch&&this.open?j`<slot
                name="icon-branch-opened"
                @slotchange=${this._handleIconSlotChange}
              ></slot>`:M}
          ${this.branch?M:j`<slot
                name="icon-leaf"
                @slotchange=${this._handleIconSlotChange}
              ></slot>`}
        </div>
        <div class="content" part="content">
          <slot @slotchange=${this._handleMainSlotChange}></slot>
        </div>
      </div>
      <div
        class=${z(l)}
        .style=${tl({"--indentation-guide-left":`${o}px`})}
        role="group"
        part="children"
      >
        <slot
          name="children"
          @slotchange=${this._handleChildrenSlotChange}
        ></slot>
      </div>
    </div>`}};if($.styles=tf,nf([N({type:Boolean})],$.prototype,`active`,void 0),nf([N({type:Boolean,reflect:!0})],$.prototype,`branch`,void 0),nf([N({type:Boolean})],$.prototype,`hasActiveItem`,void 0),nf([N({type:Boolean})],$.prototype,`hasSelectedItem`,void 0),nf([N({type:Boolean})],$.prototype,`highlightedGuides`,void 0),nf([N({type:Boolean,reflect:!0})],$.prototype,`open`,void 0),nf([N({type:Number,reflect:!0})],$.prototype,`level`,void 0),nf([N({type:Boolean,reflect:!0})],$.prototype,`selected`,null),nf([P()],$.prototype,`_hasBranchIcon`,void 0),nf([P()],$.prototype,`_hasBranchOpenedIcon`,void 0),nf([P()],$.prototype,`_hasLeafIcon`,void 0),nf([Ld({context:zd,subscribe:!0})],$.prototype,`_treeContextState`,void 0),nf([Ld({context:Bd,subscribe:!0})],$.prototype,`_configContext`,void 0),nf([Wc({selector:`vscode-tree-item`})],$.prototype,`_initiallyAssignedTreeItems`,void 0),nf([Wc({selector:`vscode-tree-item`,slot:`children`})],$.prototype,`_childrenTreeItems`,void 0),$=nf([L(`vscode-tree-item`)],$),!customElements.get(`vscode-icon`)){class e extends HTMLElement{static get observedAttributes(){return[`name`]}connectedCallback(){this.render()}attributeChangedCallback(){this.render()}render(){this.innerHTML=`<i class="codicon codicon-${this.getAttribute(`name`)}"></i>`}}customElements.define(`vscode-icon`,e)}var cf=Eo(Ds);cf.config.compilerOptions.isCustomElement=e=>e.startsWith(`vscode-`),cf.mount(`#app`);