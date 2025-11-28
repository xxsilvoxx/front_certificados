[file name]: src/components/Eventos/Eventos.jsx
[file content begin]
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import './Eventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    datas: '',
    carga_horaria: 12,
    dias: 3,
    conteudo: '- PLANO DE FORMAÇÃO DE PROFESSORES\n- INCLUSÃO: DESAFIOS E PERCEPÇÕES\n- TREINAMENTO COM A POLÍCIA MILITAR\n- GESTÃO DAS EMOÇÕES: HÁBITOS, VIVÊNCIAS E ATITUDES\n- METODOLOGIAS ATIVAS DE ENSINO\n- TECNOLOGIAS EDUCACIONAIS\n- AVALIAÇÃO DA APRENDIZAGEM\n- PLANEJAMENTO PEDAGÓGICO'
  });

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getEventos();
      setEventos(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setError('Erro ao carregar eventos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.datas || !formData.carga_horaria || !formData.dias) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    try {
      await apiService.createEvento(formData);
      
      // Limpar formulário
      setFormData({
        nome: '',
        datas: '',
        carga_horaria: 12,
        dias: 3,
        conteudo: '- PLANO DE FORMAÇÃO DE PROFESSORES\n- INCLUSÃO: DESAFIOS E PERCEPÇÕES\n- TREINAMENTO COM A POLÍCIA MILITAR\n- GESTÃO DAS EMOÇÕES: HÁBITOS, VIVÊNCIAS E ATITUDES\n- METODOLOGIAS ATIVAS DE ENSINO\n- TECNOLOGIAS EDUCACIONAIS\n- AVALIAÇÃO DA APRENDIZAGEM\n- PLANEJAMENTO PEDAGÓGICO'
      });
      
      // Recarregar lista
      carregarEventos();
      alert('Evento salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert('Erro ao salvar evento: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este evento?')) {
      try {
        await apiService.deleteEvento(id);
        carregarEventos();
        alert('Evento removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover evento:', error);
        alert('Erro ao remover evento: ' + error.message);
      }
    }
  };

  return (
    <div className="eventos-container">
      <h2>Gerenciar Eventos</h2>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={carregarEventos} style={{marginLeft: '10px'}}>
            Tentar Novamente
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="evento-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="evento-nome">Nome do Evento</label>
            <input
              type="text"
              id="evento-nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              placeholder="Ex: Curso de Formação Continuada"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="evento-datas">Datas do Evento</label>
            <input
              type="text"
              id="evento-datas"
              value={formData.datas}
              onChange={(e) => setFormData({...formData, datas: e.target.value})}
              placeholder="Ex: 18, 19 e 20 de julho de 2023"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="evento-carga-horaria">Carga Horária Total</label>
            <input
              type="number"
              id="evento-carga-horaria"
              value={formData.carga_horaria}
              onChange={(e) => setFormData({...formData, carga_horaria: parseInt(e.target.value) || 0})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="evento-dias">Número de Dias</label>
            <input
              type="number"
              id="evento-dias"
              value={formData.dias}
              onChange={(e) => setFormData({...formData, dias: parseInt(e.target.value) || 0})}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="evento-conteudo">Conteúdo Programático</label>
          <textarea
            id="evento-conteudo"
            value={formData.conteudo}
            onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
            rows="6"
            placeholder="Liste o conteúdo programático, um por linha"
          />
        </div>

        <button type="submit" className="btn btn-success">
          Salvar Evento
        </button>
      </form>

      <h3 style={{marginTop: '30px'}}>Eventos Cadastrados</h3>
      
      {loading ? (
        <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
          Carregando eventos...
        </p>
      ) : eventos.length === 0 ? (
        <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
          Nenhum evento cadastrado ainda.
        </p>
      ) : (
        <table className="eventos-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Datas</th>
              <th>Carga Horária</th>
              <th>Dias</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(evento => (
              <tr key={evento.id}>
                <td>{evento.nome}</td>
                <td>{evento.datas}</td>
                <td>{evento.carga_horaria}h</td>
                <td>{evento.dias}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(evento.id)}
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

export default Eventos;
[file content end]