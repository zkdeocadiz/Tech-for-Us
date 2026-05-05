import{A as e,a as t,c as n,d as r,f as i,o as a,t as o}from"./jsx-runtime-CyXxvS_Q.js";var s=o(),c=e(function(){return(0,s.jsxs)(`html`,{lang:`en`,children:[(0,s.jsxs)(`head`,{children:[(0,s.jsx)(`meta`,{charSet:`utf-8`}),(0,s.jsx)(`meta`,{name:`viewport`,content:`width=device-width, initial-scale=1.0`}),(0,s.jsx)(`link`,{rel:`icon`,type:`image/svg+xml`,href:`/favicon.svg`}),(0,s.jsx)(a,{}),(0,s.jsx)(t,{}),(0,s.jsx)(`script`,{type:`text/javascript`,dangerouslySetInnerHTML:{__html:`
            (function(l) {
              if (l.search[1] === 'p') {
                var decoded = l.search.slice(1).split('&').map(function(s) { 
                  return s.replace(/~and~/g, '&') 
                }).filter(function(s) {
                  return s.slice(0, 2) === 'p='
                })[0].slice(2);
                if (decoded !== l.pathname) {
                  window.history.replaceState(null, null,
                    l.pathname.slice(0, -1) + decoded + l.hash
                  );
                }
              }
            }(window.location))
          `}})]}),(0,s.jsxs)(`body`,{children:[(0,s.jsx)(n,{}),(0,s.jsx)(i,{}),(0,s.jsx)(r,{})]})]})});export{c as default};