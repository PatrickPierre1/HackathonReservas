<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UsuariosRequest extends FormRequest
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
            'email' => 'required|email|unique:users,email',
            'senha' => 'required|string|min:8',
        ];

        if ($this->method() === 'PATCH' || $this->method() === 'PUT') {
            $rules = [
                'nome' => 'nullable|string|min:3|max:255',
                'email' => 'nullable|email|unique:users,email,' . $this->usuario->id,
                'senha' => 'nullable|string|min:8',
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
            'email' => 'Esse campo deve ser um email válido',
            'unique' => 'Esse email já está em uso'
        ];
    }
}
