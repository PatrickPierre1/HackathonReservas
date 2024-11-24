<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservasResource extends JsonResource
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
            'usuario_id' => $this->usuario_id,
            'ambiente_id' => $this->ambiente_id,
            'data_hora_inicio' => $this->data_hora_inicio,
            'data_hora_fim' => $this->data_hora_fim,
            'status' => $this->status,
            'usuario' => $this->usuario,
            'ambiente' => $this->ambiente,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
