import { Map as MapIcon } from '@mui/icons-material';
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { MouseEvent, SyntheticEvent, useContext, useState } from 'react';
import POIsContext, { POI } from '../../../components/POIsContext';

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
      return `(${option.code}) ${option.name}`;
    case 'waypoint':
      return option.code;
  }
}

function handleOnClick(event: MouseEvent<HTMLElement>) {
  event.stopPropagation();
}

interface POIInputProps {
  onChange: (
    event: SyntheticEvent,
    value: POI | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<POI>
  ) => void;
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
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <IconButton onClick={handleOnClick} size="small" href="map">
                    <MapIcon />
                  </IconButton>
                )}
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
