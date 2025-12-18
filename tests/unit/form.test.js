const {
    loadAssignmentConfig,
    loadHTMLForm,
    validateFieldPresence,
    validateFieldType,
    validateRequiredAttribute,
    validateFieldValidation,
    validateLabel,
    validatePlaceholder,
    validateSubmitButton,
    simulateSubmit
} = require('../helpers/formValidator');

const assignmentPath = 'assignments/registration.json';
const htmlPath = 'student-app/index.html';
const assignmentConfig = loadAssignmentConfig(assignmentPath);

describe('Form Validation Tests', () => {
    let document;

    beforeAll(() => {
        document = loadHTMLForm(htmlPath);
    });

    describe('Assignment Configuration', () => {
        test('should load assignment configuration from JSON', () => {
            expect(assignmentConfig).toBeDefined();
            expect(assignmentConfig.id).toBeDefined();
            expect(assignmentConfig.fields).toBeDefined();
            expect(Array.isArray(assignmentConfig.fields)).toBe(true);
            expect(assignmentConfig.fields.length).toBeGreaterThanOrEqual(10);
        });

        test('should have submit button configuration', () => {
            expect(assignmentConfig.submitButton).toBeDefined();
            expect(assignmentConfig.submitButton.id).toBeDefined();
        });
    });

    describe('Form Structure', () => {
        test('should have a form element', () => {
            const form = document.querySelector('form');
            expect(form).toBeDefined();
        });

        test('should have at least 10 form fields', () => {
            const inputs = document.querySelectorAll('input, select, textarea');
            expect(inputs.length).toBeGreaterThanOrEqual(10);
        });
    });

    describe('Field Presence', () => {
        test.each(assignmentConfig.fields.map(f => [f.id, f]))('should have field with id "%s"', (fieldId, fieldConfig) => {
            expect(() => validateFieldPresence(document, fieldConfig)).not.toThrow();
        });
    });

    describe('Field Types', () => {
        test.each(assignmentConfig.fields.map(f => [f.id, f.type, f]))('field "%s" should have correct type "%s"', (fieldId, fieldType, fieldConfig) => {
            expect(() => validateFieldType(document, fieldConfig)).not.toThrow();
        });
    });

    describe('Required Fields', () => {
        test.each(assignmentConfig.fields.map(f => [f.id, f]))('field "%s" should have correct required attribute', (fieldId, fieldConfig) => {
            expect(() => validateRequiredAttribute(document, fieldConfig)).not.toThrow();
        });
    });

    describe('Field Validation Attributes', () => {
        test.each(assignmentConfig.fields.filter(f => f.validation).map(f => [f.id, f]))('field "%s" should have correct validation attributes', (fieldId, fieldConfig) => {
            expect(() => validateFieldValidation(document, fieldConfig)).not.toThrow();
        });
    });

    describe('Labels', () => {
        test.each(assignmentConfig.fields.filter(f => f.label).map(f => [f.id, f]))('field "%s" should have correct label', (fieldId, fieldConfig) => {
            expect(() => validateLabel(document, fieldConfig)).not.toThrow();
        });
    });

    describe('Placeholders', () => {
        test.each(assignmentConfig.fields.filter(f => f.placeholder).map(f => [f.id, f]))('field "%s" should have correct placeholder', (fieldId, fieldConfig) => {
            expect(() => validatePlaceholder(document, fieldConfig)).not.toThrow();
        });
    });

    describe('Submit Button', () => {
        test('should have submit button with correct configuration', () => {
            expect(() => validateSubmitButton(document, assignmentConfig.submitButton)).not.toThrow();
        });

        test('submit button should be of type submit', () => {
            const button = document.getElementById(assignmentConfig.submitButton.id);
            expect(button).toBeDefined();
            expect(button.type).toBe('submit');
        });
    });

    describe('Form Submission', () => {
        test('should be able to simulate form submission', async () => {
            const form = document.querySelector('form');
            expect(form).toBeDefined();
            
            const formData = await simulateSubmit(form);
            expect(formData).toBeDefined();
            expect(typeof formData).toBe('object');
        });

        test('should collect all field values on submission', async () => {
            const form = document.querySelector('form');
            
            assignmentConfig.fields.forEach(fieldConfig => {
                const field = document.getElementById(fieldConfig.id) || 
                             document.querySelector(`input[name="${fieldConfig.id}"]`);
                if (field && field.type !== 'submit') {
                    if (field.type === 'checkbox') {
                        field.checked = true;
                    } else if (field.type === 'number') {
                        field.value = '25';
                    } else {
                        field.value = `test_${fieldConfig.id}`;
                    }
                }
            });

            const formData = await simulateSubmit(form);
            
            assignmentConfig.fields.forEach(fieldConfig => {
                if (fieldConfig.type !== 'submit') {
                    const field = document.getElementById(fieldConfig.id) || 
                                 document.querySelector(`input[name="${fieldConfig.id}"]`);
                    if (field && field.type === 'checkbox') {
                        expect(formData[fieldConfig.id]).toBeDefined();
                    } else if (field && field.type !== 'submit') {
                        expect(formData[fieldConfig.id]).toBeDefined();
                    }
                }
            });
        });
    });
});

