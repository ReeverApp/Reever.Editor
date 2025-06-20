# Reever Editor

A powerful React component wrapper for EditorJS with enhanced features.

## Features

- 🚀 Built on top of EditorJS
- 🎨 Rich text editing with multiple tools
- 📝 Support for headers, lists, quotes, code blocks, tables, and more
- 🔧 Highly customizable toolbar
- 📱 Responsive design
- ⚡ TypeScript support

## Installation

```bash
npm install reever-editor
```

## Dependencies

This package requires React and ReactDOM as peer dependencies:

```bash
npm install react react-dom
```

## Usage

```tsx
import React from 'react';
import { EditorComponent } from 'reever-editor';
import 'reever-editor/dist/editor.css';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <EditorComponent />
    </div>
  );
}

export default App;
```

## Available Tools

The editor comes with the following built-in tools:

### Block Tools
- **Paragraph** - Basic text editing
- **Headers** - H1, H2, H3 headings
- **Lists** - Bulleted and numbered lists
- **To-do List** - Nested checklist
- **Quote** - Blockquotes
- **Code Block** - Syntax highlighted code
- **Table** - Rich tables with headers
- **Image** - Image insertion
- **Delimiter** - Visual separator

### Inline Tools
- **Bold** - Bold text formatting
- **Italic** - Italic text formatting
- **Underline** - Underlined text
- **Strikethrough** - Strikethrough text
- **Link** - Hyperlinks
- **Subscript** - Subscript text
- **Superscript** - Superscript text

## Customization

The editor supports full customization of tools and configuration. You can modify the EditorComponent to suit your needs.

## Development

To run the development server:

```bash
npm start
```

To build the library:

```bash
npm run build:lib
```

To test:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/ReeverApp/Reever.Editor/issues) on GitHub.