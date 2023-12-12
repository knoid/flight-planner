import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  CircularProgress,
  FilterOptionsState,
  InputAdornment,
  TextField,
} from '@mui/material';
import { SyntheticEvent, useContext, useEffect, useMemo, useState } from 'react';

import { POI } from '../../../components/openAIP';
import POIsContext from '../../../components/POIsContext';
import { useI18nContext } from '../../../i18n/i18n-react';

function filterOptions(options: POI[], { inputValue }: FilterOptionsState<POI>) {
  return options.filter((option) => option.matches(inputValue));
}

function getOptionLabel(option: POI) {
  return option.getLabel();
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

  const { airports, loading, reportingPoints, setSearch } = useContext(POIsContext);
  const options = useMemo(
    () =>
      [...airports.values(), ...reportingPoints.values()].filter(
        <T extends POI>(poi: T | undefined): poi is T => !!poi,
      ),
    [airports, reportingPoints],
  );
  useEffect(() => setSearch(value), [value]);

  return (
    <Autocomplete
      autoHighlight
      filterOptions={filterOptions}
      getOptionLabel={getOptionLabel}
      id="poi-input"
      inputValue={value}
      onChange={onChange}
      onClose={() => setOpen(false)}
      onInputChange={(_event, newValue, reason) => setValue(reason === 'reset' ? '' : newValue)}
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
