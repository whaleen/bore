import { InputField } from './InputField';

export default {
  title: 'Components/Form/InputField',
  component: InputField,
};

export const Default = () => (
  <InputField value="" onChange={() => { }} placeholder="Type something..." />
);
