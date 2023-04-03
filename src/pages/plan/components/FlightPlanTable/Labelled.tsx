import { styled } from '@mui/material';

const Container = styled('div')({
  lineHeight: 1,
  position: 'relative',
});

const Label = styled('div')({
  fontSize: '0.6em',
  position: 'absolute',
  top: -10,
  '@media print': { top: -5 },
});
const Value = styled('div')({
  fontFamily: 'monospace',
  transform: 'translate(0, 1px)',
});

interface LabelledProps {
  type: string;
  frequency: number;
}

export default function Labelled({ frequency, type }: LabelledProps) {
  return (
    <Container>
      <Label>{type}</Label>
      <Value>{frequency.toFixed(2)}</Value>
    </Container>
  );
}
