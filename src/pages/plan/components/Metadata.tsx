import { Box } from '@mui/material';

import { useI18nContext } from '../../../i18n/i18n-react';
import MetadataField from './TextFields/MetadataField';

export default function Metadata() {
  const { LL } = useI18nContext();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <MetadataField
        inputProps={{ type: 'date' }}
        InputLabelProps={{ shrink: true }}
        label={LL.date()}
        name="date"
        size="small"
      />
      <MetadataField label={LL.title()} name="title" size="small" />
    </Box>
  );
}
