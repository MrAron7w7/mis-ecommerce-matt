// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-sm border">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Bienvenido de vuelta</h1>
          <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
