import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const MainLayout = ({ menu, content, isPlayground }) => {
  return (
    <>
      <main
        className={classNames('main-layout', { 'is-playground': isPlayground })}
      >
        <section className="menu">{menu}</section>
        <section className="content">{content}</section>
      </main>
      <style jsx>{`
        main > section {
          width: 100%;
        }

        .is-playground > section {
          border: var(--border-width-thick) dashed var(--color-primary);
        }

        /* App shell: the viewport is the frame, only the content scrolls. The
           menu is a flex item that never shrinks, so the bottom bar stays put
           on mobile instead of scrolling away with a tall page. */
        .main-layout {
          position: relative;
          display: flex;
          flex-direction: column-reverse;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
        }

        .content {
          display: flex;
          flex: 1 1 auto;
          /* Without this a flex item refuses to shrink below its content and
             the scrolling moves back to the page, unpinning the menu. */
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          background: var(--background-color-primary);
        }

        .menu {
          display: flex;
          flex: 0 0 auto;
          min-height: var(--bottom-menu-height);
          padding-bottom: env(safe-area-inset-bottom);
          background: var(--background-color-primary-highlight);
        }

        @media (min-width: 992px) {
          .main-layout {
            flex-direction: row;
          }

          .menu {
            max-width: 260px;
            min-height: 0;
            padding-bottom: 0;
          }
        }
      `}</style>
    </>
  )
}

MainLayout.propTypes = {
  menu: PropTypes.node,
  content: PropTypes.node,
  isPlayground: PropTypes.bool,
}

export default MainLayout
