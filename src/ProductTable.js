import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowUp, FaArrowDown, FaSearch } from "react-icons/fa";
import "./ProductTable.css"; // Importing the CSS file

const ProductTable = () => {
  const [products, setProducts] = useState([]); // State to store all products
  const [filteredProducts, setFilteredProducts] = useState([]); // State to store filtered products
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "ascending",
  }); // State for sorting configuration
  const [groupBy, setGroupBy] = useState("none"); // State for grouping option
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status

  // Effect hook to fetch products from API on component mount
  useEffect(() => {
    console.log("Fetching products from API...");
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        console.log("Products fetched:", response.data);
        setProducts(response.data); // Set all products
        setFilteredProducts(response.data); // Initialize filtered products with all products
        setLoading(false); // Update loading state to false
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Update loading state to false in case of error
      });
  }, []);

  // Handler for grouping products by selected option
  const handleGroupBy = (e) => {
    e.preventDefault(); // Prevent form submission
    const group = e.target.value; // Get selected grouping option
    console.log("Selected group by:", group);
    setGroupBy(group); // Update grouping state

    // Filter products based on selected grouping option
    if (group === "none") {
      setFilteredProducts(products); // Display all products if no grouping selected
    } else {
      // Group products by selected option
      const groupedProducts = products.reduce((acc, product) => {
        (acc[product[group]] = acc[product[group]] || []).push(product);
        return acc;
      }, {});
      console.log("Grouped products:", groupedProducts);
      setFilteredProducts(Object.values(groupedProducts).flat()); // Flatten grouped products
    }
  };

  // Handler for searching products by title
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
    const term = e.target.value; // Get search term from input
    console.log("Search term:", term);
    setSearchTerm(term); // Update search term state

    // Filter products based on search term
    if (term === "") {
      setFilteredProducts(products); // Display all products if search term is empty
    } else {
      // Filter products by title containing search term
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(term.toLowerCase())
      );
      console.log("Filtered products:", filtered);
      setFilteredProducts(filtered); // Update filtered products
    }
  };

  // Handler for sorting products by key (title, price, category)
  const handleSort = (key) => {
    console.log("Sorting by:", key);
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"; // Toggle sort direction if already sorted by the same key
    }

    setSortConfig({ key, direction }); // Update sorting configuration
    console.log("Sort configuration:", { key, direction });

    // Sort filtered products based on sort configuration
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    console.log("Sorted products:", sortedProducts);
    setFilteredProducts(sortedProducts); // Update filtered products with sorted list
  };

  // Function to get sort icon based on current sort configuration
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        return <FaArrowUp />; // Upward arrow for ascending sort
      } else {
        return <FaArrowDown />; // Downward arrow for descending sort
      }
    }
    return null;
  };

  // Toggle login status
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  // Render loading state if data is still loading
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Render different UI based on login status
  if (!isLoggedIn) {
    return (
      <div>
        <button onClick={toggleLogin} className="login-button">
          Login
        </button>
      </div>
    );
  }

  // Render product table once data is loaded
  return (
    <div className="product-table-container">
      {/* Logout button */}
      <button onClick={toggleLogin} className="logout-button">
        Logout
      </button>

      {/* Search form */}
      <form onSubmit={(e) => e.preventDefault()} className="search-form">
        <FaSearch className="search-icon" /> {/* Search icon */}
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </form>

      {/* Grouping dropdown */}
      <form onSubmit={(e) => e.preventDefault()} className="group-form">
        <select
          onChange={handleGroupBy}
          value={groupBy}
          className="group-select"
        >
          <option value="none">No Grouping</option>
          <option value="category">Category</option>
          <option value="price">Price</option>
        </select>
      </form>

      {/* Product table */}
      <table className="product-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("title")}>
              Title {getSortIcon("title")}
            </th>
            <th onClick={() => handleSort("price")}>
              Price {getSortIcon("price")}
            </th>
            <th onClick={() => handleSort("category")}>
              Category {getSortIcon("category")}
            </th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

