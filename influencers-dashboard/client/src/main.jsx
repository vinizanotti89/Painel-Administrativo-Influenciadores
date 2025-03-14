import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Logs para depuração
console.log('Main.jsx executando');

try {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Elemento root não encontrado!</div>';
    throw new Error('Elemento root não encontrado no DOM');
  }

  console.log('Root element encontrado:', rootElement);

  // Cria a raiz do React e renderiza a aplicação
  const reactRoot = ReactDOM.createRoot(rootElement);

  // Renderiza um componente básico para teste
  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  console.log('Aplicação renderizada com sucesso');
} catch (error) {
  console.error('Erro crítico ao inicializar a aplicação:', error);
  // Exibe mensagem de erro na página se algo der errado
  document.body.innerHTML += `
    <div style="padding: 20px; margin-top: 20px; background-color: #ffeeee; border: 1px solid #ff0000; color: #ff0000;">
      <h2>Erro ao inicializar a aplicação</h2>
      <p>${error.message}</p>
      <p>Verifique o console para mais detalhes.</p>
    </div>
  `;
}