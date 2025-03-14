import React, { useState } from "react";
import '@/styles/components/ui/SocialMediaInput.css';
import { cn } from '@/lib/utils';
import { validateSocialMedia, getErrorMessage, ERROR_CATEGORIES } from '@/lib/errorMessages';

/**
 * Componente de input especializado para dados de redes sociais
 * com validação específica por plataforma
 */
const SocialMediaInput = ({
    name,
    label,
    platform = 'instagram', // instagram, youtube, linkedin
    value,
    onChange,
    onBlur,
    error,
    placeholder = '',
    className = '',
    required = false,
    disabled = false,
    loading = false,
    hint = '',
    ...props
}) => {
    const [localError, setLocalError] = useState('');
    const [touched, setTouched] = useState(false);

    // Ícones para cada plataforma
    const platformIcons = {
        instagram: (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
        youtube: (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
        ),
        linkedin: (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
        )
    };

    // Função para validar o valor conforme a plataforma
    const validateValue = (val) => {
        if (!val && required) {
            return getErrorMessage('required', ERROR_CATEGORIES.VALIDATION);
        }

        if (val) {
            return validateSocialMedia(platform, val);
        }

        return '';
    };

    const handleBlur = (e) => {
        setTouched(true);
        const validationError = validateValue(e.target.value);
        setLocalError(validationError);

        if (onBlur) {
            onBlur(e);
        }
    };

    const handleChange = (e) => {
        // Se já tocou no campo, valida em tempo real
        if (touched) {
            const validationError = validateValue(e.target.value);
            setLocalError(validationError);
        }

        if (onChange) {
            onChange(e);
        }
    };

    // Combinamos o erro externo com o erro local
    const combinedError = error || localError;

    // Formata o input conforme a plataforma
    const formatInputValue = (val) => {
        if (!val) return '';

        // Remove @ se o usuário digitar no Instagram
        if (platform === 'instagram') {
            return val.startsWith('@') ? val.substring(1) : val;
        }

        // Para o LinkedIn, remove "linkedin.com/in/" se o usuário digitar
        if (platform === 'linkedin') {
            if (val.includes('linkedin.com/in/')) {
                const parts = val.split('linkedin.com/in/');
                return parts[parts.length - 1].replace(/\/$/, ''); // Remove barra final se existir
            }
            return val;
        }

        return val;
    };

    // Determina o prefixo para exibição
    const getPrefix = () => {
        if (platform === 'instagram') return '@';
        if (platform === 'linkedin') return 'linkedin.com/in/';
        return '';
    };

    return (
        <div className={cn('social-input-container', className)}>
            {label && (
                <label
                    htmlFor={name}
                    className="input-label"
                >
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}

            <div className={`social-input-wrapper social-input-${platform}`}>
                <span className="social-input-icon">
                    {platformIcons[platform]}
                </span>

                {getPrefix() && (
                    <span className="social-input-prefix">
                        {getPrefix()}
                    </span>
                )}

                <input
                    id={name}
                    name={name}
                    type="text"
                    value={formatInputValue(value)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled || loading}
                    className={cn(
                        'social-input-field',
                        combinedError && 'social-input-error',
                        loading && 'social-input-loading'
                    )}
                    {...props}
                />

                {loading && (
                    <span className="social-input-loading-indicator"
                        aria-label="Carregando..."
                        role="status">
                    </span>
                )}
            </div>

            {combinedError && touched && (
                <p className="error-message" role="alert">
                    {combinedError}
                </p>
            )}

            {hint && !combinedError && (
                <p className="social-input-hint">
                    {hint}
                </p>
            )}
        </div>
    );
};

export default SocialMediaInput;