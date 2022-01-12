import Head from 'next/head'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Accordion, Button, Container } from '@glrodasz/components'
import { ReactQueryCacheProvider, QueryCache } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'
import { UserProvider } from '@auth0/nextjs-auth0'

import ToggleColorScheme from '../features/common/components/ToggleColorScheme'

import 'minireset.css'
import '@glrodasz/components/styles/globals.css'
import '@glrodasz/components/styles/tokens.css'
import '../styles/globals.scss'
import NavigationMenu from '../features/common/components/NavigationMenu'
import MainLayout from '../features/common/components/MainLayout'
import useColorScheme from '../features/common/hooks/useColorScheme'

const queryCache = new QueryCache()
function MyApp({ Component, pageProps }) {
  useColorScheme()

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Accordion title="Dev tools">
        <div
          style={{
            paddingTop: 30,
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {[
              '/',
              '/api/auth/login',
              '/api/auth/logout',
              '/home',
              '/planning',
              '/retrospective',
            ].map((link) => (
              <span key={link} style={{ marginRight: 10 }}>
                <Link href={link}>
                  <Button type="tertiary">
                    {link.replace('/', '') || '/index'}
                  </Button>
                </Link>
              </span>
            ))}
          </div>
          <ToggleColorScheme />
        </div>
      </Accordion>

      <MainLayout
        menu={<NavigationMenu />}
        content={
          <Container>
            <UserProvider>
              <Component {...pageProps} />
            </UserProvider>
          </Container>
        }
      />
      <ReactQueryDevtools initialIsOpen />
    </ReactQueryCacheProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.node.isRequired,
  pageProps: PropTypes.object,
}

export default MyApp
