<?php

namespace App\Http\Requests;

use App\Enums\AmbientesStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AmbientesRequest extends FormRequest
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
            'nome' => 'required|string|min:3|max:255',
            'tipo' => 'required|string|min:3|max:255',
            'status' => ['required', Rule::enum(AmbientesStatus::class)],
            'descricao' => 'required|string|min:3',
            'capacidade' => 'required|integer',
            'maquinas_disponiveis' => 'nullable|integer',
            'hora_inicio' => 'required|date_format:H:i:s',
            'hora_fim' => 'required|date_format:H:i:s|after:hora_inicio'
        ];

        if ($this->method() === 'PATCH' || $this->method() === 'PUT') {
            $rules = [
                'nome' => 'nullable|string|min:3|max:255',
                'tipo' => 'nullable|string|min:3|max:255',
                'status' => ['nullable', Rule::enum(AmbientesStatus::class)],
                'descricao' => 'nullable|string|min:3',
                'capacidade' => 'nullable|integer',
                'maquinas_disponiveis' => 'nullable|integer',
                'hora_inicio' => 'nullable|date_format:H:i:s',
                'hora_fim' => 'nullable|date_format:H:i:s|after:hora_inicio'
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
            'min' => 'Esse campo deve conter no mínimo :min caracteres',
            'max' => 'Esse campo deve conter no máximo :max caracteres',
            'integer' => 'Esse campo deve ser um número inteiro',
            'date_format' => 'Formato de horário inválido',
            'after' => 'Horário final não pode ser menor do que o inicial'
        ];
    }
}
