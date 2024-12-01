import { FormControl } from './FormControl';
import { InputField } from './InputField';

export default {
  title: 'Components/Form/FormControl',
  component: FormControl,
};

export const Default = () => (
  <FormControl label="Username" errorMessage="This field is required">
    <InputField value="" onChange={() => { }} placeholder="Enter your username" />
  </FormControl>
);
