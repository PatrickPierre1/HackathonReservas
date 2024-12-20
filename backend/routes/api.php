<?php

use App\Http\Controllers\AmbientesController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ReservasController;
use App\Http\Controllers\UsuariosController;
use App\Http\Middleware\JsonRequestMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificacaoController;
use App\Http\Controllers\HistoricoReservaController;

Route::post('login', [LoginController::class, 'login'])->name('login');

Route::middleware(['auth:sanctum', JsonRequestMiddleware::class])->group(function () {
    Route::apiResource('usuarios', UsuariosController::class);
    Route::apiResource('ambientes', AmbientesController::class);
    Route::apiResource('reservas', ReservasController::class);
    Route::apiResource('notificacoes', NotificacaoController::class);
    Route::resource('historico-reservas', HistoricoReservaController::class);

});
