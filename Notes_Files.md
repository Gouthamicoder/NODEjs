# Files in Node.js

## Overview

Node.js provides robust file system operations through the built-in `fs` module. This module offers both synchronous and asynchronous methods for reading, writing, and manipulating files and directories.

## Importing the fs Module

```javascript
const fs = require('fs');
const path = require('path');

// For Promise-based operations (Node.js 10+)
const fsPromises = require('fs').promises;
// or
const fs = require('fs/promises');
```

## Reading Files

### Asynchronous Reading

```javascript
// Callback-based
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log(data);
});

// Promise-based
fsPromises.readFile('example.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));

// Async/await
async function readFileAsync() {
  try {
    const data = await fsPromises.readFile('example.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error:', err);
  }
}
```

### Synchronous Reading

```javascript
try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error('Error reading file:', err);
}
```

## Writing Files

### Asynchronous Writing

```javascript
const content = 'Hello, World!';

// Callback-based
fs.writeFile('output.txt', content, 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully');
});

// Promise-based
fsPromises.writeFile('output.txt', content, 'utf8')
  .then(() => console.log('File written successfully'))
  .catch(err => console.error('Error:', err));
```

### Synchronous Writing

```javascript
try {
  fs.writeFileSync('output.txt', 'Hello, World!', 'utf8');
  console.log('File written successfully');
} catch (err) {
  console.error('Error writing file:', err);
}
```

### Appending to Files

```javascript
// Asynchronous append
fs.appendFile('log.txt', 'New log entry\n', (err) => {
  if (err) throw err;
  console.log('Data appended');
});

// Synchronous append
fs.appendFileSync('log.txt', 'New log entry\n');
```

## File Information and Statistics

### Getting File Stats

```javascript
fs.stat('example.txt', (err, stats) => {
  if (err) {
    console.error('Error getting file stats:', err);
    return;
  }
  
  console.log('File size:', stats.size);
  console.log('Is file:', stats.isFile());
  console.log('Is directory:', stats.isDirectory());
  console.log('Modified time:', stats.mtime);
  console.log('Created time:', stats.birthtime);
});
```

### Checking File Existence

```javascript
// Using fs.access (recommended)
fs.access('example.txt', fs.constants.F_OK, (err) => {
  if (err) {
    console.log('File does not exist');
  } else {
    console.log('File exists');
  }
});

// Synchronous version
try {
  fs.accessSync('example.txt', fs.constants.F_OK);
  console.log('File exists');
} catch (err) {
  console.log('File does not exist');
}
```

## Working with Directories

### Creating Directories

```javascript
// Create single directory
fs.mkdir('new-directory', (err) => {
  if (err) throw err;
  console.log('Directory created');
});

// Create nested directories
fs.mkdir('path/to/nested/directory', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Nested directories created');
});
```

### Reading Directory Contents

```javascript
fs.readdir('.', (err, files) => {
  if (err) throw err;
  console.log('Directory contents:', files);
});

// With file types
fs.readdir('.', { withFileTypes: true }, (err, dirents) => {
  if (err) throw err;
  
  dirents.forEach(dirent => {
    console.log(`${dirent.name} - ${dirent.isDirectory() ? 'Directory' : 'File'}`);
  });
});
```

### Removing Directories

```javascript
// Remove empty directory
fs.rmdir('empty-directory', (err) => {
  if (err) throw err;
  console.log('Directory removed');
});

// Remove directory and contents (Node.js 14.14.0+)
fs.rm('directory-with-contents', { recursive: true, force: true }, (err) => {
  if (err) throw err;
  console.log('Directory and contents removed');
});
```

## File Operations

### Copying Files

```javascript
// Simple copy
fs.copyFile('source.txt', 'destination.txt', (err) => {
  if (err) throw err;
  console.log('File copied');
});

// Copy with flags
fs.copyFile('source.txt', 'destination.txt', fs.constants.COPYFILE_EXCL, (err) => {
  if (err) throw err;
  console.log('File copied (only if destination does not exist)');
});
```

### Moving/Renaming Files

```javascript
fs.rename('old-name.txt', 'new-name.txt', (err) => {
  if (err) throw err;
  console.log('File renamed');
});
```

### Deleting Files

```javascript
fs.unlink('file-to-delete.txt', (err) => {
  if (err) throw err;
  console.log('File deleted');
});
```

## Streams for Large Files

### Reading Large Files with Streams

```javascript
const readStream = fs.createReadStream('large-file.txt', { encoding: 'utf8' });

readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length);
});

readStream.on('end', () => {
  console.log('File reading completed');
});

readStream.on('error', (err) => {
  console.error('Error reading file:', err);
});
```

### Writing Large Files with Streams

```javascript
const writeStream = fs.createWriteStream('output-large.txt');

writeStream.write('First chunk of data\n');
writeStream.write('Second chunk of data\n');
writeStream.end(); // Close the stream

writeStream.on('finish', () => {
  console.log('File writing completed');
});

writeStream.on('error', (err) => {
  console.error('Error writing file:', err);
});
```

## Working with JSON Files

### Reading JSON Files

```javascript
async function readJsonFile(filename) {
  try {
    const data = await fsPromises.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON file:', err);
    throw err;
  }
}

// Usage
readJsonFile('config.json')
  .then(config => console.log(config))
  .catch(err => console.error(err));
```

### Writing JSON Files

```javascript
async function writeJsonFile(filename, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fsPromises.writeFile(filename, jsonString, 'utf8');
    console.log('JSON file written successfully');
  } catch (err) {
    console.error('Error writing JSON file:', err);
    throw err;
  }
}

// Usage
const data = { name: 'John', age: 30 };
writeJsonFile('data.json', data);
```

## File Watching

```javascript
// Watch for changes in a file
fs.watchFile('example.txt', (curr, prev) => {
  console.log('File changed');
  console.log('Previous modified time:', prev.mtime);
  console.log('Current modified time:', curr.mtime);
});

// Watch a directory for changes
fs.watch('.', (eventType, filename) => {
  console.log(`Event: ${eventType}, File: ${filename}`);
});
```

## Error Handling Best Practices

### Common Error Codes

- `ENOENT`: File or directory does not exist
- `EACCES`: Permission denied
- `EEXIST`: File already exists
- `EISDIR`: Expected file but found directory
- `ENOTDIR`: Expected directory but found file

### Error Handling Example

```javascript
async function safeFileOperation(filename) {
  try {
    await fsPromises.access(filename, fs.constants.F_OK);
    const data = await fsPromises.readFile(filename, 'utf8');
    return data;
  } catch (err) {
    switch (err.code) {
      case 'ENOENT':
        console.error('File does not exist:', filename);
        break;
      case 'EACCES':
        console.error('Permission denied:', filename);
        break;
      default:
        console.error('Unexpected error:', err);
    }
    throw err;
  }
}
```

## Path Operations

```javascript
const path = require('path');

// Join paths
const fullPath = path.join(__dirname, 'files', 'example.txt');

// Get file extension
const ext = path.extname('example.txt'); // '.txt'

// Get filename without extension
const name = path.basename('example.txt', '.txt'); // 'example'

// Get directory name
const dir = path.dirname('/path/to/file.txt'); // '/path/to'

// Resolve absolute path
const absolute = path.resolve('example.txt');
```

## Performance Considerations

### Synchronous vs Asynchronous

- Use asynchronous methods in production to avoid blocking the event loop
- Synchronous methods are acceptable for initialization code or CLI tools
- For high-performance applications, consider using streams for large files

### Memory Usage

- `readFile` loads entire file into memory
- Use streams for files larger than available memory
- Consider using `fs.createReadStream` with appropriate buffer sizes

## Security Best Practices

- Always validate file paths to prevent directory traversal attacks
- Use `path.resolve()` and `path.normalize()` to clean paths
- Implement proper permission checks
- Sanitize user input when constructing file paths

```javascript
const path = require('path');

function safeFilePath(userInput) {
  // Resolve and normalize the path
  const safePath = path.resolve(path.normalize(userInput));
  
  // Ensure it's within allowed directory
  const allowedDir = path.resolve('./uploads');
  if (!safePath.startsWith(allowedDir)) {
    throw new Error('Access denied: Path outside allowed directory');
  }
  
  return safePath;
}
```