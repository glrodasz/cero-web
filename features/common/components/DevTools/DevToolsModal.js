import Link from 'next/link'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Modal, Heading, Icon } from '@glrodasz/components'

import ToggleColorScheme from '../ToggleColorScheme'
import { DEV_TOOLS_AUTH_LINKS, DEV_TOOLS_PAGES } from './constants'
import styles from './DevToolsModal.module.css'

const Section = ({ title, children }) => (
  <section className={styles.section}>
    <h2 className={styles['section-title']}>{title}</h2>
    {children}
  </section>
)

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const LinkRow = ({ label, icon, isCurrent }) => (
  <>
    <Icon name={icon} color={isCurrent ? 'primary' : 'muted'} size="sm" />
    <span className={styles['row-label']}>{label}</span>
    {isCurrent && <span className={styles['row-detail']}>current</span>}
  </>
)

LinkRow.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool,
}

const DevToolsModal = ({ onClose, onResetData, environment, currentPath }) => {
  return (
    <Modal type="secondary" onClose={onClose}>
      <div className={styles.modal}>
        <Heading size="xl">Dev tools</Heading>

        <Section title="Pages">
          <ul className={styles.list}>
            {DEV_TOOLS_PAGES.map((page) => {
              const isCurrent = page.href === currentPath
              return (
                <li key={page.href}>
                  <Link href={page.href}>
                    <a
                      className={classNames(styles.row, {
                        [styles['is-current']]: isCurrent,
                      })}
                      aria-current={isCurrent ? 'page' : undefined}
                      onClick={onClose}
                    >
                      <LinkRow
                        label={page.label}
                        icon={page.icon}
                        isCurrent={isCurrent}
                      />
                    </a>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Section>

        <Section title="Session">
          <ul className={styles.list}>
            {DEV_TOOLS_AUTH_LINKS.map((link) => (
              <li key={link.href}>
                <a className={styles.row} href={link.href}>
                  <LinkRow label={link.label} icon={link.icon} />
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Appearance">
          <div className={styles.list}>
            <ToggleColorScheme />
          </div>
        </Section>

        <Section title="Environment">
          <dl className={classNames(styles.list, styles.environment)}>
            {environment.map(({ label, value, hint }) => (
              <div className={styles['environment-row']} key={label}>
                <dt>{label}</dt>
                <dd>
                  <code>{String(value)}</code>
                  {hint && <span className={styles.hint}>{hint}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {onResetData && (
          <Section title="Demo data">
            <p className={styles.description}>
              Lives in this browser and never expires. Resetting puts back the
              seed tasks and reloads Planning.
            </p>
            <button
              type="button"
              className={styles.danger}
              onClick={onResetData}
            >
              Reset demo data
            </button>
          </Section>
        )}
      </div>
    </Modal>
  )
}

DevToolsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onResetData: PropTypes.func,
  currentPath: PropTypes.string,
  environment: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      hint: PropTypes.string,
    })
  ).isRequired,
}

export default DevToolsModal
