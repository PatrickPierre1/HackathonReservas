<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoricoReserva extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'historico_reservas';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'reserva_id',
        'alteracoes',
    ];

    /**
     * Get the reserva associated with the historico.
     */
    public function reserva()
    {
        return $this->belongsTo(Reserva::class);
    }
}
