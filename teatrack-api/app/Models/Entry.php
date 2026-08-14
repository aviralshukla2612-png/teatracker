<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    protected $fillable = [
        'date',
        'tea_quantity',
        'coffee_quantity',
        'total_cups',
        'tea_rate',
        'coffee_rate',
        'tea_expense',
        'coffee_expense',
        'total_expense',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'date'            => 'date',
            'tea_quantity'    => 'integer',
            'coffee_quantity' => 'integer',
            'total_cups'      => 'integer',
            'tea_rate'        => 'decimal:2',
            'coffee_rate'     => 'decimal:2',
            'tea_expense'     => 'decimal:2',
            'coffee_expense'  => 'decimal:2',
            'total_expense'   => 'decimal:2',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
