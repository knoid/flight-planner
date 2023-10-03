import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material';
import { SyntheticEvent, useContext, useState } from 'react';

import POIsContext, { POI } from '../../../components/POIsContext';
import { useI18nContext } from '../../../i18n/i18n-react';

function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '');
}

function matches(search: string, inputValue: string) {
  return normalize(search).includes(normalize(inputValue));
}

function getOptionLabel(option: POI) {
  switch (option.type) {
    case 'airport':
    case 'helipad':
      return `(${Object.values(option.identifiers).join('/')}) ${option.name}`;
    case 'waypoint':
      return Object.values(option.identifiers).join('/');
  }
}

interface POIInputProps {
  onChange: (
    event: SyntheticEvent,
    value: POI | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<POI>,
  ) => void;
}

export default function POIInput({ onChange }: POIInputProps) {
  const { LL } = useI18nContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const { loading, options } = useContext(POIsContext);

  return (
    <Autocomplete
      autoHighlight
      filterOptions={(options, { inputValue }) =>
        options.filter(
          (option) =>
            Object.values(option.identifiers).some((identifier) =>
              matches(identifier, inputValue),
            ) ||
            ((option.type === 'airport' || option.type === 'helipad') &&
              matches(option.name, inputValue)),
        )
      }
      getOptionLabel={getOptionLabel}
      id="poi-input"
      inputValue={value}
      isOptionEqualToValue={(option, value) => option.identifiers.local === value.identifiers.local}
      onChange={onChange}
      onClose={() => setOpen(false)}
      onInputChange={(event, newValue, reason) => setValue(reason === 'reset' ? '' : newValue)}
      onOpen={() => setOpen(true)}
      open={open}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={LL.searchPOI()}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </InputAdornment>
            ),
          }}
        />
      )}
      size="small"
      sx={{ width: 300 }}
      value={null}
    />
  );
}
