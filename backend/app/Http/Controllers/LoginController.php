<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        $usuario = Usuario::where('email', $request->email)->first();

        if ($usuario && Hash::check($request->senha, $usuario->senha)) {
            $token = $usuario->createToken('auth_token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'nome' => $usuario->nome,
                'permissoes' => $usuario->permissoes
            ]);
        }

        return response()->json(['message' => 'Credenciais inválidas'], 401);
    }
}
