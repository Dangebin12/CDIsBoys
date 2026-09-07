'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Ingresa un correo válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
})

type LoginValues = z.infer<typeof loginSchema>

const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  // Sin backend todavía: sólo valida y confirma. Conectar aquí la autenticación real.
  async function onSubmit(values: LoginValues) {
    console.info('login enviado', values.email)
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className={fieldClass}
          {...register('email')}
        />
        {errors.email && (
          <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          className={fieldClass}
          {...register('password')}
        />
        {errors.password && (
          <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-sky-600 px-4 py-2.5 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
      >
        {isSubmitting ? 'Entrando…' : 'Entrar'}
      </button>

      {isSubmitSuccessful && (
        <p role="status" className="text-center text-sm text-green-700 dark:text-green-400">
          Datos válidos. Falta conectar la autenticación.
        </p>
      )}
    </form>
  )
}
