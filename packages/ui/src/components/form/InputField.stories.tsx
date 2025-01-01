// packages/ui/src/components/form/InputField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { InputField } from './InputField';

const meta = {
  title: 'Form/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: 'Input type (text, email, password, etc)',
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url']
    },
    placeholder: {
      description: 'Placeholder text',
      control: 'text'
    },
    value: {
      description: 'Input value',
      control: 'text'
    },
    onChange: {
      description: 'Change handler function',
      action: 'changed'
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text'
    },
    label: {
      description: 'Input label',
      control: 'text'
    }
  }
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    value: ''
  }
};

export const WithLabel: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter your name',
    value: '',
    label: 'Full Name'
  }
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
    value: '',
    label: 'Password'
  }
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
    value: '',
    label: 'Email Address'
  }
};

export const WithValue: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    value: 'Prefilled value',
    label: 'Input with Value'
  }
};
