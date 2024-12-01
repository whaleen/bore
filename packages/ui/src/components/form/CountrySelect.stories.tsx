// packages/ui/src/components/form/CountrySelect.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CountrySelect } from './CountrySelect';

const meta = {
  title: 'Form/CountrySelect',
  component: CountrySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CountrySelect>;

export default meta;
type Story = StoryObj<typeof CountrySelect>;

const sampleCountries = [
  { code: '', name: 'All Countries' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
];

export const Default: Story = {
  args: {
    countries: sampleCountries,
    value: '',
    onChange: (value) => console.log('Selected:', value)
  }
};

export const WithSelected: Story = {
  args: {
    countries: sampleCountries,
    value: 'US',
    onChange: (value) => console.log('Selected:', value)
  }
};
