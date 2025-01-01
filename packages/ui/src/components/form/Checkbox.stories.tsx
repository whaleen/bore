// packages/ui/src/components/form/Checkbox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Form/Checkbox',  // Move from Components/Form to Form/Checkbox
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Label text for the checkbox',
      control: 'text',
    },
    checked: {
      description: 'Whether the checkbox is checked',
      control: 'boolean',
    },
    onChange: {
      description: 'Change handler function',
      action: 'changed'
    }
  }
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    checked: false
  }
};

export const Checked: Story = {
  args: {
    label: 'Notifications enabled',
    checked: true
  }
};

export const WithLongLabel: Story = {
  args: {
    label: 'I agree to receive marketing emails and other promotional materials that may be of interest to me',
    checked: false
  }
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    checked: false,
    required: true
  }
};
