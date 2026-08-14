<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date'            => ['sometimes', 'date', 'date_format:Y-m-d'],
            'tea_quantity'    => ['sometimes', 'integer', 'min:0'],
            'coffee_quantity' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
