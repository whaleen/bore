// packages/ui/src/components/form/SelectField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SelectField } from './SelectField';

const meta = {
  title: 'Form/SelectField',
  component: SelectField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: 'Array of options to display in the select',
      control: { type: 'object' }  // Changed from 'array' to 'object'
    },
    value: {
      description: 'Currently selected value',
      control: 'text'
    },
    onChange: {
      description: 'Change handler function',
      action: 'changed'
    },
    placeholder: {
      description: 'Placeholder text when no option is selected',
      control: 'text'
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text'
    }
  }
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof SelectField>;

const sampleOptions = ['Option 1', 'Option 2', 'Option 3'];

export const Default: Story = {
  args: {
    options: sampleOptions,
    value: '',
    placeholder: 'Select an option'
  }
};

export const WithValue: Story = {
  args: {
    options: sampleOptions,
    value: 'Option 2',
    placeholder: 'Select an option'
  }
};

export const NoOptions: Story = {
  args: {
    options: [],
    value: '',
    placeholder: 'No options available'
  }
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => `Option ${i + 1}`),
    value: '',
    placeholder: 'Select from many options'
  }
};
