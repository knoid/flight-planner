import { Button, ButtonGroup, Paper, styled } from '@mui/material';
import { useMap } from 'react-leaflet';

const ZoomContainer = styled(Paper)({
  bottom: '2em',
  position: 'absolute',
  right: '1em',
  zIndex: 1000,
  '.MuiButton-root': {
    fontSize: '2rem',
    lineHeight: 1.2,
    padding: 0,
  },
});

export default function ZoomControls() {
  const map = useMap();

  function zoomIn() {
    map.zoomIn();
  }
  function zoomOut() {
    map.zoomOut();
  }

  return (
    <ZoomContainer>
      <ButtonGroup aria-label="zoom controls" color="info" orientation="vertical">
        <Button onClick={zoomIn}>+</Button>
        <Button onClick={zoomOut}>−</Button>
      </ButtonGroup>
    </ZoomContainer>
  );
}
