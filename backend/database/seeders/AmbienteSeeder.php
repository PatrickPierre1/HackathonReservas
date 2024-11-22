<?php

namespace Database\Seeders;

use App\Models\Ambiente;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AmbienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Ambiente::create([
            'nome' => 'AlphaLab',
            'tipo' => 'Laboratório',
            'status' => 1,
            'descricao' => 'Laboratório de inovação',
            'capacidade' => 50,
            'maquinas_disponiveis' => 40,
            'hora_inicio' => '08:00:00',
            'hora_fim' => '18:00:00'
        ]);
        
        Ambiente::create([
            'nome' => 'Biblioteca',
            'tipo' => 'Biblioteca',
            'status' => 1,
            'descricao' => 'Biblioteca para estudos',
            'capacidade' => 100,
            'maquinas_disponiveis' => 0,
            'hora_inicio' => '17:00:00',
            'hora_fim' => '22:00:00'
        ]);

        Ambiente::create([
            'nome' => 'Laboratório 1',
            'tipo' => 'Laboratório',
            'status' => 1,
            'descricao' => 'Laboratório de informática',
            'capacidade' => 40,
            'maquinas_disponiveis' => 0,
            'hora_inicio' => '08:00:00',
            'hora_fim' => '20:00:00'
        ]);

        Ambiente::create([
            'nome' => 'Cantina',
            'tipo' => 'Refeitório',
            'status' => 3,
            'descricao' => 'Cantina dentro do refeitório',
            'capacidade' => 200,
            'maquinas_disponiveis' => 0,
            'hora_inicio' => '12:00:00',
            'hora_fim' => '20:00:00'
        ]);

        Ambiente::create([
            'nome' => 'Auditório',
            'tipo' => 'Grande Porte',
            'status' => 3,
            'descricao' => 'Auditório com capacidade para 200 pessoas',
            'capacidade' => 400,
            'maquinas_disponiveis' => 0,
            'hora_inicio' => '13:00:00',
            'hora_fim' => '21:00:00'
        ]);
    }
}
