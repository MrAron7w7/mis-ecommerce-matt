import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-sm border">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Completa el formulario para registrarte</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
