import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginForm } from './login-form'

// La Server Action no puede ejecutarse en jsdom: se sustituye por un doble.
const login = vi.hoisted(() => vi.fn())
vi.mock('./actions', () => ({ login }))

describe('LoginForm', () => {
  beforeEach(() => {
    login.mockReset()
    login.mockResolvedValue({})
  })

  it('rechaza un correo inválido y una contraseña corta sin llamar al servidor', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/correo/i), 'no-es-un-correo')
    await userEvent.type(screen.getByLabelText(/contraseña/i), '123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText(/correo válido/i)).toBeInTheDocument()
    expect(screen.getByText(/al menos 8 caracteres/i)).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('envía las credenciales válidas a la acción de login', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/correo/i), 'ana@cdi.org')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'contraseña-segura')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await vi.waitFor(() => expect(login).toHaveBeenCalledTimes(1))
    const formData = login.mock.calls[0][1] as FormData
    expect(formData.get('email')).toBe('ana@cdi.org')
    expect(formData.get('password')).toBe('contraseña-segura')
  })

  it('muestra el error que devuelve el servidor', async () => {
    login.mockResolvedValue({ error: 'Correo o contraseña incorrectos.' })
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/correo/i), 'ana@cdi.org')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'contraseña-segura')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText(/incorrectos/i)).toBeInTheDocument()
  })
})
