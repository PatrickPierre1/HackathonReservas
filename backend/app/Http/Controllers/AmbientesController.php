<?php

namespace App\Http\Controllers;

use App\Http\Requests\AmbientesRequest;
use App\Http\Resources\AmbientesResource;
use App\Models\Ambiente;
use Illuminate\Http\Request;

class AmbientesController extends Controller
{
    public function index(Request $request)
    {
        if ($request->status) {
            return AmbientesResource::collection(Ambiente::where('status', $request->status)->get());
        }

        return AmbientesResource::collection(Ambiente::all());
    }

    public function store(AmbientesRequest $request)
    {
        $ambiente = Ambiente::create($request->validated());

        return new AmbientesResource($ambiente); 
    }

    public function show(Ambiente $ambiente)
    {
        return new AmbientesResource($ambiente);
    }

    public function update(AmbientesRequest $request, Ambiente $ambiente)
    {
        $ambiente->update($request->validated());

        return new AmbientesResource($ambiente);
    }

    public function destroy(Ambiente $ambiente)
    {
        $ambiente->delete();

        return response()->json(['message' => 'Ambiente deletado com sucesso']);
    }
}
