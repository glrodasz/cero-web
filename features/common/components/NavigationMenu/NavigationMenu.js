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
            <div className="menu-item">
              <IconLabel
                icon={icon}
                label={label}
                isActive={href === router.pathname}
                direction={isDesktop ? 'horizontal' : 'vertical'}
                size={isDesktop ? 'md' : 'sm'}
              />
            </div>
          </Link>
        ))}
      </div>
      <style jsx>{`
        .navigation-menu {
          display: flex;
          justify-content: space-evenly;
          width: 100%;
          padding: 10px 0 15px;
        }

        @media (min-width: 992px) {
          .navigation-menu {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 0;
          }

          .menu-item {
            padding: 8px 20px;
            border-bottom: 1px solid var(--color-brand-white-lilac);
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}

export default NavigationMenu
