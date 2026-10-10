import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const MainLayout = ({ content, isPlayground }) => {
  return (
    <>
      <main
        className={classNames('main-layout', { 'is-playground': isPlayground })}
      >
        <section className="content">{content}</section>
      </main>
      <style jsx>{`
        main > section {
          width: 100%;
        }

        .is-playground > section {
          border: var(--border-width-thick) dashed var(--color-primary);
        }

        /* App shell: the viewport is the frame, only the content scrolls. */
        .main-layout {
          position: relative;
          display: flex;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          /* viewport-fit=cover hands the notch and the rounded corners to
             the page; keep the content clear of them. The bottom inset is
             left to the content, so it can scroll under the home indicator. */
          padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px)
            0 env(safe-area-inset-left, 0px);
          overflow: hidden;
        }

        .content {
          display: flex;
          flex: 1 1 auto;
          /* Without this a flex item refuses to shrink below its content and
             the scrolling moves back to the page. */
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          background: var(--background-color-primary);
        }
      `}</style>
    </>
  )
}

MainLayout.propTypes = {
  content: PropTypes.node,
  isPlayground: PropTypes.bool,
}

export default MainLayout
