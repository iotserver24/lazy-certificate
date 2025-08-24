# Batch Processing Guide

Master the art of generating hundreds of certificates efficiently using CSV data import and batch processing features.

## 🎯 Overview

Batch processing allows you to generate multiple certificates simultaneously by importing data from CSV files. This feature is perfect for:
- Training programs with multiple participants
- Academic institutions issuing certificates
- Corporate training departments
- Event organizers with large attendee lists

## 📊 CSV Data Structure

### Required Format

**Basic CSV Structure:**
```csv
first_name,last_name,email,course_name,completion_date,score
John,Doe,john@example.com,Web Development Fundamentals,2024-01-15,95
Jane,Smith,jane@example.com,Data Science Bootcamp,2024-01-15,98
Bob,Johnson,bob@example.com,Advanced JavaScript,2024-01-14,92
```

### Column Requirements

**Essential Columns:**
- **Identifier**: Unique ID for each recipient
- **Name Fields**: first_name, last_name, or full_name
- **Achievement**: course_name, program_title, or achievement
- **Date**: completion_date, issue_date, or certificate_date

**Optional Columns:**
- **Email**: For distribution
- **Score**: Numeric or letter grades
- **Duration**: Training hours or course length
- **Certificate ID**: Unique certificate numbers
- **Organization**: Issuing organization name

### Data Validation Rules

**Text Fields:**
- Maximum 100 characters per field
- UTF-8 encoding for special characters
- No line breaks within cells
- Escape commas with quotes: `"Smith, Jr.",John`

**Date Formats:**
- **ISO Format**: 2024-01-15 (recommended)
- **US Format**: January 15, 2024
- **European Format**: 15 January 2024
- **Custom**: Any format supported by your template

**Numeric Fields:**
- Scores: 0-100 or custom ranges
- Percentages: With or without % symbol
- Decimal numbers: Use period (.) as separator

## 🔄 CSV Import Process

### Step-by-Step Import

1. **Prepare Your CSV File:**
   ```csv
   full_name,course,completion_date,instructor,organization
   Alice Johnson,Python Programming,2024-01-15,Dr. Smith,Tech Academy
   Bob Williams,Machine Learning,2024-01-15,Prof. Davis,Data Institute
   ```

2. **Template Configuration:**
   - Ensure text areas use `{{column_name}}` syntax
   - Example: `{{full_name}}` matches CSV column
   - Test with single certificate before batch

3. **Upload CSV:**
   - Click "Batch Processing" in sidebar
   - Select your prepared CSV file
   - Preview first 5 records automatically

4. **Validation:**
   - Check data mapping accuracy
   - Verify special characters display correctly
   - Review date formatting

### Data Mapping Examples

**Template Text Areas:**
```
Certificate awarded to: {{full_name}}
For successfully completing: {{course}}
On this date: {{completion_date}}
Instructor: {{instructor}}
Issued by: {{organization}}
```

**CSV Corresponding Columns:**
- `full_name` → Certificate recipient
- `course` → Course/achievement name
- `completion_date` → Issue date
- `instructor` → Instructor name
- `organization` → Issuing organization

## ⚙️ Batch Generation Settings

### Configuration Options

**File Naming:**
- **Default**: certificate_001.png, certificate_002.png
- **Custom**: {{full_name}}_certificate.png
- **With Date**: {{full_name}}_{{completion_date}}.png

**Output Quality:**
- **High**: 300 DPI (print quality)
- **Medium**: 150 DPI (digital use)
- **Low**: 72 DPI (quick preview)

**Processing Speed:**
- **Fast**: Lower quality, quicker processing
- **Balanced**: Medium quality and speed
- **High Quality**: Best results, slower processing

### Performance Optimization

**Batch Size Recommendations:**
- **Small Batches**: 1-50 certificates (fastest)
- **Medium Batches**: 51-200 certificates (balanced)
- **Large Batches**: 201-1000 certificates (requires patience)

**System Requirements:**
- **Browser**: Chrome or Firefox recommended
- **Memory**: 8GB+ RAM for large batches
- **Storage**: Ensure adequate download space
- **Internet**: Stable connection for cloud processing

## 📋 Advanced CSV Techniques

### Conditional Content

**Using CSV Flags:**
```csv
name,course,date,honors,score
John Doe,Web Dev,2024-01-15,yes,95
Jane Smith,Data Science,2024-01-15,no,85
```

**Template Logic:**
- Use separate text areas for conditional content
- Example: Honors designation only when `honors=yes`
- Create multiple template variations for complex logic

### Multi-Line Text

**Handling Long Content:**
```csv
name,course_description,date
Alice Johnson,"Advanced course covering Python fundamentals, web development, and database integration",2024-01-15
```

**Template Configuration:**
- Use text areas with word wrap enabled
- Adjust line height for multi-line content
- Test with longest expected text

### Special Characters

**International Support:**
```csv
full_name,course,date
María José García,Desarrollo Web,15/01/2024
François Müller,Science des Données,15/01/2024
张伟,Web开发,2024-01-15
```

**Encoding Requirements:**
- Always use UTF-8 encoding
- Test special characters before batch processing
- Verify font support for international characters

## 🎓 Real-World Examples

### Training Department Example

**CSV Structure:**
```csv
employee_name,training_program,completion_date,department,manager,training_hours
Sarah Johnson,Leadership Development,2024-01-15,Marketing,John Smith,40
Mike Chen,Safety Training,2024-01-14,Operations,Lisa Davis,8
Emma Wilson,Project Management,2024-01-13,Engineering,David Brown,24
```

**Template Text Areas:**
```
This certifies that {{employee_name}}
from {{department}} department
has completed {{training_program}}
on {{completion_date}}

Training Hours: {{training_hours}}
Approved by: {{manager}}
```

### Academic Institution Example

**CSV Structure:**
```csv
student_name,program,completion_date,gpa,credits,student_id,graduation_date
Alice Brown,Computer Science,2024-01-15,3.85,120,CS2024001,May 15 2024
Bob Davis,Electrical Engineering,2024-01-15,3.92,125,EE2024002,May 15 2024
```

**Template Text Areas:**
```
This is to certify that {{student_name}}
has successfully completed the requirements for
{{program}}
with a GPA of {{gpa}}
and {{credits}} credit hours

Student ID: {{student_id}}
Date of Graduation: {{graduation_date}}
```

## 🚨 Troubleshooting CSV Issues

### Common Problems and Solutions

**Encoding Issues:**
- **Problem**: Special characters appear garbled
- **Solution**: Save CSV with UTF-8 encoding
- **Tools**: Use Notepad++ or VS Code for encoding

**Delimiter Issues:**
- **Problem**: Commas in text break columns
- **Solution**: Wrap text in quotes: `"Smith, John"`
- **Alternative**: Use semicolon (;) delimiter

**Date Format Issues:**
- **Problem**: Dates display incorrectly
- **Solution**: Use consistent date format throughout CSV
- **Format**: YYYY-MM-DD (ISO format recommended)

**Missing Data:**
- **Problem**: Empty fields in CSV
- **Solution**: Use placeholder text or conditional logic
- **Example**: `{{course_name|N/A}}` displays "N/A" if empty

### Validation Checklist

**Before Processing:**
- [ ] All required columns present
- [ ] No empty required fields
- [ ] Date formats are consistent
- [ ] Special characters display correctly
- [ ] Text length within limits
- [ ] File encoding is UTF-8
- [ ] Preview first 5 records successfully

**During Processing:**
- Monitor progress percentage
- Check for error messages
- Verify file naming convention
- Confirm output quality settings

## 📊 Performance Monitoring

### Processing Metrics

**Time Estimates:**
- **50 certificates**: 2-3 minutes
- **200 certificates**: 8-12 minutes
- **500 certificates**: 20-30 minutes
- **1000 certificates**: 40-60 minutes

**Factors Affecting Speed:**
- Template image size and complexity
- Number of text areas per certificate
- Output quality settings
- Browser and system performance
- Internet connection stability

### Optimization Strategies

**Speed Improvements:**
- Use optimized template images (under 2MB)
- Reduce text areas to essential fields
- Choose appropriate quality settings
- Process in smaller batches
- Close unnecessary browser tabs

**Quality Assurance:**
- Test with 5-10 records first
- Check a sample of generated certificates
- Verify all data maps correctly
- Ensure consistent formatting
- Test download and extraction process

---

Ready to process your first batch? Start with a small test file to validate your setup, then scale up to your full dataset. Check the [Examples](examples.md) section for more real-world scenarios and templates.