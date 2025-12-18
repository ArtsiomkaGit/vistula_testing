# Student Assignment: HTML Form Creation

This is your assignment project. You will create an HTML form based on the requirements specified in the assignment configuration file.

## Assignment Overview

Your task is to create a functional HTML form with JavaScript that meets all the requirements specified in the assignment configuration. The form will be automatically tested to verify it meets the requirements.

## Getting Started

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Read the Assignment Requirements

Open `assignments/registration.json` to see the detailed requirements for your form. This file contains:
- All fields you need to create
- Field types (text, email, number, password, etc.)
- Which fields are required
- Labels and placeholders for each field
- Validation rules (min, max, pattern, etc.)

### Step 3: Create Your Form

1. **Edit `student-app/index.html`**:
   - Create a form element with the correct ID (as specified in the assignment JSON)
   - Add all required fields with correct IDs, types, and attributes
   - Include labels and placeholders exactly as specified
   - Add a submit button with the correct ID

2. **Edit `student-app/script.js`**:
   - Add JavaScript to handle form submission
   - Prevent the default form submission behavior
   - Collect form data when submitted
   - Display the data (using console.log, alert, or similar)

3. **Edit `student-app/styles.css`** (optional):
   - Add styling to make your form look good
   - Note: Tests do not check styling, only functionality

### Step 4: Test Your Solution

Run the tests to check if your form meets all requirements:

```bash
npm test
```

Or run tests separately:

```bash
npm run test:unit    # Run unit tests only
npm run test:opa     # Run UI tests only
```

### Step 5: Fix Issues

If tests fail:
1. Read the error messages carefully
2. Check what requirements are not met
3. Fix the issues in your code
4. Run tests again
5. Repeat until all tests pass

## Assignment Details

### Current Assignment: Registration Form

**Location:** `assignments/registration.json`

**Requirements:**
- Create a registration form with at least 10 fields
- All fields must match the specifications in the JSON file
- Form must have the correct ID: `registrationForm`
- Submit button must have ID: `submitBtn`
- All required fields must have the `required` attribute
- Field types, labels, and placeholders must match exactly

**Supported Field Types:**
- `text` - Text input
- `email` - Email input
- `number` - Number input
- `password` - Password input
- `tel` - Telephone number
- `date` - Date picker
- `textarea` - Multi-line text
- `select` - Dropdown list
- `radio` - Radio buttons
- `checkbox` - Checkbox

### Example Field Structure

```html
<form id="registrationForm">
  <div class="form-group">
    <label for="firstName">First Name</label>
    <input type="text" id="firstName" name="firstName" 
           placeholder="Enter your first name" required>
  </div>
  
  <button type="submit" id="submitBtn">Submit</button>
</form>
```

## Running the Form

To view your form in a browser:

```bash
npm start
```

Then open `http://localhost:8000` in your browser.

## What the Tests Check

The automated tests verify:

1. **Form Structure:**
   - Form element exists with correct ID
   - Minimum number of fields present

2. **Field Presence:**
   - All required fields from the assignment exist

3. **Field Types:**
   - Each field has the correct input type

4. **Required Attributes:**
   - Required fields have the `required` attribute
   - Optional fields do not have `required`

5. **Validation:**
   - Min/max values for number fields
   - Pattern validation for text/email fields
   - MinLength/maxLength for text fields

6. **Labels and Placeholders:**
   - Labels match the assignment specification
   - Placeholders match the assignment specification

7. **Submit Button:**
   - Submit button exists with correct ID and type

8. **Form Submission:**
   - Form data can be collected on submit

## Important Notes

- Read the assignment JSON file carefully - it contains all the requirements
- Field IDs and names must match exactly as specified
- Labels and placeholders must match exactly (case-sensitive)
- The form must prevent default submission behavior
- All tests must pass for the assignment to be considered complete

## Getting Help

If you encounter issues:
1. Check the error messages from the tests
2. Compare your form structure with the assignment requirements
3. Verify field IDs, types, and attributes match the JSON specification
4. Ensure your JavaScript properly handles form submission

## Requirements

- Node.js (v14 or higher)
- npm

Good luck with your assignment!
