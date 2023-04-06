import { Feedback as FeedbackIcon } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';

import HideOnPrint from '../pages/plan/components/HideOnPrint';

const FeedbackPosition = styled(HideOnPrint)({
  bottom: '1rem',
  left: '1rem',
  position: 'fixed',
  zIndex: 1000,
});

export default function FeedbackLink() {
  return (
    <FeedbackPosition>
      <IconButton
        href="https://docs.google.com/forms/d/e/1FAIpQLSfr1atTWmJfTRhAHjceGuFfTVFWUg0mqVtUWY6uwwFbg9689A/viewform"
        LinkComponent="a"
        rel="noopener nofollow"
        target="_blank"
        title="leave a comment"
      >
        <FeedbackIcon />
      </IconButton>
    </FeedbackPosition>
  );
}
