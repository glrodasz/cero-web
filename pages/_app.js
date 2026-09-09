import Head from 'next/head'
import PropTypes from 'prop-types'
import { Container } from '@glrodasz/components'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { UserProvider } from '@auth0/nextjs-auth0'

import { IS_DEMO_MODE } from '../features/common/auth'

import DevTools from '../features/common/components/DevTools'
import NavigationMenu from '../features/common/components/NavigationMenu'
import MainLayout from '../features/common/components/MainLayout'
import useColorScheme from '../features/common/hooks/useColorScheme'

import 'minireset.css'
import '@glrodasz/components/styles/globals.css'
import '@glrodasz/components/styles/tokens.css'
import '../styles/globals.scss'

const queryClient = new QueryClient()
function MyApp({ Component, pageProps }) {
  useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      {/* `viewport-fit=cover` is what makes `env(safe-area-inset-bottom)`
          non-zero, so the bottom menu clears the home indicator. The viewport
          meta belongs here rather than in `_document`. */}
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>

      <MainLayout
        menu={<NavigationMenu />}
        content={
          <Container>
            {IS_DEMO_MODE ? (
              <Component {...pageProps} />
            ) : (
              <UserProvider>
                <Component {...pageProps} />
              </UserProvider>
            )}
          </Container>
        }
      />
      <DevTools />
      {/* Closed by default, and its toggle lifted clear of the now pinned
          bottom navigation: open, the panel covers half a phone screen, and at
          bottom: 0 the toggle sits on top of the first navigation item. */}
      <ReactQueryDevtools
        initialIsOpen={false}
        toggleButtonProps={{
          style: { bottom: 'calc(var(--bottom-menu-height) + 8px)' },
        }}
      />
    </QueryClientProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}),
}

export default MyApp
