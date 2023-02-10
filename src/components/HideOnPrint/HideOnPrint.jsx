import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './HideOnPrint.module.css';

const HideOnPrint = forwardRef(
  ({ children, component: Component = 'div', className, ...props }, ref) => (
    <Component className={clsx(className, styles.root)} ref={ref} {...props}>
      {children}
    </Component>
  )
);

export default HideOnPrint;
