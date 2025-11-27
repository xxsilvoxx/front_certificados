[file name]: src/components/Login/Login.jsx
[file content begin]
import React, { useState } from 'react';
import { authService } from '../../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('coronelvivida');
  const [password, setPassword] = useState('educacao@2024');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sistema de Certificados</h2>
        <h3>Coronel Vivida - Educação</h3>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Conectando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-info">
          <p><strong>Credenciais para teste:</strong></p>
          <p>Usuário: coronelvivida</p>
          <p>Senha: educacao@2024</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
[file content end]