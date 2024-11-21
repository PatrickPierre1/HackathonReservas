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
        ]);
        
        Ambiente::create([
            'nome' => 'Biblioteca',
            'tipo' => 'Biblioteca',
            'status' => 1,
            'descricao' => 'Biblioteca para estudos',
        ]);

        Ambiente::create([
            'nome' => 'Laboratório 1',
            'tipo' => 'Laboratório',
            'status' => 1,
            'descricao' => 'Laboratório de informática',
        ]);

        Ambiente::create([
            'nome' => 'Cantina',
            'tipo' => 'Refeitório',
            'status' => 3,
            'descricao' => 'Cantina dentro do refeitório',
        ]);

        Ambiente::create([
            'nome' => 'Auditório',
            'tipo' => 'Grande Porte',
            'status' => 3,
            'descricao' => 'Auditório com capacidade para 200 pessoas',
        ]);
    }
}
