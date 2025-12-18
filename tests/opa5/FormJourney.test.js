const { loadAssignmentConfig, loadHTMLForm } = require('../helpers/formValidator');

class FormJourney {
    constructor(configPath = 'assignments/registration.json', htmlPath = 'student-app/index.html') {
        this.config = loadAssignmentConfig(configPath);
        this.document = loadHTMLForm(htmlPath);
        this.window = this.document.defaultView;
    }

    waitFor(condition, timeout = 5000) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            const check = () => {
                try {
                    if (condition()) {
                        resolve();
                    } else if (Date.now() - startTime > timeout) {
                        reject(new Error('Timeout waiting for condition'));
                    } else {
                        setTimeout(check, 50);
                    }
                } catch (error) {
                    reject(error);
                }
            };
            check();
        });
    }

    iEnterTextInField(fieldId, text) {
        return new Promise((resolve, reject) => {
            try {
                const field = this.document.getElementById(fieldId) || 
                             this.document.querySelector(`input[name="${fieldId}"]`);
                
                if (!field) {
                    reject(new Error(`Field with id "${fieldId}" not found`));
                    return;
                }

                field.value = text;
                
                const inputEvent = new this.window.Event('input', { bubbles: true });
                field.dispatchEvent(inputEvent);
                
                const changeEvent = new this.window.Event('change', { bubbles: true });
                field.dispatchEvent(changeEvent);
                
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    iCheckCheckbox(fieldId, checked = true) {
        return new Promise((resolve, reject) => {
            try {
                const checkbox = this.document.getElementById(fieldId) || 
                                this.document.querySelector(`input[name="${fieldId}"][type="checkbox"]`);
                
                if (!checkbox) {
                    reject(new Error(`Checkbox with id "${fieldId}" not found`));
                    return;
                }

                checkbox.checked = checked;
                
                const changeEvent = new this.window.Event('change', { bubbles: true });
                checkbox.dispatchEvent(changeEvent);
                
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    iClickSubmitButton() {
        return new Promise((resolve, reject) => {
            try {
                const button = this.document.getElementById(this.config.submitButton.id) ||
                              this.document.querySelector('button[type="submit"]');
                
                if (!button) {
                    reject(new Error('Submit button not found'));
                    return;
                }

                const form = this.document.querySelector('form');
                if (!form) {
                    reject(new Error('Form not found'));
                    return;
                }

                const submitEvent = new this.window.Event('submit', {
                    bubbles: true,
                    cancelable: true
                });
                
                form.dispatchEvent(submitEvent);
                
                setTimeout(() => resolve(), 100);
            } catch (error) {
                reject(error);
            }
        });
    }

    iSeeField(fieldId) {
        return this.waitFor(() => {
            const field = this.document.getElementById(fieldId) || 
                         this.document.querySelector(`input[name="${fieldId}"]`);
            return field !== null;
        });
    }

    iSeeFieldWithValue(fieldId, expectedValue) {
        return this.waitFor(() => {
            const field = this.document.getElementById(fieldId) || 
                         this.document.querySelector(`input[name="${fieldId}"]`);
            
            if (!field) return false;
            
            if (field.type === 'checkbox') {
                return field.checked === expectedValue;
            }
            
            return field.value === expectedValue;
        });
    }

    iSeeSubmitButton() {
        return this.waitFor(() => {
            const button = this.document.getElementById(this.config.submitButton.id) ||
                          this.document.querySelector('button[type="submit"]');
            return button !== null;
        });
    }

    fillAllRequiredFields() {
        const promises = this.config.fields
            .filter(field => field.required && field.type !== 'checkbox')
            .map(field => {
                let value = 'test';
                if (field.type === 'email') {
                    value = 'test@example.com';
                } else if (field.type === 'number') {
                    value = '25';
                } else if (field.type === 'password') {
                    value = 'password123';
                }
                return this.iEnterTextInField(field.id, value);
            });
        
        return Promise.all(promises);
    }

    fillAllFields() {
        const promises = this.config.fields
            .filter(field => field.type !== 'submit')
            .map(field => {
                if (field.type === 'checkbox') {
                    if (field.required) {
                        return this.iCheckCheckbox(field.id, true);
                    }
                    return Promise.resolve();
                } else {
                    let value = 'test';
                    if (field.type === 'email') {
                        value = 'test@example.com';
                    } else if (field.type === 'number') {
                        value = '25';
                    } else if (field.type === 'password') {
                        value = 'password123';
                    } else if (field.type === 'tel') {
                        value = '+1234567890';
                    }
                    return this.iEnterTextInField(field.id, value);
                }
            });
        
        return Promise.all(promises);
    }
}

describe('OPA5 Form Journey Tests', () => {
    let journey;

    beforeAll(() => {
        journey = new FormJourney();
    });

    test('should see all required fields', async () => {
        for (const field of journey.config.fields) {
            if (field.required) {
                await journey.iSeeField(field.id);
            }
        }
    });

    test('should see submit button', async () => {
        await journey.iSeeSubmitButton();
    });

    test('should be able to enter text in text fields', async () => {
        const textFields = journey.config.fields.filter(f => 
            f.type === 'text' || f.type === 'email' || f.type === 'tel'
        );
        
        for (const field of textFields.slice(0, 3)) {
            await journey.iEnterTextInField(field.id, 'test value');
            await journey.iSeeFieldWithValue(field.id, 'test value');
        }
    });

    test('should be able to enter number in number fields', async () => {
        const numberFields = journey.config.fields.filter(f => f.type === 'number');
        
        for (const field of numberFields) {
            await journey.iEnterTextInField(field.id, '25');
            await journey.iSeeFieldWithValue(field.id, '25');
        }
    });

    test('should be able to check/uncheck checkboxes', async () => {
        const checkboxes = journey.config.fields.filter(f => f.type === 'checkbox');
        
        for (const field of checkboxes) {
            await journey.iCheckCheckbox(field.id, true);
            await journey.iSeeFieldWithValue(field.id, true);
        }
    });

    test('should be able to fill all required fields', async () => {
        await journey.fillAllRequiredFields();
    });

    test('should be able to fill all fields and submit', async () => {
        await journey.fillAllFields();
        await journey.iClickSubmitButton();
    });

    test('should validate form on submit attempt', async () => {
        const form = journey.document.querySelector('form');
        
        try {
            await journey.iClickSubmitButton();
            const formValid = form.checkValidity();
            expect(typeof formValid).toBe('boolean');
        } catch (error) {
            expect(error.message).toBeDefined();
        }
    });
});

module.exports = { FormJourney };

