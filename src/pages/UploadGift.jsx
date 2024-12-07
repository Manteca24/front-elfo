import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression"; // librería para achicar la imagen
import ChooseTags from "../components/ChooseTags/ChooseTags";
import "../App.css";

const UploadGift = () => {
  const { user, loading } = useContext(UserContext);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    tags: [],
    type: "",
    categories: [],
    gender: "no relevante",
    ageRange: "",
    image: "",
    relation: "",
    purchaseLocation: {
      ubication: "",
      storeName: "",
      url: "",
    },
    firebaseUid: "",
  });
  const [categoriesWithFilters, setCategoriesWithFilters] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  // componente ChooseTags
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [customTag, setCustomTag] = useState("");

  useEffect(() => {
    const fetchCategoriesWithFilters = async () => {
      try {
        const response = await axios.get("/filters/grouped");
        setCategoriesWithFilters(response.data);
      } catch (err) {
        console.error("Error fetching categories with filters:", err);
      }
    };
    fetchCategoriesWithFilters();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      value === "prefiero-no-decirlo" ||
      value === "otro" ||
      value === "no-binario"
    ) {
      setFormData({ ...formData, [name]: "no-relevante" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInputRelation = (e) => {
    console.log(formData.relation);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    if (e.key === "Enter") {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, e.target.value],
      });
      e.target.value = "";
    }
  };

  const handleFilterChange = (categoryId, selectedFilters) => {
    setFormData((prevState) => {
      const updatedCategories = [...prevState.categories];
      const categoryIndex = updatedCategories.findIndex(
        (cat) => cat.category === categoryId
      );

      if (categoryIndex === -1) {
        updatedCategories.push({
          category: categoryId,
          filters: selectedFilters,
        });
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
      console.error("Error al comprimir la imagen:", error);
      alert("No se pudo comprimir la imagen.");
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
      console.error("Error al subir la imagen a Firebase:", error);
      alert("No se pudo subir la imagen. Intenta de nuevo.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    console.log("selectedFilters antes de enviar al backend:", selectedFilters);
    console.log("categorieswithfilters", categoriesWithFilters);
    e.preventDefault();

    const {
      name,
      description,
      price,
      type,
      gender,
      relation,
      ageRange,
      tags,
      image,
      purchaseLocation,
    } = formData;

    let imageUrl = image;

    if (selectedFile) {
      try {
        imageUrl = await uploadImageToFirebase(selectedFile);
        if (!imageUrl) return;
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert("No se pudo subir la imagen. Intenta de nuevo.");
        return;
      }
    }

    const transformedCategories = () => {
      return Object.entries(selectedFilters).map(
        ([categoryId, selectedTags]) => {
          const filters = selectedTags
            .map((tag) => {
              const category = categoriesWithFilters.find(
                (cat) => cat._id === categoryId
              );
              const filter = category?.filters.find((f) =>
                f.tags.includes(tag)
              );
              return filter ? filter._id : null;
            })
            .filter((id) => id);

          return {
            category: categoryId,
            filters,
          };
        }
      );
    };

    console.log(transformedCategories());
    const payload = {
      name,
      description,
      price,
      type,
      categories: transformedCategories(),
      gender,
      ageRange,
      relation,
      tags,
      image: imageUrl,
      purchaseLocation,
      firebaseUid: `${user.user.firebaseUid}`,
    };

    try {
      console.log(selectedFilters);
      const response = await axios.post("/products/", payload);

      if (response.status === 200 || response.status === 201) {
        console.log("Producto creado:", response.data.product);
        navigate("/dashboard");
      } else {
        console.error("Error al crear el producto:", response.data.message);
      }
    } catch (err) {
      console.error("Error de red:", err);
    }
  };

  const handlePurchaseLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      purchaseLocation: {
        ...formData.purchaseLocation,
        [name]: value, // Actualiza la propiedad correspondiente (storeName, url, ubication)
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

  // const handleRemoveTag = (index) => {
  //   const updatedTags = formData.tags.filter(
  //     (_, tagIndex) => tagIndex !== index
  //   );
  //   setFormData({ ...formData, tags: updatedTags });
  // };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  // componente ChooseTags

  const toggleFilter = (filterId) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[filterId]) {
        delete updatedFilters[filterId]; // Eliminar filtro
      } else {
        updatedFilters[filterId] = []; // Añadir filtro vacío
      }
      return updatedFilters;
    });
  };

  const openModal = (filter) => {
    setCurrentFilter(filter);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentFilter(null);
  };

  const addTagToFilter = (tag) => {
    if (currentFilter) {
      setSelectedFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };

        // Si ya existe el filtro, solo agregamos el tag si no está presente
        if (updatedFilters[currentFilter._id]) {
          if (!updatedFilters[currentFilter._id].includes(tag)) {
            updatedFilters[currentFilter._id].push(tag);
          }
        } else {
          // Si no existe el filtro, lo inicializamos con el tag
          updatedFilters[currentFilter._id] = [tag];
        }

        return updatedFilters;
      });
    }
  };

  const handleAddCustomTag = () => {
    if (customTag && currentFilter) {
      addTagToFilter(customTag);
      setCustomTag("");
    }
  };

  const handleRemoveTag = (filterId, tag) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      const filterTags = updatedFilters[filterId];
      updatedFilters[filterId] = filterTags.filter((t) => t !== tag);
      return updatedFilters;
    });
  };

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
        <label htmlFor="type">¿En qué categorías incluirías tu regalo?</label>
        <select
          className="input-type"
          name="type"
          type="string"
          placeholder="Tipo de regalo"
          value={formData.type}
          onChange={handleTypeChange}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="diy">DIY (hazlo tú mismo)</option>
          <option value="experiencia">Experiencia</option>
          <option value="material">Material</option>
        </select>

        {/* Género */}
        <div>
          <label htmlFor="gender">
            Indica el género de la persona a la que se lo regalaste:
          </label>
          <select
            className="select-gender"
            name="gender"
            id="gender"
            onChange={handleInputChange}
            required
          >
            {/* {console.log(formData.gender)} */}
            <option value="">Selecciona una opción</option>
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
            <option value="no-binario">No binario</option>
            <option value="prefiero-no-decirlo">Prefiero no decirlo</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Rango de Edad */}
        <label htmlFor="ageRange">
          Indica el rango de edad de la persona a la que se lo regalaste:
        </label>
        <select
          className="select-ageRange"
          name="ageRange"
          value={formData.ageRange}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccione una opción</option>
          <option value="bebé">Bebé</option>
          <option value="niño">Niño</option>
          <option value="adolescente">Adolescente</option>
          <option value="adulto">Adulto</option>
          <option value="anciano">Anciano</option>
        </select>

        {/* Relación */}
        <label htmlFor="relation">
          Indica tu relación con la persona a la que se lo regalaste:
        </label>
        <select
          className="select-relation"
          name="relation"
          value={formData.relation}
          onChange={handleInputRelation}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="madre">Madre</option>
          <option value="padre">Padre</option>
          <option value="hermana">Hermana</option>
          <option value="hermano">Hermano</option>
          <option value="hija">Hija</option>
          <option value="hijo">Hijo</option>
          <option value="abuela">Abuela</option>
          <option value="abuelo">Abuelo</option>
          <option value="tía">Tía</option>
          <option value="tío">Tío</option>
          <option value="prima">Prima</option>
          <option value="primo">Primo</option>
          <option value="amiga">Amiga</option>
          <option value="amigo">Amigo</option>
          <option value="sobrina">Sobrina</option>
          <option value="sobrino">Sobrino</option>
          <option value="pareja">Pareja</option>
          <option value="novia">Novia</option>
          <option value="novio">Novio</option>
          <option value="esposo">Esposo</option>
          <option value="esposa">Esposa</option>
          <option value="compañero de trabajo">Compañero de trabajo</option>
          <option value="compañera de trabajo">Compañera de trabajo</option>
          <option value="jefe">Jefe</option>
          <option value="jefa">Jefa</option>
          <option value="vecino">Vecino</option>
          <option value="profesor">Profesor</option>
          <option value="alumno">Alumno</option>
          <option value="alumna">Alumna</option>
          <option value="profesora">Profesora</option>
          <option value="vecina">Vecina</option>
          <option value="cliente">Cliente</option>
          <option value="mascota">Mascota</option>{" "}
        </select>

        {/* Ubicación de compra */}
        <label htmlFor="ubication">¿Dónde lo compraste?</label>
        <div className="purchase-location">
          <select
            type="string"
            name="ubication"
            value={formData.purchaseLocation.ubication}
            onChange={handlePurchaseLocationChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="diy">Lo hice yo</option>
            <option value="online">Online</option>
            <option value="cadena">Cadena</option>
            <option value="local">Tienda Local</option>
          </select>
          <br />
          <label htmlFor="storeName">
            (Opcional) Indica el nombre de la tienda, si procede{"  "}
          </label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={formData.purchaseLocation.storeName}
            onChange={handlePurchaseLocationChange}
            placeholder="En Amazon / Lo hice yo     (opcional)"
          />
          <br />
          <label htmlFor="url">
            (Opcional) Indica el URL de la tienda, si procede:
          </label>{" "}
          <input
            type="url"
            id="url"
            name="url"
            value={formData.purchaseLocation.url}
            onChange={handlePurchaseLocationChange}
            placeholder="https://www.amazon.es/    (opcional)"
          />
        </div>
        {/* Subida de Imagen */}
        <label htmlFor="imageUpload">Sube una imagen de tu regalo:</label>
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
            <img
              src={previewImage}
              alt="Vista previa"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          </div>
        )}
        {/*filtros y categorías*/}
        <ChooseTags
          categories={categoriesWithFilters}
          selectedFilters={selectedFilters}
          toggleFilter={toggleFilter}
          openModal={openModal}
          currentFilter={currentFilter}
          showModal={showModal}
          closeModal={closeModal}
          addTagToFilter={addTagToFilter}
          customTag={customTag}
          setCustomTag={setCustomTag}
          handleAddCustomTag={handleAddCustomTag}
        />

        {/* Tags */}
        <label htmlFor="moreTags">
          Si quieres, puedes añadir más tags sobre el producto o la persona:
        </label>
        <input
          className="input-tags"
          id="moreTags"
          type="text"
          placeholder="Añade un tag y presiona Enter (opcional)"
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
        <button type="submit" className="greenButton">
          Subir Producto
        </button>
      </form>
    </div>
  );
};

export default UploadGift;
