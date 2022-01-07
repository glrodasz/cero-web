import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0'
import {
  Spacer,
  Card,
  Picture,
  Icon,
  FullHeightContent,
  Paragraph,
  LoadingError,
} from '@glrodasz/components'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

import UserHeader from '../features/common/components/UserHeader/UserHeader'

export const getServerSideProps = withPageAuthRequired()

// TODO: Move Home content to it's own container
export default function Home() {
  const { user, isLoading: isLoadingUser, error: errorUser } = useUser()

  return (
    <FullHeightContent
      content={
        <>
          <LoadingError
            isLoading={isLoadingUser}
            errorMessage={errorUser?.message}
          >
            <UserHeader
              avatar={user?.picture}
              title={`Buenos días, ${user?.name}`}
              text="¿Cómo quieres empezar?"
              isPrimary
            />
          </LoadingError>
          <Spacer.Vertical size="lg" />
          <Card color="secondary" size="lg" isClickable>
            <Picture src="/images/search-coworking.svg" width={120}></Picture>
            <Spacer.Horizontal size="lg" />
            <Paragraph weight="medium" color="inverted" size="lg">
              Buscar un espacio para trabajar
            </Paragraph>
          </Card>
          <Spacer.Vertical size="md" />
          <Link href="/planning">
            <Card color="primary" size="lg" isClickable>
              <Picture src="/images/start-planning.svg" width={120}></Picture>
              <Spacer.Horizontal size="lg" />
              <Paragraph weight="medium" color="inverted" size="lg">
                Iniciar una sesión de productividad
              </Paragraph>
            </Card>
          </Link>
          <Spacer.Vertical size="lg" />
          <Card size="sm">
            <Icon name="user" color="primary" background="highlight" />
            <Spacer.Horizontal size="sm" />
            <Paragraph>Maria ha hecho check-in en Factoria</Paragraph>
          </Card>
          <Spacer.Vertical size="xs" />
          <Card size="sm">
            <Icon name="user" color="primary" background="highlight" />
            <Spacer.Horizontal size="sm" />
            <Paragraph>Frank ha iniciado una sesión de productividad</Paragraph>
          </Card>
          <Spacer.Vertical size="xs" />
          <Card size="sm">
            <Icon name="arrowUp" color="primary" background="spotlight" />
            <Spacer.Horizontal size="sm" />
            <Paragraph>
              Tu productividad ha incrementado un 30% durante la última semana
            </Paragraph>
          </Card>
        </>
      }
    ></FullHeightContent>
  )
}
