import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import './Participantes.css';

const Participantes = () => {
  const [participantes, setParticipantes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [formData, setFormData] = useState({
    evento_id: '',
    nome: '',
    cpf: '',
    email: ''
  });

  useEffect(() => {
    carregarEventos();
    carregarParticipantes();
  }, []);

  const carregarEventos = async () => {
    try {
      const data = await apiService.getEventos();
      setEventos(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      alert('Erro ao carregar eventos. Verifique o backend.');
    }
  };

  const carregarParticipantes = async () => {
    try {
      const data = await apiService.getParticipantes();
      setParticipantes(data);
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.evento_id || !formData.nome || !formData.cpf) {
      alert('Preencha evento, nome e CPF!');
      return;
    }

    try {
      const evento = eventos.find(e => e.id === parseInt(formData.evento_id));
      if (!evento) {
        alert('Evento não encontrado!');
        return;
      }

      // Criar array de frequência baseado no número de dias do evento
      const frequencia = Array(evento.dias).fill(false);

      await apiService.createParticipante({
        ...formData,
        frequencia
      });

      // Limpar formulário
      setFormData({
        evento_id: '',
        nome: '',
        cpf: '',
        email: ''
      });

      carregarParticipantes();
      alert('Participante cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar participante:', error);
      alert('Erro ao cadastrar participante. Verifique se o CPF já foi cadastrado para este evento.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este participante?')) {
      try {
        await apiService.deleteParticipante(id);
        carregarParticipantes();
        alert('Participante removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover participante:', error);
        alert('Erro ao remover participante.');
      }
    }
  };

  return (
    <div className="participantes-container">
      <h2>Cadastro de Participantes</h2>
      
      <div className="form-group">
        <label htmlFor="select-evento-participante">Selecione o Evento:</label>
        <select
          id="select-evento-participante"
          value={formData.evento_id}
          onChange={(e) => setFormData({...formData, evento_id: e.target.value})}
        >
          <option value="">Selecione um evento</option>
          {eventos.map(evento => (
            <option key={evento.id} value={evento.id}>
              {evento.nome}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="participante-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="participante-nome">Nome Completo</label>
            <input
              type="text"
              id="participante-nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              placeholder="Digite o nome completo"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="participante-cpf">CPF</label>
            <input
              type="text"
              id="participante-cpf"
              value={formData.cpf}
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              placeholder="000.000.000-00"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="participante-email">Email</label>
            <input
              type="email"
              id="participante-email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="email@exemplo.com"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Cadastrar Participante
        </button>
      </form>

      <h3 style={{marginTop: '30px'}}>Participantes Cadastrados</h3>
      
      {participantes.length === 0 ? (
        <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
          Nenhum participante cadastrado ainda.
        </p>
      ) : (
        <table className="participantes-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Evento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {participantes.map(participante => (
              <tr key={participante.id}>
                <td>{participante.nome}</td>
                <td>{participante.cpf}</td>
                <td>{participante.email || '-'}</td>
                <td>{participante.evento_nome || 'Evento não encontrado'}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(participante.id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Participantes;