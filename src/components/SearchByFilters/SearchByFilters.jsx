import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./SearchByFilters.module.css";
import "../../styles/buttons.css";

const SearchByFilters = () => {
  const navigate = useNavigate();

  // Define filter states
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [type, setType] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [categories, setCategories] = useState(""); // e.g. "categoryId1,categoryId2"
  const [tags, setTags] = useState(""); // e.g. "eco-friendly,casual"

  const [isOpen, setIsOpen] = useState(false); // State to toggle the form visibility

  const handleSearch = async (e) => {
    e.preventDefault();

    const params = {
      query,
      gender,
      priceRange,
      type,
      purchaseLocation,
      ageRange,
      categories,
      tags,
    };

    try {
      // Send the search request with the filters
      const response = await axios.get(`/search/`, { params });

      // Redirect to the results page with the search results
      navigate("/results", { state: { results: response.data } });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterBar} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.filterBarText}>Filtros</span>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ""}`}>
          &#9660;
        </span>{" "}
        {/* Down arrow */}
      </div>

      {isOpen && (
        <form onSubmit={handleSearch} className={styles.form}>
          <div className={styles.searchBar}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a product..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <div className={styles.filter}>
              <label>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={styles.select}
              >
                <option value="">All</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="no-relevante">No Relevante</option>
              </select>
            </div>

            <div className={styles.filter}>
              <label>Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className={styles.select}
              >
                <option value="">All</option>
                <option value="low">0€ - 20€</option>
                <option value="medium">20€ - 50€</option>
                <option value="high">50€ - 100€</option>
                <option value="luxury">Más de 100€</option>
              </select>
            </div>

            <div className={styles.filter}>
              <label>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={styles.select}
              >
                <option value="">All</option>
                <option value="diy">DIY</option>
                <option value="experiencia">Experiencia</option>
                <option value="material">Material</option>
              </select>
            </div>

            <div className={styles.filter}>
              <label>Purchase Location</label>
              <select
                value={purchaseLocation}
                onChange={(e) => setPurchaseLocation(e.target.value)}
                className={styles.select}
              >
                <option value="">All</option>
                <option value="diy">Hazlo tú mismo</option>
                <option value="online">Online</option>
                <option value="cadena">Cadena</option>
                <option value="local">Local</option>
              </select>
            </div>

            <div className={styles.filter}>
              <label>Age Range</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className={styles.select}
              >
                <option value="">All</option>
                <option value="bebé">Bebé</option>
                <option value="niño">Niño</option>
                <option value="adolescente">Adolescente</option>
                <option value="adulto">Adulto</option>
                <option value="anciano">Anciano</option>
              </select>
            </div>

            <div className={styles.filter}>
              <label>Categories (comma-separated)</label>
              <input
                type="text"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                placeholder="e.g. categoryId1,categoryId2"
                className={styles.input}
              />
            </div>

            <div className={styles.filter}>
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. eco-friendly,casual"
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" className="greenButton">
            Search
          </button>
        </form>
      )}
    </div>
  );
};

export default SearchByFilters;
