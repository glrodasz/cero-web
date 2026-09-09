import { Icon } from '@glrodasz/components'

import { API_URL } from '../../../../config'
import { getDataSource } from '../../../../config/dataSource'
import { IS_DEMO_MODE } from '../../auth'
import useDialog from '../../hooks/useDialog'

import DevToolsModal from './DevToolsModal'
import { IS_DEV_TOOLS_ENABLED } from './constants'
import {
  createCloseDevToolsHandler,
  createToggleDevToolsHandler,
} from './handlers'

const DevTools = () => {
  const { showDialog, setShowDialog } = useDialog()

  if (!IS_DEV_TOOLS_ENABLED) return null

  const environment = [
    { label: 'Data source', value: getDataSource() },
    { label: 'API URL', value: API_URL },
    { label: 'Demo mode', value: IS_DEMO_MODE },
    { label: 'NODE_ENV', value: process.env.NODE_ENV },
  ]

  return (
    <>
      <button
        className="dev-tools-button"
        type="button"
        aria-label="Dev tools"
        aria-haspopup="dialog"
        aria-expanded={showDialog}
        onClick={createToggleDevToolsHandler({ showDialog, setShowDialog })}
      >
        <Icon name="settings" />
      </button>

      {showDialog && (
        <DevToolsModal
          environment={environment}
          onClose={createCloseDevToolsHandler({ setShowDialog })}
        />
      )}

      <style jsx>{`
        .dev-tools-button {
          position: fixed;
          right: 16px;
          /* Lifted clear of the bottom navigation, which is a normal flex item
             in MainLayout rather than a fixed bar. */
          bottom: calc(
            var(--bottom-menu-height) + 16px + env(safe-area-inset-bottom)
          );
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: var(--background-color-primary-highlight);
          box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
          cursor: pointer;
        }

        @media (min-width: 992px) {
          .dev-tools-button {
            bottom: 24px;
            right: 24px;
          }
        }
      `}</style>
    </>
  )
}

export default DevTools
