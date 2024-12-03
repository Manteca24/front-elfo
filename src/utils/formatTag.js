export const formatTag = (tag) => {
    return tag
      .trim()  // Elimina los espacios al principio y al final
      .toLowerCase()  // Convierte a minúsculas
      .normalize("NFD")  // Descompone los caracteres con tildes
      .replace(/[\u0300-\u036f]/g, "")  // Elimina las tildes
      .replace(/\s+/g, "");  // Elimina los espacios
  };