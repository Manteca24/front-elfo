import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import Select from 'react-select';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression'; // librería para achicar la imagen

const UploadGift = () => {
  const { user, loading } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categories: [],
    genre: 'no relevante',
    ageRange: '',
    tags: [],
    image: '',
    firebaseUid: '',
  });
  const [categoriesWithFilters, setCategoriesWithFilters] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

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

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.2, // Tamaño máximo en MB
      maxWidthOrHeight: 800, // Redimensionar a un tamaño máximo de 800px
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error al comprimir la imagen:', error);
      alert('No se pudo comprimir la imagen.');
      return null;
    }
  };

  const uploadImageToFirebase = async (file) => {
    const compressedFile = await compressImage(file);
    if (!compressedFile) return null;

    const storageRef = ref(storage, `images/${compressedFile.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen a Firebase:', error);
      alert('No se pudo subir la imagen. Intenta de nuevo.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, categories, genre, ageRange, tags, image } = formData;

    let imageUrl = formData.image;

    if (selectedFile) {
      try {
        imageUrl = await uploadImageToFirebase(selectedFile);
        if (!imageUrl) return;
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        alert('No se pudo subir la imagen. Intenta de nuevo.');
        return;
      }
    }

    const payload = {
      name,
      description,
      price,
      categories,
      genre,
      ageRange,
      tags,
      image: imageUrl,
      firebaseUid: `${user.user.firebaseUid}`,
    };

    try {
      const response = await axios.post('/products/', payload);

      if (response.status === 200 || response.status === 201) {
        console.log('Producto creado:', response.data.product);
        navigate('/dashboard');
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

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }
  return (
    <div className="upload-gift-container">
      <h2 className="upload-gift-title">Subir Producto</h2>
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

        {/* Subida de Imagen */}
        <label htmlFor="imageUpload" className="label-image">
          Subir imagen:
        </label>
        <input
          className="input-image-file"
          type="file"
          id="imageUpload"
          name="image"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />

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

        {/* Botón de envío */}
        <button type="submit" className="submit-button">
          Subir Producto
        </button>
      </form>
    </div>
  );
};

export default UploadGift;