<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservasRequest;
use App\Http\Resources\ReservasResource;
use App\Models\Reserva;

class ReservasController extends Controller
{
    public function index()
    {
        return ReservasResource::collection(Reserva::all());
    }

    public function store(ReservasRequest $request)
    {
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
