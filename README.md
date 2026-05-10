# Neelkanth Elevator – Lift Quotation Form

A React app to fill and export elevator quotation details as a professionally formatted PDF.

## Features
- Pre-filled with data from NEELKANTH SEC. 24 Gandhinagar project
- All fields from the original quotation form (Client Info, Lift Config, Civil Dims, Car & Landing, Control Features)
- Auto-calculated pricing (Cost With Tax, Total Amount)
- One-click PDF export using jsPDF

## Setup & Run

### Prerequisites
- Node.js v16 or higher
- npm v8 or higher

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

The app will open at **http://localhost:3000**

### Build for production
```bash
npm run build
```

## Project Structure
```
src/
  App.js              – Root component
  LiftForm.js         – Main form component with PDF export logic
  LiftForm.module.css – CSS Modules styling
  index.js            – React entry point
  index.css           – Global styles
public/
  index.html          – HTML template
```

## PDF Export
Click **Export PDF** or **Download PDF Quotation** to generate a formatted A4 PDF saved as `Neelkanth_Lift_Quotation.pdf`.
