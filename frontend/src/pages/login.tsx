import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const StarOfDavid = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L18.5 13H5.5L12 2Z" />
    <path d="M12 22L5.5 11H18.5L12 22Z" fillOpacity="0.8" />
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@shalom.com', password: 'admin' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data;

      setAuth(user, accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      toast.success('Bem-vindo de volta!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 bg-card p-10 rounded-3xl border shadow-xl"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-xl mb-2">
            <StarOfDavid className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">
            Igreja Batista <span className="text-primary">Shalom</span>
          </h1>
          <p className="text-muted-foreground">Bem-vindo de volta à sua comunidade</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                {...register('email')}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  errors.email && "border-destructive focus-visible:ring-destructive"
                )}
                placeholder="admin@shalom.com"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                {...register('password')}
                type="password"
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  errors.password && "border-destructive focus-visible:ring-destructive"
                )}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full shadow-lg transition-all active:scale-95 disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          admin@shalom.com · senha: admin
        </p>
      </motion.div>
    </div>
  );
}
