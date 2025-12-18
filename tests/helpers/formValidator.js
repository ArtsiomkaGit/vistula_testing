const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function loadAssignmentConfig(jsonPath) {
    const configPath = path.resolve(__dirname, '../../', jsonPath);
    const configContent = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configContent);
}

function loadHTMLForm(htmlPath) {
    const htmlPathResolved = path.resolve(__dirname, '../../', htmlPath);
    const htmlContent = fs.readFileSync(htmlPathResolved, 'utf-8');
    const dom = new JSDOM(htmlContent, {
        runScripts: 'outside-only',
        resources: 'usable'
    });
    return dom.window.document;
}

function validateFieldPresence(document, fieldConfig) {
    let field = document.getElementById(fieldConfig.id);
    
    if (!field) {
        if (fieldConfig.type === 'textarea') {
            field = document.querySelector(`textarea[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'select') {
            field = document.querySelector(`select[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'radio') {
            field = document.querySelector(`input[type="radio"][name="${fieldConfig.id}"]`);
        } else {
            field = document.querySelector(`input[name="${fieldConfig.id}"]`) ||
                    document.querySelector(`[name="${fieldConfig.id}"]`);
        }
    }
    
    if (!field) {
        throw new Error(`Field with id/name "${fieldConfig.id}" not found`);
    }
    return true;
}

function validateFieldType(document, fieldConfig) {
    let field = document.getElementById(fieldConfig.id);
    
    if (!field) {
        if (fieldConfig.type === 'textarea') {
            field = document.querySelector(`textarea[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'select') {
            field = document.querySelector(`select[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'radio') {
            field = document.querySelector(`input[type="radio"][name="${fieldConfig.id}"]`);
        } else {
            field = document.querySelector(`input[name="${fieldConfig.id}"]`) ||
                    document.querySelector(`[name="${fieldConfig.id}"]`);
        }
    }
    
    if (!field) {
        throw new Error(`Field with id/name "${fieldConfig.id}" not found`);
    }

    if (fieldConfig.type === 'checkbox') {
        if (field.type !== 'checkbox') {
            throw new Error(`Field "${fieldConfig.id}" should be of type checkbox, but found ${field.type || field.tagName}`);
        }
        return true;
    }

    if (fieldConfig.type === 'textarea') {
        if (field.tagName !== 'TEXTAREA') {
            throw new Error(`Field "${fieldConfig.id}" should be a textarea, but found ${field.tagName}`);
        }
        return true;
    }

    if (fieldConfig.type === 'select') {
        if (field.tagName !== 'SELECT') {
            throw new Error(`Field "${fieldConfig.id}" should be a select, but found ${field.tagName}`);
        }
        return true;
    }

    if (fieldConfig.type === 'radio') {
        if (field.type !== 'radio') {
            throw new Error(`Field "${fieldConfig.id}" should be of type radio, but found ${field.type || field.tagName}`);
        }
        return true;
    }

    if (field.type !== fieldConfig.type) {
        throw new Error(`Field "${fieldConfig.id}" should be of type ${fieldConfig.type}, but found ${field.type || field.tagName}`);
    }
    return true;
}

function validateRequiredAttribute(document, fieldConfig) {
    let field = document.getElementById(fieldConfig.id);
    
    if (!field) {
        if (fieldConfig.type === 'textarea') {
            field = document.querySelector(`textarea[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'select') {
            field = document.querySelector(`select[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'radio') {
            field = document.querySelector(`input[type="radio"][name="${fieldConfig.id}"]`);
        } else {
            field = document.querySelector(`input[name="${fieldConfig.id}"]`) ||
                    document.querySelector(`[name="${fieldConfig.id}"]`);
        }
    }
    
    if (!field) {
        throw new Error(`Field with id/name "${fieldConfig.id}" not found`);
    }

    const isRequired = field.hasAttribute('required');
    
    if (fieldConfig.required && !isRequired) {
        throw new Error(`Field "${fieldConfig.id}" should have required attribute, but it's missing`);
    }
    
    if (!fieldConfig.required && isRequired) {
        throw new Error(`Field "${fieldConfig.id}" should not have required attribute, but it has one`);
    }
    
    return true;
}

function validateFieldValidation(document, fieldConfig) {
    if (!fieldConfig.validation) {
        return true;
    }

    let field = document.getElementById(fieldConfig.id);
    
    if (!field) {
        if (fieldConfig.type === 'textarea') {
            field = document.querySelector(`textarea[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'select') {
            field = document.querySelector(`select[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'radio') {
            field = document.querySelector(`input[type="radio"][name="${fieldConfig.id}"]`);
        } else {
            field = document.querySelector(`input[name="${fieldConfig.id}"]`) ||
                    document.querySelector(`[name="${fieldConfig.id}"]`);
        }
    }
    
    if (!field) {
        throw new Error(`Field with id/name "${fieldConfig.id}" not found`);
    }

    const validation = fieldConfig.validation;

    if (validation.min !== undefined) {
        const minValue = field.getAttribute('min');
        if (minValue !== String(validation.min)) {
            throw new Error(`Field "${fieldConfig.id}" should have min="${validation.min}", but found min="${minValue}"`);
        }
    }

    if (validation.max !== undefined) {
        const maxValue = field.getAttribute('max');
        if (maxValue !== String(validation.max)) {
            throw new Error(`Field "${fieldConfig.id}" should have max="${validation.max}", but found max="${maxValue}"`);
        }
    }

    if (validation.pattern !== undefined) {
        const patternValue = field.getAttribute('pattern');
        if (patternValue !== validation.pattern) {
            throw new Error(`Field "${fieldConfig.id}" should have pattern="${validation.pattern}", but found pattern="${patternValue}"`);
        }
    }

    if (validation.minLength !== undefined) {
        const minLengthValue = field.getAttribute('minlength');
        if (minLengthValue !== String(validation.minLength)) {
            throw new Error(`Field "${fieldConfig.id}" should have minlength="${validation.minLength}", but found minlength="${minLengthValue}"`);
        }
    }

    if (validation.maxLength !== undefined) {
        const maxLengthValue = field.getAttribute('maxlength');
        if (maxLengthValue !== String(validation.maxLength)) {
            throw new Error(`Field "${fieldConfig.id}" should have maxlength="${validation.maxLength}", but found maxlength="${maxLengthValue}"`);
        }
    }

    return true;
}

function validateLabel(document, fieldConfig) {
    let field = document.getElementById(fieldConfig.id);
    
    if (!field) {
        if (fieldConfig.type === 'textarea') {
            field = document.querySelector(`textarea[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'select') {
            field = document.querySelector(`select[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'radio') {
            field = document.querySelector(`input[type="radio"][name="${fieldConfig.id}"]`);
        } else {
            field = document.querySelector(`input[name="${fieldConfig.id}"]`) ||
                    document.querySelector(`[name="${fieldConfig.id}"]`);
        }
    }
    
    if (!field) {
        throw new Error(`Field with id/name "${fieldConfig.id}" not found`);
    }

    if (!fieldConfig.label) {
        return true;
    }

    const label = document.querySelector(`label[for="${fieldConfig.id}"]`);
    
    if (label) {
        const labelText = label.textContent.trim();
        if (!labelText.includes(fieldConfig.label)) {
            throw new Error(`Label for field "${fieldConfig.id}" should contain "${fieldConfig.label}", but found "${labelText}"`);
        }
        return true;
    }

    const parentLabel = field.closest('label');
    if (parentLabel) {
        const labelText = parentLabel.textContent.trim();
        if (!labelText.includes(fieldConfig.label)) {
            throw new Error(`Label for field "${fieldConfig.id}" should contain "${fieldConfig.label}", but found "${labelText}"`);
        }
        return true;
    }

    return true;
}

function validatePlaceholder(document, fieldConfig) {
    if (!fieldConfig.placeholder) {
        return true;
    }

    let field = document.getElementById(fieldConfig.id);
    
    if (!field) {
        if (fieldConfig.type === 'textarea') {
            field = document.querySelector(`textarea[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'select') {
            field = document.querySelector(`select[name="${fieldConfig.id}"]`);
        } else if (fieldConfig.type === 'radio') {
            field = document.querySelector(`input[type="radio"][name="${fieldConfig.id}"]`);
        } else {
            field = document.querySelector(`input[name="${fieldConfig.id}"]`) ||
                    document.querySelector(`[name="${fieldConfig.id}"]`);
        }
    }
    
    if (!field) {
        throw new Error(`Field with id/name "${fieldConfig.id}" not found`);
    }

    if (fieldConfig.type === 'checkbox' || fieldConfig.type === 'radio' || fieldConfig.type === 'select') {
        return true;
    }

    const placeholder = field.getAttribute('placeholder');
    if (placeholder !== fieldConfig.placeholder) {
        throw new Error(`Field "${fieldConfig.id}" should have placeholder="${fieldConfig.placeholder}", but found placeholder="${placeholder}"`);
    }
    
    return true;
}

function validateSubmitButton(document, submitButtonConfig) {
    const button = document.getElementById(submitButtonConfig.id) ||
                   document.querySelector(`button[type="submit"]`);
    
    if (!button) {
        throw new Error(`Submit button with id "${submitButtonConfig.id}" not found`);
    }

    if (button.type !== 'submit') {
        throw new Error(`Button "${submitButtonConfig.id}" should have type="submit", but found type="${button.type}"`);
    }

    if (submitButtonConfig.text) {
        const buttonText = button.textContent.trim();
        if (!buttonText.includes(submitButtonConfig.text)) {
            throw new Error(`Submit button should contain text "${submitButtonConfig.text}", but found "${buttonText}"`);
        }
    }

    return true;
}

function simulateSubmit(formElement) {
    return new Promise((resolve) => {
        const formData = {};
        const inputs = formElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.id || input.name] = input.checked;
            } else if (input.type === 'radio') {
                if (input.checked) {
                    formData[input.name] = input.value;
                }
            } else {
                formData[input.id || input.name] = input.value;
            }
        });

        const submitEvent = new formElement.ownerDocument.defaultView.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        formElement.dispatchEvent(submitEvent);
        
        setTimeout(() => {
            resolve(formData);
        }, 100);
    });
}

module.exports = {
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
};

