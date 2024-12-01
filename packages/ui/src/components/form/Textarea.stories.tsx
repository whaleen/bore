import { Textarea } from './Textarea';

export default {
  title: 'Components/Form/Textarea',
  component: Textarea,
};

export const Default = () => (
  <Textarea value="" onChange={() => { }} placeholder="Write something here..." />
);
