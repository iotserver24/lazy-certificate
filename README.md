# Certificate Generator

A powerful and intuitive web-based certificate generator that allows you to create professional certificates in bulk. Upload your certificate template, define text areas for names and other content, customize typography, and generate certificates for multiple recipients at once.

## ✨ Features

- **Template Upload**: Support for PNG, JPEG, and JPG certificate templates up to 10MB
- **Interactive Text Areas**: Click and drag to define areas where text will be placed
- **Rich Typography Controls**: 
  - 30+ Google Fonts + custom font upload support
  - Font size, color, alignment, and styling options
  - Text effects: bold, italic, underline, shadows
  - Letter spacing and line height adjustments
- **Batch Generation**: Process multiple names from manual input or CSV import
- **Real-time Preview**: See exactly how your certificates will look
- **Zoom & Grid**: Precision editing with zoom controls and optional grid overlay
- **Bulk Download**: Generate all certificates as a ZIP file
- **Responsive Design**: Works on desktop and mobile devices
- **Activity Logs**: Track your progress with detailed logging

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd certificate-generator
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 How to Use

1. **Upload Template**: Click "Upload Template" and select your certificate template image
2. **Define Text Areas**: Click "Add Text Area" and drag on the canvas to define where names/text should appear
3. **Customize Typography**: Use the Style tab to adjust fonts, colors, sizes, and effects
4. **Add Recipients**: Input names manually or upload a CSV file with recipient names
5. **Preview**: Use the preview name to see how certificates will look
6. **Generate**: Click "Generate All Certificates" to create and download a ZIP file

### CSV Format

For bulk name import, use a CSV file with names in the first column:
\`\`\`csv
John Doe
Jane Smith
Bob Johnson
\`\`\`

### Supported Fonts

- **Built-in**: 30+ Google Fonts including Roboto, Open Sans, Montserrat, and more
- **Custom Fonts**: Upload your own .ttf, .otf, .woff, or .woff2 files (max 5MB)

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **File Processing**: JSZip for bulk downloads
- **Canvas**: HTML5 Canvas for certificate generation
- **Typography**: Google Fonts API + custom font loading

## 🏗️ Project Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main certificate generator component
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components
│   └── log-viewer.tsx      # Activity log component
├── lib/
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
\`\`\`

## 🔧 Configuration

### Environment Variables

No environment variables are required for basic functionality. The app works out of the box.

### Customization

- **Fonts**: Modify the `GOOGLE_FONTS` array in `app/page.tsx` to add/remove available fonts
- **Styling**: Customize colors and themes in `tailwind.config.ts`
- **File Limits**: Adjust file size limits in the upload handlers

## 📱 Mobile Support

The application is fully responsive and works on mobile devices, though the desktop experience is optimized for the best user experience when working with detailed certificate layouts.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the activity logs in the app for error details
2. Open an issue on GitHub with:
   - Steps to reproduce the problem
   - Browser and OS information
   - Screenshots if applicable

## 🎯 Roadmap

- [ ] Multiple text areas per certificate
- [ ] Advanced text formatting (gradients, outlines)
- [ ] Template library with pre-built designs
- [ ] QR code integration
- [ ] Database integration for recipient management
- [ ] API endpoints for programmatic access

---

**Happy certificate generating! 🎓✨**
