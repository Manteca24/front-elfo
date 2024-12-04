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
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tags: [],
    type: '',
    categories: [],
    gender: 'no relevante',
    ageRange: '',
    image: '',
    purchaseLocation: {
      ubication: '',
      storeName: '',  
      url: ''      
    },
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
    if(value==='prefiero-no-decirlo' || value==='otro' || value==='no-binario'){
      setFormData({ ...formData, [name]: 'no-relevante' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file); // Crea una URL para la vista previa
      setPreviewImage(imageUrl); // Guarda la URL en el estado
    }
  };
  
  // Opcional: Limpia la URL anterior al desmontar el componente
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage); // Libera la memoria de la URL creada
      }
    };
  }, [previewImage]);

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

    const { name, description, price, type, categories, gender, ageRange, tags, image, purchaseLocation } = formData;

    let imageUrl = image;

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
      type,
      categories,
      gender,
      ageRange,
      tags,
      image: imageUrl,
      purchaseLocation,
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

  const handlePurchaseLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      purchaseLocation: {
        ...formData.purchaseLocation,
        [name]: value,  // Actualiza la propiedad correspondiente (storeName, url, ubication)
      },
    });
  };

  const handleTypeChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      type: value, // Actualiza 'type' directamente con el valor seleccionado
    });
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

        {/*Tipo de regalo*/}
          <select
            className="input-type"
            name="type"
            type="string"
            placeholder="Tipo de regalo"
            value={formData.type}
            onChange={handleTypeChange}
            required>
            <option value="diy">DIY (hazlo tú mismo)</option>
            <option value="experiencia">Experiencia</option>
            <option value="material">Material</option>
          </select>

        {/* Género */}
        <div>
            <label>Género:</label>
            <select
              className="select-gender"
              name="gender"
              id="gender"
              onChange={handleInputChange}
              required>
            {/* {console.log(formData.gender)} */}
              <option value="no-relevante" disabled selected>
                Selecciona una opción
              </option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="no-binario">No binario</option>
              <option value="prefiero-no-decirlo">Prefiero no decirlo</option>
              <option value="otro">Otro</option>
            </select>
          </div>

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

        {/* Ubicación de compra */}
        <div className="purchase-location">
          <select
            type="string"
            name="ubication"
            value={formData.purchaseLocation.ubication}
            onChange={handlePurchaseLocationChange}>
            <option value="diy">Lo hice yo</option>
            <option value="online">Online</option>
            <option value="cadena">Cadena</option>
            <option value="local">Tienda Local</option>
          </select>
          <label htmlFor="storeName">¿Dónde lo compraste?</label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={formData.purchaseLocation.storeName}
            onChange={handlePurchaseLocationChange}
            placeholder="En Amazon / Lo hice yo"
          />

          <label htmlFor="url">URL de la tienda:</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.purchaseLocation.url}
            onChange={handlePurchaseLocationChange}
            placeholder="URL de la tienda (opcional)"
          />
        </div>

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


          {/* Vista previa de la imagen */}
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          )}

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