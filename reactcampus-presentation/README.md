# ReactCampus Data Analysis Presentation

Professional presentation showcasing the comprehensive data analysis of the ReactCampus project, built with React and IBM Plex typography.

## Features

- **16 Professional Slides** covering complete data architecture analysis
- **IBM Plex Sans Typography** with exact specifications (42pt titles, 24pt content, 16-18pt body)
- **Varied Layout Types**: Cover, Icon-Text Rows, Dashboard Grid, Two-Column, Timeline, Bullet Lists, Section Dividers
- **IBM PPT Pastel Colors** for professional appearance
- **Export Functionality**: Export to PDF and PowerPoint (PPTX) formats
- **Keyboard Navigation**: Arrow keys, Space, Home, End
- **Responsive Design**: Exactly 1280x720px slides (16:9 aspect ratio)

## Installation

```bash
cd reactcampus-presentation
npm install
```

## Running the Presentation

### Interactive Web Version
```bash
npm run dev
```
The presentation will open at `http://localhost:3001`

### Generate Native PowerPoint (Editable)
```bash
npm run generate-pptx
```
This creates `ReactCampus-Data-Analysis.pptx` with fully editable text, shapes, and elements.

## Navigation

- **Arrow Right / Space**: Next slide
- **Arrow Left**: Previous slide
- **Home**: First slide
- **End**: Last slide
- **Click dots**: Jump to specific slide
- **Export buttons**: Top-right corner for PDF/PPTX export

## Presentation Structure

### Slide 1: Cover
- Title: ReactCampus Data Analysis
- Professional IBM blue gradient background

### Slide 2: Project Overview
- Icon-text rows layout
- Key project characteristics

### Slide 3: Key Metrics
- Dashboard grid with 4 key statistics
- Dataset overview metrics

### Slide 4: Data Sources
- Two-column layout
- Primary sources and tech stack

### Slide 5: Section Divider
- Data Flow Architecture section

### Slide 6: Data Pipeline
- Timeline layout
- 7-stage pipeline visualization

### Slide 7: Data Models
- Bullet list layout
- 14 MongoDB collections

### Slide 8: Scoring Algorithm
- Two-column layout (60/40 split)
- 7-component weighted algorithm

### Slide 9: Section Divider
- Data Usage & Analytics section

### Slide 10: Data Usage Patterns
- Icon-text rows layout
- Key usage patterns

### Slide 11: Analytics Capabilities
- Dashboard grid
- Current implementation metrics

### Slide 12: Section Divider
- Data Analyst Focus Areas section

### Slide 13: Focus Areas
- Bullet list with accent background
- Priority initiatives

### Slide 14: Data Quality Assessment
- Two-column layout
- Strengths vs. Risks

### Slide 15: Recommendations
- Bullet list layout
- Immediate to long-term actions

### Slide 16: Conclusion
- Section divider
- Thank you slide

## Export Options

### PDF Export
- Optimized file size (JPEG compression at 85% quality)
- Proper centering with aspect ratio calculations
- Target: Under 5MB for complete presentation

### PowerPoint Export
- PNG format for quality preservation
- Compatible with Microsoft PowerPoint
- Maintains all formatting and layouts

## Technical Details

- **Framework**: React 18 + Vite
- **Typography**: IBM Plex Sans (Google Fonts)
- **Export Libraries**: html2canvas, jsPDF, pptxgenjs
- **Dimensions**: 1280x720px (16:9 aspect ratio)
- **Color System**: IBM PPT Pastel Colors
- **Spacing**: 8px base unit, 60px top, 80px sides, 40px bottom margins

## File Structure

```
reactcampus-presentation/
├── src/
│   ├── components/
│   │   └── slides/
│   │       ├── CoverSlide.jsx/css
│   │       ├── IconTextRowsSlide.jsx/css
│   │       ├── DashboardGridSlide.jsx/css
│   │       ├── TwoColumnSlide.jsx/css
│   │       ├── TimelineSlide.jsx/css
│   │       ├── BulletSlide.jsx/css
│   │       └── SectionDividerSlide.jsx/css
│   ├── styles/
│   │   └── global.css
│   ├── utils/
│   │   └── export.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Customization

To customize the presentation content, edit `src/App.jsx` and modify the slides array. Each slide component accepts different props based on its layout type.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Export functionality tested on all major browsers

## License

Part of the ReactCampus project.
## Export Options

### Native PowerPoint (Recommended) ⭐
**Command:** `npm run generate-pptx`
- **Fully Editable** - All text, shapes, and colors can be modified in PowerPoint
- **Native Format** - Real .pptx file using PptxGenJS library
- **Professional Quality** - Exact positioning and styling
- **Small File Size** - ~50KB (no embedded images)
- **Compatible** - Works with Microsoft PowerPoint, Google Slides, LibreOffice

### Browser-Based Export (Alternative)
**Via Web Interface:** Click export buttons at http://localhost:3001
- **PDF Export** - Optimized file size (JPEG compression at 85% quality)
- **PowerPoint Export** - Image-based slides (not editable)
- **Use Case** - Quick exports for viewing only

---
