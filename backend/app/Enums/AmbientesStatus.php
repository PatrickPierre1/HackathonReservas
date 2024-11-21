<?php

namespace App\Enums;

enum AmbientesStatus: int {
    case DISPONIVEL = 1;
    case RESERVADO = 2;
    case MANUTENCAO = 3;
}