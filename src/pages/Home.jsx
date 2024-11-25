const Home = ({ data, error }) => {
    if (error) {
      return <p style={{ color: "red" }}>{error}</p>;
    }
  
    return (
      <div>
        <h1>Productos</h1>
        <div>
          {data.length > 0 ? (
            data.map((product) => (
              <div key={product.id}>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Precio: ${product.price}</p>
              </div>
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default Home;
  