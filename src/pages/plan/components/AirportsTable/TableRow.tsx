import { styled, TableRow as MuiTableRow } from '@mui/material';
import { Leg } from '../../../../components/LegsContext';
import { TableCell } from '../Table';
import useWaypoint from '../useWaypoint';

const FrequencyCell = styled(TableCell)({
  fontFamily: 'monospace',
})

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
  const metadata = useWaypoint(leg.code);

  if (leg.poi?.type !== 'airport') {
    return null;
  }

  return (
    <MuiTableRow>
      <TableCell />
      <TableCell align="center">{leg.code}</TableCell>
      <TableCell />
      <Frequency>{metadata?.frequencies.TWR || metadata?.frequencies.COM}</Frequency>
      <Frequency>{metadata?.frequencies.GND}</Frequency>
      <Frequency>{metadata?.frequencies.CLRD}</Frequency>
      <Frequency>{metadata?.frequencies.APP}</Frequency>
      <Frequency>{metadata?.frequencies.ATIS}</Frequency>
      <TableCell />
    </MuiTableRow>
  );
}
