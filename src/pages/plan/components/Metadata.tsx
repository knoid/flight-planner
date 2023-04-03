import { useStore } from '../../../components/store';
import Hiddenable from './Hiddenable';
import MetadataField from './TextFields/MetadataField';

export default function Metadata() {
  const { metadata } = useStore();
  return (
    <Hiddenable printHidden={!(metadata.callSign || metadata.date || metadata.title)}>
      <MetadataField
        inputProps={{ type: 'date' }}
        InputLabelProps={{ shrink: true }}
        label="Date"
        name="date"
        printAlign="left"
        size="small"
      />
      <MetadataField label="Title" name="title" printAlign="center" size="small" />
      <MetadataField label="Call Sign" name="callSign" printAlign="right" size="small" />
    </Hiddenable>
  );
}
