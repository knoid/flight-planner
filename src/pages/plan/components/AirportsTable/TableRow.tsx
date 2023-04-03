import { styled, TableRow as MuiTableRow } from '@mui/material';

import { Leg } from '../../../../components/LegsContext';
import { TableCell } from '../Table';
import useWaypoint from '../useWaypoint';

const FrequencyCell = styled(TableCell)({
  fontFamily: 'monospace',
});

interface FrequencyProps {
  children?: number;
}

function Frequency({ children }: FrequencyProps) {
  return <FrequencyCell>{children?.toFixed(2)}</FrequencyCell>;
}

interface TableRowProps {
  leg: Leg;
}

export default function TableRow({ leg }: TableRowProps) {
  const airport = useWaypoint(leg.code);
  function frequency(key: string) {
    return airport?.frequencies.find(({ type }) => type === key)?.frequency;
  }

  if (leg.poi?.type !== 'airport') {
    return null;
  }

  return (
    <MuiTableRow>
      <TableCell />
      <TableCell align="center">{leg.code}</TableCell>
      <TableCell />
      <Frequency>{frequency('TWR') || frequency('COM')}</Frequency>
      <Frequency>{frequency('GND')}</Frequency>
      <Frequency>{frequency('CLRD')}</Frequency>
      <Frequency>{frequency('APP')}</Frequency>
      <Frequency>{frequency('ATIS')}</Frequency>
      <TableCell />
    </MuiTableRow>
  );
}
