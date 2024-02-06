import { styled } from '@mui/material';

import Section from '../../components/Section';
import { useI18nContext } from '../../i18n/i18n-react';
import CruiseSpeedInput from './components/TextFields/CruiseSpeedInput';
import FuelTextField from './components/TextFields/FuelTextField';
import MetadataField from './components/TextFields/MetadataField';

const Fieldset = styled(Section)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    display: 'inline-flex',
    flexDirection: 'row',
  },
}));

const CallSignField = styled(MetadataField)({
  input: { textTransform: 'uppercase' },
});

export const Component = function PlanePage() {
  const { LL } = useI18nContext();
  return (
    <Fieldset>
      <CallSignField label={LL.callSign()} name="callSign" />
      <CruiseSpeedInput />
      <FuelTextField label={LL.fuelCapacity()} name="capacity" />
      <FuelTextField label={LL.fuelReserve()} name="reserve" />
      <FuelTextField label={LL.fuelFlow()} name="flow" />
    </Fieldset>
  );
};
