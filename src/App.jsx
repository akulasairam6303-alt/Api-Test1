import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import {FaSearch,FaShoppingCart,FaHeart} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./store/productSlice";
import { logout, clearMessages } from "./store/authSlice";
import {addToCart,removeFromCart,updateQuantity} from "./store/cart/cartSlice";
import {selectCartArray,selectCartTotalPrice,selectCartTotalQuantity} from "./store/cart/cartSelectors";
import {addToWishlist,removeFromWishlist} from "./store/wishlist/wishlistSlice";
import {selectWishlistItems} from "./store/wishlist/wishlistSelectors";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Popup from "./components/Popup";

const ITEMS_PER_PAGE = 12;

const priceRanges = [
    { label: "1 - 100", min: 1, max: 100 },
    { label: "100 - 500", min: 100, max: 500 },
    { label: "500 - 1000", min: 500, max: 1000 },
    { label: "1000+", min: 1000, max: Infinity }
];

function App() {
    const dispatch = useDispatch();

    const { items } = useSelector(state => state.products);
    const { user, error, success } = useSelector(state => state.auth);

    const cartItems = useSelector(selectCartArray);
const cartTotal = useSelector(selectCartTotalPrice);
const cartCount = useSelector(selectCartTotalQuantity);

    const wishlistItems = useSelector(selectWishlistItems);

    const [screen, setScreen] = useState("signup");
    const [activePanel, setActivePanel] = useState("home");

    const [searchText, setSearchText] = useState("");
    const [activeRanges, setActiveRanges] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        if (screen === "home") {
            dispatch(fetchProducts());
        }
    }, [screen, dispatch]);

    const priceMatch = item => {
        if (activeRanges.length === 0) return true;

        return activeRanges.some(label => {
            const selected = priceRanges.find(r => r.label === label);
            return (
                item.price >= selected.min &&
                item.price <= selected.max
            );
        });
    };

    const filteredProducts = useMemo(() => {
        return items.filter(
            item =>
                item.title.toLowerCase().includes(searchText.toLowerCase()) &&
                priceMatch(item)
        );
    }, [items, searchText, activeRanges]);

    const totalPages = Math.ceil(
        filteredProducts.length / ITEMS_PER_PAGE
    );

    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;

    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    /* AUTHSLICE SCREENS */

    if (screen === "signup")
        return (
            <>
                <Signup goLogin={() => setScreen("login")} />
                <Popup
                    message={success || error}
                    type={success ? "success" : "error"}
                    onClose={() => {
                        dispatch(clearMessages());
                        if (success) setScreen("login");
                    }}
                />
            </>
        );

    if (screen === "login")
        return (
            <>
                <Login goSignup={() => setScreen("signup")} />
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

    /* CART PAGE */

    if (activePanel === "cart") {
        return (
            <div className="panel-page">
                <h2>Your Cart</h2>

                {cartItems.length === 0 && <p>Cart is empty</p>}

                {cartItems.map(item => (
                    <div key={item.id} className="panel-row">
                        <img src={item.thumbnail} alt="" />
                        <div>
                            <h4>{item.title}</h4>
                            <p>${item.price}</p>

                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={e =>
                                    dispatch(
                                        updateQuantity({
                                            id: item.id,
                                            quantity: Number(e.target.value)
                                        })
                                    )
                                }
                            />

                            <button onClick={() => dispatch(removeFromCart(item.id))}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                <h3>Total: ${cartTotal}</h3>

                <button onClick={() => setActivePanel("home")}>
                    Back
                </button>
            </div>
        );
    }

    /* WISHLIST PAGE */

    if (activePanel === "wishlist") {
        return (
            <div className="panel-page">
                <h2>Your Wishlist</h2>

                {wishlistItems.length === 0 && <p>No wishlist items</p>}

                {wishlistItems.map(item => (
                    <div key={item.id} className="panel-row">
                        <img src={item.thumbnail} alt="" />
                        <div>
                            <h4>{item.title}</h4>
                            <p>${item.price}</p>

                            <button
                                onClick={() => dispatch(removeFromWishlist(item.id))}
                            >
                                Remove
                            </button>

                            <button
                                onClick={() => {
                                    dispatch(removeFromWishlist(item.id));
                                    dispatch(
                                        addToCart({
                                            id: item.id,
                                            title: item.title,
                                            price: item.price,
                                            thumbnail: item.thumbnail
                                        })
                                    );
                                }}
                            >
                                Move to Cart
                            </button>
                        </div>
                    </div>
                ))}

                <button onClick={() => setActivePanel("home")}>
                    Back
                </button>
            </div>
        );
    }

    /* HOME */

    return (
        <>
            <div className="topbar">
                <h2>ECOMMERCE</h2>

                <div className="search-box">
                    <FaSearch />
                    <input
                        placeholder="Search..."
                        value={searchText}
                        onChange={e => {
                            setSearchText(e.target.value);
                            setPageNumber(1);
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px"
                    }}
                >
                    <div
                        onClick={() => setActivePanel("cart")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer"
                        }}
                    >
                        <FaShoppingCart size={18} />
                        <span>{cartCount}</span>
                    </div>

                    <div
                        onClick={() => setActivePanel("wishlist")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer"
                        }}
                    >
                        <FaHeart size={18} />
                        <span>{wishlistItems.length}</span>
                    </div>

                    <button
                        className="logoutBtn"
                        onClick={() => {
                            dispatch(logout());
                            setScreen("signup");
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="layout">
                <div className="sidebar">
                    <h3>Filter by Price</h3>

                    {priceRanges.map(range => (
                        <label key={range.label}>
                            <input
                                type="checkbox"
                                checked={activeRanges.includes(range.label)}
                                onChange={() => {
                                    setPageNumber(1);
                                    setActiveRanges(prev =>
                                        prev.includes(range.label)
                                            ? prev.filter(r => r !== range.label)
                                            : [...prev, range.label]
                                    );
                                }}
                            />
                            ${range.label}
                        </label>
                    ))}
                </div>

                <div className="grid">
                    {paginatedProducts.map(item => (
                        <div key={item.id} className="card">
                            <img src={item.thumbnail} alt="" />
                            <h4>{item.title}</h4>
                            <p>${item.price}</p>

                            <div className="card-actions">
                                <button onClick={() => dispatch(addToCart(item))}>
                                    Add to cart
                                </button>
                                <button onClick={() => dispatch(addToWishlist(item))}>
                                    Wishlist
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pagination">
                <button
                    disabled={pageNumber === 1}
                    onClick={() => setPageNumber(p => p - 1)}
                >
                    Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        className={pageNumber === i + 1 ? "active" : ""}
                        onClick={() => setPageNumber(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={pageNumber === totalPages}
                    onClick={() => setPageNumber(p => p + 1)}
                >
                    Next
                </button>
            </div>
        </>
    );
}

export default App;