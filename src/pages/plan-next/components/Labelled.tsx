import { styled } from '@mui/material';
import { ReactNode } from 'react';

const Container = styled('div')({
  lineHeight: 1,
  position: 'relative',
});

const Label = styled('div')({
  fontSize: '0.6em',
  // position: 'absolute',
  top: -10,
});

interface LabelledProps {
  children: ReactNode;
  type: string;
}

export default function Labelled({ children, type }: LabelledProps) {
  return (
    <Container>
      <Label>{type}</Label>
      {children}
    </Container>
  );
}
