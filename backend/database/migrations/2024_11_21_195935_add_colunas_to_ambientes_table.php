<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ambientes', function (Blueprint $table) {
            $table->integer('capacidade');
            $table->integer('maquinas_disponiveis')->default(0);
            $table->time('hora_inicio');
            $table->time('hora_fim');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ambientes', function (Blueprint $table) {
            $table->dropColumn('capacidade');
            $table->dropColumn('maquinas_disponiveis');
            $table->dropColumn('hora_inicio');
            $table->dropColumn('hora_fim');
        });
    }
};
