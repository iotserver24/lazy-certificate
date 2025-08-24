# User Guide - Lazy Certification

This comprehensive guide covers all features and functionality of Lazy Certification in detail.

## 🎯 Overview

Lazy Certification is designed to make certificate generation simple and efficient. Whether you're creating one certificate or hundreds, this guide will help you master all the features.

## 📋 Interface Overview

### Main Canvas Area
- **Central workspace** where your template is displayed
- **Interactive elements** - click to add/edit text areas
- **Zoom controls** - bottom right corner for precise positioning
- **Grid overlay** - toggle for alignment assistance

### Sidebar Components
- **Template Tools**: Upload, clear, and manage templates
- **Text Properties**: Font, size, color, and alignment controls
- **Canvas Controls**: Zoom, grid, and background settings
- **Generation Panel**: Single and batch processing options

## 🖼️ Template Management

### Uploading Templates

**Supported Formats:**
- PNG (recommended for transparency)
- JPEG
- Maximum file size: 10MB
- Recommended resolution: 1920x1080 or higher

**Upload Methods:**
1. **Drag & Drop**: Drag files directly onto the canvas
2. **File Selector**: Click "Upload Template" button
3. **Replace**: Upload a new template to replace the current one

### Template Best Practices

**Design Guidelines:**
- Leave adequate space for text insertion
- Use high-resolution images (300 DPI for print quality)
- Consider text contrast when choosing background colors
- Test with actual content before bulk generation

**Common Template Sizes:**
- A4 Landscape (297mm x 210mm) - 3508 x 2480 pixels
- US Letter Landscape (11" x 8.5") - 3300 x 2550 pixels
- Square certificates - 2000 x 2000 pixels

## 📝 Text Area Management

### Adding Text Areas

**Methods:**
1. **Click to Add**: Single-click anywhere on the template
2. **Precise Placement**: Click and drag to create a specific size
3. **Duplicate**: Select a text area and press Ctrl+D (Cmd+D on Mac)

### Text Properties

**Font Controls:**
- **Family**: System fonts including Arial, Times, Helvetica, Georgia
- **Size**: 8px to 200px range
- **Weight**: 100-900 numeric scale, plus normal/bold presets
- **Style**: Normal, italic, oblique

**Color & Effects:**
- **Color Picker**: Full RGB/HSV color selection
- **Hex Input**: Manual hex color codes (#RRGGBB)
- **Opacity**: 0-100% transparency control

**Alignment & Positioning:**
- **Horizontal**: Left, center, right alignment
- **Vertical**: Top, middle, bottom alignment
- **Line Height**: Control spacing between lines
- **Letter Spacing**: Fine-tune character spacing

### Advanced Text Features

**Dynamic Content:**
- Use `{{column_name}}` syntax for CSV batch processing
- Example: `{{first_name}} {{last_name}}` pulls from CSV columns

**Text Effects:**
- **Shadow**: Add drop shadows for better readability
- **Stroke**: Outline text for contrast on busy backgrounds
- **Rotation**: Rotate text areas for angled designs

## 🔍 Canvas Controls

### Zoom & Navigation

**Zoom Levels:**
- **25%**: Overview mode
- **50%**: General editing
- **100%**: Actual size
- **200%**: Precision editing
- **Fit**: Auto-fit to window

**Navigation Shortcuts:**
- **Zoom In**: Ctrl/Cmd + Plus
- **Zoom Out**: Ctrl/Cmd + Minus
- **Reset Zoom**: Ctrl/Cmd + 0
- **Pan**: Spacebar + drag

### Grid & Alignment

**Grid Options:**
- **Show/Hide**: Toggle visibility
- **Snap to Grid**: Automatic alignment
- **Grid Size**: 10px, 20px, or 50px spacing
- **Color**: Customizable grid color

**Alignment Tools:**
- **Smart Guides**: Automatic alignment with other elements
- **Distribute**: Evenly space multiple text areas
- **Center**: Center elements on canvas

## 🔄 Batch Processing

### CSV Import

**File Requirements:**
- **Format**: Standard CSV with header row
- **Encoding**: UTF-8 recommended
- **Delimiter**: Comma-separated values
- **Maximum**: 1000 rows per batch

**CSV Structure:**
```csv
first_name,last_name,course,date,score
John,Doe,Web Development,2024-01-15,95
Jane,Smith,Data Science,2024-01-15,98
```

**Mapping Data:**
- Use exact column names in text areas: `{{first_name}}`
- Handle missing data gracefully
- Special characters supported in UTF-8

### Batch Generation Process

**Steps:**
1. **Prepare CSV**: Ensure data matches your template fields
2. **Upload CSV**: Use the batch processing panel
3. **Preview**: Review first few certificates
4. **Generate**: Start batch processing
5. **Download**: Receive ZIP file with all certificates

**Progress Tracking:**
- Real-time progress percentage
- Individual certificate status
- Error reporting for failed generations
- Estimated time remaining

### Batch Best Practices

**Data Preparation:**
- Validate CSV data before import
- Use consistent date formats
- Test with 5-10 records first
- Include unique identifiers for file naming

**Performance Tips:**
- Use optimized images (under 2MB)
- Limit to 500 certificates per batch
- Close other browser tabs during generation
- Use modern browser (Chrome/Firefox recommended)

## 📊 Quality Control

### Preview Features

**Single Certificate Preview:**
- **Live Preview**: See changes in real-time
- **Full Resolution**: Check final quality
- **Download Sample**: Test before batch generation

**Batch Preview:**
- **First 5 Records**: Preview initial certificates
- **Data Validation**: Check CSV mapping
- **Error Detection**: Identify issues early

### Testing Checklist

Before generating certificates:
- [ ] Template resolution is adequate
- [ ] All text areas are correctly positioned
- [ ] Fonts render correctly at chosen sizes
- [ ] Colors have sufficient contrast
- [ ] CSV data maps correctly to template fields
- [ ] File naming convention is appropriate

## 🎨 Advanced Techniques

### Template Variations

**Multiple Templates:**
- Create different templates for various certificate types
- Use consistent branding across templates
- Test cross-template compatibility

**Conditional Content:**
- Use CSV flags for optional text areas
- Example: `{{#if honors}}With Honors{{/if}}`

### Performance Optimization

**Image Optimization:**
- Use compressed PNGs for web display
- Balance quality vs. file size
- Consider progressive JPEG for large templates

**Browser Recommendations:**
- **Chrome**: Best performance and compatibility
- **Firefox**: Good alternative with similar features
- **Safari**: macOS optimized, limited Windows support
- **Edge**: Chromium-based, good compatibility

---

Ready to explore batch processing? Check out the [Batch Processing Guide](batch-processing.md) for detailed instructions on generating hundreds of certificates efficiently.