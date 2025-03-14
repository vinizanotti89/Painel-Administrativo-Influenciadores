import React, { useState, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import useTranslation from '@/hooks/useTranslation';
import '@/styles/components/ui/Toast.css';

// Criação do contexto para o sistema de toast
const ToastContext = createContext(null);

/**
 * Componente individual de toast
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.id - ID único do toast
 * @param {string} props.title - Título do toast
 * @param {string} props.description - Descrição detalhada do toast
 * @param {string} props.variant - Variante visual (default, success, error, warning, info)
 * @param {Function} props.onClose - Função para fechar o toast
 * @param {number} props.duration - Duração em ms antes do fechamento automático
 */
const ToastItem = ({ id, title, description, variant = 'default', onClose, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(true);
    const { translate } = useTranslation();

    useEffect(() => {
        if (duration !== Infinity) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), 300); // Permite a animação de saída
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, id, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
    };

    return (
        <div
            className={`toast-item ${isVisible ? 'toast-visible' : 'toast-hidden'} toast-${variant}`}
            role="alert"
            aria-live="polite"
        >
            <div className="toast-content">
                {variant !== 'default' && (
                    <div className="toast-icon">
                        {variant === 'success' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        {variant === 'error' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        {variant === 'warning' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        {variant === 'info' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                )}
                <div className="toast-body">
                    {title && <h3 className="toast-title">{title}</h3>}
                    {description && <p className="toast-description">{description}</p>}
                </div>
                <button
                    className="toast-close-button"
                    onClick={handleClose}
                    aria-label={translate('toast.close') || 'Fechar'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

/**
 * Provedor do sistema de toast
 * Deve envolver a aplicação para fornecer funcionalidade de toast
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Elementos filhos
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Função para adicionar um novo toast
    const addToast = (toast) => {
        const id = Date.now().toString();
        setToasts((prevToasts) => [...prevToasts, { id, ...toast }]);
        return id;
    };

    // Função para remover um toast pelo ID
    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    // Criação do container para o portal, se necessário
    useEffect(() => {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {typeof document !== 'undefined' && document.getElementById('toast-container') && createPortal(
                <div className="toast-wrapper">
                    {toasts.map((toast) => (
                        <ToastItem
                            key={toast.id}
                            id={toast.id}
                            title={toast.title}
                            description={toast.description}
                            variant={toast.variant}
                            duration={toast.duration}
                            onClose={removeToast}
                        />
                    ))}
                </div>,
                document.getElementById('toast-container')
            )}
        </ToastContext.Provider>
    );
};

/**
 * Hook para utilizar o sistema de toast em componentes funcionais
 * 
 * @returns {Object} Funções toast e dismiss para mostrar e remover toasts
 */
export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast deve ser usado dentro de um ToastProvider');
    }

    return {
        toast: (props) => context.addToast(props),
        dismiss: (id) => context.removeToast(id)
    };
};

/**
 * Função para acesso global ao sistema de toast (para uso em arquivos não-React)
 * 
 * @param {Object} props - Propriedades do toast a ser exibido
 * @returns {string} ID do toast criado
 */
export const toast = (props) => {
    const toastContainer = document.getElementById('toast-container');

    if (!toastContainer) {
        console.warn('Toast container não encontrado. Certifique-se de que o ToastProvider está sendo usado.');
        return;
    }

    // Usar um ID baseado em timestamp
    const id = Date.now().toString();

    // Criar um elemento para o novo toast e adicioná-lo ao container
    const toastElement = document.createElement('div');
    toastElement.id = `toast-element-${id}`;
    toastElement.className = 'toast-item-wrapper';
    toastContainer.appendChild(toastElement);

    // Renderizar o toast no elemento
    const ReactDOM = require('react-dom');
    ReactDOM.render(
        <ToastItem
            id={id}
            title={props.title}
            description={props.description}
            variant={props.variant}
            duration={props.duration}
            onClose={() => {
                // Limpar após o fechamento
                setTimeout(() => {
                    if (toastElement.parentNode) {
                        ReactDOM.unmountComponentAtNode(toastElement);
                        toastElement.remove();
                    }
                }, 300);
            }}
        />,
        toastElement
    );

    return id;
};

