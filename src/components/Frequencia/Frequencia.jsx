import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import './Frequencia.css';

const Frequencia = () => {
  const [eventos, setEventos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [eventoId, setEventoId] = useState('');

  useEffect(() => {
    carregarEventos();
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

  const carregarFrequencia = async (id) => {
    try {
      setEventoId(id);
      const evento = eventos.find(e => e.id === parseInt(id));
      setEventoSelecionado(evento);
      
      const participantesData = await apiService.getParticipantes();
      const participantesEvento = participantesData.filter(p => p.evento_id === parseInt(id));
      setParticipantes(participantesEvento);
    } catch (error) {
      console.error('Erro ao carregar frequência:', error);
    }
  };

  const atualizarFrequencia = async (participanteId, dia, presente) => {
    try {
      const participante = participantes.find(p => p.id === participanteId);
      if (participante) {
        const novaFrequencia = [...participante.frequencia];
        novaFrequencia[dia] = presente;
        
        await apiService.updateParticipanteFrequencia(participanteId, novaFrequencia);
        
        // Atualizar estado local
        const participantesAtualizados = participantes.map(p => 
          p.id === participanteId 
            ? { ...p, frequencia: novaFrequencia }
            : p
        );
        setParticipantes(participantesAtualizados);
      }
    } catch (error) {
      console.error('Erro ao atualizar frequência:', error);
      alert('Erro ao salvar frequência. Verifique o backend.');
    }
  };

  const salvarFrequencia = () => {
    alert('Frequência salva com sucesso!');
  };

  return (
    <div className="frequencia-container">
      <h2>Controle de Frequência</h2>
      
      <div className="form-group">
        <label htmlFor="select-evento-frequencia">Selecione o Evento:</label>
        <select
          id="select-evento-frequencia"
          value={eventoId}
          onChange={(e) => carregarFrequencia(e.target.value)}
        >
          <option value="">Selecione um evento</option>
          {eventos.map(evento => (
            <option key={evento.id} value={evento.id}>
              {evento.nome}
            </option>
          ))}
        </select>
      </div>

      {eventoSelecionado && participantes.length > 0 && (
        <div className="tabela-frequencia-container">
          <p>Marque os dias de presença de cada participante:</p>
          <div style={{overflowX: 'auto'}}>
            <table className="frequencia-table">
              <thead>
                <tr>
                  <th>Participante</th>
                  {Array.from({ length: eventoSelecionado.dias }, (_, i) => (
                    <th key={i} className="frequencia-dia">Dia {i + 1}</th>
                  ))}
                  <th>Presenças</th>
                  <th>Carga Horária</th>
                </tr>
              </thead>
              <tbody>
                {participantes.map(participante => {
                  const presencas = participante.frequencia.filter(p => p).length;
                  const cargaHoraria = Math.round(
                    (eventoSelecionado.carga_horaria * presencas) / eventoSelecionado.dias
                  );
                  
                  return (
                    <tr key={participante.id}>
                      <td>
                        <strong>{participante.nome}</strong><br />
                        <small>CPF: {participante.cpf}</small><br />
                        <small>Email: {participante.email || 'Não informado'}</small>
                      </td>
                      
                      {Array.from({ length: eventoSelecionado.dias }, (_, i) => (
                        <td key={i} className="frequencia-checkbox">
                          <input
                            type="checkbox"
                            checked={participante.frequencia[i] || false}
                            onChange={(e) => 
                              atualizarFrequencia(participante.id, i, e.target.checked)
                            }
                          />
                        </td>
                      ))}
                      
                      <td className="frequencia-total">
                        <strong>{presencas}/{eventoSelecionado.dias}</strong>
                      </td>
                      <td className="frequencia-carga">
                        <strong>{cargaHoraria}h</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="frequencia-actions">
            <button className="btn btn-success" onClick={salvarFrequencia}>
              Salvar Frequência
            </button>
            <small style={{display: 'block', marginTop: '10px', color: '#666'}}>
              * As frequências são salvas automaticamente quando você marca/desmarca as presenças
            </small>
          </div>
        </div>
      )}

      {eventoSelecionado && participantes.length === 0 && (
        <div className="no-participants">
          <p>Nenhum participante cadastrado para este evento.</p>
          <p>Vá para a aba "Participantes" para cadastrar participantes.</p>
        </div>
      )}

      {!eventoSelecionado && (
        <div className="select-event">
          <p>Selecione um evento para ver e controlar a frequência dos participantes.</p>
        </div>
      )}
    </div>
  );
};

export default Frequencia;