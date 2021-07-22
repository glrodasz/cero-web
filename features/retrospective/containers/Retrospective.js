import {
  Spacer,
  Heading,
  Accordion,
  FullHeightContent,
  Paragraph,
  Score,
  Textarea,
} from '@glrodasz/components'

import RetrospectiveFooter from '../components/RetrospectiveFooter'

const Retrospective = () => {
  return (
    <FullHeightContent
      content={
        <>
          <div>
            <Accordion title="En Progresso"></Accordion>
            <Spacer.Vertical size="sm" />
            <Accordion title="Pendientes"></Accordion>
            <Spacer.Vertical size="sm" />
            <Accordion title="Completadas"></Accordion>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <>
              <Spacer.Vertical size="lg" />
              <div>
                <Heading size="xl">¿Cómo te sentiste el día de hoy?</Heading>
                <Spacer.Vertical size="sm" />
                <Score />
              </div>
              <Spacer.Vertical size="md" />
              <Heading size="xl">¿Qué bloqueos tuviste?</Heading>
              <Spacer.Vertical size="sm" />
              <Paragraph>
                Durante el día, existen distractores y escribirlos te ayuda a
                identificarlos para mantenerte enfocado y saludable.
              </Paragraph>
              <Spacer.Vertical size="md" />
              <Textarea placeholder="Escribe acá..." />
            </>
          </div>
        </>
      }
      footer={<RetrospectiveFooter />}
    ></FullHeightContent>
  )
}

export default Retrospective
