import React from 'react';

function Archivo1() {
  const pdfPath = '/INFORME.pdf';

  return (
    <div style={{ padding: '20px', margin: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ width: '100%', height: '75vh', border: '1px solid #ddd' }}>
        <object data={pdfPath} type="application/pdf" width="100%" height="100%">
          <p>
            Tu navegador no puede mostrar el PDF. En su lugar, puedes 
            <a href={pdfPath} target="_blank" rel="noopener noreferrer"> descargarlo aquí</a>.
          </p>
        </object>
      </div>
    </div>
  );
}

export default Archivo1;