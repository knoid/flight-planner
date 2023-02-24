import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  CircularProgress,
  TextField,
} from '@mui/material';
import { SyntheticEvent, useContext, useState } from 'react';
import POIsContext, { POI } from './POIsContext';

function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '');
}

function matches(search: string, inputValue: string) {
  return normalize(search).includes(normalize(inputValue));
}

interface POIInputProps {
  onChange: (
    event: SyntheticEvent,
    value: POI | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<POI>
  ) => void;
}

function getOptionLabel(option: POI) {
  switch (option.type) {
    case 'airport':
      return `(${option.code}) ${option.name}`;
    case 'waypoint':
      return option.code;
  }
}

export default function POIInput({ onChange }: POIInputProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const { loading, options } = useContext(POIsContext);

  return (
    <Autocomplete
      autoHighlight
      filterOptions={(options, { inputValue }) =>
        options.filter(
          (option) =>
            matches(option.code, inputValue) ||
            (option.type === 'airport' && matches(option.name, inputValue))
        )
      }
      getOptionLabel={getOptionLabel}
      id="poi-input"
      inputValue={value}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      onChange={onChange}
      onClose={() => setOpen(false)}
      onInputChange={(event, newValue, reason) => setValue(reason === 'reset' ? '' : newValue)}
      onOpen={() => setOpen(true)}
      open={open}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search POIs"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      size="small"
      sx={{ width: 300 }}
    />
  );
}
