import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./index.css";


export const meta = () => {
  const defaultTitle = "Tech For Us";
  const defaultDescription = 
    "A co-created toolkit for helping you figure out what role technology should have in your life and how to get there";
  const fallbackImage = "/HomePage/main-og.png"; // Image from your public folder

  return [
    { title: defaultTitle },
    { name: "description", content: defaultDescription },
    { property: "og:title", content: defaultTitle },
    { property: "og:description", content: defaultDescription },
    { property: "og:image", content: fallbackImage },
    { property: "og:type", content: "website" },
  ];
};



export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#FFADF2" />
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