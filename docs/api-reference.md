# API Reference

Technical documentation for developers integrating with or extending Lazy Certification.

## 🎯 Overview

Lazy Certification is built with Next.js 15 and TypeScript. This reference covers the component architecture, data structures, and integration points for custom implementations.

## 📁 Project Structure

```
lazy-certificate/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application
├── components/             # React components
│   ├── ui/                # Radix UI components
│   └── theme-provider.tsx # Theme management
├── lib/                   # Utility functions
│   └── utils.ts          # Helper utilities
└── public/               # Static assets
```

## 🧩 Core Components

### Main Application (`app/page.tsx`)

**Purpose**: Root application component managing state and layout
**Key Features**:
- Template upload and management
- Text area creation and positioning
- Canvas rendering and manipulation
- Export functionality

**State Management**:
```typescript
interface AppState {
  template: File | null;
  templateUrl: string | null;
  textAreas: TextArea[];
  canvasScale: number;
  isGenerating: boolean;
}
```

### Text Area Component

**Interface**: `TextArea`
```typescript
interface TextArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  isEditing: boolean;
}
```

**Methods**:
- `createTextArea(x: number, y: number): TextArea`
- `updateTextArea(id: string, updates: Partial<TextArea>): void`
- `deleteTextArea(id: string): void`
- `duplicateTextArea(id: string): void`

### Canvas Component

**Canvas Rendering**:
- HTML5 Canvas API for certificate generation
- High-DPI support for print quality
- Real-time preview updates
- Zoom and pan functionality

**Canvas Configuration**:
```typescript
interface CanvasConfig {
  width: number;
  height: number;
  scale: number;
  showGrid: boolean;
  gridSize: number;
  backgroundColor: string;
}
```

## 📊 Data Processing

### CSV Import Handler

**CSV Processing**:
```typescript
interface CSVData {
  headers: string[];
  rows: string[][];
  rowCount: number;
}

interface CSVProcessor {
  parseCSV(file: File): Promise<CSVData>;
  validateHeaders(headers: string[]): ValidationResult;
  mapDataToTemplate(data: CSVData, template: TextArea[]): MappedData;
}
```

**Validation Rules**:
- UTF-8 encoding validation
- Header uniqueness check
- Data type validation (dates, numbers)
- Maximum row limit (1000)

### Batch Generation Engine

**Generation Process**:
```typescript
interface BatchConfig {
  template: string; // template URL
  textAreas: TextArea[];
  csvData: CSVData;
  outputFormat: 'png' | 'jpeg';
  quality: 'low' | 'medium' | 'high';
  fileNaming: string; // template for file names
}

interface GenerationProgress {
  total: number;
  completed: number;
  failed: number;
  currentFile: string;
  estimatedTime: number;
}
```

## 🎨 Styling System

### Tailwind CSS Configuration

**Custom Classes**:
```css
/* Certificate-specific styles */
.certificate-canvas {
  @apply border border-gray-300 rounded-lg;
  max-width: 100%;
  height: auto;
}

.text-area {
  @apply absolute border-2 border-dashed border-blue-500;
  cursor: move;
  user-select: none;
}

.text-area.editing {
  @apply border-solid border-green-500;
}
```

### Theme Provider

**Dark/Light Mode Support**:
```typescript
interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}
```

## 🔧 Integration Points

### Custom Template Upload

**API Endpoint**: `POST /api/upload-template`
**Request Format**:
```typescript
interface UploadRequest {
  file: File;
  metadata: {
    name: string;
    dimensions: { width: number; height: number };
    format: 'png' | 'jpeg';
  };
}
```

**Response Format**:
```typescript
interface UploadResponse {
  success: boolean;
  url: string;
  dimensions: { width: number; height: number };
  error?: string;
}
```

### Certificate Generation API

**Endpoint**: `POST /api/generate`
**Request Body**:
```typescript
interface GenerateRequest {
  template: string; // template image URL
  textAreas: TextArea[];
  data: Record<string, string>; // key-value pairs for template variables
  options: {
    format: 'png' | 'jpeg';
    quality: number; // 0-1
    scale: number; // 1-3 for high DPI
  };
}
```

**Response**:
```typescript
interface GenerateResponse {
  success: boolean;
  image: string; // base64 encoded image
  filename: string;
  metadata: {
    width: number;
    height: number;
    size: number; // bytes
  };
}
```

### Batch Processing API

**Endpoint**: `POST /api/batch-generate`
**Request Body**:
```typescript
interface BatchGenerateRequest {
  template: string;
  textAreas: TextArea[];
  csvData: CSVData;
  options: {
    format: 'png' | 'jpeg';
    quality: 'low' | 'medium' | 'high';
    fileNaming: string;
    zipName: string;
  };
}
```

**Response**:
```typescript
interface BatchGenerateResponse {
  success: boolean;
  zipFile: string; // download URL
  summary: {
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  };
}
```

## 🛠️ Utility Functions

### Canvas Utilities

**Text Rendering**:
```typescript
interface CanvasTextRenderer {
  drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    options: TextRenderOptions
  ): void;
  
  measureText(
    ctx: CanvasRenderingContext2D,
    text: string,
    font: string
  ): TextMetrics;
}

interface TextRenderOptions {
  font: string;
  color: string;
  align: 'left' | 'center' | 'right';
  baseline: 'top' | 'middle' | 'bottom';
}
```

**Image Processing**:
```typescript
interface ImageProcessor {
  loadImage(src: string): Promise<HTMLImageElement>;
  resizeImage(img: HTMLImageElement, maxWidth: number, maxHeight: number): string;
  getImageDimensions(src: string): Promise<{ width: number; height: number }>;
}
```

### File Handling

**Download Utilities**:
```typescript
interface FileDownloader {
  downloadImage(dataUrl: string, filename: string): void;
  downloadZip(files: FileData[], zipName: string): Promise<void>;
  generateFilename(template: string, data: Record<string, string>): string;
}

interface FileData {
  name: string;
  data: string; // base64 or blob URL
  type: string;
}
```

## 📱 Browser Compatibility

### Supported Browsers

**Modern Browsers**:
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features**:
- HTML5 Canvas API
- File API
- ES6+ JavaScript
- CSS Grid and Flexbox

### Polyfills

**Included Polyfills**:
- `canvas.toBlob()` for older browsers
- `Promise` and `fetch` for IE11
- `Object.assign()` and array methods

## 🔍 Error Handling

### Common Error Types

**Validation Errors**:
```typescript
class ValidationError extends Error {
  constructor(message: string, field: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
```

**Generation Errors**:
```typescript
class GenerationError extends Error {
  constructor(message: string, code: string) {
    super(message);
    this.name = 'GenerationError';
    this.code = code;
  }
}
```

### Error Responses

**Standard Error Format**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
}
```

## 🚀 Extension Points

### Custom Components

**Adding New Features**:
1. Create component in `components/` directory
2. Add to main application state
3. Integrate with existing canvas system
4. Add configuration options to sidebar

### Plugin Architecture

**Future Extensions**:
- Custom font loading
- Advanced text effects
- Cloud storage integration
- API-based certificate generation
- Template marketplace integration

---

For detailed implementation examples and integration guides, see the [Examples](examples.md) section.