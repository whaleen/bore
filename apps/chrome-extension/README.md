# Bore Proxy Chrome Extension

A Chrome extension that allows users to manage and connect to their saved proxy nodes from the Bore Proxy directory.

## Features

- Link with your Bore Proxy web account
- View saved proxy nodes
- Set primary proxy node
- Quick enable/disable proxy connection
- Seamless integration with Chrome's proxy settings

## Installation

1. Clone the repository

```bash
git clone [repository-url]
cd bore-proxy-extension
```

2. Install dependencies from monorepo root

```bash
cd ../..
npm install
```

## Development

This extension uses React for the popup interface and supports modern JavaScript features.

### Available Scripts

- Build the extension:

```bash
npm run build
```

- Watch mode for development:

```bash
npm run watch
```

- Development mode with debugging:

```bash
npm run dev
```

### Loading the Extension

1. Build the extension using one of the commands above
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `dist` directory from your project

### Linking Your Account

1. Open the Bore Proxy web platform
2. Navigate to your account settings
3. Generate a linking code
4. Open the extension popup
5. Enter the 6-digit code to link your account

## Project Structure

```
bore-proxy-extension/
├── src/
│   ├── components/       # React components
│   ├── styles/          # CSS styles
│   ├── utils/           # Utility functions
│   ├── popup.jsx        # Main popup entry
│   └── background.js    # Service worker
├── public/
│   ├── icons/          # Extension icons
│   ├── manifest.json   # Extension manifest
│   └── popup.html     # Popup HTML template
```

## Technical Notes

- Uses Chrome's proxy API for connection management
- Implements secure storage for API keys and preferences
- Supports Chrome Manifest V3
- Built with React and modern JavaScript features

## Security

- API keys are stored securely in Chrome's local storage
- Network requests are made over HTTPS
- Proxy credentials are encrypted during transmission
