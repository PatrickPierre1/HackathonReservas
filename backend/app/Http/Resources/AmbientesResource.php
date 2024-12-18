<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AmbientesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'tipo' => $this->tipo,
            'status' => $this->status,
            'descricao' => $this->descricao,
            'capacidade' => $this->capacidade,
            'maquinas_disponiveis' => $this->maquinas_disponiveis,
            'hora_inicio' => $this->hora_inicio,
            'hora_fim' => $this->hora_fim,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
