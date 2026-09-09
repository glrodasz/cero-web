import Link from 'next/link'
import PropTypes from 'prop-types'
import { Modal, Button, Heading, Paragraph, Spacer } from '@glrodasz/components'

import ToggleColorScheme from '../ToggleColorScheme'
import { DEV_TOOLS_LINKS } from './constants'

const DevToolsModal = ({ onClose, environment }) => {
  return (
    <Modal type="secondary" onClose={onClose}>
      <div className="dev-tools-modal">
        <Heading size="xl">Dev tools</Heading>
        <Spacer.Vertical size="md" />

        {/* Wraps instead of overflowing: the accordion this replaced laid the
            links out in a single row that ran off the side of a phone. */}
        <div className="dev-tools-links">
          {DEV_TOOLS_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>
              <Button type="tertiary">{label}</Button>
            </Link>
          ))}
        </div>

        <Spacer.Vertical size="md" />
        <ToggleColorScheme />

        <Spacer.Vertical size="md" />
        <Heading size="md">Environment</Heading>
        <Spacer.Vertical size="xs" />
        <dl className="dev-tools-environment">
          {environment.map(({ label, value }) => (
            <div className="dev-tools-environment-row" key={label}>
              <dt>
                <Paragraph size="sm" color="muted">
                  {label}
                </Paragraph>
              </dt>
              <dd>
                <Paragraph size="sm">{String(value)}</Paragraph>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <style jsx>{`
        .dev-tools-modal {
          width: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .dev-tools-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .dev-tools-environment-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 8px;
        }

        .dev-tools-environment-row dd {
          font-family: var(--font-family-mono);
          text-align: right;
          word-break: break-all;
        }
      `}</style>
    </Modal>
  )
}

DevToolsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  environment: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    })
  ).isRequired,
}

export default DevToolsModal
