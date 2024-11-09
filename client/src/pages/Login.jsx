import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/slices/Authslice';

const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.payload?.token) {
      // Login successful, redirect or handle success
      navigate('/dashboard');
    }
  };

  // ... rest of your component
}; 