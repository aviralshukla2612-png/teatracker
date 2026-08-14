<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date'             => ['required', 'date', 'date_format:Y-m-d'],
            'tea_quantity'     => ['required', 'integer', 'min:0'],
            'coffee_quantity'  => ['required', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'date.required'            => 'Date is required.',
            'date.date'                => 'Please provide a valid date.',
            'date.date_format'         => 'Date must be in YYYY-MM-DD format.',
            'tea_quantity.required'    => 'Tea quantity is required.',
            'tea_quantity.integer'     => 'Tea quantity must be a whole number.',
            'tea_quantity.min'         => 'Tea quantity cannot be negative.',
            'coffee_quantity.required' => 'Coffee quantity is required.',
            'coffee_quantity.integer'  => 'Coffee quantity must be a whole number.',
            'coffee_quantity.min'      => 'Coffee quantity cannot be negative.',
        ];
    }
}
