// packages/ui/src/components/form/Textarea.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      description: 'Textarea content',
      control: 'text'
    },
    onChange: {
      description: 'Change handler function',
      action: 'changed'
    },
    placeholder: {
      description: 'Placeholder text',
      control: 'text'
    },
    rows: {
      description: 'Number of visible text rows',
      control: 'number'
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text'
    }
  }
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Enter your message here...'
  }
};

export const WithContent: Story = {
  args: {
    value: 'This is some example content that shows how the textarea looks with text inside it.',
    placeholder: 'Enter your message here...'
  }
};

export const LargeSize: Story = {
  args: {
    value: '',
    placeholder: 'Write a longer message...',
    rows: 8,
    className: 'min-h-[200px]'
  }
};

export const WithLabel: Story = {
  args: {
    value: '',
    placeholder: 'Describe your issue...',
    label: 'Description'
  }
};

export const Disabled: Story = {
  args: {
    value: 'This textarea is disabled',
    disabled: true
  }
};
