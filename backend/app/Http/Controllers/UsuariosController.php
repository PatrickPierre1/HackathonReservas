<?php

namespace App\Http\Controllers;

use App\Http\Requests\UsuariosRequest;
use App\Http\Resources\UsuariosResource;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuariosController extends Controller
{
    public function index()
    {
        return UsuariosResource::collection(Usuario::all());
    }

    public function store(UsuariosRequest $request)
    {
        $usuario = Usuario::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'senha' => Hash::make($request->senha),
            'permissoes' => $request->permissoes
        ]);

        return new UsuariosResource($usuario);
    }

    public function show(Usuario $usuario)
    {
        return new UsuariosResource($usuario);
    }

    public function update(UsuariosRequest $request, Usuario $usuario)
    {
        $usuario->update($request->only(['nome', 'email', 'permissoes']));

        if ($request->senha) {
            $usuario->senha = Hash::make($request->senha);
            $usuario->save();
        }

        return new UsuariosResource($usuario);
    }

    public function destroy(Usuario $usuario)
    {
        $usuario->delete();
        
        return response()->json(['message' => 'Usuário deletado com sucesso']);
    }
}
