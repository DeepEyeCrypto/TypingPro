import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlassCard } from '../GlassCard'

describe('GlassCard', () => {
    it('should render children correctly', () => {
        render(
            <GlassCard>
                <div>Test Content</div>
            </GlassCard>
        )

        expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should apply correct CSS classes for variant', () => {
        const { container } = render(
            <GlassCard variant="compact">
                <div>Compact Card</div>
            </GlassCard>
        )

        const card = container.firstChild
        expect(card).toHaveClass('p-4') // compact padding
    })

    it('should render title when provided', () => {
        render(
            <GlassCard title="Test Title">
                <div>Content</div>
            </GlassCard>
        )

        expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('should be interactive when onClick provided', () => {
        const { container } = render(
            <GlassCard interactive onClick={() => { }}>
                <div>Interactive Card</div>
            </GlassCard>
        )

        const card = container.firstChild
        expect(card).toHaveClass('cursor-pointer')
    })

    it('should render icon when provided', () => {
        render(
            <GlassCard icon={<span data-testid="test-icon">🔥</span>}>
                <div>Card with icon</div>
            </GlassCard>
        )

        expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })
})
