import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin({ username, role: 'admin' });
    } else {
      alert('Usuário ou senha incorretos!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sistema de Certificados</h2>
        <h3>Coronel Vivida - Educação</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;