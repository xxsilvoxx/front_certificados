import React, { useState } from 'react';
import Eventos from '../Eventos/Eventos';
import Participantes from '../Participantes/Participantes';
import Frequencia from '../Frequencia/Frequencia';
import Certificados from '../Certificados/Certificados';
import Lote from '../Lote/Lote';
import './MainSystem.css';

const MainSystem = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('eventos');

  const tabs = [
    { id: 'eventos', label: 'Eventos' },
    { id: 'participantes', label: 'Participantes' },
    { id: 'frequencia', label: 'Frequência' },
    { id: 'certificados', label: 'Certificados Individuais' },
    { id: 'lote', label: 'Certificados em Lote' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'eventos': 
        return <Eventos />;
      case 'participantes': 
        return <Participantes />;
      case 'frequencia': 
        return <Frequencia />;
      case 'certificados': 
        return <Certificados />;
      case 'lote': 
        return <Lote />;
      default: 
        return <Eventos />;
    }
  };

  return (
    <div className="main-system">
      <header className="system-header">
        <div className="header-content">
          <h1>MUNICÍPIO DE CORONEL VIVIDA</h1>
          <h2>Secretaria Municipal de Educação, Cultura e Desporto</h2>
          <p>CNPJ: 76.995.455/0001-56</p>
        </div>
        <div className="user-info">
          <span>Usuário: {user?.username}</span>
          <button className="logout-btn" onClick={onLogout}>
            Sair
          </button>
        </div>
      </header>

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default MainSystem;