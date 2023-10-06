import { Box, styled, TableRow as MuiTableRow } from '@mui/material';

import { FrequencyType } from '../../../../components/openAIP';
import { useAirport } from '../../../../components/POIsContext';
import type { Leg } from '../../../../components/store/constants';
import { TableCell } from '../Table';

const FrequencyCell = styled(TableCell)({
  fontFamily: 'monospace',
});

interface FrequencyProps {
  children?: string;
}

function Frequency({ children }: FrequencyProps) {
  return <FrequencyCell>{children}</FrequencyCell>;
}

interface TableRowProps {
  leg: Leg;
}

export default function TableRow({ leg }: TableRowProps) {
  const airport = useAirport(leg._id);
  function frequency(key: FrequencyType) {
    return airport?.frequencies?.find(({ type }) => type === key)?.value;
  }

  if (!airport) {
    return null;
  }

  return (
    <MuiTableRow>
      <TableCell />
      <TableCell align="center">{airport.getIdentifier()}</TableCell>
      <TableCell align="center">
        {airport?.runways?.map((runway) => (
          <Box component="span" key={runway._id} marginX={0.5}>
            {runway.designator}
          </Box>
        ))}
      </TableCell>
      <Frequency>
        {frequency(FrequencyType.Tower) ||
          frequency(FrequencyType.Multicom) ||
          frequency(FrequencyType.Radio) ||
          frequency(FrequencyType.Unicom)}
      </Frequency>
      <Frequency>{frequency(FrequencyType.Ground)}</Frequency>
      <Frequency>{frequency(FrequencyType.Approach)}</Frequency>
      <Frequency>{frequency(FrequencyType.ATIS)}</Frequency>
      <TableCell />
    </MuiTableRow>
  );
}
