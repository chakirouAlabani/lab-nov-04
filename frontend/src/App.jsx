import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UsersPage from './pages/users/UsersPage';
import CreateUserPage from './pages/users/CreateUserPage';
import EditUser from './pages/users/EditUser';
import UserDetails from './pages/users/UserDetails';
import ProductsPage from './pages/products/ProductsPage';
import CreateProductPage from './pages/products/CreateProductPage';
import EditProduct from './pages/products/EditProduct';
import ProductDetails from './pages/products/ProductDetails';
import OrdersPage from './pages/orders/OrdersPage';
import CreateOrderPage from './pages/orders/CreateOrderPage';
import EditOrder from './pages/orders/EditOrder';
import OrderDetails from './pages/orders/OrderDetails';

function App() {
  const [activeView, setActiveView] = useState('home');
  const [usersView, setUsersView] = useState('list');
  const [productsView, setProductsView] = useState('list');
  const [ordersView, setOrdersView] = useState('list');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  const resetUserState = () => {
    setUsersView('list');
    setSelectedUserId(null);
    setEditingUser(null);
  };

  const resetProductState = () => {
    setProductsView('list');
    setSelectedProductId(null);
    setEditingProduct(null);
  };

  const resetOrderState = () => {
    setOrdersView('list');
    setSelectedOrderId(null);
    setEditingOrder(null);
  };

  const renderView = () => {
    if (activeView === 'users') {
      if (usersView === 'create') {
        return <CreateUserPage onBack={resetUserState} onCreated={() => { resetUserState(); setActiveView('users'); }} />;
      }
      if (selectedUserId) {
        return <UserDetails userId={selectedUserId} onBack={() => { setSelectedUserId(null); setUsersView('list'); }} />;
      }
      if (editingUser) {
        return <EditUser user={editingUser} onCancel={() => setEditingUser(null)} onUpdated={() => { setEditingUser(null); setUsersView('list'); }} />;
      }
      return <UsersPage onSwitchView={setUsersView} onViewUser={(id) => { setSelectedUserId(id); setUsersView('details'); }} onEditUser={(user) => setEditingUser(user)} onCreateUser={() => setUsersView('create')} />;
    }

    if (activeView === 'products') {
      if (productsView === 'create') {
        return <CreateProductPage onBack={resetProductState} onCreated={() => { resetProductState(); setActiveView('products'); }} />;
      }
      if (selectedProductId) {
        return <ProductDetails productId={selectedProductId} onBack={() => { setSelectedProductId(null); setProductsView('list'); }} />;
      }
      if (editingProduct) {
        return <EditProduct product={editingProduct} onCancel={() => setEditingProduct(null)} onUpdated={() => { setEditingProduct(null); setProductsView('list'); }} />;
      }
      return <ProductsPage onSwitchView={setProductsView} onViewProduct={(id) => { setSelectedProductId(id); setProductsView('details'); }} onEditProduct={(product) => setEditingProduct(product)} onCreateProduct={() => setProductsView('create')} />;
    }

    if (activeView === 'orders') {
      if (ordersView === 'create') {
        return <CreateOrderPage onBack={resetOrderState} onCreated={() => { resetOrderState(); setActiveView('orders'); }} />;
      }
      if (selectedOrderId) {
        return <OrderDetails orderId={selectedOrderId} onBack={() => { setSelectedOrderId(null); setOrdersView('list'); }} />;
      }
      if (editingOrder) {
        return <EditOrder order={editingOrder} onCancel={() => setEditingOrder(null)} onUpdated={() => { setEditingOrder(null); setOrdersView('list'); }} />;
      }
      return <OrdersPage onSwitchView={setOrdersView} onViewOrder={(id) => { setSelectedOrderId(id); setOrdersView('details'); }} onEditOrder={(order) => setEditingOrder(order)} onCreateOrder={() => setOrdersView('create')} />;
    }

    return <Home onNavigate={setActiveView} />;
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#faf7f0_0%,#f4efe6_55%,#ebe1d2_100%)] text-slate-800">
      <Navbar activeView={activeView} onNavigate={(view) => { setActiveView(view); resetUserState(); resetProductState(); resetOrderState(); }} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
