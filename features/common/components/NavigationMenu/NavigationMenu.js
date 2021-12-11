import { IconLabel } from '@glrodasz/components'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router'
import useBreakpoints from '../../hooks/useBreakpoints'

const pages = [
  {
    icon: 'home',
    label: 'Home',
    href: '/home',
  },
  {
    icon: 'tasks',
    label: 'Tasks',
    href: '/planning',
  },
  {
    icon: 'reports',
    label: 'Reports',
    href: '/reports',
  },
  {
    icon: 'settings',
    label: 'Settings',
    href: '/settings',
  },
]

const NavigationMenu = () => {
  const router = useRouter()
  const { isDesktop } = useBreakpoints()

  return (
    <>
      <div className="navigation-menu">
        {pages.map(({ icon, label, href }) => (
          <Link key={label} href={href}>
            <IconLabel
              icon={icon}
              label={label}
              isActive={href === router.pathname}
              direction={isDesktop ? 'horizontal' : 'vertical'}
            />
          </Link>
        ))}
      </div>
      <style jsx>{`
        .navigation-menu {
          display: flex;
          justify-content: space-evenly;
          padding: 10px 20px;
        }

        @media (min-width: 992px) {
          .navigation-menu {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  )
}

export default NavigationMenu
