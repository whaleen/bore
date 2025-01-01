import type { Meta, StoryObj } from '@storybook/react';
import { EmptyPrimaryNode } from './EmptyPrimaryNode';
import { EmptySavedNodes } from './EmptySavedNodes';
import { NoDevice } from './NoDevice';

const meta = {
  title: 'Empty States',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const EmptyPrimaryNodeDefault: StoryObj = {
  name: 'Empty Primary Node - Default',
  render: () => (
    <div className="w-[600px]">
      <EmptyPrimaryNode />
    </div>
  ),
};

export const EmptyPrimaryNodeWithAction: StoryObj = {
  name: 'Empty Primary Node - With Action',
  render: () => (
    <div className="w-[600px]">
      <EmptyPrimaryNode onBrowse={() => console.log('Browse clicked')} />
    </div>
  ),
};

export const EmptySavedNodesDefault: StoryObj = {
  name: 'Empty Saved Nodes - Default',
  render: () => (
    <div className="w-[400px]">
      <EmptySavedNodes />
    </div>
  ),
};

export const EmptySavedNodesWithAction: StoryObj = {
  name: 'Empty Saved Nodes - With Action',
  render: () => (
    <div className="w-[400px]">
      <EmptySavedNodes onBrowse={() => console.log('Browse clicked')} />
    </div>
  ),
};

export const NoDeviceDefault: StoryObj = {
  name: 'No Device - Default',
  render: () => (
    <div className="w-[400px]">
      <NoDevice onGenerateCode={() => console.log('Generate code clicked')} />
    </div>
  ),
};

export const NoDeviceGenerating: StoryObj = {
  name: 'No Device - Generating',
  render: () => (
    <div className="w-[400px]">
      <NoDevice
        onGenerateCode={() => console.log('Generate code clicked')}
        isGeneratingCode={true}
      />
    </div>
  ),
};
