import { TableBody, TableRow as MuiTableRow } from '@mui/material';

import { useStore } from '../../../../components/store';
import { useI18nContext } from '../../../../i18n/i18n-react';
import Table, { TableCell, TableHead } from '../Table';
import TableRow from './TableRow';

export function AirportsTable() {
  const { LL } = useI18nContext();
  const { legs } = useStore();

  return (
    <Table>
      <TableHead>
        <MuiTableRow>
          <TableCell />
          <TableCell>{LL.airport()}</TableCell>
          <TableCell align="center">{LL.runways()}</TableCell>
          <TableCell align="center">TWR</TableCell>
          <TableCell align="center">GND</TableCell>
          <TableCell align="center">APP</TableCell>
          <TableCell align="center">ATIS</TableCell>
          <TableCell />
        </MuiTableRow>
      </TableHead>
      <TableBody>
        {legs.map((leg) => (
          <TableRow key={leg._id} leg={leg} />
        ))}
      </TableBody>
    </Table>
  );
}
