<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservasRequest;
use App\Http\Resources\ReservasResource;
use App\Models\Ambiente;
use App\Models\HistoricoReserva;
use App\Models\Reserva;
use Illuminate\Http\Request;

class ReservasController extends Controller
{
    public function index(Request $request)
    {

        $reservas = Reserva::with('usuario')->with('ambiente');

        if ($request->usuario_id) {
            return ReservasResource::collection($reservas->where('usuario_id', $request->usuario_id)->get());
        }

        return ReservasResource::collection($reservas->get());
    }

    public function store(ReservasRequest $request)
    {
        $mensagemConflito = $this->validaConflito($request);

        if ($mensagemConflito) {
            return response()->json(['mensagem' => $mensagemConflito], 422);
        }

        $reserva = Reserva::create($request->validated());

        HistoricoReserva::create([
            'reserva_id' => $reserva->id,
            'alteracoes' => "Reserva adicionada " . now()
        ]);

        return new ReservasResource($reserva);
    }

    public function show(Reserva $reserva)
    {
        return new ReservasResource($reserva);
    }

    public function update(ReservasRequest $request, Reserva $reserva)
    {
        $mensagemConflito = $this->validaConflito($request, $reserva->id);

        if ($mensagemConflito) {
            return response()->json(['mensagem' => $mensagemConflito], 422);
        }

        $reserva->update($request->validated());

        $historicoReserva = HistoricoReserva::where('reserva_id', $reserva->id);

        if ($historicoReserva) {
            $historicoReserva->update([
                'alteracoes' => "Reserva alterada " . now()
            ]);
        }

        return new ReservasResource($reserva);
    }

    public function destroy(Reserva $reserva)
    {
        if ($reserva->historico) {
            $reserva->historico->delete();
        }

        $reserva->delete();

        return response()->json(['message' => 'Reserva deletada com sucesso']); 
    }

    private function validaConflito(ReservasRequest $request, $reserva_id = null)
    {
        $ambiente = Ambiente::find($request->ambiente_id);

        if (date("H:i:s", strtotime($request->data_hora_inicio)) < $ambiente->hora_inicio || 
            date("H:i:s", strtotime($request->data_hora_fim)) > $ambiente->hora_fim
        ) {
            return "O horário da reserva está fora do expediente do ambiente";
        }

        $conflito = Reserva::where('ambiente_id', $request->ambiente_id)
        ->where('status', 1)
        ->where('id', '!=', $reserva_id)
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
            return "Já existe uma reserva com o horário desejado";
        }

        return $conflito;
    }
}