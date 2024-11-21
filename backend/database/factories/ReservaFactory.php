<?php

namespace Database\Factories;

use App\Models\Ambiente;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reserva>
 */
class ReservaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'usuario_id' => Usuario::inRandomOrder()->first()->id,
            'ambiente_id' => Ambiente::where('status', 1)->inRandomOrder()->first()->id,
            'data_hora_inicio' => $this->faker->dateTimeBetween('now', '+1 week'),
            'data_hora_fim' => $this->faker->dateTimeBetween('+1 week', '+2 weeks'),
            'status' => $this->faker->randomElement([1, 2]),
        ];
    }
}
