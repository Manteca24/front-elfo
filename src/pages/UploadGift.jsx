import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import Select from 'react-select';

const UploadGift = () => {
  const { user, loading } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categories: [], // Categorías y filtros seleccionados
    genre: 'no relevante',
    ageRange: '',
    tags: [],
    image: '',
    firebaseUid: '',
  });
  const [categoriesWithFilters, setCategoriesWithFilters] = useState([]);
  const navigate = useNavigate();

  // Obtener categorías y filtros desde el backend
  useEffect(() => {
    const fetchCategoriesWithFilters = async () => {
      try {
        const response = await axios.get('/filters/grouped');
        setCategoriesWithFilters(response.data);
      } catch (err) {
        console.error('Error fetching categories with filters:', err);
      }
    };
    fetchCategoriesWithFilters();
  }, []);

  // Manejo del cambio en los inputs (nombre, descripción, etc.)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de los tags (agregar al presionar "Enter")
  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, e.target.value],
      });
      e.target.value = '';
    }
  };

  // Manejo de la selección de filtros dentro de cada categoría
  const handleFilterChange = (categoryId, selectedFilters) => {
    setFormData((prevState) => {
      const updatedCategories = [...prevState.categories];
      const categoryIndex = updatedCategories.findIndex((cat) => cat.category === categoryId);

      if (categoryIndex === -1) {
        updatedCategories.push({ category: categoryId, filters: selectedFilters });
      } else {
        updatedCategories[categoryIndex].filters = selectedFilters;
      }

      return { ...prevState, categories: updatedCategories };
    });
  };

  // Enviar el formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, categories, genre, ageRange, tags, image } = formData;

    const payload = {
      name,
      description,
      price,
      categories,
      genre,
      ageRange,
      tags,
      image, 
      firebaseUid: `${user.user.firebaseUid}`, 
    };

    try {
      const response = await axios.post('/products/', payload);

      if (response.status === 200) {
        console.log('Producto creado:', response.data.product);
      } else {
        console.error('Error al crear el producto:', response.data.message);
      }
    } catch (err) {
      console.error('Error de red:', err);
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = formData.tags.filter((_, tagIndex) => tagIndex !== index);
    setFormData({ ...formData, tags: updatedTags });
  };

  // Si el usuario aún está cargando
  if (loading) {
    return <p>Cargando...</p>;
  }

  // Si no hay usuario logueado
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="upload-gift-container">
      <h1 className="upload-gift-title">Subir Producto</h1>
      <form className="upload-gift-form" onSubmit={handleSubmit}>
        {/* Nombre */}
        <input
          className="input-name"
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        {/* Descripción */}
        <textarea
          className="input-description"
          name="description"
          placeholder="Descripción del producto"
          value={formData.description}
          onChange={handleInputChange}
        />

        {/* Precio */}
        <input
          className="input-price"
          type="number"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleInputChange}
          required
        />

        {/* Género */}
        <select
          className="select-genre"
          name="genre"
          value={formData.genre}
          onChange={handleInputChange}
        >
          <option value="no relevante">No relevante</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>

        {/* Rango de Edad */}
        <select
          className="select-ageRange"
          name="ageRange"
          value={formData.ageRange}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccione un rango de edad</option>
          <option value="bebé">Bebé</option>
          <option value="niño">Niño</option>
          <option value="adolescente">Adolescente</option>
          <option value="adulto">Adulto</option>
          <option value="anciano">Anciano</option>
        </select>

        {/* URL de la imagen */}
        <label htmlFor="image" className="label-image">
  URL de la imagen:
</label>
<input
  className="input-image-url"
  type="text"
  name="image"
  id="image"
  placeholder="Ejemplo: https://misregalos.com/imagen.png"
  value={formData.image || ''}
  onChange={handleInputChange}
  required
/>
<small className="image-help-text">
  Por favor, proporciona un enlace directo a una imagen en formato PNG o JPG. Asegúrate de que sea accesible públicamente.
</small>
        {/* Filtros de Categorías */}
        <div className="categories-container">
          {categoriesWithFilters.map((category) => (
            <div key={category._id} className="category-container">
              <h3 className="category-title">{category.name}</h3>
              <Select
                className="select-filters"
                isMulti
                name={`filters-${category._id}`}
                options={category.filters.map((filter) => ({
                  value: filter._id,
                  label: filter.name,
                }))}
                onChange={(selectedFilters) => {
                  const selectedFilterIds = selectedFilters.map((filter) => filter.value);
                  handleFilterChange(category._id, selectedFilterIds);
                }}
                value={category.filters.filter((filter) =>
                  formData.categories.some((cat) => cat.category === category._id && cat.filters.includes(filter._id))
                ).map((filter) => ({
                  value: filter._id,
                  label: filter.name,
                }))}
              />
            </div>
          ))}
        </div>

        {/* Tags */}
        <input
          className="input-tags"
          type="text"
          placeholder="Añade un tag y presiona Enter"
          onKeyDown={handleAddTag}
        />
        <ul className="tags-list">
          {formData.tags.map((tag, index) => (
            <li key={index} className="tag-item">
              {tag}
              <button
                type="button"
                className="remove-tag-button"
                onClick={() => handleRemoveTag(index)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>

        <button className="submit-button" type="submit">Subir Producto</button>
      </form>
    </div>
  );
};

export default UploadGift;