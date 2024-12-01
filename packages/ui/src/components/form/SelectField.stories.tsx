import { SelectField } from './SelectField';

export default {
  title: 'Components/Form/SelectField',
  component: SelectField,
};

export const Default = () => (
  <SelectField
    options={['Option 1', 'Option 2', 'Option 3']}
    value="Option 1"
    onChange={() => { }}
  />
);
