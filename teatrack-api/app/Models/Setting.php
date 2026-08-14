<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'tea_rate',
        'coffee_rate',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'tea_rate'    => 'decimal:2',
            'coffee_rate' => 'decimal:2',
        ];
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get the single active settings record.
     */
    public static function current(): ?self
    {
        return static::latest()->first();
    }
}
