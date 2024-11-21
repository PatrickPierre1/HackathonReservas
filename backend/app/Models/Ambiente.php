<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ambiente extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nome',
        'tipo',
        'status',
        'descricao'
    ];

    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }
}
