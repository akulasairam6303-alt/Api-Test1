import React, { useEffect, useState } from "react";
import "./App.css";
import { FaShoppingCart, FaSearch, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./store/productSlice";
import { logout, clearMessages } from "./store/authSlice";
import Signup from "./store/signup";
import Login from "./store/Login";
import Popup from "./store/Popup";

const ITEMS_PER_PAGE = 8;

const priceRanges = [
  { label: "1 - 100", min: 1, max: 100 },
  { label: "100 - 500", min: 100, max: 500 },
  { label: "500 - 1000", min: 500, max: 1000 },
  { label: "1000+", min: 1000, max: Infinity }
];

const App = () => {
  const dispatch = useDispatch();

  const allProducts = useSelector(
    state => state.products.items
  );

  const { user, error, success } =
    useSelector(state => state.auth);

  const [screen, setScreen] = useState("signup");
  const [loggingOut, setLoggingOut] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [finalSearch, setFinalSearch] = useState("");
  const [activeRanges, setActiveRanges] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFinalSearch(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleLogout = () => {
    setLoggingOut(true);

    setTimeout(() => {
      dispatch(logout());
      setScreen("signup");
      setLoggingOut(false);
    }, 1000);
  };

  /* ---SIGNUP SCREEN ---*/
  if (screen === "signup")
    return (
      <>
        <Signup goLogin={() => setScreen("login")} />

        <Popup
          message={success || error}
          type={success ? "success" : "error"}
          onClose={() => dispatch(clearMessages())}
        />
      </>
    );

  /*---LOGIN SCREEN---*/
  if (screen === "login")
    return (
      <>
        <Login
          goSignup={() => setScreen("signup")}
          goHome={() => setScreen("home")}
        />

        <Popup
          message={success || error}
          type={success ? "success" : "error"}
          onClose={() => {
            dispatch(clearMessages());
            if (success) setScreen("home");
          }}
        />
      </>
    );

  if (loggingOut) {
    return (
      <div className="signupPage">
        <h2 style={{ color: "white" }}>
          Logging out...
        </h2>
      </div>
    );
  }

  const toggleRange = label => {
    setPageNumber(1);
    setActiveRanges(prev =>
      prev.includes(label)
        ? prev.filter(r => r !== label)
        : [...prev, label]
    );
  };

  const resetFilters = () => {
    setActiveRanges([]);
    setPageNumber(1);
  };

  const priceMatch = item => {
    if (activeRanges.length === 0) return true;

    return activeRanges.some(label => {
      const selected = priceRanges.find(
        r => r.label === label
      );
      return (
        item.price >= selected.min &&
        item.price <= selected.max
      );
    });
  };

  const visibleProducts = allProducts.filter(
    item =>
      item.title
        .toLowerCase()
        .includes(finalSearch.toLowerCase()) &&
      priceMatch(item)
  );

  const totalPages = Math.ceil(
    visibleProducts.length / ITEMS_PER_PAGE
  );

  const start = (pageNumber - 1) * ITEMS_PER_PAGE;

  const productsToShow = visibleProducts.slice(
    start,
    start + ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="search-wrapper">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            className="search"
            placeholder="Search products..."
            value={searchText}
            onChange={e => {
              setSearchText(e.target.value);
              setPageNumber(1);
            }}
          />
        </div>

        <button
          className="logoutBtn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="layout">
        <div className="sidebar">
          <h3>Filter by Price</h3>

          {priceRanges.map(range => (
            <label
              key={range.label}
              className="filter-option"
            >
              <input
                type="checkbox"
                checked={activeRanges.includes(
                  range.label
                )}
                onChange={() =>
                  toggleRange(range.label)
                }
              />
              $ {range.label}
            </label>
          ))}

          <button
            className="clear-btn"
            onClick={resetFilters}
          >
            Clear Filters
          </button>
        </div>

        <div className="main">
          {productsToShow.map(item => (
            <div
              className="product-card"
              key={item.id}
            >
              <div className="card-top">
                <span className="discount">
                  {Math.round(
                    item.discountPercentage
                  )}
                  % OFF
                </span>
                <FaHeart className="fav" />
              </div>

              <img
                src={item.thumbnail}
                alt={item.title}
                loading="lazy"
              />

              <p className="name">{item.title}</p>
              <p className="maker">{item.brand}</p>
              <p className="cost">
                ${item.price}
              </p>

              <div className="actions">
                <button className="add-btn">
                  <FaShoppingCart /> Add to cart
                </button>

                <button className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pagination">
        <button
          disabled={pageNumber === 1}
          onClick={() =>
            setPageNumber(p => p - 1)
          }
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={
              pageNumber === i + 1
                ? "active"
                : ""
            }
            onClick={() =>
              setPageNumber(i + 1)
            }
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={
            pageNumber === totalPages
          }
          onClick={() =>
            setPageNumber(p => p + 1)
          }
        >
          Next
        </button>
      </div>
    </>
  );
};

export default App;
