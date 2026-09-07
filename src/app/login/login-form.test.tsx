import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LoginForm } from './login-form'

describe('LoginForm', () => {
  it('rechaza un correo inválido y una contraseña corta', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/correo/i), 'no-es-un-correo')
    await userEvent.type(screen.getByLabelText(/contraseña/i), '123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText(/correo válido/i)).toBeInTheDocument()
    expect(screen.getByText(/al menos 8 caracteres/i)).toBeInTheDocument()
  })

  it('acepta credenciales con formato válido', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/correo/i), 'ana@cdi.org')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'contraseña-segura')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByRole('status')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
