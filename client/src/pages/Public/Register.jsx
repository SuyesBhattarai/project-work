import RegisterLeftPanel from '../../components/auth/RegisterLeftPanel';
import RegisterForm from '../../components/auth/RegisterForm';
import '../../css/register.css';

const Register = () => {
  return (
    <div className="register-page">
      <RegisterLeftPanel />
      <div className="register-right">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;