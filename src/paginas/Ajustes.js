import React, { useState } from 'react';
import '../styles/Ajustes.css'; // Crearemos este archivo de estilos también

function Ajustes({ userName, onUpdateUserName }) {
  // El estado del nombre ahora se gestiona en el componente padre.
  // Usamos un estado local temporal para la edición.
  const [localUserName, setLocalUserName] = useState(userName);

  // Estado para el formulario de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Manejador para actualizar el perfil
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    onUpdateUserName(localUserName); // Llama a la función del padre para actualizar el nombre
    alert(`Perfil actualizado. Nuevo nombre: ${localUserName}`);
  };

  // Manejador para cambiar la contraseña
  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Validación básica
    if (newPassword !== confirmPassword) {
      alert('La nueva contraseña y la confirmación no coinciden.');
      return;
    }
    if (!currentPassword || !newPassword) {
      alert('Por favor, completa todos los campos de contraseña.');
      return;
    }
    // Aquí iría la lógica para llamar a una API y cambiar la contraseña
    alert('Contraseña cambiada con éxito.');
    // Limpiar los campos después del cambio
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="ajustes-container">
      <h2 className="ajustes-title">Configuración de la Cuenta</h2>

      <div className="ajustes-section">
        <h3 className="ajustes-section-title">Mi Perfil</h3>
        <form onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input 
              type="text" 
              id="nombre" 
              value={localUserName}
              onChange={(e) => setLocalUserName(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" defaultValue="director@vioprevent.com" readOnly />
          </div>
          <button type="submit" className="button-primary">Actualizar Perfil</button>
        </form>
      </div>

      <div className="ajustes-section">
        <h3 className="ajustes-section-title">Cambiar Contraseña</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label htmlFor="current-password">Contraseña Actual</label>
            <input 
              type="password" 
              id="current-password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">Nueva Contraseña</label>
            <input 
              type="password" 
              id="new-password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar Nueva Contraseña</label>
            <input 
              type="password" 
              id="confirm-password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="button-primary">Cambiar Contraseña</button>
        </form>
      </div>
    </div>
  );
}

export default Ajustes;