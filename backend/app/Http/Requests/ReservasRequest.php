<?php

namespace App\Http\Requests;

use App\Enums\ReservasStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReservasRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'usuario_id' => 'required|integer',
            'ambiente_id' => 'required|integer',
            'data_hora_inicio' => 'required|date',
            'data_hora_fim' => 'required|date|after:data_hora_inicio',
            'status' => ['required', Rule::enum(ReservasStatus::class)]
        ];

        if ($this->method() === 'PATCH' || $this->method() === 'PUT') {
            $rules = [
                'usuario_id' => 'nullable|integer',
                'ambiente_id' => 'nullable|integer',
                'data_hora_inicio' => 'nullable|date',
                'data_hora_fim' => 'nullable|date|after:data_hora_inicio',
                'status' => ['nullable', Rule::enum(ReservasStatus::class)]
            ];
        }

        return $rules;
    }

    /**
     * Custom error messages for validation.
     */
    public function messages(): array
    {
        return [
            'required' => 'Esse campo é obrigatório',
            'integer' => 'Esse campo deve ser um número inteiro',
            'date' => 'Esse campo deve ser uma data válida',
            'after' => 'Horário final não pode ser menor do que o inicial'
        ];
    }
}
