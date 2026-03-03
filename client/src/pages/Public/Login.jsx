import LoginLeftPanel from '../../components/auth/LoginLeftPanel';
import LoginForm from '../../components/auth/LoginForm';
import '../../css/login.css';

const Login = () => {
  return (
    <div className="login-page">
      <LoginLeftPanel />
      <div className="login-right">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;