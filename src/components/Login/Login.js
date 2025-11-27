[file name]: src/components/Login/Login.jsx
[file content begin]
import React, { useState } from 'react';
import { authService } from '../../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validação básica
    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(username, password);
      if (response.success) {
        onLogin(response.user);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao conectar com o servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setUsername('coronelvivida');
    setPassword('educacao@2024');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="logo">CV</div>
          <h2>Sistema de Certificados</h2>
          <h3>Coronel Vivida - Educação</h3>
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Conectando...
              </>
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Prefeitura Municipal de Coronel Vivida</p>
          <p>Secretaria de Educação, Cultura e Desporto</p>
          
          <div className="demo-info">
            <button 
              type="button" 
              className="demo-btn"
              onClick={handleDemoFill}
            >
              Preencher Credenciais de Teste
            </button>
            <div className="demo-credentials">
              <p><strong>Usuário:</strong> coronelvivida</p>
              <p><strong>Senha:</strong> educacao@2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
[file content end]