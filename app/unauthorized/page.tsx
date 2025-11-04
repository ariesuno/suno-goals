import Image from 'next/image';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/Suno Positivo.svg"
            alt="Suno"
            width={150}
            height={50}
            priority
          />
        </div>

        {/* Card */}
        <div className="bg-white border border-neutral-2 rounded-xl shadow-sm p-6 md:p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-suno-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="font-display font-bold text-2xl text-neutral-10 mb-2">
            Acesso Negado
          </h1>
          <p className="text-neutral-8 text-sm mb-6">
            Você não tem permissão para acessar esta área. Esta página é restrita aos administradores do FP&A.
          </p>

          <Link
            href="/"
            className="inline-block bg-suno-red text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar para Home
          </Link>
        </div>

        <p className="text-center text-xs text-neutral-5 mt-6">
          Suno Goals © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

