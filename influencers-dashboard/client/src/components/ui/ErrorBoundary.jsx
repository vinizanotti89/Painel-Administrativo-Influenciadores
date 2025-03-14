import React, { Component } from 'react';
import { errorService } from '@/lib/errorMessages';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';
import '@/styles/components/ui/errorBoundary.css';

/**
 * Componente de limite de erro para capturar erros em componentes filhos
 * e exibir uma interface de erro amigável
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Atualiza o estado para que a próxima renderização mostre a UI de fallback
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error, errorInfo) {
        // Registra detalhes do erro para análise
        this.setState({ errorInfo });

        // Reporta o erro ao serviço de erro centralizado
        errorService.reportError('react_error_boundary', error, {
            component: this.props.componentName || 'Unknown',
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        const { hasError, error } = this.state;
        const { fallback, children } = this.props;

        if (hasError) {
            // Renderiza o fallback personalizado, se fornecido
            if (fallback) {
                return React.cloneElement(fallback, {
                    error,
                    reset: this.handleReset
                });
            }

            // Renderiza a interface de erro padrão
            return (
                <div className="error-boundary-container">
                    <h2 className="error-boundary-title">
                        Algo deu errado
                    </h2>

                    <ApiErrorAlert
                        error={error}
                        autoClose={false}
                        className="error-boundary-alert"
                    />

                    <p className="error-boundary-message">
                        Tente atualizar a página ou entrar em contato com o suporte se o problema persistir.
                    </p>

                    <div className="error-boundary-actions">
                        <button
                            onClick={this.handleReset}
                            className="error-boundary-button primary-button"
                        >
                            Tentar novamente
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="error-boundary-button secondary-button"
                        >
                            Recarregar página
                        </button>
                    </div>
                </div>
            );
        }

        // Renderiza os filhos normalmente quando não há erro
        return children;
    }
}

export default ErrorBoundary;