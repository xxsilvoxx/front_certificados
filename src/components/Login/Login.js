import React, { useState, useEffect } from 'react';
import { authService } from '../../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Verificar se já está logado
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      console.log('🔄 Sessão anterior detectada');
    }
  }, []);

  // Validação em tempo real
  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    
    switch (name) {
      case 'username':
        if (!value.trim()) {
          errors.username = 'Usuário é obrigatório';
        } else if (value.length < 3) {
          errors.username = 'Usuário muito curto';
        } else {
          delete errors.username;
        }
        break;
        
      case 'password':
        if (!value) {
          errors.password = 'Senha é obrigatória';
        } else if (value.length < 6) {
          errors.password = 'Senha deve ter pelo menos 6 caracteres';
        } else {
          delete errors.password;
        }
        break;
        
      default:
        break;
    }
    
    setFieldErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro geral quando usuário começar a digitar
    if (error) setError('');
    
    // Validação em tempo real
    validateField(name, value);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Usuário é obrigatório';
    }
    
    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Por favor, corrija os erros antes de continuar.');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Tentando login...');
      const response = await authService.login(formData.username, formData.password);
      
      if (response.success) {
        console.log('✅ Login bem-sucedido');
        
        // Pequeno delay para feedback visual
        setTimeout(() => {
          onLogin(response.user);
        }, 500);
        
      } else {
        throw new Error(response.message || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      // Tratamento específico de erros
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        setError('🌐 Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (error.message.includes('401') || error.message.includes('Credenciais')) {
        setError('🔐 Credenciais inválidas. Verifique usuário e senha.');
      } else {
        setError('❌ Erro inesperado: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setFormData({
      username: 'coronelvivida',
      password: 'educacao@2024'
    });
    setError('');
    setFieldErrors({});
  };

  const isFormValid = formData.username.trim() && formData.password && Object.keys(fieldErrors).length === 0;

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
              name="username"
              placeholder="Usuário"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="username"
              className={fieldErrors.username ? 'input-invalid' : formData.username ? 'input-valid' : ''}
            />
            {fieldErrors.username && (
              <div className="validation-feedback validation-invalid">
                {fieldErrors.username}
              </div>
            )}
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="current-password"
              className={fieldErrors.password ? 'input-invalid' : formData.password ? 'input-valid' : ''}
            />
            {fieldErrors.password && (
              <div className="validation-feedback validation-invalid">
                {fieldErrors.password}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading || !isFormValid}
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
              disabled={loading}
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