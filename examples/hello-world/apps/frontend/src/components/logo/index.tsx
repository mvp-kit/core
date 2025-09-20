import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { StarshipIcon, type StarshipIconProps } from './starship-icon'

/**
 * Decorative product mark using local SVG for optimal performance.
 */
type LogoProps = StarshipIconProps

export const Logo = React.memo(function Logo({ className, ...props }: LogoProps) {
  return <StarshipIcon className={className} {...props} />
})

type NavLogoProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean
  showBadge?: boolean
  badgeText?: string
}

export const NavLogo = React.memo(function NavLogo({
  className,
  asChild,
  showBadge = true,
  badgeText = 'Core',
  ...props
}: NavLogoProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp className={cn('flex items-center gap-2', className)} {...props}>
      <Logo />
      <span className="text-lg font-semibold tracking-tight">MVP Kit</span>
      {showBadge && (
        <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px] leading-none">
          {badgeText}
        </Badge>
      )}
    </Comp>
  )
})
