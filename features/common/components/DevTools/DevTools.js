import { useRouter } from 'next/router'
import classNames from 'classnames'
import { Icon } from '@glrodasz/components'

import { API_URL } from '../../../../config'
import {
  getDataSource,
  isBrowserDataSource,
} from '../../../../config/dataSource'
import { IS_DEMO_MODE } from '../../auth'
import useDialog from '../../hooks/useDialog'
import useDraggableCorner from '../../hooks/useDraggableCorner'

import DevToolsModal from './DevToolsModal'
import { DEV_TOOLS_CORNER_STORAGE_KEY, IS_DEV_TOOLS_ENABLED } from './constants'
import {
  createCloseDevToolsHandler,
  createResetDataHandler,
  createToggleDevToolsHandler,
} from './handlers'

const DevTools = () => {
  const { showDialog, setShowDialog } = useDialog()
  const router = useRouter()
  const { ref, corner, isDragging, dragHandlers } = useDraggableCorner({
    storageKey: DEV_TOOLS_CORNER_STORAGE_KEY,
  })

  if (!IS_DEV_TOOLS_ENABLED) return null

  const environment = [
    { label: 'Data source', value: getDataSource() },
    API_URL
      ? { label: 'API URL', value: API_URL }
      : { label: 'API URL', value: 'none', hint: 'answered in this browser' },
    { label: 'Demo mode', value: IS_DEMO_MODE },
    { label: 'NODE_ENV', value: process.env.NODE_ENV },
  ]

  return (
    <>
      <button
        ref={ref}
        className={classNames('dev-tools-button', `corner-${corner}`, {
          'is-dragging': isDragging,
        })}
        type="button"
        aria-label="Dev tools"
        aria-haspopup="dialog"
        aria-expanded={showDialog}
        onClick={createToggleDevToolsHandler({ showDialog, setShowDialog })}
        {...dragHandlers}
      >
        <Icon name="settings" />
      </button>

      {showDialog && (
        <DevToolsModal
          environment={environment}
          currentPath={router?.pathname}
          onClose={createCloseDevToolsHandler({ setShowDialog })}
          onResetData={
            isBrowserDataSource() ? createResetDataHandler() : undefined
          }
        />
      )}

      <style jsx>{`
        /* Top right by default: the bottom of the screen belongs to each
           page's floating actions (PageLayout). Drag it to any corner when
           it covers something. */
        .dev-tools-button {
          --dev-tools-offset: 12px;

          position: fixed;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: var(--background-color-primary-highlight);
          box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
          cursor: grab;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }

        .dev-tools-button.is-dragging {
          box-shadow: 0 6px 16px rgb(0 0 0 / 35%);
          cursor: grabbing;
        }

        .corner-top-left,
        .corner-top-right {
          top: calc(var(--dev-tools-offset) + env(safe-area-inset-top, 0px));
        }

        .corner-bottom-left,
        .corner-bottom-right {
          bottom: calc(
            var(--dev-tools-offset) + env(safe-area-inset-bottom, 0px)
          );
        }

        .corner-top-left,
        .corner-bottom-left {
          left: calc(var(--dev-tools-offset) + env(safe-area-inset-left, 0px));
        }

        .corner-top-right,
        .corner-bottom-right {
          right: calc(
            var(--dev-tools-offset) + env(safe-area-inset-right, 0px)
          );
        }

        @media (min-width: 992px) {
          .dev-tools-button {
            --dev-tools-offset: 24px;
          }
        }
      `}</style>
    </>
  )
}

export default DevTools
