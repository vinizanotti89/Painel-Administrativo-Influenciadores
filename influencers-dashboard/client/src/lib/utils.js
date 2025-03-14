/**
 * Concatena nomes de classes condicionalmente.
 * Permite combinar classes CSS de forma mais legível.
 * 
 * @param  {...any} classes - Lista de classes ou condições
 * @returns {string} - String concatenada de classes válidas
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formata um número como moeda (R$)
 * 
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata um número com separadores de milhar
 * 
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado com separadores
 */
export function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Trunca um texto com reticências se exceder o comprimento máximo
 * 
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} - Texto truncado
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Obtém a cor para o Trust Score com base no valor
 * 
 * @param {number} score - Valor do Trust Score (0-100)
 * @returns {string} - Classe CSS correspondente
 */
export function getTrustScoreClass(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

/**
 * Converte uma string de data ISO para formato local
 * 
 * @param {string} isoDate - Data em formato ISO
 * @returns {string} - Data formatada
 */
export function formatDate(isoDate) {
  if (!isoDate) return '';
  
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Gera uma cor aleatória em formato hexadecimal
 * 
 * @returns {string} - Cor hexadecimal
 */
export function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}