# Troubleshooting Guide

Common issues and solutions for Lazy Certification users.

## 🚨 Quick Fixes

### Template Upload Issues

**Problem: "File type not supported" error**
- **Solution**: Ensure you're uploading PNG or JPEG files only
- **Check**: File extension is .png, .jpg, or .jpeg
- **Verify**: File isn't corrupted by opening in image viewer

**Problem: Template appears blurry**
- **Solution**: Use higher resolution images (minimum 1000x700 pixels)
- **Check**: Image resolution in image properties
- **Fix**: Re-export template at higher DPI (300 DPI recommended)

**Problem: Large file sizes causing slow loading**
- **Solution**: Compress images to under 5MB
- **Tools**: Use TinyPNG, ImageOptim, or built-in compression
- **Balance**: Maintain quality while reducing file size

### Text Area Problems

**Problem: Text areas not appearing**
- **Solution**: Click directly on the template image
- **Check**: Template is properly loaded and visible
- **Verify**: No browser zoom interfering with clicks

**Problem: Text positioning is off**
- **Solution**: Use arrow keys for precise positioning
- **Check**: Grid overlay is enabled for alignment
- **Tip**: Zoom in (200%) for pixel-perfect placement

**Problem: Text too small/large**
- **Solution**: Adjust font size in text properties panel
- **Range**: Use 12-200px for optimal readability
- **Test**: Preview at 100% zoom for actual size

### CSV Import Issues

**Problem: "Invalid CSV format" error**
- **Solution**: Ensure CSV has proper header row
- **Format**: First row should be column names
- **Example**: `name,email,course,date` as first line

**Problem: Special characters displaying incorrectly**
- **Solution**: Save CSV with UTF-8 encoding
- **Tools**: Use Excel, Google Sheets, or text editor with UTF-8
- **Verify**: Open CSV in text editor to check encoding

**Problem: Date formats not recognized**
- **Solution**: Use consistent date format throughout CSV
- **Recommended**: YYYY-MM-DD format (2024-01-15)
- **Alternative**: January 15, 2024 format also supported

## 🔍 Common Error Messages

### Generation Errors

**"Canvas too large" error**
- **Cause**: Template image exceeds browser memory limits
- **Solution**: Reduce template dimensions or file size
- **Maximum**: Keep under 5000x5000 pixels

**"Out of memory" error**
- **Cause**: Large batch processing with limited RAM
- **Solution**: Process in smaller batches (50-100 certificates)
- **Tip**: Close other browser tabs and applications

**"Network error during generation"**
- **Cause**: Unstable internet connection
- **Solution**: Check connection stability
- **Alternative**: Try again with smaller batch size

### Browser-Specific Issues

**Chrome/Edge Issues**
- **Problem**: Canvas not rendering correctly
- **Solution**: Update browser to latest version
- **Fix**: Clear browser cache and cookies

**Firefox Issues**
- **Problem**: Font rendering issues
- **Solution**: Disable hardware acceleration in Firefox settings
- **Path**: Settings > General > Performance > Uncheck "Use hardware acceleration"

**Safari Issues**
- **Problem**: File upload not working
- **Solution**: Ensure Safari has file access permissions
- **Check**: System Preferences > Security & Privacy > Files and Folders

## 🛠️ Advanced Troubleshooting

### Performance Optimization

**Slow certificate generation**
- **Check**: Browser memory usage in Task Manager
- **Optimize**: Use smaller template images (under 2MB)
- **Reduce**: Number of text areas per certificate
- **Upgrade**: Use modern browser (Chrome 90+ recommended)

**Large file downloads**
- **Cause**: High-resolution images in batch processing
- **Solution**: Use medium quality setting for digital certificates
- **Balance**: 150 DPI sufficient for most use cases

### Data Validation Issues

**CSV data not mapping correctly**
- **Check**: Column names match template variables exactly
- **Case Sensitive**: `{{Name}}` ≠ `{{name}}`
- **Spaces**: Use underscores in column names: `first_name`

**Missing data in certificates**
- **Verify**: CSV contains data for all mapped fields
- **Check**: No empty cells in required columns
- **Solution**: Use placeholder text for optional fields

## 📱 Mobile Device Issues

### Touch Screen Problems

**Problem: Can't position text precisely**
- **Solution**: Use desktop/laptop for precision work
- **Alternative**: Zoom in for better touch accuracy
- **Tip**: Enable grid overlay for alignment assistance

**Problem: File upload not working**
- **Solution**: Use device's file manager
- **Check**: Browser has file access permissions
- **Try**: Different browser (Chrome Mobile recommended)

### Responsive Design Issues

**Problem: Interface elements overlapping**
- **Solution**: Use landscape orientation
- **Check**: Browser zoom is set to 100%
- **Clear**: Browser cache and refresh page

## 🔧 Browser Console Debugging

### Developer Tools Guide

**Opening Console:**
- **Chrome/Edge**: F12 or Ctrl+Shift+I
- **Firefox**: F12 or Ctrl+Shift+K
- **Safari**: Cmd+Opt+C (enable in Preferences)

**Common Console Errors:**

```
TypeError: Cannot read property 'getContext' of null
- **Cause**: Canvas element not found
- **Solution**: Refresh page, check if template loaded

RangeError: Maximum call stack size exceeded
- **Cause**: Infinite loop in processing
- **Solution**: Reduce batch size, restart browser

NetworkError: Failed to fetch
- **Cause**: CORS or network issues
- **Solution**: Check internet connection, try different network
```

### Performance Monitoring

**Memory Usage Check:**
```javascript
// Run in console to check memory
console.log('Memory usage:', performance.memory);
```

**Canvas Performance:**
```javascript
// Check canvas rendering time
console.time('canvas-render');
// Trigger certificate generation
console.timeEnd('canvas-render');
```

## 📝 Data Recovery

### Recovering Lost Work

**Browser crashed during work**
- **Check**: Browser's session restore
- **Prevention**: Save template configuration regularly
- **Future**: Export template as backup before major changes

**Accidentally deleted text areas**
- **Solution**: Use Ctrl+Z (Cmd+Z on Mac) to undo
- **Limitation**: Undo history may be limited
- **Prevention**: Save work frequently

### Backup Strategies

**Template Backup**
- **Save**: Original template image files
- **Document**: Text area positions and styles
- **Store**: Cloud storage for easy access

**Configuration Export**
- **Manual**: Screenshot of text area positions
- **Text**: Copy text content to separate document
- **Values**: Note font sizes, colors, and positions

## 🆘 Getting Help

### Before Contacting Support

**Gather Information:**
- Browser type and version
- Operating system
- Template file size and dimensions
- CSV file structure (first 3 rows)
- Exact error message
- Steps to reproduce issue

**Screenshot Guidelines**
- **Full screen**: Include browser and URL bar
- **Error messages**: Capture any error dialogs
- **Template**: Show template with text areas
- **Console**: Include any browser console errors

### Community Resources

**GitHub Issues**
- **Report**: Create detailed issue with reproduction steps
- **Template**: Include sample template and CSV data
- **Screenshots**: Add visual examples of problems

**Documentation**
- **Check**: All relevant documentation sections
- **Search**: Existing issues for similar problems
- **Update**: Ensure using latest version

## ✅ Quick Diagnostic Checklist

### Template Issues
- [ ] File format is PNG or JPEG
- [ ] File size under 10MB
- [ ] Resolution 1000x700 pixels minimum
- [ ] Image opens correctly in image viewer

### CSV Issues
- [ ] UTF-8 encoding used
- [ ] Proper header row present
- [ ] No empty required fields
- [ ] Date format consistent
- [ ] Special characters display correctly

### Browser Issues
- [ ] Using supported browser (Chrome 90+)
- [ ] Browser updated to latest version
- [ ] JavaScript enabled
- [ ] Sufficient memory available
- [ ] Internet connection stable

### Generation Issues
- [ ] Template loaded successfully
- [ ] Text areas properly positioned
- [ ] CSV data maps correctly
- [ ] Preview shows expected results
- [ ] Batch size appropriate for system

---

Still experiencing issues? Create a detailed report including:
1. Steps to reproduce
2. Expected vs actual behavior
3. Screenshots of error messages
4. Sample template and CSV data
5. Browser and system information

Visit our [GitHub Issues](https://github.com/iotserver24/lazy-certificate/issues) to report problems or get additional help.