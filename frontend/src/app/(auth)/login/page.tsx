'use client';

import { SyntheticEvent, useCallback, useRef, useState } from 'react';
import { Loading } from '../../../components/Loading';
import { Toast } from '../../../components/Toast';
import axios from 'axios';
import logo from "../../../../public/images/login.png"
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const router = useRouter();
  const refForm = useRef<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isToast, setIsToast] = useState(false);

  const submitForm = useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();

      // Resetando mensagens de erro
      const emailError = document.getElementById('emailError');
      const senhaError = document.getElementById('senhaError');

      // Validando o formulário
      if (refForm.current.checkValidity()) {
        const target = event.target as typeof event.target & {
          email: { value: string };
          senha: { value: string };
        };

        setIsLoading(true);
        axios
          .post(process.env.NEXT_PUBLIC_API_URL + '/login', {
            email: target.email.value,
            senha: target.senha.value,
          })
          .then((resposta) => {
            const token = resposta.data.token;
            const nome = resposta.data.nome;
            const permissoes = resposta.data.permissoes;
            const permissoesCookie = JSON.stringify(resposta.data.permissoes);
            const usuario_id = resposta.data.usuario_id;

            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString(); // Expira em 7 dias
            document.cookie = `unialfa.permissoes=${permissoesCookie}; expires=${expires}; path=/;`;
            localStorage.setItem('unialfa.token', token);
            localStorage.setItem('unialfa.nome', nome);
            localStorage.setItem('unialfa.permissoes', permissoes);
            localStorage.setItem('unialfa.usuario_id', usuario_id);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            router.push('/');
          })
          .catch((erro) => {
            console.error('Erro ao fazer login:', erro);
            toast.error("Erro ao fazer login. Verifique suas credenciais.");
            setIsLoading(false);
            setIsToast(true);
          });
      } else {
        refForm.current.classList.add('was-validated');

        // Exibe mensagens de erro
        if (!refForm.current.email.checkValidity()) {
          emailError?.classList.remove('hidden');
        }
        if (!refForm.current.senha.checkValidity()) {
          senhaError?.classList.remove('hidden');
        }
      }
    },
    [router]
  );

  return (
    <>
      <Loading visible={isLoading} />
      <Toast message="Credenciais Inválidas" onClose={() => setIsToast(false)} show={isToast} color="danger" />

      <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-50">
        <div className="border-2 border-gray-300 p-6 w-full max-w-md rounded-lg shadow-md bg-white">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between h-16 m-4">
              <Image src={logo} alt="" width={250} />
            </div>
            <p className="text-gray-500 text-lg">Preencha os campos para logar</p>
          </div>
          <hr className="my-4" />

          <form
            className="needs-validation"
            noValidate
            onSubmit={submitForm}
            ref={refForm}
          >
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Digite seu email"
                id="email"
                required
                className="w-full p-3 text-lg rounded border border-gray-300 focus:outline-none focus:border-[#3c89f5]"
              />
              <div id="emailError" className="text-red-500 text-sm mt-1 hidden">
                Por favor, insira seu email
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="senha" className="block text-gray-700 font-medium mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                id="senha"
                required
                className="w-full p-3 text-lg rounded border border-gray-300 focus:outline-none focus:border-[#3c89f5]"
              />
              <div id="senhaError" className="text-red-500 text-sm mt-1 hidden">
                Por favor, insira sua senha
              </div>
            </div>
            <div>
              <button
                type="submit"
                id="botao"
                className="w-full p-3 bg-[#3c89f5] text-white text-lg rounded cursor-pointer hover:bg-[#357acc] transition duration-300 ease-in-out"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
