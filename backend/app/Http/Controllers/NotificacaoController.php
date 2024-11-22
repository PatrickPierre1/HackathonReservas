<?php

namespace App\Http\Controllers;

use App\Models\Notificacao;
use Illuminate\Http\Request;

class NotificacaoController extends Controller
{

    public function index()
    {
        return response()->json(Notificacao::all(), 200);
    }

    public function show($id)
    {
        $notificacao = Notificacao::find($id);

        if (!$notificacao) {
            return response()->json(['message' => 'Notificação não encontrada'], 404);
        }

        return response()->json($notificacao, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'usuario_id' => 'required|exists:usuarios,id',
            'mensagem' => 'required|string',
            'tipo' => 'required|string',
        ]);

        $notificacao = Notificacao::create($validated);

        return response()->json($notificacao, 201);
    }

    public function update(Request $request, $id)
    {
        $notificacao = Notificacao::find($id);

        if (!$notificacao) {
            return response()->json(['message' => 'Notificação não encontrada'], 404);
        }

        $validated = $request->validate([
            'usuario_id' => 'sometimes|exists:usuarios,id',
            'mensagem' => 'sometimes|string',
            'tipo' => 'sometimes|string',
        ]);

        $notificacao->update($validated);

        return response()->json($notificacao, 200);
    }

    public function destroy($id)
    {
        $notificacao = Notificacao::find($id);

        if (!$notificacao) {
            return response()->json(['message' => 'Notificação não encontrada'], 404);
        }

        $notificacao->delete();

        return response()->json(['message' => 'Notificação removida com sucesso'], 200);
    }
}
