import { Html, Head, Main, NextScript } from 'next/document'

// Link previews need an absolute image URL, so this names the public demo.
const SITE_URL = 'https://reto.guillermorodas.com'
const SITE_DESCRIPTION = 'Planea tus tareas y enfócate en lo importante.'
const OG_IMAGE_ALT =
  'RETO, Cero a Producción: Planea tus tareas y enfócate en lo importante. Planea, enfócate, reflexiona.'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        {/* Installed from the home screen, the app opens without browser UI.
            `useColorScheme` keeps `theme-color` in step with the app's own
            toggle, which can disagree with the OS preference these media
            queries read on first paint. */}
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RETO · Cero a Producción" />
        <meta property="og:title" content="RETO · Cero a Producción" />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={OG_IMAGE_ALT} />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${SITE_URL}/og.png`} />

        <meta name="application-name" content="RETO" />
        <meta name="apple-mobile-web-app-title" content="RETO" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="theme-color"
          content="#e8e8e8"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#111827"
          media="(prefers-color-scheme: dark)"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
