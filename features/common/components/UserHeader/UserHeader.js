import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Spacer, Heading, Paragraph } from '@glrodasz/components'

import styles from './UserHeader.module.css'

const UserHeader = ({ avatar, title, text, isPrimary }) => {
  return (
    <div className={styles['user-header']}>
      <Avatar src={avatar} />
      <Spacer.Vertical size="sm" />
      <div className={styles['text']}>
        <Heading size="lg">{title}</Heading>
        {isPrimary ? (
          <Heading color="primary">{text}</Heading>
        ) : (
          <Paragraph size="lg">{text}</Paragraph>
        )}
      </div>
    </div>
  )
}

UserHeader.propTypes = {
  avatar: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isPrimary: PropTypes.bool,
}

export default UserHeader
