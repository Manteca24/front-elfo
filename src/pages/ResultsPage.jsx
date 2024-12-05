import React, { useEffect, useState } from "react";
import axios from "axios";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const params = new URLSearchParams(window.location.search);
      try {
        const { data } = await axios.get(`/search?${params}`);
        console.log(data);
        setResults(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Resultados de Regalos</h1>
      {results.length ? (
        <ul>
          {results.map((gift) => (
            <li key={gift.id}>{gift.name}</li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron regalos.</p>
      )}
    </div>
  );
};

export default ResultsPage;
