import { UsuarioPerfil } from '../types';

export interface UsuarioModel {
  uid: string;
  email: string;
  cpf: string;
  nome_completo: string;
  nome_exibicao: string;
  imagem_url: string;
  perfil: UsuarioPerfil;
  ativo: boolean;
}
