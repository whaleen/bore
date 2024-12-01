import { Button } from './Button';

export default {
  title: 'Components/Button/Button',
  component: Button,
};

export const Primary = () => (
  <Button label="Click Me" onClick={() => { }} className="btn-primary" />
);

export const Secondary = () => (
  <Button label="Click Me" onClick={() => { }} className="btn-secondary" />
);

export const Error = () => (
  <Button label="Delete" onClick={() => { }} className="btn-error" />
);

export const Success = () => (
  <Button label="Delete" onClick={() => { }} className="btn-success" />
);
