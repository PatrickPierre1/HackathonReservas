<?php

namespace App\Http\Controllers;

use App\Models\HistoricoReserva;
use Illuminate\Http\Request;
class HistoricoReservaController extends Controller
{
    public function index()
    {
        $historicos = HistoricoReserva::with('reserva')->get();
        return response()->json($historicos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'alteracoes' => 'required|string'
        ]);

        $historico = HistoricoReserva::create($request->all());

        return response()->json([
            'message' => 'Histórico criado com sucesso!',
            'data' => $historico
        ], 201);
    }

    public function show($id)
    {
        $historico = HistoricoReserva::with('reserva')->FindOrFail($id);
        return response()->json($historico);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'alteracoes' => 'sometimes|required|string'
        ]);

        $historico = HistoricoReserva::findOrFail($id);
        $historico->update($request->all());

        return response()->json([
            'message'=> 'Histórico atualizado com sucesso!',
            'data' => $historico
        ]);
    }

    public function destroy($id)
    {
        $historico = HistoricoReserva::findOrFail($id);
        $historico->delete();

        return response()->json(['message' => 'Histórido removido com sucesso!']);
    }
}
