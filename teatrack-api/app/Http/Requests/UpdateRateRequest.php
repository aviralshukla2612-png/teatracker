<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'teaRate'    => ['required', 'numeric', 'min:0.01'],
            'coffeeRate' => ['required', 'numeric', 'min:0.01'],
        ];
    }

    public function messages(): array
    {
        return [
            'teaRate.required'    => 'Tea rate is required.',
            'teaRate.numeric'     => 'Tea rate must be a number.',
            'teaRate.min'         => 'Tea rate must be greater than 0.',
            'coffeeRate.required' => 'Coffee rate is required.',
            'coffeeRate.numeric'  => 'Coffee rate must be a number.',
            'coffeeRate.min'      => 'Coffee rate must be greater than 0.',
        ];
    }
}
