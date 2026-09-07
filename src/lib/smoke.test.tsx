import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

function Counter() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>clicks: {n}</button>
}

describe('toolchain', () => {
  it('renders and reacts to user events', async () => {
    render(<Counter />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('clicks: 1')
  })

  it('validates with zod', () => {
    const schema = z.object({ email: z.email() })
    expect(schema.safeParse({ email: 'no' }).success).toBe(false)
    expect(schema.safeParse({ email: 'a@b.com' }).success).toBe(true)
  })
})
