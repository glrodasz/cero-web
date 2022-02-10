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

        .main-layout {
          display: flex;
          flex-direction: column-reverse;
          width: 100%;
          min-height: 100vh;
          justify-content: space-between;
        }

        .menu {
          display: flex;
          margin-top: auto;
          background: var(--background-color-primary-highlight);
        }

        .content {
          display: flex;
          background: var(--background-color-primary);
        }

        @media (min-width: 992px) {
          .main-layout {
            flex-direction: row;
          }

          .menu {
            max-width: 260px;
            margin-top: 0;
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
