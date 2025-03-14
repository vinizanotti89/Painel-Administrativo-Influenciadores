import React, { useState, useEffect } from "react";
import { errorService } from '@/lib/errorMessages';
import '@/styles/components/ui/EnhancedInput.css';

/**
 * Componente de input aprimorado com validação, estados de carregamento
 * e animações para feedback visual ao usuário
 */
const EnhancedInput = React.forwardRef(({
    name,
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    error,
    placeholder = '',
    className = '',
    required = false,
    disabled = false,
    loading = false,
    validate = null,
    validateOnBlur = true,
    validateOnChange = false,
    hint = '',
    icon = null,
    iconPosition = 'left',
    maxLength = null,
    minLength = null,
    showCharCount = false,
    autoFocus = false,
    ...props
}, ref) => {
    const [localError, setLocalError] = useState('');
    const [touched, setTouched] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Combinamos o erro externo com o erro local
    const combinedError = error || localError;

    // Validação integrada ao sistema de mensagens de erro
    const validateField = (val) => {
        // Se campo requerido está vazio
        if (required && (!val || val.trim() === '')) {
            return errorService.getErrorMessage('required', errorService.ERROR_CATEGORIES.VALIDATION);
        }

        // Se valor existe, verificamos as regras extras
        if (val) {
            // Verificação de comprimento mínimo
            if (minLength && val.length < minLength) {
                return errorService.getErrorMessage('minLength', errorService.ERROR_CATEGORIES.VALIDATION, { length: minLength });
            }

            // Verificação de comprimento máximo
            if (maxLength && val.length > maxLength) {
                return errorService.getErrorMessage('maxLength', errorService.ERROR_CATEGORIES.VALIDATION, { length: maxLength });
            }

            // Validação de email
            if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                return errorService.getErrorMessage('email', errorService.ERROR_CATEGORIES.VALIDATION);
            }

            // Validação de números
            if (type === 'number' && !/^-?\d*(\.\d+)?$/.test(val)) {
                return errorService.getErrorMessage('numeric', errorService.ERROR_CATEGORIES.VALIDATION);
            }
        }

        // Usar função de validação personalizada se fornecida
        if (validate) {
            return validate(val);
        }

        return '';
    };

    // Reseta o erro local quando o valor muda e o input está sendo atualizado
    useEffect(() => {
        if (isDirty && validateOnChange) {
            const validationResult = validateField(value);
            setLocalError(validationResult || '');
        }
    }, [value, validateOnChange, isDirty]);

    const handleBlur = (e) => {
        setTouched(true);

        // Se devemos validar no blur
        if (validateOnBlur) {
            const validationResult = validateField(e.target.value);
            setLocalError(validationResult || '');
        }

        // Chama o onBlur personalizado, se fornecido
        if (onBlur) {
            onBlur(e);
        }
    };

    const handleChange = (e) => {
        setIsDirty(true);

        // Chama o onChange personalizado, se fornecido
        if (onChange) {
            onChange(e);
        }
    };

    // Calcula o comprimento atual e máximo para o contador de caracteres
    const currentLength = value?.length || 0;
    const charCountClass = maxLength && currentLength >= maxLength * 0.9
        ? currentLength >= maxLength
            ? 'char-count-max'
            : 'char-count-warning'
        : '';

    return (
        <div className={`input-container ${className || ''}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="input-label"
                >
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}

            <div className={`input-wrapper ${iconPosition === 'left' ? 'input-has-icon-left' : ''} ${iconPosition === 'right' ? 'input-has-icon-right' : ''}`}>
                {icon && iconPosition === 'left' && (
                    <span className="input-icon input-icon-left">{icon}</span>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    ref={ref}
                    required={required}
                    disabled={disabled || loading}
                    className={`input-field ${combinedError ? 'input-error' : ''} ${loading ? 'input-loading' : ''}`}
                    maxLength={maxLength}
                    minLength={minLength}
                    autoFocus={autoFocus}
                    {...props}
                />

                {loading && (
                    <span className="input-loading-indicator" aria-label="Carregando..." role="status"></span>
                )}

                {icon && iconPosition === 'right' && (
                    <span className="input-icon input-icon-right">{icon}</span>
                )}
            </div>

            <div className="input-footer">
                {combinedError && touched && (
                    <p className="error-message" role="alert">
                        {combinedError}
                    </p>
                )}

                {!combinedError && hint && (
                    <p className="input-hint">
                        {hint}
                    </p>
                )}

                {showCharCount && maxLength && (
                    <span className={`input-char-count ${charCountClass}`}>
                        {currentLength}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    );
});

// Adicionar displayName para ferramentas de dev
EnhancedInput.displayName = "EnhancedInput";

export default EnhancedInput;