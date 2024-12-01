import { Checkbox } from './Checkbox';

export default {
  title: 'Components/Form/Checkbox',
  component: Checkbox,
};

export const Default = () => (
  <Checkbox label="Accept Terms" checked={false} onChange={() => { }} />
);
