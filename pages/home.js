import Link from 'next/link'
import {
  Avatar,
  Heading,
  Spacer,
  Card,
  Picture,
  Icon,
  FullHeightContent,
  Paragraph,
} from '@glrodasz/components'

import UserHeader from '../features/common/components/UserHeader/UserHeader'

export default function Home() {
  return (
    <FullHeightContent
      content={
        <>
          <UserHeader
            avatar="https://placeimg.com/200/200/people"
            title="Buenos días, Cristian"
            text="¿Cómo quieres empezar?"
            isPrimary
          />
          <Spacer.Horizontal size="lg" />
          <Card color="secondary" size="lg" isClickable>
            <Picture src="/images/search-coworking.svg" width={120}></Picture>
            <Spacer.Vertical size="lg" />
            <Paragraph weight="medium" color="inverted" size="lg">
              Buscar un espacio para trabajar
            </Paragraph>
          </Card>
          <Spacer.Horizontal size="md" />
          <Link href="/planning">
            <Card color="primary" size="lg" isClickable>
              <Picture src="/images/start-planning.svg" width={120}></Picture>
              <Spacer.Vertical size="lg" />
              <Paragraph weight="medium" color="inverted" size="lg">
                Iniciar una sesión de productividad
              </Paragraph>
            </Card>
          </Link>
          <Spacer.Horizontal size="lg" />
          <Card size="sm">
            <Icon name="user" color="primary" background="highlight" />
            <Spacer.Vertical size="sm" />
            <Paragraph>Maria ha hecho check-in en Factoria</Paragraph>
          </Card>
          <Spacer.Horizontal size="xs" />
          <Card size="sm">
            <Icon name="user" color="primary" background="highlight" />
            <Spacer.Vertical size="sm" />
            <Paragraph>Frank ha iniciado una sesión de productividad</Paragraph>
          </Card>
          <Spacer.Horizontal size="xs" />
          <Card size="sm">
            <Icon name="arrowUp" color="primary" background="spotlight" />
            <Spacer.Vertical size="sm" />
            <Paragraph>
              Tu productividad ha incrementado un 30% durante la última semana
            </Paragraph>
          </Card>
        </>
      }
    ></FullHeightContent>
  )
}
