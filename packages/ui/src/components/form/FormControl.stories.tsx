// packages/ui/src/components/form/FormControl.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FormControl } from './FormControl';
import { InputField } from './InputField';

const meta = {
  title: 'Form/FormControl',
  component: FormControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Label text for the form control',
      control: 'text'
    },
    errorMessage: {
      description: 'Error message to display below the form control',
      control: 'text'
    },
    children: {
      description: 'Form control content (input, select, etc)'
    }
  }
} satisfies Meta<typeof FormControl>;

export default meta;
type Story = StoryObj<typeof FormControl>;

export const Default: Story = {
  args: {
    label: 'Username',
    children: <InputField
      value=""
      onChange={() => { }}
      placeholder="Enter username"
    />
  }
};

export const WithError: Story = {
  args: {
    label: 'Email',
    errorMessage: 'Please enter a valid email address',
    children: <InputField
      type="email"
      value="invalid-email"
      onChange={() => { }}
      placeholder="Enter email"
      className="input-error"
    />
  }
};

export const Required: Story = {
  args: {
    label: 'Password',
    children: <InputField
      type="password"
      value=""
      onChange={() => { }}
      placeholder="Enter password"
    />,
    required: true
  }
};

export const WithHelperText: Story = {
  args: {
    label: 'Display Name',
    helperText: 'This is how other users will see you',
    children: <InputField
      value=""
      onChange={() => { }}
      placeholder="Enter display name"
    />
  }
};
