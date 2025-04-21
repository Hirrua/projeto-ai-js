'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !jobDescription) {
      setError('Selecione um currículo e insira a descrição da vaga');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('descricao', jobDescription);
      formData.append('curriculo', selectedFile);

      const response = await axios.post(
        'http://localhost:3333/analisar',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setAnalysis(response.data);
    } catch (err) {
      setError('Erro ao analisar: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <header className="header">
        <h1 className="header-titulo">Analisa.Ai</h1>
    </header>

    <div className="container">
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Descrição da Vaga:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Descrição da vaga"
            rows="6"
          />
        </div>

        <div className="form-group">
          <label>Selecione o Currículo (PDF):</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Analisando...' : 'Analisar Currículo'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {analysis && (
        <div className="results">
          <h2>Resultado da Análise</h2>
        
          <div className="section">
            <h3 className="adequacao-percentual">{analysis.percentual_adequacao}%</h3>
            <p className="explicacao-adequacao">{analysis.explicacao_adequacao}</p>
          </div>

          <div className="grid">
            <div className="card">
              <h4>Pontos Fortes</h4>
              <ul>
                {analysis.pontos_fortes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h4>Pontos Fracos</h4>
              <ul>
                {analysis.pontos_fracos.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h4>Alertas</h4>
              <ul>
                {analysis.alertas.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  
  );
}