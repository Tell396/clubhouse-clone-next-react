import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { Avatar } from '../Avatar';

import styles from './Header.module.scss';

export const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className="container d-flex align-items-center justify-content-between">
        <Link href="/rooms">
          <div className={clsx(styles.headerLogo, 'd-flex align-items-center cup')}>
            <img src="/static/hand-wave.png" alt="Logo" className="mr-5" />
            <h4>Euphoria</h4>
          </div>
        </Link>
        <Link href="/profile/1123">
          <div className="d-flex align-items-center cup">
            <b className="mr-5">John Doe</b>
            <Avatar
              src="https://i.pinimg.com/originals/b6/a2/bf/b6a2bfae90ff4c3fed3e1f1088070e04.jpg"
              width="50px"
              height="50px"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
