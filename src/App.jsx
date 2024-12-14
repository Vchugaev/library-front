import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Settings from './Settings';
import Publish from './Publish';
import Book from './Book';
import EditBook from './components/EditBook.jsx';
import Bookmarks from './Bookmarks.jsx';
import Notifications from './notifications.jsx';
import CategoryBooks from './components/CategoryBooks.jsx';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/notifications",
          element: <Notifications />,
        },
        {
          path: "/bookmarks",
          element: <Bookmarks />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/publish",
          element: <Publish />,
        },
        {
          path: "/book/:bookId",
          element: <Book />,
        },
        {
          path: "/edit/:bookId",
          element: <EditBook />,
        },
        {
          path: "/category/:categoryId",
          element: <CategoryBooks />,
        }
        
      ],
    },
  ], {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      v7_startTransition: true,
      }
  }
);

  return <RouterProvider
    future={{
      v7_startTransition: true,
    }}
    router={router} />;
}

export default App;
