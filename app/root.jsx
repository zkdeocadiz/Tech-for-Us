import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./index.css";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
        <script 
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: `
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
          `}}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}