import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import React, { useState } from 'react';
import './styles.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookList from './pages/BookList';
import BookView from './pages/BookView';
import BookCreate from './pages/BookCreate';
import BookEdit from './pages/BookEdit';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import ItemCreate from './pages/ItemCreate';
import Orders from './pages/Orders';
import Reports from './pages/Reports';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Checkout from './pages/Checkout';
import CategoryBooks from './pages/CategoryBooks';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  // يمكنك تغيير currentPage لعرض صفحات مختلفة
  // الخيارات: 'home', 'login', 'register', 'dashboard', 'books', 'view', 'create', 'edit', 'details'
  // const [currentPage, setCurrentPage] = useState('home');

  // const renderPage = () => {
  //   switch(currentPage) {
  //     case 'home':
  //       return <Home />;
  //     case 'login':
  //       return <Login />;
  //     case 'register':
  //       return <Register />;
  //     case 'dashboard':
  //       return <Dashboard />;
  //     case 'books':
  //       return <BookList />;
  //     case 'view':
  //       return <BookView />;
  //     case 'create':
  //       return <BookCreate />;
  //     case 'edit':
  //       return <BookEdit />;
  //     case 'details':
  //       return <BookDetails />;
  //     default:
  //       return <Home />;
  //   }
  // };

  return (
    <div className="App">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookView />} />
        <Route path="/books/create" element={<BookCreate />} />
        <Route path="/books/edit/:id" element={<BookEdit />} />
        <Route path="/books/details/:id" element={<BookDetails />} />
        <Route path="/categories/:category" element={<CategoryBooks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/itemcreate" element={<ItemCreate />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

      </Routes>
    </div>
  );
}

export default App;
