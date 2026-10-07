import Head from 'next/head'
import PropTypes from 'prop-types'
import { Container } from '@glrodasz/components'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { UserProvider } from '@auth0/nextjs-auth0'

import { IS_DEMO_MODE } from '../features/common/auth'

import DevTools from '../features/common/components/DevTools'
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
      {/* The viewport meta belongs here rather than in `_document`. */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainLayout
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
      {/* Closed by default: open, the panel covers half a phone screen. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}),
}

export default MyApp
