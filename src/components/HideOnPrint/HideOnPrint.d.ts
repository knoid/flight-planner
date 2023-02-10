import {
  OverridableComponent,
  OverrideProps,
} from '@mui/material/OverridableComponent';
import clsx from 'clsx';
import { ComponentType, ElementType, forwardRef, ReactNode } from 'react';
import styles from './HideOnPrint.module.css';

export interface HideOnPrintTypeMap<P = {}, D extends ElementType = 'div'> {
  props: P & {
    /**
     * Whatever needs to be hidden when printing.
     */
    children?: ReactNode;
  };
  defaultComponent: D;
}

declare const HideOnPrint: OverridableComponent<HideOnPrintTypeMap>;

export type HideOnPrintProps<
  D extends ElementType = HideOnPrintTypeMap['defaultComponent'],
  P = {}
> = OverrideProps<HideOnPrintTypeMap<P, D>, D>;

export default HideOnPrint;
