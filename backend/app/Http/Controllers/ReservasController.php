<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservasRequest;
use App\Http\Resources\ReservasResource;
use App\Models\Ambiente;
use App\Models\Reserva;

class ReservasController extends Controller
{
    public function index()
    {
        return ReservasResource::collection(Reserva::all());
    }

    public function store(ReservasRequest $request)
    {
        $ambiente = Ambiente::find($request->ambiente_id);

        if (date("H:i:s", strtotime($request->data_hora_inicio)) < $ambiente->hora_inicio || 
            date("H:i:s", strtotime($request->data_hora_fim)) > $ambiente->hora_fim
        ) {
            return response()->json(['mensagem' => 'O horário da reserva está fora do expediente do ambiente'], 422);
        }

        $conflito = Reserva::where('ambiente_id', $request->ambiente_id)
        ->where('status', 1)
        ->where(function ($query) use ($request) {
            $query->where(function ($query) use ($request) {
                $query->where('data_hora_inicio', '<', $request->data_hora_inicio)
                      ->where('data_hora_fim', '>', $request->data_hora_fim);
            })
            ->orWhere(function ($query) use ($request) {
                $query->where('data_hora_inicio', '>=', $request->data_hora_inicio)
                      ->where('data_hora_inicio', '<', $request->data_hora_fim);
            })
            ->orWhere(function ($query) use ($request) {
                $query->where('data_hora_fim', '>', $request->data_hora_inicio)
                      ->where('data_hora_fim', '<=', $request->data_hora_fim);
            });
        })
        ->exists();

        if ($conflito) {
            return response()->json(['mensagem' => 'Já existe uma reserva com o horário desejado'], 422);
        }

        $reserva = Reserva::create($request->validated());

        return new ReservasResource($reserva);
    }

    public function show(Reserva $reserva)
    {
        return new ReservasResource($reserva);
    }

    public function update(ReservasRequest $request, Reserva $reserva)
    {
        $reserva->update($request->validated());

        return new ReservasResource($reserva);
    }

    public function destroy(Reserva $reserva)
    {
        $reserva->delete();

        return response()->json(['message' => 'Reserva deletada com sucesso']); 
    }
}
