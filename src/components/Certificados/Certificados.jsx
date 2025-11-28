import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../../services/api';
import html2pdf from 'html2pdf.js';
import './Certificados.css';

const Certificados = () => {
  const [eventos, setEventos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [participanteSelecionado, setParticipanteSelecionado] = useState(null);
  const [infoCertificado, setInfoCertificado] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const certificateRef = useRef();

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
    setParticipanteSelecionado(null);
    setInfoCertificado(null);
    setShowPreview(false);
    if (eventoId) {
      carregarParticipantes(eventoId);
    }
  };

  const handleParticipanteChange = (participanteId) => {
    const participante = participantes.find(p => p.id === parseInt(participanteId));
    setParticipanteSelecionado(participante);
    setShowPreview(false);

    if (participante && eventoSelecionado) {
      const presencas = participante.frequencia.filter(p => p).length;
      const cargaHoraria = Math.round((eventoSelecionado.carga_horaria * presencas) / eventoSelecionado.dias);

      setInfoCertificado({
        presencas,
        totalDias: eventoSelecionado.dias,
        cargaHoraria
      });
    }
  };

  const visualizarCertificado = () => {
    if (!participanteSelecionado || !eventoSelecionado) {
      alert('Selecione um evento e um participante!');
      return;
    }
    setShowPreview(true);
  };

  // FUNÇÃO PARA GERAR PDF - IMPLEMENTADA!
  const gerarPDF = () => {
    if (!participanteSelecionado || !eventoSelecionado) {
      alert('Selecione um evento e um participante!');
      return;
    }

    const element = certificateRef.current;
    const options = {
      margin: 0,
      filename: `certificado-${participanteSelecionado.nome}.pdf`,
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

    html2pdf().set(options).from(element).save();
  };

  // FUNÇÃO PARA IMPRIMIR - IMPLEMENTADA!
  const imprimirCertificado = () => {
    if (!participanteSelecionado || !eventoSelecionado) {
      alert('Selecione um evento e um participante!');
      return;
    }

    const printWindow = window.open('', '_blank');
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificado - ${participanteSelecionado.nome}</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, sans-serif;
          }
          .certificate-page { 
            width: 297mm; 
            height: 210mm; 
            padding: 15mm;
            page-break-after: always;
          }
          .front { 
            background: white;
            border: 15px solid #8B4513;
            padding: 30px;
            box-sizing: border-box;
          }
          .back { 
            background: white;
            border: 15px solid #8B4513;
            padding: 30px;
            box-sizing: border-box;
          }
          .certificate-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .certificate-title {
            font-size: 32px;
            font-weight: bold;
            margin: 30px 0;
            text-transform: uppercase;
            text-align: center;
          }
          .certificate-content {
            margin: 30px 0;
            line-height: 1.8;
            font-size: 18px;
            text-align: center;
          }
          .participant-name {
            font-weight: bold;
            font-size: 28px;
            text-align: center;
            margin: 40px 0;
            padding: 20px;
          }
          .certificate-footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .content-program-back {
            padding: 20px;
          }
          .content-program-back h3 {
            text-align: center;
            margin-bottom: 30px;
            color: #8B4513;
            font-size: 24px;
          }
          .conteudo-programatico {
            font-size: 16px;
            line-height: 1.6;
          }
          .conteudo-programatico p {
            margin-bottom: 10px;
          }
          hr {
            border: 1px solid #000;
            margin: 20px 0;
          }
          @media print {
            @page {
              size: landscape;
              margin: 0;
            }
            body { 
              margin: 0; 
              padding: 0;
            }
            .certificate-page {
              width: 297mm;
              height: 210mm;
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate-page front">
          <div class="certificate-header">
            <h1>MUNICÍPIO DE CORONEL VIVIDA</h1>
            <h2>Secretaria Municipal de Educação, Cultura e Desporto</h2>
            <p>CNPJ: 76.995.455/0001-56</p>
          </div>

          <hr>

          <div class="certificate-title">C E R T I F I C A D O</div>

          <div class="certificate-content">
            <p>Certificamos que <strong>${participanteSelecionado.nome.toUpperCase()}</strong>,</p>
            <p>CPF ${participanteSelecionado.cpf}, participou de <strong>${eventoSelecionado.nome}</strong>,</p>
            <p>oferecido pela Sec. Mun. de Educação Cul. e Desporto de Coronel Vivida,</p>
            <p>nos dias ${eventoSelecionado.datas},</p>
            <p>perfazendo a carga horária de ${infoCertificado.cargaHoraria} horas.</p>
          </div>

          <hr>

          <div class="participant-name">${participanteSelecionado.nome.toUpperCase()}</div>

          <hr>

          <div class="certificate-footer">
            <div style="text-align: center; flex: 1;">
              <p style="margin:0;font-size:16px;"><strong>Grasieil Cerbatto</strong></p>
              <p style="margin:0;font-size:14px;">Sec. Mun. de Educação Cul. e Desporto</p>
            </div>
            
            <div style="text-align: right; flex: 1;">
              <div style="display: inline-block; padding: 8px; background: white; border: 1px solid #ddd;">
                [QR Code]
              </div>
              <div style="margin-top: 10px; font-size: 12px; color: #666;">
                <small>Código: CERT-${participanteSelecionado.id}-${eventoSelecionado.id}</small>
              </div>
            </div>
          </div>

          <div style="margin-top: 40px; text-align: center;">
            [Logo Inferior]
          </div>
        </div>

        <div class="certificate-page back">
          <div class="content-program-back">
            <h3>CONTEÚDO PROGRAMÁTICO</h3>
            <div class="conteudo-programatico">
              ${eventoSelecionado.conteudo.split('\n').map(item => `<p>${item}</p>`).join('')}
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              window.close();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(certificateHTML);
    printWindow.document.close();
  };

  return (
    <div className="certificados-container">
      <h2>Gerar Certificado Individual</h2>
      
      <div className="form-group">
        <label htmlFor="select-evento-certificado">Selecione o Evento:</label>
        <select
          id="select-evento-certificado"
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

      <div className="form-group">
        <label htmlFor="select-participante-certificado">Selecione o Participante:</label>
        <select
          id="select-participante-certificado"
          onChange={(e) => handleParticipanteChange(e.target.value)}
          disabled={!eventoSelecionado}
        >
          <option value="">Selecione um participante</option>
          {participantes.map(participante => (
            <option key={participante.id} value={participante.id}>
              {participante.nome} - {participante.cpf}
            </option>
          ))}
        </select>
      </div>

      {infoCertificado && (
        <div id="info-certificado">
          <h3>Informações do Certificado</h3>
          <p><strong>Presenças:</strong> {infoCertificado.presencas} de {infoCertificado.totalDias} dias</p>
          <p><strong>Carga Horária:</strong> {infoCertificado.cargaHoraria} horas</p>
          
          <div style={{textAlign: 'center', margin: '20px 0'}}>
            <button className="btn btn-primary" onClick={visualizarCertificado}>
              Visualizar Certificado
            </button>
            <button className="btn btn-success" onClick={gerarPDF}>
              Baixar PDF Completo
            </button>
            <button className="btn btn-info" onClick={imprimirCertificado}>
              Imprimir Certificado
            </button>
          </div>
        </div>
      )}

      {showPreview && participanteSelecionado && eventoSelecionado && (
        <div id="preview-area" ref={certificateRef}>
          <h3>Pré-visualização do Certificado</h3>
          
          {/* FRENTE DO CERTIFICADO */}
          <div className="certificate-preview">
            <div className="certificate-front-preview" id="certificado-frente">
              <div className="certificate-header">
                <h1>MUNICÍPIO DE CORONEL VIVIDA</h1>
                <h2>Secretaria Municipal de Educação, Cultura e Desporto</h2>
                <p>CNPJ: 76.995.455/0001-56</p>
              </div>

              <hr />

              <div className="certificate-title">C E R T I F I C A D O</div>

              <div className="certificate-content">
                <p>Certificamos que <strong>{participanteSelecionado.nome.toUpperCase()}</strong>,</p>
                <p>CPF {participanteSelecionado.cpf}, participou de <strong>{eventoSelecionado.nome}</strong>,</p>
                <p>oferecido pela Sec. Mun. de Educação Cul. e Desporto de Coronel Vivida,</p>
                <p>nos dias {eventoSelecionado.datas},</p>
                <p>perfazendo a carga horária de {infoCertificado.cargaHoraria} horas.</p>
              </div>

              <hr />

              <div className="participant-name">
                {participanteSelecionado.nome.toUpperCase()}
              </div>

              <hr />

              <div className="certificate-footer">
                <div className="footer-signature">
                  <p><strong>Grasieil Cerbatto</strong></p>
                  <p>Sec. Mun. de Educação Cul. e Desporto</p>
                </div>
                
                <div className="footer-qrcode">
                  <div className="qrcode-placeholder">
                    [QR Code]
                  </div>
                  <div className="certificate-code">
                    <small>Código: CERT-{participanteSelecionado.id}-{eventoSelecionado.id}</small>
                  </div>
                </div>
              </div>

              <div className="logo-inferior">
                [Logo Inferior]
              </div>
            </div>
          </div>

          {/* VERSO DO CERTIFICADO */}
          <div className="certificate-preview">
            <div className="certificate-back-preview" id="certificado-verso">
              <div className="content-program-back">
                <h3>CONTEÚDO PROGRAMÁTICO</h3>
                <div className="conteudo-programatico">
                  {eventoSelecionado.conteudo.split('\n').map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificados;