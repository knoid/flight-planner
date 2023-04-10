import { useStore } from '../../../components/store';
import { useI18nContext } from '../../../i18n/i18n-react';
import Hiddenable from './Hiddenable';
import MetadataField from './TextFields/MetadataField';

export default function Metadata() {
  const { LL } = useI18nContext();
  const { metadata } = useStore();
  return (
    <Hiddenable printHidden={!(metadata.callSign || metadata.date || metadata.title)}>
      <MetadataField
        inputProps={{ type: 'date' }}
        InputLabelProps={{ shrink: true }}
        label={LL.date()}
        name="date"
        printAlign="left"
        size="small"
      />
      <MetadataField label={LL.title()} name="title" printAlign="center" size="small" />
      <MetadataField label={LL.callSign()} name="callSign" printAlign="right" size="small" />
    </Hiddenable>
  );
}
