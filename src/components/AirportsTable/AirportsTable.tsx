import { TableBody, TableRow as MuiTableRow } from '@mui/material';
import { useLegs } from '../LegsContext';
import Table, { TableCell, TableHead } from '../Table';
import TableRow from './TableRow';

export function AirportsTable() {
  const [legs] = useLegs();

  return (
    <Table>
      <TableHead>
        <MuiTableRow>
          <TableCell />
          <TableCell>Airport</TableCell>
          <TableCell>Runways</TableCell>
          <TableCell align="center">TWR</TableCell>
          <TableCell align="center">GND</TableCell>
          <TableCell align="center">CLRD</TableCell>
          <TableCell align="center">APP</TableCell>
          <TableCell align="center">ATIS</TableCell>
          <TableCell />
        </MuiTableRow>
      </TableHead>
      <TableBody>
        {legs.map((leg) => <TableRow key={leg.key} leg={leg} />)}
      </TableBody>
    </Table>
  );
}
