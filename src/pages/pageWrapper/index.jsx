import React, { useEffect } from 'react';
import styles from './index.less';
export default ({children,title}) => {
  useEffect(() => {
    console.log(children,'childer')
  }, []);
  return (
    <div className={styles.layout}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
