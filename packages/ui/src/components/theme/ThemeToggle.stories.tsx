// packages/ui/src/components/theme/ThemeToggle.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from './ThemeContext';

const meta = {
  title: 'Theme/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    )
  ],
  argTypes: {
    className: {
      description: 'Additional CSS classes',
      control: 'text'
    }
  }
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  args: {}
};

export const WithCustomStyle: Story = {
  args: {
    className: 'p-4 rounded-full hover:bg-primary/10'
  }
};
