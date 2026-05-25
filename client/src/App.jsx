import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BusinessProfile from './pages/BusinessProfile';
import AddBusiness from './pages/AddBusiness';
import EditBusiness from './pages/EditBusiness';
import AddProduct from './pages/AddProduct';
import SearchResults from './pages/SearchResults';
import Promotions from './pages/Promotions';
import Inquiries from './pages/Inquiries';
import AdminPanel from './pages/AdminPanel';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

const App = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:py-8">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/businesses/:id" element={<BusinessProfile />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route element={<ProtectedRoute roles={['owner', 'admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/business/add" element={<AddBusiness />} />
          <Route path="/business/edit/:id" element={<EditBusiness />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/inquiries" element={<Inquiries />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;
