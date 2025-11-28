import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import html2pdf from 'html2pdf.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './Lote.css';

const Lote = () => {
  const [eventos, setEventos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [progresso, setProgresso] = useState(0);
  const [gerando, setGerando] = useState(false);

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

  const carregarParticipantes = async (eventoId) => {
    try {
      const participantesData = await apiService.getParticipantes();
      const participantesEvento = participantesData.filter(p => p.evento_id === parseInt(eventoId));
      setParticipantes(participantesEvento);
      setEventoSelecionado(eventos.find(e => e.id === parseInt(eventoId)));
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
    }
  };

  const handleEventoChange = (eventoId) => {
    setParticipantes([]);
    setEventoSelecionado(null);
    setProgresso(0);
    if (eventoId) {
      carregarParticipantes(eventoId);
    }
  };

  // Função para gerar o HTML de um certificado individual
  const gerarHTMLCertificado = (participante, evento, infoCertificado) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          .certificate-page { width: 297mm; height: 210mm; padding: 15mm; page-break-after: always; }
          .front { background: white; border: 15px solid #8B4513; }
          .back { background: white; border: 15px solid #8B4513; }
          .certificate-header { text-align: center; margin-bottom: 30px; }
          .certificate-title { font-size: 32px; font-weight: bold; margin: 30px 0; text-transform: uppercase; text-align: center; }
          .certificate-content { margin: 30px 0; line-height: 1.8; font-size: 18px; text-align: center; }
          .participant-name { font-weight: bold; font-size: 28px; text-align: center; margin: 40px 0; padding: 20px; }
          .certificate-footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
          .content-program-back { padding: 20px; }
          .content-program-back h3 { text-align: center; margin-bottom: 30px; color: #8B4513; font-size: 24px; }
          .content-program-back ul { font-size: 16px; line-height: 1.6; }
          .logo-inferior { text-align: center; margin-top: 40px; }
          hr { border: 1px solid #000; margin: 20px 0; }
        </style>
      </head>
      <body>
        <!-- FRENTE -->
        <div class="certificate-page front">
          <div class="certificate-header">
            <h1 style="margin:0;font-size:24px;font-weight:bold;">MUNICÍPIO DE CORONEL VIVIDA</h1>
            <h2 style="margin:5px 0;font-size:18px;font-weight:normal;">Secretaria Municipal de Educação, Cultura e Desporto</h2>
            <p style="margin:0;font-size:14px;">CNPJ. 76.995.455/0001-56</p>
          </div>

          <hr>

          <div class="certificate-title">C E R T I F I C A D O</div>

          <div class="certificate-content">
            <p>Certificamos que <strong>${participante.nome.toUpperCase()}</strong>,</p>
            <p>CPF ${participante.cpf}, participou de <strong>${evento.nome}</strong>,</p>
            <p>oferecido pela Sec. Mun. de Educação Cul. e Desporto de Coronel Vivida,</p>
            <p>nos dias ${evento.datas},</p>
            <p>perfazendo a carga horária de ${infoCertificado.cargaHoraria} horas.</p>
          </div>

          <hr>

          <div class="participant-name">${participante.nome.toUpperCase()}</div>

          <hr>

          <div class="certificate-footer">
            <div style="text-align: center; flex: 1;">
              <p style="margin:0;font-size:16px;"><strong>Grasieil Cerbatto</strong></p>
              <p style="margin:0;font-size:14px;">Sec. Mun. de Educação Cul. e Desporto</p>
            </div>
            
            <div style="text-align: right; flex: 1;">
              <div style="display: inline-block; padding: 5px; background: white; border: 1px solid #ddd;">
                <!-- QR Code -->
              </div>
              <div style="margin-top: 8px; font-size: 10px;">
                <small>Código: CERT-${participante.id}-${evento.id}</small>
              </div>
            </div>
          </div>

          <div class="logo-inferior">
            [Logo Inferior]
          </div>
        </div>

        <!-- VERSO -->
        <div class="certificate-page back">
          <div class="content-program-back">
            <h3>CONTEÚDO PROGRAMÁTICO</h3>
            <ul>
              ${evento.conteudo.split('\n').map(item => `<li>${item.trim()}</li>`).join('')}
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Função principal para gerar lote de certificados
  const gerarLotePDF = async () => {
    if (!eventoSelecionado) {
      alert('Selecione um evento!');
      return;
    }

    if (participantes.length === 0) {
      alert('Não há participantes para este evento!');
      return;
    }

    setGerando(true);
    setProgresso(0);

    const zip = new JSZip();
    let concluidos = 0;

    // Filtra participantes que têm pelo menos uma presença
    const participantesComPresenca = participantes.filter(p => {
      const presencas = p.frequencia.filter(f => f).length;
      return presencas > 0;
    });

    if (participantesComPresenca.length === 0) {
      alert('Nenhum participante com presença registrada. Não é possível gerar certificados.');
      setGerando(false);
      return;
    }

    for (const participante of participantesComPresenca) {
      try {
        const presencas = participante.frequencia.filter(p => p).length;
        const cargaHoraria = Math.round((eventoSelecionado.carga_horaria * presencas) / eventoSelecionado.dias);

        const infoCertificado = {
          presencas,
          cargaHoraria
        };

        const htmlContent = gerarHTMLCertificado(participante, eventoSelecionado, infoCertificado);

        // Criar um elemento div temporário para o html2pdf
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        document.body.appendChild(element);

        const options = {
          margin: 0,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'landscape'
          }
        };

        const pdf = await html2pdf().set(options).from(element).output('blob');
        
        // Remover elemento temporário
        document.body.removeChild(element);

        const fileName = `certificado-${participante.nome.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        zip.file(fileName, pdf);

        concluidos++;
        const novoProgresso = (concluidos / participantesComPresenca.length) * 100;
        setProgresso(novoProgresso);

      } catch (error) {
        console.error(`Erro ao gerar certificado para ${participante.nome}:`, error);
      }
    }

    // Gerar arquivo ZIP
    if (Object.keys(zip.files).length > 0) {
      zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, `certificados-${eventoSelecionado.nome}-${new Date().toISOString().split('T')[0]}.zip`);
        setGerando(false);
        setProgresso(100);
        alert(`Certificados gerados com sucesso! Total: ${concluidos} certificados.`);
      });
    } else {
      setGerando(false);
      alert('Nenhum certificado foi gerado.');
    }
  };

  return (
    <div className="lote-container">
      <h2>Gerar Certificados em Lote</h2>
      
      <div className="form-group">
        <label htmlFor="select-evento-lote">Selecione o Evento:</label>
        <select
          id="select-evento-lote"
          onChange={(e) => handleEventoChange(e.target.value)}
        >
          <option value="">Selecione um evento</option>
          {eventos.map(evento => (
            <option key={evento.id} value={evento.id}>
              {evento.nome}
            </option>
          ))}
        </select>
      </div>

      {eventoSelecionado && (
        <div id="lote-container">
          <div className="batch-controls">
            <h3>Gerar certificados para todos os participantes com presença</h3>
            <p>Será gerado um arquivo ZIP contendo todos os certificados em PDF (frente e verso).</p>
            
            <div className="form-group">
              <label><strong>Participantes com cadastro:</strong> {participantes.length}</label>
            </div>

            <div className="form-group">
              <label><strong>Participantes com presença (que receberão certificado):</strong> {
                participantes.filter(p => p.frequencia.filter(f => f).length > 0).length
              }</label>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress" 
                id="batch-progress" 
                style={{width: `${progresso}%`}}
              ></div>
            </div>
            <p id="progress-text">
              {gerando ? `Gerando ${Math.round(progresso)}%...` : 'Pronto para gerar'}
            </p>
            
            <div className="controls">
              <button 
                className="btn btn-info" 
                onClick={gerarLotePDF} 
                id="btn-lote"
                disabled={gerando}
              >
                {gerando ? 'Gerando...' : 'Gerar Todos os Certificados (ZIP)'}
              </button>
            </div>
          </div>

          <h3>Pré-visualização do Lote</h3>
          {participantes.length === 0 ? (
            <p>Nenhum participante cadastrado para este evento.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Presenças</th>
                  <th>Carga Horária</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {participantes.map(participante => {
                  const presencas = participante.frequencia.filter(p => p).length;
                  const cargaHoraria = Math.round((eventoSelecionado.carga_horaria * presencas) / eventoSelecionado.dias);
                  const status = presencas > 0 ? 'Pode emitir' : 'Sem presenças';

                  return (
                    <tr key={participante.id}>
                      <td>{participante.nome}</td>
                      <td>{participante.cpf}</td>
                      <td>{presencas}/{eventoSelecionado.dias}</td>
                      <td>{cargaHoraria} horas</td>
                      <td>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Lote;