import Head from 'next/head'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Button, Container } from '@glrodasz/components'
import { ReactQueryCacheProvider, QueryCache } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'

import ToggleColorScheme from '../features/common/components/ToggleColorScheme'

import 'minireset.css'
import '@glrodasz/components/styles/globals.css'
import '@glrodasz/components/styles/tokens.css'
import '../styles/globals.scss'

const queryCache = new QueryCache()
function MyApp({ Component, pageProps }) {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        style={{
          paddingTop: 30,
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {['/', '/home', '/planning', '/retrospective'].map((link) => (
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
      <Container>
        <Component {...pageProps} />
      </Container>
      <ReactQueryDevtools initialIsOpen />
    </ReactQueryCacheProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.node.isRequired,
  pageProps: PropTypes.object,
}

export default MyApp
