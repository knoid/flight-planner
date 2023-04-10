import { TableBody, TableRow as MuiTableRow } from '@mui/material';

import { useLegs } from '../../../../components/LegsContext';
import { useI18nContext } from '../../../../i18n/i18n-react';
import Table, { TableCell, TableHead } from '../Table';
import TableRow from './TableRow';

export function AirportsTable() {
  const { LL } = useI18nContext();
  const [legs] = useLegs();

  return (
    <Table>
      <TableHead>
        <MuiTableRow>
          <TableCell />
          <TableCell>{LL.airport()}</TableCell>
          <TableCell>{LL.runways()}</TableCell>
          <TableCell align="center">TWR</TableCell>
          <TableCell align="center">GND</TableCell>
          <TableCell align="center">CLRD</TableCell>
          <TableCell align="center">APP</TableCell>
          <TableCell align="center">ATIS</TableCell>
          <TableCell />
        </MuiTableRow>
      </TableHead>
      <TableBody>
        {legs.map((leg) => (
          <TableRow key={leg.key} leg={leg} />
        ))}
      </TableBody>
    </Table>
  );
}
