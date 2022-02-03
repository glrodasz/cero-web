import { useState } from 'react'

import {
  Heading,
  Input,
  Button,
  Spacer,
  CenteredContent,
} from '@glrodasz/components'

export default function Index() {
  const [formValues, setFormValues] = useState({})

  const onChange = (key) => (event) => {
    const { value } = event.target
    setFormValues({ ...formValues, [key]: value })
  }

  return (
    <CenteredContent>
      <Heading size="xl">Cuentame sobre ti</Heading>
      <Spacer.Vertical size="md" />
      <Input
        value={formValues.name}
        onChange={onChange('name')}
        placeholder="Nombres"
      />
      <Spacer.Vertical size="sm" />
      <Input
        value={formValues.lastname}
        onChange={onChange('lastname')}
        placeholder="Apellidos"
      />
      <Spacer.Vertical size="sm" />
      <Input
        value={formValues.email}
        onChange={onChange('email')}
        placeholder="Correo electrónico"
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Spacer.Vertical size="lg" />
        <Button type="primary">Completa tu perfil</Button>
        <Spacer.Vertical size="md" />
        <Button type="tertiary">Saltar este paso por ahora</Button>
      </div>
    </CenteredContent>
  )
}
